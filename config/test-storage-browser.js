// Teste de conectividade do Supabase Storage
// Cole este código no console do navegador (F12) para testar

(async function testSupabaseStorage() {
  console.log('🧪 Iniciando teste do Supabase Storage...');
  
  // Importar o Supabase (assumindo que está disponível globalmente)
  const { supabase } = window;
  
  if (!supabase) {
    console.error('❌ Supabase client não encontrado');
    return;
  }
  
  try {
    // 1. Listar buckets
    console.log('📦 Listando buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }
    
    console.log('✅ Buckets encontrados:', buckets);
    
    // 2. Verificar se o bucket room-images existe
    const roomImagesBucket = buckets.find(bucket => bucket.name === 'room-images');
    
    if (!roomImagesBucket) {
      console.error('❌ Bucket "room-images" não encontrado!');
      console.log('🔧 Execute o SQL setup no Supabase Dashboard');
      return;
    }
    
    console.log('✅ Bucket "room-images" encontrado:', roomImagesBucket);
    
    // 3. Testar upload de uma imagem pequena
    console.log('📤 Testando upload...');
    
    // Criar uma imagem pequena de teste (1x1 pixel)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 1, 1);
    
    canvas.toBlob(async (blob) => {
      const testFileName = `test-${Date.now()}.png`;
      const filePath = `test/${testFileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(filePath, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        return;
      }
      
      console.log('✅ Upload realizado com sucesso:', uploadData);
      
      // 4. Testar obtenção de URL pública
      const { data: urlData } = supabase.storage
        .from('room-images')
        .getPublicUrl(filePath);
      
      console.log('🔗 URL pública gerada:', urlData.publicUrl);
      
      // 5. Testar se a URL é acessível
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log('✅ URL pública está acessível! Status:', response.status);
        } else {
          console.error('❌ URL não acessível. Status:', response.status);
        }
      } catch (fetchError) {
        console.error('❌ Erro ao acessar URL:', fetchError);
      }
      
      // 6. Limpar arquivo de teste
      await supabase.storage
        .from('room-images')
        .remove([filePath]);
      
      console.log('🧹 Arquivo de teste removido');
      console.log('🎉 Teste completo! O Supabase Storage está funcionando.');
      
    }, 'image/png');
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
})();
