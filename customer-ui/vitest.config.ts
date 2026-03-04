import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    pool: 'vmThreads',
    css: false,
    server: {
      deps: {
        inline: [/sass/, /@csstools/],
      },
    },
  },
});
