import { NextResponse } from 'next/server';
import { supabase } from '@/config/supabaseConfig';

// DELETE /api/images/:id?userEmail=
export async function DELETE(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');

  if(!id) return NextResponse.json({ error: 'ID ausente'}, { status:400 });
  if(!userEmail) return NextResponse.json({ error: 'userEmail ausente'}, { status:400 });

  try {
    // Primeiro obter o registro para validar ownership
    const { data: row, error: fetchErr } = await supabase
      .from('ai_generated_image')
      .select('id,user_email,ai_image')
      .eq('id', id)
      .single();
    if (fetchErr) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status:404 });
    }
    if (row.user_email !== userEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status:403 });
    }

    // Excluir registro
    const { error: delErr } = await supabase
      .from('ai_generated_image')
      .delete()
      .eq('id', id);
    if (delErr) throw delErr;

    // (Opcional) Poderíamos remover também o arquivo do storage se quisermos (não obrigatório)

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Erro delete imagem:', e);
    return NextResponse.json({ error: 'Erro interno ao excluir'}, { status:500 });
  }
}
