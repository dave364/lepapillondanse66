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
  // Formulario: crear un form en https://formspree.io y poner el ID en .env
  formspreeId: import.meta.env.VITE_FORMSPREE_ID || '',
}

// Imágenes: se bajan del sitio original con `node scripts/download-images.mjs`
export const IMAGES = {
  hero: '/images/hero.jpg',
  logo: '/images/logo.jpg',
  about: '/images/about.jpg',
  sully: '/images/sully.jpg',
  courses: [
    '/images/course-intuitive.jpg',
    '/images/course-orientale.jpg',
    '/images/course-prepa.jpg',
    '/images/course-ateliers.jpg',
  ],
}
