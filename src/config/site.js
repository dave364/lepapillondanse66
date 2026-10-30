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
