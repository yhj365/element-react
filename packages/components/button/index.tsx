'use client';
import { createContext, useContext, useImperativeHandle, useRef } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { ConfigContext, FormContext, cx, useDisabled, useNamespace, useSize } from '../../hooks';
import { Glyph, Icon } from '../icon';
import type { ButtonHTMLAttributes, CSSProperties, ElementType, MouseEvent, ReactNode, Ref } from 'react';
import type { BaseProps, ComponentSize, GlobalConfig } from '../../hooks';

type ButtonType = NonNullable<GlobalConfig['button']>['type'];
export interface ButtonHandle {
  readonly ref: HTMLElement | null;
  readonly size: ComponentSize | undefined;
  readonly type: ButtonType;
  readonly disabled: boolean;
  readonly shouldAddSpace: boolean;
}
export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'color' | 'size' | 'ref'
> {
  type?: ButtonType;
  size?: ComponentSize;
  plain?: boolean;
  text?: boolean;
  bg?: boolean;
  link?: boolean;
  round?: boolean;
  circle?: boolean;
  dashed?: boolean;
  loading?: boolean;
  loadingIcon?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  nativeType?: 'button' | 'submit' | 'reset';
  autoInsertSpace?: boolean;
  color?: string;
  dark?: boolean;
  tag?: ElementType;
  renderLoading?: ReactNode;
  renderIcon?: ReactNode;
  ref?: Ref<ButtonHandle>;
}
const ButtonGroupContext = createContext<{ size?: ComponentSize; type?: ButtonType }>({});
export interface ButtonGroupProps extends BaseProps {
  size?: ComponentSize;
  type?: ButtonType;
  direction?: 'horizontal' | 'vertical';
}

/** 按钮组仅向后代继承尺寸和语义类型，支持水平/垂直组合。 */
export function ButtonGroup({
  size,
  type,
  direction = 'horizontal',
  className,
  children,
  ...rest
}: ButtonGroupProps) {
  const ns = useNamespace('button-group');
  return (
    <ButtonGroupContext value={{ size, type }}>
      <div {...rest} role="group" className={cx(ns.b, ns.m(direction), className)}>
        {children}
      </div>
    </ButtonGroupContext>
  );
}

/** 依据源码颜色算法计算按钮及交互色，保持CSS变量接口。 */
function colorStyle(color: string | undefined, dark: boolean, plain: boolean): CSSProperties {
  if (!color) return {};
  const base = new TinyColor(color);
  const hover = dark ? base.tint(20).toString() : base.tint(30).toString();
  const light = base.tint(90).toString();
  const vars: Record<string, string> = {
    '--el-button-bg-color': plain ? light : color,
    '--el-button-border-color': color,
    '--el-button-text-color': plain ? color : base.isDark() ? '#ffffff' : '#000000',
    '--el-button-hover-bg-color': plain ? color : hover,
    '--el-button-hover-border-color': plain ? color : hover,
    '--el-button-hover-text-color': base.isDark() ? '#ffffff' : '#000000',
    '--el-button-active-bg-color': base.shade(20).toString(),
    '--el-button-active-border-color': base.shade(20).toString(),
    '--el-button-disabled-bg-color': plain ? light : base.tint(50).toString(),
    '--el-button-disabled-border-color': base.tint(50).toString(),
  };
  return vars as CSSProperties;
}

/** loading/disabled阻止激活；具名加载内容优先于加载图标。 */
export function Button(props: ButtonProps) {
  const {
    type,
    size,
    plain,
    text,
    bg,
    link,
    round,
    circle,
    dashed,
    loading = false,
    loadingIcon,
    disabled,
    icon,
    nativeType = 'button',
    autoInsertSpace,
    color,
    dark = false,
    tag: Tag = 'button',
    renderLoading,
    renderIcon,
    ref,
    className,
    children,
    style,
    onClick,
    ...rest
  } = props;
  const config = useContext(ConfigContext).button;
  const group = useContext(ButtonGroupContext);
  const form = useContext(FormContext);
  const actualSize = useSize(size ?? group.size);
  const actualDisabled = useDisabled(disabled);
  const actualType: ButtonType = type || group.type || config?.type || '';
  const actualPlain = plain ?? config?.plain ?? false;
  const actualText = text ?? config?.text ?? false;
  const actualRound = round ?? config?.round ?? false;
  const actualDashed = dashed ?? config?.dashed ?? false;
  const ns = useNamespace('button');
  const node = useRef<HTMLElement>(null);
  const shouldAddSpace =
    (autoInsertSpace ?? config?.autoInsertSpace ?? false) &&
    typeof children === 'string' &&
    /^\p{Unified_Ideograph}{2}$/u.test(children.trim());
  useImperativeHandle(
    ref,
    () => ({
      get ref() {
        return node.current;
      },
      size: actualSize,
      type: actualType,
      disabled: actualDisabled,
      shouldAddSpace,
    }),
    [actualSize, actualType, actualDisabled, shouldAddSpace],
  );
  /** 自定义标签也执行禁用保护，不依赖原生button的disabled。 */
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    if (actualDisabled || loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (nativeType === 'reset') form.resetFields?.();
    onClick?.(event);
  }
  return (
    <Tag
      {...rest}
      ref={node}
      type={Tag === 'button' ? nativeType : undefined}
      disabled={Tag === 'button' ? actualDisabled || loading : undefined}
      aria-disabled={actualDisabled || loading || undefined}
      className={cx(
        ns.b,
        ns.m(actualType),
        ns.m(actualSize),
        ns.is('plain', actualPlain),
        ns.is('text', actualText),
        ns.is('has-bg', bg),
        ns.is('link', link),
        ns.is('round', actualRound),
        ns.is('circle', circle),
        ns.is('dashed', actualDashed),
        ns.is('loading', loading),
        ns.is('disabled', actualDisabled),
        className,
      )}
      style={{ ...colorStyle(color, dark, actualPlain), ...style }}
      onClick={handleClick}
    >
      {loading ? (
        renderLoading !== undefined ? (
          renderLoading
        ) : (
          <Icon className="is-loading">{loadingIcon ?? <Glyph name="loading" />}</Icon>
        )
      ) : (
        (icon !== undefined || renderIcon !== undefined) && <Icon>{icon ?? renderIcon}</Icon>
      )}
      {children !== undefined && children !== null && (
        <span className={shouldAddSpace ? `${ns.e('text')}--expand` : undefined}>{children}</span>
      )}
    </Tag>
  );
}
