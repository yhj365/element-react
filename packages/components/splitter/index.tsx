'use client';

import { Children, Fragment, isValidElement, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';
import { cx, useNamespace } from '../../hooks';
import type { BaseProps } from '../../hooks';

export type PanelSize = string | number;
export interface SplitterPanelHandle {
  readonly splitterPanelRef: HTMLDivElement | null;
}
export interface SplitterPanelProps extends BaseProps {
  size?: PanelSize;
  defaultSize?: PanelSize;
  min?: PanelSize;
  max?: PanelSize;
  resizable?: boolean;
  collapsible?: boolean;
  onSizeChange?: (size: number) => void;
  renderStartCollapsible?: ReactNode;
  renderEndCollapsible?: ReactNode;
  ref?: Ref<SplitterPanelHandle>;
}
export interface SplitterProps extends BaseProps {
  layout?: 'horizontal' | 'vertical';
  lazy?: boolean;
  onResizeStart?: (index: number, sizes: number[]) => void;
  onResize?: (index: number, sizes: number[]) => void;
  onResizeEnd?: (index: number, sizes: number[]) => void;
  onCollapse?: (index: number, type: 'start' | 'end', sizes: number[]) => void;
}

/** 独立面板保留内容及真实 DOM 实例，尺寸由父级统一分配。 */
export function SplitterPanel({ children, className, style, id, ref }: SplitterPanelProps) {
  const element = useRef<HTMLDivElement>(null);
  const ns = useNamespace('splitter-panel');
  useImperativeHandle(ref, () => ({
    get splitterPanelRef() {
      return element.current;
    },
  }));
  return (
    <div ref={element} id={id} className={cx(ns.b, className)} style={style}>
      {children}
    </div>
  );
}

/** 将 Fragment 中的面板展平，忽略条件渲染的空节点。 */
function panelsFrom(children: ReactNode): ReactElement<SplitterPanelProps>[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<SplitterPanelProps>(child)) return [];
    if (child.type === Fragment) return panelsFrom(child.props.children);
    return child.type === SplitterPanel ? [child] : [];
  });
}

/** 像素和百分比共用明确的容器尺寸；非法尺寸回退默认约束。 */
function pixels(value: PanelSize | undefined, total: number, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(
    0,
    typeof value === 'string' && value.trim().endsWith('%') ? (parsed * total) / 100 : parsed,
  );
}

/** 相邻面板调整保持总尺寸，拖动与键盘共享 min/max、禁用和惰性提交逻辑。 */
export function Splitter({
  children,
  layout = 'horizontal',
  lazy = false,
  onResizeStart,
  onResize,
  onResizeEnd,
  onCollapse,
  ...base
}: SplitterProps) {
  const ns = useNamespace('splitter');
  const barNs = useNamespace('splitter-bar');
  const element = useRef<HTMLDivElement>(null);
  const panels = panelsFrom(children);
  const [total, setTotal] = useState(0);
  const [internal, setInternal] = useState<Record<number, number>>({});
  const [moving, setMoving] = useState<number | null>(null);
  const [lazyOffset, setLazyOffset] = useState(0);
  const stop = useRef<(() => void) | null>(null);
  const restored = useRef(new Map<number, number[]>());
  useEffect(() => {
    /** 容器变化后重新解释百分比和自动分配尺寸。 */
    function measure(): void {
      const rect = element.current?.getBoundingClientRect();
      setTotal(rect ? (layout === 'horizontal' ? rect.width : rect.height) : 0);
    }
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (element.current) observer?.observe(element.current);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      stop.current?.();
    };
  }, [layout]);
  const explicit = panels.map((panel, index) =>
    pixels(panel.props.size ?? internal[index] ?? panel.props.defaultSize, total, -1),
  );
  const spare = Math.max(0, total - explicit.reduce((sum, size) => sum + Math.max(0, size), 0));
  const automatic = explicit.filter((size) => size < 0).length;
  const sizes = explicit.map((size) => (size < 0 ? spare / Math.max(1, automatic) : size));

  /** 尺寸变更通知仅发送给变化的面板，受控面板等待父级回写。 */
  function publish(next: number[]): void {
    setInternal((previous) => {
      const result = { ...previous };
      panels.forEach((panel, index) => {
        if (panel.props.size === undefined) result[index] = next[index];
      });
      return result;
    });
    panels.forEach((panel, index) => {
      if (Math.abs(next[index] - sizes[index]) > 0.001) panel.props.onSizeChange?.(next[index]);
    });
  }
  /** 在两侧约束的交集内计算可移动距离，约束矛盾时保持现状。 */
  function adjusted(index: number, delta: number, initial: number[]): number[] {
    const left = panels[index].props,
      right = panels[index + 1].props;
    const low = Math.max(
      pixels(left.min, total, 0) - initial[index],
      initial[index + 1] - pixels(right.max, total, total),
    );
    const high = Math.min(
      pixels(left.max, total, total) - initial[index],
      initial[index + 1] - pixels(right.min, total, 0),
    );
    const offset = low <= high ? Math.max(low, Math.min(high, delta)) : 0;
    const next = [...initial];
    next[index] += offset;
    next[index + 1] -= offset;
    return next;
  }
  /** 折叠时保存相邻两侧尺寸，再次操作恢复；折叠明确允许突破 min。 */
  function collapse(index: number, type: 'start' | 'end'): void {
    const target = type === 'start' ? index : index + 1;
    let next = [...sizes];
    if (sizes[target] === 0 && restored.current.has(target)) next = restored.current.get(target)!;
    else {
      restored.current.set(target, [...sizes]);
      next[type === 'start' ? index + 1 : index] += sizes[target];
      next[target] = 0;
    }
    publish(next);
    onCollapse?.(index, type, next);
  }
  return (
    <div
      {...base}
      ref={element}
      className={cx(ns.b, ns.e(layout), base.className)}
      style={{ ...base.style, [`--${ns.namespace}-splitter-bar-offset`]: `${lazyOffset}px` } as CSSProperties}
    >
      {panels.map((panel, index) => {
        const nextPanel = panels[index + 1];
        const resizable = panel.props.resizable !== false && nextPanel?.props.resizable !== false;
        const basis = total > 0 ? sizes[index] : (panel.props.size ?? panel.props.defaultSize);
        return (
          <Fragment key={panel.key ?? index}>
            <SplitterPanel
              {...panel.props}
              style={{
                minWidth: 0,
                minHeight: 0,
                ...panel.props.style,
                flex:
                  basis === undefined ? '1 1 0' : `0 0 ${typeof basis === 'number' ? `${basis}px` : basis}`,
              }}
            />
            {nextPanel && (
              <div className={barNs.b} style={layout === 'horizontal' ? { width: 0 } : { height: 0 }}>
                <div
                  role="separator"
                  aria-label={`Resize panels ${index + 1} and ${index + 2}`}
                  aria-orientation={layout === 'horizontal' ? 'vertical' : 'horizontal'}
                  aria-valuenow={Math.round(sizes[index])}
                  aria-valuemin={pixels(panel.props.min, total, 0)}
                  aria-valuemax={pixels(panel.props.max, total, total)}
                  aria-disabled={!resizable}
                  tabIndex={resizable ? 0 : -1}
                  className={cx(
                    barNs.e('dragger'),
                    barNs.e(`dragger-${layout}`),
                    moving === index && barNs.e('dragger-active'),
                    lazy && 'is-lazy',
                    !resizable && 'is-disabled',
                  )}
                  style={{
                    width: layout === 'horizontal' ? 16 : '100%',
                    height: layout === 'vertical' ? 16 : '100%',
                    touchAction: 'none',
                    cursor: resizable ? (layout === 'horizontal' ? 'ew-resize' : 'ns-resize') : 'auto',
                  }}
                  onPointerDown={(event) => {
                    if (!resizable || event.button !== 0 || total <= 0) return;
                    event.preventDefault();
                    stop.current?.();
                    const start = layout === 'horizontal' ? event.clientX : event.clientY;
                    const initial = [...sizes];
                    let latest = initial;
                    setMoving(index);
                    onResizeStart?.(index, initial);
                    /** 移动期间只调整相邻两块，惰性模式只移动预览线。 */
                    function move(pointer: PointerEvent): void {
                      latest = adjusted(
                        index,
                        (layout === 'horizontal' ? pointer.clientX : pointer.clientY) - start,
                        initial,
                      );
                      if (lazy) setLazyOffset(latest[index] - initial[index]);
                      else publish(latest);
                      onResize?.(index, latest);
                    }
                    /** 释放监听并结束拖动，卸载清理不触发提交。 */
                    function cleanup(): void {
                      window.removeEventListener('pointermove', move);
                      window.removeEventListener('pointerup', finish);
                      window.removeEventListener('pointercancel', cancel);
                      stop.current = null;
                    }
                    /** 拖动结束时一次性提交惰性尺寸。 */
                    function finish(): void {
                      cleanup();
                      if (lazy) publish(latest);
                      setMoving(null);
                      setLazyOffset(0);
                      onResizeEnd?.(index, latest);
                    }
                    /** 系统取消触摸时恢复开始尺寸。 */
                    function cancel(): void {
                      cleanup();
                      if (!lazy) publish(initial);
                      setMoving(null);
                      setLazyOffset(0);
                      onResizeEnd?.(index, initial);
                    }
                    window.addEventListener('pointermove', move);
                    window.addEventListener('pointerup', finish);
                    window.addEventListener('pointercancel', cancel);
                    stop.current = cleanup;
                  }}
                  onKeyDown={(event) => {
                    if (!resizable) return;
                    const negative = layout === 'horizontal' ? 'ArrowLeft' : 'ArrowUp',
                      positive = layout === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
                    if (![negative, positive, 'Home', 'End'].includes(event.key)) return;
                    event.preventDefault();
                    const delta =
                      event.key === 'Home'
                        ? -total
                        : event.key === 'End'
                          ? total
                          : (event.key === negative ? -1 : 1) * (event.shiftKey ? 50 : 10);
                    const next = adjusted(index, delta, sizes);
                    onResizeStart?.(index, sizes);
                    publish(next);
                    onResize?.(index, next);
                    onResizeEnd?.(index, next);
                  }}
                />
                {panel.props.collapsible && (
                  <button
                    type="button"
                    aria-label={`Collapse or restore panel ${index + 1}`}
                    className={cx(barNs.e('collapse-icon'), barNs.e(`${layout}-collapse-icon-start`))}
                    onClick={() => collapse(index, 'start')}
                  >
                    {panel.props.renderStartCollapsible ?? (layout === 'horizontal' ? '‹' : '⌃')}
                  </button>
                )}
                {nextPanel.props.collapsible && (
                  <button
                    type="button"
                    aria-label={`Collapse or restore panel ${index + 2}`}
                    className={cx(barNs.e('collapse-icon'), barNs.e(`${layout}-collapse-icon-end`))}
                    onClick={() => collapse(index, 'end')}
                  >
                    {nextPanel.props.renderEndCollapsible ?? (layout === 'horizontal' ? '›' : '⌄')}
                  </button>
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
