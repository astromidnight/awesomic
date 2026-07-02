import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

// `npm run dev:phone` serves HTTPS on the LAN so the mic works on a real phone
const phone = process.env.PHONE === '1'

// GitHub Pages serves the app from /awesomic/ (set by the deploy workflow)
const base = process.env.GHPAGES === '1' ? '/awesomic/' : '/'

export default defineConfig({
  base,
  server: phone ? { host: true } : undefined,
  preview: phone ? { host: true } : undefined,
  plugins: [
    ...(phone ? [basicSsl()] : []),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sous-Chef',
        short_name: 'Sous-Chef',
        description: 'Hands-free, voice-guided cooking with live pantry-adaptive substitution.',
        theme_color: '#F7F8FA',
        background_color: '#F7F8FA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
})
