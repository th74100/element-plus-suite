import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      'element-plus-suite': fileURLToPath(
        new URL('./packages/element-plus-suite/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'packages/**/__tests__/table-pro.*.spec.ts',
      'packages/**/__tests__/form-pro.*.spec.ts',
      'packages/**/__tests__/table-pro.*.spec.tsx',
      'tests/**/*.spec.ts',
      'tests/**/*.spec.tsx',
    ],
    globals: true,
  },
})
