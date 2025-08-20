# 07 - DOCUMENTAÇÃO COMPLETA DAS APIs

## OVERVIEW DAS APIS

### Estrutura das API Routes:
```
/api/
├── verify-user/          # Verificação/criação de usuário
├── redesign-room/        # Geração de imagem com IA
└── stripe/
    ├── create-checkout-session/  # Criar sessão de pagamento
    └── webhook/                  # Webhook de confirmação
```

---

## API: /api/verify-user

### Arquivo: `app/api/verify-user/route.jsx`

#### Método: POST

#### Função:
Verifica se o usuário existe no banco Supabase, se não existir cria um novo usuário com créditos iniciais.

#### Input (Body JSON):
```json
{
  "user": {
    "fullName": "João Silva",
    "primaryEmailAddress": {
      "emailAddress": "joao@email.com"
    },
    "imageUrl": "https://clerk.dev/avatar.jpg"
  }
}
```

#### Fluxo de Processamento:
```javascript
export async function POST(req) {
  const { user } = await req.json();

  try {
    // 1. Verificar se usuário já existe
    const userInfo = await UsersSupabase.selectByEmail(
      user?.primaryEmailAddress.emailAddress
    );
    
    // 2. Se não existir, criar novo usuário
    if (userInfo?.length == 0) {
      const newUser = {
        name: user?.fullName,
        email: user?.primaryEmailAddress.emailAddress,
        image_url: user?.imageUrl,
        credits: 3  // Créditos iniciais gratuitos
      };

      const saveResult = await UsersSupabase.insert(newUser);
      return NextResponse.json({'result': saveResult[0]});
    }
    
    // 3. Se existir, retornar dados existentes
    return NextResponse.json({'result': userInfo[0]});
    
  } catch(e) {
    console.error('Error in verify-user API:', e);
    return NextResponse.json({error: e.message});
  }
}
```

#### Output Success:
```json
{
  "result": {
    "id": 123,
    "name": "João Silva",
    "email": "joao@email.com",
    "image_url": "https://clerk.dev/avatar.jpg",
    "credits": 3,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Output Error:
```json
{
  "error": "Descrição do erro"
}
```

#### Integração Frontend:
```javascript
// app/provider.js
const VerifyUser = async () => {
  const dataResult = await axios.post('/api/verify-user', {
    user: user  // Objeto do Clerk
  });
  setUserDetail(dataResult.data.result);
}
```

#### Tratamento de Erros:
- **Database Error**: Erro de conexão Supabase
- **Validation Error**: Dados incompletos do Clerk
- **General Error**: Erros inesperados

---

## API: /api/redesign-room

### Arquivo: `app/api/redesign-room/route.jsx`

#### Método: POST

#### Função:
Gera uma nova imagem de design de ambiente usando IA (Replicate), salva no storage e debita créditos do usuário.

#### Input (Body JSON):
```json
{
  "imageUrl": "https://supabase.co/storage/room-images/original.png",
  "roomType": "Living Room",
  "designType": "Modern",
  "additionalReq": "cores neutras e plantas",
  "userEmail": "joao@email.com",
  "width": 1024,
  "height": 1024,
  "upscale": true
}
```

#### Parâmetros:
- **imageUrl** (required): URL da imagem original no Supabase
- **roomType** (required): Tipo do ambiente
- **designType** (required): Estilo de design
- **additionalReq** (optional): Requisitos adicionais
- **userEmail** (required): Email do usuário para debitar créditos
- **width** (optional): Largura desejada (máx 2048px)
- **height** (optional): Altura desejada (máx 2048px)
- **upscale** (optional): Aplicar upscaling 2x

#### Fluxo Completo:

##### 1. Validação de Créditos:
```javascript
// Buscar usuário e verificar créditos
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

##### 2. Preparação do Input para IA:
```javascript
const safeWidth = typeof width === 'number' && width > 0 ? Math.min(width, 2048) : undefined;
const safeHeight = typeof height === 'number' && height > 0 ? Math.min(height, 2048) : undefined;

const input = {
  image: imageUrl,
  prompt: `A ${roomType || 'room'} with a ${designType || 'modern'} style interior ${additionalReq || ''}`,
  ...(safeWidth ? { width: safeWidth } : {}),
  ...(safeHeight ? { height: safeHeight } : {})
};
```

##### 3. Chamada do Replicate:
```javascript
const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN
});

const baseModel = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";
const output = await replicate.run(baseModel, { input });
```

##### 4. Processamento da Resposta:
```javascript
// Normalizar URL retornada
let generatedUrl = null;
if (typeof output === 'string') {
  generatedUrl = output;
} else if (Array.isArray(output) && output.length > 0) {
  generatedUrl = output[0];
} else if (output && typeof output === 'object') {
  if (output.url) generatedUrl = output.url;
}
```

##### 5. Upscaling Opcional:
```javascript
if (upscale) {
  try {
    const esrganVersion = 'nightmareai/real-esrgan:db21e45f3b4d7dc4ceac2ae15d7a372c1b21e8d52e1f2a550d458facb1613e81';
    const upInput = { image: generatedUrl, scale: 2 };
    const upOutput = await replicate.run(esrganVersion, { input: upInput });
    
    if (typeof upOutput === 'string') finalImageUrl = upOutput;
    else if (Array.isArray(upOutput) && upOutput[0]) finalImageUrl = upOutput[0];
  } catch (upErr) {
    console.warn('Falha no upscaling, continuando com imagem original:', upErr.message);
  }
}
```

##### 6. Conversão e Upload:
```javascript
// Converter para Base64
const base64Image = await ConvertImageToBase64(finalImageUrl);

// Upload para Supabase Storage
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

##### 7. Salvamento no Banco:
```javascript
const imageData = {
  room_type: roomType || 'Unknown',
  design_type: designType || 'Modern',
  org_image: imageUrl,
  ai_image: downloadUrl,
  user_email: userEmail
};

const dbResult = await AiGeneratedImageSupabase.insert(imageData);
```

##### 8. Débito de Créditos:
```javascript
const { data: updatedUser, error: updateCreditErr } = await supabase
  .from('users')
  .update({ credits: (userRow.credits - 1) })
  .eq('id', userRow.id)
  .eq('credits', userRow.credits) // Optimistic lock
  .select('credits')
  .single();
```

#### Output Success:
```json
{
  "result": "https://supabase.co/storage/room-images/generated.png",
  "remainingCredits": 2,
  "meta": {
    "baseModel": "adirik/interior-design:76604...",
    "width": 1024,
    "height": 1024,
    "upscaled": true
  }
}
```

#### Output Error:
```json
{
  "error": "Descrição do erro",
  "code": "NO_CREDITS"  // Código específico quando aplicável
}
```

#### Códigos de Erro:
- **NO_CREDITS**: Usuário sem créditos suficientes
- **VALIDATION_ERROR**: Parâmetros obrigatórios ausentes
- **REPLICATE_ERROR**: Erro na geração IA
- **UPLOAD_ERROR**: Erro no upload Supabase
- **DATABASE_ERROR**: Erro ao salvar no banco

#### Função Auxiliar - ConvertImageToBase64:
```javascript
async function ConvertImageToBase64(imageUrl) {
  const resp = await axios.get(imageUrl, {responseType:'arraybuffer'});
  const base64ImageRaw = Buffer.from(resp.data).toString('base64');
  return "data:image/png;base64," + base64ImageRaw;
}
```

---

## API: /api/stripe/create-checkout-session

### Arquivo: `app/api/stripe/create-checkout-session/route.js`

#### Método: POST

#### Função:
Cria uma sessão de checkout no Stripe para compra de créditos.

#### Input (Body JSON):
```json
{
  "credits": 100,
  "userEmail": "joao@email.com"
}
```

#### Mapeamento de Preços:
```javascript
const PRICE_MAP = {
  '50': process.env.STRIPE_PRICE_50,
  '100': process.env.STRIPE_PRICE_100,
  '500': process.env.STRIPE_PRICE_500
};
```

#### Fluxo de Processamento:
```javascript
export async function POST(req) {
  try {
    const { credits, userEmail } = await req.json();

    // 1. Validação de parâmetros
    if (!credits || !userEmail) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    // 2. Obter Price ID do Stripe
    const priceId = PRICE_MAP[String(credits)];
    if (!priceId || priceId.includes('placeholder')) {
      return NextResponse.json({ error: 'Price ID não configurado' }, { status: 500 });
    }

    // 3. Validar usuário existe
    const { data: userRow, error: userErr } = await supabase
      .from('users')
      .select('id,email')
      .eq('email', userEmail)
      .single();
    
    if (userErr || !userRow) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // 4. Criar sessão Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        userEmail: userEmail,
        credits: String(credits)
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/buy-credits?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/buy-credits?canceled=1`
    });

    return NextResponse.json({ url: session.url });
    
  } catch (e) {
    console.error('Erro Stripe session:', e);
    return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 });
  }
}
```

#### Output Success:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_a1b2c3..."
}
```

#### Output Error:
```json
{
  "error": "Descrição do erro"
}
```

#### Integração Frontend:
```javascript
// app/dashboard/buy-credits/page.jsx
const startCheckout = async (plan) => {
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
  
  window.location.href = data.url; // Redirecionar para Stripe
};
```

---

## API: /api/stripe/webhook

### Arquivo: `app/api/stripe/webhook/route.js`

#### Método: POST

#### Função:
Recebe webhooks do Stripe para confirmar pagamentos e adicionar créditos ao usuário.

#### Configuração Especial:
```javascript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

#### Verificação de Assinatura:
```javascript
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const buf = await buffer(req.body ?? req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  // ... processamento do evento
}
```

#### Processamento de Eventos:
```javascript
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const userEmail = session.metadata?.userEmail;
  const credits = parseInt(session.metadata?.credits || '0', 10);

  if (userEmail && credits > 0) {
    try {
      // 1. Verificar idempotência
      const { data: existing } = await supabase
        .from('purchased_sessions')
        .select('id')
        .eq('id', session.id)
        .maybeSingle();

      if (!existing) {
        // 2. Atualizar créditos do usuário
        const { data: userRow } = await supabase
          .from('users')
          .select('id,credits')
          .eq('email', userEmail)
          .single();
          
        if (userRow) {
          const newCredits = (userRow.credits || 0) + credits;
          await supabase
            .from('users')
            .update({ credits: newCredits })
            .eq('id', userRow.id);
        }

        // 3. Registrar sessão processada
        await supabase
          .from('purchased_sessions')
          .insert({ 
            id: session.id, 
            user_email: userEmail, 
            credits_added: credits, 
            processed_at: new Date().toISOString() 
          });
      }
    } catch (e) {
      console.error('Erro ao processar webhook:', e);
    }
  }
}

return NextResponse.json({ received: true });
```

#### Tabela: purchased_sessions
```sql
CREATE TABLE purchased_sessions (
  id VARCHAR(255) PRIMARY KEY,  -- stripe session.id
  user_email VARCHAR(255) NOT NULL,
  credits_added INTEGER NOT NULL,
  processed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Idempotência:
O webhook usa a tabela `purchased_sessions` para garantir que o mesmo pagamento não seja processado múltiplas vezes, usando o `session.id` do Stripe como chave única.

---

## CONFIGURAÇÕES NECESSÁRIAS

### Variáveis de Ambiente:
```env
# Replicate AI
NEXT_PUBLIC_REPLICATE_API_TOKEN=r8_xxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
STRIPE_PRICE_50=price_xxx...
STRIPE_PRICE_100=price_xxx...
STRIPE_PRICE_500=price_xxx...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# App
NEXT_PUBLIC_SITE_URL=https://yourapp.com
```

### Webhooks Stripe:
- **URL**: `https://yourapp.com/api/stripe/webhook`
- **Eventos**: `checkout.session.completed`
- **Signing Secret**: Configurar no `.env`

### Modelos Replicate:
- **Interior Design**: `adirik/interior-design:76604bad...`
- **Upscaling**: `nightmareai/real-esrgan:db21e45f...`

Esta documentação fornece todos os detalhes técnicos necessários para implementar as APIs da aplicação.
