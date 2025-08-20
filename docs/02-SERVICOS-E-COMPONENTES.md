# 🔧 Serviços e Componentes - AI Room Redesign

## 📦 Estrutura de Componentes

### Componentes UI Base (shadcn/ui)
Localizados em `/components/ui/`

#### 1. Button (`button.jsx`)
```jsx
// Componente base para botões com variantes
variants: {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  }
}
```

#### 2. Select (`select.jsx`)
- Dropdown customizado baseado em Radix UI
- Suporte a múltiplas opções
- Acessibilidade completa

#### 3. Alert Dialog (`alert-dialog.jsx`)
- Modais de confirmação
- Usado para ações críticas (deletar, confirmar pagamento)

#### 4. TextArea (`textarea.jsx`)
- Input de texto multilinha
- Usado para requisitos adicionais do usuário

#### 5. Empty State (`empty-state.jsx`)
- Componente para estados vazios
- Usado quando não há projetos ou créditos

## 🏗️ Componentes de Negócio

### Dashboard Components (`/app/dashboard/_components/`)

#### 1. Header (`Header.jsx`)
**Responsabilidades:**
- Navegação principal
- Exibição de créditos do usuário
- Botão de usuário (Clerk)
- Link para compra de créditos

**Props:** Nenhuma (usa Context)
**Context:** `UserDetailContext`

```jsx
// Funcionalidades principais:
- Logo + navegação para home
- Display de créditos (clicável para comprar mais)
- Link para dashboard
- UserButton do Clerk
```

#### 2. Listing (`Listing.jsx`)
**Responsabilidades:**
- Listagem de projetos do usuário
- Grid responsivo de cards
- Estados vazios

**Integração:** Consulta API para buscar projetos

#### 3. RoomDesignCard (`RoomDesignCard.jsx`)
**Responsabilidades:**
- Preview de projeto individual
- Ações (visualizar, baixar, deletar)
- Metadados do projeto (data, tipo)

#### 4. AiOutputDialog (`AiOutputDialog.jsx`)
**Responsabilidades:**
- Modal para exibir resultado da IA
- Comparação antes/depois
- Ações de download e compartilhamento

#### 5. ImageLightbox (`ImageLightbox.jsx`)
**Responsabilidades:**
- Visualização em tela cheia
- Navegação entre imagens
- Zoom e pan

#### 6. EmptyState (`EmptyState.jsx`)
**Responsabilidades:**
- Estado quando não há projetos
- Call-to-action para criar primeiro projeto
- Ilustração e texto motivacional

## 🔄 Gerenciamento de Estado

### Context API

#### 1. UserDetailContext (`/app/_context/UserDetailContext.jsx`)
**Dados Gerenciados:**
```jsx
{
  userDetail: {
    id: number,
    name: string,
    email: string,
    credits: number,
    image_url: string,
    created_at: string
  },
  setUserDetail: function
}
```

**Consumidores:**
- Header (exibição de créditos)
- Dashboard (validação de acesso)
- Create New (verificação de créditos)

### Provider Principal (`/app/provider.js`)
**Responsabilidades:**
- Inicialização do UserDetailContext
- Verificação automática de usuário no login
- Sincronização com Clerk

**Fluxo:**
1. Usuário faz login via Clerk
2. Provider detecta mudança
3. Chama API `/api/verify-user`
4. Atualiza context com dados do usuário

## 🛠️ Serviços Backend

### API Routes (`/app/api/`)

#### 1. Verify User (`/api/verify-user/route.jsx`)
**Método:** POST
**Função:** Verificar/criar usuário no banco

**Fluxo:**
```
1. Recebe dados do Clerk
2. Consulta usuário por email
3. Se não existe: cria com 3 créditos
4. Se existe: retorna dados atuais
5. Retorna dados do usuário
```

**Input:**
```json
{
  "user": {
    "primaryEmailAddress": {"emailAddress": "user@email.com"},
    "fullName": "Nome Usuário",
    "imageUrl": "https://clerk-image-url"
  }
}
```

**Output:**
```json
{
  "result": {
    "id": 1,
    "name": "Nome Usuário",
    "email": "user@email.com",
    "credits": 3,
    "image_url": "https://clerk-image-url"
  }
}
```

#### 2. Redesign Room (`/api/redesign-room/route.jsx`)
**Método:** POST
**Função:** Processar redesign via IA

**Fluxo Completo:**
```
1. Validar créditos do usuário
2. Fazer upload da imagem para Supabase Storage
3. Preparar prompt para IA
4. Chamar Replicate API
5. Fazer upload do resultado
6. Decrementar créditos
7. Salvar projeto no banco
8. Retornar URLs das imagens
```

**Input:**
```json
{
  "imageUrl": "base64_image_data",
  "roomType": "Living Room",
  "designType": "Modern",
  "additionalReq": "Add plants",
  "userEmail": "user@email.com",
  "width": 1024,
  "height": 1024,
  "upscale": true
}
```

**Validações:**
- Usuário tem créditos suficientes
- Imagem em formato válido
- Parâmetros obrigatórios presentes

**Integração com IA:**
```jsx
// Modelo Replicate usado
const MODEL_NAME = "adirik/interior-design";
const input = {
  image: imageUrl,
  room_type: roomType,
  design_style: designType,
  additional_requirements: additionalReq,
  num_inference_steps: 50,
  guidance_scale: 7.5
};
```

#### 3. Stripe Integration (`/api/stripe/`)
**Webhooks:** Atualização automática de créditos
**Payment Intents:** Criação de pagamentos
**Products:** Pacotes de créditos

### Database Operations (`/config/supabaseDb.js`)

#### 1. UsersSupabase
**Métodos:**
- `insert(userData)` - Criar usuário
- `update(email, updateData)` - Atualizar dados
- `selectByEmail(email)` - Buscar por email
- `selectAll()` - Listar todos

#### 2. AiGeneratedImageSupabase
**Métodos:**
- `insert(imageData)` - Salvar projeto
- `selectByUserEmail(userEmail)` - Projetos do usuário
- `selectAll()` - Todos os projetos

## 🎨 Sistema de Estilos

### TailwindCSS Configuration
```js
// Cores personalizadas
colors: {
  primary: "#4F46E5",      // Roxo principal
  secondary: "#F3F4F6",    // Cinza claro
  accent: "#10B981",       // Verde accent
  destructive: "#EF4444"   // Vermelho para ações destrutivas
}

// Fonte personalizada
fontFamily: {
  sans: ['Outfit', 'sans-serif']
}
```

### CSS Modules
- `globals.css` - Reset e estilos globais
- `ai-result-modal.css` - Estilos específicos do modal

## 🔐 Autenticação e Autorização

### Clerk Integration
**Configuração:**
```jsx
<ClerkProvider localization={ptBR}>
  {/* App content */}
</ClerkProvider>
```

**Hooks Utilizados:**
- `useUser()` - Dados do usuário logado
- `useAuth()` - Status de autenticação
- `SignIn`, `SignUp` - Componentes de auth

**Middleware:** Proteção de rotas `/dashboard/*`

### Fluxo de Autenticação
```
1. Usuário acessa página protegida
2. Middleware redireciona para login se não autenticado
3. Após login, Provider.js verifica/cria usuário
4. Context é populado com dados do usuário
5. Usuário tem acesso às funcionalidades
```

## 📊 Monitoramento e Logs

### Console Logs (Desenvolvimento)
```jsx
// Padrão de logs implementado
console.log('🚀 API chamada recebida:', dados);
console.error('❌ Erro:', erro);
console.log('✅ Sucesso:', resultado);
```

### Error Handling
- Try/catch em todas as APIs
- Error boundaries em componentes críticos
- Fallbacks para estados de erro

## 🔄 Fluxos de Dados

### Upload e Processamento
```
Upload Image → Supabase Storage → Replicate AI → Process → Save Result → Update Credits → Return URLs
```

### Sincronização de Créditos
```
Stripe Payment → Webhook → Update Database → Refresh Context → Update UI
```

### Carregamento de Projetos
```
Component Mount → API Call → Database Query → Format Data → Update State → Render UI
```

---

**Próximo Documento:**
- [03-PAGINAS-DETALHADAS.md](./03-PAGINAS-DETALHADAS.md) - Documentação detalhada de cada página
