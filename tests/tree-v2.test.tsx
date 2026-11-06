import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { TreeV2 } from '../packages/element-react';
import type { TreeHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

const data = [
  {
    id: 1,
    label: 'Parent',
    children: [
      { id: 11, label: 'Alpha' },
      { id: 12, label: 'Beta', disabled: true },
    ],
  },
  { id: 2, label: 'Other' },
];

apiTest(
  'tree-v2',
  'TreeV2 Attributes',
  ['data', 'height', 'item-size', 'scrollbar-always-on'],
  'tree-v2-basic',
  '万节点虚拟树只挂载可视窗口，滚动后更新窗口',
  () => {
    const all = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Node ${id}` }));
    const view = render(<TreeV2 data={all} height={200} itemSize={20} scrollbarAlwaysOn />);
    expect(screen.getAllByRole('treeitem').length).toBeLessThanOrEqual(14);
    expect(view.container.firstChild).toHaveStyle({ height: '200px', overflow: 'scroll' });
    fireEvent.scroll(screen.getByRole('tree'), { target: { scrollTop: 2000 } });
    expect(screen.getByRole('treeitem', { name: 'Node 100' })).toBeInTheDocument();
    expect(screen.queryByRole('treeitem', { name: 'Node 0' })).toBeNull();
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Attributes',
  ['show-checkbox', 'check-strictly', 'check-on-click-node', 'check-on-click-leaf'],
  'tree-v2-selectable',
  '虚拟树支持严格选择和独立节点点击策略',
  () => {
    const ref = createRef<TreeHandle>();
    render(
      <TreeV2 ref={ref} data={data} showCheckbox checkStrictly checkOnClickNode checkOnClickLeaf={false} />,
    );
    fireEvent.click(screen.getByText('Parent'));
    expect(ref.current?.getCheckedKeys()).toEqual([1]);
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked();
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Attributes',
  [
    'default-expanded-keys',
    'default-checked-keys',
    'current-node-key',
    'highlight-current',
    'expand-on-click-node',
    'indent',
  ],
  'tree-v2-default-state',
  '默认展开勾选和高亮在虚拟行中保持一致',
  () => {
    render(
      <TreeV2
        data={data}
        defaultExpandedKeys={[1]}
        defaultCheckedKeys={[11]}
        currentNodeKey={11}
        highlightCurrent
        expandOnClickNode={false}
        indent={22}
        showCheckbox
      />,
    );
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveClass('is-current');
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
    expect(screen.getByText('Alpha').parentElement).toHaveStyle({ paddingLeft: '22px' });
    fireEvent.click(screen.getByText('Parent'));
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toBeVisible();
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Attributes',
  ['[props](#props)'],
  'tree-v2-disabled',
  '配置映射可指定虚拟树唯一键和禁用字段',
  () => {
    render(
      <TreeV2
        data={[{ key: 'a', title: 'Custom', blocked: true }]}
        props={{ value: 'key', label: 'title', disabled: 'blocked' }}
        showCheckbox
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Custom' })).toBeDisabled();
  },
);
apiTest(
  'tree-v2',
  'props',
  ['value', 'label', 'children', 'disabled', 'class'],
  'tree-v2-custom-node-class',
  '字段映射与节点类名覆盖应用于同一模型',
  () => {
    render(
      <TreeV2
        data={[{ key: 'a', title: 'Custom', nodes: [{ key: 'b', title: 'Child' }] }]}
        props={{
          value: 'key',
          label: 'title',
          children: 'nodes',
          disabled: 'blocked',
          class: (_data, node) => ({ custom: node.key === 'b' }),
        }}
        defaultExpandedKeys={['a']}
      />,
    );
    expect(screen.getByRole('treeitem', { name: 'Child' })).toHaveClass('custom');
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Attributes',
  ['filter-method'],
  'tree-v2-filter',
  '虚拟树过滤显示匹配节点和祖先',
  () => {
    const ref = createRef<TreeHandle>();
    render(
      <TreeV2 ref={ref} data={data} filterMethod={(query, item) => String(item.label).includes(query)} />,
    );
    act(() => ref.current?.filter('Alpha'));
    expect(screen.getAllByRole('treeitem').map((node) => node.getAttribute('aria-label'))).toEqual([
      'Parent',
      'Alpha',
    ]);
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Exposes',
  [
    'filter',
    'getCheckedNodes',
    'getCheckedKeys',
    'setCheckedKeys',
    'setChecked',
    'getHalfCheckedNodes',
    'getHalfCheckedKeys',
  ],
  'tree-v2-selectable',
  '虚拟树的勾选方法查询完整模型而非仅查询挂载DOM',
  () => {
    const ref = createRef<TreeHandle>();
    const source = [
      {
        id: 1,
        label: 'Parent',
        children: [
          { id: 11, label: 'Alpha' },
          { id: 12, label: 'Beta' },
        ],
      },
    ];
    render(<TreeV2 ref={ref} data={source} showCheckbox />);
    act(() => ref.current?.setCheckedKeys([11]));
    expect(ref.current?.getCheckedKeys()).toEqual([11]);
    expect(ref.current?.getHalfCheckedKeys()).toEqual([1]);
    expect(ref.current?.getHalfCheckedNodes()).toEqual([source[0]]);
    act(() => ref.current?.setChecked(12, true));
    expect(ref.current?.getCheckedNodes(true)).toEqual(source[0].children);
    expect(ref.current?.getCheckedKeys()).toEqual([1, 11, 12]);
    act(() => ref.current?.filter(''));
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Exposes',
  [
    'getCurrentKey',
    'getCurrentNode',
    'setCurrentKey',
    'getNode',
    'expandNode',
    'collapseNode',
    'setExpandedKeys',
    'setData',
  ],
  'tree-v2-default-state',
  '实例在折叠数据中定位节点并替换完整数据',
  () => {
    const ref = createRef<TreeHandle>();
    render(<TreeV2 ref={ref} data={data} />);
    expect(ref.current?.getNode(11)?.label).toBe('Alpha');
    act(() => ref.current?.setCurrentKey(11));
    expect(ref.current?.getCurrentKey()).toBe(11);
    expect(ref.current?.getCurrentNode()).toBe(data[0].children![0]);
    act(() => ref.current?.collapseNode(ref.current.getNode(1)!));
    expect(screen.queryByRole('treeitem', { name: 'Alpha' })).toBeNull();
    act(() => ref.current?.expandNode(ref.current.getNode(1)!));
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toBeVisible();
    act(() => ref.current?.setExpandedKeys([]));
    expect(screen.queryByRole('treeitem', { name: 'Alpha' })).toBeNull();
    act(() => ref.current?.setData([{ id: 3, label: 'New data' }]));
    expect(screen.getByText('New data')).toBeInTheDocument();
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Exposes',
  ['scrollTo', 'scrollToNode'],
  'tree-v2-basic',
  '按位置和节点策略滚动到未挂载行',
  () => {
    const ref = createRef<TreeHandle>();
    const all = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Node ${id}` }));
    render(<TreeV2 ref={ref} data={all} height={100} itemSize={20} />);
    act(() => ref.current?.scrollToNode(500, 'center'));
    expect(screen.getByRole('tree')).toHaveProperty('scrollTop', 9960);
    expect(screen.getByRole('treeitem', { name: 'Node 500' })).toBeInTheDocument();
    act(() => ref.current?.scrollTo(200));
    expect(screen.getByRole('tree')).toHaveProperty('scrollTop', 200);
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Events',
  [
    'node-click',
    'node-contextmenu',
    'check-change',
    'check',
    'current-change',
    'node-expand',
    'node-collapse',
  ],
  'tree-v2-selectable',
  '虚拟树行为事件回传原始节点数据与实时状态',
  () => {
    const click = vi.fn(),
      context = vi.fn(),
      check = vi.fn(),
      change = vi.fn(),
      current = vi.fn(),
      expand = vi.fn(),
      collapse = vi.fn();
    render(
      <TreeV2
        data={data}
        showCheckbox
        onNodeClick={click}
        onNodeContextmenu={context}
        onCheck={check}
        onCheckChange={change}
        onCurrentChange={current}
        onNodeExpand={expand}
        onNodeCollapse={collapse}
      />,
    );
    fireEvent.click(screen.getByText('Parent'));
    expect(expand).toHaveBeenCalledOnce();
    expect(click.mock.calls[0][0]).toBe(data[0]);
    expect(current).toHaveBeenCalledOnce();
    fireEvent.contextMenu(screen.getByText('Alpha'));
    expect(context).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha' }));
    expect(check).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Collapse Parent' }));
    expect(collapse).toHaveBeenCalledOnce();
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Events',
  ['node-drop'],
  'tree-v2-basic',
  '外部放置事件接收目标数据节点及原始事件',
  () => {
    const drop = vi.fn();
    render(<TreeV2 data={data} onNodeDrop={drop} />);
    fireEvent.drop(screen.getByRole('treeitem', { name: 'Other' }));
    expect(drop).toHaveBeenCalledWith(data[1], expect.objectContaining({ key: 2 }), expect.anything());
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Slots',
  ['default', 'empty'],
  'tree-v2-custom-node',
  '虚拟树自定义节点和空内容',
  () => {
    const view = render(<TreeV2 data={data} renderContent={({ node }) => <b>{node.label}</b>} />);
    expect(screen.getByText('Parent').tagName).toBe('B');
    view.rerender(<TreeV2 data={[]} renderEmpty={<b>Empty</b>} />);
    expect(screen.getByText('Empty').tagName).toBe('B');
  },
);
apiTest(
  'tree-v2',
  'TreeV2 Attributes',
  ['icon', 'empty-text'],
  'tree-v2-custom-icon',
  '虚拟树支持自定义展开图标和空文本',
  () => {
    const view = render(<TreeV2 data={data} icon={<i>Icon</i>} />);
    expect(screen.getAllByText('Icon')).toHaveLength(2);
    view.rerender(<TreeV2 data={[]} emptyText="No nodes" />);
    expect(screen.getByText('No nodes')).toBeInTheDocument();
  },
);
featureTest('tree-v2', 'windowed-model', 'tree-v2-basic', '窗口之外的节点仍可通过实例读取与勾选', () => {
  const ref = createRef<TreeHandle>();
  const all = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Node ${id}` }));
  render(<TreeV2 ref={ref} data={all} showCheckbox height={100} />);
  act(() => ref.current?.setCheckedKeys([999]));
  expect(ref.current?.getCheckedKeys()).toEqual([999]);
  expect(screen.queryByRole('treeitem', { name: 'Node 999' })).toBeNull();
});
