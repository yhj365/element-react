import { compileAsync } from 'sass';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
// 直接编译固定来源主题，避免手工改写造成变量与选择器偏差。
const light = await compileAsync('reference/element-plus/packages/theme-chalk/src/index.scss', {
  style: 'compressed',
});
const dark = await compileAsync('reference/element-plus/packages/theme-chalk/src/dark/css-vars.scss', {
  style: 'compressed',
});
await writeFile(
  'dist/style.css',
  `/*! Element Plus theme — MIT; see LICENSE */\n${light.css}\n${await readFile('packages/components/slider/style.css', 'utf8')}\n${await readFile('packages/components/upload/style.css', 'utf8')}\n${await readFile('packages/components/tree/style.css', 'utf8')}`,
);
await writeFile('dist/dark.css', `/*! Element Plus dark theme — MIT; see LICENSE */\n${dark.css}`);
await cp('reference/element-plus/LICENSE', 'dist/LICENSE');
