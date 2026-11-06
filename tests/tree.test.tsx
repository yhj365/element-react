import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { Tree } from '../packages/element-react';
import type { TreeData, TreeHandle, TreeNode } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

const data = [
  {
    id: 1,
    label: 'Parent',
    children: [
      { id: 11, label: 'Alpha' },
      { id: 12, label: 'Beta' },
    ],
  },
  { id: 2, label: 'Other', children: [{ id: 21, label: 'Gamma' }] },
];

apiTest(
  'tree',
  'Attributes',
  ['data', 'node-key', 'default-expand-all', 'highlight-current', 'current-node-key', 'indent'],
  'tree-basic',
  '初始层级与当前项按指定键和缩进渲染',
  () => {
    const view = render(
      <Tree data={data} nodeKey="id" defaultExpandAll highlightCurrent currentNodeKey={11} indent={24} />,
    );
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveAttribute('aria-level', '2');
    expect(screen.getByRole('treeitem', { name: 'Alpha' })).toHaveClass('is-current');
    expect(screen.getByText('Alpha').parentElement).toHaveStyle({ paddingLeft: '24px' });
    expect(view.container.firstChild).toHaveClass('el-tree--highlight-current');
  },
);
apiTest(
  'tree',
  'Attributes',
  ['show-checkbox', 'default-checked-keys', 'default-expanded-keys', 'auto-expand-parent'],
  'tree-default-state',
  '默认展开目标祖先并计算父级半选状态',
  () => {
    const ref = createRef<TreeHandle>();
    render(
      <Tree
        ref={ref}
        data={data}
        nodeKey="id"
        showCheckbox
        defaultCheckedKeys={[11]}
        defaultExpandedKeys={[11]}
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Parent' })).toHaveAttribute('aria-checked', 'mixed');
    expect(ref.current?.getHalfCheckedKeys()).toEqual([1]);
  },
);
apiTest(
  'tree',
  'Attributes',
  ['check-strictly', 'check-on-click-node', 'check-on-click-leaf'],
  'tree-selectable',
  '严格模式勾选独立，节点与叶节点点击策略可以分别关闭',
  () => {
    const ref = createRef<TreeHandle>();
    render(
      <Tree
        ref={ref}
        data={data}
        nodeKey="id"
        showCheckbox
        checkStrictly
        defaultExpandAll
        checkOnClickNode={false}
        checkOnClickLeaf={false}
      />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Parent' }));
    expect(ref.current?.getCheckedKeys()).toEqual([1]);
    fireEvent.click(screen.getByText('Alpha'));
    expect(ref.current?.getCheckedKeys()).toEqual([1]);
  },
);
apiTest('tree', 'props', ['disabled'], 'tree-disabled', '级联勾选跳过禁用子项且不修改输入数据', () => {
  const source = [
    {
      id: 1,
      label: 'Parent',
      children: [
        { id: 11, label: 'Enabled' },
        { id: 12, label: 'Disabled', disabled: true },
      ],
    },
  ];
  render(<Tree data={source} nodeKey="id" showCheckbox defaultExpandAll />);
  fireEvent.click(screen.getByRole('checkbox', { name: 'Parent' }));
  expect(screen.getByRole('checkbox', { name: 'Enabled' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Disabled' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Disabled' })).toBeDisabled();
  expect(source[0].children[0]).not.toHaveProperty('checked');
});
apiTest(
  'tree',
  'Events',
  ['check', 'check-change'],
  'tree-checking-tree',
  '勾选事件区分用户动作和父级级联变化并包含半选结果',
  () => {
    const check = vi.fn(),
      change = vi.fn();
    render(
      <Tree data={data} nodeKey="id" showCheckbox defaultExpandAll onCheck={check} onCheckChange={change} />,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha' }));
    expect(check).toHaveBeenCalledOnce();
    expect(check.mock.calls[0][1]).toMatchObject({ checkedKeys: [11], halfCheckedKeys: [1] });
    expect(change).toHaveBeenCalledWith(data[0], false, true);
    expect(change).toHaveBeenCalledWith(data[0].children[0], true, false);
  },
);
apiTest(
  'tree',
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
  'tree-checking-tree',
  '实例支持按键或数据勾选并查询完整半选与叶节点',
  () => {
    const ref = createRef<TreeHandle>();
    render(<Tree ref={ref} data={data} nodeKey="id" showCheckbox />);
    act(() => ref.current?.setCheckedKeys([1]));
    expect(ref.current?.getCheckedKeys(true)).toEqual([11, 12]);
    expect(ref.current?.getCheckedNodes(true)).toEqual(data[0].children);
    act(() => ref.current?.setChecked(11, false));
    expect(ref.current?.getHalfCheckedNodes()).toEqual([data[0]]);
    expect(ref.current?.getCheckedNodes(false, true)).toEqual([data[0], data[0].children[1]]);
    act(() => ref.current?.setCheckedNodes([data[1].children[0]]));
    expect(ref.current?.getCheckedKeys()).toEqual([2, 21]);
  },
);
apiTest(
  'tree',
  'Exposes',
  ['getCurrentKey', 'getCurrentNode', 'setCurrentKey', 'setCurrentNode', 'getNode'],
  'tree-basic',
  '当前节点方法按键和原始数据读取，未知键清除当前项',
  () => {
    const ref = createRef<TreeHandle>();
    render(<Tree ref={ref} data={data} nodeKey="id" />);
    act(() => ref.current?.setCurrentKey(11));
    expect(ref.current?.getCurrentNode()).toBe(data[0].children[0]);
    expect(ref.current?.getCurrentKey()).toBe(11);
    expect(ref.current?.getNode(data[0].children[0])?.parent?.key).toBe(1);
    act(() => ref.current?.setCurrentNode(data[1]));
    expect(ref.current?.getCurrentKey()).toBe(2);
    act(() => ref.current?.setCurrentKey('unknown'));
    expect(ref.current?.getCurrentNode()).toBeNull();
  },
);
apiTest(
  'tree',
  'Attributes',
  ['filter-node-method'],
  'tree-filtering',
  '过滤保留匹配节点祖先并展开命中路径',
  () => {
    const ref = createRef<TreeHandle>();
    render(
      <Tree
        ref={ref}
        data={data}
        nodeKey="id"
        filterNodeMethod={(query, item) => String(item.label).includes(String(query))}
      />,
    );
    act(() => ref.current?.filter('Alpha'));
    expect(screen.getAllByRole('treeitem').map((item) => item.getAttribute('aria-label'))).toEqual([
      'Parent',
      'Alpha',
    ]);
    act(() => ref.current?.filter('missing'));
    expect(screen.queryByRole('treeitem')).toBeNull();
    act(() => ref.current?.filter(''));
    expect(screen.getAllByRole('treeitem')).toHaveLength(2);
  },
);
apiTest('tree', 'Exposes', ['filter'], 'tree-filtering', '清空过滤恢复原有展开状态', () => {
  const ref = createRef<TreeHandle>();
  render(
    <Tree
      ref={ref}
      data={data}
      nodeKey="id"
      defaultExpandedKeys={[1]}
      filterNodeMethod={(query, item) => String(item.label).includes(String(query))}
    />,
  );
  act(() => ref.current?.filter('Gamma'));
  expect(screen.getByRole('treeitem', { name: 'Gamma' })).toBeVisible();
  act(() => ref.current?.filter(''));
  expect(screen.getByRole('treeitem', { name: 'Alpha' })).toBeVisible();
  expect(screen.queryByRole('treeitem', { name: 'Gamma' })).toBeNull();
});
apiTest(
  'tree',
  'Attributes',
  ['accordion', 'expand-on-click-node', 'render-after-expand'],
  'tree-accordion',
  '同级手风琴展开，首次展开后保留隐藏子树',
  () => {
    render(<Tree data={data} nodeKey="id" accordion expandOnClickNode={false} />);
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.click(screen.getByText('Parent'));
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Expand Parent' }));
    expect(screen.getByText('Alpha')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Expand Other' }));
    expect(screen.getByText('Alpha')).not.toBeVisible();
    expect(screen.getByText('Gamma')).toBeVisible();
  },
);
apiTest(
  'tree',
  'Attributes',
  ['lazy', 'load'],
  'tree-multiple-times-load',
  '懒加载拒绝后可重试，重复响应与卸载后结果失效',
  async () => {
    const attempts: Array<{ resolve: (data: TreeData[]) => void; reject: () => void }> = [];
    const view = render(
      <Tree
        data={[{ id: 1, label: 'Lazy' }]}
        nodeKey="id"
        lazy
        load={(_node, resolve, reject) => {
          attempts.push({ resolve, reject });
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand Lazy' }));
    expect(attempts).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Expand Lazy' }));
    expect(attempts).toHaveLength(1);
    act(() => attempts[0].reject());
    fireEvent.click(screen.getByRole('button', { name: 'Expand Lazy' }));
    expect(attempts).toHaveLength(2);
    act(() => attempts[1].resolve([{ id: 11, label: 'Loaded', isLeaf: true }]));
    expect(await screen.findByRole('treeitem', { name: 'Loaded' })).toBeInTheDocument();
    act(() => attempts[0].resolve([{ id: 12, label: 'Stale' }]));
    expect(screen.queryByText('Stale')).toBeNull();
    view.unmount();
    act(() => attempts[1].resolve([{ id: 13, label: 'After' }]));
    expect(screen.queryByText('After')).toBeNull();
  },
);
apiTest(
  'tree',
  'props',
  ['isLeaf'],
  'tree-custom-leaf',
  '显式叶节点不调用加载器，根节点可异步获取',
  async () => {
    const load = vi.fn((node: TreeNode, resolve: (data: TreeData[]) => void) => {
      if (node.level === 0) resolve([{ id: 1, label: 'Leaf', isLeaf: true }]);
    });
    render(<Tree lazy nodeKey="id" load={load} />);
    await screen.findByRole('treeitem', { name: 'Leaf' });
    expect(screen.getByRole('button', { name: 'Expand Leaf' })).toBeDisabled();
    expect(load).toHaveBeenCalledOnce();
  },
);
apiTest(
  'tree',
  'Attributes',
  ['[props](#props)', 'render-content'],
  'tree-customized-node',
  '字段映射与自定义节点内容可组合',
  () => {
    render(
      <Tree
        nodeKey="key"
        data={[{ key: 'a', title: 'Title', nodes: [{ key: 'b', title: 'Child', blocked: true }] }]}
        props={{ label: 'title', children: 'nodes', disabled: 'blocked' }}
        defaultExpandAll
        showCheckbox
        renderContent={({ node }) => <b>{node.label}</b>}
      />,
    );
    expect(screen.getByText('Title').tagName).toBe('B');
    expect(screen.getByRole('checkbox', { name: 'Child' })).toBeDisabled();
  },
);
apiTest(
  'tree',
  'props',
  ['label', 'children', 'class'],
  'tree-custom-node-class',
  '节点字段回调读取层级并生成自定义类名',
  () => {
    render(
      <Tree
        data={data}
        props={{
          label: (item, node) => `${node.level}:${item.label}`,
          class: (_item, node) => ({ custom: node.level === 1 }),
        }}
      />,
    );
    expect(screen.getByRole('treeitem', { name: '1:Parent' })).toHaveClass('custom');
  },
);
apiTest(
  'tree',
  'Exposes',
  ['updateKeyChildren', 'remove', 'append', 'insertBefore', 'insertAfter'],
  'tree-customized-node',
  '节点增删插入和子树替换不修改外部数据',
  () => {
    const ref = createRef<TreeHandle>();
    render(<Tree ref={ref} data={data} nodeKey="id" defaultExpandAll />);
    act(() => ref.current?.append({ id: 13, label: 'Appended' }, 1));
    expect(ref.current?.getNode(1)?.childNodes.map((node) => node.key)).toEqual([11, 12, 13]);
    expect(data[0].children).toHaveLength(2);
    act(() => ref.current?.insertBefore({ id: 14, label: 'Before' }, 12));
    act(() => ref.current?.insertAfter({ id: 15, label: 'After' }, 12));
    expect(ref.current?.getNode(1)?.childNodes.map((node) => node.key)).toEqual([11, 14, 12, 15, 13]);
    act(() => ref.current?.remove(14));
    expect(ref.current?.getNode(14)).toBeUndefined();
    act(() => ref.current?.updateKeyChildren(1, [{ id: 16, label: 'Replacement' }]));
    expect(ref.current?.getNode(1)?.childNodes.map((node) => node.key)).toEqual([16]);
  },
);
apiTest(
  'tree',
  'Events',
  ['node-click', 'node-contextmenu', 'current-change', 'node-expand', 'node-collapse'],
  'tree-basic',
  '节点激活右键和展开事件分别通知',
  () => {
    const click = vi.fn(),
      context = vi.fn(),
      current = vi.fn(),
      expand = vi.fn(),
      collapse = vi.fn();
    render(
      <Tree
        data={data}
        nodeKey="id"
        onNodeClick={click}
        onNodeContextmenu={context}
        onCurrentChange={current}
        onNodeExpand={expand}
        onNodeCollapse={collapse}
      />,
    );
    fireEvent.click(screen.getByText('Parent'));
    expect(click.mock.calls[0][0]).toBe(data[0]);
    expect(current).toHaveBeenCalledTimes(1);
    expect(expand).toHaveBeenCalledOnce();
    fireEvent.contextMenu(screen.getByText('Alpha'));
    expect(context.mock.calls[0][1]).toBe(data[0].children[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Collapse Parent' }));
    expect(collapse).toHaveBeenCalledOnce();
  },
);
apiTest('tree', 'Slots', ['default', 'empty'], 'tree-customized-node', '节点内容及空内容插槽', () => {
  const view = render(<Tree data={[]} renderEmpty={<b>Empty tree</b>} />);
  expect(screen.getByText('Empty tree').tagName).toBe('B');
  view.rerender(<Tree data={data} renderContent={({ node }) => <i>{node.label}</i>} />);
  expect(screen.getByText('Parent').tagName).toBe('I');
});
apiTest('tree', 'Attributes', ['empty-text', 'icon'], 'tree-basic', '空内容文本和展开图标可替换', () => {
  const view = render(<Tree emptyText="No nodes" />);
  expect(screen.getByText('No nodes')).toBeInTheDocument();
  view.rerender(<Tree data={data} icon={<b>Icon</b>} />);
  expect(screen.getAllByText('Icon')).toHaveLength(2);
});
featureTest('tree', 'keyboard', 'tree-basic', '树方向键展开、聚焦子节点并以Space勾选', () => {
  render(<Tree data={data} nodeKey="id" showCheckbox />);
  const parent = screen.getByRole('treeitem', { name: 'Parent' });
  parent.focus();
  fireEvent.keyDown(parent, { key: 'ArrowRight' });
  fireEvent.keyDown(parent, { key: 'ArrowDown' });
  const child = screen.getByRole('treeitem', { name: 'Alpha' });
  expect(child).toHaveFocus();
  fireEvent.keyDown(child, { key: ' ' });
  expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
});
featureTest(
  'tree',
  'unkeyed-identity',
  'tree-customized-node',
  '无node-key树在插入节点后保留原父节点展开状态和身份',
  () => {
    const ref = createRef<TreeHandle>(),
      original = { label: 'Parent', children: [{ label: 'Child' }] };
    render(<Tree ref={ref} data={[original]} defaultExpandAll />);
    const key = ref.current!.getNode(original)!.key;
    act(() => ref.current?.append({ label: 'New' }, key));
    expect(ref.current?.getNode(original)?.key).toBe(key);
    expect(screen.getByRole('treeitem', { name: 'New' })).toBeVisible();
  },
);

apiTest(
  'tree',
  'Attributes',
  ['draggable', 'allow-drag', 'allow-drop'],
  'tree-draggable',
  '拖拽约束阻止禁用源和将父节点放入自己的后代',
  () => {
    const changed = vi.fn();
    render(
      <Tree
        data={data}
        nodeKey="id"
        defaultExpandAll
        draggable
        allowDrag={(node) => node.key !== 11}
        allowDrop={(_source, target) => target.key !== 2}
        onDataChange={changed}
      />,
    );
    const parent = screen.getByRole('treeitem', { name: 'Parent' }),
      child = screen.getByRole('treeitem', { name: 'Alpha' });
    expect(child).toHaveAttribute('draggable', 'false');
    fireEvent.dragStart(parent);
    fireEvent.drop(child);
    fireEvent.dragEnd(parent);
    expect(changed).not.toHaveBeenCalled();
    fireEvent.dragStart(child);
    fireEvent.drop(screen.getByRole('treeitem', { name: 'Other' }));
    fireEvent.dragEnd(child);
    expect(changed).not.toHaveBeenCalled();
  },
);
apiTest(
  'tree',
  'Events',
  ['node-drag-start', 'node-drag-enter', 'node-drag-leave', 'node-drag-over', 'node-drag-end', 'node-drop'],
  'tree-draggable',
  '拖放在结束时提交并按来源顺序发出结束和放置事件',
  () => {
    const ref = createRef<TreeHandle>(),
      start = vi.fn(),
      enter = vi.fn(),
      leave = vi.fn(),
      over = vi.fn(),
      end = vi.fn(),
      drop = vi.fn();
    render(
      <Tree
        ref={ref}
        data={data}
        nodeKey="id"
        defaultExpandAll
        draggable
        onNodeDragStart={start}
        onNodeDragEnter={enter}
        onNodeDragLeave={leave}
        onNodeDragOver={over}
        onNodeDragEnd={end}
        onNodeDrop={drop}
      />,
    );
    const source = screen.getByRole('treeitem', { name: 'Alpha' }),
      target = screen.getByRole('treeitem', { name: 'Other' });
    fireEvent.dragStart(source);
    fireEvent.dragEnter(target);
    fireEvent.dragLeave(target);
    fireEvent.dragOver(target);
    fireEvent.drop(target);
    expect(ref.current?.getNode(11)?.parent?.key).toBe(1);
    fireEvent.dragEnd(source);
    expect(ref.current?.getNode(11)?.parent?.key).toBe(2);
    expect(start).toHaveBeenCalledOnce();
    expect(enter).toHaveBeenCalledOnce();
    expect(leave).toHaveBeenCalledOnce();
    expect(over).toHaveBeenCalledOnce();
    expect(end).toHaveBeenCalledOnce();
    expect(drop).toHaveBeenCalledOnce();
    expect(end.mock.invocationCallOrder[0]).toBeLessThan(drop.mock.invocationCallOrder[0]);
  },
);

featureTest(
  'tree',
  'replace-pending-data',
  'tree-multiple-times-load',
  '外部替换数据后清除加载状态并丢弃旧节点回调',
  () => {
    const pending: Array<(data: TreeData[]) => void> = [];
    const load = (_node: TreeNode, resolve: (data: TreeData[]) => void): void => {
      pending.push(resolve);
    };
    const view = render(<Tree data={[{ id: 1, label: 'Old' }]} nodeKey="id" lazy load={load} />);
    fireEvent.click(screen.getByRole('button', { name: 'Expand Old' }));
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    view.rerender(<Tree data={[{ id: 1, label: 'New' }]} nodeKey="id" lazy load={load} />);
    expect(screen.queryByLabelText('Loading')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Expand New' }));
    act(() => pending[0]([{ id: 11, label: 'Stale', isLeaf: true }]));
    expect(screen.queryByText('Stale')).toBeNull();
    act(() => pending[1]([{ id: 12, label: 'Fresh', isLeaf: true }]));
    expect(screen.getByRole('treeitem', { name: 'Fresh' })).toBeVisible();
  },
);

featureTest(
  'tree',
  'remove-pending-node',
  'tree-multiple-times-load',
  '删除后复用相同键的新节点不会接收旧加载回调',
  () => {
    const ref = createRef<TreeHandle>(),
      pending: Array<(data: TreeData[]) => void> = [];
    render(
      <Tree
        ref={ref}
        nodeKey="id"
        data={[{ id: 1, label: 'Removed' }]}
        lazy
        load={(_node, resolve) => {
          pending.push(resolve);
        }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Expand Removed' }));
    act(() => ref.current?.remove(1));
    act(() => ref.current?.append({ id: 1, label: 'Replacement' }));
    act(() => pending[0]([{ id: 11, label: 'Stale', isLeaf: true }]));
    expect(screen.queryByText('Stale')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Expand Replacement' }));
    expect(pending).toHaveLength(2);
    act(() => pending[1]([{ id: 12, label: 'Fresh', isLeaf: true }]));
    expect(screen.getByRole('treeitem', { name: 'Fresh' })).toBeVisible();
  },
);
