'use client';
import { useContext, useImperativeHandle, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { ConfigContext, useNamespace } from '../../hooks';
import { Select } from '../select';
import { Icon } from '../icon';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { CSSProperties, FocusEvent, ReactNode, Ref } from 'react';
import type { SelectHandle, SelectModel } from '../select';

dayjs.extend(customParseFormat);
export type TimeSelectValue = string | number | boolean | null | undefined;
export interface TimeSelectHandle {
  focus: () => void;
  blur: () => void;
}
export interface TimeSelectProps extends BaseProps {
  value?: TimeSelectValue;
  defaultValue?: TimeSelectValue;
  onValueChange?: (value: TimeSelectValue) => void;
  onChange?: (value: TimeSelectValue) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  disabled?: boolean;
  editable?: boolean;
  clearable?: boolean;
  includeEndTime?: boolean;
  size?: ComponentSize;
  placeholder?: string;
  name?: string;
  effect?: 'dark' | 'light';
  prefixIcon?: ReactNode;
  clearIcon?: ReactNode;
  start?: string;
  end?: string;
  step?: string;
  minTime?: string;
  maxTime?: string;
  format?: string;
  emptyValues?: unknown[];
  valueOnClear?: TimeSelectValue | (() => TimeSelectValue);
  popperClass?: string;
  popperStyle?: CSSProperties;
  ariaLabel?: string;
  ref?: Ref<TimeSelectHandle>;
}
/** 来源解析规则兼容AM/PM和大于24小时的步进，不额外收紧原取值范围。 */
function minutesOf(time: string): number | undefined {
  const parts = (time || '').split(':');
  if (parts.length < 2) return;
  let hours = Number.parseInt(parts[0], 10);
  const minutes = Number.parseInt(parts[1], 10);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
  const upper = time.toUpperCase();
  if (upper.includes('AM') && hours === 12) hours = 0;
  else if (upper.includes('PM') && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}
/** 非法配置回退来源默认值，零步长也回退以保证循环推进。 */
function configuredMinutes(time: string, fallback: number, step = false): number {
  const parsed = minutesOf(time),
    parts = time.split(':');
  if (
    parsed === undefined ||
    Number.parseInt(parts[0], 10) < 0 ||
    Number.parseInt(parts[1], 10) < 0 ||
    (step && parsed === 0)
  )
    return fallback;
  return parsed;
}
/** 固定间隔时间选项复用Select的交互与浮层，时间生成与格式化保持独立。 */
export function TimeSelect({
  value,
  defaultValue,
  onValueChange,
  onChange,
  onFocus,
  onBlur,
  onClear,
  disabled,
  editable = true,
  clearable = true,
  includeEndTime = false,
  size,
  placeholder,
  name,
  effect = 'light',
  prefixIcon,
  clearIcon,
  start = '09:00',
  end = '18:00',
  step = '00:30',
  minTime,
  maxTime,
  format = 'HH:mm',
  emptyValues,
  valueOnClear,
  popperClass,
  popperStyle,
  ariaLabel,
  ref,
  ...rest
}: TimeSelectProps) {
  const config = useContext(ConfigContext),
    ns = useNamespace('input'),
    select = useRef<SelectHandle>(null);
  const options = useMemo(() => {
    const from = configuredMinutes(start, 540),
      to = configuredMinutes(end, 1080),
      increment = configuredMinutes(step, 30, true);
    const min = minutesOf(minTime ?? '') ?? -61,
      max = minutesOf(maxTime ?? '') ?? 6100;
    const values: number[] = [];
    // 有限数值来自parseInt，正步长保证结束；不按24小时截断来源允许的时间。
    for (let current = from; current <= to; current += increment) values.push(current);
    if (includeEndTime && values.at(-1) !== to) values.push(to);
    return values.map((minutes) => {
      const raw = `${Math.floor(minutes / 60)
        .toString()
        .padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
      const formatted = dayjs(raw, 'HH:mm')
        .locale(config.locale ?? 'en')
        .format(format);
      return { value: formatted, label: formatted, disabled: minutes <= min || minutes >= max };
    });
  }, [start, end, step, minTime, maxTime, format, includeEndTime, config.locale]);
  useImperativeHandle(ref, () => ({
    focus: () => select.current?.focus(),
    blur: () => select.current?.blur(),
  }));
  /** Select的单选通道不产生数组；类型边界不把内部多选联合暴露给调用方。 */
  function scalar(next: SelectModel<string | number | boolean>, callback: TimeSelectProps['onChange']): void {
    if (!Array.isArray(next)) callback?.(next);
  }
  const clock = (
    <svg viewBox="0 0 1024 1024" aria-hidden="true">
      <path
        fill="currentColor"
        d="M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896zm0 64a384 384 0 1 1 0 768 384 384 0 0 1 0-768zm-32 96h64v256h192v64H480z"
      />
    </svg>
  );
  return (
    <Select<string | number | boolean>
      {...rest}
      ref={select}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => scalar(next, onValueChange)}
      onChange={(next) => scalar(next, onChange)}
      onFocus={onFocus}
      onBlur={onBlur}
      onClear={onClear}
      disabled={disabled}
      filterable={editable}
      clearable={clearable}
      size={size}
      placeholder={placeholder}
      name={name}
      effect={effect}
      clearIcon={clearIcon}
      defaultFirstOption
      options={options}
      emptyValues={emptyValues}
      valueOnClear={valueOnClear}
      popperClass={popperClass}
      popperStyle={popperStyle}
      ariaLabel={ariaLabel}
      renderPrefix={
        <Icon className={ns.e('prefix-icon')}>{prefixIcon === undefined ? clock : prefixIcon}</Icon>
      }
    />
  );
}
