import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
      clientPort: 5173,
    },
  },
  build: {
    // Production build optimizations
    minify: 'esbuild',
    sourcemap: false,
    // Increase chunk size warning limit (admin pages can be large)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries (lazy load these)
          'ui-libs': ['framer-motion', 'lucide-react'],
          // Large admin dependencies (separate chunk)
          'admin-vendor': ['recharts'],
        },
        // Better chunk naming for debugging
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Enable gzip compression hints
    reportCompressedSize: true,
    // Target modern browsers for smaller bundles
    target: 'es2015',
  },
})
