'use client';
import { useEffect, useRef } from 'react';

interface Layer {
  token: symbol;
  close: () => void;
  node: HTMLElement;
}
const layers = new WeakMap<Document, Layer[]>();
const locks = new WeakMap<Document, { count: number; overflow: string; paddingRight: string }>();
export interface LayerOptions {
  active: boolean;
  node: React.RefObject<HTMLElement | null>;
  escape?: boolean;
  lock?: boolean;
  close: () => void;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

/** 非焦点浮层也复用同一滚动锁计数，避免Loading与Dialog互相提前解锁。 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const doc = document;
    const existing = locks.get(doc);
    if (existing) existing.count++;
    else {
      locks.set(doc, {
        count: 1,
        overflow: doc.body.style.overflow,
        paddingRight: doc.body.style.paddingRight,
      });
      doc.body.style.overflow = 'hidden';
    }
    return () => {
      const lock = locks.get(doc);
      if (lock && --lock.count === 0) {
        doc.body.style.overflow = lock.overflow;
        doc.body.style.paddingRight = lock.paddingRight;
        locks.delete(doc);
      }
    };
  }, [active]);
}

/** 按document隔离浮层栈、焦点与滚动锁；嵌套层只由栈顶响应Escape。 */
export function useLayer(options: LayerOptions): void {
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });
  useEffect(() => {
    const node = options.node.current;
    if (!options.active || !node) return;
    const doc = node.ownerDocument;
    const token = Symbol('layer');
    const previousFocus = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
    const stack = layers.get(doc) ?? [];
    stack.push({ token, node, close: () => latest.current.close() });
    layers.set(doc, stack);
    if (options.lock) {
      const lock = locks.get(doc);
      if (lock) lock.count++;
      else {
        const width = doc.defaultView
          ? Math.max(0, doc.defaultView.innerWidth - doc.documentElement.clientWidth)
          : 0;
        locks.set(doc, {
          count: 1,
          overflow: doc.body.style.overflow,
          paddingRight: doc.body.style.paddingRight,
        });
        doc.body.style.overflow = 'hidden';
        if (width && doc.documentElement.clientWidth)
          doc.body.style.paddingRight = `${parseFloat(getComputedStyle(doc.body).paddingRight) + width}px`;
      }
    }
    const openEvent = new Event('open-auto-focus', { cancelable: true });
    latest.current.onOpenAutoFocus?.(openEvent);
    if (!openEvent.defaultPrevented) node.focus();
    /** 只列出可达焦点，隐藏和禁用元素不参与循环。 */
    function focusables(): HTMLElement[] {
      return [
        ...node!.querySelectorAll<HTMLElement>(
          'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      ].filter((item) => !item.closest('[hidden]') && item.getAttribute('aria-hidden') !== 'true');
    }
    /** 栈顶承担焦点循环和退出；其他层保持静默。 */
    function keydown(event: KeyboardEvent): void {
      if (layers.get(doc)?.at(-1)?.token !== token) return;
      if (event.key === 'Escape' && latest.current.escape) {
        event.stopPropagation();
        event.preventDefault();
        latest.current.close();
      }
      if (event.key === 'Tab') {
        const list = focusables();
        const first = list[0];
        const last = list.at(-1);
        if (!first) {
          event.preventDefault();
          node?.focus();
        } else if (event.shiftKey && (doc.activeElement === first || doc.activeElement === node)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (doc.activeElement === last || doc.activeElement === node)) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    doc.addEventListener('keydown', keydown);
    return () => {
      doc.removeEventListener('keydown', keydown);
      const current = layers.get(doc);
      const topmost = current?.at(-1)?.token === token;
      if (current) {
        const index = current.findIndex((item) => item.token === token);
        if (index >= 0) current.splice(index, 1);
      }
      if (options.lock) {
        const lock = locks.get(doc);
        if (lock && --lock.count === 0) {
          doc.body.style.overflow = lock.overflow;
          doc.body.style.paddingRight = lock.paddingRight;
          locks.delete(doc);
        }
      }
      const closeEvent = new Event('close-auto-focus', { cancelable: true });
      latest.current.onCloseAutoFocus?.(closeEvent);
      if (topmost && !closeEvent.defaultPrevented) {
        if (previousFocus?.isConnected) previousFocus.focus();
        else current?.at(-1)?.node.focus();
      }
    };
  }, [options.active, options.escape, options.lock, options.node]);
}
