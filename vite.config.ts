import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/** 文档直接引用本地源码；生产文档独立输出，避免覆盖组件产物。 */
export default defineConfig({
  root: 'docs',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { 'element-react': path.resolve('packages/element-react/index.ts') } },
  server: { port: 3100, strictPort: true, fs: { allow: [process.cwd()] } },
  build: {
    outDir: '../dist-docs',
    emptyOutDir: true,
    rolldownOptions: {
      output: { codeSplitting: { groups: [{ name: 'react', test: /node_modules[\\/]react/ }] } },
    },
  },
});
