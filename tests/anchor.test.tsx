import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, vi } from 'vitest';
import { Anchor, AnchorLink } from '../packages/element-react';
import type { AnchorHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
afterEach(() => vi.useRealTimers());
/** 构造有实际滚动范围的局部容器，不依赖jsdom的零布局值。 */
function hostFixture() {
  const host = document.createElement('div');
  host.id = 'anchor-scroll-test';
  document.body.append(host);
  Object.defineProperties(host, { scrollHeight: { value: 1000 }, clientHeight: { value: 200 } });
  vi.spyOn(host, 'getBoundingClientRect').mockReturnValue({
    top: 20,
    left: 0,
    width: 300,
    height: 200,
    bottom: 220,
    right: 300,
    x: 0,
    y: 20,
    toJSON: () => ({}),
  });
  for (const [id, top] of [
    ['first', 0],
    ['second', 300],
    ['third', 600],
  ] as const) {
    const section = document.createElement('section');
    section.id = `anchor-test-${id}`;
    vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => ({
      top: 20 + top - host.scrollTop,
      bottom: 120 + top - host.scrollTop,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 20 + top - host.scrollTop,
      toJSON: () => ({}),
    }));
    host.append(section);
  }
  return host;
}
apiTest(
  'anchor',
  'Anchor Attributes',
  ['container', 'offset', 'duration'],
  'anchor-basic',
  '局部容器定位考虑偏移和最大滚动范围',
  () => {
    const host = hostFixture();
    const view = render(
      <Anchor container={host} offset={20} duration={0} onClick={(event) => event.preventDefault()}>
        <AnchorLink href="#anchor-test-second" title="第二节" />
      </Anchor>,
    );
    fireEvent.click(screen.getByRole('link', { name: '第二节' }));
    expect(host.scrollTop).toBe(280);
    expect(screen.getByRole('link')).toHaveClass('is-active');
    view.unmount();
    host.remove();
  },
);
apiTest(
  'anchor',
  'Anchor Attributes',
  ['bound', 'select-scroll-top'],
  'anchor-basic',
  '顶部选中策略与章节阈值',
  () => {
    vi.useFakeTimers();
    const host = hostFixture();
    const view = render(
      <Anchor container={host} selectScrollTop bound={15}>
        <AnchorLink href="#anchor-test-first" title="第一节" />
        <AnchorLink href="#anchor-test-second" title="第二节" />
      </Anchor>,
    );
    expect(screen.getByRole('link', { name: '第一节' })).toHaveClass('is-active');
    host.scrollTop = 286;
    fireEvent.scroll(host);
    act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('link', { name: '第二节' })).toHaveClass('is-active');
    host.scrollTop = 0;
    fireEvent.scroll(host);
    act(() => vi.advanceTimersByTime(20));
    expect(screen.getByRole('link', { name: '第一节' })).toHaveClass('is-active');
    view.rerender(
      <Anchor container={host} selectScrollTop={false}>
        <AnchorLink href="#anchor-test-first" title="第一节" />
      </Anchor>,
    );
    expect(screen.getByRole('link')).not.toHaveClass('is-active');
    view.unmount();
    host.remove();
  },
);
apiTest(
  'anchor',
  'Anchor Attributes',
  ['marker', 'type', 'direction'],
  'anchor-basic',
  '标记开关、水平目录与下划线样式',
  () => {
    const view = render(
      <Anchor direction="horizontal" type="underline" marker={false}>
        <AnchorLink title="项目" href="#missing" renderSubLink={<span>子目录</span>} />
      </Anchor>,
    );
    expect(view.container.firstChild).toHaveClass('el-anchor--horizontal', 'el-anchor--underline');
    expect(view.container.querySelector('.el-anchor__marker')).toBeNull();
    expect(screen.queryByText('子目录')).toBeNull();
    view.rerender(
      <Anchor direction="vertical">
        <AnchorLink title="项目" renderSubLink={<span>子目录</span>} />
      </Anchor>,
    );
    expect(view.container.querySelector('.el-anchor__marker')).toBeInTheDocument();
    expect(screen.getByText('子目录')).toBeInTheDocument();
  },
);
apiTest(
  'anchor',
  'Anchor Events',
  ['change', 'click'],
  'anchor-basic',
  '重复点击发click但不重复change',
  () => {
    const host = hostFixture(),
      change = vi.fn(),
      click = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const view = render(
      <Anchor container="#anchor-scroll-test" duration={0} onChange={change} onClick={click}>
        <AnchorLink href="#anchor-test-second" title="第二节" />
      </Anchor>,
    );
    const link = screen.getByRole('link');
    fireEvent.click(link);
    fireEvent.click(link);
    expect(change).toHaveBeenCalledExactlyOnceWith('#anchor-test-second');
    expect(click).toHaveBeenCalledTimes(2);
    expect(click.mock.calls[0][0]).toHaveProperty('type', 'click');
    view.unmount();
    host.remove();
  },
);
apiTest('anchor', 'Anchor Exposes', ['scrollTo'], 'anchor-basic', '公开滚动方法支持空值与缺失目标', () => {
  const host = hostFixture(),
    ref = createRef<AnchorHandle>();
  const view = render(
    <Anchor ref={ref} container={() => host} duration={0}>
      <AnchorLink href="#anchor-test-third" title="第三节" />
    </Anchor>,
  );
  act(() => ref.current?.scrollTo());
  expect(host.scrollTop).toBe(0);
  act(() => ref.current?.scrollTo('#not-existing'));
  expect(host.scrollTop).toBe(0);
  act(() => ref.current?.scrollTo('#anchor-test-third'));
  expect(host.scrollTop).toBe(600);
  expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'location');
  view.unmount();
  host.remove();
});
apiTest('anchor', 'AnchorLink Attributes', ['title', 'href'], 'anchor-basic', '原生href与标题', () => {
  render(
    <Anchor>
      <AnchorLink title="原生标题" href="#heading" />
    </Anchor>,
  );
  expect(screen.getByRole('link', { name: '原生标题' })).toHaveAttribute('href', '#heading');
});
apiTest('anchor', 'Anchor Slots', ['default'], 'anchor-basic', '目录默认内容', () => {
  render(
    <Anchor>
      <span>目录内容</span>
    </Anchor>,
  );
  expect(screen.getByText('目录内容').parentElement).toHaveClass('el-anchor__list');
});
apiTest(
  'anchor',
  'AnchorLink Slots',
  ['default', 'sub-link'],
  'anchor-basic',
  '链接内容覆盖标题且支持嵌套目录',
  () => {
    render(
      <Anchor>
        <AnchorLink title="原始标题" renderSubLink={<AnchorLink title="嵌套链接" href="#sub" />}>
          <strong>自定义链接</strong>
        </AnchorLink>
      </Anchor>,
    );
    expect(screen.getByText('自定义链接').tagName).toBe('STRONG');
    expect(screen.queryByText('原始标题')).toBeNull();
    expect(screen.getByRole('link', { name: '嵌套链接' }).closest('.el-anchor__list')).toBeInTheDocument();
  },
);
featureTest('anchor', 'cancel-animation', 'anchor-basic', '新点击取消旧动画且卸载释放滚动监听', () => {
  vi.useFakeTimers();
  const host = hostFixture(),
    change = vi.fn();
  const view = render(
    <Anchor container={host} duration={100} onChange={change} onClick={(event) => event.preventDefault()}>
      <AnchorLink title="第一" href="#anchor-test-second" />
      <AnchorLink title="第二" href="#anchor-test-third" />
    </Anchor>,
  );
  fireEvent.click(screen.getByRole('link', { name: '第一' }));
  act(() => vi.advanceTimersByTime(48));
  fireEvent.click(screen.getByRole('link', { name: '第二' }));
  act(() => vi.advanceTimersByTime(150));
  expect(host.scrollTop).toBe(600);
  view.unmount();
  change.mockClear();
  host.scrollTop = 0;
  fireEvent.scroll(host);
  act(() => vi.runOnlyPendingTimers());
  expect(change).not.toHaveBeenCalled();
  host.remove();
});
