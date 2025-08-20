# 05 - DOCUMENTAÇÃO DETALHADA DE PÁGINAS

## LANDING PAGE (/)

### Arquivo: `app/page.js`
### Componentes Utilizados:
- Header (reutilizado do dashboard)
- Button (UI component)
- Image (Next.js)
- Link (Next.js)

### Estrutura da Página:
```javascript
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header/>
      {/* Hero Section */}
      <section className="px-4 py-20 bg-white">
        {/* Rating e Avatares */}
        {/* Título Principal */}
        {/* Descrição */}
        {/* CTA Button */}
        {/* Hero Images */}
      </section>
      {/* Outras seções... */}
    </div>
  );
}
```

### Funcionalidades:
1. **Hero Section**: Título, subtítulo e CTA principal
2. **Social Proof**: Avatares e avaliações de clientes
3. **Galeria de Exemplos**: Before/After de designs
4. **Seções de Features**: Benefícios da ferramenta
5. **Pricing Preview**: Prévia dos planos
6. **Footer**: Links e informações

### Assets Necessários:
```
/avatar/Female.jpg
/avatar/Female (1).jpg
/avatar/avatar2.jpg
/avatar/Female (2).jpg
/avatar/avatar3.jpg
/logo.svg
```

### Responsividade:
- Grid responsivo: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Texto adaptativo: `text-5xl md:text-7xl`
- Padding responsivo: `px-4 py-20`

---

## AUTENTICAÇÃO

### Sign In: `/sign-in`
- **Gerenciado por**: Clerk
- **Localização**: `app/(auth)/sign-in/`
- **Personalização**: Tema e localização PT-BR

### Sign Up: `/sign-up`
- **Gerenciado por**: Clerk
- **Localização**: `app/(auth)/sign-up/`
- **Fluxo**: Cadastro → Verificação → Dashboard

### Middleware de Proteção:
```javascript
// middleware.js
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
  ignoredRoutes: ["/api/webhook"]
});
```

---

## DASHBOARD PRINCIPAL (/dashboard)

### Arquivo: `app/dashboard/page.jsx`
### Layout: `app/dashboard/layout.jsx`

### Estrutura do Layout:
```javascript
function DashboardLayout({children}) {
  return (
    <div>
      <Header/>
      <div className='pt-20 px-10 md:px-20 lg:px-40 xl:px-60'>
        {children}
      </div>
    </div>
  )
}
```

### Componente Principal: Listing.jsx

#### Estado do Componente:
```javascript
const [userRoomList, setUserRoomList] = useState([]);
const [loading, setLoading] = useState(true);
```

#### Função Principal - GetUserRoomList:
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

#### Estados de Exibição:
1. **Loading**: Spinner centralizado
2. **Empty State**: Primeira visita sem designs
3. **Lista de Designs**: Grid responsivo com cards

#### Grid de Cards:
```javascript
<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
  {userRoomList.map((room,index) => (
    <div key={index} onClick={() => {
      router.push(`/dashboard/result?${params.toString()}`)
    }}>
      <RoomDesignCard room={room}/>
    </div>
  ))}
</div>
```

---

## CRIAR NOVO DESIGN (/dashboard/create-new)

### Arquivo: `app/dashboard/create-new/page.jsx`

### Estados do Componente:
```javascript
const [formData, setFormData] = useState([]);
const [loading, setLoading] = useState(false);
const [errorMsg, setErrorMsg] = useState('');
const [orgImage, setOrgImage] = useState();
```

### Componentes do Formulário:

#### 1. ImageSelection
- **Upload de imagem**: Drag & drop ou click
- **Validação**: Tipos permitidos (jpg, png, etc.)
- **Preview**: Thumbnail da imagem selecionada

#### 2. RoomType
- **Opções**: Sala, Quarto, Cozinha, Banheiro, etc.
- **Seleção única**: Radio buttons estilizados
- **Validação**: Campo obrigatório

#### 3. DesignType
- **Estilos**: Moderno, Clássico, Minimalista, etc.
- **Preview**: Imagens dos estilos
- **Seleção única**: Cards clicáveis

#### 4. AdditionalReq
- **Campo opcional**: Textarea para requisitos extras
- **Placeholder**: Sugestões de melhorias
- **Limite**: Máximo de caracteres

### Função Principal - GenerateAiImage:

#### Validações Iniciais:
```javascript
if((userDetail?.credits ?? 0) < 1){
  setErrorMsg('Você não tem créditos disponíveis.');
  return;
}

if (!formData?.roomType) {
  throw new Error('Tipo de cômodo é obrigatório!');
}

if (!formData?.designType) {
  throw new Error('Tipo de design é obrigatório!');
}

if (!formData?.image) {
  throw new Error('Imagem é obrigatória!');
}
```

#### Fluxo de Processamento:
1. **Upload da imagem original** → `SaveRawImageToSupabase()`
2. **Chamada da API** → `/api/redesign-room`
3. **Atualização de créditos** → Context update
4. **Redirecionamento** → `/dashboard/result`

#### Tratamento de Erros:
```javascript
catch (error) {
  const serverCode = error?.response?.data?.code;
  if(serverCode === 'NO_CREDITS'){
    setErrorMsg('Você ficou sem créditos.');
  } else {
    setErrorMsg(error?.response?.data?.error || error.message);
  }
}
```

### Componente CustomLoading:
- **Modal overlay**: Loading durante geração
- **Progress indicator**: Barra de progresso animada
- **Mensagens dinâmicas**: Etapas do processamento

---

## RESULTADO (/dashboard/result)

### Arquivo: `app/dashboard/result/page.jsx`

### Parâmetros da URL:
```javascript
const params = new URLSearchParams({
  aiImage: result.data.result,
  orgImage: rawImageUrl,
  roomType: formData.roomType,
  designType: formData.designType,
  id: room.id // para identificação única
});
```

### Funcionalidades da Página:
1. **Comparação Lado a Lado**: Imagem original vs gerada
2. **Zoom/Lightbox**: Visualização ampliada
3. **Download**: Baixar imagem gerada
4. **Compartilhamento**: Links sociais
5. **Novo Design**: Botão para criar outro
6. **Informações**: Detalhes do design gerado

### Componentes Utilizados:
- **ImageLightbox**: Modal para zoom
- **AiOutputDialog**: Exibição de resultado
- **ShareButtons**: Compartilhamento social

---

## COMPRAR CRÉDITOS (/dashboard/buy-credits)

### Arquivo: `app/dashboard/buy-credits/page.jsx`

### Planos Disponíveis:
```javascript
const creditsOption = [
  { 
    id:'plan_50', 
    credits: 50, 
    amountBRL: 44.90, 
    label: '50 Imagens',
    desc: '50 redecorações de ambiente',
    best: false 
  },
  { 
    id:'plan_100', 
    credits: 100, 
    amountBRL: 84.90, 
    label: '100 Imagens',
    desc: '100 redecorações de ambiente',
    best: true 
  },
  { 
    id:'plan_500', 
    credits: 500, 
    amountBRL: 184.90, 
    label: '500 Imagens',
    desc: '500 redecorações de ambiente',
    best: false 
  }
];
```

### Estados do Componente:
```javascript
const [loadingPlanId, setLoadingPlanId] = useState(null);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(null);
```

### Função startCheckout:
```javascript
const startCheckout = async (plan) => {
  if (!plan || loading || loadingPlanId || !userDetail?.email) return;
  
  setLoading(true);
  setLoadingPlanId(plan.id);
  
  try {
    const resp = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        credits: plan.credits, 
        userEmail: userDetail.email 
      })
    });
    
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error);
    
    window.location.href = data.url;
  } catch (e) {
    setMessage({ type: 'error', text: e.message });
  }
};
```

### Feedback Pós-Pagamento:
```javascript
useEffect(() => {
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  
  if (success) {
    setMessage({ 
      type: 'success', 
      text: 'Pagamento concluído! Seus créditos serão adicionados em instantes.' 
    });
  } else if (canceled) {
    setMessage({ 
      type: 'error', 
      text: 'Pagamento cancelado.' 
    });
  }
}, [searchParams]);
```

---

## COMPONENTES REUTILIZÁVEIS

### Header.jsx
- **Localização**: `app/dashboard/_components/Header.jsx`
- **Funcionalidades**:
  - Logo clicável (volta ao dashboard)
  - Contador de créditos (link para compra)
  - UserButton do Clerk
  - Navegação responsiva

### RoomDesignCard.jsx
- **Props**: `room` object
- **Funcionalidades**:
  - Preview da imagem original
  - Overlay com informações
  - Click para abrir resultado
  - Loading state

### EmptyState.jsx
- **Função**: Primeira visita sem designs
- **Elementos**:
  - Ilustração ou ícone
  - Título motivacional
  - Botão CTA para criar primeiro design
  - Tips de uso

### AiOutputDialog.jsx
- **Função**: Modal de resultado
- **Recursos**:
  - Comparação lado a lado
  - Controles de zoom
  - Botões de ação (download, compartilhar)
  - Informações técnicas

---

## APIS E SERVIÇOS

### /api/verify-user
- **Método**: POST
- **Função**: Criar/verificar usuário no Supabase
- **Input**: Objeto user do Clerk
- **Output**: Dados do usuário com créditos

### /api/redesign-room
- **Método**: POST
- **Função**: Gerar design com IA
- **Input**: imageUrl, roomType, designType, userEmail
- **Output**: URL da imagem gerada
- **Processo**:
  1. Validar créditos
  2. Chamar Replicate AI
  3. Upload da imagem gerada
  4. Salvar no banco
  5. Debitar crédito

### /api/stripe/create-checkout-session
- **Método**: POST
- **Função**: Criar sessão de pagamento
- **Input**: credits, userEmail
- **Output**: URL do checkout Stripe

---

## CONFIGURAÇÃO DE MIDDLEWARE

### Proteção de Rotas:
```javascript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
  ignoredRoutes: ["/api/webhook", "/api/stripe/webhook"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

Esta documentação cobre todos os aspectos técnicos e funcionais de cada página da aplicação, fornecendo detalhes suficientes para reconstrução completa.
