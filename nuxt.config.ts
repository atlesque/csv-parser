// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devServer: {
    port: 8470,
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
     optimizeDeps: {
      include: [
        'papaparse', // CJS
      ]
    }
  },

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },

  routeRules: {
    '/results': { ssr: false },
  },
})
