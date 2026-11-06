'use client';
import { useContext, useImperativeHandle, useState } from 'react';
import { ConfigContext, cx, useControllable, useDisabled, useNamespace, useSize } from '../../hooks';
import { Icon } from '../icon';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { CSSProperties, ReactNode, Ref } from 'react';

type Thresholds<T> = T[] | Record<number, T | { value: T; excluded?: boolean }>;
export interface RateProps extends BaseProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onChange?: (value: number) => void;
  max?: number;
  size?: ComponentSize;
  disabled?: boolean;
  allowHalf?: boolean;
  lowThreshold?: number;
  highThreshold?: number;
  colors?: Thresholds<string>;
  voidColor?: string;
  disabledVoidColor?: string;
  icons?: Thresholds<ReactNode>;
  voidIcon?: ReactNode;
  disabledVoidIcon?: ReactNode;
  showText?: boolean;
  showScore?: boolean;
  textColor?: string;
  texts?: string[];
  scoreTemplate?: string;
  clearable?: boolean;
  ariaLabel?: string;
  label?: string;
  ref?: Ref<{ setCurrentValue: (value: number) => void; resetCurrentValue: () => void }>;
}

/** 依据数值阈值选择颜色或图标，不改变调用方配置。 */
function threshold<T>(
  config: Thresholds<T> | undefined,
  value: number,
  low: number,
  high: number,
): T | undefined {
  if (!config) return undefined;
  if (Array.isArray(config)) return config[value <= low ? 0 : value >= high ? 2 : 1];
  const keys = Object.keys(config)
    .map(Number)
    .sort((a, b) => a - b);
  for (const key of keys) {
    const item = config[key];
    if (item && typeof item === 'object' && 'excluded' in item && 'value' in item) {
      if (item.excluded ? value < key : value <= key) return item.value;
    } else if (value <= key) return item as T;
  }
  const last = config[keys.at(-1)!];
  return last && typeof last === 'object' && 'excluded' in last && 'value' in last ? last.value : (last as T);
}
/** 星形几何保留在SVG内，半星使用独立覆盖层。 */
function Star() {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden="true">
      <path
        fill="currentColor"
        d="m512 64 138 280 309 45-224 218 53 308-276-145-276 145 53-308L65 389l309-45z"
      />
    </svg>
  );
}

/** 鼠标预览与提交分离，禁用评分仍可显示精确的小数比例。 */
export function Rate({
  value,
  defaultValue = 0,
  onValueChange,
  onChange,
  max = 5,
  size,
  disabled,
  allowHalf = false,
  lowThreshold = 2,
  highThreshold = 4,
  colors,
  voidColor,
  disabledVoidColor,
  icons,
  voidIcon,
  disabledVoidIcon,
  showText = false,
  showScore = false,
  textColor,
  texts,
  scoreTemplate = '{value}',
  clearable = false,
  ariaLabel,
  label,
  ref,
  className,
  style,
  ...rest
}: RateProps) {
  const ns = useNamespace('rate');
  const actualSize = useSize(size);
  const blocked = useDisabled(disabled);
  const config = useContext(ConfigContext);
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? current;
  const fill = threshold(colors, shown, lowThreshold, highThreshold) ?? '#f7ba2a';
  const selectedIcon = threshold(icons, shown, lowThreshold, highThreshold);
  useImperativeHandle(
    ref,
    () => ({
      setCurrentValue: (next) => {
        if (!blocked) setHover(Math.min(max, Math.max(0, next)));
      },
      resetCurrentValue: () => setHover(null),
    }),
    [blocked, max],
  );
  /** 提交时按范围钳制，并实现重复点击清零。 */
  function update(next: number): void {
    if (blocked) return;
    const nextValue = clearable && next === current ? 0 : Math.min(max, Math.max(0, next));
    setCurrent(nextValue);
    if (nextValue !== current) onChange?.(nextValue);
  }
  const labels =
    texts ??
    (config.locale === 'zh-cn'
      ? ['极差', '失望', '一般', '满意', '惊喜']
      : ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise']);
  const content = showScore
    ? scoreTemplate.replace(/\{value\}/g, String(current))
    : (labels[Math.ceil(shown) - 1] ?? '');
  return (
    <div
      {...rest}
      role="slider"
      tabIndex={blocked ? -1 : 0}
      aria-label={ariaLabel ?? label ?? 'rating'}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={current}
      aria-disabled={blocked}
      className={cx(ns.b, ns.m(actualSize), ns.is('disabled', blocked), className)}
      style={
        {
          '--el-rate-void-color': voidColor,
          '--el-rate-disabled-void-color': disabledVoidColor,
          '--el-rate-text-color': textColor,
          ...style,
        } as CSSProperties
      }
      onMouseLeave={() => setHover(null)}
      onKeyDown={(event) => {
        if (blocked) return;
        if (['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          update(
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? max
                : current +
                  (event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1) * (allowHalf ? 0.5 : 1),
          );
        }
      }}
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = Math.max(0, Math.min(1, shown - index));
        return (
          <span
            key={index}
            className={ns.e('item')}
            onMouseMove={(event) => {
              if (blocked) return;
              const box = event.currentTarget.getBoundingClientRect();
              setHover(index + (allowHalf && event.clientX - box.left < box.width / 2 ? 0.5 : 1));
            }}
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              update(
                index + (allowHalf && box.width > 0 && event.clientX - box.left < box.width / 2 ? 0.5 : 1),
              );
            }}
          >
            <Icon
              className={cx(ns.e('icon'), ns.is('active', filled > 0))}
              style={{
                color: filled === 1 ? fill : blocked ? disabledVoidColor : voidColor,
                position: 'relative',
              }}
            >
              {filled === 1
                ? (selectedIcon ?? <Star />)
                : blocked
                  ? (disabledVoidIcon ?? voidIcon ?? <Star />)
                  : (voidIcon ?? <Star />)}
              {filled > 0 && filled < 1 && (
                <span
                  className={ns.e('decimal')}
                  style={{
                    color: fill,
                    width: `${filled * 100}%`,
                    position: 'absolute',
                    inset: '0 auto 0 0',
                    overflow: 'hidden',
                  }}
                >
                  {selectedIcon ?? <Star />}
                </span>
              )}
            </Icon>
          </span>
        );
      })}
      {(showText || showScore) && <span className={ns.e('text')}>{content}</span>}
    </div>
  );
}
