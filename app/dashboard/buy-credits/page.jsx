"use client";
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { Button } from '@/components/ui/button';
import { UsersSupabase } from '@/config/supabaseDb';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

function BuyCredits() {
    // Planos em reais (R$) - usamos centavos na Stripe, aqui valor exibido.
    const creditsOption = [
      { id:'plan_50', credits: 50,  amountBRL: 44.90,  label: '50 Imagens', desc: '50 redecorações de ambiente', best:false },
      { id:'plan_100', credits: 100, amountBRL: 84.90,  label: '100 Imagens', desc: '100 redecorações de ambiente', best:true },
      { id:'plan_500', credits: 500, amountBRL: 184.90, label: '500 Imagens', desc: '500 redecorações de ambiente', best:false },
    ];

  // loadingPlanId: id do plano que está redirecionando para checkout
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [loading, setLoading] = useState(false); // usado para bloquear múltiplos cliques (global)
    const [message, setMessage] = useState(null);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Feedback pós-redirect
    useEffect(() => {
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');
      if (success) {
        setMessage({ type: 'success', text: 'Pagamento concluído! Seus créditos serão adicionados em instantes.' });
        // Opcional: refetch user (simplificado - atualização leve)
        // Em produção, ideal criar endpoint para retornar créditos atuais.
      } else if (canceled) {
        setMessage({ type: 'error', text: 'Pagamento cancelado.' });
      }
    }, [searchParams]);

    const startCheckout = async (plan) => {
      if (!plan || loading || loadingPlanId || !userDetail?.email) return;
      setLoading(true);
      setLoadingPlanId(plan.id);
      setMessage(null);
      try {
        const resp = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credits: plan.credits, userEmail: userDetail.email })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Erro ao iniciar checkout');
        window.location.href = data.url;
      } catch (e) {
        setMessage({ type: 'error', text: e.message });
        setLoading(false);
        setLoadingPlanId(null);
      }
    };
      
  return (
    <div>
  <h2 className='font-bold text-3xl tracking-tight'>Planos de Créditos</h2>
  <p className='mt-1 text-sm text-gray-600'>Escolha um pacote e continue criando designs incríveis.</p>

        {message && (
          <div className={`mt-4 text-sm rounded p-3 ${message.type==='success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {creditsOption.map(plan => {
            const loadingThis = loadingPlanId === plan.id;
            return (
              <div key={plan.id} className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition bg-white/60 backdrop-blur-sm ${plan.best ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-primary/50'}`}>
                {plan.best && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow'>Mais Popular</div>
                )}
                <h3 className='text-lg font-semibold'>{plan.label}</h3>
                <p className='mt-1 text-xs text-gray-500'>{plan.desc}</p>
                <div className='mt-4 flex items-baseline gap-1'>
                  <span className='text-3xl font-bold'>R$ {plan.amountBRL}</span>
                  <span className='text-xs text-gray-500'>pagamento único</span>
                </div>
                <ul className='mt-4 space-y-1 text-xs text-gray-600'>
                  <li>✔ Créditos: {plan.credits}</li>
                  <li>✔ Uso imediato</li>
                  <li>✔ Expira somente quando usar</li>
                </ul>
                <Button
                  disabled={loading && !loadingThis}
                  variant={plan.best ? 'default' : 'outline'}
                  className='mt-6 w-full'
                  onClick={() => startCheckout(plan)}
                >
                  {loadingThis ? 'Redirecionando...' : 'Selecionar'}
                </Button>
              </div>
            );
          })}
        </div>
    </div>
  )
}

export default BuyCredits
