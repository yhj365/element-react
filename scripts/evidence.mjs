import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** 指纹同时覆盖实现、测试和示例，防止旧报告继续授权新文档。 */
export function fingerprint() {
  const hash = createHash('sha256');
  const roots = [
    'packages',
    'tests',
    'docs/examples',
    'docs/src',
    'scripts',
    'reference/element-plus/packages/theme-chalk/src',
  ];
  /** 文件按固定顺序遍历，排除机器时间对结果的影响。 */
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory() && entry.name !== 'generated') visit(file);
      else if (entry.isDirectory()) continue;
      else {
        hash.update(file.replaceAll('\\', '/'));
        hash.update(readFileSync(file));
      }
    }
  }
  roots.forEach(visit);
  for (const file of [
    'design/api-matrix.json',
    'design/source-manifest.json',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vitest.config.ts',
  ]) {
    hash.update(file);
    hash.update(readFileSync(file));
  }
  return hash.digest('hex');
}
