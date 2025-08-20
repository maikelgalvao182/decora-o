"use client"
import React, { useContext, useState } from 'react'
import ImageSelection from './_components/ImageSelection'
import RoomType from './_components/RoomType'
import DesignType from './_components/DesignType'
import AdditionalReq from './_components/AdditionalReq'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { supabase, STORAGE_BUCKET } from '@/config/supabaseConfig'
import { UsersSupabase, AiGeneratedImageSupabase } from '@/config/supabaseDb'
import { useUser } from '@clerk/nextjs'
import CustomLoading from './_components/CustomLoading'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { useRouter } from 'next/navigation'

function CreateNew() {

  const {user}=useUser();
  const router = useRouter();
  const [formData,setFormData]=useState([]);
  const [loading,setLoading]=useState(false);
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const [errorMsg,setErrorMsg]=useState('');
  const [orgImage,setOrgImage]=useState();
  // const [outputResult,setOutputResult]=useState();
  const onHandleInputChange=(value,fieldName)=>{
    setFormData(prev=>({
      ...prev,
      [fieldName]:value
    }))

    console.log(formData);
  }

  const GenerateAiImage=async()=>{
    setErrorMsg('');
    if((userDetail?.credits ?? 0) < 1){
      setErrorMsg('Você não tem créditos disponíveis. Compre mais créditos para continuar.');
      return;
    }
    setLoading(true);
    try {
      console.log('🚀 Iniciando geração de imagem AI...');
      console.log('📋 FormData atual:', formData);
      
      // Validação dos campos obrigatórios
      if (!formData?.roomType) {
        throw new Error('Tipo de cômodo é obrigatório! Selecione um tipo de cômodo.');
      }
      
      if (!formData?.designType) {
        throw new Error('Tipo de design é obrigatório! Selecione um estilo de design.');
      }
      
      if (!formData?.image) {
        throw new Error('Imagem é obrigatória! Faça upload de uma imagem.');
      }

      // Validação de formato suportado antes de upload
  const allowedTypes = ['image/jpeg','image/png','image/webp'];
      if(!allowedTypes.includes(formData.image.type)){
        throw new Error('Formato não suportado. Envie imagens jpg, jpeg, png e webp');
      }
      
      const rawImageUrl=await SaveRawImageToSupabase();
      console.log('📸 URL da imagem original salva:', rawImageUrl);
      
      if (!rawImageUrl) {
        throw new Error('Falha ao fazer upload da imagem original');
      }
      
      console.log('📡 Enviando requisição para API...');
      const result=await axios.post('/api/redesign-room',{
        imageUrl:rawImageUrl,
        roomType:formData?.roomType,
        designType:formData?.designType,
        additionalReq:formData?.additionalReq || '',
        userEmail:user?.primaryEmailAddress?.emailAddress
      });
      
      console.log('🎨 Resultado da API completo:', result);
      console.log('📊 Status da resposta:', result.status);
      console.log('📄 Data da resposta:', result.data);
      
      if (result.data.error) {
        throw new Error(`Erro da API: ${result.data.error}`);
      }
      
      if (!result.data.result) {
        throw new Error('API não retornou URL da imagem AI');
      }
      
      console.log('🖼️ URL da imagem AI gerada:', result.data.result);

      // Atualizar créditos localmente com base no retorno do servidor (remainingCredits)
      if(typeof result.data.remainingCredits === 'number'){
        setUserDetail(prev=>({...prev, credits: result.data.remainingCredits }));
      }

      console.log('📦 Redirecionando para página de resultado:', {
        aiImage: result.data.result,
        orgImage: rawImageUrl,
        roomType: formData.roomType,
        designType: formData.designType
      });
      
      // Redirecionar para a página de resultado
      const params = new URLSearchParams({
        aiImage: result.data.result,
        orgImage: rawImageUrl,
        roomType: formData.roomType,
        designType: formData.designType
      });
      
      router.push(`/dashboard/result?${params.toString()}`);
      
    } catch (error) {
      console.error('❌ Erro na geração de imagem AI:', error);
      const serverCode = error?.response?.data?.code;
      if(serverCode === 'NO_CREDITS'){
        setErrorMsg('Você ficou sem créditos. Adquira mais para gerar novas imagens.');
      } else {
        setErrorMsg(error?.response?.data?.error || error.message || 'Erro inesperado ao gerar imagem.');
      }
    } finally {
      setLoading(false);
    }
  }

  const SaveRawImageToSupabase = async () => {
    try {
      console.log('� Starting Supabase upload...');
      
      // Generate unique filename
      const fileName = `${Date.now()}_raw.png`;
      const filePath = `room-redesign/${fileName}`;
      
      console.log('� File path:', filePath);
      console.log('📸 File to upload:', formData.image);
      console.log('📊 File size:', formData.image.size);
      console.log('🏷️ File type:', formData.image.type);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, formData.image, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload error:', error);
  // Erros comuns: formato não suportado ou falha de rede
  throw new Error('Falha ao enviar a imagem. Formato não suportado. Envie imagens jpg, jpeg, png e webp');
      }

      console.log('✅ File uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('� Public URL obtained:', publicUrl);
      
      setOrgImage(publicUrl);
      return publicUrl;
      
    } catch (error) {
      console.error('❌ Supabase upload failed:', error);
      console.error('📝 Error message:', error.message);
  throw error; // Propagar para tratamento em GenerateAiImage
    }
  }

  /**
   * Update the user credits using Supabase
   * @returns 
   */
  // updateUserCredits removido - lógica agora no servidor

  return (
    <div>
        <h2 className='font-bold text-4xl text-black text-center'>Experimente a Magia da Remodelação com IA</h2>
        <p className='text-center text-gray-500'>Selecione um espaço, escolha um estilo e veja a IA reimaginar instantaneamente seu ambiente.</p>

        <div className='grid grid-cols-1 md:grid-cols-2 
         mt-10 gap-10'>
          {/* Image Selection  */}
          <ImageSelection selectedImage={(value)=>onHandleInputChange(value,'image')}/>
          {/* Form Input Section  */}
          <div>
            {/* Room type  */}
            <RoomType selectedRoomType={(value)=>onHandleInputChange(value,'roomType')}/>
            {/* Design Type  */}
            <DesignType selectedDesignType={(value)=>onHandleInputChange(value,'designType')}/>
            {/* Additonal Requirement TextArea (Optional) */}
            <AdditionalReq additionalRequirementInput={(value)=>onHandleInputChange(value,'additionalReq')}/>
            {/* Button To Generate Image  */}
              <Button 
                className={`w-full mt-5 ${(userDetail?.credits??0)<1?'opacity-60 cursor-not-allowed':''}`}
                disabled={(userDetail?.credits??0)<1 || loading}
                onClick={GenerateAiImage}
              >
              {loading? 'Processando...' : ( (userDetail?.credits??0)<1 ? 'Sem Créditos' : 'Gerar')}
            </Button>
            <div className='mt-2 mb-6 space-y-2'>
              <p className='text-xs text-gray-400'>NOTA: Cada geração consome 1 crédito.</p>
              {(userDetail?.credits??0)<1 && (
                <div className='text-xs bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-md'>
                  <p className='mb-1 font-medium'>Você não possui créditos.</p>
                  <a href='/dashboard/buy-credits' className='text-amber-800 underline'>Comprar créditos</a>
                </div>
              )}
              {errorMsg && (
                <div className='text-xs bg-red-50 border border-red-200 text-red-700 p-3 rounded-md'>
                  {errorMsg} { (userDetail?.credits??0)<1 && <a href='/dashboard/buy-credits' className='underline ml-1'>Adicionar agora</a> }
                </div>
              )}
            </div>
            <div className='mb-40' />
          </div>
        </div>
        <CustomLoading loading={loading} />
    </div>
  )
}

export default CreateNew