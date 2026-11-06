'use client';

import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { cx, useControllable, useDisabled, useNamespace, useSize } from '../../hooks';
import type { BaseProps, ComponentSize } from '../../hooks';

export type SliderValue = number | [number, number];
export interface SliderProps extends BaseProps {
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  onInput?: (value: SliderValue) => void;
  onChange?: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number | 'mark';
  disabled?: boolean;
  range?: boolean;
  vertical?: boolean;
  height?: string;
  size?: ComponentSize;
  showStops?: boolean;
  showInput?: boolean;
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string | number;
  formatValueText?: (value: number) => string;
  marks?: Record<number, string | { label: ReactNode; style?: CSSProperties }>;
  'aria-label'?: string;
  rangeStartLabel?: string;
  rangeEndLabel?: string;
}

/** 单值与双端滑块使用原生范围输入，保留键盘、触摸和辅助技术操作。 */
export function Slider(props: SliderProps) {
  const { min = 0, max = 100, step = 1, range = false, marks = {}, vertical = false } = props;
  const ns = useNamespace('slider');
  const disabled =
    useDisabled(props.disabled) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min;
  const size = useSize(props.size);
  const [raw, setValue] = useControllable(
    props.value,
    props.defaultValue ?? (range ? [min, max] : min),
    props.onValueChange,
  );
  const pending = useRef<SliderValue | null>(null);
  const markValues = Object.keys(marks)
    .map(Number)
    .filter((n) => n >= min && n <= max)
    .sort((a, b) => a - b);
  /** 将输入约束在有效区间，并按步长或标记吸附。 */
  function normalize(value: number): number {
    const finite = Number.isFinite(value) ? value : min;
    const clamped = Math.max(min, Math.min(max, finite));
    if (step === 'mark')
      return markValues.reduce(
        (a, b) => (Math.abs(b - clamped) < Math.abs(a - clamped) ? b : a),
        markValues[0] ?? min,
      );
    const unit = step > 0 && Number.isFinite(step) ? step : 1;
    return Math.max(
      min,
      Math.min(max, Number((min + Math.round((clamped - min) / unit) * unit).toFixed(10))),
    );
  }
  const values = range
    ? (Array.isArray(raw) ? [...raw].sort((a, b) => a - b) : [min, max]).map(normalize)
    : [normalize(Array.isArray(raw) ? raw[0] : raw)];
  /** 实时回传值，双端滑块不能越过另一端。 */
  function update(index: number, value: number): void {
    if (disabled) return;
    const next = normalize(value);
    const output: SliderValue = range
      ? index === 0
        ? [Math.min(next, values[1]), values[1]]
        : [values[0], Math.max(next, values[0])]
      : next;
    pending.current = output;
    setValue(output);
    props.onInput?.(output);
  }
  /** 一次拖动或键盘操作结束时提交，单纯聚焦不触发 change。 */
  function commit(): void {
    if (pending.current === null) return;
    props.onChange?.(pending.current);
    pending.current = null;
  }
  /** 计算主题轨道上的百分比位置。 */
  function percent(value: number): number {
    return max > min ? ((value - min) / (max - min)) * 100 : 0;
  }
  const start = range ? percent(values[0]) : 0;
  const end = percent(values[range ? 1 : 0]);
  const stops =
    props.showStops && typeof step === 'number' && step > 0
      ? Array.from(
          { length: Math.min(1000, Math.max(0, Math.ceil((max - min) / step) - 1)) },
          (_, i) => min + (i + 1) * step,
        )
      : [];
  return (
    <div
      id={props.id}
      className={cx(
        ns.b,
        ns.m(size),
        ns.is('vertical', vertical),
        ns.is('disabled', disabled),
        props.className,
      )}
      style={props.style}
    >
      <div
        className={cx(ns.e('runway'), ns.is('disabled', disabled), props.showInput && ns.is('show-input'))}
        style={vertical ? { height: props.height ?? '200px' } : undefined}
      >
        <div
          className={ns.e('bar')}
          style={
            vertical
              ? { bottom: `${start}%`, height: `${end - start}%` }
              : { left: `${start}%`, width: `${end - start}%` }
          }
        />
        {[...new Set([...stops, ...markValues])].map((value) => (
          <div
            key={value}
            className={ns.e('stop')}
            style={vertical ? { bottom: `${percent(value)}%` } : { left: `${percent(value)}%` }}
          />
        ))}
        {values.map((value, index) => (
          <div
            key={index}
            className={cx(ns.e('button-wrapper'), 'react-slider-thumb')}
            style={
              vertical
                ? {
                    bottom: `${percent(value)}%`,
                    top: 'auto',
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                  }
                : { left: `${percent(value)}%` }
            }
          >
            <div className={ns.e('button')} />
            {props.showTooltip !== false && (
              <span className="react-slider-tooltip">{props.formatTooltip?.(value) ?? value}</span>
            )}
          </div>
        ))}
        {values.map((value, index) => (
          <input
            key={index}
            className="react-slider-input"
            type="range"
            min={range && index === 1 ? values[0] : min}
            max={range && index === 0 ? values[1] : max}
            step={step === 'mark' ? 'any' : step > 0 ? step : 1}
            value={value}
            disabled={disabled}
            aria-label={
              range
                ? index === 0
                  ? (props.rangeStartLabel ?? 'Range start')
                  : (props.rangeEndLabel ?? 'Range end')
                : (props['aria-label'] ?? 'Slider')
            }
            aria-orientation={vertical ? 'vertical' : 'horizontal'}
            aria-valuetext={props.formatValueText?.(value)}
            style={vertical ? { writingMode: 'vertical-lr', direction: 'rtl' } : undefined}
            onChange={(event) => update(index, Number(event.target.value))}
            onKeyDown={(event) => {
              if (step !== 'mark' || disabled) return;
              const forward = ['ArrowRight', 'ArrowUp', 'PageUp'].includes(event.key);
              const backward = ['ArrowLeft', 'ArrowDown', 'PageDown'].includes(event.key);
              if (!forward && !backward && event.key !== 'Home' && event.key !== 'End') return;
              event.preventDefault();
              const target =
                event.key === 'Home'
                  ? markValues[0]
                  : event.key === 'End'
                    ? markValues.at(-1)
                    : forward
                      ? markValues.find((mark) => mark > value)
                      : [...markValues].reverse().find((mark) => mark < value);
              if (target !== undefined) update(index, target);
            }}
            onPointerUp={commit}
            onPointerCancel={commit}
            onKeyUp={commit}
            onBlur={commit}
          />
        ))}
        <div className={ns.e('marks')}>
          {markValues.map((value) => {
            const mark = marks[value];
            return (
              <div
                key={value}
                className={ns.e('marks-text')}
                style={{
                  ...(vertical ? { bottom: `${percent(value)}%` } : { left: `${percent(value)}%` }),
                  ...(typeof mark === 'object' ? mark.style : {}),
                }}
              >
                {typeof mark === 'object' ? mark.label : mark}
              </div>
            );
          })}
        </div>
      </div>
      {props.showInput && !range && step !== 'mark' && (
        <input
          className="react-slider-number"
          type="number"
          min={min}
          max={max}
          step={step}
          value={values[0]}
          disabled={disabled}
          aria-label="Slider value"
          onChange={(event) => update(0, Number(event.target.value))}
          onBlur={commit}
          onKeyUp={commit}
        />
      )}
    </div>
  );
}
