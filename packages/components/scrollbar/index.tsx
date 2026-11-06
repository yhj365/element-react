'use client';
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cx, useNamespace } from '../../hooks';
import type { BaseProps } from '../../hooks';
import type { CSSProperties, ElementType, Ref } from 'react';

export interface ScrollbarHandle {
  handleScroll: () => void;
  scrollTo: (options: ScrollToOptions | number, y?: number) => void;
  setScrollTop: (top: number) => void;
  setScrollLeft: (left: number) => void;
  update: () => void;
  readonly wrapRef: HTMLDivElement | null;
}
export interface ScrollbarProps extends BaseProps {
  height?: number | string;
  maxHeight?: number | string;
  native?: boolean;
  wrapStyle?: CSSProperties;
  wrapClass?: string;
  viewStyle?: CSSProperties;
  viewClass?: string;
  noresize?: boolean;
  tag?: ElementType;
  always?: boolean;
  minSize?: number;
  role?: string;
  ariaLabel?: string;
  ariaOrientation?: 'horizontal' | 'vertical';
  tabIndex?: number;
  distance?: number;
  onScroll?: (position: { scrollTop: number; scrollLeft: number }) => void;
  onEndReached?: (direction: 'top' | 'bottom' | 'left' | 'right') => void;
  ref?: Ref<ScrollbarHandle>;
}
/** 自定义滚动条仍使用真实overflow容器，支持原生滚动与实例定位。 */
export function Scrollbar({
  height,
  maxHeight,
  native = false,
  wrapStyle,
  wrapClass,
  viewStyle,
  viewClass,
  noresize = false,
  tag: Tag = 'div',
  always = false,
  minSize = 20,
  role,
  ariaLabel,
  ariaOrientation,
  tabIndex,
  id,
  distance = 0,
  onScroll,
  onEndReached,
  ref,
  className,
  style,
  children,
  ...rest
}: ScrollbarProps) {
  const ns = useNamespace('scrollbar');
  const wrap = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLElement>(null);
  const [metrics, setMetrics] = useState({
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    top: 0,
    left: 0,
  });
  const previous = useRef({ top: 0, left: 0 });
  const dragCleanup = useRef<(() => void) | undefined>(undefined);
  /** 读取DOM尺寸与偏移；无变化时不触发多余渲染。 */
  const update = useCallback(() => {
    const node = wrap.current;
    if (!node) return;
    const next = {
      width: node.clientWidth,
      height: node.clientHeight,
      scrollWidth: node.scrollWidth,
      scrollHeight: node.scrollHeight,
      top: node.scrollTop,
      left: node.scrollLeft,
    };
    setMetrics((old) =>
      Object.keys(next).every((key) => old[key as keyof typeof old] === next[key as keyof typeof next])
        ? old
        : next,
    );
  }, []);
  useEffect(() => {
    update();
    if (noresize || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    if (wrap.current) observer.observe(wrap.current);
    if (view.current) observer.observe(view.current);
    return () => observer.disconnect();
  }, [update, noresize, children]);
  useEffect(() => () => dragCleanup.current?.(), []);
  /** 边界事件按实际移动方向通知，避免只读尺寸更新产生伪滚动。 */
  function handleScroll(): void {
    const node = wrap.current;
    if (!node) return;
    const { scrollTop, scrollLeft } = node;
    onScroll?.({ scrollTop, scrollLeft });
    if (scrollTop > previous.current.top && node.scrollHeight - node.clientHeight - scrollTop <= distance)
      onEndReached?.('bottom');
    else if (scrollTop < previous.current.top && scrollTop <= distance) onEndReached?.('top');
    if (scrollLeft > previous.current.left && node.scrollWidth - node.clientWidth - scrollLeft <= distance)
      onEndReached?.('right');
    else if (scrollLeft < previous.current.left && scrollLeft <= distance) onEndReached?.('left');
    previous.current = { top: scrollTop, left: scrollLeft };
    update();
  }
  /** 兼容不提供scrollTo的DOM测试环境及宿主容器。 */
  function scrollTo(options: ScrollToOptions | number, y?: number): void {
    const node = wrap.current;
    if (!node) return;
    if (typeof node.scrollTo === 'function') {
      if (typeof options === 'number') node.scrollTo(options, y ?? 0);
      else node.scrollTo(options);
    } else if (typeof options === 'number') {
      node.scrollLeft = options;
      node.scrollTop = y ?? 0;
    } else {
      if (options.top !== undefined) node.scrollTop = options.top;
      if (options.left !== undefined) node.scrollLeft = options.left;
    }
    update();
  }
  useImperativeHandle(ref, () => ({
    handleScroll,
    scrollTo,
    setScrollTop: (top) => {
      if (wrap.current) wrap.current.scrollTop = top;
      update();
    },
    setScrollLeft: (left) => {
      if (wrap.current) wrap.current.scrollLeft = left;
      update();
    },
    update,
    get wrapRef() {
      return wrap.current;
    },
  }));
  /** 拖拽结束或卸载后移除document监听。 */
  function startDrag(event: React.MouseEvent, vertical: boolean): void {
    event.preventDefault();
    event.stopPropagation();
    dragCleanup.current?.();
    const node = wrap.current;
    if (!node) return;
    const start = vertical ? event.clientY : event.clientX;
    const initial = vertical ? node.scrollTop : node.scrollLeft;
    const client = vertical ? node.clientHeight : node.clientWidth;
    const full = vertical ? node.scrollHeight : node.scrollWidth;
    const thumb = Math.max(minSize, (client * client) / Math.max(1, full));
    const move = (next: MouseEvent): void => {
      const delta = (vertical ? next.clientY : next.clientX) - start;
      const offset = initial + (delta * (full - client)) / Math.max(1, client - thumb);
      if (vertical) node.scrollTop = offset;
      else node.scrollLeft = offset;
      handleScroll();
    };
    const stop = (): void => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', stop);
      dragCleanup.current = undefined;
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
    dragCleanup.current = stop;
  }
  /** 点击轨道将滑块中心移动到点击位置。 */
  function track(event: React.MouseEvent, vertical: boolean): void {
    if (event.target !== event.currentTarget || !wrap.current) return;
    const node = wrap.current;
    const box = event.currentTarget.getBoundingClientRect();
    const client = vertical ? node.clientHeight : node.clientWidth;
    const full = vertical ? node.scrollHeight : node.scrollWidth;
    const thumb = Math.max(minSize, (client * client) / Math.max(1, full));
    const offset = (vertical ? event.clientY - box.top : event.clientX - box.left) - thumb / 2;
    const next = Math.max(
      0,
      Math.min(full - client, (offset * (full - client)) / Math.max(1, client - thumb)),
    );
    if (vertical) node.scrollTop = next;
    else node.scrollLeft = next;
    handleScroll();
  }
  const verticalSize = Math.max(
    minSize,
    (metrics.height * metrics.height) / Math.max(1, metrics.scrollHeight),
  );
  const horizontalSize = Math.max(
    minSize,
    (metrics.width * metrics.width) / Math.max(1, metrics.scrollWidth),
  );
  const y =
    (metrics.top / Math.max(1, metrics.scrollHeight - metrics.height)) * (metrics.height - verticalSize);
  const x =
    (metrics.left / Math.max(1, metrics.scrollWidth - metrics.width)) * (metrics.width - horizontalSize);
  return (
    <div {...rest} className={cx(ns.b, className)} style={style}>
      <div
        ref={wrap}
        tabIndex={tabIndex}
        className={cx(ns.e('wrap'), !native && `${ns.e('wrap')}--hidden-default`, wrapClass)}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          ...wrapStyle,
        }}
        onScroll={handleScroll}
      >
        <Tag
          id={id}
          ref={view}
          role={role}
          aria-label={ariaLabel}
          aria-orientation={ariaOrientation}
          className={cx(ns.e('view'), viewClass)}
          style={viewStyle}
        >
          {children}
        </Tag>
      </div>
      {!native && metrics.scrollHeight > metrics.height && (
        <div
          className={cx(ns.e('bar'), 'is-vertical', ns.is('always', always))}
          style={{ opacity: always ? 1 : undefined }}
          onMouseDown={(event) => track(event, true)}
        >
          <div
            className={ns.e('thumb')}
            style={{ height: verticalSize, transform: `translateY(${y}px)` }}
            onMouseDown={(event) => startDrag(event, true)}
          />
        </div>
      )}
      {!native && metrics.scrollWidth > metrics.width && (
        <div
          className={cx(ns.e('bar'), 'is-horizontal', ns.is('always', always))}
          style={{ opacity: always ? 1 : undefined }}
          onMouseDown={(event) => track(event, false)}
        >
          <div
            className={ns.e('thumb')}
            style={{ width: horizontalSize, transform: `translateX(${x}px)` }}
            onMouseDown={(event) => startDrag(event, false)}
          />
        </div>
      )}
    </div>
  );
}
