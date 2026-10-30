# Le Papillon Danse 66

Sitio web multilingüe (francés, español, inglés y árabe) de **Le Papillon Danse 66**, asociación de danza y bienestar femenino en Perpignan. Rediseño del sitio original en Wix, hecho con React + Vite.

## Empezar

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
```

## Estructura

```
src/
  i18n/
    index.js           configuración de idiomas (agregar uno nuevo acá)
    locales/*.json     textos de cada idioma
  config/site.js       teléfono, email, redes, rutas de imágenes y PDF
  components/          Header, Footer, selector de idioma, formulario…
  pages/               Home, Sully, Cours, En ligne, Contact, Inscription
  styles/global.css    estilos y paleta de colores
public/
  images/              imágenes del sitio (ver LEEME.txt)
  docs/inscription.pdf ficha de inscripción
```

## Idiomas

- Cada idioma tiene su URL: `/fr`, `/es`, `/en`, `/ar`. En la primera visita se usa el idioma del navegador.
- El árabe se muestra de derecha a izquierda automáticamente (`dir="rtl"`); los estilos usan propiedades lógicas, por eso no hace falta CSS aparte.
- Para sumar un idioma: crear `src/i18n/locales/xx.json` copiando `fr.json` y agregarlo en `src/i18n/index.js`.

## Pendiente

- [ ] Bajar las imágenes y la música del sitio original: `npm run images` (el logo ya está en el repo)
- [ ] Reemplazar la foto de stock de Wix de "Préparation corporelle" por una propia
- [ ] PDF de inscripción en `public/docs/inscription.pdf`
- [ ] Crear el formulario en [Formspree](https://formspree.io) y poner su ID en `.env` (ver `.env.example`)
- [ ] Texto completo de la historia de Sully
- [ ] Prerenderizado para SEO (`vite-react-ssg`) antes de publicar
- [x] Reservas con Setmore y pagos con PayPal (`src/config/booking.js`: precios, duraciones y links)
- [ ] Si cambia un precio o servicio en Setmore, actualizar `src/config/booking.js`
- [ ] Video profesional del videasta para la portada
- [ ] Feed de Instagram en el sitio (Behold.so, que conecte Sully)
- [ ] Fase 3: ebooks, programas, meditaciones y link a la tienda

## Deploy

Funciona en Netlify (`public/_redirects`) y Vercel (`vercel.json`) como SPA.
