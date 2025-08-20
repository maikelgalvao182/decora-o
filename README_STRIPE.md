# Integração Stripe (Resumo)

## Variáveis de Ambiente Necessárias
Adicione no `.env.local`:
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_PRICE_5=price_xxx
STRIPE_PRICE_10=price_xxx
STRIPE_PRICE_25=price_xxx
STRIPE_PRICE_50=price_xxx
STRIPE_PRICE_100=price_xxx
```

## Fluxo
1. Usuário seleciona bundle em `/dashboard/buy-credits`.
2. Chamada `POST /api/stripe/create-checkout-session` retorna `url` do checkout.
3. Stripe redireciona de volta com `?success=1` ou `?canceled=1`.
4. Webhook `/api/stripe/webhook` recebe `checkout.session.completed` e incrementa créditos.
5. Página mostra mensagem de sucesso; créditos aparecem após refresh/context update.

## Tabela recomendada (SQL)
```sql
create table if not exists public.purchased_sessions (
  id text primary key,
  user_email text not null,
  credits_added int not null,
  processed_at timestamptz default now()
);
```
Ajuste políticas RLS conforme necessário.

## Teste Webhook Local
Use o CLI da Stripe:
```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Próximos Passos
- Substituir placeholders de price IDs.
- Opcional: refetch automático dos créditos após sucesso (SWR ou revalidação).
- Remover dependência PayPal (já retirada do package.json). Instale dependências novamente.
