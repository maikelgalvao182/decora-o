// Teste de conectividade do Supabase Storage
import { supabase, STORAGE_BUCKET } from './supabaseConfig.js';

export const testStorageAccess = async () => {
  try {
    console.log('🧪 Testando acesso ao Supabase Storage...');
    
    // 1. Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return false;
    }
    
    console.log('📦 Buckets disponíveis:', buckets);
    
    const roomImagesBucket = buckets.find(bucket => bucket.name === STORAGE_BUCKET);
    if (!roomImagesBucket) {
      console.error(`❌ Bucket '${STORAGE_BUCKET}' não encontrado`);
      return false;
    }
    
    console.log(`✅ Bucket '${STORAGE_BUCKET}' encontrado:`, roomImagesBucket);
    
    // 2. Tentar listar arquivos no bucket
    const { data: files, error: filesError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', { limit: 5 });
    
    if (filesError) {
      console.error('❌ Erro ao listar arquivos:', filesError);
      return false;
    }
    
    console.log('📁 Arquivos no bucket (primeiros 5):', files);
    
    // 3. Verificar configuração de políticas
    console.log('🔐 Verificando políticas de acesso...');
    
    // Tentar obter uma URL pública de um arquivo de teste
    const testFilePath = 'test-file.png';
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(testFilePath);
    
    console.log('🔗 URL pública de teste:', urlData.publicUrl);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    return false;
  }
};

// Função para verificar se uma URL está acessível
export const testImageUrl = async (url) => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    console.log(`🌐 Status da URL ${url}:`, response.status);
    return response.ok;
    
  } catch (error) {
    console.error(`❌ Erro ao acessar URL ${url}:`, error);
    return false;
  }
};
