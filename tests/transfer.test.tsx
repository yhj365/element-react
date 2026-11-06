import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { Transfer } from '../packages/element-react';
import type { TransferHandle } from '../packages/element-react';
import { FieldValidationContext } from '../packages/hooks';
import { apiTest, featureTest } from './contract';

const data = [
  { key: 1, label: 'Alpha' },
  { key: 2, label: 'Beta', disabled: true },
  { key: 3, label: 'Charlie' },
  { key: 4, label: 'Delta' },
];
/** 点击复选框可见标签，兼容原主题隐藏原生input的方式。 */
function check(name: string): void {
  fireEvent.click(screen.getByRole('checkbox', { name }).closest('label')!);
}
apiTest(
  'transfer',
  'Transfer Attributes',
  ['model-value', 'data'],
  'transfer-basic',
  '受控移动保留父组件模型，回写后同步两侧',
  () => {
    const change = vi.fn(),
      view = render(<Transfer value={[4]} onValueChange={change} data={data} />);
    check('Alpha');
    fireEvent.click(screen.getByRole('button', { name: 'Move to right' }));
    expect(change).toHaveBeenCalledExactlyOnceWith([1, 4]);
    expect(
      within(screen.getByRole('group', { name: 'List 1' })).getByRole('checkbox', { name: 'Alpha' }),
    ).toBeInTheDocument();
    view.rerender(<Transfer value={[1, 4]} onValueChange={change} data={data} />);
    expect(
      within(screen.getByRole('group', { name: 'List 2' })).getByRole('checkbox', { name: 'Alpha' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to right' })).toBeDisabled();
  },
);
apiTest(
  'transfer',
  'Transfer Attributes',
  ['target-order'],
  'transfer-basic',
  'original、push和unshift分别保持来源顺序或插入顺序',
  () => {
    for (const [targetOrder, expected] of [
      ['original', [1, 4]],
      ['push', [4, 1]],
      ['unshift', [1, 4]],
    ] as const) {
      const change = vi.fn();
      const view = render(
        <Transfer defaultValue={[4]} data={data} targetOrder={targetOrder} onValueChange={change} />,
      );
      check('Alpha');
      fireEvent.click(screen.getByRole('button', { name: 'Move to right' }));
      expect(change).toHaveBeenCalledExactlyOnceWith(expected);
      view.unmount();
    }
  },
);
apiTest(
  'transfer',
  'Transfer Attributes',
  ['filterable', 'filter-placeholder', 'filter-method'],
  'transfer-basic',
  '默认过滤及自定义过滤只影响面板可见项',
  () => {
    const view = render(<Transfer data={data} filterable filterPlaceholder="搜索项目" />);
    const inputs = screen.getAllByPlaceholderText('搜索项目');
    fireEvent.change(inputs[0], { target: { value: 'al' } });
    expect(within(screen.getByRole('group', { name: 'List 1' })).getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeInTheDocument();
    view.rerender(
      <Transfer
        data={data}
        filterable
        filterMethod={(query, item) => String(item.key) === query || !query}
      />,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'List 1 filter' }), { target: { value: '3' } });
    expect(screen.getByRole('checkbox', { name: 'Charlie' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Alpha' })).toBeNull();
  },
);
apiTest(
  'transfer',
  'Transfer Attributes',
  ['titles', 'button-texts', 'format'],
  'transfer-basic',
  '面板标题、按钮文案和勾选计数模板',
  () => {
    render(
      <Transfer
        data={data}
        titles={['来源', '目标']}
        buttonTexts={['移除', '添加']}
        format={{ noChecked: '共 ${total}', hasChecked: '${checked}/${total} 已选' }}
      />,
    );
    expect(screen.getByRole('group', { name: '来源' })).toBeInTheDocument();
    expect(screen.getByText('共 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '移除' })).toBeDisabled();
    check('Alpha');
    expect(screen.getByText('1/4 已选')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '添加' })).toBeEnabled();
  },
);
apiTest(
  'transfer',
  'Transfer Attributes',
  ['left-default-checked', 'right-default-checked'],
  'transfer-basic',
  '两侧初始勾选排除禁用与缺失主键，后续变化同步',
  () => {
    const view = render(
      <Transfer data={data} defaultValue={[4]} leftDefaultChecked={[1, 2, 99]} rightDefaultChecked={[4]} />,
    );
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Beta' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Delta' })).toBeChecked();
    view.rerender(
      <Transfer data={data} defaultValue={[4]} leftDefaultChecked={[3]} rightDefaultChecked={[]} />,
    );
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Charlie' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Delta' })).not.toBeChecked();
  },
);
apiTest(
  'transfer',
  'Transfer Attributes',
  ['[props](#type-declarations)', 'render-content'],
  'transfer-basic',
  '字段别名和内容渲染器覆盖默认标签',
  () => {
    render(
      <Transfer
        data={[{ id: 'a', text: '映射项', locked: true }]}
        props={{ key: 'id', label: 'text', disabled: 'locked' }}
        renderContent={(item) => <strong>{String(item.text)}</strong>}
      />,
    );
    expect(screen.getByRole('checkbox', { name: '映射项' })).toBeDisabled();
    expect(screen.getByText('映射项').tagName).toBe('STRONG');
  },
);
apiTest(
  'transfer',
  'Transfer Slots',
  ['default', 'left-footer', 'right-footer'],
  'transfer-basic',
  '选项和底部区域插槽',
  () => {
    render(
      <Transfer
        data={data}
        renderOption={({ option }) => <b>{option.label} 插槽</b>}
        renderLeftFooter={<button>左底部</button>}
        renderRightFooter={<button>右底部</button>}
      />,
    );
    expect(screen.getByText('Alpha 插槽').tagName).toBe('B');
    expect(
      screen.getByRole('button', { name: '左底部' }).closest('.el-transfer-panel__footer'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '右底部' }).closest('.el-transfer-panel__footer'),
    ).toBeInTheDocument();
  },
);
apiTest(
  'transfer',
  'Transfer Slots',
  ['left-empty', 'right-empty'],
  'transfer-basic',
  '空面板和无匹配项使用对应空插槽',
  () => {
    render(
      <Transfer
        data={[data[0]]}
        filterable
        renderLeftEmpty={<span>左空</span>}
        renderRightEmpty={<span>右空</span>}
      />,
    );
    expect(screen.getByText('右空')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'List 1 filter' }), {
      target: { value: 'missing' },
    });
    expect(screen.getByText('左空')).toBeVisible();
  },
);
apiTest(
  'transfer',
  'Transfer Events',
  ['change', 'left-check-change', 'right-check-change'],
  'transfer-basic',
  '勾选事件携带差集，移动事件携带方向和完整目标值',
  () => {
    const change = vi.fn(),
      left = vi.fn(),
      right = vi.fn();
    render(<Transfer data={data} onChange={change} onLeftCheckChange={left} onRightCheckChange={right} />);
    left.mockClear();
    right.mockClear();
    check('Alpha');
    expect(left).toHaveBeenLastCalledWith([1], [1]);
    fireEvent.click(screen.getByRole('button', { name: 'Move to right' }));
    expect(change).toHaveBeenLastCalledWith([1], 'right', [1]);
    check('Alpha');
    expect(right).toHaveBeenLastCalledWith([1], [1]);
    fireEvent.click(screen.getByRole('button', { name: 'Move to left' }));
    expect(change).toHaveBeenLastCalledWith([], 'left', [1]);
  },
);
apiTest(
  'transfer',
  'Transfer Exposes',
  ['clearQuery', 'leftPanel', 'rightPanel'],
  'transfer-basic',
  '公开面板与指定侧清空查询',
  () => {
    const ref = createRef<TransferHandle>();
    render(<Transfer ref={ref} data={data} filterable />);
    fireEvent.change(screen.getByRole('textbox', { name: 'List 1 filter' }), { target: { value: 'a' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'List 2 filter' }), { target: { value: 'b' } });
    expect(ref.current?.leftPanel?.query).toBe('a');
    expect(ref.current?.rightPanel?.query).toBe('b');
    act(() => ref.current?.clearQuery('left'));
    expect(screen.getByRole('textbox', { name: 'List 1 filter' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'List 2 filter' })).toHaveValue('b');
  },
);
apiTest('transfer', 'Transfer Panel Exposes', ['query'], 'transfer-basic', '面板查询引用可读写', () => {
  const ref = createRef<TransferHandle>();
  render(<Transfer ref={ref} data={data} filterable />);
  act(() => {
    if (ref.current?.leftPanel) ref.current.leftPanel.query = 'Charlie';
  });
  expect(screen.getByRole('textbox', { name: 'List 1 filter' })).toHaveValue('Charlie');
  expect(within(screen.getByRole('group', { name: 'List 1' })).getAllByRole('checkbox')).toHaveLength(1);
});
apiTest(
  'transfer',
  'Transfer Attributes',
  ['virtual-scroll', 'item-size'],
  'transfer-basic',
  '虚拟列表只挂载可视窗口并按itemSize定位',
  () => {
    const many = Array.from({ length: 100 }, (_, key) => ({ key, label: `行 ${key}` }));
    render(<Transfer data={many} virtualScroll itemSize={40} />);
    const list = screen.getByRole('group', { name: 'List 1' });
    expect(within(list).getAllByRole('checkbox').length).toBeLessThan(15);
    expect(within(list).getByRole('checkbox', { name: '行 0' })).toBeInTheDocument();
    fireEvent.scroll(list, { target: { scrollTop: 1600 } });
    expect(within(list).queryByRole('checkbox', { name: '行 0' })).toBeNull();
    expect(within(list).getByRole('checkbox', { name: '行 40' }).closest('label')?.parentElement).toHaveStyle(
      { top: '1600px', height: '40px' },
    );
  },
);
apiTest(
  'transfer',
  'Transfer Attributes',
  ['validate-event'],
  'transfer-basic',
  '移动触发表单校验且可以关闭',
  () => {
    const field = { change: vi.fn(), blur: vi.fn(), invalid: false, errorId: 'transfer-error' };
    const view = render(
      <FieldValidationContext value={field}>
        <Transfer data={data} />
      </FieldValidationContext>,
    );
    check('Alpha');
    fireEvent.click(screen.getByRole('button', { name: 'Move to right' }));
    expect(field.change).toHaveBeenCalledExactlyOnceWith([1]);
    view.rerender(
      <FieldValidationContext value={field}>
        <Transfer data={data} validateEvent={false} />
      </FieldValidationContext>,
    );
    check('Alpha');
    fireEvent.click(screen.getByRole('button', { name: 'Move to left' }));
    expect(field.change).toHaveBeenCalledOnce();
  },
);
featureTest('transfer', 'select-filtered', 'transfer-basic', '全选仅勾选当前过滤结果且跳过禁用项', () => {
  render(<Transfer data={data} filterable />);
  fireEvent.change(screen.getByRole('textbox', { name: 'List 1 filter' }), { target: { value: 'a' } });
  check('List 1 0/4');
  expect(screen.getByRole('checkbox', { name: 'Beta' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Charlie' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Delta' })).toBeChecked();
});
