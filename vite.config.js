import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    optimizeDeps: {
        include: [
            '@stripe/stripe-js',
            '@stripe/react-stripe-js',
            '@paypal/react-paypal-js'
        ]
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    server: {
        port: 3000,
        open: true,
        historyApiFallback: true,
    },
})