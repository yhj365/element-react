'use client';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ConfigContext, cx, useControllable, useNamespace, useSize, useText } from '../../hooks';
import { Icon, Glyph } from '../icon';
import { EmptyIllustration } from './empty-image';
import { AvatarGroupContext } from '../avatar-group/context';
import type {
  AnchorHTMLAttributes,
  CSSProperties,
  ElementType,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import type { BaseProps, ComponentSize, SemanticType } from '../../hooks';

export interface TextProps extends BaseProps {
  type?: SemanticType | '';
  size?: ComponentSize;
  tag?: ElementType;
  truncated?: boolean;
  lineClamp?: string | number;
  title?: string;
}
/** 文字截断时动态测量溢出并补充title，显式title始终优先。 */
export function Text({
  type = '',
  size,
  tag: Tag = 'span',
  truncated,
  lineClamp,
  title,
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const ns = useNamespace('text');
  const actualSize = useSize(size);
  const node = useRef<HTMLElement>(null);
  const [overflow, setOverflow] = useState(false);
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    /** 内容和尺寸变化后更新溢出状态。 */
    function measure(): void {
      if (!element) return;
      setOverflow(
        Boolean(
          truncated
            ? element.scrollWidth > element.offsetWidth
            : lineClamp !== undefined && element.scrollHeight > element.offsetHeight,
        ),
      );
    }
    measure();
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : undefined;
    resize?.observe(element);
    const mutation = new MutationObserver(measure);
    mutation.observe(element, { childList: true, characterData: true, subtree: true });
    return () => {
      resize?.disconnect();
      mutation.disconnect();
    };
  }, [truncated, lineClamp, children]);
  return (
    <Tag
      {...rest}
      ref={node}
      title={title ?? (overflow ? (node.current?.textContent ?? undefined) : undefined)}
      className={cx(
        ns.b,
        ns.m(type),
        ns.m(actualSize),
        ns.is('truncated', truncated),
        ns.is('line-clamp', lineClamp !== undefined),
        className,
      )}
      style={{ WebkitLineClamp: lineClamp, ...style }}
    >
      {children}
    </Tag>
  );
}

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  type?: SemanticType | 'default';
  underline?: boolean | 'always' | 'hover' | 'never';
  disabled?: boolean;
  icon?: ReactNode;
  renderIcon?: ReactNode;
}
/** 禁用链接阻止导航；普通href及修饰键保持浏览器原生行为。 */
export function Link({
  type,
  underline,
  disabled,
  icon,
  renderIcon,
  href,
  onClick,
  children,
  className,
  ...rest
}: LinkProps) {
  const config = useContext(ConfigContext).link;
  const ns = useNamespace('link');
  const rawUnderline = underline ?? config?.underline ?? 'hover';
  const line = typeof rawUnderline === 'boolean' ? (rawUnderline ? 'hover' : 'never') : rawUnderline;
  return (
    <a
      {...rest}
      href={disabled ? undefined : href}
      target={disabled || !href ? undefined : (rest.target ?? '_self')}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : rest.tabIndex}
      className={cx(
        ns.b,
        ns.m(type ?? config?.type ?? 'default'),
        ns.is('disabled', disabled),
        ns.is('underline', line === 'always'),
        ns.is('hover-underline', line === 'hover' && !disabled),
        className,
      )}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {icon !== undefined && <Icon>{icon}</Icon>}
      {children !== undefined && <span className={ns.e('inner')}>{children}</span>}
      {renderIcon}
    </a>
  );
}

export interface CardProps extends BaseProps {
  header?: ReactNode;
  footer?: ReactNode;
  renderHeader?: ReactNode;
  renderFooter?: ReactNode;
  bodyStyle?: CSSProperties;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  shadow?: 'always' | 'hover' | 'never';
}
/** 按来源结构保留头部、内容和底部的独立样式入口。 */
export function Card({
  header,
  footer,
  renderHeader,
  renderFooter,
  bodyStyle,
  headerClass,
  bodyClass,
  footerClass,
  shadow,
  className,
  children,
  ...rest
}: CardProps) {
  const ns = useNamespace('card');
  const config = useContext(ConfigContext).card;
  const heading = renderHeader ?? header;
  const ending = renderFooter ?? footer;
  return (
    <div {...rest} className={cx(ns.b, ns.is(`${shadow ?? config?.shadow ?? 'always'}-shadow`), className)}>
      {heading !== undefined && heading !== '' && (
        <div className={cx(ns.e('header'), headerClass)}>{heading}</div>
      )}
      <div className={cx(ns.e('body'), bodyClass)} style={bodyStyle}>
        {children}
      </div>
      {ending !== undefined && ending !== '' && (
        <div className={cx(ns.e('footer'), footerClass)}>{ending}</div>
      )}
    </div>
  );
}

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'onClick'> {
  type?: SemanticType;
  closable?: boolean;
  disableTransitions?: boolean;
  hit?: boolean;
  color?: string;
  size?: ComponentSize;
  effect?: 'dark' | 'light' | 'plain';
  round?: boolean;
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
}
/** close仅通知，不自行卸载；避免关闭按钮冒泡触发tag点击。 */
export function Tag({
  type = 'primary',
  closable,
  disableTransitions: _disableTransitions,
  hit,
  color,
  size,
  effect = 'light',
  round,
  onClick,
  onClose,
  className,
  style,
  children,
  ...rest
}: TagProps) {
  const ns = useNamespace('tag');
  const actualSize = useSize(size);
  const text = useText();
  return (
    <span
      {...rest}
      className={cx(
        ns.b,
        ns.m(type),
        ns.m(actualSize),
        ns.m(effect),
        ns.is('closable', closable),
        ns.is('hit', hit),
        ns.is('round', round),
        className,
      )}
      style={{ backgroundColor: color, ...style }}
      onClick={onClick}
    >
      <span className={ns.e('content')}>{children}</span>
      {closable && (
        <button
          type="button"
          className={ns.e('close')}
          aria-label={text.close}
          onClick={(event) => {
            event.stopPropagation();
            onClose?.(event);
          }}
        >
          <Icon>
            <Glyph name="close" />
          </Icon>
        </button>
      )}
    </span>
  );
}

export interface CheckTagProps extends BaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  type?: SemanticType;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
}
/** 独立可勾选标签，值请求和源change事件分别通知。 */
export function CheckTag({
  checked,
  defaultChecked = false,
  disabled,
  type = 'primary',
  onCheckedChange,
  onChange,
  className,
  children,
  ...rest
}: CheckTagProps) {
  const ns = useNamespace('check-tag');
  const [value, setValue] = useControllable(checked, defaultChecked, onCheckedChange);
  return (
    <span
      {...rest}
      role="checkbox"
      aria-checked={value}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx(ns.b, ns.m(type), ns.is('checked', value), ns.is('disabled', disabled), className)}
      onClick={() => {
        if (!disabled) {
          setValue(!value);
          onChange?.(!value);
        }
      }}
      onKeyDown={(event) => {
        if (!disabled && (event.key === ' ' || event.key === 'Enter')) {
          event.preventDefault();
          setValue(!value);
          onChange?.(!value);
        }
      }}
    >
      {children}
    </span>
  );
}

export interface DividerProps extends BaseProps {
  direction?: 'horizontal' | 'vertical';
  contentPosition?: 'left' | 'right' | 'center';
  borderStyle?: CSSProperties['borderStyle'];
}
/** 分割线保留水平/垂直及内容位置约定。 */
export function Divider({
  direction = 'horizontal',
  contentPosition = 'center',
  borderStyle = 'solid',
  className,
  style,
  children,
  ...rest
}: DividerProps) {
  const ns = useNamespace('divider');
  return (
    <div
      {...rest}
      role="separator"
      aria-orientation={direction}
      className={cx(ns.b, ns.m(direction), className)}
      style={{ '--el-border-style': borderStyle, ...style } as CSSProperties}
    >
      {direction === 'horizontal' && children !== undefined && (
        <div className={cx(ns.e('text'), `is-${contentPosition}`)}>{children}</div>
      )}
    </div>
  );
}

export interface BadgeProps extends BaseProps {
  value?: number | string;
  max?: number;
  isDot?: boolean;
  hidden?: boolean;
  type?: SemanticType;
  showZero?: boolean;
  color?: string;
  offset?: [number, number];
  badgeClass?: string;
  badgeStyle?: CSSProperties;
  renderContent?: (value: string) => ReactNode;
  ref?: Ref<{ readonly content: string }>;
}
/** 数字超过max时折叠；0值显隐与空内容独立处理。 */
export function Badge({
  value = '',
  max = 99,
  isDot,
  hidden,
  type = 'danger',
  showZero = true,
  color,
  offset = [0, 0],
  badgeClass,
  badgeStyle,
  renderContent,
  ref,
  children,
  className,
  ...rest
}: BadgeProps) {
  const ns = useNamespace('badge');
  const content = isDot ? '' : typeof value === 'number' && value > max ? `${max}+` : String(value);
  useImperativeHandle(ref, () => ({ content }), [content]);
  return (
    <div {...rest} className={cx(ns.b, className)}>
      {children}
      {!hidden && (content !== '' || isDot || renderContent) && (
        <sup
          className={cx(
            ns.e('content'),
            `${ns.e('content')}--${type}`,
            ns.is('fixed', children !== undefined),
            ns.is('dot', isDot),
            ns.is('hide-zero', !showZero && value === 0),
            badgeClass,
          )}
          style={{ backgroundColor: color, marginRight: -offset[0], marginTop: offset[1], ...badgeStyle }}
        >
          {renderContent ? renderContent(content) : content}
        </sup>
      )}
    </div>
  );
}

export interface AlertProps extends BaseProps {
  title?: ReactNode;
  description?: ReactNode;
  type?: 'success' | 'info' | 'warning' | 'error';
  closable?: boolean;
  center?: boolean;
  closeText?: string;
  showIcon?: boolean;
  effect?: 'light' | 'dark';
  renderTitle?: ReactNode;
  renderIcon?: ReactNode;
  onClose?: (event: MouseEvent) => void;
}
/** 告警关闭后保留隐藏节点，与来源v-show终态对应。 */
export function Alert({
  title = '',
  description = '',
  type = 'info',
  closable = true,
  center,
  closeText,
  showIcon,
  effect = 'light',
  renderTitle,
  renderIcon,
  onClose,
  className,
  children,
  ...rest
}: AlertProps) {
  const ns = useNamespace('alert');
  const text = useText();
  const [visible, setVisible] = useState(true);
  const hasDesc = Boolean(description) || children !== undefined;
  const heading = renderTitle ?? title;
  return (
    <div
      {...rest}
      role="alert"
      hidden={!visible}
      className={cx(ns.b, ns.m(type), ns.is('center', center), ns.is(effect), className)}
    >
      {showIcon && (
        <Icon className={cx(ns.e('icon'), ns.is('big', hasDesc))}>
          {renderIcon ?? <Glyph name={type === 'success' ? 'check' : type} />}
        </Icon>
      )}
      <div className={ns.e('content')}>
        {heading !== '' && heading !== undefined && (
          <span className={cx(ns.e('title'), hasDesc && 'with-description')}>{heading}</span>
        )}
        {hasDesc && <p className={ns.e('description')}>{children ?? description}</p>}
        {closable && (
          <button
            type="button"
            aria-label={text.close}
            className={cx(ns.e('close-btn'), ns.is('customed', Boolean(closeText)))}
            onClick={(event) => {
              setVisible(false);
              onClose?.(event);
            }}
          >
            {closeText || <Glyph name="close" />}
          </button>
        )}
      </div>
    </div>
  );
}

export interface EmptyProps extends BaseProps {
  image?: string;
  imageSize?: number;
  description?: ReactNode;
  renderImage?: ReactNode;
  renderDescription?: ReactNode;
}
/** 空状态的插图、说明和底部动作独立渲染。 */
export function Empty({
  image,
  imageSize,
  description,
  renderImage,
  renderDescription,
  className,
  children,
  ...rest
}: EmptyProps) {
  const ns = useNamespace('empty');
  const text = useText();
  return (
    <div {...rest} className={cx(ns.b, className)}>
      <div className={ns.e('image')} style={{ width: imageSize }}>
        {renderImage ?? (image ? <img src={image} alt="" /> : <EmptyIllustration />)}
      </div>
      <div className={ns.e('description')}>
        <p>{renderDescription ?? description ?? text.empty}</p>
      </div>
      {children !== undefined && <div className={ns.e('bottom')}>{children}</div>}
    </div>
  );
}

export interface ResultProps extends BaseProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  icon?: 'success' | 'warning' | 'info' | 'error';
  renderIcon?: ReactNode;
  renderTitle?: ReactNode;
  renderSubTitle?: ReactNode;
  renderExtra?: ReactNode;
}
/** 结果页按图标、标题、副标题和操作区排列。 */
export function Result({
  title,
  subTitle,
  icon = 'info',
  renderIcon,
  renderTitle,
  renderSubTitle,
  renderExtra,
  className,
  children,
  ...rest
}: ResultProps) {
  const ns = useNamespace('result');
  return (
    <div {...rest} className={cx(ns.b, className)}>
      <div className={ns.e('icon')}>
        {renderIcon ?? (
          <svg className={`icon-${icon}`} viewBox="0 0 1024 1024" aria-hidden="true">
            <circle cx="512" cy="512" r="440" fill="currentColor" />
            <path
              d={
                icon === 'success'
                  ? 'm260 520 160 160 340-340'
                  : icon === 'error'
                    ? 'm340 340 344 344m0-344L340 684'
                    : 'M512 260v340m0 100v40'
              }
              fill="none"
              stroke="white"
              strokeWidth="70"
            />
          </svg>
        )}
      </div>
      {(renderTitle ?? title) !== undefined && (
        <div className={ns.e('title')}>
          <p>{renderTitle ?? title}</p>
        </div>
      )}
      {(renderSubTitle ?? subTitle) !== undefined && (
        <div className={ns.e('subtitle')}>
          <p>{renderSubTitle ?? subTitle}</p>
        </div>
      )}
      {(renderExtra ?? children) !== undefined && (
        <div className={ns.e('extra')}>{renderExtra ?? children}</div>
      )}
    </div>
  );
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onError'> {
  size?: number | ComponentSize;
  shape?: 'circle' | 'square';
  icon?: ReactNode;
  src?: string;
  srcSet?: string;
  alt?: string;
  fit?: CSSProperties['objectFit'];
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}
/** 失败图片回退内容；src变化时允许重新加载。 */
export function Avatar({
  size,
  shape,
  icon,
  src,
  srcSet,
  alt,
  fit = 'cover',
  onError,
  className,
  style,
  children,
  ...rest
}: AvatarProps) {
  const ns = useNamespace('avatar');
  const group = useContext(AvatarGroupContext);
  const actualSize = size ?? group.size;
  const actualShape = shape ?? group.shape ?? 'circle';
  const [failedSource, setFailedSource] = useState<string>();
  const key = `${src ?? ''}:${srcSet ?? ''}`;
  useEffect(() => setFailedSource(undefined), [key]);
  return (
    <span
      {...rest}
      className={cx(
        ns.b,
        ns.m(actualShape),
        typeof actualSize === 'string' && ns.m(actualSize),
        icon !== undefined && ns.m('icon'),
        className,
      )}
      style={
        {
          ...(typeof actualSize === 'number' ? { [`--${ns.namespace}-avatar-size`]: `${actualSize}px` } : {}),
          ...style,
        } as CSSProperties
      }
    >
      {(src || srcSet) && failedSource !== key ? (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          style={{ objectFit: fit }}
          onError={(event) => {
            setFailedSource(key);
            onError?.(event);
          }}
        />
      ) : icon !== undefined ? (
        <Icon>{icon}</Icon>
      ) : (
        children
      )}
    </span>
  );
}
