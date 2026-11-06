'use client';
import {
  Children,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ConfigContext,
  FieldValidationContext,
  cx,
  useControllable,
  useDisabled,
  useNamespace,
  useSize,
} from '../../hooks';
import { useFloatingPosition } from '../../hooks/use-floating-position';
import { Scrollbar } from '../scrollbar';
import { Tag } from '../presentation';
import { Tooltip } from '../tooltip';
import type { TooltipProps } from '../tooltip';
import { Glyph, Icon } from '../icon';
import type { BaseProps, ComponentSize, SemanticType } from '../../hooks';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';
import type { Placement } from '@floating-ui/dom';

export type SelectValue = string | number | boolean | Record<string, unknown>;
export type SelectModel<T> = T | T[] | null | undefined;
export interface SelectOption<T = SelectValue> {
  value?: T;
  label?: string | number;
  disabled?: boolean;
  options?: SelectOption<T>[];
  [key: string]: unknown;
}
export interface OptionProps<T = SelectValue> extends BaseProps {
  value: T;
  label?: string | number;
  disabled?: boolean;
}
export interface OptionGroupProps extends BaseProps {
  label?: string;
  disabled?: boolean;
}
/** 声明式选项由Select收集并渲染，保留分组和自定义内容。 */
export function Option<T = SelectValue>(_props: OptionProps<T>) {
  return null;
}
/** 分组选项描述，不额外创建独立值模型。 */
export function OptionGroup(_props: OptionGroupProps) {
  return null;
}
export interface NormalizedOption<T> {
  value: T;
  label: string;
  disabled: boolean;
  content?: ReactNode;
  group?: string;
  raw?: SelectOption<T>;
}
export interface SelectOptionsScope<T> {
  id: string;
  query: string;
  options: NormalizedOption<T>[];
  keyOf: (value: T) => string;
  highlightedIndex: number;
  renderOption: (option: NormalizedOption<T>, index: number) => ReactNode;
  select: (value: T, label?: string) => void;
  update: (value: SelectModel<T>) => boolean;
  close: () => void;
}
export interface SelectHandle {
  focus: () => void;
  blur: () => void;
  readonly selectedLabel: string | string[];
}
export interface SelectProps<T extends SelectValue = SelectValue> extends BaseProps {
  value?: SelectModel<T>;
  defaultValue?: SelectModel<T>;
  onValueChange?: (value: SelectModel<T>) => void;
  onChange?: (value: SelectModel<T>) => void;
  multiple?: boolean;
  options?: SelectOption<T>[];
  props?: { value?: string; label?: string; disabled?: string; options?: string };
  disabled?: boolean;
  valueKey?: string;
  size?: ComponentSize;
  clearable?: boolean;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  tagTooltip?: Omit<TooltipProps, 'children' | 'renderContent' | 'ref'>;
  multipleLimit?: number;
  name?: string;
  effect?: 'light' | 'dark';
  autoComplete?: string;
  placeholder?: string;
  filterable?: boolean;
  allowCreate?: boolean;
  filterMethod?: (query: string) => void;
  remote?: boolean;
  debounce?: number;
  remoteMethod?: (query: string) => void | Promise<SelectOption<T>[]>;
  remoteShowSuffix?: boolean;
  loading?: boolean;
  loadingText?: string;
  noMatchText?: string;
  noDataText?: string;
  popperClass?: string;
  popperStyle?: CSSProperties;
  reserveKeyword?: boolean;
  defaultFirstOption?: boolean;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  automaticDropdown?: boolean;
  clearIcon?: ReactNode;
  fitInputWidth?: boolean;
  suffixIcon?: ReactNode;
  tagType?: SemanticType;
  tagEffect?: 'light' | 'dark' | 'plain';
  validateEvent?: boolean;
  offset?: number;
  showArrow?: boolean;
  placement?: Placement;
  fallbackPlacements?: Placement[];
  maxCollapseTags?: number;
  ariaLabel?: string;
  emptyValues?: unknown[];
  valueOnClear?: T | null | (() => T | null | undefined);
  suffixTransition?: boolean;
  tabIndex?: number;
  onVisibleChange?: (visible: boolean) => void;
  onRemoveTag?: (value: T) => void;
  onClear?: () => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPopupScroll?: (position: { scrollTop: number; scrollLeft: number }) => void;
  onEndReached?: (direction: 'top' | 'bottom' | 'left' | 'right') => void;
  renderHeader?: ReactNode;
  renderFooter?: ReactNode;
  renderPrefix?: ReactNode;
  renderEmpty?: ReactNode;
  renderLoading?: ReactNode;
  /** 树形与虚拟选项容器复用输入、标签及表单交互。 */
  renderOptions?: (scope: SelectOptionsScope<T>) => ReactNode;
  popupRole?: 'listbox' | 'tree';
  renderLabel?: (scope: { index: number; label: string; value: T }) => ReactNode;
  renderTag?: (scope: {
    data: NormalizedOption<T>[];
    selectDisabled: boolean;
    deleteTag: (event: React.MouseEvent, value: NormalizedOption<T>) => void;
  }) => ReactNode;
  ref?: Ref<SelectHandle>;
}

/** 同时解析声明式Option和OptionGroup，Fragment不改变顺序。 */
function collectOptions<T>(children: ReactNode, group?: string, disabled = false): NormalizedOption<T>[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment)
      return collectOptions<T>((child.props as { children?: ReactNode }).children, group, disabled);
    if (child.type === OptionGroup) {
      const props = (child as ReactElement<OptionGroupProps>).props;
      return collectOptions<T>(props.children, props.label, disabled || Boolean(props.disabled));
    }
    if (child.type === Option) {
      const props = (child as ReactElement<OptionProps<T>>).props;
      return [
        {
          value: props.value,
          label: String(props.label ?? props.value),
          disabled: disabled || Boolean(props.disabled),
          content: props.children,
          group,
        },
      ];
    }
    return [];
  });
}

/** 单选/多选共用键盘游走、过滤、缓存回显和异步查询顺序控制。 */
export function Select<T extends SelectValue = SelectValue>(props: SelectProps<T>) {
  const {
    value,
    defaultValue,
    onValueChange,
    onChange,
    multiple = false,
    options = [],
    props: aliases,
    disabled,
    valueKey = 'value',
    size,
    clearable = false,
    collapseTags = false,
    collapseTagsTooltip = false,
    tagTooltip,
    multipleLimit = 0,
    name,
    effect = 'light',
    autoComplete = 'off',
    placeholder,
    filterable = false,
    allowCreate = false,
    filterMethod,
    remote = false,
    debounce = 300,
    remoteMethod,
    remoteShowSuffix = false,
    loading = false,
    loadingText,
    noMatchText,
    noDataText,
    popperClass,
    popperStyle,
    reserveKeyword = true,
    defaultFirstOption = false,
    teleported = true,
    appendTo = 'body',
    persistent = true,
    automaticDropdown = false,
    clearIcon,
    fitInputWidth = false,
    suffixIcon,
    tagType = 'info',
    tagEffect = 'light',
    validateEvent = true,
    offset = 12,
    showArrow = true,
    placement = 'bottom-start',
    fallbackPlacements = ['bottom-start', 'top-start', 'right', 'left'],
    maxCollapseTags = 1,
    ariaLabel,
    emptyValues = [undefined, null, ''],
    valueOnClear,
    suffixTransition = true,
    tabIndex,
    onVisibleChange,
    onRemoveTag,
    onClear,
    onBlur,
    onFocus,
    onPopupScroll,
    onEndReached,
    renderHeader,
    renderFooter,
    renderPrefix,
    renderEmpty,
    renderLoading,
    renderOptions,
    popupRole = 'listbox',
    renderLabel,
    renderTag,
    ref,
    children,
    className,
    style,
    id,
    ...rest
  } = props;
  const ns = useNamespace('select');
  const config = useContext(ConfigContext);
  const form = useContext(FieldValidationContext);
  const actualSize = useSize(size);
  const blocked = useDisabled(disabled);
  const [current, setCurrent] = useControllable<SelectModel<T>>(
    value,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(-1);
  const [customFocus, setCustomFocus] = useState<{ edge: 'first' | 'last'; version: number } | null>(null);
  const [reference, setReference] = useState<HTMLDivElement | null>(null);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [remoteOptions, setRemoteOptions] = useState<SelectOption<T>[] | undefined>();
  const [fetching, setFetching] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const uid = useId();
  const cache = useRef(new Map<string, NormalizedOption<T>>());
  const objectIds = useRef(new WeakMap<object, number>());
  const nextObjectId = useRef(0);
  const request = useRef(0);
  const callbacks = useRef({ remoteMethod, filterMethod });
  callbacks.current = { remoteMethod, filterMethod };
  /** 对象值优先使用valueKey，缺少键时保留对象身份。 */
  function keyOf(item: T): string {
    if (item && typeof item === 'object') {
      const key = valueKey
        .split('.')
        .reduce<unknown>(
          (source, part) =>
            source && typeof source === 'object' ? (source as Record<string, unknown>)[part] : undefined,
          item,
        );
      if (key !== undefined) return `object:${String(key)}`;
      if (!objectIds.current.has(item)) objectIds.current.set(item, ++nextObjectId.current);
      return `identity:${objectIds.current.get(item)}`;
    }
    return `${typeof item}:${String(item)}`;
  }
  /** options字段映射支持嵌套分组，0和false都是有效值。 */
  function normalize(data: SelectOption<T>[], group?: string, parentDisabled = false): NormalizedOption<T>[] {
    return data.flatMap((option) => {
      const label = option[aliases?.label ?? 'label'];
      const disabled = parentDisabled || Boolean(option[aliases?.disabled ?? 'disabled']);
      const children = option[aliases?.options ?? 'options'];
      if (Array.isArray(children))
        return normalize(children as SelectOption<T>[], String(label ?? ''), disabled);
      const value = option[aliases?.value ?? 'value'] as T;
      return [{ value, label: String(label ?? value), disabled, group, raw: option }];
    });
  }
  const all = [...normalize(remoteOptions ?? options), ...collectOptions<T>(children)];
  for (const item of all) cache.current.set(keyOf(item.value), item);
  const selectedValues: T[] = multiple
    ? Array.isArray(current)
      ? current
      : []
    : !emptyValues.includes(current) && current !== undefined && current !== null && !Array.isArray(current)
      ? [current as T]
      : [];
  const selected = selectedValues.map(
    (item) =>
      all.find((option) => keyOf(option.value) === keyOf(item)) ??
      cache.current.get(keyOf(item)) ?? { value: item, label: String(item), disabled: false },
  );
  let filtered = all.filter(
    (option) =>
      !query ||
      remote ||
      filterMethod ||
      option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  if (allowCreate && filterable && query && !all.some((option) => option.label === query))
    filtered = [{ value: query as T, label: query, disabled: false }, ...filtered];
  const firstEnabled = filtered.findIndex((option) => !option.disabled);
  const optionCount = filtered.length;
  useEffect(() => {
    setHost(
      typeof appendTo === 'string'
        ? (document.querySelector<HTMLElement>(appendTo) ?? document.body)
        : appendTo,
    );
  }, [appendTo]);
  const floating = useFloatingPosition({
    reference,
    floating: panel,
    arrow,
    active: open && !blocked,
    placement,
    offset,
    fallbackPlacements,
  });
  const previousOpen = useRef(open);
  useEffect(() => {
    if (previousOpen.current !== open) {
      previousOpen.current = open;
      onVisibleChange?.(open);
    }
  }, [open, onVisibleChange]);
  const previousQuery = useRef(query);
  useEffect(() => {
    if (previousQuery.current === query) return;
    previousQuery.current = query;
    const version = ++request.current;
    let cancelled = false;
    if (!filterable && !remote) return;
    const timer = setTimeout(
      () => {
        callbacks.current.filterMethod?.(query);
        if (remote && callbacks.current.remoteMethod) {
          setFetching(false);
          const result = callbacks.current.remoteMethod(query);
          if (result instanceof Promise) {
            setFetching(true);
            void result
              .then((data) => {
                if (!cancelled && version === request.current) setRemoteOptions(data);
              })
              .catch(() => {
                if (!cancelled && version === request.current) setRemoteOptions([]);
              })
              .finally(() => {
                if (!cancelled && version === request.current) setFetching(false);
              });
          }
        }
      },
      remote ? debounce : 0,
    );
    return () => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [query, remote, filterable, debounce]);
  useEffect(() => {
    if (defaultFirstOption && query) setHighlighted(firstEnabled);
    else setHighlighted((previous) => (previous >= optionCount ? -1 : previous));
  }, [firstEnabled, optionCount, defaultFirstOption, query]);
  useEffect(() => {
    if (open && highlighted >= 0) {
      const node = document.getElementById(`${uid}-option-${highlighted}`);
      if (typeof node?.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted, open, uid]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent): void => {
      const path = event.composedPath();
      if ((!reference || !path.includes(reference)) && (!panel || !path.includes(panel))) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open, reference, panel]);
  /** 值更新请求、来源change和表单校验按一次提交分发。 */
  function update(next: SelectModel<T>): void {
    setCurrent(next);
    onChange?.(next);
    if (validateEvent) form?.change(next);
  }
  /** 单选提交后关闭，多选保留面板并按reserveKeyword决定查询文本。 */
  function choose(option: NormalizedOption<T>): void {
    if (blocked || option.disabled) return;
    if (multiple) {
      const exists = selectedValues.some((value) => keyOf(value) === keyOf(option.value));
      if (!exists && multipleLimit > 0 && selectedValues.length >= multipleLimit) return;
      update(
        exists
          ? selectedValues.filter((value) => keyOf(value) !== keyOf(option.value))
          : [...selectedValues, option.value],
      );
      if (!reserveKeyword) setQuery('');
    } else {
      update(option.value);
      setOpen(false);
      setQuery('');
    }
    input.current?.focus();
  }
  function remove(value: T): void {
    if (blocked) return;
    const option = selected.find((item) => keyOf(item.value) === keyOf(value));
    if (option?.disabled) return;
    update(selectedValues.filter((item) => keyOf(item) !== keyOf(value)));
    onRemoveTag?.(value);
  }
  /** 清空不触发remove-tag，清空值不强制转换为空字符串。 */
  function clear(): void {
    if (blocked) return;
    const next = multiple
      ? []
      : typeof valueOnClear === 'function'
        ? (valueOnClear as () => T | null | undefined)()
        : Object.prototype.hasOwnProperty.call(props, 'valueOnClear')
          ? valueOnClear
          : undefined;
    update(next as SelectModel<T>);
    onClear?.();
    setQuery('');
  }
  /** 方向键跳过禁用项并循环，回车只提交有效高亮项。 */
  function keydown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (blocked || event.nativeEvent.isComposing) return;
    if (renderOptions && popupRole === 'tree' && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setCustomFocus((previous) => ({
        edge: event.key === 'ArrowUp' ? 'last' : 'first',
        version: (previous?.version ?? 0) + 1,
      }));
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      let index = highlighted < 0 && event.key === 'ArrowUp' ? 0 : highlighted;
      for (let i = 0; i < filtered.length; i++) {
        index = (index + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length;
        if (!filtered[index].disabled) {
          setHighlighted(index);
          break;
        }
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (!open) setOpen(true);
      else if (filtered[highlighted]) choose(filtered[highlighted]);
      else if (allowCreate && filterable && query && filtered[0]) choose(filtered[0]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab') setOpen(false);
    else if (event.key === 'Backspace' && multiple && !query && selectedValues.length)
      remove(selectedValues.at(-1)!);
  }
  useImperativeHandle(ref, () => ({
    focus: () => input.current?.focus(),
    blur: () => {
      input.current?.blur();
      setOpen(false);
    },
    get selectedLabel() {
      return multiple ? selected.map((item) => item.label) : (selected[0]?.label ?? '');
    },
  }));
  useEffect(() => {
    if (!open || !customFocus || floating.style.visibility === 'hidden') return;
    const items = Array.from(panel?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []).filter(
      (item) => {
        let parent: HTMLElement | null = item;
        while (parent && parent !== panel) {
          if (getComputedStyle(parent).display === 'none') return false;
          parent = parent.parentElement;
        }
        return true;
      },
    );
    (customFocus.edge === 'last' ? items[items.length - 1] : items[0])?.focus();
  }, [open, panel, customFocus, floating.style.visibility]);
  const shownTags = collapseTags ? selected.slice(0, maxCollapseTags) : selected;
  const busy = loading || fetching;
  const zh = config.locale === 'zh-cn';
  const renderOption = (option: NormalizedOption<T>, index: number) => (
    <li
      key={`${keyOf(option.value)}-${index}`}
      id={`${uid}-option-${index}`}
      role="option"
      aria-selected={selectedValues.some((value) => keyOf(value) === keyOf(option.value))}
      aria-disabled={option.disabled || blocked}
      className={cx(
        `${ns.namespace}-select-dropdown__item`,
        ns.is(
          'selected',
          selectedValues.some((value) => keyOf(value) === keyOf(option.value)),
        ),
        ns.is('disabled', option.disabled),
        ns.is('hovering', index === highlighted),
      )}
      onMouseEnter={() => {
        if (!option.disabled) setHighlighted(index);
      }}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => choose(option)}
    >
      {option.content ?? <span>{option.label}</span>}
    </li>
  );
  const popup =
    open || persistent ? (
      <div
        ref={setPanel}
        className={cx(`${ns.namespace}-popper`, `is-${effect}`, ns.e('popper'), popperClass)}
        data-popper-placement={floating.placement}
        style={{
          ...floating.style,
          display: open && !blocked ? undefined : 'none',
          minWidth: reference?.getBoundingClientRect().width,
          width: fitInputWidth ? reference?.getBoundingClientRect().width : undefined,
          zIndex: config.zIndex,
          ...popperStyle,
        }}
      >
        <div className={`${ns.namespace}-select-dropdown`}>
          {renderHeader !== undefined && (
            <div className={`${ns.namespace}-select-dropdown__header`}>{renderHeader}</div>
          )}
          {busy ? (
            (renderLoading ?? (
              <p className={`${ns.namespace}-select-dropdown__empty`}>
                {loadingText ?? (zh ? '加载中' : 'Loading')}
              </p>
            ))
          ) : renderOptions ? (
            renderOptions({
              id: `${uid}-listbox`,
              query,
              options: filtered,
              keyOf,
              highlightedIndex: highlighted,
              renderOption,
              select: (value, label) => {
                const option = all.find((item) => keyOf(item.value) === keyOf(value));
                choose(option ?? { value, label: label ?? String(value), disabled: false });
              },
              update: (value) => {
                if (
                  blocked ||
                  (multiple && Array.isArray(value) && multipleLimit > 0 && value.length > multipleLimit)
                )
                  return false;
                update(value);
                if (!multiple) {
                  setOpen(false);
                  setQuery('');
                }
                return true;
              },
              close: () => {
                input.current?.focus();
                setOpen(false);
              },
            })
          ) : filtered.length ? (
            <Scrollbar
              maxHeight={274}
              wrapClass={`${ns.namespace}-select-dropdown__wrap`}
              onScroll={onPopupScroll}
              onEndReached={onEndReached}
            >
              <ul
                role="listbox"
                id={`${uid}-listbox`}
                aria-multiselectable={multiple}
                className={`${ns.namespace}-select-dropdown__list`}
              >
                {filtered.flatMap((option, index) => [
                  option.group && filtered[index - 1]?.group !== option.group ? (
                    <li
                      role="presentation"
                      className={`${ns.namespace}-select-group__title`}
                      key={`group-${index}`}
                    >
                      {option.group}
                    </li>
                  ) : null,
                  renderOption(option, index),
                ])}
              </ul>
            </Scrollbar>
          ) : (
            (renderEmpty ?? (
              <p className={`${ns.namespace}-select-dropdown__empty`}>
                {query
                  ? (noMatchText ?? (zh ? '无匹配数据' : 'No matching data'))
                  : (noDataText ?? (zh ? '无数据' : 'No data'))}
              </p>
            ))
          )}
          {renderFooter !== undefined && (
            <div className={`${ns.namespace}-select-dropdown__footer`}>{renderFooter}</div>
          )}
        </div>
        {showArrow && (
          <span
            ref={setArrow}
            className={`${ns.namespace}-popper__arrow`}
            data-popper-arrow=""
            style={floating.arrowStyle}
          />
        )}
      </div>
    ) : null;
  return (
    <div {...rest} className={cx(ns.b, ns.m(actualSize), className)} style={style}>
      <div
        ref={setReference}
        className={cx(
          ns.e('wrapper'),
          ns.is('disabled', blocked),
          ns.is('focused', focused),
          ns.is('filterable', filterable),
        )}
        onClick={() => {
          if (!blocked) {
            setOpen((old) => (filterable && old ? old : !old));
            input.current?.focus();
          }
        }}
      >
        {renderPrefix !== undefined && <div className={ns.e('prefix')}>{renderPrefix}</div>}
        <div
          className={cx(
            ns.e('selection'),
            ns.is('near', multiple && selected.length > 0 && renderPrefix === undefined),
          )}
        >
          {multiple &&
            (renderTag ? (
              renderTag({
                data: selected,
                selectDisabled: blocked,
                deleteTag: (event, option) => {
                  event.stopPropagation();
                  remove(option.value);
                },
              })
            ) : (
              <>
                {shownTags.map((option, index) => (
                  <div key={keyOf(option.value)} className={ns.e('selected-item')}>
                    <Tag
                      type={tagType}
                      effect={tagEffect}
                      size={actualSize}
                      closable={!blocked && !option.disabled}
                      onClose={(event) => {
                        event.stopPropagation();
                        remove(option.value);
                      }}
                    >
                      <span className={ns.e('tags-text')}>
                        {renderLabel
                          ? renderLabel({ index, label: option.label, value: option.value })
                          : option.label}
                      </span>
                    </Tag>
                  </div>
                ))}
                {collapseTags && selected.length > maxCollapseTags && (
                  <Tooltip
                    {...tagTooltip}
                    disabled={!collapseTagsTooltip}
                    renderContent={selected.slice(maxCollapseTags).map((option) => (
                      <Tag key={keyOf(option.value)}>{option.label}</Tag>
                    ))}
                  >
                    <Tag type={tagType} effect={tagEffect}>
                      + {selected.length - maxCollapseTags}
                    </Tag>
                  </Tooltip>
                )}
              </>
            ))}
          <div className={ns.e('input-wrapper')}>
            <input
              ref={input}
              id={id}
              name={name}
              role="combobox"
              aria-label={ariaLabel}
              aria-expanded={open && !blocked}
              aria-controls={`${uid}-listbox`}
              aria-haspopup={popupRole}
              aria-autocomplete={filterable ? 'list' : 'none'}
              aria-activedescendant={
                popupRole === 'listbox' && open && highlighted >= 0
                  ? `${uid}-option-${highlighted}`
                  : undefined
              }
              aria-invalid={form?.invalid || undefined}
              aria-describedby={form?.invalid ? form.errorId : undefined}
              autoComplete={autoComplete}
              tabIndex={tabIndex}
              disabled={blocked}
              readOnly={!filterable}
              value={query}
              className={ns.e('input')}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={(event) => {
                setFocused(true);
                if (automaticDropdown && !blocked) setOpen(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                setFocused(false);
                onBlur?.(event);
                if (validateEvent) form?.blur();
              }}
              onKeyDown={keydown}
            />
          </div>
          {!query && (!multiple || !selected.length) && (
            <div
              className={cx(
                ns.e('selected-item'),
                ns.e('placeholder'),
                ns.is('transparent', selected.length === 0),
              )}
            >
              {!multiple && selected[0]
                ? renderLabel
                  ? renderLabel({ index: 0, label: selected[0].label, value: selected[0].value })
                  : selected[0].label
                : (placeholder ?? (zh ? '请选择' : 'Select'))}
            </div>
          )}
        </div>
        <div className={ns.e('suffix')}>
          {clearable && selected.length > 0 && !blocked && (
            <button
              type="button"
              aria-label={zh ? '清空选择' : 'Clear selection'}
              className={cx(ns.e('caret'), ns.e('icon'))}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}
            >
              {clearIcon ?? <Glyph name="close" />}
            </button>
          )}
          {(!remote || remoteShowSuffix || busy) && (
            <Icon
              className={cx(ns.e('caret'), ns.is('reverse', open && suffixTransition), busy && 'is-loading')}
            >
              {busy ? (
                <Glyph name="loading" />
              ) : (
                (suffixIcon ?? (
                  <svg viewBox="0 0 1024 1024" aria-hidden="true">
                    <path fill="currentColor" d="M192 340 512 652 832 340l45 46-365 356L147 386z" />
                  </svg>
                ))
              )}
            </Icon>
          )}
        </div>
      </div>
      {teleported && host ? createPortal(popup, host) : popup}
    </div>
  );
}
