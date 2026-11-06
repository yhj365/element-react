'use client';
import { useImperativeHandle, useRef } from 'react';
import { cx, useControllable, useDisabled, useNamespace, useSize } from '../../hooks';
import { Input } from '../input';
import type { InputHandle } from '../input';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { Ref } from 'react';

export interface InputNumberProps extends BaseProps {
  value?: number | null;
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  stepStrictly?: boolean;
  precision?: number;
  controls?: boolean;
  controlsPosition?: '' | 'right';
  size?: ComponentSize;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  onValueChange?: (value: number | null) => void;
  onChange?: (value: number | null, oldValue: number | null) => void;
  ref?: Ref<Pick<InputHandle, 'focus' | 'blur'>>;
}
/** 数字变更统一经过边界、严格步长和精度约束。 */
export function InputNumber({
  value,
  defaultValue = null,
  min = -Infinity,
  max = Infinity,
  step = 1,
  stepStrictly = false,
  precision,
  controls = true,
  controlsPosition = '',
  size,
  disabled,
  readOnly,
  onValueChange,
  onChange,
  ref,
  className,
  ...rest
}: InputNumberProps) {
  const ns = useNamespace('input-number');
  const actualSize = useSize(size);
  const actualDisabled = useDisabled(disabled);
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const input = useRef<InputHandle>(null);
  useImperativeHandle(
    ref,
    () => ({ focus: () => input.current?.focus(), blur: () => input.current?.blur() }),
    [],
  );
  /** 空串表示空值，其余数值钳制后才发通知。 */
  function update(raw: number | string): void {
    let next: number | null = raw === '' ? null : Number(raw);
    if (next !== null) {
      if (!Number.isFinite(next)) return;
      if (stepStrictly && step > 0) next = Math.round(next / step) * step;
      if (precision !== undefined) next = Number(next.toFixed(Math.min(100, Math.max(0, precision))));
      next = Math.min(max, Math.max(min, next));
    }
    if (next !== current) {
      setCurrent(next);
      onChange?.(next, current);
    }
  }
  return (
    <div
      className={cx(
        ns.b,
        ns.m(actualSize),
        ns.is('disabled', actualDisabled),
        controlsPosition === 'right' && ns.is('controls-right'),
        !controls && ns.is('without-controls'),
        className,
      )}
    >
      {controls && (
        <span
          role="button"
          aria-label="Decrease"
          aria-disabled={actualDisabled || readOnly || (current !== null && current <= min)}
          className={cx(
            ns.e('decrease'),
            ns.is('disabled', actualDisabled || (current !== null && current <= min)),
          )}
          onClick={() => {
            if (!actualDisabled && !readOnly) update((current ?? 0) - step);
          }}
        >
          −
        </span>
      )}
      {controls && (
        <span
          role="button"
          aria-label="Increase"
          aria-disabled={actualDisabled || readOnly || (current !== null && current >= max)}
          className={cx(
            ns.e('increase'),
            ns.is('disabled', actualDisabled || (current !== null && current >= max)),
          )}
          onClick={() => {
            if (!actualDisabled && !readOnly) update((current ?? 0) + step);
          }}
        >
          +
        </span>
      )}
      <Input
        {...rest}
        ref={input}
        type="number"
        value={current ?? ''}
        size={actualSize}
        disabled={actualDisabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        onValueChange={update}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            if (!actualDisabled && !readOnly)
              update((current ?? 0) + (event.key === 'ArrowUp' ? step : -step));
          }
        }}
      />
    </div>
  );
}
