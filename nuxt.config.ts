// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devServer: {
    port: 8470,
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var m=localStorage.getItem('csv-parser-color-mode')||'auto';var d=m==='dark'||(m==='auto'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark');window.__CSV_COLOR_MODE__=m}catch(e){}})()`,
          type: 'text/javascript',
        },
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

  routeRules: {
    '/results': { ssr: false },
  },
})
