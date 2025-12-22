import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/**
 * Vite Configuration
 * - React plugin for JSX/Fast Refresh
 * - Environment variables loaded from .env file
 * - All VITE_* variables are automatically exposed to the client
 */
export default defineConfig({
  plugins: [react()],
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true, // Listen on all addresses (useful for network access)
    open: true  // Automatically open browser on server start
  },
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  
  // Environment variables configuration
  envPrefix: 'VITE_'
})

