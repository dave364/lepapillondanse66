import { useEffect, useRef, useState } from 'react'

// <img> que se oculta si el archivo no existe (por ej. antes de correr
// `npm run images`), incluso si el error ocurre antes de que React cargue.
export default function SafeImg({ fallback = null, ...props }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [props.src])

  if (failed) return fallback
  return <img ref={ref} loading="lazy" {...props} onError={() => setFailed(true)} />
}
