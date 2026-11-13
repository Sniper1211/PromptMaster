import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// NOTE: the old `admin-api` dev middleware (POST /api/save-prompt) and the
// GEMINI_API_KEY `define` block were removed in the Phase 0 security cleanup.
// - The middleware could rewrite src/data/prompts-*.ts without any auth.
// - Inlining keys via `define` bakes them into the public JS bundle.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          seo: ['react-helmet-async']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
