import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/** 单元/SSR用例排除来源快照，防止误运行Vue测试。 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    clearMocks: true,
    maxWorkers: 2,
    testTimeout: 15000,
  },
});
