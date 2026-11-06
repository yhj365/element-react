'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { cx, useNamespace } from '../../hooks';
import type { CSSProperties, ReactNode } from 'react';
import type { BaseProps } from '../../hooks';

export interface SkeletonItemProps extends BaseProps {
  variant?: 'p' | 'text' | 'h1' | 'h3' | 'caption' | 'button' | 'image' | 'circle' | 'rect';
}
/** 骨架项直接复用来源形状类名。 */
export function SkeletonItem({ variant = 'text', className, ...rest }: SkeletonItemProps) {
  const ns = useNamespace('skeleton');
  return <div {...rest} className={cx(ns.e('item'), ns.e(variant), className)} aria-hidden="true" />;
}
export interface SkeletonProps extends BaseProps {
  loading?: boolean;
  animated?: boolean;
  count?: number;
  rows?: number;
  throttle?: number | { leading?: number; trailing?: number; initVal?: boolean };
  renderTemplate?: ReactNode;
}
/** 数字延迟出现，对象分别控制出现与结束延迟；清理过期定时器。 */
export function Skeleton({
  loading = true,
  animated = false,
  count = 1,
  rows = 3,
  throttle = 0,
  renderTemplate,
  className,
  children,
  ...rest
}: SkeletonProps) {
  const ns = useNamespace('skeleton');
  const [ready, setReady] = useState(
    throttle === 0 ? loading : typeof throttle === 'object' && Boolean(throttle.initVal),
  );
  useEffect(() => {
    const delay =
      typeof throttle === 'number'
        ? loading
          ? throttle
          : undefined
        : loading
          ? throttle.leading
          : throttle.trailing;
    if (delay === undefined || delay === 0) {
      setReady(loading);
      return;
    }
    const timer = setTimeout(() => setReady(loading), delay);
    return () => clearTimeout(timer);
  }, [loading, throttle]);
  if (!(throttle === 0 ? loading : ready)) return <>{children}</>;
  return (
    <div {...rest} className={cx(ns.b, ns.is('animated', animated), className)} aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <Fragment key={i}>
          {renderTemplate ?? (
            <>
              <SkeletonItem variant="p" className={ns.is('first')} />
              {Array.from({ length: rows }, (_, row) => (
                <SkeletonItem
                  key={row}
                  variant="p"
                  className={cx(ns.e('paragraph'), ns.is('last', row === rows - 1 && rows > 1))}
                />
              ))}
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export interface StatisticProps extends BaseProps {
  title?: ReactNode;
  value?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  precision?: number;
  formatter?: (value: number) => ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  valueStyle?: CSSProperties;
  renderTitle?: ReactNode;
  renderPrefix?: ReactNode;
  renderSuffix?: ReactNode;
}
/** 格式化统计数字，保留负数、小数分隔符和自定义formatter优先级。 */
export function Statistic({
  title,
  value = 0,
  decimalSeparator = '.',
  groupSeparator = ',',
  precision = 0,
  formatter,
  prefix,
  suffix,
  valueStyle,
  renderTitle,
  renderPrefix,
  renderSuffix,
  className,
  ...rest
}: StatisticProps) {
  const ns = useNamespace('statistic');
  const [integer, fraction] = value.toFixed(Math.min(100, Math.max(0, precision))).split('.');
  const formatted =
    integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator) +
    (fraction === undefined ? '' : decimalSeparator + fraction);
  return (
    <div {...rest} className={cx(ns.b, className)}>
      {(renderTitle ?? title) !== undefined && <div className={ns.e('head')}>{renderTitle ?? title}</div>}
      <div className={ns.e('content')} style={valueStyle}>
        {(renderPrefix ?? prefix) !== undefined && (
          <span className={ns.e('prefix')}>{renderPrefix ?? prefix}</span>
        )}
        <span className={ns.e('number')}>{formatter ? formatter(value) : formatted}</span>
        {(renderSuffix ?? suffix) !== undefined && (
          <span className={ns.e('suffix')}>{renderSuffix ?? suffix}</span>
        )}
      </div>
    </div>
  );
}
export interface CountdownProps extends Omit<StatisticProps, 'value' | 'formatter'> {
  value: number | Date;
  format?: string;
  onChange?: (remaining: number) => void;
  onFinish?: () => void;
}
/** 截止时间倒计时；回调只随计时变化，完成仅触发一次。 */
export function Countdown({ value, format = 'HH:mm:ss', onChange, onFinish, ...rest }: CountdownProps) {
  const deadline = +value;
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));
  const callbacks = useRef({ onChange, onFinish });
  useEffect(() => {
    callbacks.current = { onChange, onFinish };
  }, [onChange, onFinish]);
  useEffect(() => {
    let finished = false;
    /** 依据绝对时间计算，避免后台定时器积累误差。 */
    function tick(): void {
      const next = Math.max(0, deadline - Date.now());
      setRemaining(next);
      callbacks.current.onChange?.(next);
      if (next === 0 && !finished) {
        finished = true;
        callbacks.current.onFinish?.();
      }
    }
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline]);
  const seconds = Math.ceil(remaining / 1000);
  const fields: Record<string, number> = {
    DD: Math.floor(seconds / 86400),
    HH: Math.floor(seconds / 3600) % (format.includes('DD') ? 24 : Infinity),
    mm: Math.floor(seconds / 60) % 60,
    ss: seconds % 60,
  };
  return (
    <Statistic
      {...rest}
      value={remaining}
      formatter={() => format.replace(/DD|HH|mm|ss/g, (token) => String(fields[token]).padStart(2, '0'))}
    />
  );
}

export type ProgressColor =
  string | ((percentage: number) => string) | Array<{ color: string; percentage: number } | string>;
export interface ProgressProps extends BaseProps {
  percentage?: number;
  type?: 'line' | 'circle' | 'dashboard';
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  textInside?: boolean;
  status?: '' | 'success' | 'exception' | 'warning';
  indeterminate?: boolean;
  duration?: number;
  color?: ProgressColor;
  width?: number;
  showText?: boolean;
  format?: (percentage: number) => ReactNode;
  striped?: boolean;
  stripedFlow?: boolean;
  renderDefault?: (percentage: number) => ReactNode;
}
/** 获取当前颜色，阈值排序不会改变调用方数组。 */
function progressColor(color: ProgressColor | undefined, percentage: number): string | undefined {
  if (typeof color === 'string') return color;
  if (typeof color === 'function') return color(percentage);
  if (!color?.length) return undefined;
  const steps = color
    .map((entry, i) =>
      typeof entry === 'string' ? { color: entry, percentage: ((i + 1) * 100) / color.length } : entry,
    )
    .sort((a, b) => a.percentage - b.percentage);
  return (steps.find((entry) => percentage < entry.percentage) ?? steps[steps.length - 1]).color;
}
/** 线形与环形进度保留比例、状态、文本和动画控制。 */
export function Progress({
  percentage = 0,
  type = 'line',
  strokeWidth = 6,
  strokeLinecap = 'round',
  textInside = false,
  status = '',
  indeterminate,
  duration = 3,
  color,
  width = 126,
  showText = true,
  format,
  striped,
  stripedFlow,
  renderDefault,
  className,
  ...rest
}: ProgressProps) {
  const ns = useNamespace('progress');
  const value = Math.max(0, Math.min(100, percentage));
  const stroke =
    progressColor(color, value) ||
    { success: '#13ce66', exception: '#ff4949', warning: '#e6a23c', '': '#409eff' }[status];
  const content = renderDefault?.(value) ?? format?.(value) ?? `${value}%`;
  const radius = 50 - (strokeWidth / width) * 50;
  const perimeter = 2 * Math.PI * radius;
  const rate = type === 'dashboard' ? 0.75 : 1;
  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx(
        ns.b,
        ns.m(type),
        status && ns.is(status),
        ns.m(!showText ? 'without-text' : ''),
        textInside && ns.m('text-inside'),
        className,
      )}
    >
      {type === 'line' ? (
        <div className={`${ns.b}-bar`}>
          <div className={`${ns.b}-bar__outer`} style={{ height: strokeWidth }}>
            <div
              className={cx(
                `${ns.b}-bar__inner`,
                indeterminate && `${ns.b}-bar__inner--indeterminate`,
                striped && `${ns.b}-bar__inner--striped`,
                stripedFlow && `${ns.b}-bar__inner--striped-flow`,
              )}
              style={{ width: `${value}%`, background: stroke, animationDuration: `${duration}s` }}
            >
              {textInside && showText && <div className={`${ns.b}-bar__innerText`}>{content}</div>}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${ns.b}-circle`} style={{ width, height: width }}>
          <svg viewBox="0 0 100 100" style={{ transform: `rotate(${type === 'dashboard' ? 135 : -90}deg)` }}>
            <circle
              className={`${ns.b}-circle__track`}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="var(--el-fill-color-light, #e5e9f2)"
              strokeWidth={(strokeWidth / width) * 100}
              strokeLinecap={strokeLinecap}
              strokeDasharray={`${perimeter * rate} ${perimeter}`}
            />
            <circle
              className={`${ns.b}-circle__path`}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth={(strokeWidth / width) * 100}
              strokeLinecap={strokeLinecap}
              strokeDasharray={`${(perimeter * rate * value) / 100} ${perimeter}`}
              style={{ transition: 'stroke-dasharray .6s ease' }}
            />
          </svg>
        </div>
      )}
      {showText && !textInside && (
        <div
          className={ns.e('text')}
          style={{ fontSize: type === 'line' ? 12 + strokeWidth * 0.4 : width * 0.111111 + 2 }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
