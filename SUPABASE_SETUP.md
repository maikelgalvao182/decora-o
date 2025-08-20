# Configuração do Supabase

## Passos para configurar o Supabase:

### 1. Criar conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### 2. Configurar o banco de dados
1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute o script SQL que está em `config/supabase-schema.sql`
3. Isso criará as tabelas `users` e `ai_generated_image`

### 3. Configurar o Storage
1. No dashboard do Supabase, vá para **Storage**
2. Execute o script SQL em `config/supabase-storage-policies.sql` no **SQL Editor**
3. Isso criará automaticamente:
   - O bucket `room-images` 
   - Configurações de tamanho máximo (50MB)
   - Tipos de arquivo permitidos (JPEG, PNG, WebP, GIF)
   - Todas as políticas necessárias

### 4. Verificar se o Storage está funcionando
1. Vá para **Storage** > **Buckets**
2. Você deve ver o bucket `room-images` listado
3. Clique no bucket para verificar se está público
4. Teste fazendo upload de uma imagem manualmente

### 5. Obter as chaves do projeto
1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL** (exemplo: https://xxxxxxxxxxx.supabase.co)
   - **anon public key** (chave pública)

### 6. Atualizar o arquivo .env.local
Substitua as linhas do Supabase no arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seuprojectoid.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
```

### 7. Testar a configuração
1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse a aplicação e teste o upload de imagens
3. Verifique os logs no console do navegador

## Estrutura das tabelas

### Tabela `users`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `image_url` (VARCHAR)
- `credits` (INTEGER DEFAULT 3)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela `ai_generated_image`
- `id` (SERIAL PRIMARY KEY)
- `room_type` (VARCHAR)
- `design_type` (VARCHAR)
- `org_image` (VARCHAR)
- `ai_image` (VARCHAR)
- `user_email` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Benefícios do Supabase vs Firebase
- ✅ Configuração mais simples
- ✅ Interface mais intuitiva
- ✅ PostgreSQL (mais poderoso que Firestore)
- ✅ Row Level Security automática
- ✅ Melhor integração com aplicações Next.js
- ✅ API REST automática
- ✅ Realtime subscriptions
- ✅ Menos problemas de CORS
