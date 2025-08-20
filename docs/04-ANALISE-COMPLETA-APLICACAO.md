# 04 - ANÁLISE COMPLETA DA APLICAÇÃO AI ROOM REDESIGN

## VISÃO GERAL ARQUITETURAL

### Tipo de Aplicação
- **Framework**: Next.js 14.2.15 (App Router)
- **Linguagem**: JavaScript/JSX
- **Estilo**: Aplicação SaaS de redesign de ambientes com IA
- **Arquitetura**: Frontend + API Routes + Serviços Externos

### Stack Tecnológica Completa

#### Frontend
- **React 18** - Biblioteca principal
- **Next.js 14** - Framework fullstack
- **Tailwind CSS** - Estilização utilitária
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Clerk** - Autenticação completa

#### Backend/Serviços
- **Supabase** - Banco de dados PostgreSQL + Storage
- **Replicate AI** - Geração de imagens IA
- **Stripe** - Processamento de pagamentos
- **Clerk** - Gerenciamento de usuários

#### Dependências Críticas
```json
{
  "@clerk/nextjs": "^5.7.5",
  "@supabase/supabase-js": "^2.55.0",
  "replicate": "^0.33.0",
  "stripe": "^16.0.0",
  "axios": "^1.7.7"
}
```

## ESTRUTURA DE BANCO DE DADOS

### Tabela: users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: ai_generated_image
```sql
CREATE TABLE ai_generated_image (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  room_type VARCHAR(100),
  design_type VARCHAR(100),
  org_image TEXT NOT NULL,
  ai_image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email)
);
```

### Storage Bucket: room-images
- **Localização**: Supabase Storage
- **Estrutura**: `room-redesign/{timestamp}_raw.png`
- **Público**: URLs acessíveis publicamente
- **Tipos**: PNG, JPEG para imagens originais e geradas

## ARQUITETURA DE ROTAS

### Páginas Públicas
- `/` - Landing page (page.js)
- `/sign-in` - Login via Clerk
- `/sign-up` - Cadastro via Clerk

### Páginas Protegidas (Dashboard)
- `/dashboard` - Painel principal (Listing.jsx)
- `/dashboard/create-new` - Criação de design
- `/dashboard/result` - Visualização de resultado
- `/dashboard/buy-credits` - Compra de créditos

### API Routes
- `/api/verify-user` - Verificação/criação de usuário
- `/api/redesign-room` - Geração de imagem IA
- `/api/stripe/*` - Webhooks e checkout Stripe

## FLUXO DE AUTENTICAÇÃO

### Configuração Clerk
```javascript
// app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="en">
        <body>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### Provider Context
```javascript
// app/provider.js
function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState([]);
  
  useEffect(() => {
    user && VerifyUser();
  }, [user])

  const VerifyUser = async () => {
    const dataResult = await axios.post('/api/verify-user', {
      user: user
    });
    setUserDetail(dataResult.data.result);
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}
```

## COMPONENTES PRINCIPAIS

### Header.jsx - Navegação Principal
**Localização**: `app/dashboard/_components/Header.jsx`
**Funcionalidades**:
- Exibição de créditos disponíveis
- Logo e navegação
- UserButton do Clerk
- Link para compra de créditos

```javascript
function Header() {
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  return (
    <div className='p-5 shadow-sm flex justify-between items-center'>
      <Link href={'/'} className='flex gap-2 items-center'>
        <Image src={'/logo.svg'} width={40} height={40} />
        <h2 className='font-bold text-lg'>AI Room Design</h2>
      </Link>
      <div className='flex gap-7 items-center'>
        {userDetail?.credits && 
          <Link href={'/dashboard/buy-credits'}>
            <div className='flex gap-2 p-1 items-center bg-slate-200 px-3 rounded-full'>
              <h2>{userDetail?.credits}</h2>
              <span>Créditos</span>
            </div>
          </Link>
        }
        <UserButton/>
      </div>
    </div>
  )
}
```

### Listing.jsx - Dashboard Principal
**Localização**: `app/dashboard/_components/Listing.jsx`
**Funcionalidades**:
- Lista de designs criados pelo usuário
- Estado de loading
- Estado vazio (EmptyState)
- Navegação para criar novo design

**Lógica Principal**:
```javascript
const GetUserRoomList = async() => {
  setLoading(true);
  try {
    const result = await AiGeneratedImageSupabase.selectByUserEmail(
      user?.primaryEmailAddress?.emailAddress
    );
    setUserRoomList(result);
  } catch (error) {
    console.error('Error fetching user room list:', error);
    setUserRoomList([]);
  } finally {
    setLoading(false);
  }
}
```

### RoomDesignCard.jsx - Card de Design
**Funcionalidades**:
- Preview da imagem original e gerada
- Informações do tipo de cômodo e design
- Click para visualizar resultado completo

## PROCESSO DE GERAÇÃO DE IMAGEM IA

### Fluxo Completo
1. **Upload da Imagem Original**
2. **Validação de Créditos**
3. **Chamada para Replicate AI**
4. **Conversão e Upload da Imagem Gerada**
5. **Salvamento no Banco de Dados**
6. **Débito de Créditos**
7. **Redirecionamento para Resultado**

### API Route: redesign-room
**Localização**: `app/api/redesign-room/route.jsx`

#### Validações
```javascript
// Validar créditos antes de processar
const { data: userRow, error: userErr } = await supabase
  .from('users')
  .select('id, credits')
  .eq('email', userEmail)
  .single();

if((userRow.credits ?? 0) < 1){
  return NextResponse.json({
    error:'Sem créditos disponíveis', 
    code:'NO_CREDITS'
  }, {status:402});
}
```

#### Configuração Replicate
```javascript
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN
});

const input = {
  image: imageUrl,
  prompt: `A ${roomType} with a ${designType} style interior ${additionalReq}`,
  ...(safeWidth ? { width: safeWidth } : {}),
  ...(safeHeight ? { height: safeHeight } : {})
};

const baseModel = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";
const output = await replicate.run(baseModel, { input });
```

#### Upload para Supabase
```javascript
const fileName = Date.now() + '.png';
const filePath = `room-redesign/${fileName}`;

const base64Data = base64Image.split(',')[1];
const blob = Buffer.from(base64Data, 'base64');

const { data: uploadData, error: uploadError } = await supabase.storage
  .from(STORAGE_BUCKET)
  .upload(filePath, blob, {
    contentType: 'image/png',
    cacheControl: '3600',
    upsert: false
  });
```

## SISTEMA DE CRÉDITOS

### Gerenciamento de Créditos
- **Crédito por Imagem**: 1 crédito = 1 geração
- **Validação**: Antes de cada geração
- **Débito**: Após sucesso da geração
- **Atualização**: Context atualizado em tempo real

### Integração Stripe
**Planos Disponíveis**:
```javascript
const creditsOption = [
  { id:'plan_50', credits: 50, amountBRL: 44.90 },
  { id:'plan_100', credits: 100, amountBRL: 84.90 },
  { id:'plan_500', credits: 500, amountBRL: 184.90 }
];
```

## CONFIGURAÇÕES ESSENCIAIS

### Variáveis de Ambiente
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Replicate AI
NEXT_PUBLIC_REPLICATE_API_TOKEN=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

### Supabase Storage Setup
```javascript
// config/supabaseConfig.js
export const STORAGE_BUCKET = 'room-images'

// Política de Storage (RLS)
-- Permitir upload para usuários autenticados
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'room-images');

-- Permitir leitura pública
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'room-images');
```

## ESTADOS E LOADING

### Estados de Carregamento
- **Dashboard Loading**: Spinner durante fetch de designs
- **Generation Loading**: Modal customizado durante geração IA
- **Upload Loading**: Feedback durante upload de imagem

### Estados de Erro
- **Sem Créditos**: Redirecionamento para compra
- **Erro de Upload**: Mensagem de erro específica
- **Erro de IA**: Fallback e retry

### Estados Vazios
- **EmptyState**: Primeiro acesso sem designs
- **No Results**: Sem resultados na busca

## RESPONSIVIDADE E UX

### Grid System
```javascript
// Layout responsivo para cards
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
```

### Mobile First
- **Breakpoints**: sm, md, lg, xl
- **Componentes**: Adaptados para mobile
- **Navegação**: Hamburger menu (se aplicável)

### Feedback Visual
- **Loading Spinners**: Customizados
- **Progress Indicators**: Durante geração
- **Success/Error Messages**: Toast-like

## OTIMIZAÇÕES DE PERFORMANCE

### Lazy Loading
- **Imagens**: Next.js Image component
- **Componentes**: Dynamic imports quando necessário

### Caching
- **Storage**: Cache-Control headers
- **API**: Revalidação inteligente
- **Images**: CDN via Supabase

### Compressão
- **Imagens**: Otimização automática
- **Base64**: Conversão eficiente
- **API Responses**: Gzip habilitado

## MONITORAMENTO E LOGS

### Console Logs
```javascript
console.log('🚀 Iniciando geração de imagem AI...');
console.log('📋 FormData atual:', formData);
console.log('📸 URL da imagem original salva:', rawImageUrl);
console.log('🎨 Resultado da API completo:', result);
```

### Error Tracking
- **Try/Catch**: Em todas as operações críticas
- **Error Boundaries**: Para componentes React
- **API Errors**: Status codes padronizados

## SEGURANÇA

### Validações Frontend
- **Tipos de Arquivo**: Apenas imagens
- **Tamanho**: Limite de upload
- **Campos Obrigatórios**: Validação antes de submit

### Validações Backend
- **Auth**: Verificação via Clerk
- **Créditos**: Validação em cada request
- **Input Sanitization**: Limpeza de dados

### RLS (Row Level Security)
```sql
-- Política para ai_generated_image
CREATE POLICY "Users can only see their own images" 
ON ai_generated_image FOR SELECT 
USING (user_email = auth.email());
```

## INTEGRAÇÕES EXTERNAS

### Clerk (Autenticação)
- **Setup**: Provider no layout raiz
- **Hooks**: useUser, useAuth
- **Localização**: Português brasileiro
- **Webhooks**: Sincronização de usuários

### Replicate (IA)
- **Modelo**: Interior design específico
- **Rate Limits**: Gerenciamento de quotas
- **Error Handling**: Fallbacks e retries
- **Upscaling**: Opcional via Real-ESRGAN

### Stripe (Pagamentos)
- **Checkout**: Sessions para planos
- **Webhooks**: Confirmação de pagamentos
- **Produtos**: Créditos como produtos
- **Currency**: BRL (Real brasileiro)

### Supabase (Database + Storage)
- **Real-time**: Subscriptions (se necessário)
- **Storage**: CDN global
- **Auth**: Integração com Clerk
- **Migrations**: Versionamento de schema

Esta documentação fornece uma base completa para reconstruir a aplicação do zero, incluindo todos os aspectos técnicos, arquiteturais e de implementação.
