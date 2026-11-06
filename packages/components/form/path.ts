export type FormPath = string | string[];

/** 路径数组和点路径统一为字段注册键。 */
export function pathKey(path: FormPath): string {
  return Array.isArray(path) ? path.join('.') : path;
}

/** 按字段路径读取，保留原值类型；缺失路径返回undefined。 */
export function getFieldValue(model: Record<string, unknown>, path: FormPath): unknown {
  return (Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, '.$1').split('.')).reduce<unknown>(
    (value, key) =>
      value !== null && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined,
    model,
  );
}

/** 复制表单数据，Date与数组保留形状；其他对象按引用使用，不执行其方法。 */
export function cloneValue<T>(value: T): T {
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (Array.isArray(value)) return value.map((item) => cloneValue(item)) as T;
  if (value && Object.getPrototypeOf(value) === Object.prototype)
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)])) as T;
  return value;
}

/** 按路径生成新模型，不直接修改父级受控对象。 */
export function setFieldValue(
  model: Record<string, unknown>,
  path: FormPath,
  value: unknown,
): Record<string, unknown> {
  const keys = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, '.$1').split('.');
  const copy = cloneValue(model);
  let cursor: Record<string, unknown> | unknown[] = copy;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const current = (cursor as Record<string, unknown>)[key];
    if (!current || typeof current !== 'object')
      (cursor as Record<string, unknown>)[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    cursor = (cursor as Record<string, unknown>)[key] as Record<string, unknown>;
  }
  (cursor as Record<string, unknown>)[keys.at(-1)!] = cloneValue(value);
  return copy;
}
