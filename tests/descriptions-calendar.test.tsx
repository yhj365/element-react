import { createRef } from 'react';
import dayjs from 'dayjs';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { Calendar, Descriptions, DescriptionsItem } from '../packages/element-react';
import type { CalendarHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

apiTest(
  'descriptions',
  'Descriptions Attributes',
  ['border', 'column', 'direction', 'size', 'title', 'extra', 'label-width'],
  'descriptions-basic',
  '描述表列数方向和标题',
  () => {
    const { rerender } = render(
      <Descriptions border column={2} size="small" title="标题" extra="额外内容" labelWidth={80}>
        <DescriptionsItem label="甲">A</DescriptionsItem>
        <DescriptionsItem label="乙">B</DescriptionsItem>
        <DescriptionsItem label="丙">C</DescriptionsItem>
      </Descriptions>,
    );
    expect(screen.getByRole('table')).toHaveClass('is-bordered');
    expect(document.querySelector('.el-descriptions')).toHaveClass('el-descriptions--small');
    expect(screen.getByText('标题')).toHaveClass('el-descriptions__title');
    expect(screen.getByText('额外内容')).toHaveClass('el-descriptions__extra');
    expect(screen.getByText('甲')).toHaveStyle({ width: '80px' });
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('C')).toHaveAttribute('colspan', '3');
    rerender(
      <Descriptions direction="vertical">
        <DescriptionsItem label="标签">内容</DescriptionsItem>
      </Descriptions>,
    );
    expect(screen.getByRole('columnheader')).toHaveTextContent('标签');
    expect(screen.getByText('内容')).toHaveClass('is-vertical-content');
  },
);
apiTest(
  'descriptions',
  'Descriptions Slots',
  ['default', 'title', 'extra'],
  'descriptions-basic',
  '描述表具名区域',
  () => {
    render(
      <Descriptions renderTitle={<b>自定义标题</b>} renderExtra={<button>动作</button>}>
        <DescriptionsItem label="字段">值</DescriptionsItem>
      </Descriptions>,
    );
    expect(screen.getByText('自定义标题').tagName).toBe('B');
    expect(screen.getByRole('button')).toHaveTextContent('动作');
    expect(screen.getByText('值')).toBeInTheDocument();
  },
);
apiTest(
  'descriptions',
  'DescriptionsItem Attributes',
  [
    'label',
    'span',
    'rowspan',
    'width',
    'min-width',
    'label-width',
    'align',
    'label-align',
    'class-name',
    'label-class-name',
  ],
  'descriptions-basic',
  '描述项宽度对齐跨行及样式',
  () => {
    render(
      <Descriptions border column={2}>
        <DescriptionsItem
          label="长标签"
          span={1}
          rowspan={2}
          width={160}
          minWidth={120}
          labelWidth={90}
          align="right"
          labelAlign="center"
          className="custom-value"
          labelClassName="custom-label"
        >
          跨行内容
        </DescriptionsItem>
        <DescriptionsItem label="第二项">B</DescriptionsItem>
        <DescriptionsItem label="第三项">C</DescriptionsItem>
      </Descriptions>,
    );
    expect(screen.getByText('长标签')).toHaveClass('is-center', 'custom-label');
    expect(screen.getByText('长标签')).toHaveStyle({ width: '90px', 'min-width': '120px' });
    expect(screen.getByText('跨行内容')).toHaveClass('is-right', 'custom-value');
    expect(screen.getByText('跨行内容')).toHaveAttribute('rowspan', '2');
    expect(screen.getByText('跨行内容')).toHaveStyle({ width: '160px' });
  },
);
apiTest(
  'descriptions',
  'DescriptionsItem Slots',
  ['default', 'label'],
  'descriptions-basic',
  '描述项内容区域',
  () => {
    render(
      <Descriptions>
        <DescriptionsItem label="被覆盖" renderLabel={<b>标签区域</b>}>
          <span>内容区域</span>
        </DescriptionsItem>
      </Descriptions>,
    );
    expect(screen.queryByText('被覆盖')).toBeNull();
    expect(screen.getByText('标签区域').tagName).toBe('B');
    expect(screen.getByText('内容区域')).toBeInTheDocument();
  },
);
featureTest(
  'descriptions',
  'immutable-layout',
  'descriptions-basic',
  '布局不修改React子项props，Fragment保持顺序',
  () => {
    const item = (
      <DescriptionsItem label="单项" span={1}>
        内容
      </DescriptionsItem>
    );
    render(
      <Descriptions column={3}>
        <>{item}</>
      </Descriptions>,
    );
    expect(item.props.span).toBe(1);
    expect(screen.getByRole('cell')).toHaveAttribute('colspan', '3');
  },
);
apiTest('calendar', 'Attributes', ['model-value'], 'calendar-basic', '日期受控选择和月切换', () => {
  const change = vi.fn();
  render(<Calendar value={new Date(2024, 1, 1)} onValueChange={change} />);
  fireEvent.click(screen.getByRole('button', { name: '2024-02-29' }));
  expect(change).toHaveBeenCalledWith(new Date(2024, 1, 29));
  expect(screen.getByRole('button', { name: '2024-02-01' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Next Month' }));
  expect(change).toHaveBeenLastCalledWith(new Date(2024, 2, 1));
});
apiTest('calendar', 'Attributes', ['range'], 'calendar-basic', '跨月范围按完整周展开且不重复日期', () => {
  render(<Calendar range={[new Date(2024, 0, 30), new Date(2024, 1, 28)]} />);
  expect(screen.queryByRole('button', { name: 'Next Month' })).toBeNull();
  const days = screen
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label'))
    .filter(Boolean);
  expect(new Set(days).size).toBe(days.length);
  expect(days).toContain('2024-01-30');
  expect(days).toContain('2024-02-28');
});
apiTest(
  'calendar',
  'Attributes',
  ['controller-type', 'formatter'],
  'calendar-basic',
  '年月选择控制器和格式化',
  () => {
    const change = vi.fn();
    render(
      <Calendar
        value={new Date(2024, 1, 1)}
        controllerType="select"
        formatter={(value, type) => `${type}:${value}`}
        onValueChange={change}
      />,
    );
    expect(screen.getByRole('option', { name: 'month:2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'year:2024' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Month' }), { target: { value: '3' } });
    expect(change).toHaveBeenCalledWith(new Date(2024, 2, 1));
  },
);
apiTest('calendar', 'Slots', ['date-cell', 'header'], 'calendar-basic', '日期和头部作用域', () => {
  render(
    <Calendar
      value={new Date(2024, 1, 1)}
      renderHeader={({ date }) => <h2>{date}</h2>}
      renderDateCell={({ data }) => (
        <span>
          {data.day}
          {data.isSelected ? '已选' : ''}
          {data.date instanceof Date ? '日期' : ''}
        </span>
      )}
    />,
  );
  expect(screen.getByRole('heading')).toHaveTextContent('2024');
  expect(screen.getByText('2024-02-01已选日期')).toBeInTheDocument();
});
apiTest(
  'calendar',
  'Exposes',
  ['selectedDay', 'pickDay', 'selectDate', 'calculateValidatedDateRange'],
  'calendar-basic',
  '日历实例和年跨月选择',
  () => {
    const ref = createRef<CalendarHandle>();
    render(<Calendar ref={ref} defaultValue={new Date(2024, 1, 1)} />);
    expect(ref.current?.selectedDay?.format('YYYY-MM-DD')).toBe('2024-02-01');
    act(() => ref.current?.pickDay(dayjs('2024-03-10')));
    expect(ref.current?.selectedDay?.format('YYYY-MM-DD')).toBe('2024-03-10');
    act(() => ref.current?.selectDate('prev-year'));
    expect(ref.current?.selectedDay?.format('YYYY-MM-DD')).toBe('2023-03-01');
    const ranges = ref.current!.calculateValidatedDateRange(dayjs('2021-01-30'), dayjs('2021-02-28'));
    expect(ranges.length).toBeGreaterThan(0);
    expect(ranges[0][0].day()).toBe(0);
  },
);
