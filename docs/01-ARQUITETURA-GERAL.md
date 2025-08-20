# 🏗️ Documentação da Arquitetura - AI Room Redesign

## 📋 Visão Geral da Aplicação

**AI Room Redesign** é uma aplicação web SaaS que permite aos usuários fazer redesign de ambientes usando inteligência artificial. A aplicação utiliza tecnologias modernas e serviços na nuvem para fornecer uma experiência completa de transformação de espaços.

## 🎯 Funcionalidades Principais

1. **Autenticação e Autorização** - Sistema completo de login/cadastro
2. **Upload e Processamento de Imagens** - Upload de fotos de ambientes
3. **IA para Redesign** - Transformação de ambientes usando IA
4. **Sistema de Créditos** - Monetização via sistema de créditos
5. **Dashboard de Usuário** - Gerenciamento de projetos e histórico
6. **Pagamentos** - Integração com Stripe para compra de créditos

## 🏛️ Arquitetura Técnica

### Stack Principal
- **Framework**: Next.js 14.2.15 (App Router)
- **Frontend**: React 18 + TailwindCSS
- **Autenticação**: Clerk
- **Banco de Dados**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **IA**: Replicate API
- **Pagamentos**: Stripe
- **Deploy**: Vercel (recomendado)

### Estrutura de Pastas
```
ai-room-redesign-main/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo de rotas de autenticação
│   ├── _context/          # Contextos React globais
│   ├── api/               # API Routes
│   ├── dashboard/         # Área logada do usuário
│   ├── globals.css        # Estilos globais
│   ├── layout.js          # Layout raiz
│   ├── page.js            # Landing page
│   └── provider.js        # Providers globais
├── components/            # Componentes reutilizáveis
│   └── ui/               # Componentes base (shadcn/ui)
├── config/               # Configurações de serviços
├── lib/                  # Utilitários e helpers
├── public/               # Assets estáticos
└── docs/                 # Documentação (este arquivo)
```

## 🛣️ Mapeamento de Rotas

### Rotas Públicas
- `/` - Landing page principal
- `/sign-in` - Página de login
- `/sign-up` - Página de cadastro

### Rotas Protegidas (Dashboard)
- `/dashboard` - Dashboard principal
- `/dashboard/create-new` - Criação de novo projeto
- `/dashboard/buy-credits` - Compra de créditos
- `/dashboard/result/[id]` - Visualização de resultado

### API Routes
- `/api/redesign-room` - Processamento de redesign via IA
- `/api/verify-user` - Verificação de dados do usuário
- `/api/stripe/create-payment-intent` - Criação de pagamento
- `/api/stripe/webhook` - Webhook do Stripe

## 📦 Dependências Principais

### Produção
```json
{
  "@clerk/nextjs": "^5.7.5",          // Autenticação
  "@supabase/supabase-js": "^2.55.0", // Banco de dados
  "replicate": "^0.33.0",             // IA para redesign
  "stripe": "^16.0.0",                // Pagamentos
  "next": "14.2.15",                  // Framework
  "react": "^18",                     // UI Library
  "tailwindcss": "^3.4.1",           // CSS Framework
  "lucide-react": "^0.453.0",        // Ícones
  "@radix-ui/react-*": "^1.*",       // Componentes base
}
```

### Desenvolvimento
```json
{
  "postcss": "^8",
  "tailwindcss": "^3.4.1"
}
```

## 🔧 Serviços e Integrações

### 1. Clerk (Autenticação)
- **Função**: Gerenciamento completo de usuários
- **Funcionalidades**: Login, cadastro, sessões, proteção de rotas
- **Configuração**: Localização PT-BR, temas customizados

### 2. Supabase (Backend)
- **Função**: Banco de dados e storage
- **Componentes**:
  - PostgreSQL para dados estruturados
  - Storage para imagens (bucket: 'room-images')
  - RLS (Row Level Security) para segurança

### 3. Replicate (IA)
- **Função**: Processamento de redesign de ambientes
- **Modelos**: Modelos específicos para transformação de interiores
- **Input**: Imagem + estilo desejado
- **Output**: Imagem redesenhada

### 4. Stripe (Pagamentos)
- **Função**: Processamento de pagamentos
- **Produtos**: Pacotes de créditos
- **Webhook**: Atualização automática de créditos

## 📊 Banco de Dados

### Tabelas Principais
1. **users** - Dados dos usuários
2. **user_credits** - Sistema de créditos
3. **redesign_projects** - Projetos de redesign
4. **payments** - Histórico de pagamentos

## 🔐 Variáveis de Ambiente Necessárias

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Replicate
REPLICATE_API_TOKEN=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 🚀 Fluxo de Desenvolvimento

### Setup Inicial
1. Clone do repositório
2. `npm install`
3. Configuração de variáveis de ambiente
4. Setup do Supabase (banco + storage)
5. Configuração do Clerk
6. Configuração do Stripe
7. `npm run dev`

### Estrutura de Componentes
- **UI Components**: Baseados em shadcn/ui + Radix UI
- **Layout Components**: Header, Sidebar, modais
- **Business Components**: Upload, preview, resultado
- **Context Providers**: Gerenciamento de estado global

## 📈 Métricas e Monitoramento

### KPIs da Aplicação
- Usuários registrados
- Créditos consumidos
- Redesigns gerados
- Revenue (via Stripe)
- Taxa de conversão

### Logs e Debugging
- Console logs para desenvolvimento
- Error boundaries para produção
- Stripe dashboard para pagamentos
- Supabase dashboard para dados

## 🔄 Fluxo de Usuário Principal

1. **Landing** → Visitante conhece a aplicação
2. **Cadastro/Login** → Usuário se autentica
3. **Dashboard** → Visualiza histórico e inicia novo projeto
4. **Create New** → Upload de imagem + seleção de estilo
5. **Processing** → IA processa a imagem
6. **Result** → Visualização do resultado
7. **Credits** → Compra mais créditos se necessário

## 🛡️ Segurança

### Medidas Implementadas
- Autenticação via Clerk (OAuth + JWT)
- RLS no Supabase para isolamento de dados
- Validação de inputs nas API routes
- Rate limiting (via Vercel/Clerk)
- Sanitização de uploads

### Boas Práticas
- Variáveis de ambiente para credenciais
- HTTPS obrigatório em produção
- Validação client-side e server-side
- Logs de auditoria para ações críticas

---

**Próximos Documentos:**
- [02-SERVICOS-E-COMPONENTES.md](./02-SERVICOS-E-COMPONENTES.md) - Detalhamento de serviços e componentes
- [03-PAGINAS-DETALHADAS.md](./03-PAGINAS-DETALHADAS.md) - Documentação página por página
