import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shubh72010.github.io/JusDots/',
  base: '/JusDots/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
