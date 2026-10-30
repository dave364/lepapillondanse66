import { IMAGES } from '../config/site'

// Logo con las alas de la mariposa en movimiento.
// Son 4 capas del mismo tamaño, una encima de otra:
//   base (el logo sin alas) → ala izquierda → ala derecha → frente
// "frente" tiene el cuerpo de la mariposa, el brazo, la cara y el pelo de la
// bailarina, para que queden por delante de las alas al moverse.
// Las capas se generaron a partir de logo.png (scripts/split-logo-wings.py).
export default function FlutterLogo({ className = '', alt = 'Le Papillon Danse' }) {
  return (
    <span className={`flutter ${className}`} role="img" aria-label={alt}>
      <img className="flutter__base" src={IMAGES.logoLayers.base} alt="" width="591" height="751" />
      <img className="flutter__layer flutter__wing flutter__wing--l" src={IMAGES.logoLayers.wingL} alt="" />
      <img className="flutter__layer flutter__wing flutter__wing--r" src={IMAGES.logoLayers.wingR} alt="" />
      <img className="flutter__layer" src={IMAGES.logoLayers.front} alt="" />
    </span>
  )
}
