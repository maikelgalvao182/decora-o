import { supabase, STORAGE_BUCKET, SUPABASE_URL } from "@/config/supabaseConfig";
import { AiGeneratedImageSupabase } from "@/config/supabaseDb";
import axios from "axios";
import { NextResponse } from "next/server";
import Replicate from "replicate";

// Preferir variável privada de servidor REPLICATE_API_TOKEN
// Fallbacks: variável antiga com typo e a pública (evitar depender da pública a longo prazo)
const replicateToken = process.env.REPLICATE_API_TOKEN || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || process.env.NEXT_PUBLICK_REPLICATE_API_TOKEN;
const replicate = new Replicate({ auth: replicateToken });

export async function POST(req){
    const { imageUrl, roomType, designType, additionalReq, userEmail, width, height, upscale } = await req.json();

    console.log('🚀 API chamada recebida:', {
        imageUrl: imageUrl ? '✅ Presente' : '❌ Ausente',
        roomType,
        designType,
        additionalReq,
        userEmail
    });

    // Verificar se o token do Replicate está configurado (server-only)
    if (!replicateToken) {
        console.error('❌ Token do Replicate não configurado (REPLICATE_API_TOKEN)');
        return NextResponse.json({error: 'Token do Replicate não configurado'}, {status: 500});
    }

    console.log('🔑 Token Replicate:', replicateToken ? '✅ Configurado' : '❌ Ausente');

    // Validação básica de URL da imagem (antes do Replicate)
    try {
        const u = new URL(imageUrl);
        if(!/^https?:$/.test(u.protocol)) throw new Error('URL inválida');
    } catch {
        return NextResponse.json({ error: 'URL da imagem inválida.' }, { status: 400 });
    }

    const lower = (imageUrl || '').toLowerCase();
    const supportedExt = ['.jpg','.jpeg','.png','.webp'];
    if(!supportedExt.some(ext=>lower.includes(ext))){
        return NextResponse.json({ error: 'Formato não suportado. Envie imagens jpg, jpeg, png e webp' }, { status: 415 });
    }

    // Convert Image to AI Image 

    try{
        // 1. Validar créditos do usuário antes de qualquer processamento pesado
        if(!userEmail){
            return NextResponse.json({error:'E-mail do usuário ausente'}, {status:400});
        }
        const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('id, credits')
            .eq('email', userEmail)
            .single();
        if(userErr){
            console.error('❌ Erro ao buscar usuário para créditos:', userErr);
            return NextResponse.json({error:'Erro ao validar créditos do usuário'}, {status:500});
        }
        if(!userRow){
            return NextResponse.json({error:'Usuário não encontrado'}, {status:404});
        }
        if((userRow.credits ?? 0) < 1){
            return NextResponse.json({error:'Sem créditos disponíveis', code:'NO_CREDITS'}, {status:402});
        }

        // Sanitizar dimensões solicitadas (limite 2048 para custo/performance)
        const safeWidth = typeof width === 'number' && width > 0 ? Math.min(width, 2048) : undefined;
        const safeHeight = typeof height === 'number' && height > 0 ? Math.min(height, 2048) : undefined;
        const input = {
            image: imageUrl,
            prompt: `A ${roomType || 'room'} with a ${designType || 'modern'} style interior ${additionalReq || ''}`,
            ...(safeWidth ? { width: safeWidth } : {}),
            ...(safeHeight ? { height: safeHeight } : {})
        };
        
        console.log('🤖 Chamando Replicate com input:', input);
        
        const baseModel = "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";
        const output = await replicate.run(baseModel, { input });    
        console.log('🎨 Replicate output bruto:', output);

        // Normalizar URL retornada (pode ser string ou array)
        let generatedUrl = null;
        if (typeof output === 'string') {
            generatedUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            generatedUrl = output[0];
        } else if (output && typeof output === 'object') {
            // Alguns modelos retornam objetos com campo url
            if (output.url) generatedUrl = output.url;
        }
        if (!generatedUrl) {
            throw new Error('Não foi possível determinar a URL da imagem gerada');
        }

        // Etapa opcional de upscaling (Real-ESRGAN) se flag upscale=true
        let finalImageUrl = generatedUrl;
        if (upscale) {
            try {
                console.log('🔍 Iniciando upscaling 2x (Real-ESRGAN)...');
                const esrganVersion = 'nightmareai/real-esrgan:db21e45f3b4d7dc4ceac2ae15d7a372c1b21e8d52e1f2a550d458facb1613e81';
                const upInput = { image: generatedUrl, scale: 2 }; // scale máximo 4, manter 2 por custo
                const upOutput = await replicate.run(esrganVersion, { input: upInput });
                console.log('🆙 Resultado upscaling:', upOutput);
                if (typeof upOutput === 'string') finalImageUrl = upOutput;
                else if (Array.isArray(upOutput) && upOutput[0]) finalImageUrl = upOutput[0];
            } catch (upErr) {
                console.warn('⚠️ Falha no upscaling, continuando com imagem original:', upErr.message);
            }
        }

        // Converter URL final em Base64 antes de subir (mantém formato original)
        console.log('🔄 Convertendo imagem final para Base64 para upload...');
        const base64Image = await ConvertImageToBase64(finalImageUrl);
        console.log('✅ Conversão concluída, tamanho base64:', base64Image.length);
        
        // Save Base64 to Supabase Storage
        const fileName = Date.now() + '.png';
        const filePath = `room-redesign/${fileName}`;
        
        console.log('📤 Salvando no Supabase Storage:', filePath);
        
        // Convert base64 to blob for Supabase upload
        const base64Data = base64Image.split(',')[1]; // Remove data:image/png;base64, prefix
        const blob = Buffer.from(base64Data, 'base64');
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, blob, {
                contentType: 'image/png',
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('❌ Supabase upload error:', uploadError);
            throw uploadError;
        }

        console.log('✅ Upload para Supabase concluído:', uploadData);

    // Build public URL manually (mais simples e confiável)
    const downloadUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
    console.log('🔗 URL pública gerada (manual):', downloadUrl);
        
        // Save All to Supabase Database
        const imageData = {
            room_type: roomType || 'Unknown',
            design_type: designType || 'Modern',
            org_image: imageUrl,
            ai_image: downloadUrl,
            user_email: userEmail
        };

        console.log('💾 Salvando no banco de dados:', imageData);

        const dbResult = await AiGeneratedImageSupabase.insert(imageData);
        console.log('✅ Database result:', dbResult);

        // 5. Debitar 1 crédito somente após sucesso de geração e persistência
        const { data: updatedUser, error: updateCreditErr } = await supabase
            .from('users')
            .update({ credits: (userRow.credits - 1) })
            .eq('id', userRow.id)
            .eq('credits', userRow.credits) // optimistic lock
            .select('credits')
            .single();
        if(updateCreditErr){
            console.error('⚠️ Falha ao decrementar créditos (inconsistência possível):', updateCreditErr);
        }

        const remainingCredits = updatedUser?.credits ?? (userRow.credits - 1);
        console.log('🎉 Retornando resultado final:', downloadUrl, 'Créditos restantes:', remainingCredits);
        return NextResponse.json({
            result: downloadUrl,
            remainingCredits,
            meta: {
                baseModel,
                width: safeWidth || 'model-default',
                height: safeHeight || 'model-default',
                upscaled: !!upscale
            }
        });
        
    } catch(e) {
        console.error('❌ API Error completo:', e);
        console.error('📋 Stack trace:', e.stack);
        return NextResponse.json({error: e.message}, {status: 500});
    }
  

}

async function ConvertImageToBase64(imageUrl){
    const resp=await axios.get(imageUrl,{responseType:'arraybuffer'});
    const base64ImageRaw=Buffer.from(resp.data).toString('base64');

    return "data:image/png;base64,"+base64ImageRaw;
}