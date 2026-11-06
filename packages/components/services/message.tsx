'use client';
import { createRoot } from 'react-dom/client';
import { useContext, useMemo } from 'react';
import { ConfigContext, cx } from '../../hooks';
import { ConfigProvider } from '../config-provider';
import { Glyph, Icon } from '../icon';
import type { GlobalConfig } from '../../hooks';
import type { CSSProperties, ReactNode } from 'react';
import type { Root } from 'react-dom/client';

export type MessageType = 'primary' | 'success' | 'warning' | 'info' | 'error';
export type MessagePlacement = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';
export interface MessageOptions {
  message?: ReactNode | (() => ReactNode);
  type?: MessageType;
  plain?: boolean;
  icon?: ReactNode;
  dangerouslyUseHTMLString?: boolean;
  customClass?: string;
  duration?: number;
  showClose?: boolean;
  onClose?: () => void;
  offset?: number;
  placement?: MessagePlacement;
  appendTo?: string | HTMLElement;
  grouping?: boolean;
  repeatNum?: number;
}
export interface NotificationOptions extends Omit<
  MessageOptions,
  'placement' | 'grouping' | 'plain' | 'repeatNum'
> {
  title?: string;
  position?: Exclude<MessagePlacement, 'top' | 'bottom'>;
  zIndex?: number;
  onClick?: () => void;
  closeIcon?: ReactNode;
  progress?: boolean | { color?: string };
  pauseOnHover?: boolean;
}
export interface MessageInstance {
  close: () => void;
}
interface RecordItem {
  id: number;
  kind: 'message' | 'notification';
  placement: MessagePlacement;
  container: HTMLElement;
  root: Root;
  node: HTMLElement | null;
  options: MessageOptions & NotificationOptions;
  config: GlobalConfig;
  timer?: ReturnType<typeof setTimeout>;
  observer?: ResizeObserver;
  closed: boolean;
  remaining: number;
  startedAt: number;
  instance: MessageInstance;
  render: () => void;
}
const records: RecordItem[] = [];
let nextId = 0;

/** 同一容器、同一方向的提示按实际高度重新堆叠。 */
function layout(): void {
  const offsets = new Map<string, number>();
  for (const item of records) {
    if (!item.node || item.closed) continue;
    const key = `${item.kind}:${item.placement}`;
    const existing = records.filter(
      (other) =>
        other.kind === item.kind &&
        other.placement === item.placement &&
        other.container.parentElement === item.container.parentElement,
    );
    let position = item.options.offset ?? (item.kind === 'message' ? 16 : 0);
    for (const other of existing) {
      if (other === item) break;
      if (!other.closed)
        position += (other.node?.getBoundingClientRect().height || (other.kind === 'message' ? 48 : 80)) + 16;
    }
    const side = item.placement.startsWith('bottom') ? 'bottom' : 'top';
    item.node.style[side] = `${position + (item.kind === 'notification' ? 16 : 0)}px`;
    offsets.set(key, position);
  }
}
/** 页面直接关闭或计时关闭都只执行一次回调。 */
function close(item: RecordItem): void {
  if (item.closed) return;
  item.closed = true;
  clearTimeout(item.timer);
  item.observer?.disconnect();
  item.root.unmount();
  item.container.remove();
  const index = records.indexOf(item);
  if (index >= 0) records.splice(index, 1);
  item.options.onClose?.();
  layout();
}
/** 定时以剩余时长恢复，0表示持续展示。 */
function resume(item: RecordItem): void {
  clearTimeout(item.timer);
  if (item.remaining <= 0) return;
  item.startedAt = Date.now();
  item.timer = setTimeout(() => close(item), item.remaining);
}
/** 鼠标进入暂停计时，离开时继续当前剩余时间。 */
function pause(item: RecordItem): void {
  clearTimeout(item.timer);
  item.remaining = Math.max(0, item.remaining - (Date.now() - item.startedAt));
}

/** 提示内容可以是React节点或显式HTML字符串。 */
function ServiceContent({ item }: { item: RecordItem }) {
  const { options, kind, config } = item;
  const ns = `${config.namespace ?? 'el'}-${kind === 'message' ? 'message' : 'notification'}`;
  const type = options.type ?? (kind === 'message' ? 'info' : undefined);
  const message = typeof options.message === 'function' ? options.message() : options.message;
  const body =
    options.dangerouslyUseHTMLString && typeof message === 'string' ? (
      <span dangerouslySetInnerHTML={{ __html: message }} />
    ) : (
      message
    );
  const style: CSSProperties = {
    position: 'fixed',
    zIndex: options.zIndex ?? (config.zIndex ?? 2000) + item.id,
  };
  if (item.placement.endsWith('left')) style.left = 16;
  else if (item.placement.endsWith('right')) style.right = 16;
  else {
    style.left = '50%';
    style.transform = 'translateX(-50%)';
  }
  const icon =
    options.icon ??
    (type ? (
      <Glyph
        name={
          type === 'success' ? 'check' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'
        }
      />
    ) : undefined);
  const canClose = options.showClose ?? kind === 'notification';
  return (
    <div
      ref={(node) => {
        item.node = node;
        if (node) {
          layout();
          if (typeof ResizeObserver !== 'undefined' && !item.observer) {
            item.observer = new ResizeObserver(layout);
            item.observer.observe(node);
          }
        }
      }}
      role="alert"
      className={cx(
        ns,
        type && `${ns}--${type}`,
        options.plain && 'is-plain',
        canClose && 'is-closable',
        kind === 'notification' && item.placement.endsWith('right')
          ? 'right'
          : kind === 'notification'
            ? 'left'
            : '',
        options.customClass,
      )}
      style={style}
      onMouseEnter={() => {
        if (options.pauseOnHover ?? true) pause(item);
      }}
      onMouseLeave={() => {
        if (options.pauseOnHover ?? true) resume(item);
      }}
      onClick={options.onClick}
    >
      {icon !== undefined && (
        <Icon className={cx(`${ns}__icon`, type && `${ns}__icon--${type}`)}>{icon}</Icon>
      )}
      {kind === 'notification' ? (
        <div className={`${ns}__group`}>
          <h2 className={`${ns}__title`}>{options.title}</h2>
          <div className={`${ns}__content`}>{body}</div>
        </div>
      ) : (
        <p className={`${ns}__content`}>{body}</p>
      )}
      {kind === 'message' && (options.repeatNum ?? 1) > 1 && (
        <sup className={`${ns}__badge`}>{options.repeatNum}</sup>
      )}
      {canClose && (
        <button
          type="button"
          aria-label="Close message"
          className={`${ns}__closeBtn`}
          onClick={(event) => {
            event.stopPropagation();
            close(item);
          }}
        >
          {options.closeIcon ?? <Glyph name="close" />}
        </button>
      )}
      {kind === 'notification' && options.progress && (
        <div
          className={`${ns}__progress`}
          style={{
            position: 'absolute',
            height: 3,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              typeof options.progress === 'object' ? options.progress.color : 'var(--el-color-primary)',
          }}
        />
      )}
    </div>
  );
}

/** 服务在调用时才创建DOM；静态调用不猜测其他React树的上下文。 */
function createService(
  kind: 'message' | 'notification',
  input: MessageOptions | NotificationOptions | string,
  config: GlobalConfig = {},
): MessageInstance {
  if (typeof document === 'undefined') throw new Error('提示服务需要浏览器DOM');
  const options: MessageOptions & NotificationOptions =
    typeof input === 'string' ? { message: input } : { ...input };
  const append =
    typeof options.appendTo === 'string'
      ? document.querySelector<HTMLElement>(options.appendTo)
      : options.appendTo;
  const target = append ?? document.body;
  const placement = kind === 'message' ? (options.placement ?? 'top') : (options.position ?? 'top-right');
  if (kind === 'message' && options.grouping) {
    const previous = records.find(
      (item) =>
        !item.closed &&
        item.kind === kind &&
        item.placement === placement &&
        item.container.parentElement === target &&
        item.options.message === options.message,
    );
    if (previous) {
      previous.options.repeatNum = (previous.options.repeatNum ?? 1) + 1;
      previous.options.type = options.type ?? previous.options.type;
      previous.remaining = options.duration ?? 3000;
      previous.render();
      resume(previous);
      return previous.instance;
    }
  }
  const container = document.createElement('div');
  target.appendChild(container);
  const root = createRoot(container);
  const item: RecordItem = {
    id: ++nextId,
    kind,
    placement,
    container,
    root,
    node: null,
    options,
    config,
    closed: false,
    remaining: options.duration ?? (kind === 'message' ? 3000 : 4500),
    startedAt: Date.now(),
    instance: { close: () => close(item) },
    render: () =>
      root.render(
        <ConfigProvider {...config}>
          <ServiceContent item={item} />
        </ConfigProvider>,
      ),
  };
  records.push(item);
  item.render();
  resume(item);
  return item.instance;
}

/** 构造保留类型快捷方法的绑定服务。 */
function messageFactory(config: GlobalConfig = {}) {
  const service = (options: MessageOptions | string) => createService('message', options, config);
  return Object.assign(service, {
    primary: (options: MessageOptions | string) =>
      service(
        typeof options === 'string' ? { message: options, type: 'primary' } : { ...options, type: 'primary' },
      ),
    success: (options: MessageOptions | string) =>
      service(
        typeof options === 'string' ? { message: options, type: 'success' } : { ...options, type: 'success' },
      ),
    warning: (options: MessageOptions | string) =>
      service(
        typeof options === 'string' ? { message: options, type: 'warning' } : { ...options, type: 'warning' },
      ),
    info: (options: MessageOptions | string) =>
      service(
        typeof options === 'string' ? { message: options, type: 'info' } : { ...options, type: 'info' },
      ),
    error: (options: MessageOptions | string) =>
      service(
        typeof options === 'string' ? { message: options, type: 'error' } : { ...options, type: 'error' },
      ),
    closeAll: (type?: MessageType) =>
      records
        .filter((item) => item.kind === 'message' && (!type || item.options.type === type))
        .forEach(close),
  });
}
/** 静态消息服务；在Provider内应使用useMessage绑定当前配置。 */
export const Message = messageFactory();
export const message = Message;
/** 绑定当前Provider的namespace、语言与初始层级。 */
export function useMessage() {
  const config = useContext(ConfigContext);
  return useMemo(() => messageFactory(config), [config]);
}

/** 构造通知服务及语义类型快捷方法。 */
function notificationFactory(config: GlobalConfig = {}) {
  const service = (options: NotificationOptions) => createService('notification', options, config);
  const type = (name: MessageType) => (options: NotificationOptions) => service({ ...options, type: name });
  return Object.assign(service, {
    primary: type('primary'),
    success: type('success'),
    warning: type('warning'),
    info: type('info'),
    error: type('error'),
    closeAll: () => records.filter((item) => item.kind === 'notification').forEach(close),
  });
}
export const Notification = notificationFactory();
export const notification = Notification;
/** 通知绑定当前Provider配置，避免静态服务跨树读取上下文。 */
export function useNotification() {
  const config = useContext(ConfigContext);
  return useMemo(() => notificationFactory(config), [config]);
}
