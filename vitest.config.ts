import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular'; // AGGIUNGI QUESTO

export default defineConfig({
  plugins: [angular()], // ATTIVA IL PLUGIN QUI
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
});