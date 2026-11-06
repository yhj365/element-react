'use client';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cx, useControllable, useNamespace } from '../../hooks';
import { Glyph, Icon } from '../icon';
import type { BaseProps } from '../../hooks';
import type { ReactElement, ReactNode, Ref } from 'react';

type Name = string | number;
const CollapseContext = createContext<{ values: Name[]; toggle: (name: Name) => void }>({
  values: [],
  toggle: () => undefined,
});
export interface CollapseProps extends BaseProps {
  value?: Name | Name[];
  defaultValue?: Name | Name[];
  accordion?: boolean;
  onValueChange?: (value: Name | Name[]) => void;
  onChange?: (value: Name | Name[]) => void;
}
/** 多项和手风琴两种模型均保留来源的值形状。 */
export function Collapse({
  value,
  defaultValue = [],
  accordion = false,
  onValueChange,
  onChange,
  className,
  children,
  ...rest
}: CollapseProps) {
  const ns = useNamespace('collapse');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const values = Array.isArray(current) ? current : current === '' ? [] : [current];
  /** 手风琴再次点击活动项时返回空字符串。 */
  function toggle(name: Name): void {
    const next = accordion
      ? values.includes(name)
        ? ''
        : name
      : values.includes(name)
        ? values.filter((item) => item !== name)
        : [...values, name];
    setCurrent(next);
    onChange?.(next);
  }
  return (
    <CollapseContext value={{ values, toggle }}>
      <div {...rest} className={cx(ns.b, className)}>
        {children}
      </div>
    </CollapseContext>
  );
}
export interface CollapseItemProps extends BaseProps {
  name?: Name;
  title?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  renderTitle?: (isActive: boolean) => ReactNode;
  renderIcon?: (isActive: boolean) => ReactNode;
  ref?: Ref<{ readonly isActive: boolean }>;
}
/** 折叠项提供键盘激活及标题与内容的无障碍关联。 */
export function CollapseItem({
  name,
  title = '',
  disabled,
  icon,
  renderTitle,
  renderIcon,
  ref,
  className,
  children,
  ...rest
}: CollapseItemProps) {
  const ns = useNamespace('collapse-item');
  const context = useContext(CollapseContext);
  const generated = useId();
  const key = name ?? generated;
  const active = context.values.includes(key);
  useImperativeHandle(ref, () => ({ isActive: active }), [active]);
  return (
    <div {...rest} className={cx(ns.b, ns.is('active', active), ns.is('disabled', disabled), className)}>
      <div
        role="button"
        id={`${generated}-head`}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-expanded={active}
        aria-controls={`${generated}-content`}
        className={cx(ns.e('header'), ns.is('active', active))}
        onClick={() => {
          if (!disabled) context.toggle(key);
        }}
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            context.toggle(key);
          }
        }}
      >
        <span className={ns.e('title')}>{renderTitle ? renderTitle(active) : title}</span>
        {renderIcon ? (
          renderIcon(active)
        ) : (
          <Icon className={cx(ns.e('arrow'), ns.is('active', active))}>{icon ?? <Glyph name="arrow" />}</Icon>
        )}
      </div>
      <div
        id={`${generated}-content`}
        role="region"
        hidden={!active}
        aria-labelledby={`${generated}-head`}
        className={ns.e('wrap')}
      >
        <div className={ns.e('content')}>{children}</div>
      </div>
    </div>
  );
}

export interface BreadcrumbProps extends BaseProps {
  separator?: string;
  separatorIcon?: ReactNode;
}
const BreadcrumbContext = createContext<{ separator: ReactNode }>({ separator: '/' });
/** 导航路径的分隔符由父级提供，图标优先于字符串。 */
export function Breadcrumb({
  separator = '/',
  separatorIcon,
  className,
  children,
  ...rest
}: BreadcrumbProps) {
  const ns = useNamespace('breadcrumb');
  return (
    <BreadcrumbContext value={{ separator: separatorIcon ?? separator }}>
      <nav {...rest} aria-label="Breadcrumb" className={cx(ns.b, className)}>
        {children}
      </nav>
    </BreadcrumbContext>
  );
}
export interface BreadcrumbItemProps extends BaseProps {
  to?: string;
  replace?: boolean;
  onNavigate?: (to: string, replace: boolean) => void;
}
/** to为普通URL；可由宿主注入路由跳转，不依赖Vue Router。 */
export function BreadcrumbItem({
  to,
  replace = false,
  onNavigate,
  className,
  children,
  ...rest
}: BreadcrumbItemProps) {
  const ns = useNamespace('breadcrumb');
  const context = useContext(BreadcrumbContext);
  return (
    <span {...rest} className={cx(`${ns.b}__item`, className)}>
      {to ? (
        <a
          href={to}
          className={cx(ns.e('inner'), 'is-link')}
          onClick={(event) => {
            if (onNavigate && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
              event.preventDefault();
              onNavigate(to, replace);
            }
          }}
        >
          {children}
        </a>
      ) : (
        <span className={ns.e('inner')}>{children}</span>
      )}
      <span className={ns.e('separator')} aria-hidden="true">
        {context.separator}
      </span>
    </span>
  );
}

export interface TimelineProps extends BaseProps {
  reverse?: boolean;
}
/** 时间轴按传入顺序展示，可显式反转而不修改children。 */
export function Timeline({ reverse = false, className, children, ...rest }: TimelineProps) {
  const ns = useNamespace('timeline');
  const items = Children.toArray(children);
  return (
    <ul {...rest} className={cx(ns.b, className)}>
      {reverse ? items.reverse() : items}
    </ul>
  );
}
export interface TimelineItemProps extends BaseProps {
  timestamp?: string;
  hideTimestamp?: boolean;
  center?: boolean;
  placement?: 'top' | 'bottom';
  type?: '' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  color?: string;
  size?: 'normal' | 'large';
  icon?: ReactNode;
  hollow?: boolean;
  renderDot?: ReactNode;
}
/** 时间点的节点、时间戳和内容布局与来源类名一致。 */
export function TimelineItem({
  timestamp = '',
  hideTimestamp = false,
  center,
  placement = 'bottom',
  type = '',
  color,
  size = 'normal',
  icon,
  hollow,
  renderDot,
  className,
  children,
  ...rest
}: TimelineItemProps) {
  const ns = useNamespace('timeline-item');
  const stamp = !hideTimestamp && <div className={cx(ns.e('timestamp'), ns.is(placement))}>{timestamp}</div>;
  return (
    <li {...rest} className={cx(ns.b, center && `${ns.b}__center`, className)}>
      <div className={ns.e('tail')} />
      {renderDot !== undefined ? (
        <div className={ns.e('dot')}>{renderDot}</div>
      ) : (
        <div
          className={cx(
            ns.e('node'),
            `${ns.e('node')}--${size}`,
            type && `${ns.e('node')}--${type}`,
            ns.is('hollow', hollow),
          )}
          style={{ backgroundColor: color }}
        >
          {icon !== undefined && <Icon className={ns.e('icon')}>{icon}</Icon>}
        </div>
      )}
      <div className={ns.e('wrapper')}>
        {placement === 'top' && stamp}
        <div className={ns.e('content')}>{children}</div>
        {placement === 'bottom' && stamp}
      </div>
    </li>
  );
}

export interface TabPaneProps extends BaseProps {
  name?: Name;
  label?: ReactNode;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
  renderLabel?: ReactNode;
}
interface PaneContext {
  active: Name;
  prefix: string;
}
const TabsContext = createContext<PaneContext>({ active: '0', prefix: '' });
/** 面板首次激活后保留挂载，lazy不等同离开销毁。 */
export function TabPane({ name = '0', lazy, className, children, ..._rest }: TabPaneProps) {
  const ns = useNamespace('tab-pane');
  const context = useContext(TabsContext);
  const active = context.active === name;
  const [loaded, setLoaded] = useState(active);
  if (active && !loaded) setLoaded(true);
  if (lazy && !loaded && !active) return null;
  return (
    <div
      role="tabpanel"
      id={`${context.prefix}-pane-${name}`}
      aria-labelledby={`${context.prefix}-tab-${name}`}
      hidden={!active}
      className={cx(ns.b, className)}
    >
      {children}
    </div>
  );
}
export interface TabsProps extends BaseProps {
  value?: Name;
  defaultValue?: Name;
  type?: '' | 'card' | 'border-card';
  closable?: boolean;
  addable?: boolean;
  editable?: boolean;
  tabPosition?: 'top' | 'bottom' | 'left' | 'right';
  stretch?: boolean;
  beforeLeave?: (next: Name, old: Name) => boolean | void | Promise<boolean | void>;
  onValueChange?: (name: Name) => void;
  onTabChange?: (name: Name) => void;
  onTabClick?: (name: Name, event: React.MouseEvent | React.KeyboardEvent) => void;
  onTabRemove?: (name: Name) => void;
  onTabAdd?: () => void;
  onEdit?: (name: Name | undefined, action: 'add' | 'remove') => void;
}
/** 标签页切换在beforeLeave通过后提交，较旧的异步结果不能覆盖新选择。 */
export function Tabs({
  value,
  defaultValue,
  type = '',
  closable = false,
  addable,
  editable,
  tabPosition = 'top',
  stretch = false,
  beforeLeave,
  onValueChange,
  onTabChange,
  onTabClick,
  onTabRemove,
  onTabAdd,
  onEdit,
  className,
  children,
  ...rest
}: TabsProps) {
  const ns = useNamespace('tabs');
  const prefix = useId();
  const panes = Children.toArray(children).filter(
    (child): child is ReactElement<TabPaneProps> =>
      isValidElement<TabPaneProps>(child) && child.type === TabPane,
  );
  const names = panes.map((pane, index) => pane.props.name ?? String(index));
  const [active, setActive] = useControllable(value, defaultValue ?? names[0] ?? '0', onValueChange);
  const sequence = useRef(0);
  useEffect(
    () => () => {
      sequence.current++;
    },
    [],
  );
  /** 只提交最新的异步切换请求。 */
  async function select(name: Name): Promise<void> {
    if (active === name) return;
    const request = ++sequence.current;
    const allowed = await beforeLeave?.(name, active);
    if (allowed === false || request !== sequence.current) return;
    setActive(name);
    onTabChange?.(name);
  }
  return (
    <TabsContext value={{ active, prefix }}>
      <div {...rest} className={cx(ns.b, ns.m(tabPosition), type && ns.m(type), className)}>
        <div className={cx(ns.e('header'), ns.is(tabPosition))}>
          {(addable || editable) && (
            <button
              type="button"
              aria-label="Add tab"
              className={ns.e('new-tab')}
              onClick={() => {
                onTabAdd?.();
                onEdit?.(undefined, 'add');
              }}
            >
              +
            </button>
          )}
          <div className={ns.e('nav-wrap')}>
            <div className={ns.e('nav-scroll')}>
              <div
                role="tablist"
                aria-orientation={
                  tabPosition === 'left' || tabPosition === 'right' ? 'vertical' : 'horizontal'
                }
                className={cx(ns.e('nav'), ns.is('stretch', stretch))}
              >
                {panes.map((pane, index) => {
                  const name = names[index];
                  return (
                    <div
                      key={name}
                      role="tab"
                      id={`${prefix}-tab-${name}`}
                      aria-controls={`${prefix}-pane-${name}`}
                      aria-selected={active === name}
                      aria-disabled={pane.props.disabled || undefined}
                      tabIndex={active === name ? 0 : -1}
                      className={cx(
                        ns.e('item'),
                        ns.is(tabPosition),
                        ns.is('active', active === name),
                        ns.is('disabled', pane.props.disabled),
                        ns.is('closable', pane.props.closable ?? (closable || editable)),
                      )}
                      onClick={(event) => {
                        if (!pane.props.disabled) {
                          onTabClick?.(name, event);
                          void select(name).catch(() => undefined);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
                            event.key,
                          )
                        ) {
                          event.preventDefault();
                          const enabled = panes
                            .map((p, i) => ({ p, i }))
                            .filter(({ p }) => !p.props.disabled);
                          const position = enabled.findIndex((item) => item.i === index);
                          const next =
                            event.key === 'Home'
                              ? 0
                              : event.key === 'End'
                                ? enabled.length - 1
                                : (position +
                                    (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) +
                                    enabled.length) %
                                  enabled.length;
                          if (enabled[next]) {
                            const target = names[enabled[next].i];
                            document.getElementById(`${prefix}-tab-${target}`)?.focus();
                            void select(target).catch(() => undefined);
                          }
                        }
                      }}
                    >
                      <span>{pane.props.renderLabel ?? pane.props.label}</span>
                      {(pane.props.closable ?? (closable || editable)) && (
                        <button
                          type="button"
                          aria-label={`Close ${String(pane.props.label ?? name)}`}
                          className="is-icon-close"
                          onClick={(event) => {
                            event.stopPropagation();
                            onTabRemove?.(name);
                            onEdit?.(name, 'remove');
                          }}
                        >
                          <Glyph name="close" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={ns.e('content')}>
          {panes.map((pane, index) => (
            <TabPane {...pane.props} key={names[index]} name={names[index]} />
          ))}
        </div>
      </div>
    </TabsContext>
  );
}
