import { test } from 'vitest';
import apiMatrix from '../design/api-matrix.json';

/** 将测试精确关联到来源章节和表格行，缺失映射立即使测试失败。 */
export function apiTest(
  component: string,
  section: string,
  names: string[],
  example: string,
  title: string,
  run: () => void | Promise<void>,
): void {
  const rows = names.map((name) => {
    const found = apiMatrix.find(
      (row) =>
        row.component === component &&
        row.section === section &&
        row.sourceName.split(' / v-model')[0] === name,
    );
    if (!found) throw new Error(`来源API不存在：${component}/${section}/${name}`);
    return found;
  });
  test(`${title} ${rows.map((row) => `[api:${row.id}]`).join(' ')} [example:${example}]`, run);
}

/** 功能点独立记录，不依靠有同名Prop就判定行为完成。 */
export function featureTest(
  component: string,
  feature: string,
  example: string,
  title: string,
  run: () => void | Promise<void>,
): void {
  test(`${title} [feature:${component}/${feature}] [example:${example}]`, run);
}
