import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    proxy: {
      // ── Google Drive thumbnail proxy ──
      // Browser: fetch('/drive-thumb/FILE_ID')
      // Vite forwards to: https://drive.google.com/thumbnail?id=FILE_ID&sz=s1600
      // CORS issue disappears because proxy runs server-side (not browser)
      '/drive-thumb': {
        target: 'https://drive.google.com',
        changeOrigin: true,
        rewrite: (path) => {
          // /drive-thumb/FILE_ID  →  /thumbnail?id=FILE_ID&sz=s1600
          const fileId = path.replace('/drive-thumb/', '');
          return `/thumbnail?id=${fileId}&sz=s1600`;
        },
      },

      // ── Google Drive uc?export=view proxy (fallback) ──
      // Browser: fetch('/drive-view/FILE_ID')
      // Vite forwards to: https://drive.google.com/uc?export=view&id=FILE_ID
      '/drive-view': {
        target: 'https://drive.google.com',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => {
          const fileId = path.replace('/drive-view/', '');
          return `/uc?export=view&id=${fileId}`;
        },
      },
    },
  },
})