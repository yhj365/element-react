'use client';

import { createContext, useContext, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type ComponentSize = 'large' | 'default' | 'small';
export type SemanticType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export interface BaseProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}
export interface GlobalConfig {
  size?: ComponentSize;
  namespace?: string;
  locale?: 'zh-cn' | 'en';
  zIndex?: number;
  button?: {
    type?: SemanticType | 'default' | '' | 'text';
    plain?: boolean;
    text?: boolean;
    round?: boolean;
    dashed?: boolean;
    autoInsertSpace?: boolean;
  };
  card?: { shadow?: 'always' | 'hover' | 'never' };
  link?: { type?: SemanticType | 'default'; underline?: boolean | 'always' | 'hover' | 'never' };
}
export const ConfigContext = createContext<GlobalConfig>({ namespace: 'el', locale: 'en', zIndex: 2000 });
export const FormContext = createContext<{
  size?: ComponentSize;
  disabled?: boolean;
  resetFields?: () => void;
}>({});

export const FieldValidationContext = createContext<{
  change: (value: unknown) => void;
  blur: () => void;
  errorId: string;
  invalid: boolean;
} | null>(null);

/** 合并非空类名，不覆盖调用方附加的状态。 */
export function cx(...values: (string | false | undefined | null)[]): string {
  return values.filter(Boolean).join(' ');
}

/** 从当前Provider生成与原主题对应的BEM类名。 */
export function useNamespace(block: string) {
  const namespace = useContext(ConfigContext).namespace ?? 'el';
  const base = `${namespace}-${block}`;
  return {
    namespace,
    b: base,
    e: (element: string) => `${base}__${element}`,
    m: (modifier?: string) => (modifier ? `${base}--${modifier}` : ''),
    is: (state: string, ...args: [] | [boolean | undefined]) =>
      args.length === 0 || args[0] ? `is-${state}` : '',
  };
}

/** 组件尺寸优先，未指定时继承表单和全局尺寸。 */
export function useSize(size?: ComponentSize): ComponentSize | undefined {
  const form = useContext(FormContext);
  const config = useContext(ConfigContext);
  return size ?? form.size ?? config.size;
}

/** false是显式覆盖，只有未提供的disabled才继承表单。 */
export function useDisabled(disabled?: boolean): boolean {
  const form = useContext(FormContext);
  return disabled ?? form.disabled ?? false;
}

/** 受控状态由父级回写；非受控defaultValue只在初始化时读取。 */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  /** 只处理交互请求，Props同步不触发外部回调。 */
  function update(next: T): void {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }
  return [current, update];
}

/** 组件库内置文案；完整locale资源仍须按任务清单逐项移植。 */
export function useText() {
  const zh = useContext(ConfigContext).locale === 'zh-cn';
  return {
    close: zh ? '关闭' : 'Close',
    clear: zh ? '清空' : 'Clear',
    empty: zh ? '暂无数据' : 'No Data',
    loading: zh ? '加载中' : 'Loading',
    noMatch: zh ? '无匹配数据' : 'No matching data',
    expand: zh ? '展开' : 'Expand',
    collapse: zh ? '收起' : 'Collapse',
    selectFiles: zh ? '选择文件' : 'Select files',
    uploading: zh ? '上传中' : 'Uploading',
    showPassword: zh ? '显示密码' : 'Show password',
    hidePassword: zh ? '隐藏密码' : 'Hide password',
  };
}
