'use client';
import { createRoot } from 'react-dom/client';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ConfigContext, cx, useNamespace } from '../../hooks';
import { useLayer } from '../../hooks/use-layer';
import { ConfigProvider } from '../config-provider';
import { Button } from '../button';
import { Input } from '../input';
import { Icon, Glyph } from '../icon';
import type { GlobalConfig } from '../../hooks';
import type { CSSProperties, ReactNode } from 'react';
import type { InputHandle } from '../input';
import type { ButtonProps } from '../button';

export type MessageBoxAction = 'confirm' | 'cancel' | 'close';
export interface MessageBoxActions {
  confirm: () => void;
  cancel: () => void;
  close: () => void;
}
export type MessageBoxContent = ReactNode | ((actions: MessageBoxActions) => ReactNode);
export interface MessageBoxOptions {
  autoFocus?: boolean;
  title?: string;
  message?: MessageBoxContent;
  dangerouslyUseHTMLString?: boolean;
  type?: 'primary' | 'success' | 'info' | 'warning' | 'error';
  icon?: ReactNode;
  closeIcon?: ReactNode;
  customClass?: string;
  customStyle?: CSSProperties;
  modal?: boolean;
  modalClass?: string;
  callback?: (valueOrAction: string, action?: MessageBoxAction) => unknown;
  showClose?: boolean;
  beforeClose?: (action: MessageBoxAction, instance: MessageBoxState, done: () => void) => void;
  distinguishCancelAndClose?: boolean;
  lockScroll?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtonType?: ButtonProps['type'];
  confirmButtonType?: ButtonProps['type'];
  cancelButtonLoadingIcon?: ReactNode;
  confirmButtonLoadingIcon?: ReactNode;
  cancelButtonClass?: string;
  confirmButtonClass?: string;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  closeOnHashChange?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputType?: string;
  inputValue?: string;
  inputPattern?: RegExp;
  inputValidator?: (value: string) => boolean | string | undefined;
  inputErrorMessage?: string;
  center?: boolean;
  draggable?: boolean;
  overflow?: boolean;
  roundButton?: boolean;
  buttonSize?: ButtonProps['size'];
  appendTo?: string | HTMLElement;
}
export interface MessageBoxState extends MessageBoxOptions {
  inputValue: string;
  confirmButtonLoading: boolean;
  cancelButtonLoading: boolean;
}
export type MessageBoxResult = 'confirm' | { value: string; action: 'confirm' };
const openBoxes = new Set<{ close: () => void }>();

/** 提示框使用显式可变代理承接来源beforeClose中的实例赋值。 */
function BoxContent({
  options,
  settle,
}: {
  options: MessageBoxOptions;
  settle: (action: MessageBoxAction, value: string) => void;
}) {
  const ns = useNamespace('message-box');
  const config = useContext(ConfigContext);
  const [state, setState] = useState<MessageBoxState>({
    ...options,
    inputValue: options.inputValue ?? '',
    confirmButtonLoading: false,
    cancelButtonLoading: false,
  });
  const stateRef = useRef(state);
  stateRef.current = state;
  const proxy = useRef<MessageBoxState | null>(null);
  const mounted = useRef(false);
  const completed = useRef(false);
  const [error, setError] = useState('');
  const node = useRef<HTMLDivElement>(null);
  const input = useRef<InputHandle>(null);
  const maskDown = useRef(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragCleanup = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      dragCleanup.current?.();
    };
  }, []);
  if (!proxy.current)
    proxy.current = new Proxy(stateRef.current, {
      get: (_target, key) => stateRef.current[key as keyof MessageBoxState],
      set: (_target, key, value) => {
        if (!mounted.current) return true;
        const next = { ...stateRef.current, [key]: value };
        stateRef.current = next;
        setState(next);
        return true;
      },
    });
  /** 确认输入先校验，再交由beforeClose决定何时完成。 */
  function action(kind: MessageBoxAction): void {
    if (completed.current || stateRef.current.confirmButtonLoading || stateRef.current.cancelButtonLoading)
      return;
    const current = stateRef.current;
    if (kind === 'confirm' && current.showInput) {
      let message = '';
      if (current.inputPattern) {
        current.inputPattern.lastIndex = 0;
        if (!current.inputPattern.test(current.inputValue))
          message = current.inputErrorMessage ?? 'Invalid input';
      }
      const result = current.inputValidator?.(current.inputValue);
      if (result === false) message = current.inputErrorMessage ?? 'Invalid input';
      else if (typeof result === 'string') message = result;
      if (message) {
        setError(message);
        input.current?.focus();
        return;
      }
    }
    let doneCalled = false;
    const done = (): void => {
      if (doneCalled || completed.current || !mounted.current) return;
      doneCalled = true;
      completed.current = true;
      settle(kind, stateRef.current.inputValue);
    };
    if (current.beforeClose) current.beforeClose(kind, proxy.current!, done);
    else done();
  }
  useLayer({
    active: true,
    node,
    lock: state.lockScroll ?? true,
    escape: state.closeOnPressEscape ?? true,
    close: () => action('close'),
    onOpenAutoFocus: (event) => {
      if (state.autoFocus === false) event.preventDefault();
    },
  });
  useEffect(() => {
    if (state.autoFocus !== false) {
      if (state.showInput) input.current?.focus();
      else
        node.current
          ?.querySelector<HTMLButtonElement>(`.${ns.namespace}-message-box__btns button:last-child`)
          ?.focus();
    }
  }, [state.autoFocus, state.showInput, ns.namespace]);
  const actionRef = useRef(action);
  actionRef.current = action;
  useEffect(() => {
    if (options.closeOnHashChange === false) return;
    const close = (): void => actionRef.current('close');
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, [options.closeOnHashChange]);
  /** 可拖动标题忽略按钮，监听在结束和卸载时释放。 */
  function startDrag(event: React.MouseEvent): void {
    if (!state.draggable || (event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    dragCleanup.current?.();
    const start = { clientX: event.clientX, clientY: event.clientY, ...position };
    const box = node.current?.getBoundingClientRect();
    const move = (next: MouseEvent): void => {
      let x = start.x + next.clientX - start.clientX;
      let y = start.y + next.clientY - start.clientY;
      if (!state.overflow && box) {
        x = Math.min(start.x + window.innerWidth - box.right, Math.max(start.x - box.left, x));
        y = Math.min(start.y + window.innerHeight - box.bottom, Math.max(start.y - box.top, y));
      }
      setPosition({ x, y });
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
  const actions: MessageBoxActions = {
    confirm: () => action('confirm'),
    cancel: () => action('cancel'),
    close: () => action('close'),
  };
  const content = typeof state.message === 'function' ? state.message(actions) : state.message;
  const title = state.title ?? (config.locale === 'zh-cn' ? '提示' : 'Message');
  const icon =
    state.icon ??
    (state.type ? (
      <Glyph
        name={
          state.type === 'success'
            ? 'check'
            : state.type === 'warning'
              ? 'warning'
              : state.type === 'error'
                ? 'error'
                : 'info'
        }
      />
    ) : undefined);
  return (
    <div
      className={cx(`${ns.namespace}-overlay`, state.modalClass)}
      style={{
        zIndex: (config.zIndex ?? 2000) + 1,
        backgroundColor: state.modal === false ? 'transparent' : undefined,
      }}
    >
      <div
        className={`${ns.namespace}-overlay-message-box`}
        onMouseDown={(event) => {
          maskDown.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          if (maskDown.current && event.target === event.currentTarget && (state.closeOnClickModal ?? true))
            action('close');
        }}
      >
        <div
          ref={node}
          role="dialog"
          aria-modal={state.modal ?? true}
          aria-label={title}
          tabIndex={-1}
          className={cx(
            ns.b,
            ns.is('center', state.center),
            ns.is('draggable', state.draggable),
            state.customClass,
          )}
          style={{
            transform: position.x || position.y ? `translate(${position.x}px,${position.y}px)` : undefined,
            ...state.customStyle,
          }}
        >
          <div className={ns.e('header')} onMouseDown={startDrag}>
            <div className={ns.e('title')}>
              {state.center && icon && <Icon className={ns.e('status')}>{icon}</Icon>}
              <span>{title}</span>
            </div>
            {state.showClose !== false && (
              <button
                type="button"
                className={ns.e('headerbtn')}
                aria-label="Close message box"
                onClick={actions.close}
              >
                <Icon className={ns.e('close')}>{state.closeIcon ?? <Glyph name="close" />}</Icon>
              </button>
            )}
          </div>
          <div className={ns.e('content')}>
            <div className={ns.e('container')}>
              {!state.center && icon && (
                <Icon
                  className={cx(
                    ns.e('status'),
                    state.type && `${ns.namespace}-message-box-icon--${state.type}`,
                  )}
                >
                  {icon}
                </Icon>
              )}
              <div className={ns.e('message')}>
                {state.dangerouslyUseHTMLString && typeof content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  content
                )}
              </div>
            </div>
            {state.showInput && (
              <div className={ns.e('input')}>
                <Input
                  ref={input}
                  type={state.inputType ?? 'text'}
                  placeholder={state.inputPlaceholder}
                  value={state.inputValue}
                  onValueChange={(value) => {
                    stateRef.current = { ...stateRef.current, inputValue: value };
                    setState(stateRef.current);
                    setError('');
                  }}
                  aria-label={state.inputPlaceholder ?? 'Input value'}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      state.inputType !== 'textarea' &&
                      !event.nativeEvent.isComposing
                    )
                      actions.confirm();
                  }}
                />
                <div role={error ? 'alert' : undefined} className={ns.e('errormsg')}>
                  {error}
                </div>
              </div>
            )}
          </div>
          <div className={ns.e('btns')}>
            {state.showCancelButton && (
              <Button
                type={state.cancelButtonType}
                className={state.cancelButtonClass}
                size={state.buttonSize}
                round={state.roundButton}
                loading={state.cancelButtonLoading}
                loadingIcon={state.cancelButtonLoadingIcon}
                onClick={actions.cancel}
              >
                {state.cancelButtonText ?? (config.locale === 'zh-cn' ? '取消' : 'Cancel')}
              </Button>
            )}
            {state.showConfirmButton !== false && (
              <Button
                type={state.confirmButtonType ?? 'primary'}
                className={state.confirmButtonClass}
                size={state.buttonSize}
                round={state.roundButton}
                loading={state.confirmButtonLoading}
                loadingIcon={state.confirmButtonLoadingIcon}
                onClick={actions.confirm}
              >
                {state.confirmButtonText ?? (config.locale === 'zh-cn' ? '确定' : 'OK')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 每个Promise只结算一次；强制close释放宿主并按关闭动作拒绝。 */
function createBox(options: MessageBoxOptions, config: GlobalConfig = {}): Promise<MessageBoxResult> {
  if (typeof document === 'undefined') return Promise.reject(new Error('MessageBox需要浏览器DOM'));
  return new Promise((resolve, reject) => {
    const parent =
      (typeof options.appendTo === 'string'
        ? document.querySelector<HTMLElement>(options.appendTo)
        : options.appendTo) ?? document.body;
    const container = document.createElement('div');
    parent.appendChild(container);
    const root = createRoot(container);
    let settled = false;
    const record = { close: () => finish('close', options.inputValue ?? '') };
    /** 回调和Promise共同获得同一完成结果，资源在结算时释放。 */
    function finish(action: MessageBoxAction, value: string): void {
      if (settled) return;
      settled = true;
      root.unmount();
      container.remove();
      openBoxes.delete(record);
      if (options.showInput) options.callback?.(value, action);
      else options.callback?.(action);
      if (action === 'confirm') resolve(options.showInput ? { value, action } : 'confirm');
      else reject(action === 'close' && options.distinguishCancelAndClose ? 'close' : 'cancel');
    }
    openBoxes.add(record);
    root.render(
      <ConfigProvider {...config}>
        <BoxContent options={options} settle={finish} />
      </ConfigProvider>,
    );
  });
}
/** 便捷方法仍使用相同实现，选项可以覆盖方法默认值。 */
function messageBoxFactory(config: GlobalConfig = {}) {
  const service = (options: MessageBoxOptions) => createBox(options, config);
  const method =
    (kind: 'alert' | 'confirm' | 'prompt') =>
    (message: MessageBoxContent, title?: string | MessageBoxOptions, options: MessageBoxOptions = {}) =>
      service({
        title: typeof title === 'string' ? title : undefined,
        showCancelButton: kind !== 'alert',
        showInput: kind === 'prompt',
        closeOnClickModal: kind !== 'alert',
        closeOnPressEscape: kind !== 'alert',
        ...(typeof title === 'object' ? title : options),
        message,
      });
  return Object.assign(service, {
    alert: method('alert'),
    confirm: method('confirm'),
    prompt: method('prompt'),
    close: () => [...openBoxes].forEach((record) => record.close()),
  });
}
export const MessageBox = messageBoxFactory();
/** 绑定当前Provider的提示框服务。 */
export function useMessageBox() {
  const config = useContext(ConfigContext);
  return useMemo(() => messageBoxFactory(config), [config]);
}
