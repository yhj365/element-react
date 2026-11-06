'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { cx, useNamespace } from '../../hooks';
import { useScrollLock } from '../../hooks/use-layer';
import type { BaseProps } from '../../hooks';
import type { ReactNode } from 'react';

export interface LoadingOptions {
  target?: string | HTMLElement;
  body?: boolean;
  fullscreen?: boolean;
  lock?: boolean;
  text?: ReactNode;
  spinner?: string;
  background?: string;
  customClass?: string;
  svg?: string;
  svgViewBox?: string;
  beforeClose?: () => boolean;
  closed?: () => void;
}
export interface LoadingProps
  extends Omit<BaseProps, 'children'>, Omit<LoadingOptions, 'target' | 'body' | 'beforeClose'> {
  loading?: boolean;
  children?: ReactNode;
}
export interface LoadingInstance {
  close: () => void;
  setText: (text: ReactNode) => void;
}

/** 遮罩支持区域和全屏模式；关闭回调在退出延迟后执行。 */
function LoadingComponent({
  loading = true,
  fullscreen = false,
  lock = false,
  text,
  spinner,
  background,
  customClass,
  svg,
  svgViewBox = '0 0 50 50',
  closed,
  serviceHost = false,
  children,
  className,
  style,
  ...rest
}: LoadingProps & { serviceHost?: boolean }) {
  const ns = useNamespace('loading');
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [present, setPresent] = useState(loading);
  const [closing, setClosing] = useState(false);
  const wasVisible = useRef(loading);
  const callback = useRef(closed);
  callback.current = closed;
  useScrollLock(Boolean(fullscreen && lock && present));
  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    if (loading) {
      wasVisible.current = true;
      setPresent(true);
      setClosing(false);
      return;
    }
    if (!wasVisible.current) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setPresent(false);
      setClosing(false);
      wasVisible.current = false;
      callback.current?.();
    }, 300);
    return () => clearTimeout(timer);
  }, [loading]);
  const mask = present ? (
    <div
      role="status"
      aria-label="Loading"
      className={cx(
        `${ns.b}-mask`,
        fullscreen && 'is-fullscreen',
        closing && `${ns.namespace}-loading-fade-leave-active`,
        customClass,
      )}
      style={{ backgroundColor: background, position: fullscreen ? 'fixed' : undefined }}
    >
      <div className={`${ns.b}-spinner`}>
        {spinner ? (
          <i className={spinner} />
        ) : (
          <svg
            className="circular"
            viewBox={svgViewBox}
            aria-hidden="true"
            {...(svg
              ? { dangerouslySetInnerHTML: { __html: svg } }
              : { children: <circle className="path" cx="25" cy="25" r="20" fill="none" /> })}
          />
        )}{' '}
        {text !== undefined && <p className={`${ns.b}-text`}>{text}</p>}
      </div>
    </div>
  ) : null;
  if (serviceHost) return fullscreen ? (host ? createPortal(mask, host) : null) : mask;
  return (
    <div
      {...rest}
      className={cx(loading && `${ns.namespace}-loading-parent--relative`, className)}
      style={style}
      aria-busy={present}
    >
      {children}
      {fullscreen ? (host ? createPortal(mask, host) : null) : mask}
    </div>
  );
}

/** 服务只在调用时创建根节点；多次close只完成一次。 */
function loadingService(options: LoadingOptions = {}): LoadingInstance {
  if (typeof document === 'undefined') throw new Error('Loading服务需要浏览器DOM');
  const { target, body = false, fullscreen = target === undefined, beforeClose, closed, ...rest } = options;
  const selected = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  const parent = body || fullscreen ? document.body : (selected ?? document.body);
  const container = document.createElement('div');
  parent.appendChild(container);
  const root = createRoot(container);
  const previousPosition = parent.style.position;
  if (!fullscreen && getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
  let open = true;
  let disposed = false;
  let text = rest.text;
  let timer: ReturnType<typeof setTimeout> | undefined;
  /** 仅由服务宿主负责释放根节点与父容器临时样式。 */
  function dispose(): void {
    if (disposed) return;
    disposed = true;
    clearTimeout(timer);
    root.unmount();
    container.remove();
    parent.style.position = previousPosition;
    closed?.();
  }
  /** 更新服务自身文本，不影响其他实例。 */
  function render(): void {
    root.render(
      <LoadingComponent {...rest} loading={open} fullscreen={fullscreen} text={text} serviceHost />,
    );
  }
  render();
  return {
    close: () => {
      if (!open || disposed || beforeClose?.() === false) return;
      open = false;
      render();
      timer = setTimeout(dispose, 300);
    },
    setText: (next) => {
      if (disposed) return;
      text = next;
      render();
    },
  };
}
/** React包装组件和显式service共同承接来源loading指令能力。 */
export const Loading = Object.assign(LoadingComponent, { service: loadingService });
