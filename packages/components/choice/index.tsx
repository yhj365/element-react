'use client';
import { createContext, useContext, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { cx, useControllable, useDisabled, useNamespace, useSize } from '../../hooks';
import { Icon, Glyph } from '../icon';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { CSSProperties, ReactNode, Ref } from 'react';

export type ChoiceValue = string | number | boolean;
interface CheckboxGroupValue {
  value: ChoiceValue[];
  update: (value: ChoiceValue[]) => void;
  disabled?: boolean;
  size?: ComponentSize;
  min?: number;
  max?: number;
}
const CheckboxGroupContext = createContext<CheckboxGroupValue | null>(null);
export interface CheckboxGroupProps extends BaseProps {
  value?: ChoiceValue[];
  defaultValue?: ChoiceValue[];
  onValueChange?: (value: ChoiceValue[]) => void;
  onChange?: (value: ChoiceValue[]) => void;
  disabled?: boolean;
  size?: ComponentSize;
  min?: number;
  max?: number;
  ariaLabel?: string;
}
/** 组值是不可变数组，最小/最大勾选数在每次更新前验证。 */
export function CheckboxGroup({
  value,
  defaultValue = [],
  onValueChange,
  onChange,
  disabled,
  size,
  min,
  max,
  ariaLabel,
  className,
  children,
  ...rest
}: CheckboxGroupProps) {
  const ns = useNamespace('checkbox-group');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const actualDisabled = useDisabled(disabled);
  const actualSize = useSize(size);
  /** 一次交互只发一次组change。 */
  function update(next: ChoiceValue[]): void {
    if (
      actualDisabled ||
      (min !== undefined && next.length < min) ||
      (max !== undefined && next.length > max)
    )
      return;
    setCurrent(next);
    onChange?.(next);
  }
  return (
    <CheckboxGroupContext
      value={{ value: current, update, disabled: actualDisabled, size: actualSize, min, max }}
    >
      <div {...rest} role="group" aria-label={ariaLabel} className={cx(ns.b, className)}>
        {children}
      </div>
    </CheckboxGroupContext>
  );
}
export interface CheckboxProps extends BaseProps {
  value?: ChoiceValue;
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  modelValue?: ChoiceValue;
  defaultValue?: ChoiceValue;
  onValueChange?: (value: ChoiceValue) => void;
  onChange?: (value: ChoiceValue) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: ComponentSize;
  border?: boolean;
  name?: string;
  trueValue?: ChoiceValue;
  falseValue?: ChoiceValue;
  id?: string;
}
/** 独立复选框与组内选项共用原生checkbox，半选通过DOM属性设置。 */
export function Checkbox(props: CheckboxProps) {
  return <CheckboxControl {...props} />;
}
/** 按钮样式复选项仍保留checkbox表单语义。 */
export function CheckboxButton(props: CheckboxProps) {
  return <CheckboxControl {...props} button />;
}
/** 复选框内核区分独立值和组成员值，不修改组数组。 */
function CheckboxControl({
  value,
  label,
  checked,
  defaultChecked = false,
  modelValue,
  defaultValue,
  onValueChange,
  onChange,
  disabled,
  indeterminate,
  size,
  border,
  name,
  trueValue = true,
  falseValue = false,
  button = false,
  className,
  children,
  id,
  ...rest
}: CheckboxProps & { button?: boolean }) {
  const group = useContext(CheckboxGroupContext);
  const ns = useNamespace(button ? 'checkbox-button' : 'checkbox');
  const formDisabled = useDisabled(disabled);
  const actualSize = useSize(size ?? group?.size);
  const [current, setCurrent] = useControllable(
    modelValue ?? checked,
    defaultValue ?? (defaultChecked ? trueValue : falseValue),
    onValueChange,
  );
  const option = value ?? (typeof label === 'string' || typeof label === 'number' ? label : '');
  const active = group ? group.value.includes(option) : current === trueValue;
  const blocked =
    formDisabled ||
    Boolean(group?.disabled) ||
    Boolean(
      group &&
      ((active && group.min !== undefined && group.value.length <= group.min) ||
        (!active && group.max !== undefined && group.value.length >= group.max)),
    );
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (input.current) input.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  /** 组更新和独立值更新分别使用各自的通知通道。 */
  function update(): void {
    if (blocked) return;
    if (group) {
      group.update(active ? group.value.filter((item) => item !== option) : [...group.value, option]);
    } else setCurrent(active ? falseValue : trueValue);
    onChange?.(active ? falseValue : trueValue);
  }
  return (
    <label
      {...rest}
      className={cx(
        ns.b,
        ns.m(actualSize),
        ns.is('checked', active),
        ns.is('disabled', blocked),
        ns.is('bordered', border),
        ns.is('indeterminate', indeterminate),
        className,
      )}
    >
      {button ? (
        <>
          <input
            id={id}
            ref={input}
            type="checkbox"
            className={ns.e('original')}
            checked={active}
            disabled={blocked}
            name={name}
            onChange={update}
          />
          <span className={ns.e('inner')}>{children ?? label}</span>
        </>
      ) : (
        <>
          <span
            className={cx(
              ns.e('input'),
              ns.is('checked', active),
              ns.is('disabled', blocked),
              ns.is('indeterminate', indeterminate),
            )}
          >
            <input
              id={id}
              ref={input}
              className={ns.e('original')}
              type="checkbox"
              checked={active}
              disabled={blocked}
              aria-checked={indeterminate ? 'mixed' : active}
              name={name}
              onChange={update}
            />
            <span className={ns.e('inner')} />
          </span>
          {(children ?? label) !== undefined && <span className={ns.e('label')}>{children ?? label}</span>}
        </>
      )}
    </label>
  );
}

interface RadioContextValue {
  value: ChoiceValue | undefined;
  update: (value: ChoiceValue) => void;
  size?: ComponentSize;
  disabled?: boolean;
  name: string;
}
const RadioContext = createContext<RadioContextValue | null>(null);
export interface RadioGroupProps extends BaseProps {
  value?: ChoiceValue;
  defaultValue?: ChoiceValue;
  onValueChange?: (value: ChoiceValue) => void;
  onChange?: (value: ChoiceValue) => void;
  disabled?: boolean;
  size?: ComponentSize;
  name?: string;
  ariaLabel?: string;
}
/** 原生同名radio负责键盘游走，选中值与表单序列化保持一致。 */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  onChange,
  disabled,
  size,
  name,
  ariaLabel,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const ns = useNamespace('radio-group');
  const generated = useId();
  const [current, setCurrent] = useControllable<ChoiceValue | undefined>(value, defaultValue, (next) => {
    if (next !== undefined) onValueChange?.(next);
  });
  const actualDisabled = useDisabled(disabled);
  const actualSize = useSize(size);
  return (
    <RadioContext
      value={{
        value: current,
        update: (next) => {
          setCurrent(next);
          onChange?.(next);
        },
        disabled: actualDisabled,
        size: actualSize,
        name: name ?? generated,
      }}
    >
      <div {...rest} role="radiogroup" aria-label={ariaLabel} className={cx(ns.b, className)}>
        {children}
      </div>
    </RadioContext>
  );
}
export interface RadioProps extends BaseProps {
  value?: ChoiceValue;
  label?: ReactNode;
  modelValue?: ChoiceValue;
  defaultValue?: ChoiceValue;
  onValueChange?: (value: ChoiceValue) => void;
  onChange?: (value: ChoiceValue) => void;
  disabled?: boolean;
  size?: ComponentSize;
  border?: boolean;
  name?: string;
}
/** 普通单选项。 */
export function Radio(props: RadioProps) {
  return <RadioControl {...props} />;
}
/** 按钮单选项，值模型与Radio共用。 */
export function RadioButton(props: RadioProps) {
  return <RadioControl {...props} button />;
}
/** 单选内核保留label作为旧value别名的兼容路径。 */
function RadioControl({
  value,
  label,
  modelValue,
  defaultValue,
  onValueChange,
  onChange,
  disabled,
  size,
  border,
  name,
  button = false,
  className,
  children,
  ...rest
}: RadioProps & { button?: boolean }) {
  const group = useContext(RadioContext);
  const ns = useNamespace(button ? 'radio-button' : 'radio');
  const actualDisabled = useDisabled(disabled) || Boolean(group?.disabled);
  const actualSize = useSize(size ?? group?.size);
  const [current, setCurrent] = useControllable<ChoiceValue | undefined>(modelValue, defaultValue, (next) => {
    if (next !== undefined) onValueChange?.(next);
  });
  const option = value ?? (typeof label === 'string' || typeof label === 'number' ? label : '');
  const active = (group ? group.value : current) === option;
  const input = (
    <input
      type="radio"
      className={ns.e('original')}
      name={name ?? group?.name}
      value={String(option)}
      checked={active}
      disabled={actualDisabled}
      onChange={() => {
        if (!actualDisabled) {
          if (group) group.update(option);
          else setCurrent(option);
          onChange?.(option);
        }
      }}
    />
  );
  return (
    <label
      {...rest}
      className={cx(
        ns.b,
        ns.m(actualSize),
        ns.is('disabled', actualDisabled),
        ns.is('checked', active),
        ns.is('bordered', border),
        className,
      )}
    >
      {button ? (
        <>
          {input}
          <span className={ns.e('inner')}>{children ?? label}</span>
        </>
      ) : (
        <>
          <span className={cx(ns.e('input'), ns.is('checked', active), ns.is('disabled', actualDisabled))}>
            {input}
            <span className={ns.e('inner')} />
          </span>
          <span className={ns.e('label')}>{children ?? label}</span>
        </>
      )}
    </label>
  );
}

export interface SwitchProps extends BaseProps {
  value?: ChoiceValue;
  defaultValue?: ChoiceValue;
  onValueChange?: (value: ChoiceValue) => void;
  onChange?: (value: ChoiceValue) => void;
  activeValue?: ChoiceValue;
  inactiveValue?: ChoiceValue;
  activeText?: string;
  inactiveText?: string;
  inlinePrompt?: boolean;
  activeIcon?: ReactNode;
  inactiveIcon?: ReactNode;
  activeActionIcon?: ReactNode;
  inactiveActionIcon?: ReactNode;
  renderActive?: ReactNode;
  renderInactive?: ReactNode;
  renderActiveAction?: ReactNode;
  renderInactiveAction?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  width?: string | number;
  beforeChange?: () => boolean | Promise<boolean>;
  name?: string;
  ariaLabel?: string;
  ref?: Ref<{ focus: () => void; readonly checked: boolean }>;
}
/** 异步拦截期间阻止重入；拒绝或卸载后不会提交过期更新。 */
export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  onChange,
  activeValue = true,
  inactiveValue = false,
  activeText,
  inactiveText,
  inlinePrompt = false,
  activeIcon,
  inactiveIcon,
  activeActionIcon,
  inactiveActionIcon,
  renderActive,
  renderInactive,
  renderActiveAction,
  renderInactiveAction,
  loading = false,
  disabled,
  size,
  width,
  beforeChange,
  name,
  ariaLabel,
  ref,
  className,
  ...rest
}: SwitchProps) {
  const ns = useNamespace('switch');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const active = current === activeValue;
  const actualDisabled = useDisabled(disabled);
  const actualSize = useSize(size);
  const node = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);
  const pendingRef = useRef(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useImperativeHandle(ref, () => ({ focus: () => node.current?.focus(), checked: active }), [active]);
  /** 同步放行不延迟，异步放行后才发送值请求。 */
  async function toggle(): Promise<void> {
    if (actualDisabled || loading || pendingRef.current) return;
    const next = active ? inactiveValue : activeValue;
    pendingRef.current = true;
    try {
      const result = beforeChange?.() ?? true;
      if (result instanceof Promise) {
        setPending(true);
        if (!(await result) || !mounted.current) return;
      } else if (!result) return;
      if (mounted.current) {
        setCurrent(next);
        onChange?.(next);
      }
    } finally {
      pendingRef.current = false;
      if (mounted.current) setPending(false);
    }
  }
  const left = renderInactive ?? inactiveIcon ?? inactiveText;
  const right = renderActive ?? activeIcon ?? activeText;
  return (
    <div
      {...rest}
      className={cx(
        ns.b,
        ns.m(actualSize),
        ns.is('checked', active),
        ns.is('disabled', actualDisabled || loading || pending),
        className,
      )}
      onClick={() => {
        void toggle().catch(() => undefined);
      }}
    >
      <input
        ref={node}
        type="checkbox"
        role="switch"
        aria-label={ariaLabel}
        aria-checked={active}
        aria-disabled={actualDisabled || loading || pending}
        checked={active}
        disabled={actualDisabled || loading || pending}
        name={name}
        className={ns.e('input')}
        onClick={(event) => event.stopPropagation()}
        onChange={() => {
          void toggle().catch(() => undefined);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            void toggle().catch(() => undefined);
          }
        }}
      />
      {!inlinePrompt && left !== undefined && (
        <span className={cx(ns.e('label'), ns.e('label--left'), ns.is('active', !active))}>{left}</span>
      )}
      <span className={ns.e('core')} style={{ minWidth: width }}>
        <span className={ns.e('inner')}>
          {inlinePrompt && <span className={ns.e('inner-wrapper')}>{active ? right : left}</span>}
        </span>
        <span className={ns.e('action')}>
          {loading || pending ? (
            <Icon className="is-loading">
              <Glyph name="loading" />
            </Icon>
          ) : active ? (
            (renderActiveAction ?? activeActionIcon)
          ) : (
            (renderInactiveAction ?? inactiveActionIcon)
          )}
        </span>
      </span>
      {!inlinePrompt && right !== undefined && (
        <span className={cx(ns.e('label'), ns.e('label--right'), ns.is('active', active))}>{right}</span>
      )}
    </div>
  );
}

export interface SegmentedOption {
  label: ReactNode;
  value: string | number | boolean;
  disabled?: boolean;
}
export interface SegmentedProps extends BaseProps {
  value?: ChoiceValue;
  defaultValue?: ChoiceValue;
  options?: (ChoiceValue | SegmentedOption)[];
  size?: ComponentSize;
  disabled?: boolean;
  block?: boolean;
  direction?: 'horizontal' | 'vertical';
  name?: string;
  ariaLabel?: string;
  onValueChange?: (value: ChoiceValue) => void;
  onChange?: (value: ChoiceValue) => void;
  renderDefault?: (item: ChoiceValue | SegmentedOption) => ReactNode;
}
/** 分段选择器使用原生radio，空选项不渲染组件。 */
export function Segmented({
  value,
  defaultValue,
  options = [],
  size,
  disabled,
  block,
  direction = 'horizontal',
  name,
  ariaLabel = 'segmented',
  onValueChange,
  onChange,
  renderDefault,
  className,
  style,
  ...rest
}: SegmentedProps) {
  const ns = useNamespace('segmented');
  const actualSize = useSize(size);
  const actualDisabled = useDisabled(disabled);
  const generated = useId();
  const [current, setCurrent] = useControllable<ChoiceValue | undefined>(value, defaultValue, (next) => {
    if (next !== undefined) onValueChange?.(next);
  });
  if (!options.length) return null;
  return (
    <div
      {...rest}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(ns.b, ns.m(actualSize), ns.is('block', block), className)}
      style={style}
    >
      <div className={cx(ns.e('group'), ns.m(direction))}>
        {options.map((option, index) => {
          const item = typeof option === 'object' ? option : { label: String(option), value: option };
          const blocked = actualDisabled || item.disabled;
          return (
            <label
              key={index}
              className={cx(
                ns.e('item'),
                ns.is('selected', item.value === current),
                ns.is('disabled', blocked),
              )}
              style={
                item.value === current
                  ? ({
                      backgroundColor: 'var(--el-segmented-item-selected-bg-color)',
                      color: 'var(--el-segmented-item-selected-color)',
                      borderRadius: 'var(--el-border-radius-base)',
                    } as CSSProperties)
                  : undefined
              }
            >
              <input
                type="radio"
                className={ns.e('item-input')}
                name={name ?? generated}
                value={String(item.value)}
                disabled={blocked}
                checked={current === item.value}
                onChange={() => {
                  if (!blocked) {
                    setCurrent(item.value);
                    onChange?.(item.value);
                  }
                }}
              />
              <div className={ns.e('item-label')}>{renderDefault ? renderDefault(option) : item.label}</div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
