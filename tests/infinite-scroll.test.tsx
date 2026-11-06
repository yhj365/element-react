import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useRef } from 'react';
import { afterEach, expect, vi } from 'vitest';
import { InfiniteScroll, useInfiniteScroll } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
afterEach(() => vi.useRealTimers());
/** 只覆盖布局尺寸，真实事件监听和回调仍由组件执行。 */
function dimensions(element: HTMLElement, scrollHeight = 500, clientHeight = 100): void {
  Object.defineProperties(element, {
    scrollHeight: { configurable: true, value: scrollHeight },
    clientHeight: { configurable: true, value: clientHeight },
  });
}
apiTest(
  'infinite-scroll',
  'Directives',
  ['v-infinite-scroll', 'infinite-scroll-distance'],
  'infinite-scroll-basic',
  '到达底部阈值才加载且向上滚动不触发',
  () => {
    const load = vi.fn(),
      ref = createRef<HTMLDivElement>();
    render(
      <InfiniteScroll
        ref={ref}
        onLoad={load}
        immediate={false}
        delay={0}
        distance={20}
        style={{ overflowY: 'auto' }}
      />,
    );
    const element = ref.current!;
    dimensions(element);
    element.scrollTop = 370;
    fireEvent.scroll(element);
    expect(load).not.toHaveBeenCalled();
    element.scrollTop = 380;
    fireEvent.scroll(element);
    expect(load).toHaveBeenCalledOnce();
    element.scrollTop = 375;
    fireEvent.scroll(element);
    expect(load).toHaveBeenCalledOnce();
  },
);
apiTest(
  'infinite-scroll',
  'Directives',
  ['infinite-scroll-disabled'],
  'infinite-scroll-basic',
  '禁用状态更新无需重复绑定监听',
  () => {
    const load = vi.fn(),
      ref = createRef<HTMLDivElement>();
    const view = render(
      <InfiniteScroll
        ref={ref}
        onLoad={load}
        immediate={false}
        delay={0}
        disabled
        style={{ overflowY: 'auto' }}
      />,
    );
    const element = ref.current!;
    dimensions(element);
    element.scrollTop = 400;
    fireEvent.scroll(element);
    expect(load).not.toHaveBeenCalled();
    view.rerender(
      <InfiniteScroll ref={ref} onLoad={load} immediate={false} delay={0} style={{ overflowY: 'auto' }} />,
    );
    fireEvent.scroll(element);
    expect(load).toHaveBeenCalledOnce();
  },
);
apiTest(
  'infinite-scroll',
  'Directives',
  ['infinite-scroll-delay'],
  'infinite-scroll-basic',
  '节流合并重复滚动且卸载取消尾沿',
  () => {
    vi.useFakeTimers();
    const load = vi.fn(),
      ref = createRef<HTMLDivElement>();
    const view = render(
      <InfiniteScroll ref={ref} onLoad={load} immediate={false} delay={100} style={{ overflowY: 'auto' }} />,
    );
    const element = ref.current!;
    dimensions(element);
    element.scrollTop = 400;
    fireEvent.scroll(element);
    fireEvent.scroll(element);
    fireEvent.scroll(element);
    expect(load).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(100));
    expect(load).toHaveBeenCalledTimes(2);
    fireEvent.scroll(element);
    view.unmount();
    act(() => vi.runOnlyPendingTimers());
    expect(load).toHaveBeenCalledTimes(2);
  },
);
apiTest(
  'infinite-scroll',
  'Directives',
  ['infinite-scroll-immediate'],
  'infinite-scroll-basic',
  '首屏不足随内容补充，填满后停止自动加载',
  async () => {
    vi.useFakeTimers();
    const load = vi.fn(),
      ref = createRef<HTMLDivElement>();
    const view = render(
      <InfiniteScroll ref={ref} onLoad={load} style={{ overflowY: 'auto' }}>
        <span key="初始">初始</span>
      </InfiniteScroll>,
    );
    const element = ref.current!;
    dimensions(element, 80, 100);
    view.rerender(
      <InfiniteScroll ref={ref} onLoad={load} style={{ overflowY: 'auto' }}>
        <span key="更新">更新</span>
      </InfiniteScroll>,
    );
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(50);
    });
    expect(load).toHaveBeenCalledOnce();
    dimensions(element, 500, 100);
    view.rerender(
      <InfiniteScroll ref={ref} onLoad={load} style={{ overflowY: 'auto' }}>
        <span key="填满">填满</span>
      </InfiniteScroll>,
    );
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(50);
    });
    expect(load).toHaveBeenCalledOnce();
    view.rerender(
      <InfiniteScroll ref={ref} onLoad={load} style={{ overflowY: 'auto' }}>
        <span key="继续内容">继续内容</span>
      </InfiniteScroll>,
    );
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(50);
    });
    expect(load).toHaveBeenCalledOnce();
  },
);
featureTest(
  'infinite-scroll',
  'nested-host',
  'infinite-scroll-basic',
  'Hook支持嵌套滚动容器并使用最新回调',
  () => {
    /** 外层容器滚动驱动内部内容的加载检查。 */
    function Example({ load }: { load: () => void }) {
      const content = useRef<HTMLDivElement>(null);
      useInfiniteScroll(content, load, { immediate: false, delay: 0 });
      return (
        <div data-testid="host" style={{ overflowY: 'auto' }}>
          <div ref={content} data-testid="content" />
        </div>
      );
    }
    const old = vi.fn(),
      next = vi.fn();
    const view = render(<Example load={old} />);
    const host = screen.getByTestId('host'),
      content = screen.getByTestId('content');
    dimensions(host);
    dimensions(content, 200, 100);
    vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({
      top: -100,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 200,
      x: 0,
      y: -100,
      toJSON: () => ({}),
    });
    view.rerender(<Example load={next} />);
    host.scrollTop = 100;
    fireEvent.scroll(host);
    expect(next).toHaveBeenCalledOnce();
    expect(old).not.toHaveBeenCalled();
  },
);
featureTest(
  'infinite-scroll',
  'reenable-fill',
  'infinite-scroll-basic',
  '从禁用恢复后补充首屏且卸载不再通知',
  () => {
    vi.useFakeTimers();
    const load = vi.fn(),
      ref = createRef<HTMLDivElement>();
    const view = render(<InfiniteScroll ref={ref} disabled onLoad={load} style={{ overflowY: 'auto' }} />);
    dimensions(ref.current!, 50, 100);
    view.rerender(<InfiniteScroll ref={ref} onLoad={load} style={{ overflowY: 'auto' }} />);
    act(() => vi.advanceTimersByTime(50));
    expect(load).toHaveBeenCalledOnce();
    view.unmount();
    act(() => vi.runOnlyPendingTimers());
    expect(load).toHaveBeenCalledOnce();
  },
);
