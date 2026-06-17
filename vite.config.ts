import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Mobile-first PWA: installable, offline app-shell via Workbox precaching.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'ReLoop — Return Right companion',
        short_name: 'ReLoop',
        description:
          'An engagement layer on top of Singapore’s BCRS “Return Right” deposit scheme.',
        theme_color: '#059669',
        background_color: '#059669',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
