import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: true,
    include: ['src/**/*.{test,spec}.jsx']
  }
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { fileURLToPath, URL } from 'node:url'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
//   },
//   test: { environment: 'jsdom' }
// })