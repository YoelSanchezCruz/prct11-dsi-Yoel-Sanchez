import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        'src/Practica8/*',
        '**/*.json',                
        'node_modules/**',
        'dist/**',
        'src/prueba'
      ]
    }
  }
});