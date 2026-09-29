const isDevelopmentRuntime = process.env.npm_lifecycle_event === 'dev';
const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiBasePath = process.env.NUXT_PUBLIC_API_BASE_PATH || '/api/v1';

export default defineNuxtConfig({
  hooks: {
    'pages:extend'(pages) {
      if (isDevelopmentRuntime) return;
      const sandboxPage = pages.findIndex(page => page.path === '/dev/doku-sandbox');
      if (sandboxPage !== -1) pages.splice(sandboxPage, 1);
    }
  },
  experimental: {
    appManifest: isDevelopmentRuntime
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'id',
    locales: [
      { code: 'id', name: 'Bahasa Indonesia', language: 'id-ID', file: 'id.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' }
    ],
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'hari_santri_locale',
      redirectOn: 'root',
      fallbackLocale: 'id'
    },
    vueI18n: './i18n.config.ts'
  },
  nitro: {
    devProxy: {
      [apiBasePath]: {
        target: `${apiBaseUrl}${apiBasePath}`,
        changeOrigin: true
      }
    },
    prerender: {
      concurrency: 1
    }
  },
  app: {
    head: {
      title: 'Hari Santri 2026',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
      meta: [
        {
          name: 'description',
          content: 'Portal resmi Sepeda Sehat dan Jalan Sehat Keluarga Hari Santri 2026.'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      backendOrigin: apiBaseUrl,
      apiBasePath,
      eventSlug: process.env.NUXT_PUBLIC_EVENT_SLUG || 'hari-santri-2026',
      canonicalSiteUrl: siteUrl,
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Hari Santri 2026'
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/workshops': { prerender: true },
    // Package prices can be updated at any time. Fetch them in the browser
    // instead of embedding the API response into the production build.
    '/tickets': { ssr: false },
    '/partners': { prerender: true },
    '/business-matching': { ssr: false },
    '/deal-room': { prerender: true },
    '/participants': { prerender: true },
    '/exhibition': { prerender: true },
    '/faq': { prerender: true },
    '/contact': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/code-of-conduct': { prerender: true },
    '/refund-policy': { prerender: true },
    '/directory-consent': { prerender: true },
    // Password-reset tokens only exist in the browser query string. Rendering
    // this page client-side prevents a prerendered empty query from winning
    // during hydration.
    '/auth/reset-password': { ssr: false },
    '/speakers/**': { ssr: false },
    '/program': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/payment/**': { ssr: false },
    '/admin/**': { ssr: false }
  },
  compatibilityDate: '2026-08-01'
});
