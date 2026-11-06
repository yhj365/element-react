import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { TreeSelect } from '../packages/element-react';
import type { TreeSelectHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

const data = [
  {
    value: 1,
    label: 'Parent',
    children: [
      { value: 11, label: 'Alpha' },
      { value: 12, label: 'Beta', disabled: true },
    ],
  },
  { value: 2, label: 'Other' },
];
/** 展开选择器并等待树浮层完成定位。 */
async function open(): Promise<HTMLElement> {
  const input = screen.getByRole('combobox');
  fireEvent.click(input);
  await screen.findByRole('treeitem', { name: 'Parent' });
  return input;
}

apiTest(
  'tree-select',
  'Attributes',
  ['[tree](./tree.md#attributes)', '[select](./select.md#select-attributes)'],
  'tree-select-basic',
  '默认只选择叶节点并通过Select统一提交值与change',
  async () => {
    const update = vi.fn(),
      change = vi.fn();
    render(<TreeSelect data={data} onValueChange={update} onChange={change} clearable />);
    await open();
    fireEvent.click(screen.getByText('Parent'));
    expect(update).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByText('Alpha'));
    expect(update).toHaveBeenCalledExactlyOnceWith(11);
    expect(change).toHaveBeenCalledExactlyOnceWith(11);
    expect(screen.queryByRole('tree')).toBeNull();
    expect(document.querySelector('.el-select__placeholder')).toHaveTextContent('Alpha');
  },
);
featureTest(
  'tree-select',
  'strict-level',
  'tree-select-check-strictly',
  '严格模式允许选择父节点且不同时展开分支',
  async () => {
    const change = vi.fn();
    render(<TreeSelect data={data} checkStrictly onChange={change} />);
    await open();
    fireEvent.click(screen.getByText('Parent'));
    expect(change).toHaveBeenCalledWith(1);
    expect(document.querySelector('.el-select__placeholder')).toHaveTextContent('Parent');
  },
);
featureTest(
  'tree-select',
  'multiple-checks',
  'tree-select-multiple',
  '非严格多选只提交叶节点，标签移除同步树勾选',
  async () => {
    const ref = createRef<TreeSelectHandle>(),
      change = vi.fn();
    render(<TreeSelect ref={ref} data={data} multiple showCheckbox onChange={change} />);
    await open();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Parent' }));
    expect(change).toHaveBeenLastCalledWith([11]);
    expect(ref.current?.selectedLabel).toEqual(['Alpha']);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Other' }));
    expect(change).toHaveBeenLastCalledWith([11, 2]);
    fireEvent.click(
      screen
        .getByText('Alpha', { selector: '.el-select__tags-text' })
        .closest('.el-tag')!
        .querySelector('button')!,
    );
    expect(change).toHaveBeenLastCalledWith([2]);
    fireEvent.click(screen.getByRole('button', { name: 'Expand Parent' }));
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked();
  },
);
featureTest('tree-select', 'disabled-options', 'tree-select-disabled', '禁用节点不能选择或勾选', async () => {
  const change = vi.fn();
  render(<TreeSelect data={data} defaultExpandAll multiple showCheckbox onChange={change} />);
  await open();
  expect(screen.getByRole('checkbox', { name: 'Beta' })).toBeDisabled();
  fireEvent.click(screen.getByText('Beta'));
  expect(change).not.toHaveBeenCalled();
});
featureTest(
  'tree-select',
  'filter-tree',
  'tree-select-filterable',
  '输入过滤保留匹配叶节点与祖先',
  async () => {
    render(<TreeSelect data={data} filterable />);
    const input = await open();
    fireEvent.change(input, { target: { value: 'Alpha' } });
    await waitFor(() =>
      expect(screen.getAllByRole('treeitem').map((node) => node.getAttribute('aria-label'))).toEqual([
        'Parent',
        'Alpha',
      ]),
    );
  },
);
featureTest('tree-select', 'custom-content', 'tree-select-slots', '树节点可渲染自定义内容', async () => {
  render(<TreeSelect data={data} renderContent={({ node }) => <b>{node.label}</b>} />);
  await open();
  expect(screen.getByText('Parent').tagName).toBe('B');
});
apiTest(
  'tree-select',
  'Own Attributes',
  ['cache-data'],
  'tree-select-lazy',
  '懒加载前使用缓存标签，加载后的选择记住真实叶节点标签',
  async () => {
    const ref = createRef<TreeSelectHandle>();
    render(
      <TreeSelect
        ref={ref}
        defaultValue={11}
        lazy
        cacheData={[{ value: 11, currentLabel: 'Cached label' }]}
        load={(node, resolve) =>
          resolve(
            node.level === 0
              ? [{ value: 1, label: 'Parent' }]
              : [{ value: 11, label: 'Loaded label', isLeaf: true }],
          )
        }
      />,
    );
    expect(ref.current?.selectedLabel).toBe('Cached label');
    await open();
    fireEvent.click(screen.getByText('Parent'));
    const leaf = await screen.findByRole('treeitem', { name: 'Loaded label' });
    fireEvent.click(leaf.querySelector('.el-tree-node__label')!);
    expect(ref.current?.selectedLabel).toBe('Loaded label');
  },
);
featureTest(
  'tree-select',
  'numeric-key',
  'tree-select-node-key',
  '自定义nodeKey支持数字0并保持标量值',
  async () => {
    const change = vi.fn();
    render(<TreeSelect nodeKey="id" data={[{ id: 0, label: 'Zero' }]} onChange={change} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText('Zero'));
    expect(change).toHaveBeenCalledWith(0);
  },
);
apiTest(
  'tree-select',
  'Exposes',
  ['treeRef', 'selectRef', 'focus', 'blur', 'selectedLabel'],
  'tree-select-basic',
  '公开组合实例与聚焦失焦和标签读数',
  async () => {
    const ref = createRef<TreeSelectHandle>();
    render(<TreeSelect ref={ref} data={data} defaultValue={11} />);
    expect(ref.current?.treeRef).not.toBeNull();
    expect(ref.current?.selectRef).not.toBeNull();
    expect(ref.current?.selectedLabel).toBe('Alpha');
    act(() => ref.current?.focus());
    expect(screen.getByRole('combobox')).toHaveFocus();
    await open();
    act(() => ref.current?.blur());
    await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
  },
);
apiTest(
  'tree-select',
  'Exposes',
  [
    'getCheckedNodes',
    'setCheckedNodes',
    'getCheckedKeys',
    'setCheckedKeys',
    'setChecked',
    'getHalfCheckedNodes',
    'getHalfCheckedKeys',
  ],
  'tree-select-multiple',
  '原勾选实例方法委托到同一Tree实例',
  () => {
    const ref = createRef<TreeSelectHandle>();
    const source = [
      {
        value: 1,
        label: 'Parent',
        children: [
          { value: 11, label: 'Alpha' },
          { value: 12, label: 'Beta' },
        ],
      },
    ];
    render(<TreeSelect ref={ref} data={source} multiple showCheckbox />);
    act(() => ref.current?.setCheckedKeys([11]));
    expect(ref.current?.getCheckedKeys()).toEqual([11]);
    expect(ref.current?.getHalfCheckedKeys()).toEqual([1]);
    expect(ref.current?.getHalfCheckedNodes()).toEqual([source[0]]);
    act(() => ref.current?.setChecked(12, true));
    expect(ref.current?.getCheckedNodes(true)).toEqual(source[0].children);
    act(() => ref.current?.setCheckedNodes([source[0].children[0]]));
    expect(ref.current?.getCheckedKeys(true)).toEqual([11]);
  },
);
apiTest(
  'tree-select',
  'Exposes',
  [
    'filter',
    'updateKeyChildren',
    'getCurrentKey',
    'getCurrentNode',
    'setCurrentKey',
    'setCurrentNode',
    'getNode',
    'remove',
    'append',
    'insertBefore',
    'insertAfter',
  ],
  'tree-select-node-key',
  '旧树实例方法委托节点查询、过滤和不可变编辑',
  () => {
    const ref = createRef<TreeSelectHandle>();
    render(<TreeSelect ref={ref} data={data} />);
    act(() => ref.current?.setCurrentKey(11));
    expect(ref.current?.getCurrentKey()).toBe(11);
    expect(ref.current?.getCurrentNode()).toBe(data[0].children![0]);
    act(() => ref.current?.setCurrentNode(data[1]));
    expect(ref.current?.getCurrentKey()).toBe(2);
    act(() => ref.current?.append({ value: 3, label: 'Third' }));
    expect(ref.current?.getNode(3)?.label).toBe('Third');
    act(() => ref.current?.insertBefore({ value: 4, label: 'Fourth' }, 3));
    act(() => ref.current?.insertAfter({ value: 5, label: 'Fifth' }, 3));
    expect(ref.current?.getNode(4)?.label).toBe('Fourth');
    expect(ref.current?.getNode(5)?.label).toBe('Fifth');
    act(() => ref.current?.remove(4));
    expect(ref.current?.getNode(4)).toBeUndefined();
    act(() => ref.current?.updateKeyChildren(1, [{ value: 15, label: 'New child' }]));
    expect(ref.current?.getNode(15)?.label).toBe('New child');
    act(() => ref.current?.filter('New child'));
  },
);
featureTest(
  'tree-select',
  'keyboard-selection',
  'tree-select-basic',
  '键盘打开后聚焦树，Enter选择叶节点，Escape恢复输入焦点',
  async () => {
    render(<TreeSelect data={data} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await waitFor(() => expect(screen.getByRole('treeitem', { name: 'Parent' })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole('treeitem', { name: 'Parent' }), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByRole('treeitem', { name: 'Parent' }), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('treeitem', { name: 'Alpha' }), { key: 'Enter' });
    expect(document.querySelector('.el-select__placeholder')).toHaveTextContent('Alpha');
    await open();
    fireEvent.keyDown(screen.getByRole('treeitem', { name: 'Parent' }), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tree')).toBeNull());
    expect(input).toHaveFocus();
  },
);
