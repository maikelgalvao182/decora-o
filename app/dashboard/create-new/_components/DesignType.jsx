import Image from 'next/image'
import React, { useState } from 'react'

function DesignType({selectedDesignType}) {
  const Designs = [
    { name: 'Modern', image: '/estilos/modern.jpeg', displayName: 'Moderno' },
    { name: 'Minimalist', image: '/estilos/minimalist.jpeg', displayName: 'Minimalista' },
    { name: 'Simple', image: '/estilos/simple.jpeg', displayName: 'Simples' },
    { name: 'Scandinavian', image: '/estilos/scandinavian.jpeg', displayName: 'Escandinavo' },
    { name: 'Contemporary', image: '/estilos/contemporary.jpeg', displayName: 'Contemporâneo' },
    { name: 'Luxury', image: '/estilos/luxury.jpeg', displayName: 'Luxo' },
    { name: 'French', image: '/estilos/french.jpeg', displayName: 'Francês' },
    { name: 'Airbnb', image: '/estilos/airbnb.jpeg', displayName: 'Airbnb' },
    { name: 'Neoclassic', image: '/estilos/neoclassic.jpeg', displayName: 'Neoclássico' },
    { name: 'Boho-chic', image: '/estilos/boho-chic.jpeg', displayName: 'Boho-chic' },
    { name: 'Futuristic', image: '/estilos/futuristic.jpeg', displayName: 'Futurista' },
    { name: 'Tropical', image: '/estilos/tropical.jpeg', displayName: 'Tropical' },
    { name: 'Midcentury Modern', image: '/estilos/midcentury-modern.jpeg', displayName: 'Moderno retrô' },
    { name: 'Traditional', image: '/estilos/traditional.jpeg', displayName: 'Tradicional' },
    { name: 'Cottagecore', image: '/estilos/cottagecore.jpeg', displayName: 'Cottagecore' },
    { name: 'Modern Boho', image: '/estilos/modern-boho.jpeg', displayName: 'Boho Moderno' },
    { name: 'Parisian', image: '/estilos/parisian.jpeg', displayName: 'Parisiense' },
    { name: 'Zen', image: '/estilos/zen.jpeg', displayName: 'Zen' },
    { name: 'Eclectic', image: '/estilos/eclectic.jpeg', displayName: 'Eclético' },
    { name: 'Industrial', image: '/estilos/industrial.jpeg', displayName: 'Industrial' },
    { name: 'Eco-friendly', image: '/estilos/eco-friendly.jpeg', displayName: 'Ecológico' },
    { name: 'Bohemian', image: '/estilos/bohemian.jpeg', displayName: 'Boêmio' },
    { name: 'Mediterranean', image: '/estilos/mediterranean.jpeg', displayName: 'Mediterrâneo' },
    { name: 'Farmhouse', image: '/estilos/farmhouse.jpeg', displayName: 'Fazenda' },
    { name: 'Retro Futuristic', image: '/estilos/retro-futuristic.jpeg', displayName: 'Retro Futurista' },
    { name: 'French Country', image: '/estilos/french-country.jpeg', displayName: 'Campo Francês' },
    { name: 'Japanese Design', image: '/estilos/japanese-design.jpeg', displayName: 'Design Japonês' },
    { name: 'Vintage', image: '/estilos/vintage.jpeg', displayName: 'Vintage' },
    { name: 'Retro', image: '/estilos/retro.jpeg', displayName: 'Retrô' },
    { name: 'Art Deco', image: '/estilos/art-deco.jpeg', displayName: 'Art Déco' },
    { name: 'Coastal', image: '/estilos/coastal.jpeg', displayName: 'Costeiro' },
    { name: 'Hollywood Glam', image: '/estilos/hollywood-glam.jpeg', displayName: 'Hollywood' },
    { name: 'Gaming Room', image: '/estilos/gaming-room.jpeg', displayName: 'Sala de Jogos' },
    { name: 'Sketch', image: '/estilos/sketch.jpeg', displayName: 'Esboço' },
    { name: 'Biophilic', image: '/estilos/biophilic.jpeg', displayName: 'Biofílico' },
    { name: 'Shabby Chic', image: '/estilos/shabby-chic.jpeg', displayName: 'Shabby Chic' },
    { name: 'Gothic', image: '/estilos/gothic.jpeg', displayName: 'Gótico' },
    { name: 'Tribal', image: '/estilos/tribal.jpeg', displayName: 'Tribal' },
    { name: 'Christmas', image: '/estilos/christmas.jpeg', displayName: 'Natal' },
    { name: 'Baroque', image: '/estilos/baroque.jpeg', displayName: 'Barroco' },
    { name: 'Rustic', image: '/estilos/rustic.jpeg', displayName: 'Rústico' },
    { name: 'Nautical', image: '/estilos/nautical.jpeg', displayName: 'Náutico' },
    { name: 'Maximalist', image: '/estilos/maximalist.jpeg', displayName: 'Maximalista' },
    { name: 'Art Nouveau', image: '/estilos/art-nouveau.jpeg', displayName: 'Art Nouveau' },
    { name: 'Easter', image: '/estilos/easter.jpeg', displayName: 'Páscoa' },
    { name: 'Ski Chalet', image: '/estilos/ski-chalet.jpeg', displayName: 'Chalé de Esqui' },
    { name: 'Halloween', image: '/estilos/halloween.jpeg', displayName: 'Halloween' },
    { name: 'Hot Pink', image: '/estilos/hot-pink.jpeg', displayName: 'Rosa Choque' },
    { name: 'Medieval', image: '/estilos/medieval.jpeg', displayName: 'Medieval' },
    { name: 'Cyberpunk', image: '/estilos/cyberpunk.jpeg', displayName: 'Cyberpunk' },
    { name: 'Chinese New Year', image: '/estilos/chinese-new-year.jpeg', displayName: 'Chinês' },
    { name: 'Vaporwave', image: '/estilos/vaporwave.jpeg', displayName: 'Vaporwave' }
  ]

  const [selectedOption,setSelectedOption]=useState();
  return (
    <div className='mt-5'>
      <label className='text-gray-500'>Selecione o Tipo de Design de Interior</label>
      <div className='mt-3 h-[218px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {Designs.map((design,index)=>(
            <div key={index} onClick={()=>{setSelectedOption(design.name);selectedDesignType(design.name)}} className='cursor-pointer'>
              <Image src={design.image} width={100} height={100} 
              alt={`Estilo de design ${design.displayName}`}
              className={`w-full h-[80px] rounded-md object-cover 
              hover:scale-105 transition-all 
              ${design.name==selectedOption&&'border-2 border-primary p-1'}`}/>
              <h2 className='text-xs font-medium text-center mt-2'>{design.displayName}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DesignType