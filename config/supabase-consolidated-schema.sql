-- SCHEMA CONSOLIDADO E POLÍTICAS RLS
-- Execute este arquivo completo no Supabase SQL Editor
-- Este arquivo substitui todos os outros arquivos SQL e remove duplicações

-- ===========================================
-- 1. CRIAÇÃO DAS TABELAS
-- ===========================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    image_url VARCHAR NOT NULL,
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela de imagens geradas por IA
CREATE TABLE IF NOT EXISTS ai_generated_image (
    id SERIAL PRIMARY KEY,
    room_type VARCHAR NOT NULL,
    design_type VARCHAR NOT NULL,
    org_image VARCHAR NOT NULL,
    ai_image VARCHAR NOT NULL,
    user_email VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabela para controle de compras (Stripe sessions)
CREATE TABLE IF NOT EXISTS purchased_sessions (
    id TEXT PRIMARY KEY, -- stripe checkout session id
    user_email TEXT NOT NULL,
    credits_added INTEGER NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ===========================================
-- 2. TRIGGERS PARA UPDATED_AT
-- ===========================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_generated_image_updated_at ON ai_generated_image;
CREATE TRIGGER update_ai_generated_image_updated_at BEFORE UPDATE ON ai_generated_image
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_image ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_sessions ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 4. LIMPAR POLÍTICAS ANTIGAS
-- ===========================================

-- Remover políticas antigas da tabela users
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow public read access" ON users;
DROP POLICY IF EXISTS "Allow public insert" ON users;
DROP POLICY IF EXISTS "Allow public update" ON users;

-- Remover políticas antigas da tabela ai_generated_image
DROP POLICY IF EXISTS "Users can view own images" ON ai_generated_image;
DROP POLICY IF EXISTS "Users can insert own images" ON ai_generated_image;
DROP POLICY IF EXISTS "Users can update own images" ON ai_generated_image;
DROP POLICY IF EXISTS "Allow public read access" ON ai_generated_image;
DROP POLICY IF EXISTS "Allow public insert" ON ai_generated_image;
DROP POLICY IF EXISTS "Allow public update" ON ai_generated_image;

-- Remover políticas antigas da tabela purchased_sessions
DROP POLICY IF EXISTS "Users can view own purchases" ON purchased_sessions;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchased_sessions;
DROP POLICY IF EXISTS "Users can update own purchases" ON purchased_sessions;
DROP POLICY IF EXISTS "Service role can manage all purchases" ON purchased_sessions;
DROP POLICY IF EXISTS "Service role can insert purchases" ON purchased_sessions;
DROP POLICY IF EXISTS "Service role can update purchases" ON purchased_sessions;

-- ===========================================
-- 5. POLÍTICAS SEGURAS PARA TABELA USERS
-- ===========================================

-- Permitir acesso público para leitura (já que estamos usando Clerk para autenticação)
CREATE POLICY "Allow public read access" ON users
    FOR SELECT USING (true);

-- Permitir inserção pública (controle de acesso feito pela aplicação)
CREATE POLICY "Allow public insert" ON users
    FOR INSERT WITH CHECK (true);

-- Permitir atualização pública (controle de acesso feito pela aplicação)
CREATE POLICY "Allow public update" ON users
    FOR UPDATE USING (true);

-- ===========================================
-- 6. POLÍTICAS SEGURAS PARA AI_GENERATED_IMAGE
-- ===========================================

-- Permitir acesso público para leitura (já que estamos usando Clerk para autenticação)
CREATE POLICY "Allow public read access" ON ai_generated_image
    FOR SELECT USING (true);

-- Permitir inserção pública (controle de acesso feito pela aplicação)
CREATE POLICY "Allow public insert" ON ai_generated_image
    FOR INSERT WITH CHECK (true);

-- Permitir atualização pública (controle de acesso feito pela aplicação)
CREATE POLICY "Allow public update" ON ai_generated_image
    FOR UPDATE USING (true);

-- ===========================================
-- 7. POLÍTICAS SEGURAS PARA PURCHASED_SESSIONS
-- ===========================================

-- Usuários podem ver apenas suas próprias compras
CREATE POLICY "Users can view own purchases" ON purchased_sessions
    FOR SELECT USING (
        user_email = auth.jwt() ->> 'email' 
        OR auth.role() = 'service_role'
    );

-- Apenas service_role pode inserir compras (para webhooks do Stripe)
CREATE POLICY "Service role can insert purchases" ON purchased_sessions
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Apenas service_role pode atualizar compras
CREATE POLICY "Service role can update purchases" ON purchased_sessions
    FOR UPDATE USING (auth.role() = 'service_role');

-- ===========================================
-- 8. STORAGE BUCKET E POLÍTICAS
-- ===========================================

-- Criar bucket para imagens (se não existir)
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

-- Remover políticas antigas de storage
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on room-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to room-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on room-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on room-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to room-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Políticas de storage para o bucket room-images (acesso público total)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'room-images' );
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'room-images' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'room-images' );
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'room-images' );

-- ===========================================
-- 9. VERIFICAÇÃO FINAL
-- ===========================================

-- Verificar se RLS está habilitado em todas as tabelas
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Habilitado' 
        ELSE '❌ RLS Desabilitado' 
    END as status
FROM pg_tables 
WHERE tablename IN ('users', 'ai_generated_image', 'purchased_sessions')
ORDER BY tablename;

-- Verificar políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename IN ('users', 'ai_generated_image', 'purchased_sessions')
ORDER BY tablename, policyname;
