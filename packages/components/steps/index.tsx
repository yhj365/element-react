'use client';
import { Children, createContext, isValidElement, useContext, useEffect, useRef } from 'react';
import { cx, useNamespace } from '../../hooks';
import { Glyph, Icon } from '../icon';
import type { BaseProps } from '../../hooks';
import type { ReactNode } from 'react';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success';
export interface StepsProps extends BaseProps {
  space?: string | number;
  direction?: 'horizontal' | 'vertical';
  active?: number;
  processStatus?: StepStatus;
  finishStatus?: StepStatus;
  alignCenter?: boolean;
  simple?: boolean;
  onChange?: (active: number, oldActive: number) => void;
}
const StepContext = createContext<{ props: StepsProps; index: number; count: number }>({
  props: {},
  index: 0,
  count: 1,
});
/** 步骤展示跟随active，不擅自增加点击跳转业务逻辑。 */
export function Steps({
  space = '',
  direction = 'horizontal',
  active = 0,
  processStatus = 'process',
  finishStatus = 'finish',
  alignCenter = false,
  simple = false,
  onChange,
  className,
  children,
  ...rest
}: StepsProps) {
  const ns = useNamespace('steps');
  const items = Children.toArray(children);
  const old = useRef(active);
  useEffect(() => {
    if (old.current !== active) {
      const previous = old.current;
      old.current = active;
      onChange?.(active, previous);
    }
  }, [active, onChange]);
  const props = { space, direction, active, processStatus, finishStatus, alignCenter, simple };
  return (
    <div {...rest} className={cx(ns.b, ns.m(simple ? 'simple' : direction), className)}>
      {items.map((item, index) => (
        <StepContext
          key={isValidElement(item) && item.key !== null ? item.key : index}
          value={{ props, index, count: items.length }}
        >
          {item}
        </StepContext>
      ))}
    </div>
  );
}
export interface StepProps extends BaseProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  status?: StepStatus;
  renderIcon?: ReactNode;
  renderTitle?: ReactNode;
  renderDescription?: ReactNode;
}
/** 计算步骤状态与连接线；显式status优先于父级进度。 */
export function Step({
  title = '',
  description = '',
  icon,
  status,
  renderIcon,
  renderTitle,
  renderDescription,
  className,
  style,
  ...rest
}: StepProps) {
  const ns = useNamespace('step');
  const { props, index, count } = useContext(StepContext);
  const simple = props.simple;
  const current =
    status ??
    (index < (props.active ?? 0)
      ? (props.finishStatus ?? 'finish')
      : index === (props.active ?? 0)
        ? (props.processStatus ?? 'process')
        : 'wait');
  const isLast = index === count - 1;
  const basis =
    props.space !== '' && props.space !== undefined
      ? typeof props.space === 'number'
        ? `${props.space}px`
        : props.space
      : `${100 / (props.alignCenter ? count : Math.max(1, count - 1))}%`;
  return (
    <div
      {...rest}
      className={cx(
        ns.b,
        ns.is(simple ? 'simple' : (props.direction ?? 'horizontal')),
        ns.is('center', props.alignCenter),
        ns.is('flex', isLast && !props.space && !props.alignCenter),
        className,
      )}
      style={{
        flexBasis: basis,
        maxWidth: !simple && isLast && !props.alignCenter ? `${100 / count}%` : undefined,
        ...style,
      }}
    >
      <div className={cx(ns.e('head'), ns.is(current))}>
        {!simple && (
          <div className={ns.e('line')}>
            <i
              className={ns.e('line-inner')}
              style={{
                borderWidth: current === 'finish' || current === 'success' ? 1 : 0,
                width:
                  props.direction !== 'vertical' && (current === 'finish' || current === 'success')
                    ? '100%'
                    : undefined,
                height:
                  props.direction === 'vertical' && (current === 'finish' || current === 'success')
                    ? '100%'
                    : undefined,
              }}
            />
          </div>
        )}
        <div
          className={cx(
            ns.e('icon'),
            ns.is(renderIcon !== undefined || icon !== undefined ? 'icon' : 'text'),
          )}
        >
          {renderIcon ??
            (icon !== undefined ? (
              <Icon className={ns.e('icon-inner')}>{icon}</Icon>
            ) : current === 'success' || current === 'error' ? (
              <Icon className={cx(ns.e('icon-inner'), 'is-status')}>
                <Glyph name={current === 'success' ? 'check' : 'close'} />
              </Icon>
            ) : (
              !simple && <div className={ns.e('icon-inner')}>{index + 1}</div>
            ))}
        </div>
      </div>
      <div className={ns.e('main')}>
        <div className={cx(ns.e('title'), ns.is(current))}>{renderTitle ?? title}</div>
        {simple ? (
          <div className={ns.e('arrow')} />
        ) : (
          <div className={cx(ns.e('description'), ns.is(current))}>{renderDescription ?? description}</div>
        )}
      </div>
    </div>
  );
}
