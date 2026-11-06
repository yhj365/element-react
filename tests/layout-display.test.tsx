import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, vi } from 'vitest';
import {
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Col,
  Container,
  Countdown,
  Footer,
  Header,
  Main,
  Progress,
  Row,
  Skeleton,
  SkeletonItem,
  Space,
  Statistic,
  Timeline,
  TimelineItem,
} from '../packages/element-react';
import { apiTest, featureTest } from './contract';

afterEach(() => vi.useRealTimers());

featureTest('skeleton', 'leading-trailing', 'skeleton-basic', '对象延迟配置、结束延迟和快速反向切换', () => {
  vi.useFakeTimers();
  const throttle = { leading: 100, trailing: 200, initVal: false };
  const { rerender, unmount } = render(
    <Skeleton loading throttle={throttle}>
      实际内容
    </Skeleton>,
  );
  expect(screen.getByText('实际内容')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(100));
  expect(document.querySelector('.el-skeleton')).not.toBeNull();
  rerender(
    <Skeleton loading={false} throttle={throttle}>
      实际内容
    </Skeleton>,
  );
  act(() => vi.advanceTimersByTime(199));
  expect(document.querySelector('.el-skeleton')).not.toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByText('实际内容')).toBeInTheDocument();
  rerender(
    <Skeleton loading throttle={throttle}>
      实际内容
    </Skeleton>,
  );
  rerender(
    <Skeleton loading={false} throttle={throttle}>
      实际内容
    </Skeleton>,
  );
  act(() => vi.advanceTimersByTime(300));
  expect(document.querySelector('.el-skeleton')).toBeNull();
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

describe('布局', () => {
  apiTest(
    'layout',
    'Row Attributes',
    ['gutter', 'justify', 'align', 'tag'],
    'layout-grid',
    '行间距与对齐',
    () => {
      render(
        <Row tag="section" gutter={20} justify="space-between" align="middle">
          <Col>内容</Col>
        </Row>,
      );
      const row = document.querySelector('.el-row');
      expect(row?.tagName).toBe('SECTION');
      expect(row).toHaveStyle({ 'margin-left': '-10px', 'margin-right': '-10px' });
      expect(row).toHaveClass('is-justify-space-between', 'is-align-middle');
      expect(screen.getByText('内容')).toHaveStyle({ 'padding-left': '10px', 'padding-right': '10px' });
    },
  );
  apiTest('layout', 'Row Slots', ['default'], 'layout-grid', '行内容', () => {
    render(
      <Row>
        <Col>列</Col>
      </Row>,
    );
    expect(screen.getByText('列').parentElement).toHaveClass('el-row');
  });
  apiTest(
    'layout',
    'Col Attributes',
    ['span', 'offset', 'pull', 'push', 'tag', 'xs', 'sm', 'md', 'lg', 'xl'],
    'layout-responsive',
    '24栅格及全部断点',
    () => {
      render(
        <Col
          tag="article"
          span={12}
          offset={1}
          pull={2}
          push={3}
          xs={24}
          sm={12}
          md={{ span: 8, offset: 2 }}
          lg={{ pull: 1 }}
          xl={{ push: 2 }}
        >
          响应式列
        </Col>,
      );
      expect(screen.getByText('响应式列').tagName).toBe('ARTICLE');
      expect(screen.getByText('响应式列')).toHaveClass(
        'el-col-12',
        'el-col-offset-1',
        'el-col-pull-2',
        'el-col-push-3',
        'el-col-xs-24',
        'el-col-sm-12',
        'el-col-md-8',
        'el-col-md-offset-2',
        'el-col-lg-pull-1',
        'el-col-xl-push-2',
      );
    },
  );
  apiTest('layout', 'Col Slots', ['default'], 'layout-grid', '列内容', () => {
    render(
      <Col>
        <b>内容</b>
      </Col>,
    );
    expect(screen.getByText('内容').parentElement).toHaveClass('el-col-24');
  });
  apiTest('container', 'Container Attributes', ['direction'], 'container-basic', '容器方向推断与覆盖', () => {
    const { rerender } = render(
      <Container>
        <Header>顶部</Header>
        <Main>内容</Main>
      </Container>,
    );
    expect(document.querySelector('.el-container')).toHaveClass('is-vertical');
    rerender(
      <Container direction="horizontal">
        <Header>顶部</Header>
        <Main>内容</Main>
      </Container>,
    );
    expect(document.querySelector('.el-container')).not.toHaveClass('is-vertical');
  });
  apiTest('container', 'Header Attributes', ['height'], 'container-basic', '顶部高度', () => {
    render(<Header height="80px">顶</Header>);
    expect(screen.getByText('顶')).toHaveStyle({ '--el-header-height': '80px' });
  });
  apiTest('container', 'Footer Attributes', ['height'], 'container-basic', '底部高度', () => {
    render(<Footer height="40px">底</Footer>);
    expect(screen.getByText('底')).toHaveStyle({ '--el-footer-height': '40px' });
  });
  apiTest('container', 'Aside Attributes', ['width'], 'container-basic', '侧栏宽度', () => {
    render(<Aside width="180px">侧栏</Aside>);
    expect(screen.getByText('侧栏')).toHaveStyle({ '--el-aside-width': '180px' });
  });
  for (const [section, Component] of [
    ['Container Slots', Container],
    ['Header Slots', Header],
    ['Footer Slots', Footer],
    ['Aside Slots', Aside],
    ['Main Slots', Main],
  ] as const)
    apiTest('container', section, ['default'], 'container-basic', section, () => {
      render(<Component>区域内容</Component>);
      expect(screen.getByText('区域内容')).toBeInTheDocument();
    });
  apiTest(
    'space',
    'Attributes',
    ['direction', 'size', 'wrap', 'alignment', 'spacer', 'fill', 'fill-ratio', 'class', 'style'],
    'space-basic',
    '间距换行分隔和填充',
    () => {
      render(
        <Space
          direction="vertical"
          size={[12, 20]}
          wrap
          alignment="start"
          spacer="|"
          fill
          fillRatio={40}
          className="custom-space"
          style={{ color: 'red' }}
        >
          <Button>一</Button>
          <Button>二</Button>
        </Space>,
      );
      const root = document.querySelector('.el-space');
      expect(root).toHaveClass('el-space--vertical', 'custom-space');
      expect(root).toHaveStyle({
        gap: '20px 12px',
        'flex-wrap': 'wrap',
        'align-items': 'start',
        color: 'rgb(255, 0, 0)',
      });
      expect(screen.getByText('|')).toBeInTheDocument();
      expect(screen.getByText('一').closest('.el-space__item')).toHaveStyle({
        'flex-grow': 1,
        'min-width': '40%',
      });
    },
  );
  apiTest('space', 'Slots', ['default'], 'space-basic', '间距包裹节点', () => {
    render(
      <Space>
        <b>甲</b>
        <b>乙</b>
      </Space>,
    );
    expect(document.querySelectorAll('.el-space__item')).toHaveLength(2);
  });
});

describe('进度和占位', () => {
  apiTest(
    'skeleton',
    'Skeleton Attributes',
    ['loading', 'rows', 'count', 'animated'],
    'skeleton-basic',
    '骨架数量行数及状态',
    () => {
      const { rerender } = render(
        <Skeleton rows={2} count={2} animated>
          实际内容
        </Skeleton>,
      );
      expect(document.querySelector('.el-skeleton')).toHaveClass('is-animated');
      expect(document.querySelectorAll('.el-skeleton__p')).toHaveLength(6);
      expect(screen.queryByText('实际内容')).not.toBeInTheDocument();
      rerender(<Skeleton loading={false}>实际内容</Skeleton>);
      expect(screen.getByText('实际内容')).toBeInTheDocument();
    },
  );
  apiTest('skeleton', 'Skeleton Attributes', ['throttle'], 'skeleton-basic', '延迟出现与定时清理', () => {
    vi.useFakeTimers();
    const { unmount } = render(<Skeleton throttle={300} />);
    expect(document.querySelector('.el-skeleton')).toBeNull();
    act(() => vi.advanceTimersByTime(299));
    expect(document.querySelector('.el-skeleton')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(document.querySelector('.el-skeleton')).not.toBeNull();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  apiTest(
    'skeleton',
    'Skeleton Slots',
    ['default', 'template'],
    'skeleton-basic',
    '模板与加载结束内容',
    () => {
      const { rerender } = render(<Skeleton renderTemplate={<span>占位模板</span>}>内容</Skeleton>);
      expect(screen.getByText('占位模板')).toBeInTheDocument();
      rerender(
        <Skeleton loading={false} renderTemplate="占位模板">
          内容
        </Skeleton>,
      );
      expect(screen.getByText('内容')).toBeInTheDocument();
      expect(screen.queryByText('占位模板')).toBeNull();
    },
  );
  apiTest('skeleton', 'SkeletonItem Attributes', ['variant'], 'skeleton-basic', '占位形状', () => {
    render(<SkeletonItem variant="circle" />);
    expect(document.querySelector('.el-skeleton__item')).toHaveClass('el-skeleton__circle');
  });
  apiTest(
    'statistic',
    'Statistic Attributes',
    [
      'value',
      'decimal-separator',
      'group-separator',
      'precision',
      'title',
      'prefix',
      'suffix',
      'value-style',
    ],
    'statistic-basic',
    '数字格式及区域',
    () => {
      render(
        <Statistic
          value={-12345.678}
          decimalSeparator=","
          groupSeparator=" "
          precision={2}
          title="收入"
          prefix="￥"
          suffix="元"
          valueStyle={{ color: 'red' }}
        />,
      );
      expect(screen.getByText('-12 345,68')).toBeInTheDocument();
      expect(screen.getByText('收入')).toHaveClass('el-statistic__head');
      expect(screen.getByText('￥')).toHaveClass('el-statistic__prefix');
      expect(screen.getByText('元')).toHaveClass('el-statistic__suffix');
      expect(document.querySelector('.el-statistic__content')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    },
  );
  apiTest('statistic', 'Statistic Attributes', ['formatter'], 'statistic-basic', '格式化回调接收数值', () => {
    const formatter = vi.fn((value: number) => `${value}项`);
    render(<Statistic value={120} formatter={formatter} />);
    expect(formatter).toHaveBeenCalledWith(120);
    expect(screen.getByText('120项')).toBeInTheDocument();
  });
  apiTest(
    'statistic',
    'Statistic Slots',
    ['prefix', 'suffix', 'title'],
    'statistic-basic',
    '统计具名区域覆盖',
    () => {
      render(<Statistic title="旧" renderTitle="新" renderPrefix={<b>前</b>} renderSuffix={<i>后</i>} />);
      expect(screen.queryByText('旧')).toBeNull();
      expect(screen.getByText('新')).toBeInTheDocument();
      expect(screen.getByText('前').tagName).toBe('B');
      expect(screen.getByText('后').tagName).toBe('I');
    },
  );
  apiTest(
    'statistic',
    'Countdown Attributes',
    ['value', 'format'],
    'countdown-basic',
    '倒计时格式与终止',
    () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      render(<Countdown value={Date.now() + 3661000} format="HH:mm:ss" />);
      expect(screen.getByText('01:01:01')).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.getByText('01:01:00')).toBeInTheDocument();
    },
  );
  apiTest(
    'statistic',
    'Countdown Events',
    ['change', 'finish'],
    'countdown-basic',
    '完成只通知一次且卸载清理',
    () => {
      vi.useFakeTimers();
      const change = vi.fn(),
        finish = vi.fn();
      const { unmount } = render(<Countdown value={Date.now() + 1000} onChange={change} onFinish={finish} />);
      act(() => vi.advanceTimersByTime(3000));
      expect(change).toHaveBeenCalledWith(0);
      expect(finish).toHaveBeenCalledTimes(1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  apiTest(
    'progress',
    'Attributes',
    ['percentage', 'type', 'stroke-width', 'width', 'show-text', 'stroke-linecap'],
    'progress-basic',
    '线形环形尺寸与比例',
    () => {
      const { rerender } = render(<Progress percentage={64} strokeWidth={12} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '64');
      expect(document.querySelector('.el-progress-bar__inner')).toHaveStyle({ width: '64%' });
      expect(document.querySelector('.el-progress-bar__outer')).toHaveStyle({ height: '12px' });
      rerender(<Progress type="circle" width={100} percentage={50} strokeLinecap="butt" showText={false} />);
      expect(document.querySelector('.el-progress-circle')).toHaveStyle({ width: '100px' });
      expect(document.querySelector('circle')).toHaveAttribute('stroke-linecap', 'butt');
      expect(screen.queryByText('50%')).toBeNull();
    },
  );
  apiTest(
    'progress',
    'Attributes',
    ['text-inside', 'format', 'color', 'indeterminate', 'duration', 'striped', 'striped-flow'],
    'progress-basic',
    '进度文字与动画配置',
    () => {
      render(
        <Progress
          percentage={60}
          textInside
          format={(p) => `已完成${p}`}
          color={[
            { color: 'red', percentage: 50 },
            { color: 'green', percentage: 100 },
          ]}
          indeterminate
          duration={4}
          striped
          stripedFlow
        />,
      );
      expect(screen.getByText('已完成60').parentElement).toHaveClass('el-progress-bar__inner');
      expect(document.querySelector('.el-progress-bar__inner')).toHaveClass(
        'el-progress-bar__inner--indeterminate',
        'el-progress-bar__inner--striped',
        'el-progress-bar__inner--striped-flow',
      );
      expect(document.querySelector('.el-progress-bar__inner')).toHaveStyle({
        background: 'green',
        'animation-duration': '4s',
      });
    },
  );
  apiTest('progress', 'Slots', ['default'], 'progress-basic', '进度渲染函数', () => {
    render(<Progress percentage={25} renderDefault={(p) => <b>{p}份</b>} />);
    expect(screen.getByText('25份').tagName).toBe('B');
  });
  featureTest('progress', 'clamp', 'progress-basic', '进度边界与输入数组不可变', () => {
    const colors = [
      { percentage: 100, color: 'green' },
      { percentage: 50, color: 'red' },
    ];
    render(<Progress percentage={120} color={colors} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(colors[0].percentage).toBe(100);
  });
});

describe('路径和时间轴', () => {
  apiTest(
    'breadcrumb',
    'Breadcrumb Attributes',
    ['separator', 'separator-icon'],
    'breadcrumb-basic',
    '分隔符图标优先',
    () => {
      render(
        <Breadcrumb separator="/" separatorIcon="→">
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>文档</BreadcrumbItem>
        </Breadcrumb>,
      );
      expect(screen.getAllByText('→')).toHaveLength(2);
      expect(screen.queryByText('/')).toBeNull();
    },
  );
  apiTest(
    'breadcrumb',
    'BreadcrumbItem Attributes',
    ['to', 'replace'],
    'breadcrumb-basic',
    '宿主路由适配',
    () => {
      const navigate = vi.fn();
      render(
        <Breadcrumb>
          <BreadcrumbItem to="/guide" replace onNavigate={navigate}>
            指南
          </BreadcrumbItem>
        </Breadcrumb>,
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', '/guide');
      fireEvent.click(screen.getByRole('link'));
      expect(navigate).toHaveBeenCalledWith('/guide', true);
    },
  );
  for (const section of ['Breadcrumb Slots', 'BreadcrumbItem Slots'])
    apiTest('breadcrumb', section, ['default'], 'breadcrumb-basic', section, () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>路径内容</BreadcrumbItem>
        </Breadcrumb>,
      );
      expect(screen.getByText('路径内容')).toBeInTheDocument();
    });
  apiTest('timeline', 'Timeline Attributes', ['reverse'], 'timeline-basic', '反向顺序', () => {
    render(
      <Timeline reverse>
        <TimelineItem>第一项</TimelineItem>
        <TimelineItem>第二项</TimelineItem>
      </Timeline>,
    );
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('第二项');
  });
  apiTest(
    'timeline',
    'Timeline-Item Attributes',
    ['timestamp', 'hide-timestamp', 'center', 'placement', 'type', 'color', 'size', 'icon', 'hollow'],
    'timeline-basic',
    '时间节点布局',
    () => {
      const { rerender } = render(
        <TimelineItem
          timestamp="2026-11-05"
          center
          placement="top"
          type="success"
          color="red"
          size="large"
          icon={<span>完成</span>}
          hollow
        >
          任务
        </TimelineItem>,
      );
      expect(screen.getByText('2026-11-05')).toHaveClass('is-top');
      expect(document.querySelector('.el-timeline-item')).toHaveClass('el-timeline-item__center');
      expect(document.querySelector('.el-timeline-item__node')).toHaveClass(
        'el-timeline-item__node--success',
        'el-timeline-item__node--large',
        'is-hollow',
      );
      expect(document.querySelector('.el-timeline-item__node')).toHaveStyle({
        'background-color': 'rgb(255, 0, 0)',
      });
      expect(screen.getByText('完成')).toBeInTheDocument();
      rerender(<TimelineItem timestamp="隐藏时间" hideTimestamp />);
      expect(screen.queryByText('隐藏时间')).toBeNull();
    },
  );
  apiTest('timeline', 'Timeline Slots', ['default'], 'timeline-basic', '时间轴内容', () => {
    render(
      <Timeline>
        <TimelineItem>节点</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByRole('list')).toHaveClass('el-timeline');
  });
  apiTest('timeline', 'Timeline-Item Slots', ['default', 'dot'], 'timeline-basic', '自定义节点', () => {
    render(<TimelineItem renderDot={<span>节点图形</span>}>内容</TimelineItem>);
    expect(screen.getByText('节点图形').parentElement).toHaveClass('el-timeline-item__dot');
    expect(screen.getByText('内容')).toHaveClass('el-timeline-item__content');
  });
});
