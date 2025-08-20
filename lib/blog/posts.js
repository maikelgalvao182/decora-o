import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Recursively collect markdown files returning relative paths from postsDirectory
function collectMarkdownFiles(dir, baseDir = postsDirectory) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // ignore hidden
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relPath = path.relative(baseDir, fullPath); // e.g. decoracao/cozinha/post.md
      files.push(relPath);
    }
  }
  return files;
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  const relativeFiles = collectMarkdownFiles(postsDirectory); // includes nested paths
  const allPostsData = relativeFiles.map((relPath) => {
    const slug = relPath.replace(/\.md$/, '').split(path.sep).join('/'); // force posix style for URLs
    const fullPath = path.join(postsDirectory, relPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const pathParts = slug.split('/');
    const categories = data.categories || pathParts.slice(0, -1); // everything except filename
    const category = categories[0] || null;
    const subcategory = categories[1] || null;

    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      slug, // e.g. decoracao/cozinha/post
      title: data.title || 'Sem título',
      description: data.description || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      image: data.image || null,
      tags: data.tags || [],
      categories,
      category,
      subcategory,
      content,
      readingTime,
      ...data,
    };
  });

  return allPostsData.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostBySlug(slug) {
  try {
    // slug may contain forward slashes; translate to OS path
    const safeSlug = Array.isArray(slug) ? slug.join('/') : slug;
    const fullPath = path.join(postsDirectory, safeSlug + '.md');
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const pathParts = safeSlug.split('/');
    const categories = data.categories || pathParts.slice(0, -1);
    const category = categories[0] || null;
    const subcategory = categories[1] || null;
    return {
      slug: safeSlug,
      title: data.title || 'Sem título',
      description: data.description || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      image: data.image || null,
      tags: data.tags || [],
      categories,
      category,
      subcategory,
      readingTime: data.readingTime || calculateReadingTime(content),
      content,
      ...data,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllSlugs() {
  try {
    if (!fs.existsSync(postsDirectory)) return [];
    return collectMarkdownFiles(postsDirectory).map(rel => rel.replace(/\.md$/, '').split(path.sep).join('/'));
  } catch (error) {
    console.error('Error getting slugs:', error);
    return [];
  }
}

// For Next.js catch-all static params
export function getAllSlugParamArrays() {
  return getAllSlugs().map(slug => ({ slug: slug.split('/') }));
}

export function getAllCategories() {
  const posts = getAllPosts();
  const set = new Set();
  posts.forEach(p => {
    (p.categories || []).forEach(c => set.add(c));
  });
  return Array.from(set).sort();
}

export function getPostsByCategory(category, subcategory = null) {
  const posts = getAllPosts();
  return posts.filter(p => {
    if (subcategory) return p.category === category && p.subcategory === subcategory;
    return p.category === category;
  });
}
