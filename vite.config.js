import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Permite mostrar el sitio en desarrollo a otra persona con el
    // reenvío de puertos de VS Code (*.devtunnels.ms)
    allowedHosts: ['.devtunnels.ms'],
  },
})
