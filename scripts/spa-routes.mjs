// Copia index.html a cada ruta (/fr/soins/index.html, etc.) para que los
// links directos funcionen en cualquier hosting estático (Render, GitHub Pages…)
import { mkdir, copyFile } from 'node:fs/promises'
import { join } from 'node:path'

const LANGS = ['fr', 'es', 'en', 'ar']
const PAGES = ['', 'sully', 'cours', 'soins', 'en-ligne', 'contact', 'inscription']
const dist = 'dist'

for (const lang of LANGS) {
  for (const page of PAGES) {
    const dir = join(dist, lang, page)
    await mkdir(dir, { recursive: true })
    await copyFile(join(dist, 'index.html'), join(dir, 'index.html'))
  }
}
await copyFile(join(dist, 'index.html'), join(dist, '404.html'))
console.log('Rutas SPA generadas')
