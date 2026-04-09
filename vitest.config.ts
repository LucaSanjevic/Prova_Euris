import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    server: {
      deps: {
        inline: [/runtime/], // Se 'inline' fallisce qui, prova a rimuoverlo del tutto
      },
    },
    // Se usi i file .html e .scss esterni, Vitest ha bisogno di trasformarli
    css: true,
  },
});