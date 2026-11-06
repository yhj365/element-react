'use client';

import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { useNamespace, useText } from '../../hooks';
import { Select } from '../select';
import type { NormalizedOption, SelectOption, SelectOptionsScope, SelectProps, SelectValue } from '../select';

export interface SelectV2Props<T extends SelectValue = SelectValue> extends Omit<
  SelectProps<T>,
  'renderOptions' | 'popupRole' | 'onEndReached'
> {
  height?: number;
  itemHeight?: number;
  estimatedOptionHeight?: number;
  scrollbarAlwaysOn?: boolean;
  renderOption?: (scope: { item: SelectOption<T>; index: number }) => ReactNode;
  onEndReached?: (direction: 'forward' | 'backward') => void;
}
interface OptionRow<T> {
  key: string;
  option?: NormalizedOption<T>;
  optionIndex: number;
  title?: string;
}
interface VirtualOptionsProps<T extends SelectValue> {
  scope: SelectOptionsScope<T>;
  props: SelectV2Props<T>;
}
interface MeasuredOptionProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
  'data-option-key'?: string;
}

/** 二分定位滚动偏移所在行，不随滚动扫描全部选项。 */
function rowAt(offsets: number[], position: number): number {
  let low = 0,
    high = Math.max(0, offsets.length - 2);
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (offsets[middle] <= position) low = middle;
    else high = middle - 1;
  }
  return low;
}

/** 固定高度与动态测量选项共用虚拟窗口，分组标题也占独立行。 */
function VirtualOptions<T extends SelectValue>({ scope, props }: VirtualOptionsProps<T>) {
  const { options: choices, keyOf } = scope;
  const ns = useNamespace('select-dropdown');
  const root = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const elements = useRef(new Map<string, HTMLElement>());
  const [measured, setMeasured] = useState(new Map<string, number>());
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = props.itemHeight && props.itemHeight > 0 ? props.itemHeight : 34;
  const dynamic = props.estimatedOptionHeight !== undefined && props.estimatedOptionHeight > 0;
  const estimate = dynamic ? props.estimatedOptionHeight! : itemHeight;
  const height = props.height && props.height > 0 ? props.height : 274;
  const rows = useMemo(
    () =>
      choices.flatMap((option, index): OptionRow<T>[] => {
        const key = keyOf(option.value),
          row = { key, option, optionIndex: index };
        return option.group && choices[index - 1]?.group !== option.group
          ? [{ key: `group:${key}`, title: option.group, optionIndex: -1 }, row]
          : [row];
      }),
    [choices, keyOf],
  );
  const offsets = useMemo(() => {
    const output = [0];
    rows.forEach((row) =>
      output.push(output.at(-1)! + (dynamic ? (measured.get(row.key) ?? estimate) : itemHeight)),
    );
    return output;
  }, [rows, dynamic, measured, estimate, itemHeight]);
  const total = offsets.at(-1) ?? 0,
    viewport = Math.min(height, total);
  const start = Math.max(0, rowAt(offsets, scrollTop) - 2),
    end = Math.min(rows.length, rowAt(offsets, scrollTop + viewport) + 3);
  /** 动态选项只在尺寸实际变化时更新测量值，避免ResizeObserver循环。 */
  function measure(key: string, size: number): void {
    if (!dynamic || !Number.isFinite(size) || size <= 0) return;
    setMeasured((previous) => {
      if (Math.abs((previous.get(key) ?? 0) - size) < 0.5) return previous;
      return new Map(previous).set(key, size);
    });
  }
  useEffect(() => {
    if (!dynamic || typeof ResizeObserver === 'undefined') return;
    const current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const key = entry.target.getAttribute('data-option-key');
        if (key) measure(key, entry.target.getBoundingClientRect().height);
      }
    });
    observer.current = current;
    elements.current.forEach((element) => current.observe(element));
    return () => {
      current.disconnect();
      observer.current = null;
    };
    // 回调仅依赖动态测量模式，measure通过setState函数读取最新尺寸缓存。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamic]);
  useEffect(() => {
    if (root.current) root.current.scrollTop = 0;
    setScrollTop(0);
  }, [scope.query]);
  useEffect(() => {
    const index = rows.findIndex((row) => row.optionIndex === scope.highlightedIndex);
    if (index < 0 || scope.highlightedIndex < 0) return;
    const top = offsets[index],
      bottom = offsets[index + 1];
    const next = top < scrollTop ? top : bottom > scrollTop + viewport ? bottom - viewport : scrollTop;
    if (next !== scrollTop) {
      if (root.current) root.current.scrollTop = next;
      setScrollTop(next);
    }
  }, [scope.highlightedIndex, rows, offsets, viewport, scrollTop]);
  return (
    <div
      ref={root}
      className={`${ns.namespace}-select-v2__virtual-list`}
      style={{
        height: viewport,
        overflowY: props.scrollbarAlwaysOn ? 'scroll' : 'auto',
        position: 'relative',
      }}
      onScroll={(event) => {
        const top = event.currentTarget.scrollTop;
        setScrollTop(top);
        props.onPopupScroll?.({ scrollTop: top, scrollLeft: event.currentTarget.scrollLeft });
        if (top + viewport >= total && total > 0) props.onEndReached?.('forward');
        if (top === 0) props.onEndReached?.('backward');
      }}
    >
      <ul
        id={scope.id}
        role="listbox"
        aria-multiselectable={props.multiple}
        className={ns.e('list')}
        style={{ position: 'relative', height: total, padding: 0, margin: 0 }}
      >
        {rows.slice(start, end).map((row, offset) => {
          const index = start + offset;
          const style: CSSProperties = {
            position: 'absolute',
            top: offsets[index],
            left: 0,
            right: 0,
            boxSizing: 'border-box',
            height: dynamic ? 'auto' : itemHeight,
            ...(dynamic ? { whiteSpace: 'normal' } : {}),
          };
          if (!row.option)
            return (
              <li
                key={row.key}
                role="presentation"
                className={`${ns.namespace}-select-group__title`}
                style={{ ...style, height: itemHeight }}
              >
                {row.title}
              </li>
            );
          const element = scope.renderOption(row.option, row.optionIndex);
          if (!isValidElement<HTMLAttributes<HTMLLIElement>>(element)) return null;
          const custom = props.renderOption?.({
            item: row.option.raw ?? {
              value: row.option.value,
              label: row.option.label,
              disabled: row.option.disabled,
            },
            index: row.optionIndex,
          });
          return cloneElement(
            element as ReactElement<MeasuredOptionProps>,
            {
              key: row.key,
              style,
              'aria-posinset': row.optionIndex + 1,
              'aria-setsize': scope.options.length,
              'data-option-key': row.key,
              ref: (node: HTMLLIElement | null) => {
                const previous = elements.current.get(row.key);
                if (previous) observer.current?.unobserve(previous);
                if (node) {
                  elements.current.set(row.key, node);
                  if (dynamic) {
                    measure(row.key, node.getBoundingClientRect().height);
                    observer.current?.observe(node);
                  }
                } else elements.current.delete(row.key);
              },
            },
            custom ?? element.props.children,
          );
        })}
      </ul>
    </div>
  );
}

/** 虚拟化选择器复用Select的受控值、过滤、远程搜索、标签和键盘选择。 */
export function SelectV2<T extends SelectValue = SelectValue>(props: SelectV2Props<T>) {
  const ns = useNamespace('select-dropdown');
  const text = useText();
  const {
    height: _height,
    itemHeight: _itemHeight,
    estimatedOptionHeight: _estimatedOptionHeight,
    scrollbarAlwaysOn: _scrollbarAlwaysOn,
    renderOption: _renderOption,
    onEndReached: _onEndReached,
    fitInputWidth = true,
    ...selectProps
  } = props;
  return (
    <Select
      {...selectProps}
      fitInputWidth={fitInputWidth}
      renderOptions={(scope) => {
        if (!scope.options.length)
          return (
            props.renderEmpty ?? (
              <p className={ns.e('empty')}>
                {scope.query ? (props.noMatchText ?? text.noMatch) : (props.noDataText ?? text.empty)}
              </p>
            )
          );
        return <VirtualOptions scope={scope} props={props} />;
      }}
    />
  );
}
