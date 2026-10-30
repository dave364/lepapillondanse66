// Datos fijos del sitio (no se traducen)
export const SITE = {
  name: 'Le Papillon Danse 66',
  url: 'https://www.lepapillondanse66.com',
  phone: '+33 7 59 74 15 77',
  phoneHref: 'tel:+33759741577',
  email: 'lepapillondanse@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/share/1F7gmMpUMo/',
    instagram: 'https://www.instagram.com/lepapillondanse66',
    youtube: 'https://www.youtube.com/@LepapillonDanse',
  },
  // Sala de las clases presenciales
  studio: {
    name: 'Salle Sweet Om « Centre del Món »',
    street: '1 bis rue de la Pépinière Robin',
    city: '66000 Perpignan',
    mapEmbed: 'https://www.google.com/maps?q=Salle%20Sweet%20Om%2C%201%20bis%20rue%20de%20la%20P%C3%A9pini%C3%A8re%20Robin%2C%2066000%20Perpignan&output=embed',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=1%20bis%20rue%20de%20la%20P%C3%A9pini%C3%A8re%20Robin%2C%2066000%20Perpignan',
  },
  // Ficha de inscripción: poner el PDF en public/docs/inscription.pdf
  signupPdf: '/docs/inscription.pdf',
  // Música de fondo (se baja con `npm run images`)
  music: '/audio/music.mp3',
  // Formulario: crear un form en https://formspree.io y poner el ID en .env
  formspreeId: import.meta.env.VITE_FORMSPREE_ID || '',
}

// Imágenes: se bajan del sitio original con `npm run images`
export const IMAGES = {
  logo: '/images/logo.png',
  // Etapas de la Méthode Mariposa (chenille, chrysalide, papillon)
  stages: ['/images/stages/chenille.jpg', '/images/stages/chrysalide.jpg', '/images/stages/papillon.jpg'],
  // Capas del logo para animar las alas (ver FlutterLogo)
  logoLayers: {
    base: '/images/logo-base.png',
    wingL: '/images/logo-wing-l.png',
    wingR: '/images/logo-wing-r.png',
    front: '/images/logo-front.png',
  },
  // Retrato de Sully recortado del afiche (página de terapias)
  portrait: '/images/sully-portrait.jpg',
  sky: '/images/sky.jpg',
  about: '/images/about.jpg',
  philosophyBg: '/images/philosophy-bg.jpg',
  sully: '/images/sully.jpg',
  courses: [
    '/images/course-intuitive.jpg',
    '/images/course-orientale.jpg',
    '/images/course-prepa.jpg',
    '/images/course-ateliers.jpg',
  ],
}

// Eventos: video profesional y galería de fotos.
// El video está alojado por ahora en el sitio de Wix. Cuando se tenga el
// archivo, ponerlo en public/video/ y cambiar `sources` por esa ruta.
// Para la galería: poner las fotos en public/images/eventos/ y agregarlas a
// `gallery` ({ src, alt }). Si la lista está vacía, la galería no se muestra.
const WIX_VIDEO = 'https://video.wixstatic.com/video/032056_b6271730568b467192146c5314911b02'
export const EVENTS = {
  video: {
    poster: 'https://static.wixstatic.com/media/032056_b6271730568b467192146c5314911b02f000.jpg',
    sources: ['720p', '1080p', '480p', '360p'].map((q) => `${WIX_VIDEO}/${q}/mp4/file.mp4`),
  },
  gallery: [],
}
