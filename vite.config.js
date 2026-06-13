import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static SPA build. Output goes to dist/, which Vercel serves.
// /api serverless functions and /public static files are handled
// separately by Vercel and are not part of this bundle.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2018',
    cssMinify: true
  }
});
