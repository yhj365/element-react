'use client';

import { useContext, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { Placement } from '@floating-ui/dom';
import { ConfigContext, cx, useControllable, useDisabled, useNamespace, useText } from '../../hooks';
import { useFloatingPosition } from '../../hooks/use-floating-position';
import { Input } from '../input';
import type { InputHandle, InputProps } from '../input';

export interface AutocompleteSuggestion {
  value?: string;
  [key: string]: unknown;
}
export type FetchSuggestions =
  | AutocompleteSuggestion[]
  | ((
      query: string,
      callback: (items: AutocompleteSuggestion[]) => void,
    ) => void | AutocompleteSuggestion[] | Promise<void | AutocompleteSuggestion[]>);
export interface AutocompleteHandle {
  focus: () => void;
  blur: () => void;
  close: () => void;
  highlight: (index: number) => void;
  handleSelect: (item: AutocompleteSuggestion) => void;
  handleKeyEnter: () => void;
  getData: (query: string) => void;
  readonly activated: boolean;
  readonly loading: boolean;
  readonly highlightedIndex: number;
  readonly suggestions: AutocompleteSuggestion[];
  readonly inputRef: InputHandle | null;
  readonly popperRef: HTMLDivElement | null;
}
export interface AutocompleteProps extends Omit<
  InputProps,
  'value' | 'defaultValue' | 'ref' | 'onSelect' | 'onKeyDown'
> {
  value?: string;
  defaultValue?: string;
  fetchSuggestions?: FetchSuggestions;
  valueKey?: string;
  debounce?: number;
  triggerOnFocus?: boolean;
  selectWhenUnmatched?: boolean;
  hideLoading?: boolean;
  highlightFirstItem?: boolean;
  loopNavigation?: boolean;
  fitInputWidth?: boolean;
  placement?: Placement;
  popperClass?: string;
  popperStyle?: CSSProperties;
  showArrow?: boolean;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  onSelect?: (item: AutocompleteSuggestion) => void;
  onFetchError?: (error: unknown) => void;
  renderSuggestion?: (item: AutocompleteSuggestion) => ReactNode;
  renderHeader?: ReactNode;
  renderFooter?: ReactNode;
  renderLoading?: ReactNode;
  ref?: Ref<AutocompleteHandle>;
}

/** 自动补全共享 Input 的输入、清空和表单语义；异步建议使用请求序号隔离旧响应。 */
export function Autocomplete({
  value,
  defaultValue = '',
  onValueChange,
  onInput,
  onSelect,
  onFetchError,
  fetchSuggestions = [],
  valueKey = 'value',
  debounce = 300,
  triggerOnFocus = true,
  selectWhenUnmatched = false,
  hideLoading = false,
  highlightFirstItem = false,
  loopNavigation = true,
  fitInputWidth = false,
  placement = 'bottom-start',
  popperClass,
  popperStyle,
  showArrow = true,
  teleported = true,
  appendTo,
  renderSuggestion,
  renderHeader,
  renderFooter,
  renderLoading,
  ref,
  ...inputProps
}: AutocompleteProps) {
  const ns = useNamespace('autocomplete');
  const disabled = useDisabled(inputProps.disabled);
  const config = useContext(ConfigContext);
  const text = useText();
  const id = useId();
  const input = useRef<InputHandle>(null);
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  const [popper, setPopper] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AutocompleteSuggestion[]>([]);
  const [highlighted, setHighlighted] = useState(-1);
  const sequence = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const alive = useRef(true);
  const suppressQuery = useRef<string | null>(null);
  const source = useRef(fetchSuggestions);
  source.current = fetchSuggestions;
  const visible = active && !disabled && (loading || items.length > 0);
  const floating = useFloatingPosition({
    reference: wrapper,
    floating: popper,
    arrow,
    active: visible,
    placement,
    offset: 8,
    revision: items.length,
  });

  /** 停止候选展示并使已经发出的请求失效。 */
  function close(): void {
    clearTimeout(timer.current);
    sequence.current++;
    setActive(false);
    setLoading(false);
    setHighlighted(-1);
  }
  /** 回调、数组与 Promise 数据源统一提交，较早请求及卸载后的响应被忽略。 */
  function getData(query: string): void {
    if (disabled) return;
    const request = ++sequence.current;
    setLoading(true);
    setItems([]);
    setHighlighted(-1);
    /** 仅接收一次有效响应，防止回调和返回值重复提交。 */
    let settled = false;
    function receive(data: AutocompleteSuggestion[]): void {
      if (settled || !alive.current || request !== sequence.current) return;
      settled = true;
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
      setHighlighted(highlightFirstItem && data.length > 0 ? 0 : -1);
    }
    /** 查询错误清除加载状态并交给调用方展示错误。 */
    function reject(error: unknown): void {
      if (!alive.current || request !== sequence.current || settled) return;
      settled = true;
      setItems([]);
      setLoading(false);
      onFetchError?.(error);
    }
    try {
      if (Array.isArray(source.current)) receive(source.current);
      else {
        const result = source.current(query, receive);
        if (Array.isArray(result)) receive(result);
        else if (result)
          void result.then((data) => {
            if (data) receive(data);
          }, reject);
      }
    } catch (error) {
      reject(error);
    }
  }
  useEffect(() => {
    alive.current = true;
    sequence.current++;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!active || disabled || suppressQuery.current === current) return;
    sequence.current++;
    setItems([]);
    setLoading(true);
    timer.current = setTimeout(() => getData(current), Math.max(0, debounce));
    return () => clearTimeout(timer.current);
    // 数据源通过ref读取，避免父组件内联函数导致重复查询。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, active, disabled, debounce]);
  useEffect(() => {
    if (!active) return;
    /** 点击输入和浮层以外区域时关闭建议。 */
    function outside(event: PointerEvent): void {
      if (event.target instanceof Node && !wrapper?.contains(event.target) && !popper?.contains(event.target))
        close();
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [active, wrapper, popper]);

  /** 选择回填文本，禁止该次值变化再次触发搜索。 */
  function select(item: AutocompleteSuggestion): void {
    if (disabled) return;
    const next = String(item[valueKey] ?? '');
    suppressQuery.current = next;
    setCurrent(next);
    onSelect?.(item);
    close();
  }
  /** Enter 优先选择高亮项，否则按配置提交自由文本。 */
  function enter(): void {
    if (highlighted >= 0 && items[highlighted]) select(items[highlighted]);
    else if (selectWhenUnmatched && current) select({ [valueKey]: current });
  }
  /** 高亮索引保持在候选边界内。 */
  function highlight(index: number): void {
    setHighlighted(index >= 0 && index < items.length ? index : -1);
  }
  useImperativeHandle(ref, () => ({
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
    close,
    highlight,
    handleSelect: select,
    handleKeyEnter: enter,
    getData,
    activated: active,
    loading,
    highlightedIndex: highlighted,
    suggestions: items,
    inputRef: input.current,
    popperRef: popper,
  }));
  const popup = visible ? (
    <div
      ref={setPopper}
      className={cx(`${ns.namespace}-popper`, 'is-light', ns.e('popper'), popperClass)}
      style={{
        ...floating.style,
        zIndex: config.zIndex ?? 2000,
        minWidth: wrapper?.offsetWidth,
        ...(fitInputWidth ? { width: wrapper?.offsetWidth } : {}),
        ...popperStyle,
      }}
      data-popper-placement={floating.placement}
    >
      {showArrow && (
        <div ref={setArrow} className={`${ns.namespace}-popper__arrow`} style={floating.arrowStyle} />
      )}
      <div className={cx(`${ns.b}-suggestion`, loading && 'is-loading')}>
        {renderHeader && <div className={`${ns.b}-suggestion__header`}>{renderHeader}</div>}
        <div className={`${ns.b}-suggestion__wrap`}>
          <ul id={`${id}-listbox`} className={`${ns.b}-suggestion__list`} role="listbox" aria-busy={loading}>
            {loading ? (
              <li role="presentation">{!hideLoading && (renderLoading ?? text.loading)}</li>
            ) : (
              items.map((item, index) => (
                <li
                  key={index}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={highlighted === index}
                  className={highlighted === index ? 'highlighted' : undefined}
                  onMouseEnter={() => highlight(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(item)}
                >
                  {renderSuggestion?.(item) ?? String(item[valueKey] ?? '')}
                </li>
              ))
            )}
          </ul>
        </div>
        {renderFooter && <div className={`${ns.b}-suggestion__footer`}>{renderFooter}</div>}
      </div>
    </div>
  ) : null;
  let target: Element | null = null;
  if (teleported && typeof document !== 'undefined')
    target =
      typeof appendTo === 'string'
        ? (document.querySelector(appendTo) ?? document.body)
        : (appendTo ?? document.body);
  return (
    <div ref={setWrapper} className={ns.b}>
      <Input
        {...inputProps}
        ref={input}
        value={current}
        disabled={disabled}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={visible ? `${id}-listbox` : undefined}
        aria-activedescendant={visible && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined}
        onValueChange={(next) => {
          suppressQuery.current = null;
          setCurrent(next);
          setActive(true);
        }}
        onInput={onInput}
        onFocus={(event) => {
          inputProps.onFocus?.(event);
          if (triggerOnFocus) {
            suppressQuery.current = null;
            setActive(true);
          }
        }}
        onBlur={(event) => {
          inputProps.onBlur?.(event);
          close();
        }}
        onClear={() => {
          close();
          inputProps.onClear?.();
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing || disabled) return;
          if (event.key === 'Escape' || event.key === 'Tab') {
            close();
            return;
          }
          if (event.key === 'Enter') {
            if (highlighted >= 0 || selectWhenUnmatched) {
              event.preventDefault();
              enter();
            }
            return;
          }
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          if (!active) {
            suppressQuery.current = null;
            setActive(true);
            return;
          }
          if (!items.length) return;
          const next = highlighted + (event.key === 'ArrowDown' ? 1 : -1);
          highlight(
            loopNavigation
              ? (next + items.length) % items.length
              : Math.max(0, Math.min(items.length - 1, next)),
          );
        }}
      />
      {target && popup ? createPortal(popup, target) : popup}
    </div>
  );
}
