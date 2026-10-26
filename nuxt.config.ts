const isDevelopmentRuntime = process.env.npm_lifecycle_event === 'dev';
const isStaticGeneration = process.env.npm_lifecycle_event === 'generate';
const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || (isStaticGeneration ? '' : 'http://127.0.0.1:8000');
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || (isStaticGeneration ? '' : 'http://localhost:3000');
const apiBasePath = process.env.NUXT_PUBLIC_API_BASE_PATH || '/api/v1';
const isLoopbackUrl = (value: string) => /^https?:\/\/(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i.test(value);

if (isStaticGeneration && (!apiBaseUrl || isLoopbackUrl(apiBaseUrl))) {
  throw new Error('Static production build requires NUXT_PUBLIC_API_BASE_URL to point to the production API, not localhost.');
}
if (isStaticGeneration && (!siteUrl || isLoopbackUrl(siteUrl))) {
  throw new Error('Static production build requires NUXT_PUBLIC_SITE_URL to point to the public HTTPS site, not localhost.');
}

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
      { code: 'id', name: 'Bahasa Indonesia', language: 'id-ID', file: 'id.json' }
    ],
    langDir: 'locales',
    detectBrowserLanguage: false,
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
        { rel: 'icon', type: 'image/png', href: '/logo_santri_2026.png' },
        { rel: 'apple-touch-icon', href: '/logo_santri_2026.png' }
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
    // Rute IWBIF yang masih tersisa hanya dipertahankan sebagai alias agar
    // bookmark/link lama tidak membuka formulir dan pembayaran legacy.
    '/register': { redirect: { to: '/daftar', statusCode: 301 } },
    '/register/**': { redirect: { to: '/daftar', statusCode: 301 } },
    '/tickets': { redirect: { to: '/daftar', statusCode: 301 } },
    '/dashboard/cart': { redirect: { to: '/dashboard/payment', statusCode: 301 } },
    '/dashboard/registration-status': { redirect: { to: '/dashboard', statusCode: 301 } },
    '/dashboard/payment-status': { redirect: { to: '/dashboard/payment', statusCode: 301 } },
    '/dashboard/payment-qr': { redirect: { to: '/dashboard/payment', statusCode: 301 } },
    '/dashboard/invoice': { redirect: { to: '/dashboard', statusCode: 301 } },
    '/about': { redirect: { to: '/#tentang', statusCode: 301 } },
    '/workshops': { redirect: { to: '/#kegiatan', statusCode: 301 } },
    '/partners': { redirect: { to: '/#bazar', statusCode: 301 } },
    '/business-matching': { redirect: { to: '/#bazar', statusCode: 301 } },
    '/deal-room': { redirect: { to: '/#bazar', statusCode: 301 } },
    '/participants': { redirect: { to: '/#tentang', statusCode: 301 } },
    '/exhibition': { redirect: { to: '/#bazar', statusCode: 301 } },
    '/faq': { redirect: { to: '/#faq', statusCode: 301 } },
    '/contact': { redirect: { to: '/', statusCode: 301 } },
    '/host': { redirect: { to: '/#tentang', statusCode: 301 } },
    '/venue': { redirect: { to: '/#rute', statusCode: 301 } },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    '/code-of-conduct': { prerender: true },
    '/refund-policy': { prerender: true },
    '/directory-consent': { prerender: true },
    // Password-reset tokens only exist in the browser query string. Rendering
    // this page client-side prevents a prerendered empty query from winning
    // during hydration.
    '/auth/reset-password': { ssr: false },
    '/program': { redirect: { to: '/#agenda', statusCode: 301 } },
    '/speakers/**': { redirect: { to: '/#pengisi-acara', statusCode: 301 } },
    '/dashboard/**': { ssr: false },
    '/payment/**': { ssr: false },
    '/admin/**': { ssr: false }
  },
  compatibilityDate: '2026-08-01'
});
