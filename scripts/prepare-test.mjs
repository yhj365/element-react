import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fingerprint } from './evidence.mjs';

await mkdir('reports', { recursive: true });
// 仅删除本脚本拥有的旧报告，失败的测试运行不能复用上一次成功结果。
await rm('reports/unit.json', { force: true });
await writeFile(
  'reports/test-input.json',
  JSON.stringify({ fingerprint: fingerprint(), startedAt: new Date().toISOString() }, null, 2),
);
