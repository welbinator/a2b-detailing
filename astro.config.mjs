import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.PAGES_BASE || '/',
  build: { inlineStylesheets: 'never' },
  server: { host: true },
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
    },
  },
});
