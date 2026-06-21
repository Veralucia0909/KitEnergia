import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // <-- MUDAMOS AQUI! De './' para '/'
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/icon.svg',
        '/logo.svg'
      ],
      manifest: {
        name: "KitEnergia – Controle de Leituras",
        short_name: "KitEnergia",
        description: "Controle de consumo de energia para kitnets",
        theme_color: "#3a4f7a",
        background_color: "#0d1117",
        display: "standalone",
        orientation: "portrait",
        start_url: "/", // <-- MUDAMOS AQUI TAMBÉM!
        scope: "/",     // <-- E AQUI TAMBÉM!
        lang: "pt-BR",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});