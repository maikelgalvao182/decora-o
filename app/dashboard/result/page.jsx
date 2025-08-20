"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Download, ArrowLeft, Eye, ToggleLeft, ToggleRight, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/config/supabaseConfig'

function ResultPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [viewMode, setViewMode] = useState('side-by-side') // 'side-by-side' ou 'compare'
    const [sliderPosition, setSliderPosition] = useState(50)
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)
    
    const [aiImage, setAiImage] = useState(null)
    const [orgImage, setOrgImage] = useState(null)
    const [roomType, setRoomType] = useState(null)
    const [designType, setDesignType] = useState(null)
    const [loading, setLoading] = useState(true)
    const [orgLoaded, setOrgLoaded] = useState(false)
    const [aiLoaded, setAiLoaded] = useState(false)

    useEffect(()=>{
        const qpAi = searchParams.get('aiImage')
        const qpOrg = searchParams.get('orgImage')
        const qpRoom = searchParams.get('roomType')
        const qpDesign = searchParams.get('designType')
        const id = searchParams.get('id')

        // Se todos presentes, só setar e sair
        if (qpAi && qpOrg) {
            setAiImage(qpAi)
            setOrgImage(qpOrg)
            setRoomType(qpRoom)
            setDesignType(qpDesign)
            setLoading(false)
            return
        }
        // Fallback: buscar por id
        if (id) {
            (async()=>{
                try {
                    const { data, error } = await supabase
                        .from('ai_generated_image')
                        .select('ai_image, org_image, room_type, design_type')
                        .eq('id', id)
                        .single()
                    if (!error && data) {
                        setAiImage(data.ai_image)
                        setOrgImage(data.org_image)
                        setRoomType(data.room_type)
                        setDesignType(data.design_type)
                    }
                } finally {
                    setLoading(false)
                }
            })()
        } else {
            setLoading(false)
        }
    }, [searchParams])

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

    const translateRoomType = (type) => roomTypeTranslations[type] || type;
    const translateDesignType = (type) => designTypeTranslations[type] || type;

    const downloadImage = async (imageUrl, filename) => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Erro ao baixar imagem:', error)
        }
    }

    const handleMouseDown = (e) => {
        setIsDragging(true)
        e.preventDefault()
    }

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return
        
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderPosition(percentage)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleTouchStart = (e) => {
        setIsDragging(true)
        e.preventDefault()
    }

    const handleTouchMove = (e) => {
        if (!isDragging || !containerRef.current) return
        
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.touches[0].clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderPosition(percentage)
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('touchmove', handleTouchMove)
            document.addEventListener('touchend', handleTouchEnd)
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
                document.removeEventListener('touchmove', handleTouchMove)
                document.removeEventListener('touchend', handleTouchEnd)
            }
        }
    }, [isDragging])

    // Enquanto ainda buscando metadados iniciais (via id) mostrar skeleton geral
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-full max-w-5xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[0,1].map(i=> (
                            <div key={i} className="space-y-4">
                                <div className="h-6 w-40 bg-gray-100 rounded-md animate-pulse"/>
                                <div className="rounded-xl overflow-hidden relative">
                                    <div className="w-full aspect-[4/3] bg-gray-100 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!aiImage || !orgImage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold mb-4">Resultado não encontrado</h2>
                <Link href="/dashboard/create-new">
                    <Button>Voltar para Criar Novo</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-xl font-bold text-center text-gray-900">
                        Este é o seu {translateRoomType(roomType)} redecorado no estilo {translateDesignType(designType)}!
                    </h1>
                </div>

                {/* Toggle View Mode */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('side-by-side')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                viewMode === 'side-by-side' 
                                    ? 'bg-white text-gray-900 font-medium shadow-sm' 
                                    : 'text-gray-600 hover:bg-white/50'
                            }`}
                        >
                            <Eye size={16} />
                            Lado a lado
                        </button>
                        <button
                            onClick={() => setViewMode('compare')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                viewMode === 'compare' 
                                    ? 'bg-white text-gray-900 font-medium shadow-sm' 
                                    : 'text-gray-600 hover:bg-white/50'
                            }`}
                        >
                            {viewMode === 'compare' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            Compare
                        </button>
                    </div>
                </div>

                {/* Images Display */}
                {viewMode === 'side-by-side' ? (
                    // Lado a lado no desktop, um abaixo do outro no mobile
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-center">Antes</h3>
                            <div className="rounded-xl overflow-hidden relative">
                                {!orgLoaded && (
                                    <div className="w-full aspect-[4/3] bg-gray-100 animate-pulse" />
                                )}
                                <img
                                    src={orgImage}
                                    alt="Imagem original"
                                    className={`w-full h-auto ${orgLoaded ? 'block' : 'hidden'}`}
                                    onLoad={()=>setOrgLoaded(true)}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-center">Depois</h3>
                            <div className="rounded-xl overflow-hidden relative">
                                {!aiLoaded && (
                                    <div className="w-full aspect-[4/3] bg-gray-100 animate-pulse" />
                                )}
                                <img
                                    src={aiImage}
                                    alt="Imagem gerada por IA"
                                    className={`w-full h-auto ${aiLoaded ? 'block' : 'hidden'}`}
                                    onLoad={()=>setAiLoaded(true)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    // Modo comparação com sobreposição interativa
                    <div className="max-w-2xl mx-auto mb-8">
                        {(!orgLoaded || !aiLoaded) && (
                            <div className="rounded-xl overflow-hidden w-full aspect-[4/3] bg-gray-100 animate-pulse" />
                        )}
                        {(orgLoaded && aiLoaded) && (
                            <div 
                                ref={containerRef}
                                className="relative rounded-xl overflow-hidden cursor-col-resize select-none"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                            >
                                <img
                                    src={orgImage}
                                    alt="Imagem original"
                                    className="w-full h-auto block"
                                    draggable={false}
                                />
                                <div 
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)` }}
                                >
                                    <img
                                        src={aiImage}
                                        alt="Imagem gerada por IA"
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                    />
                                </div>
                                <div 
                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 pointer-events-none"
                                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                                >
                                    <div 
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize pointer-events-auto"
                                        onMouseDown={handleMouseDown}
                                        onTouchStart={handleTouchStart}
                                    >
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                            <ArrowLeftRight size={16} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={() => downloadImage(aiImage, `redecorado-${Date.now()}.png`)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium"
                    >
                        <Download size={20} />
                        Baixe a imagem
                    </Button>
                    
                    <Link href="/dashboard">
                        <Button className="bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                            <ArrowLeft size={20} />
                            Voltar
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResultPage
