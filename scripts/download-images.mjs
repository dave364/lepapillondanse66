// Descarga las imágenes del sitio original de Wix a public/images/
// Uso: node scripts/download-images.mjs
//
// Las imágenes se piden a Wix en JPG, máximo 1600px de lado, para que
// el sitio cargue rápido. Si Sully pasa los originales, reemplazar los
// archivos con el mismo nombre.

import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')
const WIX = 'https://static.wixstatic.com/media'

const IMAGES = {
  'hero.jpg': '032056_ed5c43e7988c4b44878237ff4f90eb3c~mv2.png',             // Sully bailando, cielo violeta
  'about.jpg': '032056_c5cd026cbc58489d85c87a31fd412a34~mv2.jpg',            // silueta con alas de mariposa
  'sully.jpg': '032056_4c483b3c3ed548af8192a1902309bbad~mv2.png',            // Sully, retrato
  'logo.jpg': '032056_253cd2c6f8bf4bf2b7ef4b7dbdfbb354~mv2.png',             // logo Le Papillon Danse
  'course-intuitive.jpg': '032056_debc094bc79041008d32ff2dd602f6db~mv2.jpg', // danza intuitiva
  'course-orientale.jpg': '032056_156acf9dd9604198ba6a70754bb43ef6~mv2.jpg', // danza oriental
  'course-prepa.jpg': '670115ca0d0b47eb9fbf359dfce87a8e.jpg',                // foto de stock de Wix (reemplazar)
  'course-ateliers.jpg': '032056_cfd7aeb7c350459aa9ecca46919fa5db~mv2.png',  // talleres
}

await mkdir(OUT, { recursive: true })

for (const [file, id] of Object.entries(IMAGES)) {
  const url = `${WIX}/${id}/v1/fit/w_1600,h_1600,q_85/${file}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await writeFile(join(OUT, file), buf)
    console.log(`✓ ${file} (${Math.round(buf.length / 1024)} KB)`)
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`)
  }
}
