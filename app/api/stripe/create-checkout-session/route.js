import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/config/supabaseConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

// Mapeamento estático de bundles -> priceId. Substitua pelos reais em produção.
const PRICE_MAP = {
  '50': process.env.STRIPE_PRICE_50 || 'price_50_placeholder',
  '100': process.env.STRIPE_PRICE_100 || 'price_100_placeholder',
  '500': process.env.STRIPE_PRICE_500 || 'price_500_placeholder'
};

export async function POST(req) {
  try {
    const body = await req.json();
  const { credits, userEmail } = body; // credits: 50|100|500

    if (!credits || !userEmail) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const priceId = PRICE_MAP[String(credits)];
    if (!priceId || priceId.includes('placeholder')) {
      return NextResponse.json({ error: 'Price ID não configurado para este bundle.' }, { status: 500 });
    }

    // (Opcional) Validar usuário existe
    const { data: userRow, error: userErr } = await supabase
      .from('users')
      .select('id,email')
      .eq('email', userEmail)
      .single();
    if (userErr || !userRow) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/buy-credits?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/buy-credits?canceled=1`
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('Erro Stripe session:', e);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout' }, { status: 500 });
  }
}
