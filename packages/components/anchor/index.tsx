'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cx, useNamespace } from '../../hooks';
import type { BaseProps } from '../../hooks';
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';

export interface AnchorHandle {
  scrollTo: (href?: string) => void;
}
export interface AnchorProps extends BaseProps {
  container?: string | HTMLElement | Window | (() => HTMLElement | Window | null);
  offset?: number;
  bound?: number;
  duration?: number;
  marker?: boolean;
  type?: 'default' | 'underline';
  direction?: 'vertical' | 'horizontal';
  selectScrollTop?: boolean;
  onChange?: (href: string) => void;
  onClick?: (event: MouseEvent<HTMLAnchorElement>, href?: string) => void;
  ref?: Ref<AnchorHandle>;
}
export interface AnchorLinkProps extends BaseProps {
  title?: string;
  href?: string;
  renderSubLink?: ReactNode;
}
interface AnchorContextValue {
  current: string;
  direction: 'vertical' | 'horizontal';
  register: (href: string, node: HTMLAnchorElement) => () => void;
  click: (event: MouseEvent<HTMLAnchorElement>, href?: string) => void;
}
const AnchorContext = createContext<AnchorContextValue | null>(null);

/** href只在当前文档查找，非法选择器不会中断整个滚动监听。 */
function targetOf(href: string): HTMLElement | null {
  if (!href.startsWith('#') || href.length < 2) return null;
  try {
    return document.getElementById(decodeURIComponent(href.slice(1)));
  } catch {
    return null;
  }
}
/** 切换锚点与点击滚动分开；滚动动画期间避免中途高亮其他节点。 */
export function Anchor({
  container,
  offset = 0,
  bound = 15,
  duration = 300,
  marker = true,
  type = 'default',
  direction = 'vertical',
  selectScrollTop = false,
  onChange,
  onClick,
  ref,
  children,
  className,
  style,
  ...rest
}: AnchorProps) {
  const ns = useNamespace('anchor');
  const [current, setCurrent] = useState('');
  const [markerStyle, setMarkerStyle] = useState<CSSProperties>({});
  const root = useRef<HTMLDivElement>(null),
    markerNode = useRef<HTMLDivElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const scrollContainer = useRef<HTMLElement | Window | null>(null);
  const activeHref = useRef('');
  const cancelAnimation = useRef<(() => void) | undefined>(undefined);
  const scrolling = useRef(false);
  const changeCallback = useRef(onChange);
  changeCallback.current = onChange;
  const register = useCallback((href: string, node: HTMLAnchorElement) => {
    links.current.set(href, node);
    return () => {
      if (links.current.get(href) === node) links.current.delete(href);
    };
  }, []);
  /** 相同锚点不重复分发change。 */
  function activate(href: string): void {
    if (activeHref.current === href) return;
    activeHref.current = href;
    setCurrent(href);
    changeCallback.current?.(href);
  }
  /** 窗口与局部容器的坐标统一转换为容器滚动坐标。 */
  function geometry(
    target: HTMLElement,
    host: HTMLElement | Window,
  ): { top: number; scrollTop: number; max: number } {
    const isWindow = host === window;
    const element = isWindow ? document.documentElement : (host as HTMLElement);
    const scrollTop = isWindow ? window.scrollY || element.scrollTop : element.scrollTop;
    return {
      top:
        target.getBoundingClientRect().top -
        (isWindow ? 0 : element.getBoundingClientRect().top + element.clientTop) +
        scrollTop,
      scrollTop,
      max: Math.max(0, element.scrollHeight - element.clientHeight),
    };
  }
  /** 取消上次动画后启动新动画，卸载时释放帧和结束计时。 */
  function scrollTo(href?: string): void {
    if (!href) return;
    activate(href);
    const target = targetOf(href),
      host = scrollContainer.current;
    if (!target || !host) return;
    cancelAnimation.current?.();
    scrolling.current = true;
    const position = geometry(target, host);
    const to = Math.max(0, Math.min(position.top - offset, position.max));
    let frame: number | undefined, timer: ReturnType<typeof setTimeout> | undefined;
    let start: number | undefined;
    /** 一帧使用与来源一致的缓入缓出曲线。 */
    function step(timestamp: number): void {
      start ??= timestamp;
      const progress = duration <= 0 ? 1 : Math.min(1, (timestamp - start) / duration);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const top = position.scrollTop + (to - position.scrollTop) * eased;
      if (host === window) window.scrollTo({ top });
      else (host as HTMLElement).scrollTop = top;
      if (progress < 1) frame = requestAnimationFrame(step);
      else
        timer = setTimeout(() => {
          scrolling.current = false;
        }, 20);
    }
    if (duration <= 0) step(0);
    else frame = requestAnimationFrame(step);
    cancelAnimation.current = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      if (timer !== undefined) clearTimeout(timer);
      scrolling.current = false;
    };
  }
  const scrollRef = useRef(scrollTo);
  scrollRef.current = scrollTo;
  useImperativeHandle(ref, () => ({ scrollTo }));
  useEffect(() => {
    const supplied =
      typeof container === 'function'
        ? container()
        : typeof container === 'string'
          ? document.querySelector<HTMLElement>(container)
          : container;
    const host = supplied ?? window;
    scrollContainer.current = host;
    let frame: number | undefined;
    /** 每帧只读取一次布局，按照阈值范围确定当前章节。 */
    function sync(): void {
      frame = undefined;
      if (scrolling.current) return;
      const positions = [...links.current.keys()]
        .flatMap((href) => {
          const target = targetOf(href);
          return target ? [{ href, ...geometry(target, host) }] : [];
        })
        .sort((a, b) => a.top - b.top);
      if (!positions.length) return;
      const scrollTop = positions[0].scrollTop;
      if (scrollTop === 0) {
        activate(selectScrollTop ? positions[0].href : '');
        return;
      }
      const selected = positions
        .slice()
        .reverse()
        .find((item) => item.top - offset - bound <= scrollTop);
      if (selected) activate(selected.href);
    }
    const listener = (): void => {
      if (frame === undefined) frame = requestAnimationFrame(sync);
    };
    host.addEventListener('scroll', listener);
    sync();
    const hash = window.location.hash;
    if (targetOf(hash)) scrollRef.current(hash);
    return () => {
      host.removeEventListener('scroll', listener);
      if (frame !== undefined) cancelAnimationFrame(frame);
      cancelAnimation.current?.();
      scrollContainer.current = null;
    };
  }, [container, offset, bound, selectScrollTop]);
  useEffect(() => {
    const node = links.current.get(current),
      parent = root.current;
    if (!node || !parent || !markerNode.current) {
      setMarkerStyle({});
      return;
    }
    /** 尺寸变化时重新对齐标记，不以固定行高推断位置。 */
    function measure(): void {
      const parentRect = parent!.getBoundingClientRect(),
        link = node!.getBoundingClientRect();
      setMarkerStyle(
        direction === 'horizontal'
          ? { left: link.left - parentRect.left, width: link.width, opacity: 1 }
          : {
              top:
                link.top -
                parentRect.top +
                (link.height - (markerNode.current?.getBoundingClientRect().height ?? 0)) / 2,
              opacity: 1,
            },
      );
    }
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(node);
    observer?.observe(parent);
    return () => observer?.disconnect();
  }, [current, direction, children, marker]);
  const context = useMemo<AnchorContextValue>(
    () => ({
      current,
      direction,
      register,
      click: (event, href) => {
        onClick?.(event, href);
        scrollRef.current(href);
      },
    }),
    [current, direction, register, onClick],
  );
  return (
    <AnchorContext value={context}>
      <div
        {...rest}
        ref={root}
        className={cx(ns.b, ns.m(direction), type === 'underline' && ns.m('underline'), className)}
        style={style}
      >
        {marker && <div ref={markerNode} className={ns.e('marker')} style={markerStyle} />}
        <div className={ns.e('list')}>{children}</div>
      </div>
    </AnchorContext>
  );
}
/** 子链接只在垂直目录中展示，href变化自动撤销旧注册。 */
export function AnchorLink({
  href,
  title,
  renderSubLink,
  children,
  className,
  style,
  ...rest
}: AnchorLinkProps) {
  const ns = useNamespace('anchor'),
    context = useContext(AnchorContext),
    node = useRef<HTMLAnchorElement>(null);
  const register = context?.register;
  useEffect(() => {
    if (href && node.current && register) return register(href, node.current);
  }, [href, register]);
  return (
    <div {...rest} className={cx(ns.e('item'), className)} style={style}>
      <a
        ref={node}
        href={href}
        className={cx(ns.e('link'), ns.is('active', Boolean(href && context?.current === href)))}
        aria-current={href && context?.current === href ? 'location' : undefined}
        onClick={(event) => context?.click(event, href)}
      >
        {children ?? title}
      </a>
      {context?.direction === 'vertical' && renderSubLink !== undefined && (
        <div className={ns.e('list')}>{renderSubLink}</div>
      )}
    </div>
  );
}
