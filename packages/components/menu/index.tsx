'use client';

import {
  Children,
  isValidElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { cx, useControllable, useNamespace } from '../../hooks';
import type { BaseProps } from '../../hooks';
import { Tooltip } from '../tooltip';

export interface MenuItemInfo {
  index: string;
  indexPath: string[];
  route?: string | Record<string, unknown>;
}
export interface MenuHandle {
  open: (index: string) => void;
  close: (index: string) => void;
  handleResize: () => void;
  updateActiveIndex: (index: string) => void;
}
export interface MenuProps extends BaseProps {
  mode?: 'horizontal' | 'vertical';
  collapse?: boolean;
  defaultActive?: string;
  activeIndex?: string;
  onActiveIndexChange?: (index: string) => void;
  defaultOpeneds?: string[];
  uniqueOpened?: boolean;
  menuTrigger?: 'hover' | 'click';
  collapseTransition?: boolean;
  closeOnClickOutside?: boolean;
  popperEffect?: 'dark' | 'light';
  popperOffset?: number;
  popperClass?: string;
  popperStyle?: CSSProperties;
  showTimeout?: number;
  hideTimeout?: number;
  persistent?: boolean;
  backgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  router?: boolean;
  navigate?: (route: string | Record<string, unknown>) => unknown;
  onSelect?: (index: string, indexPath: string[], item: MenuItemInfo, routerResult?: unknown) => void;
  onOpen?: (index: string, indexPath: string[]) => void;
  onClose?: (index: string, indexPath: string[]) => void;
  ref?: Ref<MenuHandle>;
}
interface MenuContextValue {
  props: MenuProps;
  active: string;
  opened: string[];
  register: (index: string, path: string[]) => () => void;
  open: (index: string) => void;
  close: (index: string) => void;
  select: (item: MenuItemInfo) => void;
}
const MenuContext = createContext<MenuContextValue | null>(null);
const MenuPathContext = createContext<string[]>([]);

/** 同级菜单采用方向键、Home/End导航，避免跳入尚未展开的后代。 */
function moveFocus(
  container: HTMLUListElement,
  event: React.KeyboardEvent<HTMLUListElement>,
  horizontal: boolean,
): void {
  const keys = horizontal ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
  if (![...keys, 'Home', 'End'].includes(event.key)) return;
  const items = Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) =>
      item.closest('ul[role="menu"], ul[role="menubar"]') === container &&
      item.getAttribute('aria-disabled') !== 'true',
  );
  const current = items.indexOf(document.activeElement as HTMLElement);
  if (current < 0 || !items.length) return;
  event.preventDefault();
  event.stopPropagation();
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (current + (event.key === keys[0] ? -1 : 1) + items.length) % items.length;
  items[next].focus();
}

/** 根菜单维护选中项及展开路径；路由跳转通过宿主 navigate 适配器执行。 */
export function Menu(props: MenuProps) {
  const {
    mode = 'vertical',
    collapse = false,
    defaultActive = '',
    activeIndex,
    onActiveIndexChange,
    defaultOpeneds = [],
    uniqueOpened = false,
    closeOnClickOutside = false,
    onSelect,
    onOpen,
    onClose,
    children,
    className,
    style,
    id,
    ref,
  } = props;
  const ns = useNamespace('menu');
  const root = useRef<HTMLUListElement>(null);
  const paths = useRef(new Map<string, string[]>());
  const [active, setActive] = useControllable(activeIndex, defaultActive, onActiveIndexChange);
  const [opened, setOpened] = useState(defaultOpeneds);
  const latest = useRef(opened);
  latest.current = opened;
  /** 注册嵌套路径，实例方法可以按索引定位子菜单。 */
  const register = useCallback((index: string, path: string[]): (() => void) => {
    paths.current.set(index, path);
    return () => {
      paths.current.delete(index);
    };
  }, []);
  /** 单展开模式保留祖先路径，关闭其它分支。 */
  function open(index: string): void {
    if (latest.current.includes(index)) return;
    const path = paths.current.get(index) ?? [index];
    const next = uniqueOpened ? [...path] : [...latest.current, index];
    latest.current = next;
    setOpened(next);
    onOpen?.(index, path);
  }
  /** 关闭指定子菜单及其已展开的后代。 */
  function close(index: string): void {
    if (!latest.current.includes(index)) return;
    const next = latest.current.filter((item) => item !== index && !paths.current.get(item)?.includes(index));
    latest.current = next;
    setOpened(next);
    onClose?.(index, paths.current.get(index) ?? [index]);
  }
  /** 激活项同时回传索引路径与路由适配结果。 */
  function select(item: MenuItemInfo): void {
    setActive(item.index);
    const route = item.route ?? item.index;
    const result = props.router ? props.navigate?.(route) : undefined;
    onSelect?.(item.index, item.indexPath, item, result);
    if (mode === 'horizontal' || collapse) {
      latest.current = [];
      setOpened([]);
    }
  }
  /** 重新触发容器测量，让宿主布局监听器响应菜单宽度变化。 */
  function handleResize(): void {
    root.current?.dispatchEvent(new Event('resize'));
  }
  useImperativeHandle(ref, () => ({ open, close, handleResize, updateActiveIndex: setActive }));
  useEffect(() => {
    if (!closeOnClickOutside) return;
    /** 根菜单与所属传送浮层均视为菜单内部。 */
    function outside(event: PointerEvent): void {
      if (
        !(event.target instanceof Element) ||
        root.current?.contains(event.target) ||
        event.target.closest(`[data-menu-owner="${owner}"]`)
      )
        return;
      for (const index of [...latest.current]) close(index);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
    // 展开集合通过ref读取，避免监听器被每次菜单展开重复安装。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeOnClickOutside]);
  const owner = useId().replaceAll(':', '');
  const vars: CSSProperties = {
    ...style,
    ...Object.fromEntries(
      [
        ['bg-color', props.backgroundColor],
        ['text-color', props.textColor],
        ['active-color', props.activeTextColor],
      ]
        .filter((entry) => entry[1])
        .map(([key, value]) => [`--${ns.namespace}-menu-${key}`, value]),
    ),
  };
  return (
    <MenuOwnerContext.Provider value={owner}>
      <MenuContext.Provider value={{ props, active, opened, register, open, close, select }}>
        <MenuPathContext.Provider value={[]}>
          <ul
            ref={root}
            id={id}
            role={mode === 'horizontal' ? 'menubar' : 'menu'}
            className={cx(
              ns.b,
              ns.m(mode),
              collapse && mode === 'vertical' && ns.m('collapse'),
              props.collapseTransition !== false && `${ns.namespace}-menu--collapse-transition`,
              className,
            )}
            style={vars}
            onKeyDown={(event) => moveFocus(event.currentTarget, event, mode === 'horizontal')}
          >
            {children}
          </ul>
        </MenuPathContext.Provider>
      </MenuContext.Provider>
    </MenuOwnerContext.Provider>
  );
}
const MenuOwnerContext = createContext('');
/** 从声明式后代查找活动项，不对菜单索引的字符串格式做假设。 */
function containsIndex(children: ReactNode, active: string): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement<{ index?: string; children?: ReactNode }>(child) &&
      (child.props.index === active || containsIndex(child.props.children, active)),
  );
}
export interface MenuItemProps extends BaseProps {
  index: string;
  route?: MenuItemInfo['route'];
  disabled?: boolean;
  renderTitle?: ReactNode;
  onClick?: (item: MenuItemInfo & { active: boolean }) => void;
}

/** 菜单项点击及键盘激活共用路径；禁用项不接收焦点与通知。 */
export function MenuItem({
  index,
  route,
  disabled = false,
  children,
  renderTitle,
  onClick,
  className,
  ...base
}: MenuItemProps) {
  const ns = useNamespace('menu-item');
  const context = useContext(MenuContext);
  const path = useContext(MenuPathContext);
  const active = context?.active === index;
  /** 将当前项注册信息提交给根菜单。 */
  function activate(): void {
    if (disabled) return;
    const item = { index, indexPath: [...path, index], route };
    onClick?.({ ...item, active });
    context?.select(item);
  }
  return (
    <li
      {...base}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={cx(ns.b, active && 'is-active', disabled && 'is-disabled', className)}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      }}
    >
      {typeof children === 'string' || typeof children === 'number' ? <span>{children}</span> : children}
      {renderTitle && <span>{renderTitle}</span>}
    </li>
  );
}

export interface SubMenuProps extends BaseProps {
  index: string;
  renderTitle?: ReactNode;
  disabled?: boolean;
  popperClass?: string;
  popperStyle?: CSSProperties;
  popperOffset?: number;
  showTimeout?: number;
  hideTimeout?: number;
  teleported?: boolean;
  expandCloseIcon?: ReactNode;
  expandOpenIcon?: ReactNode;
  collapseCloseIcon?: ReactNode;
  collapseOpenIcon?: ReactNode;
}

/** 嵌套菜单在纵向展开内联内容，横向或折叠状态使用共享浮层。 */
export function SubMenu({
  index,
  renderTitle,
  disabled = false,
  popperClass,
  popperStyle,
  popperOffset,
  showTimeout,
  hideTimeout,
  teleported,
  expandCloseIcon,
  expandOpenIcon,
  collapseCloseIcon,
  collapseOpenIcon,
  children,
  className,
  ...base
}: SubMenuProps) {
  const ns = useNamespace('sub-menu');
  const menuNs = useNamespace('menu');
  const context = useContext(MenuContext);
  const path = useContext(MenuPathContext);
  const owner = useContext(MenuOwnerContext);
  const pathKey = [...path, index].join('\0');
  const title = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const keyboard = useRef(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const open = context?.opened.includes(index) ?? false;
  useEffect(() => {
    if (open && keyboard.current)
      list.current?.querySelector<HTMLElement>('[role=menuitem]:not([aria-disabled=true])')?.focus();
  }, [open]);
  const popup = context?.props.mode === 'horizontal' || context?.props.collapse;
  const active = containsIndex(children, context?.active ?? '');
  const register = context?.register;
  useEffect(() => register?.(index, pathKey.split('\0')), [register, index, pathKey]);
  /** 禁用子菜单不发出展开请求。 */
  function toggle(next: boolean): void {
    if (!disabled) {
      if (next) context?.open(index);
      else context?.close(index);
    }
  }
  /** 悬停延时跨触发器与Portal浮层共享，防止经过间隙时闪烁。 */
  function schedule(next: boolean): void {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(
      () => toggle(next),
      next
        ? (showTimeout ?? context?.props.showTimeout ?? 300)
        : (hideTimeout ?? context?.props.hideTimeout ?? 300),
    );
  }
  const body = (
    <MenuPathContext.Provider value={[...path, index]}>
      <ul
        ref={list}
        role="menu"
        data-menu-owner={owner}
        onMouseEnter={() => clearTimeout(hoverTimer.current)}
        onMouseLeave={() => {
          if (popup && context?.props.menuTrigger !== 'click') schedule(false);
        }}
        className={cx(menuNs.b, popup && menuNs.m('popup'))}
        onKeyDown={(event) => {
          if (event.key === 'Escape' || event.key === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
            toggle(false);
            title.current?.focus();
          } else moveFocus(event.currentTarget, event, false);
        }}
      >
        {children}
      </ul>
    </MenuPathContext.Provider>
  );
  const icons = context?.props.collapse
    ? [collapseCloseIcon, collapseOpenIcon]
    : [expandCloseIcon, expandOpenIcon];
  const label = (
    <div
      ref={title}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-disabled={disabled}
      className={ns.e('title')}
      onClick={() => {
        if (!popup || context?.props.menuTrigger === 'click') toggle(!open);
      }}
      onKeyDown={(event) => {
        if (['Enter', ' ', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          event.stopPropagation();
          keyboard.current = true;
          toggle(true);
        }
      }}
    >
      {typeof renderTitle === 'string' ? <span>{renderTitle}</span> : renderTitle}
      <span className={ns.e('icon-arrow')}>{icons[0] && icons[1] ? icons[open ? 1 : 0] : '⌄'}</span>
    </div>
  );
  return (
    <li
      {...base}
      role="none"
      onMouseEnter={() => {
        if (popup && context?.props.menuTrigger !== 'click') schedule(true);
      }}
      onMouseLeave={() => {
        if (popup && context?.props.menuTrigger !== 'click') schedule(false);
      }}
      className={cx(ns.b, open && 'is-opened', disabled && 'is-disabled', active && 'is-active', className)}
    >
      {popup ? (
        <Tooltip
          visible={open}
          disabled={disabled}
          trigger={context?.props.menuTrigger === 'click' ? 'click' : 'hover'}
          placement={
            path.length
              ? 'right-start'
              : context?.props.mode === 'horizontal'
                ? 'bottom-start'
                : 'right-start'
          }
          effect={context?.props.popperEffect ?? 'dark'}
          offset={popperOffset ?? context?.props.popperOffset ?? 6}
          showAfter={showTimeout ?? context?.props.showTimeout ?? 300}
          hideAfter={hideTimeout ?? context?.props.hideTimeout ?? 300}
          popperClass={cx(menuNs.m('popup-container'), context?.props.popperClass, popperClass)}
          popperStyle={{ ...context?.props.popperStyle, ...popperStyle }}
          teleported={teleported ?? path.length === 0}
          persistent={context?.props.persistent ?? true}
          focusOnTarget={false}
          onVisibleChange={toggle}
          renderContent={body}
        >
          {label}
        </Tooltip>
      ) : (
        <>
          {label}
          {open && body}
        </>
      )}
    </li>
  );
}

export interface MenuItemGroupProps extends BaseProps {
  title?: string;
  renderTitle?: ReactNode;
}
/** 组标题与子项保持来源的菜单分组结构。 */
export function MenuItemGroup({ title, renderTitle, children, className, ...base }: MenuItemGroupProps) {
  const ns = useNamespace('menu-item-group');
  return (
    <li {...base} role="group" className={cx(ns.b, className)}>
      <div className={ns.e('title')}>{renderTitle ?? title}</div>
      <ul role="presentation">{children}</ul>
    </li>
  );
}
