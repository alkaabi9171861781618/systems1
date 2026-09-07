import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// راجع ملف README.md لشرح كل خطوة بالتفصيل
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ALKAABI TECH - إدارة الطلبات',
        short_name: 'ALKAABI TECH',
        description: 'نظام إدارة طلبات صيانة الأجهزة - ALKAABI TECH',
        theme_color: '#1C2321',
        background_color: '#F6F4EF',
        display: 'standalone',
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'ar',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
