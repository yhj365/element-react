'use client';
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cx, useNamespace } from '../../hooks';
import { Icon, Glyph } from '../icon';
import type { BaseProps } from '../../hooks';
import type { Ref } from 'react';

export interface BacktopProps extends BaseProps {
  target?: string;
  visibilityHeight?: number;
  right?: number;
  bottom?: number;
  onClick?: (event: React.MouseEvent) => void;
}
/** 监听指定容器并平滑回顶；卸载移除滚动监听。 */
export function Backtop({
  target,
  visibilityHeight = 200,
  right = 40,
  bottom = 40,
  onClick,
  children,
  className,
  style,
  ...rest
}: BacktopProps) {
  const ns = useNamespace('backtop');
  const [visible, setVisible] = useState(false);
  const scroller = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = target ? document.querySelector<HTMLElement>(target) : document.documentElement;
    if (!node) return;
    scroller.current = node;
    const listener = target ? node : window;
    const update = (): void => setVisible(node.scrollTop >= visibilityHeight);
    update();
    listener.addEventListener('scroll', update, { passive: true });
    return () => listener.removeEventListener('scroll', update);
  }, [target, visibilityHeight]);
  if (!visible) return null;
  return (
    <div
      {...rest}
      role="button"
      tabIndex={0}
      aria-label="Back to top"
      className={cx(ns.b, className)}
      style={{ right, bottom, ...style }}
      onClick={(event) => {
        const node = scroller.current;
        if (node) {
          if (typeof node.scrollTo === 'function') node.scrollTo({ top: 0, behavior: 'smooth' });
          else node.scrollTop = 0;
        }
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      {children ?? (
        <Icon style={{ transform: 'rotate(-90deg)' }}>
          <Glyph name="arrow" />
        </Icon>
      )}
    </div>
  );
}

export interface AffixProps extends BaseProps {
  offset?: number;
  position?: 'top' | 'bottom';
  target?: string;
  zIndex?: number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  onChange?: (fixed: boolean) => void;
  onScroll?: (data: { scrollTop: number; fixed: boolean }) => void;
  ref?: Ref<{ update: () => void; updateRoot: () => void }>;
}
/** 固定定位保留占位尺寸，并在目标容器边界处平移内容。 */
export function Affix({
  offset = 0,
  position = 'top',
  target,
  zIndex = 100,
  teleported = false,
  appendTo = 'body',
  onChange,
  onScroll,
  ref,
  className,
  style,
  children,
  ...rest
}: AffixProps) {
  const ns = useNamespace('affix');
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [state, setState] = useState({ fixed: false, width: 0, height: 0, left: 0, shift: 0 });
  const fixed = useRef(false);
  const callbacks = useRef({ onChange, onScroll });
  useEffect(() => {
    callbacks.current = { onChange, onScroll };
  });
  useEffect(() => {
    setHost(typeof appendTo === 'string' ? document.querySelector<HTMLElement>(appendTo) : appendTo);
  }, [appendTo]);
  /** 测量只在挂载后执行，SSR首屏保留普通内容。 */
  const update = useCallback(() => {
    if (!root.current || !content.current) return;
    const box = root.current.getBoundingClientRect();
    const rect = content.current.getBoundingClientRect();
    const boundary = target
      ? document.querySelector<HTMLElement>(target)?.getBoundingClientRect()
      : undefined;
    const height = rect.height;
    const active =
      position === 'top'
        ? box.top <= offset && (!boundary || boundary.bottom > 0)
        : box.bottom >= window.innerHeight - offset && (!boundary || boundary.top < window.innerHeight);
    const shift = boundary
      ? position === 'top'
        ? Math.min(0, boundary.bottom - offset - height)
        : Math.max(0, boundary.top + offset + height - window.innerHeight)
      : 0;
    if (active !== fixed.current) {
      fixed.current = active;
      callbacks.current.onChange?.(active);
    }
    setState({ fixed: active, width: box.width, height, left: box.left, shift });
  }, [target, position, offset]);
  useEffect(() => {
    update();
    const scroll = (): void => {
      update();
      callbacks.current.onScroll?.({
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        fixed: fixed.current,
      });
    };
    window.addEventListener('scroll', scroll, { passive: true, capture: true });
    window.addEventListener('resize', update);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined;
    if (root.current) observer?.observe(root.current);
    return () => {
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [update]);
  useImperativeHandle(ref, () => ({ update, updateRoot: update }), [update]);
  const inner = (
    <div
      ref={content}
      className={cx(state.fixed && ns.m('fixed'))}
      style={
        state.fixed
          ? {
              position: 'fixed',
              width: state.width,
              left: state.left,
              [position]: offset,
              zIndex,
              transform: state.shift ? `translateY(${state.shift}px)` : undefined,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
  return (
    <div
      {...rest}
      ref={root}
      className={cx(ns.b, className)}
      style={{ ...(state.fixed ? { height: state.height, width: state.width } : {}), ...style }}
    >
      {teleported && host && state.fixed ? createPortal(inner, host) : inner}
    </div>
  );
}
