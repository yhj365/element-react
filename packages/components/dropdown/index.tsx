'use client';

import { createContext, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';
import type { Placement } from '@floating-ui/dom';
import { cx, useDisabled, useNamespace, useSize } from '../../hooks';
import type { BaseProps, ComponentSize } from '../../hooks';
import { Button, ButtonGroup } from '../button';
import type { ButtonProps } from '../button';
import { Tooltip } from '../tooltip';
import type { TooltipHandle, TooltipProps } from '../tooltip';

export interface DropdownHandle {
  handleOpen: () => void;
  handleClose: () => void;
}
export interface DropdownProps extends BaseProps {
  type?: ButtonProps['type'];
  size?: ComponentSize;
  buttonProps?: ButtonProps;
  maxHeight?: number | string;
  splitButton?: boolean;
  disabled?: boolean;
  placement?: Placement;
  effect?: 'dark' | 'light';
  trigger?: TooltipProps['trigger'];
  triggerKeys?: string[];
  virtualTriggering?: boolean;
  virtualRef?: HTMLElement;
  hideOnClick?: boolean;
  showArrow?: boolean;
  showTimeout?: number;
  hideTimeout?: number;
  role?: string;
  tabIndex?: number;
  popperClass?: string;
  popperStyle?: CSSProperties;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  persistent?: boolean;
  renderDropdown?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onCommand?: (command: unknown) => void;
  onVisibleChange?: (visible: boolean) => void;
  ref?: Ref<DropdownHandle>;
}
interface DropdownContextValue {
  disabled: boolean;
  role: string;
  size?: ComponentSize;
  maxHeight?: number | string;
  command: (value: unknown) => void;
  close: () => void;
}
const DropdownContext = createContext<DropdownContextValue>({
  disabled: false,
  role: 'menu',
  command: () => {},
  close: () => {},
});

/** 下拉菜单复用共享浮层的延时、定位、外部点击和卸载清理。 */
export function Dropdown({
  type,
  size,
  buttonProps,
  maxHeight,
  splitButton = false,
  disabled: disabledProp,
  placement = 'bottom',
  effect = 'light',
  trigger = 'hover',
  triggerKeys = ['Enter', ' ', 'ArrowDown', 'NumpadEnter'],
  virtualTriggering,
  virtualRef,
  hideOnClick = true,
  showArrow = true,
  showTimeout = 150,
  hideTimeout = 150,
  role = 'menu',
  tabIndex = 0,
  popperClass,
  popperStyle,
  teleported = true,
  appendTo,
  persistent = true,
  renderDropdown,
  onClick,
  onCommand,
  onVisibleChange,
  ref,
  children,
  className,
  ...base
}: DropdownProps) {
  const ns = useNamespace('dropdown');
  const disabled = useDisabled(disabledProp);
  const resolvedSize = useSize(size);
  const tooltip = useRef<TooltipHandle>(null);
  const root = useRef<HTMLDivElement>(null);
  const keyboard = useRef(false);
  const [open, setOpen] = useState(false);
  /** 手动关闭后将键盘焦点交还触发器。 */
  function close(): void {
    tooltip.current?.onClose();
    if (keyboard.current) root.current?.querySelector<HTMLElement>('[data-dropdown-trigger]')?.focus();
  }
  /** 打开入口同时保护禁用状态。 */
  function show(): void {
    if (!disabled) tooltip.current?.onOpen();
  }
  useImperativeHandle(ref, () => ({ handleOpen: show, handleClose: close }));
  useEffect(() => {
    if (!virtualTriggering || !virtualRef || disabled) return;
    const modes = Array.isArray(trigger) ? trigger : [trigger];
    /** 外部触发节点与普通触发器使用相同的显隐入口。 */
    function enter(): void {
      if (modes.includes('hover')) tooltip.current?.onOpen();
    }
    /** 浮层自身继续使用共享hover延时，使鼠标可进入菜单。 */
    function leave(): void {
      if (modes.includes('hover')) tooltip.current?.onClose();
    }
    /** 点击触发可重复切换外部浮层。 */
    function click(): void {
      if (modes.includes('click')) {
        if (open) tooltip.current?.onClose();
        else tooltip.current?.onOpen();
      }
    }
    /** 虚拟右键菜单阻止系统菜单并展开命令。 */
    function context(event: globalThis.MouseEvent): void {
      if (modes.includes('contextmenu')) {
        event.preventDefault();
        tooltip.current?.onOpen();
      }
    }
    virtualRef.addEventListener('mouseenter', enter);
    virtualRef.addEventListener('mouseleave', leave);
    virtualRef.addEventListener('click', click);
    virtualRef.addEventListener('contextmenu', context);
    return () => {
      virtualRef.removeEventListener('mouseenter', enter);
      virtualRef.removeEventListener('mouseleave', leave);
      virtualRef.removeEventListener('click', click);
      virtualRef.removeEventListener('contextmenu', context);
    };
  }, [virtualTriggering, virtualRef, trigger, disabled, open]);
  const content = (
    <Tooltip
      ref={tooltip}
      placement={placement}
      effect={effect}
      trigger={trigger}
      triggerKeys={triggerKeys}
      disabled={disabled}
      virtualTriggering={virtualTriggering}
      virtualRef={virtualRef}
      showArrow={showArrow}
      showAfter={(Array.isArray(trigger) ? trigger.includes('hover') : trigger === 'hover') ? showTimeout : 0}
      hideAfter={(Array.isArray(trigger) ? trigger.includes('hover') : trigger === 'hover') ? hideTimeout : 0}
      popperClass={cx(ns.e('popper'), popperClass)}
      popperStyle={popperStyle}
      teleported={teleported}
      appendTo={appendTo}
      persistent={persistent}
      focusOnTarget={false}
      onVisibleChange={(visible) => {
        setOpen(visible);
        onVisibleChange?.(visible);
      }}
      onShow={() => {
        if (keyboard.current)
          tooltip.current?.popperRef
            ?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')
            ?.focus();
      }}
      renderContent={renderDropdown}
    >
      <span
        data-dropdown-trigger=""
        tabIndex={disabled ? -1 : tabIndex}
        role={splitButton ? undefined : 'button'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-disabled={disabled}
        onKeyDown={(event) => {
          if (triggerKeys.includes(event.key) || triggerKeys.includes(event.code)) keyboard.current = true;
        }}
      >
        {splitButton ? (
          <Button
            {...buttonProps}
            size={resolvedSize}
            type={type}
            disabled={disabled}
            aria-label="Open dropdown"
          >
            ⌄
          </Button>
        ) : (
          children
        )}
      </span>
    </Tooltip>
  );
  return (
    <DropdownContext.Provider
      value={{
        disabled,
        role,
        size: resolvedSize,
        maxHeight,
        command: (value) => {
          if (disabled) return;
          onCommand?.(value);
          if (hideOnClick) close();
        },
        close,
      }}
    >
      <div
        {...base}
        ref={root}
        className={cx(ns.b, ns.m(resolvedSize), disabled && 'is-disabled', className)}
        onPointerDown={() => {
          keyboard.current = false;
        }}
      >
        {splitButton ? (
          <ButtonGroup size={resolvedSize} type={type}>
            <Button {...buttonProps} disabled={disabled} onClick={onClick}>
              {children}
            </Button>
            {content}
          </ButtonGroup>
        ) : (
          content
        )}
      </div>
    </DropdownContext.Provider>
  );
}

/** 菜单方向键跳过禁用项，Home/End定位首尾，Escape回到触发器。 */
export function DropdownMenu({ children, className, style, ...base }: BaseProps) {
  const ns = useNamespace('dropdown-menu');
  const context = useContext(DropdownContext);
  return (
    <ul
      {...base}
      role={context.role}
      className={cx(ns.b, ns.m(context.size), className)}
      style={{ ...style, maxHeight: context.maxHeight, overflowY: context.maxHeight ? 'auto' : undefined }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' || event.key === 'Tab') {
          context.close();
          return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'),
        );
        if (!items.length) return;
        const current = items.indexOf(document.activeElement as HTMLElement);
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next].focus();
      }}
    >
      {children}
    </ul>
  );
}

export interface DropdownItemProps extends BaseProps {
  command?: unknown;
  disabled?: boolean;
  divided?: boolean;
  icon?: ReactNode;
  renderIcon?: ReactNode;
}
/** 命令项只在启用时提交；点击和键盘激活共享相同路径。 */
export function DropdownItem({
  children,
  command,
  disabled = false,
  divided = false,
  icon,
  renderIcon,
  className,
  ...base
}: DropdownItemProps) {
  const ns = useNamespace('dropdown-menu');
  const context = useContext(DropdownContext);
  const blocked = disabled || context.disabled;
  return (
    <li
      {...base}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={blocked}
      className={cx(ns.e('item'), divided && ns.e('item--divided'), blocked && 'is-disabled', className)}
      onClick={() => {
        if (!blocked) context.command(command);
      }}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !blocked) {
          event.preventDefault();
          context.command(command);
        }
      }}
    >
      {renderIcon ?? icon}
      {children}
    </li>
  );
}
