import { EmptyState as ShadcnEmptyState } from '@/components/ui/empty-state'
import { Palette, Sparkles, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function EmptyState() {
  const router = useRouter()

  return (
    <div className='w-full mt-10'>
      <ShadcnEmptyState 
        title="Crie seu primeiro design de ambiente"
        description="Ainda não há designs criados."
        icons={[Palette, Sparkles, Home]}
        action={{
          label: "+ Criar Design",
          onClick: () => router.push('/dashboard/create-new')
        }}
      />
    </div>
  )
}

export default EmptyState