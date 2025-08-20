import React from 'react'

/**
 * ImageLightbox
 * Props:
 *  - images: Array<{ src: string, label?: string }>
 *  - startIndex: number
 *  - onClose: () => void
 */
export default function ImageLightbox({ images = [], startIndex = 0, onClose }) {
  const [index, setIndex] = React.useState(startIndex)
  const [scale, setScale] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = React.useState(false)
  const panStart = React.useRef({ x: 0, y: 0 })
  const imgRef = React.useRef(null)

  const current = images[index]

  const close = () => { onClose && onClose() }
  const resetTransform = () => { setScale(1); setOffset({ x: 0, y: 0 }) }
  const goto = (dir) => { const next = (index + dir + images.length) % images.length; setIndex(next); resetTransform() }

  const onWheel = (e) => { e.preventDefault(); const delta = -e.deltaY; setScale(p => Math.min(8, Math.max(0.3, p + delta * 0.0015))) }
  const onMouseDown = (e) => { if (scale <= 1) return; setIsPanning(true); panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y } }
  const onMouseMove = (e) => { if (!isPanning) return; setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }) }
  const endPan = () => setIsPanning(false)

  const onKey = React.useCallback((e) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') goto(1); if (e.key === 'ArrowLeft') goto(-1); if (e.key === '+') setScale(s=>Math.min(8,s*1.2)); if (e.key === '-') setScale(s=>Math.max(0.3,s/1.2)) }, [index, images.length])
  React.useEffect(()=>{ document.addEventListener('keydown', onKey); return ()=>document.removeEventListener('keydown', onKey)}, [onKey])

  if (!current) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col" role="dialog" aria-modal="true">
      <div className="flex items-center justify-between px-4 py-2 text-white text-sm select-none">
        <div className="flex items-center gap-3">
          <span className="font-medium">{current.label || `Imagem ${index + 1}`}</span>
          {images.length > 1 && (<span className="opacity-70">{index + 1} / {images.length}</span>)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setScale(s=>Math.max(0.3,s/1.2))} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" aria-label="Diminuir zoom">-</button>
          <button onClick={()=>setScale(s=>Math.min(8,s*1.2))} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" aria-label="Aumentar zoom">+</button>
            <button onClick={resetTransform} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs">Reset</button>
          <button onClick={close} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" aria-label="Fechar">✕</button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={endPan}
        onMouseUp={endPan}
        onDoubleClick={resetTransform}
      >
        <img ref={imgRef} src={current.src} alt={current.label || 'Imagem'} draggable={false} className="select-none pointer-events-none"
          style={{ position:'absolute', top:'50%', left:'50%', transform:`translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`, maxWidth:'90vw', maxHeight:'80vh', objectFit:'contain'}} />
        {images.length > 1 && (<>
          <button onClick={()=>goto(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 px-3 py-2 rounded" aria-label="Anterior">‹</button>
          <button onClick={()=>goto(1)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 px-3 py-2 rounded" aria-label="Próxima">›</button>
        </>)}
      </div>
      <button onClick={close} aria-label="Fechar lightbox" className="absolute inset-0 -z-10 cursor-default" tabIndex={-1} />
    </div>
  )
}
