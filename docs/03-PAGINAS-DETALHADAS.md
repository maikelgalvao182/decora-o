# 📄 Documentação Detalhada das Páginas - AI Room Redesign

## 🏠 Landing Page (`/app/page.js`)

### Visão Geral
Página inicial da aplicação que apresenta o produto e converte visitantes em usuários.

### Estrutura da Página
```jsx
1. Header
2. Hero Section
3. Como Usar (4 Steps)
4. Exemplos de Transformação
5. Preços/Planos
6. Depoimentos
7. FAQ
8. Footer
```

### Componentes Utilizados
- `Header` - Navegação principal
- `Button` - CTAs de conversão
- `Image` - Exemplos visuais

### Seções Detalhadas

#### 1. Hero Section
```jsx
// Elementos principais:
- Headline: "Transforme Sua Casa em Segundos"
- Subtítulo: Explicação do produto
- Avatares de clientes satisfeitos
- Rating com 5 estrelas
- CTA principal: "Começar Agora"
- Imagens antes/depois
```

**Copy Principal:**
```
"Transforme Sua Casa em Segundos com Inteligência Artificial"
"Redesenhe qualquer ambiente da sua casa usando IA avançada"
```

#### 2. Como Usar (Steps)
```jsx
// 4 passos explicados com ícones
Step 1: "Tire Uma Foto Do Seu Ambiente"
Step 2: "Escolha O Estilo"
Step 3: "Aguarde a IA Trabalhar"
Step 4: "Baixe Seu Design"
```

#### 3. Transformações
```jsx
// Grid de imagens antes/depois
- 4-6 exemplos visuais
- Labels "Antes" e "Depois"
- Diferentes tipos de ambiente
- Diferentes estilos aplicados
```

#### 4. Planos e Preços
```jsx
// 3 opções de créditos
Básico: 3 créditos grátis
Médio: 50 créditos - R$ 44,90
Avançado: 100 créditos - R$ 84,90
Premium: 500 créditos - R$ 184,90
```

### Conversão e CTAs
```jsx
// CTAs estratégicos:
1. Header: "Entrar" / "Cadastrar"
2. Hero: "Começar Agora"
3. Steps: "Experimentar Grátis"
4. Pricing: "Escolher Plano"
5. Footer: "Começar Transformação"
```

### Responsividade
```jsx
// Breakpoints:
Mobile: Stack vertical, text centralizado
Tablet: Grid 2 colunas
Desktop: Grid 3-4 colunas, sidebar
```

---

## 🔐 Autenticação (`/app/(auth)/`)

### Sign In (`/sign-in/[[...sign-in]]/page.jsx`)
```jsx
// Configuração Clerk
<SignIn 
  path="/sign-in"
  routing="path"
  signUpUrl="/sign-up"
  redirectUrl="/dashboard"
/>
```

**Funcionalidades:**
- Login com email/senha
- OAuth (Google, GitHub)
- Esqueceu senha
- Redirect automático pós-login

### Sign Up (`/sign-up/[[...sign-up]]/page.jsx`)
```jsx
// Configuração Clerk
<SignUp 
  path="/sign-up"
  routing="path"
  signInUrl="/sign-in"
  redirectUrl="/dashboard"
/>
```

**Funcionalidades:**
- Cadastro com email/senha
- OAuth (Google, GitHub)
- Verificação de email
- 3 créditos grátis no cadastro

### Fluxo de Onboarding
```
1. Usuário cadastra/faz login
2. Clerk autentica
3. Provider.js detecta novo usuário
4. API verify-user cria/busca no banco
5. Context atualizado com dados
6. Redirect para dashboard
```

---

## 📊 Dashboard (`/dashboard/page.jsx`)

### Visão Geral
Área principal do usuário logado, mostra projetos e estatísticas.

### Layout
```jsx
// Estrutura:
Header (fixo)
└── Saudação + CTA Criar
└── Loading State OU Empty State OU Grid de Projetos
```

### Estados da Página

#### 1. Loading State
```jsx
// Spinner customizado
<div className="spinner-container">
  <div className="dual-ring-spinner" />
</div>
```

#### 2. Empty State (`EmptyState.jsx`)
```jsx
// Quando não há projetos
- Ilustração motivacional
- "Você ainda não criou nenhum design"
- "Comece criando seu primeiro design de ambiente"
- CTA: "Criar Primeiro Design"
```

#### 3. Projects Grid
```jsx
// Grid responsivo
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {projects.map(project => 
    <RoomDesignCard key={project.id} room={project} />
  )}
</div>
```

### Header Dashboard (`Header.jsx`)
```jsx
// Componentes:
- Logo + Link para home
- Display de créditos (clicável)
- Link "Painel"
- UserButton (Clerk)

// Funcionalidades:
- Navegação contextual
- Status de créditos em tempo real
- Menu do usuário (logout, perfil)
```

### RoomDesignCard (`RoomDesignCard.jsx`)
```jsx
// Card de projeto individual
Components:
- Preview da imagem (antes/depois)
- Metadados: data, tipo de cômodo, estilo
- Status: processando/concluído
- Ações: visualizar, baixar, deletar

// Interações:
- Hover effects
- Click para ver detalhes
- Modal de confirmação para deletar
```

### Integração com Dados
```jsx
// Busca projetos do usuário
useEffect(() => {
  if (user) {
    const projects = await AiGeneratedImageSupabase
      .selectByUserEmail(user.primaryEmailAddress.emailAddress);
    setUserRoomList(projects);
  }
}, [user]);
```

---

## 🎨 Criar Novo Projeto (`/dashboard/create-new/page.jsx`)

### Visão Geral
Página para criação de novos redesigns, processo step-by-step.

### Fluxo de Criação
```
1. Upload da Imagem (ImageSelection)
2. Seleção do Tipo de Cômodo (RoomType)
3. Escolha do Estilo (DesignType)
4. Requisitos Adicionais (AdditionalReq)
5. Validação de Créditos
6. Processamento IA
7. Exibição do Resultado
```

### Componentes do Formulário

#### 1. ImageSelection (`_components/ImageSelection.jsx`)
```jsx
// Upload de imagem
Funcionalidades:
- Drag & Drop
- File picker
- Preview da imagem
- Validação de formato (jpg, png, webp)
- Validação de tamanho (max 10MB)
- Crop/resize automático

// Estados:
- Idle: "Arraste uma imagem ou clique para selecionar"
- Uploading: Progress bar
- Success: Preview com opção de trocar
- Error: Mensagem de erro + retry
```

#### 2. RoomType (`_components/RoomType.jsx`)
```jsx
// Seleção do tipo de cômodo
Opções:
- Living Room (Sala de Estar)
- Bedroom (Quarto)
- Kitchen (Cozinha)
- Bathroom (Banheiro)
- Office (Escritório)
- Dining Room (Sala de Jantar)

// Interface:
- Grid de cards com ícones
- Single selection
- Visual feedback do selecionado
```

#### 3. DesignType (`_components/DesignType.jsx`)
```jsx
// Seleção do estilo de design
Opções:
- Modern (Moderno)
- Minimalist (Minimalista)
- Industrial (Industrial)
- Bohemian (Boêmio)
- Traditional (Tradicional)
- Rustic (Rústico)

// Interface:
- Grid com imagens de exemplo
- Hover effects
- Descrição de cada estilo
```

#### 4. AdditionalReq (`_components/AdditionalReq.jsx`)
```jsx
// Requisitos adicionais (opcional)
- TextArea para descrição livre
- Placeholder: "Ex: Adicionar plantas, mudar cor das paredes..."
- Limite de caracteres: 200
- Validação de conteúdo apropriado
```

### Validações
```jsx
// Campos obrigatórios:
✓ Imagem uploadada
✓ Tipo de cômodo selecionado
✓ Estilo de design escolhido
⭕ Requisitos adicionais (opcional)

// Validações de negócio:
✓ Usuário tem créditos suficientes (≥1)
✓ Imagem em formato válido
✓ Tamanho da imagem dentro do limite
```

### Estados de Loading (`CustomLoading.jsx`)
```jsx
// Durante processamento da IA
- Gif animado de loading
- Mensagem motivacional
- "Criando seu design personalizado..."
- Progress indicator estimado
- Não permite cancelar (commitment)
```

### Fluxo de Submissão
```jsx
const GenerateAiImage = async () => {
  // 1. Validar créditos
  if (userDetail.credits < 1) {
    setErrorMsg('Sem créditos');
    return;
  }
  
  // 2. Validar formulário
  if (!formData.roomType || !formData.designType) {
    setErrorMsg('Campos obrigatórios');
    return;
  }
  
  // 3. Processar via API
  setLoading(true);
  const result = await axios.post('/api/redesign-room', {
    imageUrl: orgImage,
    roomType: formData.roomType,
    designType: formData.designType,
    additionalReq: formData.additionalReq,
    userEmail: user.primaryEmailAddress.emailAddress
  });
  
  // 4. Redirect para resultado
  router.push(`/dashboard/result?id=${result.data.id}`);
}
```

---

## 💳 Compra de Créditos (`/dashboard/buy-credits/page.jsx`)

### Visão Geral
Página para compra de pacotes de créditos via Stripe.

### Planos Disponíveis
```jsx
const creditsOption = [
  { 
    id: 'plan_50', 
    credits: 50, 
    amountBRL: 44.90, 
    label: '50 Imagens',
    desc: '50 redecorações de ambiente',
    best: false 
  },
  { 
    id: 'plan_100', 
    credits: 100, 
    amountBRL: 84.90, 
    label: '100 Imagens',
    desc: '100 redecorações de ambiente',
    best: true  // Badge "Mais Popular"
  },
  { 
    id: 'plan_500', 
    credits: 500, 
    amountBRL: 184.90, 
    label: '500 Imagens',
    desc: '500 redecorações de ambiente',
    best: false 
  }
];
```

### Layout da Página
```jsx
// Estrutura:
Header com créditos atuais
└── Grid de planos
    ├── Card Plano 1
    ├── Card Plano 2 (featured)
    └── Card Plano 3
└── FAQ sobre créditos
└── Feedback de transação
```

### Card de Plano
```jsx
// Elementos de cada card:
- Badge "Mais Popular" (se aplicável)
- Quantidade de créditos
- Preço em destaque
- Descrição do que inclui
- Lista de benefícios
- CTA "Comprar Agora"
- Estado de loading durante checkout
```

### Fluxo de Pagamento
```jsx
const startCheckout = async (plan) => {
  // 1. Validações
  if (!plan || !userDetail?.email) return;
  
  // 2. Criar sessão Stripe
  setLoadingPlanId(plan.id);
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({
      credits: plan.credits,
      userEmail: userDetail.email
    })
  });
  
  // 3. Redirect para Stripe Checkout
  const { url } = await response.json();
  window.location.href = url;
}
```

### Estados de Feedback
```jsx
// URL Params após redirect do Stripe:
?success=true → "Pagamento concluído! Créditos adicionados."
?canceled=true → "Pagamento cancelado."

// Estados visuais:
- Loading: Spinner no botão selecionado
- Success: Banner verde com confirmação
- Error: Banner vermelho com erro
```

---

## 🖼️ Visualização de Resultado (`/dashboard/result/page.jsx`)

### Visão Geral
Página para visualizar o resultado do redesign gerado pela IA.

### Parâmetros de URL
```jsx
// Query params esperados:
?orgImage=url_imagem_original
&aiImage=url_imagem_ai
&roomType=tipo_comodo
&designType=estilo_design
&id=project_id
```

### Layout da Página
```jsx
// Estrutura responsiva:
Desktop: Duas colunas lado a lado
Mobile: Stack vertical

// Componentes:
- Header com navegação
- Comparação Antes/Depois
- Metadados do projeto
- Ações (Download, Compartilhar, Nova Geração)
```

### Comparação de Imagens
```jsx
// Componente de comparação:
<div className="comparison-container">
  <div className="before-image">
    <label>Antes</label>
    <Image src={orgImage} alt="Original" />
  </div>
  <div className="after-image">
    <label>Depois</label>
    <Image src={aiImage} alt="AI Generated" />
  </div>
</div>

// Funcionalidades:
- Slider de comparação (opcional)
- Zoom nas imagens
- Lightbox para tela cheia
- Download em alta resolução
```

### Metadados do Projeto
```jsx
// Informações exibidas:
- Data de criação
- Tipo de cômodo
- Estilo aplicado
- Requisitos adicionais (se houver)
- Tempo de processamento
- Resolução das imagens
```

### Ações Disponíveis
```jsx
// Botões de ação:
1. "Baixar Resultado" → Download da imagem AI
2. "Baixar Original" → Download da imagem original
3. "Compartilhar" → Link ou redes sociais
4. "Criar Variação" → Nova geração com mesma base
5. "Voltar ao Dashboard" → Navegação
```

### Estados de Carregamento
```jsx
// Enquanto imagens carregam:
- Skeleton placeholder
- Progress de carregamento
- Lazy loading para performance

// Error states:
- Imagem não encontrada
- Erro de rede
- Projeto não existe
```

---

## 🔄 Fluxos de Navegação

### Fluxo Principal (Happy Path)
```
Landing → Cadastro → Dashboard → Create New → Processing → Result → Dashboard
```

### Fluxos Alternativos
```
// Usuário sem créditos:
Create New → Validação → Buy Credits → Payment → Create New

// Usuário retornando:
Login → Dashboard → Result (projeto anterior)

// Usuário explorando:
Landing → Sign In → Dashboard → Browse Results
```

### Navegação entre páginas
```jsx
// Breadcrumbs implícitos:
Dashboard > Criar Novo > Resultado
Dashboard > Comprar Créditos
Dashboard > Projeto [ID]
```

---

## 📱 Responsividade Global

### Breakpoints
```jsx
// Tailwind breakpoints utilizados:
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Adaptações por Tela
```jsx
// Mobile (< 640px):
- Menu hamburger
- Stack vertical
- Botões full-width
- Grid single column

// Tablet (640px - 1024px):
- Grid 2 colunas
- Sidebar colapsível
- Botões medium size

// Desktop (> 1024px):
- Grid 3-4 colunas
- Sidebar fixa
- Hover effects
- Tooltips
```

---

**Documentação Completa:**
1. [01-ARQUITETURA-GERAL.md](./01-ARQUITETURA-GERAL.md) ✅
2. [02-SERVICOS-E-COMPONENTES.md](./02-SERVICOS-E-COMPONENTES.md) ✅
3. [03-PAGINAS-DETALHADAS.md](./03-PAGINAS-DETALHADAS.md) ✅

**Esta documentação permite a reconstrução completa da aplicação AI Room Redesign com fidelidade técnica e funcional.**
