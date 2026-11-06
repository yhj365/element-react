'use client';
import { Children, createContext, isValidElement, useContext } from 'react';
import { cx, useNamespace } from '../../hooks';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import type { BaseProps, ComponentSize } from '../../hooks';

const RowContext = createContext(0);
export interface RowProps extends BaseProps {
  tag?: ElementType;
  gutter?: number;
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  align?: 'top' | 'middle' | 'bottom';
}
/** 24栅格行向列提供gutter，同时使用负边距抵消列两侧padding。 */
export function Row({
  tag: Tag = 'div',
  gutter = 0,
  justify = 'start',
  align,
  className,
  style,
  children,
  ...rest
}: RowProps) {
  const ns = useNamespace('row');
  return (
    <RowContext value={gutter}>
      <Tag
        {...rest}
        className={cx(
          ns.b,
          justify !== 'start' && ns.is(`justify-${justify}`),
          align && ns.is(`align-${align}`),
          className,
        )}
        style={{ ...(gutter ? { marginLeft: -gutter / 2, marginRight: -gutter / 2 } : {}), ...style }}
      >
        {children}
      </Tag>
    </RowContext>
  );
}
type ColSize = number | { span?: number; offset?: number; pull?: number; push?: number };
export interface ColProps extends BaseProps {
  tag?: ElementType;
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
  xs?: ColSize;
  sm?: ColSize;
  md?: ColSize;
  lg?: ColSize;
  xl?: ColSize;
}
/** 列的响应式配置直接映射到来源主题的断点类名。 */
export function Col({
  tag: Tag = 'div',
  span = 24,
  offset = 0,
  pull = 0,
  push = 0,
  xs,
  sm,
  md,
  lg,
  xl,
  className,
  style,
  children,
  ...rest
}: ColProps) {
  const ns = useNamespace('col');
  const gutter = useContext(RowContext);
  const classes = [
    ns.b,
    `${ns.b}-${span}`,
    offset > 0 && `${ns.b}-offset-${offset}`,
    pull > 0 && `${ns.b}-pull-${pull}`,
    push > 0 && `${ns.b}-push-${push}`,
  ];
  for (const [breakpoint, value] of Object.entries({ xs, sm, md, lg, xl })) {
    if (typeof value === 'number') classes.push(`${ns.b}-${breakpoint}-${value}`);
    else if (value)
      for (const [key, amount] of Object.entries(value))
        classes.push(`${ns.b}-${breakpoint}-${key === 'span' ? '' : `${key}-`}${amount}`);
  }
  return (
    <Tag
      {...rest}
      className={cx(...classes, ns.is('guttered', gutter !== 0), className)}
      style={{ ...(gutter ? { paddingLeft: gutter / 2, paddingRight: gutter / 2 } : {}), ...style }}
    >
      {children}
    </Tag>
  );
}

export interface ContainerProps extends BaseProps {
  direction?: 'horizontal' | 'vertical';
}
/** 直接包含Header/Footer时推断纵向排列；显式direction优先。 */
export function Container({ direction, className, children, ...rest }: ContainerProps) {
  const ns = useNamespace('container');
  const vertical =
    direction === 'vertical' ||
    (!direction &&
      Children.toArray(children).some(
        (child) => isValidElement(child) && (child.type === Header || child.type === Footer),
      ));
  return (
    <section {...rest} className={cx(ns.b, ns.is('vertical', vertical), className)}>
      {children}
    </section>
  );
}
export interface HeaderProps extends BaseProps {
  height?: string;
}
/** 顶部布局区域通过主题变量控制高度。 */
export function Header({ height, className, style, ...rest }: HeaderProps) {
  const ns = useNamespace('header');
  return (
    <header
      {...rest}
      className={cx(ns.b, className)}
      style={{ '--el-header-height': height, ...style } as CSSProperties}
    />
  );
}
/** 底部布局区域通过主题变量控制高度。 */
export function Footer({ height, className, style, ...rest }: HeaderProps) {
  const ns = useNamespace('footer');
  return (
    <footer
      {...rest}
      className={cx(ns.b, className)}
      style={{ '--el-footer-height': height, ...style } as CSSProperties}
    />
  );
}
export interface AsideProps extends BaseProps {
  width?: string;
}
/** 侧栏的宽度与来源CSS变量对应。 */
export function Aside({ width, className, style, ...rest }: AsideProps) {
  const ns = useNamespace('aside');
  return (
    <aside
      {...rest}
      className={cx(ns.b, className)}
      style={{ '--el-aside-width': width, ...style } as CSSProperties}
    />
  );
}
/** 内容区保留main语义和默认overflow行为。 */
export function Main({ className, ...rest }: BaseProps) {
  const ns = useNamespace('main');
  return <main {...rest} className={cx(ns.b, className)} />;
}

export interface SpaceProps extends BaseProps {
  direction?: 'horizontal' | 'vertical';
  size?: ComponentSize | number | [number, number];
  wrap?: boolean;
  alignment?: CSSProperties['alignItems'];
  fill?: boolean;
  fillRatio?: number;
  spacer?: ReactNode;
}
/** 用独立item容器保持分隔符与填充比例，尺寸对齐来源small/default/large。 */
export function Space({
  direction = 'horizontal',
  size = 'small',
  wrap = false,
  alignment = 'center',
  fill = false,
  fillRatio = 100,
  spacer,
  className,
  style,
  children,
  ...rest
}: SpaceProps) {
  const ns = useNamespace('space');
  const amount = typeof size === 'string' ? { small: 8, default: 12, large: 16 }[size] : size;
  const [horizontal, vertical] = Array.isArray(amount)
    ? amount
    : direction === 'horizontal'
      ? [amount, wrap || fill ? amount : 0]
      : [0, amount];
  const items = Children.toArray(children);
  return (
    <div
      {...rest}
      className={cx(ns.b, ns.m(direction), className)}
      style={{
        alignItems: alignment,
        flexWrap: wrap || fill ? 'wrap' : 'nowrap',
        gap: `${vertical}px ${horizontal}px`,
        ...style,
      }}
    >
      {items.flatMap((child, index) => [
        index > 0 && spacer !== undefined ? (
          <div key={`separator-${index}`} className={ns.e('item')}>
            {spacer}
          </div>
        ) : null,
        <div
          key={isValidElement(child) && child.key !== null ? child.key : index}
          className={ns.e('item')}
          style={fill ? { flexGrow: 1, minWidth: `${fillRatio}%` } : undefined}
        >
          {child}
        </div>,
      ])}
    </div>
  );
}
