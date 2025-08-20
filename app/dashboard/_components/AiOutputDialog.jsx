import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import './ai-result-modal.css';
import ImageLightbox from './ImageLightbox';

function AiOutputDialog({openDialog,closeDialog,orgImage,aiImage}) {
  // Estados para dimensões naturais
  const [aiNatural, setAiNatural] = React.useState(null); // {w,h}
  const [orgNatural, setOrgNatural] = React.useState(null);
  // Layout calculado
  const [layout, setLayout] = React.useState({ containerWidth: 600, ai: { w: 600, h: 300 }, org: { w: 600, h: 300 }});
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  // Carrega dimensões naturais de cada imagem
  const loadNatural = (url, setter, label) => {
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      setter({ w: img.naturalWidth, h: img.naturalHeight });
      console.log(`✅ Dimensão natural ${label}:`, img.naturalWidth, img.naturalHeight);
    };
    img.onerror = () => console.warn(`⚠️ Falha ao obter dimensão natural de ${label}`);
    img.src = url;
  };

  // Efeito para carregar dimensões quando URLs mudam
  React.useEffect(() => {
    if (openDialog) {
      loadNatural(aiImage, setAiNatural, 'AI');
      loadNatural(orgImage, setOrgNatural, 'Original');
    }
  }, [openDialog, aiImage, orgImage]);

  // Cálculo do layout: garante que as duas imagens empilhadas caibam em 85vh sem overflow e dentro de 90vw
  const recalcLayout = React.useCallback(() => {
    if (!openDialog) return;
    const maxViewportHeight = window.innerHeight * 0.85; // altura do modal
    const maxViewportWidth = window.innerWidth * 0.9;    // limite horizontal
    const headerFooterReserve = 140; // header + footer + paddings
    const gap = 16; // gap entre imagens
    const availableImagesHeight = Math.max(200, maxViewportHeight - headerFooterReserve - gap);

    // Se só uma imagem disponível, tratamos separado
    const ai = aiNatural || orgNatural; // fallback
    const org = orgNatural || aiNatural; // fallback
    if (!ai) return; // nada para calcular

    const haveBoth = !!(aiNatural && orgNatural);

    // Função para calcular escala mantendo proporção e cabendo em limites
    const compute = (nat1, nat2, haveBoth) => {
      // Base width inicial = menor entre limites horizontais e largura natural mínima
      let baseWidth = Math.min(maxViewportWidth - 48, nat1.w, nat2?.w || nat1.w); // 48 = padding lateral estimado
      baseWidth = Math.max(320, baseWidth);

      // Alturas proporcionais com base na largura escolhida
      let h1 = baseWidth * (nat1.h / nat1.w);
      let h2 = haveBoth ? baseWidth * (nat2.h / nat2.w) : 0;

      if (!haveBoth) {
        // Ajusta para caber sozinho
        if (h1 > availableImagesHeight) {
          const scale = availableImagesHeight / h1;
          h1 *= scale;
          baseWidth *= scale;
        }
      } else {
        // Verifica se soma cabe
        const total = h1 + h2 + gap;
        if (total > availableImagesHeight) {
          const scale = (availableImagesHeight - gap) / (h1 + h2);
          h1 *= scale;
          h2 *= scale;
          baseWidth *= scale;
        }
      }

      // Garantir limites mínimos
      if (baseWidth < 320) {
        const scaleUp = 320 / baseWidth;
        baseWidth = 320;
        h1 *= scaleUp;
        h2 *= scaleUp;
      }

      return {
        containerWidth: Math.round(baseWidth),
        ai: { w: Math.round(baseWidth), h: Math.round(h1) },
        org: haveBoth ? { w: Math.round(baseWidth), h: Math.round(h2) } : null
      };
    };

    const result = compute(aiNatural || ai, orgNatural || org, haveBoth);
    setLayout(result);
  }, [openDialog, aiNatural, orgNatural]);

  // Recalcula quando dimensões naturais mudam ou resize
  React.useEffect(() => { recalcLayout(); }, [recalcLayout]);
  React.useEffect(() => {
    if (!openDialog) return;
    const onResize = () => recalcLayout();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [openDialog, recalcLayout]);

  // Reset ao fechar
  React.useEffect(() => {
    if (!openDialog) {
      setAiNatural(null);
      setOrgNatural(null);
    }
  }, [openDialog]);

  // Teste de conectividade das imagens
  const testImageAccess = async (url, label) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`✅ ${label} acessível:`, response.status);
      return true;
    } catch (error) {
      console.error(`❌ ${label} não acessível:`, error);
      return false;
    }
  };

  React.useEffect(() => {
    if (openDialog && aiImage) {
      testImageAccess(aiImage, 'AI Image');
    }
    if (openDialog && orgImage) {
      testImageAccess(orgImage, 'Original Image');
    }
  }, [openDialog, aiImage, orgImage]);

  const handleDownload = async () => {
    if (aiImage) {
      try {
        // Fazer download da imagem via fetch
        const response = await fetch(aiImage);
        const blob = await response.blob();
        
        // Criar URL temporária para o blob
        const url = window.URL.createObjectURL(blob);
        
        // Criar link de download
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-room-design-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        
        // Limpar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Download realizado com sucesso');
      } catch (error) {
        console.error('❌ Erro no download:', error);
        // Fallback: abrir em nova janela
        window.open(aiImage, '_blank');
      }
    } else {
      console.error('❌ Imagem AI não disponível para download');
    }
  };

  return (
    <>
    <AlertDialog open={openDialog}>
    <AlertDialogContent 
      className="ai-result-modal max-w-none border-0 p-0"
      style={{
        width: `${layout.containerWidth + 48}px`, // 24px padding cada lado
        height: '85vh',
        maxWidth: '90vw',
        maxHeight: '85vh',
        overflow: 'hidden'
      }}
    >
      <div 
        className="bg-white rounded-lg overflow-hidden h-full flex flex-col"
        style={{ width: '100%' }}
      >
      <AlertDialogHeader className="px-6 py-3 flex-shrink-0 text-left items-start">
        <AlertDialogTitle className="text-lg font-semibold text-left">Resultado da Transformação</AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="flex-1 w-full flex justify-center px-6 overflow-hidden">
          {aiImage || orgImage ? (
            <div className="flex flex-col gap-4 items-start" style={{width: layout.containerWidth}}>
              {/* Original primeiro se existir */}
              {orgImage && layout.org && (
                <div style={{ width: layout.org.w, height: layout.org.h }} className="flex flex-col">
                  <h3 className="text-xs font-semibold mb-1 text-left text-gray-600 tracking-wide">Imagem Original</h3>
                  <div className="group relative rounded-md overflow-hidden shadow border border-gray-200 bg-gray-50 cursor-zoom-in" style={{ width: '100%', height: `calc(100% - 18px)` }} onClick={()=>{ setLightboxIndex(0); setLightboxOpen(true); }}>
                    <img
                      src={orgImage}
                      alt="Imagem Original"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      onLoad={(e)=>{ if(!orgNatural) setOrgNatural({w:e.target.naturalWidth,h:e.target.naturalHeight}); }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  </div>
                </div>
              )}
              {/* AI abaixo */}
              {aiImage && (
                <div style={{ width: layout.ai.w, height: layout.ai.h }} className="flex flex-col">
                  <h3 className="text-xs font-semibold mb-1 text-left text-blue-600 tracking-wide">Imagem Gerada</h3>
                  <div className="group relative rounded-md overflow-hidden shadow border border-blue-200 bg-gray-50 cursor-zoom-in" style={{ width: '100%', height: `calc(100% - 18px)` }} onClick={()=>{ setLightboxIndex(orgImage ? 1 : 0); setLightboxOpen(true); }}>
                    <img
                      src={aiImage}
                      alt="Imagem Gerada"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      onLoad={(e)=>{ if(!aiNatural) setAiNatural({w:e.target.naturalWidth,h:e.target.naturalHeight}); }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg flex-1"
              style={{ 
                width: '100%',
                minHeight: '200px'
              }}
            >
              <p className="text-gray-500 mb-4">Carregando imagens...</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {orgImage && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2 font-medium">📸 Imagem Original:</p>
                    <img 
                      src={orgImage} 
                      alt="Original" 
                      className="w-full max-w-xs h-auto object-contain border rounded-lg shadow-sm"
                      style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                      onLoad={() => console.log('✅ Original Image carregada com sucesso')}
                      onError={(e) => console.error('❌ Erro ao carregar Original Image:', e)}
                    />
                  </div>
                )}
                
                {aiImage && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-2 font-medium">🤖 Imagem AI Gerada:</p>
                    <img 
                      src={aiImage} 
                      alt="AI Generated" 
                      className="w-full max-w-xs h-auto object-contain border rounded-lg shadow-sm"
                      style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                      onLoad={() => console.log('✅ AI Image carregada com sucesso')}
                      onError={(e) => console.error('❌ Erro ao carregar AI Image:', e)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className='flex gap-3 justify-end pt-3 pb-4 px-6 border-t flex-shrink-0'>
          <Button variant="outline" onClick={()=>closeDialog(false)} className="px-6">
            Fechar
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={!aiImage}
            className={`px-6 ${!aiImage ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <span className="mr-2">📥</span>
            Baixar
          </Button>
        </div>
        </div>

    </AlertDialogContent>
  </AlertDialog>
  {lightboxOpen && (
    <ImageLightbox 
      images={[
        ...(orgImage ? [{ src: orgImage, label: 'Imagem Original' }] : []),
        ...(aiImage ? [{ src: aiImage, label: 'Imagem Gerada' }] : []),
      ]}
      startIndex={lightboxIndex}
      onClose={()=> setLightboxOpen(false)}
    />
  )}
  </>
  )
}

export default AiOutputDialog