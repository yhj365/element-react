'use client';
import { Fragment, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ConfigContext, FieldValidationContext, cx, useDisabled, useNamespace, useSize } from '../../hooks';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { FocusEvent, HTMLAttributes, ReactNode, Ref } from 'react';

export interface InputOtpHandle {
  readonly inputRefs: HTMLInputElement[];
  focus: (index?: number) => void;
  blur: () => void;
}
export interface InputOtpProps extends BaseProps {
  /** 受控值；数字只用于初始化，输入回调始终返回字符串以保留前导零。 */
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string) => void;
  /** 焦点离开整个输入组且本次聚焦期间的值有变化时触发。 */
  onChange?: (value: string) => void;
  /** 由用户输入补满时触发，初始化、外部赋值和长度变化不触发。 */
  onFinish?: (value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  length?: number;
  validator?: (char: string, index: number) => boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  type?: 'outlined' | 'filled' | 'underlined';
  size?: ComponentSize;
  mask?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  validateEvent?: boolean;
  ariaLabel?: string;
  separator?: ReactNode | ((index: number) => ReactNode);
  renderSeparator?: (scope: { index: number }) => ReactNode;
  ref?: Ref<InputOtpHandle>;
}

/** 生成固定格数的字符数组，删除中间字符时允许保留空位。 */
function characters(value: string | number | undefined, length: number): string[] {
  const text = String(value ?? '');
  return Array.from({ length }, (_, index) => text.charAt(index));
}

/** 逐格输入与自动填充使用相同校验和焦点规则，组内移动不发出blur/change。 */
export function InputOtp({
  value,
  defaultValue,
  onValueChange,
  onChange,
  onFinish,
  onFocus,
  onBlur,
  length = 6,
  validator,
  inputMode,
  type = 'outlined',
  size,
  mask = false,
  disabled,
  readOnly = false,
  validateEvent = true,
  ariaLabel,
  separator,
  renderSeparator,
  ref,
  className,
  style,
  id,
  ...rest
}: InputOtpProps) {
  const ns = useNamespace('input-otp');
  const config = useContext(ConfigContext);
  const field = useContext(FieldValidationContext);
  const actualSize = useSize(size);
  const blocked = useDisabled(disabled);
  const count = Math.max(1, Math.floor(length));
  const [localValue, setLocalValue] = useState(String(defaultValue ?? ''));
  const current = String(value ?? localValue);
  const [cells, setCells] = useState(() => characters(value ?? defaultValue, count));
  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const currentRef = useRef(current);
  currentRef.current = current;
  const initialFocus = useRef(current);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const selectionFrame = useRef<number | undefined>(undefined);
  const previous = useRef({ value, count });
  const callbacks = useRef({ onValueChange });
  callbacks.current = { onValueChange };
  useEffect(() => {
    const old = previous.current;
    previous.current = { value, count };
    if (old.value === value && old.count === count) return;
    const next = characters(value ?? currentRef.current, count);
    cellsRef.current = next;
    setCells(next);
    if (old.count !== count && next.join('') !== currentRef.current) {
      const truncated = next.join('');
      if (value === undefined) setLocalValue(truncated);
      callbacks.current.onValueChange?.(truncated);
    }
  }, [value, count]);
  useEffect(
    () => () => {
      if (selectionFrame.current !== undefined) cancelAnimationFrame(selectionFrame.current);
    },
    [],
  );
  /** 聚焦指定格并在下一帧选中文字，快速输入时只操作仍持有焦点的元素。 */
  function focus(index = 0): void {
    const target = inputs.current[Math.min(count - 1, Math.max(0, index))];
    if (!target || blocked) return;
    target.focus();
    if (selectionFrame.current !== undefined) cancelAnimationFrame(selectionFrame.current);
    selectionFrame.current = requestAnimationFrame(() => {
      if (!readOnly && document.activeElement === target) target.select();
    });
  }
  /** 只使本组中正在聚焦的格失焦。 */
  function blur(): void {
    inputs.current.find((input) => input === document.activeElement)?.blur();
  }
  useImperativeHandle(ref, () => ({
    get inputRefs() {
      return inputs.current.filter((input): input is HTMLInputElement => Boolean(input));
    },
    focus,
    blur,
  }));
  /** 每次输入先更新格子；相同的整值不重复发出完成事件。 */
  function commit(next: string[], finish = true): void {
    cellsRef.current = next;
    setCells(next);
    const text = next.join('').slice(0, count);
    if (text === currentRef.current) return;
    currentRef.current = text;
    if (value === undefined) setLocalValue(text);
    onValueChange?.(text);
    if (finish && text.length === count) onFinish?.(text);
    if (validateEvent) field?.change(text);
  }
  /** 多字符input覆盖粘贴及浏览器验证码自动填充，非法字符跳过且不消耗位置。 */
  function accept(text: string, index: number, target: HTMLInputElement): void {
    if (blocked || readOnly) {
      target.value = cellsRef.current[index] ?? '';
      return;
    }
    const next = [...cellsRef.current];
    const firstEmpty = next.findIndex((char, position) => !char && position <= index);
    const start = firstEmpty < 0 ? index : firstEmpty;
    if (text.length > 1) {
      let position = start;
      for (const char of text.split('')) {
        if (position >= count) break;
        if (validator && !validator(char, position)) continue;
        next[position++] = char;
      }
      target.value = next[index] ?? '';
      commit(next);
      focus(position);
    } else if (!validator || validator(text, start)) {
      next[start] = text;
      target.value = next[index] ?? '';
      commit(next);
      focus(start + 1);
    } else {
      target.value = next[index] ?? '';
      focus(start);
    }
  }
  return (
    <div
      {...rest}
      id={id}
      role="group"
      aria-label={ariaLabel ?? (config.locale === 'zh-cn' ? '一次性密码输入' : 'One-time password input')}
      className={cx(ns.b, ns.m(actualSize), ns.m(type), ns.is('disabled', blocked), className)}
      style={style}
    >
      {Array.from({ length: count }, (_, index) => (
        <Fragment key={index}>
          <label className={ns.e('input-field')}>
            <input
              ref={(element) => {
                inputs.current[index] = element;
              }}
              value={cells[index] ?? ''}
              className={ns.e('input')}
              type={mask ? 'password' : 'text'}
              disabled={blocked}
              readOnly={readOnly}
              inputMode={inputMode}
              autoComplete="one-time-code"
              aria-label={config.locale === 'zh-cn' ? `第 ${index + 1} 位` : `Digit ${index + 1}`}
              aria-invalid={field?.invalid || undefined}
              aria-describedby={field?.invalid ? field.errorId : undefined}
              onFocus={(event) => {
                if (inputs.current.includes(event.relatedTarget as HTMLInputElement)) return;
                initialFocus.current = currentRef.current;
                onFocus?.(event);
              }}
              onBlur={(event) => {
                if (inputs.current.includes(event.relatedTarget as HTMLInputElement)) return;
                onBlur?.(event);
                if (validateEvent) field?.blur();
                if (initialFocus.current !== currentRef.current) onChange?.(currentRef.current);
              }}
              onClick={() => focus(index)}
              onChange={(event) => accept(event.target.value, index, event.target)}
              onKeyDown={(event) => {
                if (blocked || event.nativeEvent.isComposing) return;
                if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
                  event.preventDefault();
                  focus(index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1));
                } else if (event.key === 'Backspace' || event.key === 'Delete') {
                  event.preventDefault();
                  if (readOnly) return;
                  const next = [...cellsRef.current];
                  next[index] = '';
                  commit(next);
                  focus(event.key === 'Backspace' ? index - 1 : index);
                }
              }}
            />
          </label>
          {index < count - 1
            ? renderSeparator
              ? renderSeparator({ index })
              : typeof separator === 'function'
                ? separator(index)
                : separator
            : null}
        </Fragment>
      ))}
    </div>
  );
}
