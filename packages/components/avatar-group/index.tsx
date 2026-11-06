'use client';
import { Children, Fragment, isValidElement } from 'react';
import { cx, useNamespace } from '../../hooks';
import { Avatar } from '../presentation';
import { Tooltip } from '../tooltip';
import { AvatarGroupContext } from './context';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { CSSProperties, ReactNode } from 'react';
import type { Placement } from '@floating-ui/dom';
export interface AvatarGroupProps extends BaseProps {
  size?: number | ComponentSize;
  shape?: 'circle' | 'square';
  collapseAvatars?: boolean;
  collapseAvatarsTooltip?: boolean;
  maxCollapseAvatars?: number;
  effect?: 'dark' | 'light';
  placement?: Placement;
  popperClass?: string;
  popperStyle?: CSSProperties;
  collapseClass?: string;
  collapseStyle?: CSSProperties;
}
/** Fragment透明展开，不为头像添加额外布局节点。 */
function flatten(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement(child) && child.type === Fragment
      ? flatten((child.props as { children?: ReactNode }).children)
      : [child],
  );
}
/** 头像组提供尺寸与形状默认值，单个头像可覆盖，并可将溢出头像置入提示层。 */
export function AvatarGroup({
  size,
  shape,
  collapseAvatars = false,
  collapseAvatarsTooltip = false,
  maxCollapseAvatars = 1,
  effect = 'light',
  placement = 'top',
  popperClass,
  popperStyle,
  collapseClass,
  collapseStyle,
  children,
  className,
  style,
  ...rest
}: AvatarGroupProps) {
  const ns = useNamespace('avatar-group'),
    avatars = flatten(children),
    limit = Math.max(0, maxCollapseAvatars);
  const collapsed = collapseAvatars && avatars.length > limit;
  return (
    <AvatarGroupContext value={{ size, shape }}>
      <div {...rest} className={cx(ns.b, className)} style={style}>
        {collapsed ? avatars.slice(0, limit) : avatars}
        {collapsed && (
          <Tooltip
            disabled={!collapseAvatarsTooltip}
            effect={effect}
            placement={placement}
            popperClass={popperClass}
            popperStyle={popperStyle}
            renderContent={<div className={ns.e('collapse-avatars')}>{avatars.slice(limit)}</div>}
          >
            <Avatar
              className={collapseClass}
              style={{
                marginLeft: limit ? `var(--${ns.namespace}-avatar-group-item-gap)` : undefined,
                ...collapseStyle,
              }}
            >
              + {avatars.length - limit}
            </Avatar>
          </Tooltip>
        )}
      </div>
    </AvatarGroupContext>
  );
}
