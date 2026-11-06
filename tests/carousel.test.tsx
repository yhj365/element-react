import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, Fragment } from 'react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { Carousel, CarouselItem } from '../packages/element-react';
import type { CarouselHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(240);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
const slides = (
  <>
    <CarouselItem name="first" label="一">
      内容一
    </CarouselItem>
    <CarouselItem name="second" label="二">
      内容二
    </CarouselItem>
    <CarouselItem name="third" label="三">
      内容三
    </CarouselItem>
  </>
);

apiTest(
  'carousel',
  'Carousel Attributes',
  ['height', 'initial-index'],
  'carousel-basic',
  '初始索引及容器高度',
  () => {
    const view = render(
      <Carousel initialIndex={1} height="240px" autoplay={false}>
        {slides}
      </Carousel>,
    );
    expect(view.container.querySelector('.el-carousel__container')).toHaveStyle({ height: '240px' });
    expect(screen.getByText('内容二').closest('.el-carousel__item')).toHaveClass('is-active');
    expect(screen.getByText('内容一').closest('.el-carousel__item')).toHaveStyle({
      transform: 'translateX(-600px) scale(1)',
    });
  },
);
apiTest(
  'carousel',
  'Carousel Attributes',
  ['autoplay', 'interval', 'pause-on-hover'],
  'carousel-basic',
  '自动切换、悬停暂停和离开恢复',
  () => {
    vi.useFakeTimers();
    const ref = createRef<CarouselHandle>();
    const view = render(
      <Carousel ref={ref} interval={100}>
        {slides}
      </Carousel>,
    );
    act(() => vi.advanceTimersByTime(100));
    expect(ref.current?.activeIndex).toBe(1);
    fireEvent.mouseEnter(view.container.firstChild!);
    act(() => vi.advanceTimersByTime(400));
    expect(ref.current?.activeIndex).toBe(1);
    fireEvent.mouseLeave(view.container.firstChild!);
    act(() => vi.advanceTimersByTime(100));
    expect(ref.current?.activeIndex).toBe(2);
    view.rerender(
      <Carousel ref={ref} autoplay={false} interval={100}>
        {slides}
      </Carousel>,
    );
    act(() => vi.advanceTimersByTime(300));
    expect(ref.current?.activeIndex).toBe(2);
  },
);
apiTest(
  'carousel',
  'Carousel Attributes',
  ['trigger', 'indicator-position'],
  'carousel-basic',
  '指示器悬停及点击触发策略、外置和隐藏',
  () => {
    const view = render(
      <Carousel autoplay={false} trigger="click" indicatorPosition="outside">
        {slides}
      </Carousel>,
    );
    const second = screen.getByRole('button', { name: 'Go to slide 2' });
    fireEvent.mouseEnter(second.closest('li')!);
    expect(screen.getByText('内容一').closest('.el-carousel__item')).toHaveClass('is-active');
    fireEvent.click(second);
    expect(screen.getByText('内容二').closest('.el-carousel__item')).toHaveClass('is-active');
    expect(view.container.querySelector('ul')).toHaveClass(
      'el-carousel__indicators--outside',
      'el-carousel__indicators--labels',
    );
    view.rerender(
      <Carousel autoplay={false} indicatorPosition="none">
        {slides}
      </Carousel>,
    );
    expect(view.container.querySelector('ul')).toBeNull();
  },
);
apiTest(
  'carousel',
  'Carousel Attributes',
  ['arrow', 'loop'],
  'carousel-basic',
  '箭头显示模式和非循环边界',
  () => {
    const ref = createRef<CarouselHandle>();
    const view = render(
      <Carousel ref={ref} autoplay={false} arrow="hover" loop={false}>
        {slides}
      </Carousel>,
    );
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull();
    fireEvent.mouseEnter(view.container.firstChild!);
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Previous slide' })).toBeNull();
    act(() => ref.current?.prev());
    expect(ref.current?.activeIndex).toBe(0);
    act(() => ref.current?.setActiveItem(99));
    expect(ref.current?.activeIndex).toBe(2);
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull();
    view.rerender(
      <Carousel autoplay={false} arrow="never">
        {slides}
      </Carousel>,
    );
    expect(view.container.querySelector('.el-carousel__arrow')).toBeNull();
  },
);
apiTest(
  'carousel',
  'Carousel Attributes',
  ['type', 'card-scale'],
  'carousel-card',
  '卡片缩放、侧卡位置和点击切换',
  () => {
    const view = render(
      <Carousel autoplay={false} type="card" cardScale={0.8}>
        {slides}
      </Carousel>,
    );
    expect(view.container.firstChild).toHaveClass('el-carousel--card');
    const first = screen.getByText('内容一').closest('.el-carousel__item'),
      second = screen.getByText('内容二').closest('.el-carousel__item');
    expect(first).toHaveClass('el-carousel__item--card', 'is-active', 'is-in-stage');
    expect(first).toHaveStyle({ transform: 'translateX(150px) scale(1)' });
    expect(second).toHaveStyle({ transform: 'translateX(330px) scale(0.8)' });
    expect(second?.querySelector('.el-carousel__mask')).toBeInTheDocument();
    fireEvent.click(second!);
    expect(second).toHaveClass('is-active');
    expect(second?.querySelector('.el-carousel__mask')).toBeNull();
  },
);
apiTest(
  'carousel',
  'Carousel Attributes',
  ['direction'],
  'carousel-basic',
  '垂直方向位移和外置指示器',
  () => {
    const view = render(
      <Carousel autoplay={false} direction="vertical" indicatorPosition="outside">
        {slides}
      </Carousel>,
    );
    expect(view.container.firstChild).toHaveClass('el-carousel--vertical', 'is-vertical-outside');
    expect(screen.queryByRole('button', { name: 'Next slide' })).toBeNull();
    expect(screen.getByText('内容二').closest('.el-carousel__item')).toHaveStyle({
      transform: 'translateY(240px) scale(1)',
    });
    expect(view.container.querySelector('ul')).toHaveClass(
      'el-carousel__indicators--vertical',
      'el-carousel__indicators--right',
    );
  },
);
apiTest(
  'carousel',
  'Carousel Attributes',
  ['motion-blur'],
  'carousel-basic',
  '过渡开始时启用方向对应模糊且结束后移除',
  () => {
    const view = render(
      <Carousel autoplay={false} motionBlur>
        {slides}
      </Carousel>,
    );
    const body = view.container.querySelector('.el-carousel__container')!;
    fireEvent(body, new Event('transitionstart', { bubbles: true }));
    expect(body).toHaveClass('el-transitioning');
    expect(body.getAttribute('style')).toContain('filter: url(');
    expect(view.container.querySelector('feGaussianBlur')).toHaveAttribute('stdDeviation', '12,0');
    fireEvent(body, new Event('transitionend', { bubbles: true }));
    expect(body).not.toHaveClass('el-transitioning');
    view.rerender(
      <Carousel autoplay={false} motionBlur direction="vertical">
        {slides}
      </Carousel>,
    );
    expect(view.container.querySelector('feGaussianBlur')).toHaveAttribute('stdDeviation', '0,10');
  },
);
apiTest('carousel', 'Carousel Events', ['change'], 'carousel-basic', '仅索引改变通知当前及旧索引', () => {
  const change = vi.fn(),
    ref = createRef<CarouselHandle>();
  render(
    <Carousel autoplay={false} ref={ref} onChange={change}>
      {slides}
    </Carousel>,
  );
  expect(change).not.toHaveBeenCalled();
  act(() => ref.current?.next());
  expect(change).toHaveBeenCalledExactlyOnceWith(1, 0);
  act(() => ref.current?.setActiveItem(1));
  expect(change).toHaveBeenCalledOnce();
});
apiTest(
  'carousel',
  'Carousel Exposes',
  ['activeIndex', 'setActiveItem', 'prev', 'next'],
  'carousel-basic',
  '引用按索引或名称切换，拒绝无效值且支持循环',
  () => {
    const ref = createRef<CarouselHandle>();
    render(
      <Carousel autoplay={false} ref={ref}>
        {slides}
      </Carousel>,
    );
    act(() => ref.current?.setActiveItem('third'));
    expect(ref.current?.activeIndex).toBe(2);
    act(() => ref.current?.next());
    expect(ref.current?.activeIndex).toBe(0);
    act(() => ref.current?.prev());
    expect(ref.current?.activeIndex).toBe(2);
    act(() => ref.current?.setActiveItem('invalid'));
    expect(ref.current?.activeIndex).toBe(2);
    act(() => ref.current?.setActiveItem(1.5));
    expect(ref.current?.activeIndex).toBe(2);
    act(() => {
      if (ref.current) ref.current.activeIndex = 0;
    });
    expect(ref.current?.activeIndex).toBe(0);
  },
);
apiTest(
  'carousel',
  'Carousel-Item Attributes',
  ['name', 'label'],
  'carousel-basic',
  '标签文字与按name定位',
  () => {
    const ref = createRef<CarouselHandle>();
    render(
      <Carousel autoplay={false} ref={ref}>
        {slides}
      </Carousel>,
    );
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveTextContent('二');
    act(() => ref.current?.setActiveItem('second'));
    expect(screen.getByText('内容二').closest('.el-carousel__item')).toHaveClass('is-active');
  },
);
apiTest(
  'carousel',
  'Carousel Slots',
  ['default'],
  'carousel-basic',
  'Fragment中声明的轮播项按顺序收集',
  () => {
    const view = render(
      <Carousel autoplay={false}>
        <Fragment>{slides}</Fragment>
      </Carousel>,
    );
    expect(view.container.querySelectorAll('.el-carousel__item')).toHaveLength(3);
  },
);
apiTest('carousel', 'Carousel-Item Slots', ['default'], 'carousel-basic', '轮播项保留内容节点', () => {
  render(
    <Carousel autoplay={false}>
      <CarouselItem>
        <strong>自定义内容</strong>
      </CarouselItem>
    </Carousel>,
  );
  expect(screen.getByText('自定义内容').tagName).toBe('STRONG');
});
featureTest(
  'carousel',
  'two-item-loop',
  'carousel-basic',
  '双项循环复制用于无缝过渡，外部索引保持两项范围',
  () => {
    const ref = createRef<CarouselHandle>(),
      change = vi.fn();
    const view = render(
      <Carousel autoplay={false} ref={ref} onChange={change}>
        <CarouselItem>A</CarouselItem>
        <CarouselItem>B</CarouselItem>
      </Carousel>,
    );
    expect(view.container.querySelectorAll('.el-carousel__item')).toHaveLength(4);
    act(() => ref.current?.next());
    expect(ref.current?.activeIndex).toBe(1);
    act(() => ref.current?.next());
    expect(ref.current?.activeIndex).toBe(0);
    expect(change).toHaveBeenLastCalledWith(0, 1);
    expect(screen.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(2);
  },
);
featureTest('carousel', 'auto-height', 'carousel-basic', 'auto高度随当前轮播项测量更新', () => {
  const ref = createRef<CarouselHandle>(),
    view = render(
      <Carousel ref={ref} autoplay={false} height="auto">
        {slides}
      </Carousel>,
    );
  const second = screen.getByText('内容二').closest('.el-carousel__item')!;
  Object.defineProperty(second, 'offsetHeight', { value: 320 });
  act(() => ref.current?.next());
  expect(view.container.querySelector('.el-carousel__container')).toHaveStyle({
    height: '320px',
    overflow: 'hidden',
  });
});
featureTest('carousel', 'timer-cleanup', 'carousel-basic', '手动切换重置计时并在卸载释放计时器', () => {
  vi.useFakeTimers();
  const change = vi.fn(),
    ref = createRef<CarouselHandle>();
  const view = render(
    <Carousel ref={ref} interval={100} onChange={change}>
      {slides}
    </Carousel>,
  );
  act(() => vi.advanceTimersByTime(60));
  act(() => ref.current?.next());
  act(() => vi.advanceTimersByTime(60));
  expect(ref.current?.activeIndex).toBe(1);
  act(() => vi.advanceTimersByTime(40));
  expect(ref.current?.activeIndex).toBe(2);
  view.unmount();
  change.mockClear();
  act(() => vi.runOnlyPendingTimers());
  expect(change).not.toHaveBeenCalled();
});
featureTest(
  'carousel',
  'hover-policy',
  'carousel-basic',
  'pauseOnHover=false保持播放，悬停指示器可切换',
  () => {
    vi.useFakeTimers();
    const ref = createRef<CarouselHandle>(),
      view = render(
        <Carousel ref={ref} interval={100} pauseOnHover={false}>
          {slides}
        </Carousel>,
      );
    fireEvent.mouseEnter(view.container.firstChild!);
    act(() => vi.advanceTimersByTime(100));
    expect(ref.current?.activeIndex).toBe(1);
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Go to slide 3' }).closest('li')!);
    expect(ref.current?.activeIndex).toBe(2);
  },
);
