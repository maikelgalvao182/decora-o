# 🗃️ Configuração do Banco de Dados

## 📁 Arquivos SQL Essenciais

### 🎯 **Arquivo Principal**
- **`supabase-consolidated-schema.sql`** - ⭐ **ÚNICO ARQUIVO NECESSÁRIO**
  - Contém TODAS as tabelas, políticas RLS e configurações
  - Substitui todos os arquivos antigos
  - Implementa segurança completa
  - Execute APENAS este arquivo no Supabase SQL Editor

### 🔧 **Arquivos de Debug (Opcionais)**
- **`check-storage-setup.sql`** - Verifica configuração do storage
- **`diagnose-storage.sql`** - Diagnóstica problemas de storage

## 🚀 **Como Usar**

### 1️⃣ **Setup Inicial**
```sql
-- Execute no Supabase SQL Editor:
-- Copie e cole todo o conteúdo de supabase-consolidated-schema.sql
```

### 2️⃣ **Verificação**
- ✅ Verifique se todas as tabelas foram criadas
- ✅ Confirme que RLS está habilitado
- ✅ Teste se não há mais avisos de segurança

## 🔒 **Segurança Implementada**

### **Tabelas Protegidas:**
- ✅ `users` - Acesso baseado no email do usuário
- ✅ `ai_generated_image` - Usuário vê apenas suas imagens
- ✅ `purchased_sessions` - Apenas service_role pode inserir/atualizar

### **Storage:**
- ✅ Bucket `room-images` configurado corretamente
- ✅ Políticas de upload/download funcionais
- ✅ Limite de 50MB por arquivo
- ✅ Tipos permitidos: JPEG, PNG, WebP, GIF

## 📝 **Changelog**

### ✂️ **Arquivos Removidos:**
- ❌ `purchased_sessions.sql` (duplicado)
- ❌ `supabase-schema.sql` (duplicado)  
- ❌ `supabase-storage-policies.sql` (duplicado)
- ❌ `step1-create-bucket.sql` (fragmentado)
- ❌ `step2-clean-policies.sql` (fragmentado)
- ❌ `step3-create-policy.sql` (fragmentado)
- ❌ `step4-verify.sql` (fragmentado)
- ❌ `simple-storage-setup.sql` (duplicado)

### ✅ **Mantidos:**
- ✅ `supabase-consolidated-schema.sql` (arquivo principal)
- ✅ `check-storage-setup.sql` (debug)
- ✅ `diagnose-storage.sql` (debug)

## ⚠️ **Importante**

- **NÃO** execute arquivos SQL antigos
- **Use APENAS** o arquivo consolidado
- Em caso de problemas, use os arquivos de debug
- Sempre backup antes de executar migrations

## 🎯 **Próximos Passos**

1. Execute `supabase-consolidated-schema.sql`
2. Verifique se avisos de RLS desapareceram
3. Teste funcionalidades da aplicação
4. Remove este README se tudo funcionar corretamente
