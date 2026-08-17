import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.tsx'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Real class names in the DOM so tests can assert on them and failures are
    // readable, rather than the default hashed output.
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
});
