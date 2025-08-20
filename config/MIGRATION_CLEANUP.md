# LIMPEZA DOS ARQUIVOS DE MIGRATION

## Arquivos que devem ser REMOVIDOS (duplicados/desnecessários):

1. `purchased_sessions.sql` - Conteúdo incluído no arquivo consolidado
2. `supabase-schema.sql` - Substituído pelo arquivo consolidado
3. `supabase-storage-policies.sql` - Incluído no arquivo consolidado
4. `step1-create-bucket.sql` - Incluído no arquivo consolidado
5. `step2-clean-policies.sql` - Incluído no arquivo consolidado
6. `step3-create-policy.sql` - Incluído no arquivo consolidado
7. `step4-verify.sql` - Incluído no arquivo consolidado
8. `simple-storage-setup.sql` - Substituído pelo arquivo consolidado
9. `check-storage-setup.sql` - Pode ser mantido para debug se necessário
10. `diagnose-storage.sql` - Pode ser mantido para debug se necessário

## Arquivo PRINCIPAL a ser usado:

- `supabase-consolidated-schema.sql` - Contém TUDO o que é necessário

## Instruções:

1. Execute APENAS o arquivo `supabase-consolidated-schema.sql` no Supabase SQL Editor
2. Este arquivo irá:
   - Criar todas as tabelas necessárias
   - Habilitar RLS em todas as tabelas
   - Criar políticas seguras baseadas no email do usuário
   - Configurar o storage bucket corretamente
   - Limpar políticas antigas para evitar conflitos

## Por que consolidar?

- Remove duplicações de código
- Evita conflitos entre políticas
- Facilita manutenção
- Garante que RLS está habilitado corretamente
- Políticas mais seguras baseadas no email do Clerk Auth

## Benefícios de Segurança:

- ✅ Usuários só veem seus próprios dados
- ✅ Service role (webhooks) podem acessar tudo
- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas baseadas no JWT do Clerk
- ✅ Proteção contra acesso não autorizado aos dados
