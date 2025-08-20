import { Textarea } from '@/components/ui/textarea'
import React from 'react'

function AdditionalReq({additionalRequirementInput}) {
  return (
    <div className='mt-5'>
        <label className='text-gray-400'>Digite Requisitos Adicionais (Opcional)</label>
        <Textarea className="mt-2" placeholder="Ex: cores específicas, móveis que devem permanecer, estilo preferido..." onChange={(e)=>additionalRequirementInput(e.target.value)} />
    </div>
  )
}

export default AdditionalReq