'use client';
import { useContext, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ConfigContext, cx, useControllable, useNamespace } from '../../hooks';
import { useFloatingPosition } from '../../hooks/use-floating-position';
import { Button } from '../button';
import { Glyph, Icon } from '../icon';
import type { BaseProps, SemanticType } from '../../hooks';
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { Placement, ReferenceElement } from '@floating-ui/dom';

type Trigger = 'hover' | 'focus' | 'click' | 'contextmenu';
export interface TooltipHandle {
  hide: () => void;
  onOpen: () => void;
  onClose: () => void;
  updatePopper: () => void;
  isFocusInsideContent: () => boolean;
  readonly popperRef: HTMLElement | null;
  readonly contentRef: HTMLElement | null;
}
export interface TooltipProps extends BaseProps {
  appendTo?: string | HTMLElement;
  effect?: 'dark' | 'light';
  content?: string;
  rawContent?: boolean;
  placement?: Placement;
  fallbackPlacements?: Placement[];
  visible?: boolean | null;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  disabled?: boolean;
  offset?: number;
  showAfter?: number;
  showArrow?: boolean;
  hideAfter?: number;
  autoClose?: number;
  popperClass?: string;
  popperStyle?: CSSProperties;
  enterable?: boolean;
  teleported?: boolean;
  trigger?: Trigger | Trigger[];
  virtualTriggering?: boolean;
  virtualRef?: ReferenceElement;
  triggerKeys?: string[];
  persistent?: boolean;
  ariaLabel?: string;
  focusOnTarget?: boolean;
  renderContent?: ReactNode;
  renderReference?: ReactNode;
  onBeforeShow?: () => void;
  onShow?: () => void;
  onBeforeHide?: () => void;
  onHide?: () => void;
  ref?: Ref<TooltipHandle>;
}
export interface PopoverProps extends TooltipProps {
  title?: string;
  width?: number | string;
  onBeforeEnter?: () => void;
  onAfterEnter?: () => void;
  onBeforeLeave?: () => void;
  onAfterLeave?: () => void;
}
const popupStacks = new WeakMap<Document, symbol[]>();

/** 文本提示使用共享定位和触发模型。 */
export function Tooltip(props: TooltipProps) {
  return <FloatingSurface {...props} />;
}
/** 弹出框默认浅色和持久化；reference内容与面板默认内容分离。 */
export function Popover({
  children,
  renderReference,
  persistent = true,
  effect = 'light',
  width = 150,
  ...props
}: PopoverProps) {
  return (
    <FloatingSurface
      {...props}
      effect={effect}
      persistent={persistent}
      width={width}
      popover
      renderContent={children ?? props.renderContent}
      renderReference={renderReference}
    />
  );
}

/** 所有延时、自动关闭、外部点击和定位订阅都由本实例释放。 */
function FloatingSurface({
  appendTo = 'body',
  effect = 'dark',
  content = '',
  rawContent = false,
  placement = 'bottom',
  fallbackPlacements,
  visible,
  defaultVisible = false,
  onVisibleChange,
  disabled = false,
  offset = 12,
  showAfter = 0,
  showArrow = true,
  hideAfter = 200,
  autoClose = 0,
  popperClass,
  popperStyle,
  enterable = true,
  teleported = true,
  trigger = 'hover',
  virtualTriggering = false,
  virtualRef,
  triggerKeys = ['Enter', 'NumpadEnter', 'Space', ' '],
  persistent = false,
  ariaLabel,
  focusOnTarget = false,
  renderContent,
  renderReference,
  onBeforeShow,
  onShow,
  onBeforeHide,
  onHide,
  ref,
  popover = false,
  title,
  width,
  onBeforeEnter,
  onAfterEnter,
  onBeforeLeave,
  onAfterLeave,
  className,
  children,
  ...rest
}: PopoverProps & { popover?: boolean }) {
  const ns = useNamespace('popper');
  const config = useContext(ConfigContext);
  const id = useId();
  const [open, setOpen] = useControllable(visible ?? undefined, defaultVisible, onVisibleChange);
  const shown = open && !disabled;
  const [reference, setReference] = useState<HTMLElement | null>(null);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [revision, setRevision] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const transitions = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previous = useRef(false);
  const callbacks = useRef({
    onBeforeShow,
    onShow,
    onBeforeHide,
    onHide,
    onBeforeEnter,
    onAfterEnter,
    onBeforeLeave,
    onAfterLeave,
  });
  useEffect(() => {
    callbacks.current = {
      onBeforeShow,
      onShow,
      onBeforeHide,
      onHide,
      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,
    };
  });
  useEffect(() => {
    setHost(
      typeof appendTo === 'string'
        ? (document.querySelector<HTMLElement>(appendTo) ?? document.body)
        : appendTo,
    );
  }, [appendTo]);
  const position = useFloatingPosition({
    reference: virtualTriggering ? (virtualRef ?? null) : reference,
    floating: panel,
    arrow,
    active: shown,
    placement,
    offset,
    fallbackPlacements,
    revision,
  });
  /** 受控触发器由外部管理，实例方法仍能请求显隐更新。 */
  function schedule(next: boolean, manual = false): void {
    clearTimeout(timer.current);
    if (disabled || (!manual && visible !== undefined && visible !== null)) return;
    const delay = next ? showAfter : hideAfter;
    timer.current = setTimeout(() => {
      setOpen(next);
      if (next && focusOnTarget) reference?.focus();
    }, delay);
  }
  const scheduleRef = useRef(schedule);
  scheduleRef.current = schedule;
  const openRef = useRef(setOpen);
  openRef.current = setOpen;
  useImperativeHandle(ref, () => ({
    hide: () => {
      clearTimeout(timer.current);
      setOpen(false);
    },
    onOpen: () => schedule(true, true),
    onClose: () => schedule(false, true),
    updatePopper: () => {
      if (panel) panel.dispatchEvent(new Event('resize'));
      setRevision((value) => value + 1);
    },
    isFocusInsideContent: () => Boolean(panel?.contains(panel.ownerDocument.activeElement)),
    get popperRef() {
      return panel;
    },
    get contentRef() {
      return panel;
    },
  }));
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(autoTimer.current);
      clearTimeout(transitions.current);
    },
    [],
  );
  useEffect(() => {
    clearTimeout(transitions.current);
    if (previous.current === shown) return;
    previous.current = shown;
    if (shown) {
      callbacks.current.onBeforeShow?.();
      callbacks.current.onBeforeEnter?.();
    } else {
      callbacks.current.onBeforeHide?.();
      callbacks.current.onBeforeLeave?.();
    }
    transitions.current = setTimeout(() => {
      if (shown) {
        callbacks.current.onShow?.();
        callbacks.current.onAfterEnter?.();
      } else {
        callbacks.current.onHide?.();
        callbacks.current.onAfterLeave?.();
      }
    }, 200);
    return () => clearTimeout(transitions.current);
  }, [shown]);
  useEffect(() => {
    if (!shown || !autoClose) return;
    autoTimer.current = setTimeout(() => openRef.current(false), autoClose);
    return () => clearTimeout(autoTimer.current);
  }, [shown, autoClose]);
  useEffect(() => {
    if (!shown || !panel) return;
    const doc = panel.ownerDocument;
    const token = Symbol('popup');
    const stack = popupStacks.get(doc) ?? [];
    stack.push(token);
    popupStacks.set(doc, stack);
    /** composedPath覆盖Portal和shadow DOM的点击路径。 */
    function outside(event: PointerEvent): void {
      if (popupStacks.get(doc)?.at(-1) !== token) return;
      const path = event.composedPath();
      if (!path.includes(panel!) && (!reference || !path.includes(reference)))
        scheduleRef.current(false, true);
    }
    function escape(event: globalThis.KeyboardEvent): void {
      if (event.key === 'Escape' && popupStacks.get(doc)?.at(-1) === token) {
        event.stopPropagation();
        scheduleRef.current(false, true);
      }
    }
    doc.addEventListener('pointerdown', outside);
    doc.addEventListener('keydown', escape);
    return () => {
      doc.removeEventListener('pointerdown', outside);
      doc.removeEventListener('keydown', escape);
      const index = stack.indexOf(token);
      if (index >= 0) stack.splice(index, 1);
    };
    // 回调读取本次可见周期；其余配置变化由下一次可见周期重新注册。
  }, [shown, panel, reference, hideAfter]);
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const body =
    renderContent ?? (rawContent ? <span dangerouslySetInnerHTML={{ __html: content }} /> : content);
  const overlay =
    shown || persistent ? (
      <div
        ref={setPanel}
        id={id}
        role={popover ? 'dialog' : 'tooltip'}
        aria-label={ariaLabel ?? title}
        data-popper-placement={position.placement}
        className={cx(
          ns.b,
          `is-${effect}`,
          popover && `${ns.namespace}-popover`,
          popover && `${ns.namespace}-popover--plain`,
          popperClass,
        )}
        style={{
          ...position.style,
          zIndex: config.zIndex,
          ...(popover ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
          display: shown ? undefined : 'none',
          ...popperStyle,
        }}
        onMouseEnter={() => {
          if (enterable) clearTimeout(timer.current);
        }}
        onMouseLeave={() => {
          if (triggers.includes('hover')) schedule(false);
        }}
      >
        {popover && title && <div className={`${ns.namespace}-popover__title`}>{title}</div>}
        {body}
        {showArrow && (
          <span ref={setArrow} className={ns.e('arrow')} data-popper-arrow="" style={position.arrowStyle} />
        )}
      </div>
    ) : null;
  return (
    <>
      <span
        {...rest}
        ref={setReference}
        className={cx(`${ns.namespace}-tooltip__trigger`, className)}
        aria-describedby={!popover && shown ? id : undefined}
        aria-expanded={popover ? shown : undefined}
        tabIndex={focusOnTarget ? 0 : undefined}
        style={{ display: virtualTriggering ? 'none' : 'inline-flex' }}
        onMouseEnter={() => {
          if (triggers.includes('hover')) schedule(true);
        }}
        onMouseLeave={() => {
          if (triggers.includes('hover')) schedule(false);
        }}
        onFocus={() => {
          if (triggers.includes('focus')) schedule(true);
        }}
        onBlur={(event) => {
          if (triggers.includes('focus') && !panel?.contains(event.relatedTarget as Node)) schedule(false);
        }}
        onClick={() => {
          if (triggers.includes('click')) schedule(!shown);
        }}
        onContextMenu={(event) => {
          if (triggers.includes('contextmenu')) {
            event.preventDefault();
            schedule(!shown);
          }
        }}
        onKeyDown={(event) => {
          if (triggerKeys.includes(event.key) || triggerKeys.includes(event.code)) {
            event.preventDefault();
            schedule(!shown);
          }
        }}
      >
        {renderReference ?? children}
      </span>
      {teleported && host ? createPortal(overlay, host) : overlay}
    </>
  );
}

export interface PopconfirmProps extends Omit<PopoverProps, 'children' | 'ref'> {
  children?: ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: SemanticType | 'default' | '' | 'text';
  cancelButtonType?: SemanticType | 'default' | '' | 'text';
  icon?: ReactNode;
  iconColor?: string;
  hideIcon?: boolean;
  onConfirm?: (event: React.MouseEvent) => void;
  onCancel?: (event: React.MouseEvent) => void;
  renderActions?: (actions: {
    confirm: (event: React.MouseEvent) => void;
    cancel: (event: React.MouseEvent) => void;
  }) => ReactNode;
  ref?: Ref<Pick<TooltipHandle, 'hide' | 'popperRef'>>;
}
/** 确认气泡的确认和取消具有独立回调，操作后请求关闭。 */
export function Popconfirm({
  title,
  confirmButtonText,
  cancelButtonText,
  confirmButtonType = 'primary',
  cancelButtonType = 'text',
  icon = <Glyph name="info" />,
  iconColor = '#f90',
  hideIcon = false,
  onConfirm,
  onCancel,
  renderActions,
  renderReference,
  children,
  ref,
  width = 150,
  trigger = 'click',
  hideAfter = 200,
  ...rest
}: PopconfirmProps) {
  const ns = useNamespace('popconfirm');
  const config = useContext(ConfigContext);
  const inner = useRef<TooltipHandle>(null);
  useImperativeHandle(ref, () => ({
    hide: () => inner.current?.hide(),
    get popperRef() {
      return inner.current?.popperRef ?? null;
    },
  }));
  /** 先通知业务动作，再关闭气泡，不隐式执行业务请求。 */
  function confirm(event: React.MouseEvent): void {
    onConfirm?.(event);
    inner.current?.hide();
  }
  function cancel(event: React.MouseEvent): void {
    onCancel?.(event);
    inner.current?.hide();
  }
  return (
    <Popover
      {...rest}
      ref={inner}
      trigger={trigger}
      width={width}
      hideAfter={hideAfter}
      renderReference={renderReference ?? children}
    >
      <div className={ns.b}>
        <div className={ns.e('main')}>
          {!hideIcon && (
            <Icon className={ns.e('icon')} color={iconColor}>
              {icon}
            </Icon>
          )}
          {title}
        </div>
        <div className={ns.e('action')}>
          {renderActions ? (
            renderActions({ confirm, cancel })
          ) : (
            <>
              <Button size="small" type={cancelButtonType} onClick={cancel}>
                {cancelButtonText ?? (config.locale === 'zh-cn' ? '取消' : 'No')}
              </Button>
              <Button size="small" type={confirmButtonType} onClick={confirm}>
                {confirmButtonText ?? (config.locale === 'zh-cn' ? '确定' : 'Yes')}
              </Button>
            </>
          )}
        </div>
      </div>
    </Popover>
  );
}
