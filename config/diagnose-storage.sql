-- Diagnóstico e correção do Supabase Storage
-- Execute este script no Supabase Dashboard > SQL Editor

-- 1. Verificar se o bucket existe e está público
SELECT 
    id,
    name, 
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'room-images';

-- 2. Se não existir, criar o bucket público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'room-images', 
    'room-images', 
    true,
    52428800,  -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 3. Remover todas as políticas existentes para recomeçar
DROP POLICY IF EXISTS "Allow public read access on room-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to room-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on room-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on room-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to room-images" ON storage.objects;

-- 4. Criar política simples para acesso completo público ao bucket room-images
CREATE POLICY "Public Access to room-images" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'room-images');

-- 5. Verificar se o bucket foi criado corretamente
SELECT 
    id,
    name, 
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'room-images';

-- 6. Verificar se as políticas estão ativas
SELECT 
    policyname, 
    permissive,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname = 'Public Access to room-images';
