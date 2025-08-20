-- Script alternativo: Apenas verificar se o bucket e políticas existem
-- Execute no Supabase SQL Editor se já configurou o storage antes

-- Verificar se o bucket existe
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'room-images';

-- Verificar políticas existentes para o bucket room-images
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%room-images%';

-- Se o bucket não existir, execute apenas este comando:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('room-images', 'room-images', true);

-- Se as políticas não existirem, execute apenas estas:
/*
CREATE POLICY "Allow public read access on room-images" ON storage.objects FOR SELECT USING (bucket_id = 'room-images');
CREATE POLICY "Allow public upload to room-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'room-images');
CREATE POLICY "Allow public update on room-images" ON storage.objects FOR UPDATE USING (bucket_id = 'room-images');
CREATE POLICY "Allow public delete on room-images" ON storage.objects FOR DELETE USING (bucket_id = 'room-images');
*/
