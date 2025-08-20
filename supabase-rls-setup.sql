-- Habilitar Row Level Security (RLS) para a tabela purchased_sessions
ALTER TABLE purchased_sessions ENABLE row level security;

-- Criar política para permitir que usuários vejam apenas suas próprias compras
CREATE POLICY "Users can view own purchases" ON purchased_sessions
FOR SELECT USING (user_email = auth.jwt() ->> 'email');

-- Criar política para permitir que usuários insiram suas próprias compras
CREATE POLICY "Users can insert own purchases" ON purchased_sessions
FOR INSERT WITH CHECK (user_email = auth.jwt() ->> 'email');

-- Criar política para permitir que usuários atualizem suas próprias compras
CREATE POLICY "Users can update own purchases" ON purchased_sessions
FOR UPDATE USING (user_email = auth.jwt() ->> 'email');

-- Opcional: Se você quiser permitir que o serviço (service role) acesse todos os dados
-- Esta política é útil para operações administrativas e webhooks
CREATE POLICY "Service role can manage all purchases" ON purchased_sessions
FOR ALL USING (auth.role() = 'service_role');

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'purchased_sessions';
