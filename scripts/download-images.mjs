// Descarga las imágenes y la música del sitio original de Wix
// Uso: npm run images
//
// Las imágenes se piden a Wix en JPG (máx. 1600px, o 2400px para el fondo)
// para que el sitio cargue rápido. El logo ya está en el repo (logo.png).

import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const WIX = 'https://static.wixstatic.com/media'
const fit = (id, file, size = 1600) => `${WIX}/${id}/v1/fit/w_${size},h_${size},q_85/${file}`

const FILES = {
  // Fondo de cielo y mar de todas las secciones
  'images/sky.jpg': fit('032056_52632aaef97045e6a95a881804cf117f~mv2.jpg', 'sky.jpg', 2400),
  // Sección "L'Association": Sully bailando, cielo violeta
  'images/about.jpg': fit('032056_ed5c43e7988c4b44878237ff4f90eb3c~mv2.png', 'about.jpg'),
  // Sección "Philosophie": fondo del círculo (silueta con alas)
  'images/philosophy-bg.jpg': fit('032056_c5cd026cbc58489d85c87a31fd412a34~mv2.jpg', 'philosophy-bg.jpg'),
  // Sección "Philosophie": foto de Sully / página Sully
  'images/sully.jpg': fit('032056_4c483b3c3ed548af8192a1902309bbad~mv2.png', 'sully.jpg'),
  // Cursos (fotos redondas)
  'images/course-intuitive.jpg': fit('032056_debc094bc79041008d32ff2dd602f6db~mv2.jpg', 'course-intuitive.jpg'),
  'images/course-orientale.jpg': fit('032056_156acf9dd9604198ba6a70754bb43ef6~mv2.jpg', 'course-orientale.jpg'),
  'images/course-prepa.jpg': fit('670115ca0d0b47eb9fbf359dfce87a8e.jpg', 'course-prepa.jpg'), // stock de Wix: reemplazar
  'images/course-ateliers.jpg': fit('032056_cfd7aeb7c350459aa9ecca46919fa5db~mv2.png', 'course-ateliers.jpg'),
  // Música del sitio
  'audio/music.mp3': 'https://music.wixstatic.com/mp3/032056_66794b9a75f443938cb6cdd369e5988d.mp3',
}

for (const [path, url] of Object.entries(FILES)) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const dest = join(ROOT, path)
    await mkdir(dirname(dest), { recursive: true })
    await writeFile(dest, buf)
    console.log(`✓ ${path} (${Math.round(buf.length / 1024)} KB)`)
  } catch (err) {
    console.error(`✗ ${path}: ${err.message}`)
  }
}
