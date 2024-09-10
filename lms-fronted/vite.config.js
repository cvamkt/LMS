import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy' // updated import for the correct plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects', // path to your _redirects file
          dest: '' // copies to the root of the output directory
        }
      ]
    })
  ],
})
