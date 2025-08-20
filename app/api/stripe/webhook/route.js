import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/config/supabaseConfig';

// App Router: para desabilitar parsing automático (stream), usar runtime e size opcional
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Necessário capturar o corpo como buffer manualmente (App Router já fornece Request). Vamos reutilizar streaming.
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const buf = await buffer(req.body ?? req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userEmail = session.metadata?.userEmail;
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (userEmail && credits > 0) {
      try {
        // Idempotência: verificar se já processamos este session.id
        const { data: existing, error: existingErr } = await supabase
          .from('purchased_sessions')
          .select('id')
          .eq('id', session.id)
          .maybeSingle();

        if (existingErr) {
          console.error('Erro ao verificar sessão existente', existingErr);
        }
        if (!existing) {
          // Atualizar créditos
            const { data: userRow, error: userErr } = await supabase
              .from('users')
              .select('id,credits')
              .eq('email', userEmail)
              .single();
            if (!userErr && userRow) {
              const newCredits = (userRow.credits || 0) + credits;
              const { error: updErr } = await supabase
                .from('users')
                .update({ credits: newCredits })
                .eq('id', userRow.id);
              if (updErr) console.error('Erro ao atualizar créditos', updErr);
            }
            // Registrar sessão
            const { error: insertErr } = await supabase
              .from('purchased_sessions')
              .insert({ id: session.id, user_email: userEmail, credits_added: credits, processed_at: new Date().toISOString() });
            if (insertErr) console.error('Erro ao inserir purchased_sessions', insertErr);
        }
      } catch (e) {
        console.error('Erro ao processar checkout.session.completed', e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
