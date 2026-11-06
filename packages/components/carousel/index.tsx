'use client';
import {
  Children,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ConfigContext, cx, useNamespace } from '../../hooks';
import { Glyph, Icon } from '../icon';
import type { BaseProps } from '../../hooks';
import type { ReactElement, ReactNode, Ref } from 'react';

export interface CarouselItemProps extends BaseProps {
  name?: string;
  label?: string | number;
}
export interface CarouselHandle {
  activeIndex: number;
  setActiveItem: (index: number | string) => void;
  prev: () => void;
  next: () => void;
}
export interface CarouselProps extends BaseProps {
  height?: string;
  initialIndex?: number;
  trigger?: 'hover' | 'click';
  autoplay?: boolean;
  interval?: number;
  indicatorPosition?: '' | 'outside' | 'none';
  arrow?: 'always' | 'hover' | 'never';
  type?: '' | 'card';
  cardScale?: number;
  loop?: boolean;
  direction?: 'horizontal' | 'vertical';
  pauseOnHover?: boolean;
  motionBlur?: boolean;
  onChange?: (current: number, previous: number) => void;
  ref?: Ref<CarouselHandle>;
}
/** 递归读取Fragment中的轮播项，忽略其他节点。 */
function slidesOf(children: ReactNode): ReactElement<CarouselItemProps>[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) return slidesOf((child.props as { children?: ReactNode }).children);
    return child.type === CarouselItem ? [child as ReactElement<CarouselItemProps>] : [];
  });
}
/** 来源轮播边缘索引映射，确保首尾邻居位于正确方向。 */
function processIndex(index: number, active: number, length: number): number {
  if (active === 0 && index === length - 1) return -1;
  if (active === length - 1 && index === 0) return length;
  if (index < active - 1 && active - index >= length / 2) return length + 1;
  if (index > active + 1 && index - active >= length / 2) return -2;
  return index;
}
/** 控制按钮和指示器各自节流，卸载取消尾沿回调。 */
function useThrottledIndex(callback: (index: number) => void): (index: number) => void {
  const latest = useRef(callback);
  latest.current = callback;
  const last = useRef(-Infinity),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    pending = useRef(0);
  useEffect(
    () => () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    },
    [],
  );
  return (index) => {
    pending.current = index;
    const remaining = 300 - (Date.now() - last.current);
    if (remaining <= 0) {
      if (timer.current !== undefined) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
      last.current = Date.now();
      latest.current(index);
    } else if (timer.current === undefined)
      timer.current = setTimeout(() => {
        timer.current = undefined;
        last.current = Date.now();
        latest.current(pending.current);
      }, remaining);
  };
}
/** 轮播按来源几何规则定位卡片，并处理双项循环、计时、悬停与尺寸变化。 */
export function Carousel({
  height = '',
  initialIndex = 0,
  trigger = 'hover',
  autoplay = true,
  interval = 3000,
  indicatorPosition = '',
  arrow = 'hover',
  type = '',
  cardScale = 0.83,
  loop = true,
  direction = 'horizontal',
  pauseOnHover = true,
  motionBlur = false,
  onChange,
  ref,
  children,
  className,
  style,
  ...rest
}: CarouselProps) {
  const ns = useNamespace('carousel'),
    config = useContext(ConfigContext),
    uid = useId().replaceAll(':', '');
  const originals = slidesOf(children),
    duplicated = originals.length === 2 && loop && type !== 'card';
  const items = duplicated ? [...originals, ...originals] : originals;
  const count = items.length,
    logicalCount = originals.length;
  const root = useRef<HTMLDivElement>(null),
    body = useRef<HTMLDivElement>(null);
  const itemNodes = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(() => Math.max(0, Math.min(initialIndex, Math.max(0, count - 1))));
  const [oldIndex, setOldIndex] = useState<number | undefined>();
  const [hover, setHover] = useState(false),
    [arrowHover, setArrowHover] = useState<'left' | 'right' | undefined>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, autoHeight: 0 });
  const [timerRevision, setTimerRevision] = useState(0),
    [transitioning, setTransitioning] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const changeRef = useRef(onChange);
  changeRef.current = onChange;
  const vertical = direction === 'vertical',
    card = type === 'card';
  const signature = JSON.stringify(originals.map((item, index) => [item.key ?? index, item.props.name]));
  const initRef = useRef(initialIndex);
  initRef.current = initialIndex;
  /** 只在索引实际变化时触发change；双项循环的外部索引始终为0或1。 */
  function activate(next: number, notify = true): void {
    if (!count) return;
    next = next < 0 ? (loop ? count - 1 : 0) : next >= count ? (loop ? 0 : count - 1) : next;
    const previous = activeRef.current;
    if (next === previous) return;
    activeRef.current = next;
    setOldIndex(previous);
    setActive(next);
    if (notify) changeRef.current?.(duplicated ? next % 2 : next, duplicated ? previous % 2 : previous);
  }
  /** 手动切换支持name和整数；无效索引不改变状态。 */
  function setActiveItem(index: number | string): void {
    const named = typeof index === 'string' ? items.findIndex((item) => item.props.name === index) : -1;
    const next = named >= 0 ? named : Number(index);
    if (!Number.isInteger(next)) return;
    activate(next);
    setTimerRevision((revision) => revision + 1);
  }
  const activateRef = useRef(activate);
  activateRef.current = activate;
  useEffect(() => {
    const next = Math.max(0, Math.min(initRef.current, Math.max(0, count - 1)));
    activateRef.current(next, false);
  }, [signature, count]);
  useEffect(() => {
    if (!autoplay || interval <= 0 || count <= 1 || (pauseOnHover && hover)) return;
    const timer = setInterval(() => {
      if (activeRef.current < count - 1) activateRef.current(activeRef.current + 1);
      else if (loop) activateRef.current(0);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, count, pauseOnHover, hover, loop, timerRevision]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    /** 根尺寸和激活内容尺寸共同决定位移与auto高度。 */
    function measure(): void {
      setDimensions({
        width: element!.offsetWidth,
        height: element!.offsetHeight,
        autoHeight: itemNodes.current[active]?.offsetHeight ?? 0,
      });
    }
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(element);
    const node = itemNodes.current[active];
    if (node) observer?.observe(node);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [active, signature, height]);
  useEffect(() => {
    const element = body.current;
    if (!element || !motionBlur) return;
    const start = (): void => setTransitioning(true),
      end = (): void => setTransitioning(false);
    element.addEventListener('transitionstart', start);
    element.addEventListener('transitionend', end);
    element.addEventListener('transitioncancel', end);
    return () => {
      element.removeEventListener('transitionstart', start);
      element.removeEventListener('transitionend', end);
      element.removeEventListener('transitioncancel', end);
    };
  }, [motionBlur]);
  useImperativeHandle(ref, () => ({
    get activeIndex() {
      return logicalCount ? (duplicated ? active % 2 : active) : -1;
    },
    set activeIndex(index: number) {
      activate(index);
    },
    setActiveItem,
    prev: () => setActiveItem(activeRef.current - 1),
    next: () => setActiveItem(activeRef.current + 1),
  }));
  const throttledArrow = useThrottledIndex(setActiveItem),
    throttledIndicator = useThrottledIndex((index) => {
      if (trigger === 'hover') activate(index);
    });
  const distance = vertical ? dimensions.height : dimensions.width,
    hasLabel = items.some((item) => String(item.props.label ?? '').length > 0);
  return (
    <div
      {...rest}
      ref={root}
      className={cx(
        ns.b,
        ns.m(direction),
        card && ns.m('card'),
        ns.is('vertical-outside', vertical && indicatorPosition === 'outside'),
        className,
      )}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setArrowHover(undefined);
      }}
    >
      {arrow !== 'never' &&
        !vertical &&
        (['left', 'right'] as const).map((side) => (
          <button
            key={side}
            type="button"
            className={cx(ns.e('arrow'), `${ns.e('arrow')}--${side}`)}
            aria-label={
              side === 'left'
                ? config.locale === 'zh-cn'
                  ? '上一张幻灯片'
                  : 'Previous slide'
                : config.locale === 'zh-cn'
                  ? '下一张幻灯片'
                  : 'Next slide'
            }
            style={{
              display:
                (arrow === 'always' || hover) && (loop || (side === 'left' ? active > 0 : active < count - 1))
                  ? undefined
                  : 'none',
            }}
            onMouseEnter={() => setArrowHover(side)}
            onMouseLeave={() => setArrowHover(undefined)}
            onClick={(event) => {
              event.stopPropagation();
              throttledArrow(activeRef.current + (side === 'left' ? -1 : 1));
            }}
          >
            <Icon style={side === 'left' ? { transform: 'rotate(180deg)' } : undefined}>
              <Glyph name="arrow" />
            </Icon>
          </button>
        ))}
      <div
        ref={body}
        className={cx(
          ns.e('container'),
          motionBlur && transitioning && `${ns.namespace}-transitioning${vertical ? '-vertical' : ''}`,
        )}
        style={{
          height: height === 'auto' ? dimensions.autoHeight : height,
          overflow: height === 'auto' ? 'hidden' : undefined,
          filter: motionBlur && transitioning ? `url(#${uid}-blur)` : undefined,
        }}
      >
        {items.map((item, index) => {
          const isActive = index === active;
          const position = !isActive && count > 2 && loop ? processIndex(index, active, count) : index;
          const inStage = card && Math.round(Math.abs(position - active)) <= 1;
          const translate = card
            ? inStage
              ? (distance * ((2 - cardScale) * (position - active) + 1)) / 4
              : position < active
                ? (-(1 + cardScale) * distance) / 4
                : ((3 + cardScale) * distance) / 4
            : distance * (position - active);
          const side = position < active ? 'left' : 'right';
          return (
            <div
              key={`${item.key ?? index}-${index}`}
              ref={(element) => {
                itemNodes.current[index] = element;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(index % Math.max(1, logicalCount)) + 1} / ${logicalCount}`}
              className={cx(
                ns.e('item'),
                ns.is('active', isActive),
                ns.is('in-stage', inStage),
                ns.is('hover', card && inStage && !isActive && arrowHover === side),
                ns.is('animating', !card && oldIndex !== undefined && (isActive || index === oldIndex)),
                card && `${ns.e('item')}--card`,
                card && vertical && `${ns.e('item')}--card-vertical`,
                item.props.className,
              )}
              style={{
                ...item.props.style,
                transform: `translate${vertical ? 'Y' : 'X'}(${translate}px) scale(${card && !isActive ? cardScale : 1})`,
              }}
              onClick={() => {
                if (card) setActiveItem(index);
              }}
            >
              {card && !isActive && <div className={ns.e('mask')} />} {item.props.children}
            </div>
          );
        })}
      </div>
      {indicatorPosition !== 'none' && (
        <ul
          className={cx(
            ns.e('indicators'),
            `${ns.e('indicators')}--${direction}`,
            hasLabel && `${ns.e('indicators')}--labels`,
            indicatorPosition === 'outside' && `${ns.e('indicators')}--outside`,
            vertical && `${ns.e('indicators')}--right`,
          )}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={cx(
                ns.e('indicator'),
                `${ns.e('indicator')}--${direction}`,
                ns.is('active', index === active),
              )}
              style={{ display: duplicated && (active <= 1 ? index > 1 : index <= 1) ? 'none' : undefined }}
              onMouseEnter={() => throttledIndicator(index)}
              onClick={(event) => {
                event.stopPropagation();
                activate(index);
              }}
            >
              <button
                type="button"
                className={ns.e('button')}
                aria-label={
                  config.locale === 'zh-cn'
                    ? `切换至第 ${(index % Math.max(1, logicalCount)) + 1} 张幻灯片`
                    : `Go to slide ${(index % Math.max(1, logicalCount)) + 1}`
                }
              >
                {hasLabel && <span>{item.props.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {motionBlur && (
        <svg aria-hidden="true" style={{ display: 'none' }}>
          <defs>
            <filter id={`${uid}-blur`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={vertical ? '0,10' : '12,0'} />
            </filter>
          </defs>
        </svg>
      )}
    </div>
  );
}
/** 轮播项由Carousel读取并定位，单独使用时保留内容容器。 */
export function CarouselItem({ children, name: _name, label: _label, ...rest }: CarouselItemProps) {
  return <div {...rest}>{children}</div>;
}
