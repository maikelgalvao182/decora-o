"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Upload } from 'lucide-react'

function ImageSelection({selectedImage}) {

    const [file,setFile]=useState();
    const onFileSelected=(event)=>{
        console.log(event.target.files[0]);
        setFile(event.target.files[0])
        selectedImage(event.target.files[0])
    }

  return (
    <div>
        <label>Selecione uma imagem do seu ambiente</label>
        <div className='mt-3'>
            <label htmlFor='upload-image'>
                <div className={` border rounded-xl 
                border-dotted flex justify-center items-center border-gray-300
                 bg-gray-100 cursor-pointer hover:shadow-lg overflow-hidden h-[300px]
                 ${file?'p-0 bg-white':'p-28'}
                 `}>
                   {!file? (
                       <div className="flex flex-col items-center space-y-3">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                               <Upload size={24} className="text-gray-400" />
                           </div>
                           <span className="text-gray-500 text-sm">Enviar imagem</span>
                       </div>
                   )
                   :<Image src={URL.createObjectURL(file)} width={300} height={300}
                   alt="Preview da imagem do ambiente selecionado"
                   className='w-full h-full object-cover rounded-xl'
                   />}
                </div>
            </label>
            <input type="file" accept='image/*' 
            id="upload-image"
            style={{display:'none'}}
            onChange={onFileSelected}
            />
        </div>
    </div>
  )
}

export default ImageSelection