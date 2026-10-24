import { useState } from 'react'

// Imagen con marco en forma de arco. Si el archivo todavía no existe,
// muestra un degradado para que el diseño no se rompa.
export default function ArchImage({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`arch ${className}`}>
      {failed ? (
        <div className="arch__placeholder" role="img" aria-label={alt} />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
