'use client';
import { useEffect, useImperativeHandle, useRef } from 'react';
import type { HTMLAttributes, Ref, RefObject } from 'react';

export interface InfiniteScrollOptions {
  disabled?: boolean;
  delay?: number;
  distance?: number;
  immediate?: boolean;
}
export interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement>, InfiniteScrollOptions {
  onLoad: () => void;
  ref?: Ref<HTMLDivElement>;
}
/** 优先选取最近可纵向滚动的元素，否则监听窗口。 */
function scrollHost(element: HTMLElement): HTMLElement | Window {
  let parent: HTMLElement | null = element;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    if (/auto|scroll|overlay/.test(getComputedStyle(parent).overflowY || getComputedStyle(parent).overflow))
      return parent;
    parent = parent.parentElement;
  }
  return window;
}
/** 将Vue滚动指令映射为Hook；回调由调用方控制加载与禁用状态，卸载取消所有监听。 */
export function useInfiniteScroll(
  elementRef: RefObject<HTMLElement | null>,
  onLoad: () => void,
  { disabled = false, delay = 200, distance = 0, immediate = true }: InfiniteScrollOptions = {},
): void {
  const latest = useRef({ onLoad, disabled, distance });
  latest.current = { onLoad, disabled, distance };
  const previousDisabled = useRef(disabled);
  useEffect(() => {
    const candidate = elementRef.current;
    if (!candidate) return;
    const element = candidate;
    const host = scrollHost(element),
      viewport = host === window ? document.documentElement : (host as HTMLElement);
    let lastTop = viewport.scrollTop,
      lastCall = -Infinity;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined,
      mutationTimer: ReturnType<typeof setTimeout> | undefined;
    let observing = immediate;
    const observer =
      immediate && typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            if (mutationTimer !== undefined) return;
            mutationTimer = setTimeout(() => {
              mutationTimer = undefined;
              checkFull();
            }, 50);
          })
        : undefined;
    /** 首屏不足时随内容更新补充，首次填满后停止观察。 */
    function checkFull(): void {
      if (!observing || latest.current.disabled || viewport.clientHeight === 0) return;
      if (viewport.scrollHeight <= viewport.clientHeight) latest.current.onLoad();
      else {
        observing = false;
        observer?.disconnect();
      }
    }
    /** 只在向下滚动且达到元素底部时请求更多内容。 */
    function checkScroll(): void {
      const top = viewport.scrollTop,
        delta = top - lastTop;
      lastTop = top;
      if (observing || latest.current.disabled || delta < 0) return;
      const remaining =
        host === element
          ? viewport.scrollHeight - viewport.clientHeight - top
          : element.getBoundingClientRect().top -
            (host === window ? 0 : viewport.getBoundingClientRect().top) +
            element.clientTop +
            element.scrollHeight -
            viewport.clientHeight;
      if (remaining <= latest.current.distance) latest.current.onLoad();
    }
    /** 领先沿立即响应，窗口内后续滚动合并到一次尾沿检查。 */
    function schedule(): void {
      const remaining = Math.max(0, delay) - (Date.now() - lastCall);
      if (remaining <= 0) {
        if (scrollTimer !== undefined) {
          clearTimeout(scrollTimer);
          scrollTimer = undefined;
        }
        lastCall = Date.now();
        checkScroll();
      } else if (scrollTimer === undefined)
        scrollTimer = setTimeout(() => {
          scrollTimer = undefined;
          lastCall = Date.now();
          checkScroll();
        }, remaining);
    }
    observer?.observe(element, { childList: true, subtree: true });
    checkFull();
    host.addEventListener('scroll', schedule, { passive: true });
    return () => {
      host.removeEventListener('scroll', schedule);
      observer?.disconnect();
      if (scrollTimer !== undefined) clearTimeout(scrollTimer);
      if (mutationTimer !== undefined) clearTimeout(mutationTimer);
    };
  }, [elementRef, delay, immediate]);
  useEffect(() => {
    // 从禁用恢复时复查首屏；DOM变更交由上面的观察器合并。
    if (previousDisabled.current === disabled) return;
    previousDisabled.current = disabled;
    const element = elementRef.current;
    if (disabled || !immediate || !element) return;
    const host = scrollHost(element),
      viewport = host === window ? document.documentElement : (host as HTMLElement);
    if (viewport.clientHeight > 0 && viewport.scrollHeight <= viewport.clientHeight) {
      const timer = setTimeout(() => latest.current.onLoad(), 50);
      return () => clearTimeout(timer);
    }
  }, [disabled, immediate, elementRef]);
}
/** 声明式包装保留原生div属性，适合直接替代模板中的滚动指令。 */
export function InfiniteScroll({
  onLoad,
  disabled,
  delay,
  distance,
  immediate,
  ref,
  children,
  ...rest
}: InfiniteScrollProps) {
  const element = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => element.current!);
  useInfiniteScroll(element, onLoad, { disabled, delay, distance, immediate });
  return (
    <div {...rest} ref={element}>
      {children}
    </div>
  );
}
