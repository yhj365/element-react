import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { PageHeader, Step, Steps, Rate, Pagination } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

apiTest(
  'page-header',
  'Attributes',
  ['icon', 'title', 'content'],
  'page-header-basic',
  '页头图标标题和内容',
  () => {
    render(<PageHeader icon={<span>图标</span>} title="返回列表" content="项目详情" />);
    expect(screen.getByRole('button')).toHaveTextContent('返回列表');
    expect(screen.getByText('项目详情')).toHaveClass('el-page-header__content');
    expect(screen.getByText('图标')).toBeInTheDocument();
  },
);
apiTest('page-header', 'Events', ['back'], 'page-header-basic', '返回动作可鼠标和键盘触发', () => {
  const back = vi.fn();
  render(<PageHeader onBack={back} />);
  fireEvent.click(screen.getByRole('button'));
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  expect(back).toHaveBeenCalledTimes(2);
});
apiTest(
  'page-header',
  'Slots',
  ['icon', 'title', 'content', 'extra', 'breadcrumb', 'default'],
  'page-header-basic',
  '页头所有内容区域',
  () => {
    render(
      <PageHeader
        renderIcon="自定义图标"
        renderTitle="自定义标题"
        renderContent="自定义内容"
        renderExtra="额外动作"
        renderBreadcrumb="路径"
      >
        正文
      </PageHeader>,
    );
    for (const text of ['自定义图标', '自定义标题', '自定义内容', '额外动作', '路径', '正文'])
      expect(screen.getByText(text)).toBeInTheDocument();
    expect(document.querySelector('.el-page-header')).toHaveClass(
      'is-contentful',
      'el-page-header--has-extra',
      'el-page-header--has-breadcrumb',
    );
  },
);
apiTest(
  'steps',
  'Steps Attributes',
  ['space', 'direction', 'active', 'process-status', 'finish-status', 'align-center', 'simple'],
  'steps-basic',
  '步骤进度方向及状态',
  () => {
    const { rerender } = render(
      <Steps
        active={1}
        space={100}
        direction="vertical"
        processStatus="error"
        finishStatus="success"
        alignCenter
      >
        <Step title="一" />
        <Step title="二" />
        <Step title="三" />
      </Steps>,
    );
    expect(document.querySelector('.el-steps')).toHaveClass('el-steps--vertical');
    expect(screen.getByText('一')).toHaveClass('is-success');
    expect(screen.getByText('二')).toHaveClass('is-error');
    expect(screen.getByText('三')).toHaveClass('is-wait');
    expect(document.querySelector('.el-step')).toHaveStyle({ 'flex-basis': '100px' });
    expect(document.querySelector('.el-step')).toHaveClass('is-center');
    rerender(
      <Steps simple>
        <Step title="一" />
        <Step title="二" />
      </Steps>,
    );
    expect(document.querySelector('.el-steps')).toHaveClass('el-steps--simple');
    expect(document.querySelector('.el-step__arrow')).not.toBeNull();
  },
);
apiTest(
  'steps',
  'Steps Events',
  ['change'],
  'steps-basic',
  'active变化事件保留旧值，不在初始挂载发出',
  () => {
    const change = vi.fn();
    const { rerender } = render(
      <Steps active={0} onChange={change}>
        <Step title="一" />
      </Steps>,
    );
    expect(change).not.toHaveBeenCalled();
    rerender(
      <Steps active={1} onChange={change}>
        <Step title="一" />
      </Steps>,
    );
    expect(change).toHaveBeenCalledWith(1, 0);
  },
);
apiTest('steps', 'Steps Slots', ['default'], 'steps-basic', '步骤子组件', () => {
  render(
    <Steps>
      <Step title="第一步" />
      <Step title="第二步" />
    </Steps>,
  );
  expect(document.querySelectorAll('.el-step')).toHaveLength(2);
});
apiTest(
  'steps',
  'Step Attributes',
  ['title', 'description', 'icon', 'status'],
  'steps-basic',
  '步骤单项覆盖状态和图标',
  () => {
    render(
      <Steps>
        <Step title="步骤标题" description="步骤描述" status="error" icon={<span>自定义图标</span>} />
      </Steps>,
    );
    expect(screen.getByText('步骤标题')).toHaveClass('is-error');
    expect(screen.getByText('步骤描述')).toHaveClass('el-step__description');
    expect(screen.getByText('自定义图标')).toBeInTheDocument();
  },
);
apiTest('steps', 'Step Slots', ['icon', 'title', 'description'], 'steps-basic', '步骤内容区域', () => {
  render(
    <Steps>
      <Step renderIcon="图标区域" renderTitle="标题区域" renderDescription="描述区域" />
    </Steps>,
  );
  for (const text of ['图标区域', '标题区域', '描述区域']) expect(screen.getByText(text)).toBeInTheDocument();
});
apiTest(
  'rate',
  'Attributes',
  ['model-value', 'max', 'size', 'disabled', 'allow-half', 'clearable', 'aria-label', 'id'],
  'rate-basic',
  '评分边界键盘半星和禁用',
  () => {
    const update = vi.fn();
    const { rerender } = render(
      <Rate
        value={2}
        max={6}
        size="small"
        allowHalf
        clearable
        id="score"
        ariaLabel="评价"
        onValueChange={update}
      />,
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemax', '6');
    expect(slider).toHaveAttribute('id', 'score');
    expect(slider).toHaveClass('el-rate--small');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(update).toHaveBeenCalledWith(2.5);
    fireEvent.click(document.querySelectorAll('.el-rate__item')[1]);
    expect(update).toHaveBeenLastCalledWith(0);
    rerender(<Rate disabled value={2} onValueChange={update} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(update).toHaveBeenCalledTimes(2);
  },
);
apiTest(
  'rate',
  'Attributes',
  ['low-threshold', 'high-threshold', 'colors', 'void-color', 'disabled-void-color', 'text-color'],
  'rate-basic',
  '评分阈值和颜色变量',
  () => {
    const { rerender } = render(
      <Rate
        value={1}
        colors={['red', 'orange', 'green']}
        lowThreshold={2}
        highThreshold={4}
        voidColor="gray"
        disabledVoidColor="silver"
        textColor="blue"
      />,
    );
    expect(document.querySelector('.el-rate__icon')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(screen.getByRole('slider')).toHaveStyle({
      '--el-rate-void-color': 'gray',
      '--el-rate-disabled-void-color': 'silver',
      '--el-rate-text-color': 'blue',
    });
    rerender(<Rate value={5} colors={{ 2: 'red', 4: { value: 'orange', excluded: true }, 5: 'green' }} />);
    expect(document.querySelector('.el-rate__icon')).toHaveStyle({ color: 'rgb(0, 128, 0)' });
  },
);
apiTest(
  'rate',
  'Attributes',
  ['icons', 'void-icon', 'disabled-void-icon', 'show-text', 'show-score', 'texts', 'score-template'],
  'rate-basic',
  '评分图标与文字模板',
  () => {
    const { rerender } = render(
      <Rate
        value={1}
        icons={['低', '中', '高']}
        voidIcon="空"
        showText
        texts={['差', '一般', '好', '很好', '极好']}
      />,
    );
    expect(screen.getByText('差')).toBeInTheDocument();
    expect(screen.getAllByText('空')).toHaveLength(4);
    expect(screen.getByText('低')).toBeInTheDocument();
    rerender(<Rate value={3.7} disabled disabledVoidIcon="禁用空" showScore scoreTemplate="{value} 分" />);
    expect(screen.getByText('3.7 分')).toBeInTheDocument();
    expect(screen.getAllByText('禁用空').length).toBeGreaterThan(0);
  },
);
apiTest('rate', 'Events', ['change'], 'rate-basic', '评分变更只通知真实变化', () => {
  const change = vi.fn();
  render(<Rate defaultValue={1} onChange={change} />);
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
  expect(change).toHaveBeenCalledWith(2);
  fireEvent.click(document.querySelectorAll('.el-rate__item')[1]);
  expect(change).toHaveBeenCalledTimes(1);
});
apiTest(
  'rate',
  'Exposes',
  ['setCurrentValue', 'resetCurrentValue'],
  'rate-basic',
  '实例预览不提交绑定值',
  () => {
    const ref = createRef<{ setCurrentValue: (value: number) => void; resetCurrentValue: () => void }>();
    const update = vi.fn();
    render(
      <Rate value={1} ref={ref} onValueChange={update} showText texts={['一', '二', '三', '四', '五']} />,
    );
    act(() => ref.current?.setCurrentValue(3));
    expect(screen.getByText('三')).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
    act(() => ref.current?.resetCurrentValue());
    expect(screen.getByText('一')).toBeInTheDocument();
  },
);
apiTest(
  'pagination',
  'Attributes',
  [
    'size',
    'background',
    'page-size',
    'default-page-size',
    'total',
    'page-count',
    'pager-count',
    'current-page',
    'default-current-page',
    'layout',
    'prev-text',
    'next-text',
    'disabled',
    'hide-on-single-page',
    'small',
  ],
  'pagination-basic',
  '分页模型和布局',
  () => {
    const { rerender } = render(
      <Pagination
        defaultCurrentPage={2}
        defaultPageSize={20}
        total={100}
        pagerCount={5}
        background
        size="small"
        layout="prev,pager,next,total"
        prevText="上一页"
        nextText="下一页"
      />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('is-background', 'el-pagination--small');
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Total 100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveTextContent('上一页');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveTextContent('下一页');
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    rerender(<Pagination disabled small pageCount={3} currentPage={3} pageSize={50} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    rerender(<Pagination hideOnSinglePage total={0} />);
    expect(screen.queryByRole('navigation')).toBeNull();
  },
);
apiTest(
  'pagination',
  'Events',
  ['current-change', 'change', 'prev-click', 'next-click'],
  'pagination-basic',
  '分页事件与父级拒绝回写',
  () => {
    const request = vi.fn(),
      current = vi.fn(),
      change = vi.fn(),
      prev = vi.fn(),
      next = vi.fn();
    render(
      <Pagination
        currentPage={2}
        total={100}
        onCurrentPageChange={request}
        onCurrentChange={current}
        onChange={change}
        onPrevClick={prev}
        onNextClick={next}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(request).toHaveBeenCalledWith(3);
    expect(current).toHaveBeenCalledWith(3);
    expect(change).toHaveBeenCalledWith(3, 10);
    expect(next).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(prev).toHaveBeenCalledWith(1);
  },
);
apiTest('pagination', 'Attributes', ['page-sizes'], 'pagination-basic', '页大小选项与页码收缩', () => {
  const update = vi.fn(),
    page = vi.fn();
  render(
    <Pagination
      defaultCurrentPage={8}
      total={100}
      pageSizes={[10, 50]}
      layout="sizes,pager"
      onPageSizeChange={update}
      onCurrentPageChange={page}
    />,
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '50' } });
  expect(update).toHaveBeenCalledWith(50);
  expect(page).toHaveBeenCalledWith(2);
  expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
});
apiTest('pagination', 'Events', ['size-change'], 'pagination-basic', '页大小语义事件', () => {
  const change = vi.fn();
  render(<Pagination total={100} pageSizes={[10, 20]} layout="sizes" onSizeChange={change} />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '20' } });
  expect(change).toHaveBeenCalledWith(20);
});
apiTest('pagination', 'Slots', ['default'], 'pagination-basic', '布局slot位置', () => {
  render(
    <Pagination layout="prev,slot,next">
      <span>自定义分页内容</span>
    </Pagination>,
  );
  expect(screen.getByText('自定义分页内容')).toBeInTheDocument();
});
featureTest('pagination', 'pager-more-and-jump', 'pagination-basic', '省略号和跳页边界', () => {
  const request = vi.fn();
  render(<Pagination defaultCurrentPage={1} total={1000} onCurrentPageChange={request} />);
  fireEvent.click(screen.getByRole('button', { name: 'Next pages' }));
  expect(request).toHaveBeenCalledWith(6);
  const jump = screen.getByRole('spinbutton', { name: 'Go to page' });
  fireEvent.change(jump, { target: { value: '999' } });
  fireEvent.keyDown(jump, { key: 'Enter' });
  expect(request).toHaveBeenLastCalledWith(100);
});
