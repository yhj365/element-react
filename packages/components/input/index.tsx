'use client';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  FieldValidationContext,
  cx,
  useControllable,
  useDisabled,
  useNamespace,
  useSize,
  useText,
} from '../../hooks';
import { Glyph, Icon } from '../icon';
import type {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from 'react';
import type { ComponentSize } from '../../hooks';

export interface InputHandle {
  readonly input: HTMLInputElement | null;
  readonly textarea: HTMLTextAreaElement | null;
  readonly ref: HTMLInputElement | HTMLTextAreaElement | null;
  focus: () => void;
  blur: () => void;
  select: () => void;
  clear: () => void;
  resizeTextarea: () => void;
}
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'onInput' | 'onFocus' | 'onBlur' | 'ref' | 'prefix'
> {
  value?: string | number | null;
  defaultValue?: string | number;
  size?: ComponentSize;
  onValueChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  clearable?: boolean;
  clearIcon?: ReactNode;
  showPassword?: boolean;
  showWordLimit?: boolean;
  wordLimitPosition?: 'inside' | 'outside';
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  renderPrefix?: ReactNode;
  renderSuffix?: ReactNode;
  renderPrepend?: ReactNode;
  renderAppend?: ReactNode;
  renderPasswordIcon?: (visible: boolean) => ReactNode;
  rows?: number;
  autosize?: boolean | { minRows?: number; maxRows?: number };
  resize?: CSSProperties['resize'];
  inputStyle?: CSSProperties;
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  ref?: Ref<InputHandle>;
  validateEvent?: boolean;
}

/** 输入更新与提交事件分离；组合输入期间保留候选文本。 */
export function Input({
  value,
  defaultValue = '',
  size,
  onValueChange,
  onInput,
  onChange,
  onClear,
  onFocus,
  onBlur,
  clearable,
  clearIcon,
  showPassword,
  showWordLimit,
  wordLimitPosition = 'inside',
  prefixIcon,
  suffixIcon,
  renderPrefix,
  renderSuffix,
  renderPrepend,
  renderAppend,
  renderPasswordIcon,
  rows = 2,
  autosize,
  resize,
  inputStyle,
  formatter,
  parser,
  ref,
  disabled,
  readOnly,
  maxLength,
  type = 'text',
  className,
  style,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  validateEvent = true,
  ...rest
}: InputProps) {
  const [current, setCurrent] = useControllable<string | number | null>(value, defaultValue, (next) =>
    onValueChange?.(String(next ?? '')),
  );
  const actualDisabled = useDisabled(disabled);
  const actualSize = useSize(size);
  const ns = useNamespace('input');
  const text = useText();
  const formField = useContext(FieldValidationContext);
  const element = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const composition = useRef(false);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const committed = useRef(String(current ?? ''));
  const raw = String(current ?? '');
  const display = composing ? draft : formatter ? formatter(raw) : raw;
  const textarea = type === 'textarea';
  /** 仅在值真正提交时发change，父级回写不自动发事件。 */
  function commit(next = raw): void {
    if (next !== committed.current) {
      committed.current = next;
      onChange?.(next);
    }
  }
  /** 更新值请求并通知逐字输入事件。 */
  function emit(next: string): void {
    const parsed = parser ? parser(next) : next;
    setCurrent(parsed);
    onInput?.(parsed);
    if (validateEvent) formField?.change(parsed);
  }
  /** 清空按来源顺序发送值更新、change、clear和input。 */
  function clear(): void {
    if (actualDisabled || readOnly) return;
    setCurrent('');
    committed.current = '';
    onChange?.('');
    onClear?.();
    onInput?.('');
    if (validateEvent) formField?.change('');
  }
  /** textarea测量只在浏览器挂载后执行。 */
  function resizeTextarea(): void {
    const node = element.current;
    if (!(node instanceof HTMLTextAreaElement) || !autosize) return;
    const config = typeof autosize === 'object' ? autosize : {};
    const computed = getComputedStyle(node);
    const line = parseFloat(computed.lineHeight) || 20;
    const padding = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
    node.style.height = 'auto';
    const height = Math.max((config.minRows ?? rows) * line + padding, node.scrollHeight);
    node.style.height = `${Math.min(height, (config.maxRows ?? Infinity) * line + padding)}px`;
  }
  useEffect(() => {
    const node = element.current;
    if (!(node instanceof HTMLTextAreaElement) || !autosize) return;
    const config = typeof autosize === 'object' ? autosize : {};
    const computed = getComputedStyle(node);
    const line = parseFloat(computed.lineHeight) || 20;
    const padding = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
    node.style.height = 'auto';
    node.style.height = `${Math.min(Math.max((config.minRows ?? rows) * line + padding, node.scrollHeight), (config.maxRows ?? Infinity) * line + padding)}px`;
  }, [display, autosize, rows]);
  useImperativeHandle(ref, () => ({
    get input() {
      return element.current instanceof HTMLInputElement ? element.current : null;
    },
    get textarea() {
      return element.current instanceof HTMLTextAreaElement ? element.current : null;
    },
    get ref() {
      return element.current;
    },
    focus: () => element.current?.focus(),
    blur: () => element.current?.blur(),
    select: () => element.current?.select(),
    clear,
    resizeTextarea,
  }));
  /** React的onChange对应原生input，而非来源的提交change。 */
  function handleInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const next = event.target.value;
    if (composition.current) {
      setDraft(next);
      return;
    }
    emit(next);
  }
  const common = {
    'aria-invalid': rest['aria-invalid'] ?? (formField?.invalid || undefined),
    'aria-describedby': rest['aria-describedby'] ?? (formField?.invalid ? formField.errorId : undefined),
    disabled: actualDisabled,
    readOnly,
    maxLength,
    value: display,
    onChange: handleInput,
    onFocus: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      committed.current = raw;
      setFocused(true);
      onFocus?.(event);
    },
    onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      commit();
      onBlur?.(event);
      if (validateEvent) formField?.blur();
    },
  };
  const count =
    showWordLimit && maxLength !== undefined && !readOnly && !actualDisabled ? (
      <span className={cx(ns.e('count'), wordLimitPosition === 'outside' && 'is-outside')}>
        <span className={ns.e('count-inner')}>
          {raw.length} / {maxLength}
        </span>
      </span>
    ) : null;
  const field = textarea ? (
    <textarea
      {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      {...common}
      ref={element as Ref<HTMLTextAreaElement>}
      rows={rows}
      className={`${ns.namespace}-textarea__inner`}
      style={{ resize, ...inputStyle }}
      onCompositionStart={() => {
        composition.current = true;
        setComposing(true);
        setDraft(raw);
      }}
      onCompositionEnd={(event) => {
        composition.current = false;
        setComposing(false);
        emit(event.currentTarget.value);
      }}
    />
  ) : (
    <input
      {...rest}
      {...common}
      ref={element as Ref<HTMLInputElement>}
      type={showPassword ? (visible ? 'text' : 'password') : type}
      className={ns.e('inner')}
      style={inputStyle}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !composition.current) commit();
        onKeyDown?.(event);
      }}
      onCompositionStart={(event) => {
        composition.current = true;
        setComposing(true);
        setDraft(raw);
        onCompositionStart?.(event);
      }}
      onCompositionEnd={(event) => {
        composition.current = false;
        setComposing(false);
        emit(event.currentTarget.value);
        onCompositionEnd?.(event);
      }}
    />
  );
  return (
    <div
      className={cx(
        textarea ? `${ns.namespace}-textarea` : ns.b,
        ns.m(actualSize),
        ns.is('disabled', actualDisabled),
        renderPrepend !== undefined && `${ns.b}-group ${ns.b}-group--prepend`,
        renderAppend !== undefined && `${ns.b}-group ${ns.b}-group--append`,
        className,
      )}
      style={style}
    >
      {renderPrepend !== undefined && <div className={`${ns.b}-group__prepend`}>{renderPrepend}</div>}
      {textarea ? (
        <>
          {field}
          {count}
        </>
      ) : (
        <div className={cx(ns.e('wrapper'), ns.is('focus', focused))}>
          {(renderPrefix !== undefined || prefixIcon !== undefined) && (
            <span className={ns.e('prefix')}>
              <span className={ns.e('prefix-inner')}>
                {renderPrefix}
                {prefixIcon !== undefined && <Icon className={ns.e('icon')}>{prefixIcon}</Icon>}
              </span>
            </span>
          )}
          {field}
          <span className={ns.e('suffix')}>
            <span className={ns.e('suffix-inner')}>
              {clearable && !actualDisabled && !readOnly && raw !== '' && (
                <button
                  type="button"
                  className={cx(ns.e('icon'), ns.e('clear'))}
                  aria-label={text.clear}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={clear}
                >
                  {clearIcon ?? <Glyph name="close" />}
                </button>
              )}
              {renderSuffix}
              {suffixIcon !== undefined && <Icon className={ns.e('icon')}>{suffixIcon}</Icon>}
              {showPassword && raw !== '' && !actualDisabled && (
                <button
                  type="button"
                  className={cx(ns.e('icon'), ns.e('password'))}
                  aria-label={visible ? text.hidePassword : text.showPassword}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setVisible(!visible)}
                >
                  {renderPasswordIcon?.(visible) ?? <Glyph name="eye" />}
                </button>
              )}
              {count}
            </span>
          </span>
        </div>
      )}
      {renderAppend !== undefined && <div className={`${ns.b}-group__append`}>{renderAppend}</div>}
    </div>
  );
}
