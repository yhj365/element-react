import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** React及JSX运行时由宿主提供，组件包不内置第二份React。 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'packages/element-react/index.ts',
      name: 'ElementReact',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/],
      output: { banner: "'use client';" },
    },
  },
});
