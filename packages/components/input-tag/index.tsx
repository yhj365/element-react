'use client';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FieldValidationContext, cx, useControllable, useDisabled, useNamespace, useSize } from '../../hooks';
import { Tag } from '../presentation';
import { Tooltip } from '../tooltip';
import { Glyph, Icon } from '../icon';
import type { ComponentSize, SemanticType } from '../../hooks';
import type { CSSProperties, FocusEvent, InputHTMLAttributes, ReactNode, Ref } from 'react';

export interface InputTagHandle {
  focus: () => void;
  blur: () => void;
}
export interface InputTagProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'onInput' | 'size' | 'prefix' | 'draggable'
> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[] | undefined) => void;
  onChange?: (value: string[] | undefined) => void;
  onInput?: (value: string) => void;
  onAddTag?: (value: string | string[]) => void;
  onRemoveTag?: (value: string, index: number) => void;
  onDragTag?: (oldIndex: number, newIndex: number, value: string) => void;
  onClear?: () => void;
  max?: number;
  tagType?: SemanticType;
  tagEffect?: 'light' | 'dark' | 'plain';
  effect?: 'light' | 'dark';
  trigger?: 'Enter' | 'Space';
  draggable?: boolean;
  delimiter?: string | RegExp;
  size?: ComponentSize;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  saveOnBlur?: boolean;
  clearable?: boolean;
  clearIcon?: ReactNode;
  validateEvent?: boolean;
  maxCollapseTags?: number;
  ariaLabel?: string;
  renderTag?: (scope: { value: string; index: number }) => ReactNode;
  renderPrefix?: ReactNode;
  renderSuffix?: ReactNode;
  ref?: Ref<InputTagHandle>;
}

/** 标签与输入草稿独立管理；组合输入、分隔符、失焦提交和拖动均通过统一模型更新。 */
export function InputTag({
  value,
  defaultValue,
  onValueChange,
  onChange,
  onInput,
  onAddTag,
  onRemoveTag,
  onDragTag,
  onClear,
  max,
  tagType = 'info',
  tagEffect = 'light',
  effect = 'light',
  trigger = 'Enter',
  draggable = false,
  delimiter = '',
  size,
  collapseTags = false,
  collapseTagsTooltip = false,
  saveOnBlur = true,
  clearable = false,
  clearIcon,
  disabled,
  validateEvent = true,
  readOnly = false,
  maxCollapseTags = 1,
  ariaLabel,
  renderTag,
  renderPrefix,
  renderSuffix,
  ref,
  className,
  style,
  placeholder,
  autoComplete = 'off',
  tabIndex = 0,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onPaste,
  onCompositionStart,
  onCompositionUpdate,
  onCompositionEnd,
  ...rest
}: InputTagProps) {
  const ns = useNamespace('input-tag'),
    field = useContext(FieldValidationContext),
    actualSize = useSize(size),
    blocked = useDisabled(disabled);
  const [current, setCurrent] = useControllable<string[] | undefined>(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState(''),
    [focused, setFocused] = useState(false),
    [hover, setHover] = useState(false);
  const [inputWidth, setInputWidth] = useState(11),
    [innerWidth, setInnerWidth] = useState(0),
    [collapseWidth, setCollapseWidth] = useState(0);
  const [indicator, setIndicator] = useState<CSSProperties | undefined>();
  const input = useRef<HTMLInputElement>(null),
    root = useRef<HTMLDivElement>(null),
    inner = useRef<HTMLDivElement>(null),
    calculator = useRef<HTMLSpanElement>(null),
    collapsed = useRef<HTMLDivElement>(null),
    tipContent = useRef<HTMLDivElement>(null);
  const composing = useRef(false),
    focusState = useRef(false),
    draftRef = useRef(draft);
  draftRef.current = draft;
  const drag = useRef<
    { index: number; node: HTMLElement; dropIndex?: number; type?: 'before' | 'after' } | undefined
  >(undefined);
  const tags = current ?? [],
    limit = collapseTags ? Math.max(0, maxCollapseTags) : tags.length,
    closable = !blocked && !readOnly,
    atLimit = max !== undefined && tags.length >= max;
  useEffect(() => {
    const measure = (): void => {
      setInputWidth(Math.max(11, (calculator.current?.getBoundingClientRect().width ?? 0) + 1));
      setInnerWidth(inner.current?.getBoundingClientRect().width ?? 0);
      setCollapseWidth(collapsed.current?.getBoundingClientRect().width ?? 0);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    for (const element of [calculator.current, inner.current, collapsed.current])
      if (element) observer?.observe(element);
    return () => observer?.disconnect();
  }, [draft, collapseTags, maxCollapseTags, tags.length]);
  useImperativeHandle(ref, () => ({
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
  }));
  /** 清空使用undefined，与来源模型清空事件保持一致。 */
  function update(next: string[] | undefined): void {
    setCurrent(next);
    onChange?.(next);
    if (validateEvent) field?.change(next);
  }
  /** 一次分隔输入按剩余额度裁剪，多项add-tag仍只发出一个数组。 */
  function add(value: string | string[]): void {
    if (!closable || atLimit) return;
    const values = (Array.isArray(value) ? value : [value]).slice(
      0,
      max === undefined ? undefined : Math.max(0, max - tags.length),
    );
    if (!values.length) return;
    update([...tags, ...values]);
    onAddTag?.(values.length === 1 ? values[0] : values);
    draftRef.current = '';
    setDraft('');
  }
  /** 只有真正匹配到分隔符时才拆分，空片段会被剔除。 */
  function split(text: string): string[] {
    if (!delimiter) return [];
    const parts = text.split(delimiter);
    return parts.length > 1 ? parts.map((part) => part.trim()).filter(Boolean) : [];
  }
  /** 单个提交移除首尾空白，但不改变已有标签内容。 */
  function commit(): void {
    const text = draftRef.current.trim();
    if (text) add(text);
  }
  /** 删除回调携带来源索引，不受折叠视图的局部索引影响。 */
  function remove(index: number): void {
    if (!closable || index < 0 || index >= tags.length) return;
    const next = [...tags];
    const [tag] = next.splice(index, 1);
    update(next);
    onRemoveTag?.(tag, index);
  }
  /** 组合输入期间仅更新草稿，合成结束才处理分隔符和input事件。 */
  function accept(text: string): void {
    if (!closable) return;
    if (atLimit) {
      draftRef.current = '';
      setDraft('');
      return;
    }
    draftRef.current = text;
    setDraft(text);
    if (composing.current) return;
    const separated = split(text);
    if (separated.length) add(separated);
    onInput?.(text);
  }
  /** 组内焦点移动和折叠提示层中的操作不重复发出blur。 */
  function leave(event: FocusEvent<HTMLInputElement>): void {
    if (
      root.current?.contains(event.relatedTarget as Node) ||
      tipContent.current?.contains(event.relatedTarget as Node)
    )
      return;
    focusState.current = false;
    setFocused(false);
    onBlur?.(event);
    if (saveOnBlur) commit();
    else {
      draftRef.current = '';
      setDraft('');
    }
    if (validateEvent) field?.blur();
  }
  /** 拖动结束提交一次顺序更新，并恢复焦点。 */
  function finishDrag(): void {
    const state = drag.current;
    drag.current = undefined;
    setIndicator(undefined);
    if (!state) return;
    state.node.style.opacity = '';
    if (state.type && state.dropIndex !== undefined && state.index !== state.dropIndex) {
      const next = [...tags];
      const [tag] = next.splice(state.index, 1);
      const step =
        state.dropIndex > state.index && state.type === 'before'
          ? -1
          : state.dropIndex < state.index && state.type === 'after'
            ? 1
            : 0;
      const destination = state.dropIndex + step;
      next.splice(destination, 0, tag);
      update(next);
      onDragTag?.(state.index, destination, tag);
    }
    input.current?.focus();
  }
  const tagStyle: CSSProperties =
    collapseTags && innerWidth
      ? {
          maxWidth: Math.max(
            0,
            innerWidth - (collapsed.current && maxCollapseTags === 1 ? collapseWidth + 6 : 0) - 17,
          ),
        }
      : {};
  /** 可见标签与提示层标签共享关闭和渲染规则。 */
  function tagNode(tag: string, index: number, allowDrag = false): ReactNode {
    return (
      <Tag
        key={index}
        size={actualSize === 'small' ? 'small' : 'default'}
        type={tagType}
        effect={tagEffect}
        closable={closable}
        style={tagStyle}
        onClose={() => remove(index)}
        draggable={closable && draggable && allowDrag}
        onDragStart={(event) => {
          if (!closable || !draggable) return;
          drag.current = { index, node: event.currentTarget };
          event.currentTarget.style.opacity = '.5';
          if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(event) => {
          const state = drag.current;
          if (!state || !inner.current) return;
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
          state.dropIndex = index;
          if (index === state.index) {
            state.type = undefined;
            setIndicator(undefined);
            return;
          }
          const bounds = event.currentTarget.getBoundingClientRect(),
            container = inner.current.getBoundingClientRect(),
            distance = event.clientX - bounds.left;
          const prev = state.index + 1 !== index,
            next = state.index - 1 !== index;
          state.type =
            distance <= bounds.width * (prev ? (next ? 0.5 : 1) : -1)
              ? 'before'
              : distance > bounds.width * (next ? (prev ? 0.5 : 0) : 1)
                ? 'after'
                : undefined;
          setIndicator(
            state.type
              ? {
                  top: bounds.top - container.top,
                  left:
                    state.type === 'before'
                      ? Math.max(bounds.left - container.left - 3, -2)
                      : bounds.right - container.left + 3,
                }
              : undefined,
          );
        }}
        onDragEnd={(event) => {
          event.preventDefault();
          finishDrag();
        }}
        onDrop={(event) => event.stopPropagation()}
      >
        {renderTag ? renderTag({ value: tag, index }) : tag}
      </Tag>
    );
  }
  const showClear = clearable && closable && Boolean(tags.length || draft) && (focused || hover),
    showSuffix = renderSuffix !== undefined || showClear;
  return (
    <div
      ref={root}
      className={cx(
        ns.b,
        ns.e('wrapper'),
        ns.m(actualSize),
        ns.is('focused', focused),
        ns.is('hovering', hover),
        ns.is('disabled', blocked),
        className,
      )}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('button') && !blocked) input.current?.focus();
      }}
    >
      {renderPrefix !== undefined && <div className={ns.e('prefix')}>{renderPrefix}</div>}
      <div
        ref={inner}
        className={cx(
          ns.e('inner'),
          ns.is('draggable', draggable),
          ns.is('left-space', !tags.length && renderPrefix === undefined),
          ns.is('right-space', !tags.length && !showSuffix),
        )}
      >
        {tags.slice(0, limit).map((tag, index) => tagNode(tag, index, true))}
        {collapseTags && tags.length > limit && (
          <Tooltip
            disabled={!collapseTagsTooltip}
            effect={effect}
            placement="bottom"
            fallbackPlacements={['bottom', 'top', 'right', 'left']}
            renderContent={
              <div ref={tipContent} className={ns.e('input-tag-list')}>
                {tags.slice(limit).map((tag, index) => tagNode(tag, index + limit))}
              </div>
            }
          >
            <div ref={collapsed} className={ns.e('collapse-tag')}>
              <Tag size={actualSize === 'small' ? 'small' : 'default'} type={tagType} effect={tagEffect}>
                + {tags.length - limit}
              </Tag>
            </div>
          </Tooltip>
        )}
        <div className={ns.e('input-wrapper')}>
          <input
            {...rest}
            ref={input}
            className={ns.e('input')}
            type="text"
            value={draft}
            disabled={blocked}
            readOnly={readOnly}
            autoComplete={autoComplete}
            tabIndex={tabIndex}
            placeholder={!tags.length ? placeholder : undefined}
            aria-label={ariaLabel ?? rest['aria-label']}
            aria-invalid={field?.invalid || undefined}
            aria-describedby={field?.invalid ? field.errorId : undefined}
            style={{ width: inputWidth }}
            onChange={(event) => accept(event.target.value)}
            onFocus={(event) => {
              if (focusState.current) return;
              focusState.current = true;
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={leave}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented || composing.current || event.nativeEvent.isComposing || !closable)
                return;
              const key = event.code || event.key;
              if (
                key === (trigger === 'Space' ? 'Space' : 'Enter') ||
                (trigger === 'Enter' && key === 'NumpadEnter')
              ) {
                event.preventDefault();
                event.stopPropagation();
                commit();
              } else if (event.key === 'Backspace' && !draft) {
                event.preventDefault();
                event.stopPropagation();
                remove(tags.length - 1);
              }
            }}
            onKeyUp={(event) => {
              onKeyUp?.(event);
              if (
                !event.defaultPrevented &&
                !composing.current &&
                closable &&
                trigger === 'Space' &&
                /Android/i.test(navigator.userAgent) &&
                (event.code === 'Space' || event.key === ' ')
              ) {
                event.preventDefault();
                event.stopPropagation();
                commit();
              }
            }}
            onPaste={(event) => {
              onPaste?.(event);
              if (event.defaultPrevented || !closable || atLimit || !delimiter) return;
              const pasted = event.clipboardData.getData('text');
              if (!pasted) return;
              const node = event.currentTarget,
                next =
                  node.value.slice(0, node.selectionStart ?? 0) +
                  pasted +
                  node.value.slice(node.selectionEnd ?? 0);
              const separated = split(next);
              if (separated.length) {
                event.preventDefault();
                add(separated);
                onInput?.(next);
              }
            }}
            onCompositionStart={(event) => {
              composing.current = true;
              onCompositionStart?.(event);
            }}
            onCompositionUpdate={onCompositionUpdate}
            onCompositionEnd={(event) => {
              composing.current = false;
              accept(event.currentTarget.value);
              onCompositionEnd?.(event);
            }}
          />
          <span ref={calculator} aria-hidden="true" className={ns.e('input-calculator')}>
            {draft}
          </span>
        </div>
        <div
          className={ns.e('drop-indicator')}
          style={{ ...indicator, display: indicator ? undefined : 'none' }}
        />
      </div>
      {showSuffix && (
        <div className={ns.e('suffix')}>
          {renderSuffix}
          {showClear && (
            <button
              type="button"
              className={cx(ns.e('icon'), ns.e('clear'))}
              aria-label="Clear tags"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                draftRef.current = '';
                setDraft('');
                update(undefined);
                onClear?.();
              }}
            >
              <Icon>{clearIcon ?? <Glyph name="close" />}</Icon>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
