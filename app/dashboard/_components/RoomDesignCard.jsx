import React from 'react'
import { SUPABASE_URL, STORAGE_BUCKET } from '@/config/supabaseConfig'
import { Trash2 } from 'lucide-react'

function RoomDesignCard({room, onDelete, deleting}) {
  let displayImage = room?.aiImage || room?.ai_image || room?.orgImage || room?.org_image;

  // Fallback: se veio só o caminho (ex: "room-redesign/123.png") reconstruir URL pública
  if (displayImage && !displayImage.startsWith('http')) {
    // remover possíveis barras iniciais
    const cleanPath = displayImage.replace(/^\/+/, '');
    displayImage = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${cleanPath}`;
  }
  
  // Mapeamento de traduções
  const roomTypeTranslations = {
    'Living Room': 'Sala de Estar',
    'Bedroom': 'Quarto',
    'Children\'s Room': 'Quarto Infantil',
    'Baby Room': 'Quarto do Bebê',
    'Kitchen': 'Cozinha',
    'Office': 'Escritório',
    'Bathroom': 'Banheiro',
    'Backyard': 'Quintal',
    'Store': 'Loja',
    'Restaurant': 'Restaurante',
    'Facade': 'Fachada',
    'Dining Room': 'Sala de Jantar',
    'Laundry Room': 'Lavanderia',
    'Garage': 'Garagem',
    'Balcony': 'Varanda'
  };

  const designTypeTranslations = {
    'Modern': 'Moderno',
    'Traditional': 'Tradicional',
    'Minimalist': 'Minimalista',
    'Industrial': 'Industrial',
    'Bohemian': 'Boêmio',
    'Rustic': 'Rústico'
  };

  const translateRoomType = (type) => {
    return roomTypeTranslations[type] || type;
  };

  const translateDesignType = (type) => {
    return designTypeTranslations[type] || type;
  };

  return (
    <div className='rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group relative'>
      <div className='w-full bg-gray-100 overflow-hidden rounded-t-lg flex items-center justify-center relative' style={{height:'180px'}}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={room?.roomType || 'Room'}
            className='w-full h-full object-cover'
            onError={(e)=>{ e.currentTarget.style.opacity='0.3'; }}
          />
        ) : (
          <span className='text-xs text-gray-400'>Sem imagem</span>
        )}
        {onDelete && (
          <button
            type='button'
            onClick={(e)=>{ e.stopPropagation(); if(!deleting) onDelete(room); }}
            title='Excluir'
            className='absolute top-2 right-2 bg-primary hover:brightness-110 text-white shadow-sm rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-all border border-primary/70'
          >
            <Trash2 size={18} className={deleting? 'animate-pulse text-white':'text-white'} />
          </button>
        )}
      </div>
      <div className='p-4 space-y-1 text-sm'>
        <p className='font-medium text-gray-700'>Tipo: <span className='font-normal text-gray-600'>{translateRoomType(room?.roomType || room?.room_type) || '-'}</span></p>
        <p className='font-medium text-gray-700'>Design: <span className='font-normal text-gray-600'>{translateDesignType(room?.designType || room?.design_type) || '-'}</span></p>
      </div>
    </div>
  )
}

export default RoomDesignCard