import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon-192.svg', 'icon-512.svg', 'apple-touch-icon.svg'],
            manifest: {
                name: 'Habits',
                short_name: 'Habits',
                description: 'Daily habit tracking',
                theme_color: '#22c55e',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
                    { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
                    {
                        src: '/icon-512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg}'],
                navigateFallback: 'index.html',
                navigateFallbackAllowlist: [/^$/],
                runtimeCaching: [
                    {
                        urlPattern: /^\/api\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:3001',
        },
    },
});
