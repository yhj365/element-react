'use client';
import { useContext, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ConfigContext, cx, useControllable, useNamespace, useText } from '../../hooks';
import { useLayer } from '../../hooks/use-layer';
import { Glyph, Icon } from '../icon';
import type { BaseProps } from '../../hooks';
import type { CSSProperties, ReactNode, Ref } from 'react';

export interface ModalHandle {
  handleClose: () => void;
  resetPosition: () => void;
}
export interface DialogProps extends BaseProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  title?: string;
  width?: string | number;
  fullscreen?: boolean;
  top?: string;
  modal?: boolean;
  modalPenetrable?: boolean;
  modalClass?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  appendToBody?: boolean;
  appendTo?: string | HTMLElement;
  lockScroll?: boolean;
  openDelay?: number;
  closeDelay?: number;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  showClose?: boolean;
  beforeClose?: (done: (cancel?: boolean) => void) => void;
  draggable?: boolean;
  overflow?: boolean;
  center?: boolean;
  alignCenter?: boolean;
  destroyOnClose?: boolean;
  closeIcon?: ReactNode;
  zIndex?: number;
  headerAriaLevel?: string;
  customClass?: string;
  renderHeader?: (scope: { close: () => void; titleId: string; titleClass: string }) => ReactNode;
  renderTitle?: ReactNode;
  renderFooter?: ReactNode;
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  ref?: Ref<ModalHandle>;
}
export interface DrawerProps extends Omit<
  DialogProps,
  'width' | 'top' | 'fullscreen' | 'center' | 'alignCenter' | 'draggable' | 'overflow'
> {
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt';
  size?: string | number;
  withHeader?: boolean;
}

/** 对话框使用共享浮层生命周期，内容在关闭动画后按需销毁。 */
export function Dialog(props: DialogProps) {
  return <ModalSurface {...props} />;
}
/** 抽屉保留四方向和独立尺寸，不把对话框宽度规则强加给它。 */
export function Drawer(props: DrawerProps) {
  return <ModalSurface {...props} drawer />;
}

/** 管理显隐、Portal、关闭拦截、焦点及拖拽；过渡事件和兜底计时只结算一次。 */
function ModalSurface({
  value,
  defaultValue = false,
  onValueChange,
  title = '',
  width,
  fullscreen,
  top = '15vh',
  modal = true,
  modalPenetrable,
  modalClass,
  headerClass,
  bodyClass,
  footerClass,
  appendToBody = false,
  appendTo = 'body',
  lockScroll = true,
  openDelay = 0,
  closeDelay = 0,
  closeOnClickModal = true,
  closeOnPressEscape = true,
  showClose = true,
  beforeClose,
  draggable,
  overflow,
  center,
  alignCenter,
  destroyOnClose = false,
  closeIcon,
  zIndex,
  headerAriaLevel = '2',
  customClass,
  renderHeader,
  renderTitle,
  renderFooter,
  onOpen,
  onOpened,
  onClose,
  onClosed,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ref,
  drawer = false,
  direction = 'rtl',
  size = '30%',
  withHeader = true,
  className,
  style,
  children,
  ...rest
}: DialogProps & DrawerProps & { drawer?: boolean }) {
  const ns = useNamespace(drawer ? 'drawer' : 'dialog');
  const config = useContext(ConfigContext);
  const text = useText();
  const [requested, setRequested] = useControllable(value, defaultValue, onValueChange);
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [rendered, setRendered] = useState(false);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const node = useRef<HTMLElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const bodyId = `${uid}-body`;
  const downOnMask = useRef(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragCleanup = useRef<(() => void) | undefined>(undefined);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const callbacks = useRef({ onOpen, onOpened, onClose, onClosed });
  useEffect(() => {
    callbacks.current = { onOpen, onOpened, onClose, onClosed };
  });
  useEffect(() => {
    if (appendToBody || appendTo !== 'body')
      setPortal(typeof appendTo === 'string' ? document.querySelector<HTMLElement>(appendTo) : appendTo);
    else setPortal(null);
  }, [appendTo, appendToBody]);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (requested) {
          setRendered(true);
          setPhase((previous) => (previous === 'open' || previous === 'opening' ? previous : 'opening'));
        } else setPhase((previous) => (previous === 'closed' ? previous : 'closing'));
      },
      requested ? openDelay : closeDelay,
    );
    return () => clearTimeout(timer);
  }, [requested, openDelay, closeDelay]);
  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return;
    if (phase === 'opening') callbacks.current.onOpen?.();
    else callbacks.current.onClose?.();
    transitionTimer.current = setTimeout(() => {
      setPhase(phase === 'opening' ? 'open' : 'closed');
      if (phase === 'opening') callbacks.current.onOpened?.();
      else {
        callbacks.current.onClosed?.();
        if (destroyOnClose) setRendered(false);
      }
    }, 300);
    return () => clearTimeout(transitionTimer.current);
  }, [phase, destroyOnClose]);
  useEffect(() => () => dragCleanup.current?.(), []);
  /** done可异步调用，cancel=true保留弹层；同次关闭请求只提交一次。 */
  function requestClose(): void {
    let settled = false;
    const done = (cancel = false): void => {
      if (settled || !mounted.current) return;
      settled = true;
      if (!cancel) setRequested(false);
    };
    if (beforeClose) beforeClose(done);
    else done();
  }
  useLayer({
    active: phase !== 'closed' && rendered,
    node,
    lock: lockScroll,
    escape: closeOnPressEscape,
    close: requestClose,
    onOpenAutoFocus,
    onCloseAutoFocus,
  });
  useImperativeHandle(ref, () => ({
    handleClose: requestClose,
    resetPosition: () => setPosition({ x: 0, y: 0 }),
  }));
  /** 头部拖拽可约束在窗口内，监听由当前拖拽及卸载清理。 */
  function startDrag(event: React.MouseEvent): void {
    if (!draggable || fullscreen || drawer || (event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    dragCleanup.current?.();
    const start = { clientX: event.clientX, clientY: event.clientY, ...position };
    const bounds = node.current?.getBoundingClientRect();
    const move = (next: globalThis.MouseEvent): void => {
      let x = start.x + next.clientX - start.clientX;
      let y = start.y + next.clientY - start.clientY;
      if (!overflow && bounds) {
        x = Math.min(start.x + window.innerWidth - bounds.right, Math.max(start.x - bounds.left, x));
        y = Math.min(start.y + window.innerHeight - bounds.bottom, Math.max(start.y - bounds.top, y));
      }
      setPosition({ x, y });
    };
    const finish = (): void => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', finish);
      dragCleanup.current = undefined;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', finish);
    dragCleanup.current = finish;
  }
  const visible = phase !== 'closed';
  const overlayStyle: CSSProperties = {
    zIndex: zIndex ?? config.zIndex,
    display: visible ? undefined : 'none',
    pointerEvents: !modal && modalPenetrable ? 'none' : undefined,
  };
  const contentStyle: CSSProperties = drawer
    ? {
        [direction === 'rtl' || direction === 'ltr' ? 'width' : 'height']:
          typeof size === 'number' ? `${size}px` : size,
        ...style,
      }
    : ({
        '--el-dialog-width': typeof width === 'number' ? `${width}px` : width,
        '--el-dialog-margin-top': top,
        transform: position.x || position.y ? `translate(${position.x}px,${position.y}px)` : undefined,
        ...style,
      } as CSSProperties);
  const header = (
    <header
      className={cx(ns.e('header'), headerClass, !drawer && showClose && 'show-close')}
      onMouseDown={startDrag}
    >
      {renderTitle ??
        (renderHeader ? (
          renderHeader({ close: requestClose, titleId, titleClass: ns.e('title') })
        ) : (
          <span id={titleId} role="heading" aria-level={Number(headerAriaLevel)} className={ns.e('title')}>
            {title}
          </span>
        ))}
      {showClose && (
        <button
          type="button"
          aria-label={text.close}
          className={ns.e(drawer ? 'close-btn' : 'headerbtn')}
          onClick={requestClose}
        >
          <Icon className={ns.e('close')}>{closeIcon ?? <Glyph name="close" />}</Icon>
        </button>
      )}
    </header>
  );
  const panel = (
    <section
      {...rest}
      ref={node}
      tabIndex={-1}
      role="dialog"
      aria-modal={modal}
      aria-label={title || undefined}
      aria-labelledby={!title ? titleId : undefined}
      aria-describedby={bodyId}
      className={cx(
        ns.b,
        drawer && direction,
        drawer && visible && 'open',
        !drawer && ns.is('fullscreen', fullscreen),
        !drawer && ns.is('draggable', draggable),
        !drawer && ns.is('align-center', alignCenter),
        !drawer && ns.m(center ? 'center' : ''),
        customClass,
        className,
      )}
      style={{ pointerEvents: 'auto', ...contentStyle }}
    >
      {(!drawer || withHeader) && header}
      {rendered && (
        <div id={bodyId} className={cx(ns.e('body'), bodyClass)}>
          {children}
        </div>
      )}
      {renderFooter !== undefined && <div className={cx(ns.e('footer'), footerClass)}>{renderFooter}</div>}
    </section>
  );
  const content = (
    <div
      className={cx(
        `${ns.namespace}-overlay`,
        modalClass,
        `${ns.namespace}-modal-${drawer ? 'drawer' : 'dialog'}`,
        drawer && 'is-drawer',
        modalPenetrable && 'is-penetrable',
      )}
      style={{ ...overlayStyle, backgroundColor: modal ? undefined : 'transparent' }}
      onMouseDown={(event) => {
        const target = event.target;
        downOnMask.current =
          target === event.currentTarget ||
          (target instanceof HTMLElement && target.classList.contains(`${ns.namespace}-overlay-dialog`));
      }}
      onClick={(event) => {
        if (closeOnClickModal && downOnMask.current && event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className={cx(
          !drawer && `${ns.namespace}-overlay-dialog`,
          !drawer && alignCenter && 'is-align-center',
        )}
        style={
          drawer
            ? undefined
            : { display: alignCenter ? 'flex' : undefined, alignItems: alignCenter ? 'center' : undefined }
        }
        onClick={(event) => {
          if (closeOnClickModal && downOnMask.current && event.target === event.currentTarget) requestClose();
        }}
      >
        {rendered || !destroyOnClose ? panel : null}
      </div>
    </div>
  );
  return portal ? createPortal(content, portal) : content;
}
