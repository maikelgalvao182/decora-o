# 06 - DOCUMENTAÇÃO COMPLETA DE COMPONENTES E SERVIÇOS

## COMPONENTES DE UI CUSTOMIZADOS

### ImageSelection.jsx
**Localização**: `app/dashboard/create-new/_components/ImageSelection.jsx`

#### Funcionalidades:
- **Upload por click ou drag & drop**
- **Preview da imagem selecionada**
- **Validação de tipos de arquivo**
- **UI responsiva com feedback visual**

#### Props:
```javascript
selectedImage: Function // Callback que recebe o arquivo selecionado
```

#### Estados Internos:
```javascript
const [file, setFile] = useState(); // Arquivo selecionado
```

#### Lógica Principal:
```javascript
const onFileSelected = (event) => {
  console.log(event.target.files[0]);
  setFile(event.target.files[0])
  selectedImage(event.target.files[0]) // Envia para componente pai
}
```

#### UI Condicional:
- **Sem arquivo**: Área de upload com ícone e texto
- **Com arquivo**: Preview da imagem em tamanho completo
- **Hover effects**: Sombra e escala para feedback

#### Validações:
- `accept='image/*'` - Apenas arquivos de imagem
- Preview com `URL.createObjectURL(file)`

---

### RoomType.jsx
**Localização**: `app/dashboard/create-new/_components/RoomType.jsx`

#### Funcionalidades:
- **Seleção de tipo de ambiente**
- **Lista abrangente de opções**
- **Componente Select do Radix UI**

#### Opções Disponíveis (30+ tipos):
```javascript
const roomTypes = [
  "Living Room" => "Sala de Estar",
  "Bedroom" => "Quarto", 
  "Children's Room" => "Quarto Infantil",
  "Baby Room" => "Quarto do Bebê",
  "Kitchen" => "Cozinha",
  "Office" => "Escritório",
  "Bathroom" => "Banheiro",
  "Backyard" => "Quintal",
  "Store" => "Loja",
  "Restaurant" => "Restaurante",
  "Facade" => "Fachada",
  "Dining Room" => "Sala de Jantar",
  "Laundry Room" => "Lavanderia",
  "Garage" => "Garagem",
  "Balcony" => "Varanda",
  "Closet" => "Closet",
  "Gym" => "Academia",
  "Workshop" => "Oficina",
  "Coffee Shop" => "Cafeteria",
  "Coworking Space" => "Coworking",
  "Hotel Lobby" => "Lobby de hotel",
  // ... mais opções
];
```

#### Props:
```javascript
selectedRoomType: Function // Callback com valor selecionado
```

#### Estrutura do Componente:
```javascript
<Select onValueChange={(value) => selectedRoomType(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Tipo de Ambiente" />
  </SelectTrigger>
  <SelectContent>
    {roomTypes.map(type => (
      <SelectItem value={type.value}>{type.label}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

### DesignType.jsx
**Localização**: `app/dashboard/create-new/_components/DesignType.jsx`

#### Funcionalidades:
- **Grid visual de estilos de design**
- **50+ opções de estilos diferentes**
- **Preview com imagens dos estilos**
- **Seleção visual com borda destacada**

#### Array de Designs:
```javascript
const Designs = [
  { name: 'Modern', image: '/estilos/modern.jpeg', displayName: 'Moderno' },
  { name: 'Minimalist', image: '/estilos/minimalist.jpeg', displayName: 'Minimalista' },
  { name: 'Scandinavian', image: '/estilos/scandinavian.jpeg', displayName: 'Escandinavo' },
  { name: 'Contemporary', image: '/estilos/contemporary.jpeg', displayName: 'Contemporâneo' },
  { name: 'Luxury', image: '/estilos/luxury.jpeg', displayName: 'Luxo' },
  { name: 'Industrial', image: '/estilos/industrial.jpeg', displayName: 'Industrial' },
  { name: 'Bohemian', image: '/estilos/bohemian.jpeg', displayName: 'Boêmio' },
  { name: 'Japanese Design', image: '/estilos/japanese-design.jpeg', displayName: 'Design Japonês' },
  { name: 'Art Deco', image: '/estilos/art-deco.jpeg', displayName: 'Art Déco' },
  { name: 'Cyberpunk', image: '/estilos/cyberpunk.jpeg', displayName: 'Cyberpunk' },
  // ... 40+ estilos adicionais
];
```

#### Estados:
```javascript
const [selectedOption, setSelectedOption] = useState();
```

#### Grid Responsivo:
```javascript
<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
  {Designs.map((design, index) => (
    <div 
      key={index} 
      onClick={() => {
        setSelectedOption(design.name);
        selectedDesignType(design.name)
      }} 
      className='cursor-pointer'
    >
      <Image 
        src={design.image} 
        width={100} 
        height={100} 
        alt={`Estilo ${design.displayName}`}
        className={`w-full h-[80px] rounded-md object-cover 
        hover:scale-105 transition-all 
        ${design.name == selectedOption && 'border-2 border-primary p-1'}`}
      />
      <h2 className='text-xs font-medium text-center mt-2'>
        {design.displayName}
      </h2>
    </div>
  ))}
</div>
```

#### Área Scrollável:
- **Container**: `h-[218px] overflow-y-auto`
- **Background**: `bg-gray-50` com border
- **Padding**: `p-4` para espaçamento interno

---

### AdditionalReq.jsx
**Localização**: `app/dashboard/create-new/_components/AdditionalReq.jsx`

#### Funcionalidades:
- **Campo opcional para requisitos extras**
- **Textarea responsiva**
- **Placeholder com exemplos**

#### Estrutura:
```javascript
function AdditionalReq({additionalRequirementInput}) {
  return (
    <div className='mt-5'>
      <label className='text-gray-400'>
        Digite Requisitos Adicionais (Opcional)
      </label>
      <Textarea 
        className="mt-2" 
        placeholder="Ex: cores específicas, móveis que devem permanecer, estilo preferido..." 
        onChange={(e) => additionalRequirementInput(e.target.value)} 
      />
    </div>
  )
}
```

#### Exemplos de Uso:
- "Manter a mesa de centro atual"
- "Usar cores neutras e tons de azul"
- "Adicionar plantas verdes"
- "Estilo mais aconchegante"

---

### CustomLoading.jsx
**Localização**: `app/dashboard/create-new/_components/CustomLoading.jsx`

#### Funcionalidades:
- **Overlay fullscreen durante geração**
- **Spinner animado customizado**
- **Mensagens instrucionais**
- **Prevenção de fechamento acidental**

#### Estrutura:
```javascript
function CustomLoading({loading}) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner duplo */}
        <div className="relative">
          <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin"></div>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        
        {/* Textos informativos */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Redesenhando seu ambiente...
          </h2>
          <p className="text-gray-600">
            Não atualize a página
          </p>
        </div>
      </div>
    </div>
  )
}
```

#### Props:
```javascript
loading: Boolean // Controla exibição do modal
```

---

### RoomDesignCard.jsx
**Localização**: `app/dashboard/_components/RoomDesignCard.jsx`

#### Funcionalidades:
- **Exibição de design criado**
- **Preview da imagem gerada**
- **Informações do tipo e estilo**
- **Click para abrir resultado completo**

#### Props:
```javascript
room: Object // Objeto com dados do design
{
  aiImage: string,        // URL da imagem gerada
  orgImage: string,       // URL da imagem original
  roomType: string,       // Tipo do ambiente
  designType: string,     // Estilo do design
  id: number,            // ID único
  created_at: timestamp   // Data de criação
}
```

#### Traduções Integradas:
```javascript
const roomTypeTranslations = {
  'Living Room': 'Sala de Estar',
  'Bedroom': 'Quarto',
  'Kitchen': 'Cozinha',
  'Office': 'Escritório',
  // ... mapeamento completo
};

const designTypeTranslations = {
  'Modern': 'Moderno',
  'Traditional': 'Tradicional',
  'Minimalist': 'Minimalista',
  'Industrial': 'Industrial',
  // ... mapeamento completo
};
```

#### Lógica de Imagem:
```javascript
let displayImage = room?.aiImage || room?.ai_image || room?.orgImage || room?.org_image;

// Reconstruir URL se necessário
if (displayImage && !displayImage.startsWith('http')) {
  const cleanPath = displayImage.replace(/^\/+/, '');
  displayImage = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${cleanPath}`;
}
```

#### Estrutura Visual:
- **Container**: Border com hover effect
- **Imagem**: `180px` altura, object-cover
- **Overlay**: Informações sobre a imagem
- **Error Handling**: Fallback para imagens quebradas

---

### EmptyState.jsx
**Localização**: `app/dashboard/_components/EmptyState.jsx`

#### Funcionalidades:
- **Estado inicial sem designs**
- **Ícones ilustrativos**
- **Botão CTA para criar primeiro design**
- **Mensagem motivacional**

#### Estrutura:
```javascript
function EmptyState() {
  const router = useRouter()

  return (
    <div className='w-full mt-10'>
      <ShadcnEmptyState 
        title="Crie seu primeiro design de ambiente"
        description="Ainda não há designs criados."
        icons={[Palette, Sparkles, Home]}
        action={{
          label: "+ Criar Design",
          onClick: () => router.push('/dashboard/create-new')
        }}
      />
    </div>
  )
}
```

#### Ícones Utilizados:
- **Palette**: Representando criatividade
- **Sparkles**: Representando IA/magia
- **Home**: Representando ambiente/casa

---

## SERVIÇOS E CONFIGURAÇÕES

### supabaseConfig.js
**Localização**: `config/supabaseConfig.js`

#### Configuração do Cliente:
```javascript
import { createClient } from '@supabase/supabase-js'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Normalização da URL
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.replace(/\/+$/, '')
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const STORAGE_BUCKET = 'room-images'
export const SUPABASE_URL = supabaseUrl
```

#### Validações de Ambiente:
```javascript
if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL não configurada corretamente.')
}
if (!supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
  console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada corretamente.')
}
```

---

### supabaseDb.js
**Localização**: `config/supabaseDb.js`

#### UsersSupabase - Operações de Usuário:
```javascript
export const UsersSupabase = {
  // Inserir novo usuário
  async insert(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data
  },

  // Atualizar usuário por email
  async update(email, updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('email', email)
      .select()
    
    if (error) throw error
    return data
  },

  // Buscar usuário por email
  async selectByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
    
    if (error) throw error
    return data
  },

  // Buscar todos os usuários
  async selectAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw error
    return data
  }
}
```

#### AiGeneratedImageSupabase - Operações de Imagens:
```javascript
export const AiGeneratedImageSupabase = {
  // Inserir nova imagem AI
  async insert(imageData) {
    const { data, error } = await supabase
      .from('ai_generated_image')
      .insert([imageData])
      .select()
    
    if (error) throw error
    return data
  },

  // Buscar imagens por email do usuário
  async selectByUserEmail(userEmail) {
    const { data, error } = await supabase
      .from('ai_generated_image')
      .select('*')
      .eq('user_email', userEmail)
      .order('id', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Buscar todas as imagens
  async selectAll() {
    const { data, error } = await supabase
      .from('ai_generated_image')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data
  }
}
```

---

## ASSETS E RECURSOS NECESSÁRIOS

### Imagens de Estilos (/estilos/):
```
modern.jpeg
minimalist.jpeg  
simple.jpeg
scandinavian.jpeg
contemporary.jpeg
luxury.jpeg
french.jpeg
airbnb.jpeg
neoclassic.jpeg
boho-chic.jpeg
futuristic.jpeg
tropical.jpeg
midcentury-modern.jpeg
traditional.jpeg
cottagecore.jpeg
modern-boho.jpeg
parisian.jpeg
zen.jpeg
eclectic.jpeg
industrial.jpeg
eco-friendly.jpeg
bohemian.jpeg
mediterranean.jpeg
farmhouse.jpeg
retro-futuristic.jpeg
french-country.jpeg
japanese-design.jpeg
vintage.jpeg
retro.jpeg
art-deco.jpeg
coastal.jpeg
hollywood-glam.jpeg
gaming-room.jpeg
sketch.jpeg
biophilic.jpeg
shabby-chic.jpeg
gothic.jpeg
tribal.jpeg
christmas.jpeg
baroque.jpeg
rustic.jpeg
nautical.jpeg
maximalist.jpeg
art-nouveau.jpeg
easter.jpeg
ski-chalet.jpeg
halloween.jpeg
hot-pink.jpeg
medieval.jpeg
cyberpunk.jpeg
chinese-new-year.jpeg
vaporwave.jpeg
```

### Avatares (/avatar/):
```
Female.jpg
Female (1).jpg
avatar2.jpg
Female (2).jpg
avatar3.jpg
```

### Logo e Ícones:
```
logo.svg
loading.gif
```

---

## PADRÕES DE DESENVOLVIMENTO

### Convenções de Nomenclatura:
- **Componentes**: PascalCase (ImageSelection.jsx)
- **Funções**: camelCase (selectedImage, onFileSelected)
- **Constantes**: UPPER_CASE (STORAGE_BUCKET)
- **CSS Classes**: kebab-case via Tailwind

### Estrutura de Props:
```javascript
// Sempre documentar props esperadas
function ComponentName({
  requiredProp,     // string - Descrição obrigatória
  optionalProp,     // string? - Descrição opcional
  callbackProp      // Function - Callback description
}) {
  // Implementação
}
```

### Padrão de Estados:
```javascript
// Estados locais com useState
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState([]);

// Context para dados globais
const { userDetail, setUserDetail } = useContext(UserDetailContext);
```

### Error Handling:
```javascript
try {
  // Operação que pode falhar
  const result = await asyncOperation();
  setData(result);
} catch (error) {
  console.error('Descrição do erro:', error);
  setError(error.message || 'Erro genérico');
} finally {
  setLoading(false);
}
```

Esta documentação cobre todos os componentes, serviços e padrões necessários para reconstruir a aplicação com precisão.
