# 08 - SETUP E DEPLOYMENT COMPLETO

## REQUISITOS DE SISTEMA

### Ambiente de Desenvolvimento:
- **Node.js**: 18.0.0 ou superior
- **npm/yarn**: Gerenciador de pacotes
- **Git**: Controle de versão
- **VS Code**: Editor recomendado

### Contas de Serviços Necessárias:
- **Supabase**: Database + Storage
- **Clerk**: Autenticação
- **Replicate**: IA para geração de imagens
- **Stripe**: Processamento de pagamentos
- **Vercel/Netlify**: Deploy (opcional)

---

## CONFIGURAÇÃO INICIAL

### 1. Clonagem e Instalação:
```bash
# Clonar repositório
git clone <seu-repo>
cd ai-room-redesign

# Instalar dependências
npm install

# ou
yarn install
```

### 2. Configuração de Variáveis de Ambiente:
Criar arquivo `.env.local`:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replicate AI
NEXT_PUBLIC_REPLICATE_API_TOKEN=r8_xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_50=price_xxx
STRIPE_PRICE_100=price_xxx
STRIPE_PRICE_500=price_xxx

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## CONFIGURAÇÃO DO SUPABASE

### 1. Criação do Projeto:
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Anote a URL e Anon Key

### 2. Configuração do Banco de Dados:

#### Tabela: users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
```

#### Tabela: ai_generated_image
```sql
CREATE TABLE ai_generated_image (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  room_type VARCHAR(100),
  design_type VARCHAR(100),
  org_image TEXT NOT NULL,
  ai_image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_ai_images_user_email ON ai_generated_image(user_email);
CREATE INDEX idx_ai_images_created_at ON ai_generated_image(created_at DESC);
```

#### Tabela: purchased_sessions (para idempotência Stripe)
```sql
CREATE TABLE purchased_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  credits_added INTEGER NOT NULL,
  processed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para busca rápida
CREATE INDEX idx_purchased_sessions_user_email ON purchased_sessions(user_email);
```

### 3. Configuração do Storage:

#### Criar Bucket:
```sql
-- Criar bucket público para imagens
INSERT INTO storage.buckets (id, name, public) VALUES ('room-images', 'room-images', true);
```

#### Políticas RLS (Row Level Security):
```sql
-- Política para upload de imagens (usuários autenticados)
CREATE POLICY "Users can upload room images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'room-images' AND
    auth.role() = 'authenticated'
  );

-- Política para leitura pública
CREATE POLICY "Public read access for room images" ON storage.objects
  FOR SELECT USING (bucket_id = 'room-images');

-- Política para delete (apenas próprios arquivos)
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'room-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Políticas para Tabelas:
```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_image ENABLE ROW LEVEL SECURITY;

-- Política para users - usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (email = auth.email());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (email = auth.email());

-- Política para ai_generated_image - usuários podem ver apenas suas imagens
CREATE POLICY "Users can view own images" ON ai_generated_image
  FOR SELECT USING (user_email = auth.email());

CREATE POLICY "Users can insert own images" ON ai_generated_image
  FOR INSERT WITH CHECK (user_email = auth.email());
```

---

## CONFIGURAÇÃO DO CLERK

### 1. Criação da Aplicação:
1. Acesse [clerk.com](https://clerk.com)
2. Crie nova aplicação
3. Configure provedores de login (Email, Google, etc.)

### 2. Configuração de Webhooks:
```javascript
// URL do webhook: https://yourapp.com/api/webhooks/clerk
// Eventos: user.created, user.updated

// Exemplo de handler (opcional)
export async function POST(req) {
  const { type, data } = await req.json();
  
  if (type === 'user.created') {
    // Sincronizar usuário com Supabase
    await createUserInSupabase(data);
  }
  
  return NextResponse.json({ received: true });
}
```

### 3. Personalização (Opcional):
```javascript
// Customizar aparência
const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "bottom",
    logoImageUrl: "/logo.svg"
  },
  variables: {
    colorPrimary: "#000000"
  }
};
```

---

## CONFIGURAÇÃO DO REPLICATE

### 1. Obtenção da API Key:
1. Acesse [replicate.com](https://replicate.com)
2. Crie conta e obtenha API token
3. Adicione ao `.env.local`

### 2. Modelos Utilizados:
```javascript
// Modelo principal para design de interiores
const interiorModel = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

// Modelo para upscaling (opcional)
const upscaleModel = "nightmareai/real-esrgan:db21e45f3b4d7dc4ceac2ae15d7a372c1b21e8d52e1f2a550d458facb1613e81";
```

### 3. Teste da Integração:
```javascript
// Teste simples
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
  {
    input: {
      image: "https://example.com/room.jpg",
      prompt: "A modern living room with minimalist design"
    }
  }
);

console.log(output);
```

---

## CONFIGURAÇÃO DO STRIPE

### 1. Configuração da Conta:
1. Acesse [stripe.com](https://stripe.com)
2. Crie conta e obtenha chaves de API
3. Configure webhook endpoint

### 2. Criação de Produtos:
```bash
# Criar produtos via CLI ou Dashboard
stripe products create \
  --name "50 Créditos AI Room Design" \
  --description "50 gerações de design de ambiente"

stripe prices create \
  --unit-amount 4490 \
  --currency brl \
  --product prod_xxx
```

### 3. Configuração de Webhooks:
- **URL**: `https://yourapp.com/api/stripe/webhook`
- **Eventos**: `checkout.session.completed`
- **Versão**: `2024-06-20`

### 4. Teste com CLI:
```bash
# Instalar Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Testar webhook
stripe trigger checkout.session.completed
```

---

## ASSETS NECESSÁRIOS

### Estrutura de Pastas Públicas:
```
public/
├── logo.svg                    # Logo da aplicação
├── loading.gif                 # Gif de carregamento
├── avatar/                     # Avatares para social proof
│   ├── Female.jpg
│   ├── Female (1).jpg
│   ├── avatar2.jpg
│   ├── Female (2).jpg
│   └── avatar3.jpg
└── estilos/                    # Imagens de estilos de design
    ├── modern.jpeg
    ├── minimalist.jpeg
    ├── scandinavian.jpeg
    ├── contemporary.jpeg
    ├── luxury.jpeg
    ├── industrial.jpeg
    ├── bohemian.jpeg
    ├── japanese-design.jpeg
    ├── art-deco.jpeg
    ├── cyberpunk.jpeg
    └── ... (50+ estilos)
```

### Obtenção dos Assets:
1. **Logo**: Criar logo SVG customizado
2. **Avatares**: Usar imagens stock ou Unsplash
3. **Estilos**: Gerar com IA ou usar imagens de exemplo

---

## EXECUTANDO LOCALMENTE

### 1. Desenvolvimento:
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Abrir http://localhost:3000
```

### 2. Build e Teste:
```bash
# Build para produção
npm run build

# Executar build local
npm start

# Linting
npm run lint
```

### 3. Verificação de Funcionalidades:
- [ ] Login/cadastro via Clerk
- [ ] Upload de imagem
- [ ] Seleção de tipo de ambiente
- [ ] Seleção de estilo de design
- [ ] Geração de imagem IA
- [ ] Visualização de resultado
- [ ] Compra de créditos
- [ ] Histórico de designs

---

## DEPLOYMENT

### Opção 1: Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente no dashboard
# Configurar domínio customizado
```

### Opção 2: Netlify
```bash
# Build para produção
npm run build

# Deploy manual ou conectar GitHub
# Configurar variáveis de ambiente
# Configurar redirects para SPA
```

### Opção 3: Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Configurações Pós-Deploy:

#### 1. Atualizações de URLs:
```env
# Produção
NEXT_PUBLIC_SITE_URL=https://yourapp.com
```

#### 2. Webhooks:
- Atualizar URLs dos webhooks para domínio final
- Testar webhooks em produção

#### 3. DNS e SSL:
- Configurar domínio customizado
- Certificado SSL automático (Vercel/Netlify)

---

## MONITORAMENTO E MANUTENÇÃO

### 1. Logs e Erros:
```javascript
// Configurar logging estruturado
console.log('🚀 [API] Operação iniciada:', {
  user: userEmail,
  operation: 'generateImage',
  timestamp: new Date().toISOString()
});
```

### 2. Métricas Importantes:
- Taxa de conversão (signup → primeira geração)
- Tempo médio de geração IA
- Taxa de erro por endpoint
- Uso de créditos por usuário

### 3. Backup e Recuperação:
```bash
# Backup automático Supabase
# Configurar no dashboard Supabase

# Export de dados críticos
pg_dump postgresql://user:pass@host:port/db > backup.sql
```

### 4. Atualizações:
```bash
# Dependências
npm audit
npm update

# Modelos IA
# Verificar novos modelos no Replicate
# Testar performance e qualidade
```

---

## TROUBLESHOOTING

### Problemas Comuns:

#### 1. Erro de Upload Supabase:
```javascript
// Verificar política RLS
// Verificar tamanho do arquivo
// Verificar configuração CORS
```

#### 2. Erro Replicate:
```javascript
// Verificar créditos da conta
// Verificar formato da imagem
// Verificar rate limits
```

#### 3. Webhook Stripe:
```javascript
// Verificar assinatura webhook
// Verificar idempotência
// Verificar logs no dashboard Stripe
```

#### 4. Erro Clerk:
```javascript
// Verificar configuração de domínio
// Verificar chaves de API
// Verificar middleware de rotas
```

Esta documentação completa permite configurar e deployer a aplicação do zero, incluindo todos os serviços e integrações necessárias.
