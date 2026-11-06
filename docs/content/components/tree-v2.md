# TreeV2 虚拟化树形控件

虚拟树仅挂载可见节点，滚动查看其余内容。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Node ${id}` }));
/** 官方tree-v2/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} />
    </div>
  );
}
```

### 可选择

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/selectable对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} showCheckbox />
    </div>
  );
}
```

### 禁用复选框

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/disabled对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} showCheckbox />
    </div>
  );
}
```

### 默认展开和勾选

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/default-state对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} showCheckbox defaultExpandedKeys={[1]} defaultCheckedKeys={[11]} />
    </div>
  );
}
```

### 自定义节点

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/custom-node对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} renderContent={({ node }) => <b>{node.label}</b>} />
    </div>
  );
}
```

### 自定义节点类名

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/custom-node-class对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2
        data={data}
        height={240}
        props={{ class: (_data, node) => (node.isLeaf ? 'text-blue-500' : 'font-semibold') }}
      />
    </div>
  );
}
```

### 自定义图标

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { TreeV2 } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/custom-icon对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} icon={<span>▸</span>} />
    </div>
  );
}
```

### 节点过滤

虚拟树仅挂载可见节点，滚动查看其余内容。

```tsx
import { useRef } from 'react';
import { TreeV2, Input } from 'element-react';
import type { TreeHandle } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-v2/filter对应场景。 */
export default function Example() {
  const tree = useRef<TreeHandle>(null);
  return (
    <div className="w-full">
      <Input aria-label="Filter virtual tree" onValueChange={(query) => tree.current?.filter(query)} />
      <TreeV2
        data={data}
        height={240}
        ref={tree}
        filterMethod={(query, data) => String(data.label).includes(String(query))}
      />
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| TreeV2 Attributes | data | data | tree data | arrayArray<{[key: string]: any}> | — |
| TreeV2 Attributes | empty-text | emptyText | text displayed when data is void | string | — |
| TreeV2 Attributes | [props](#props) | props | configuration options, see the following table | object | — |
| TreeV2 Attributes | highlight-current | highlightCurrent | whether current node is highlighted | boolean | false |
| TreeV2 Attributes | expand-on-click-node | expandOnClickNode | whether to expand or collapse node when clicking on the node, if false, then expand or collapse node only when clicking on the arrow icon. | boolean | true |
| TreeV2 Attributes | check-on-click-node | checkOnClickNode | whether to check or uncheck node when clicking on the node, if false, the node can only be checked or unchecked by clicking on the checkbox. | boolean | false |
| TreeV2 Attributes | check-on-click-leaf | checkOnClickLeaf | whether to check or uncheck node when clicking on leaf node (last children). | boolean | true |
| TreeV2 Attributes | default-expanded-keys | defaultExpandedKeys | array of keys of initially expanded nodes | arrayArray<string \| number> | — |
| TreeV2 Attributes | show-checkbox | showCheckbox | whether node is selectable | boolean | false |
| TreeV2 Attributes | check-strictly | checkStrictly | whether checked state of a node not affects its father and child nodes when `show-checkbox` is `true` | boolean | false |
| TreeV2 Attributes | default-checked-keys | defaultCheckedKeys | array of keys of initially checked nodes | arrayArray<string \| number> | — |
| TreeV2 Attributes | current-node-key | currentNodeKey | key of initially selected node | string / number | — |
| TreeV2 Attributes | filter-method | filterMethod | this function will be executed on each node when use filter method. if return `false`, tree node will be hidden. | Function(query: string, data: TreeNodeData, node: TreeNode) => boolean | — |
| TreeV2 Attributes | indent | indent | horizontal indentation of nodes in adjacent levels in pixels | number | 16 |
| TreeV2 Attributes | icon | icon | custom tree node icon component | string / Component | — |
| TreeV2 Attributes | item-size | itemSize | custom tree node height | number | 26 |
| TreeV2 Attributes | scrollbar-always-on | scrollbarAlwaysOn | always show scrollbar | boolean | false |
| TreeV2 Attributes | height | height | height of the tree | number | 200 |
| props | value | value | unique identity key name for nodes, its value should be unique across the whole tree | string | id |
| props | label | label | specify which key of node object is used as the node's label | string | label |
| props | children | children | specify which node object is used as the node's subtree | string | children |
| props | disabled | disabled | specify which key of node object represents if node's checkbox is disabled | string | disabled |
| props | class | className | custom node class name | string / Function(data: TreeNodeData, node: TreeNode) => string \| {[key: string]: boolean} | — |
| TreeV2 Exposes | filter | ref.current.filter | filter all tree nodes, filtered nodes will be hidden |  | — |
| TreeV2 Exposes | getCheckedNodes | ref.current.getCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes |  | — |
| TreeV2 Exposes | getCheckedKeys | ref.current.getCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of node's keys |  | — |
| TreeV2 Exposes | setCheckedKeys | ref.current.setCheckedKeys | set certain nodes to be checked |  | — |
| TreeV2 Exposes | setChecked | ref.current.setChecked | set node to be checked or not, `deep` (added in ^(2.14.0)) indicates whether child nodes should be recursively checked/unchecked. |  | — |
| TreeV2 Exposes | setExpandedKeys | ref.current.setExpandedKeys | set certain nodes to be expanded |  | — |
| TreeV2 Exposes | getHalfCheckedNodes | ref.current.getHalfCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of nodes |  | — |
| TreeV2 Exposes | getHalfCheckedKeys | ref.current.getHalfCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of node's keys |  | — |
| TreeV2 Exposes | getCurrentKey | ref.current.getCurrentKey | return the highlight node's key (undefined if no node is highlighted) |  | — |
| TreeV2 Exposes | getCurrentNode | ref.current.getCurrentNode | return the highlight node's data (undefined if no node is highlighted) |  | — |
| TreeV2 Exposes | setCurrentKey | ref.current.setCurrentKey | set highlighted node by key |  | — |
| TreeV2 Exposes | getNode | ref.current.getNode | get node by key or data |  | — |
| TreeV2 Exposes | expandNode | ref.current.expandNode | expand specified node |  | — |
| TreeV2 Exposes | collapseNode | ref.current.collapseNode | collapse specified node |  | — |
| TreeV2 Exposes | setData | ref.current.setData | When the data is very large, using reactive data will cause the poor performance, so we provide a way to avoid this situation |  | — |
| TreeV2 Exposes | scrollTo | ref.current.scrollTo | scroll to a given position |  | — |
| TreeV2 Exposes | scrollToNode | ref.current.scrollToNode | scroll to a given tree key with specified scroll strategy |  | — |
| TreeV2 Events | node-click | onNodeClick | triggers when a node is clicked |  | — |
| TreeV2 Events | node-drop | onNodeDrop | triggers when drag something and drop on a node |  | — |
| TreeV2 Events | node-contextmenu | onNodeContextmenu | triggers when a node is clicked by right button |  | — |
| TreeV2 Events | check-change | onCheckChange | triggers when the selected state of the node changes |  | — |
| TreeV2 Events | check | onCheck | triggers after clicking the checkbox of a node |  | — |
| TreeV2 Events | current-change | onCurrentChange | triggers when current node changes |  | — |
| TreeV2 Events | node-expand | onNodeExpand | triggers when current node open |  | — |
| TreeV2 Events | node-collapse | onNodeCollapse | triggers when current node close |  | — |
| TreeV2 Slots | default | renderContent | custom content for tree nodes | object{ node: TreeNode, data: TreeNodeData } | — |
| TreeV2 Slots | empty | renderEmpty | custom content when data is empty | — | — |

## 完成记录

- [x] tree-v2:104 data；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:105 emptyText；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:106 props；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:107 highlightCurrent；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:108 expandOnClickNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:109 checkOnClickNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:110 checkOnClickLeaf；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:111 defaultExpandedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:112 showCheckbox；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:113 checkStrictly；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:114 defaultCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:115 currentNodeKey；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:116 filterMethod；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:117 indent；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:118 icon；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:119 itemSize；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:120 scrollbarAlwaysOn；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:121 height；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:127 value；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:128 label；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:129 children；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:130 disabled；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:131 className；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:139 ref.current.filter；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:140 ref.current.getCheckedNodes；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:141 ref.current.getCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:142 ref.current.setCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:143 ref.current.setChecked；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:144 ref.current.setExpandedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:145 ref.current.getHalfCheckedNodes；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:146 ref.current.getHalfCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:147 ref.current.getCurrentKey；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:148 ref.current.getCurrentNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:149 ref.current.setCurrentKey；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:150 ref.current.getNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:151 ref.current.expandNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:152 ref.current.collapseNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:153 ref.current.setData；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:154 ref.current.scrollTo；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:155 ref.current.scrollToNode；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:161 onNodeClick；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:162 onNodeDrop；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:163 onNodeContextmenu；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:164 onCheckChange；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:165 onCheck；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:166 onCurrentChange；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:167 onNodeExpand；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:168 onNodeCollapse；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:174 renderContent；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
- [x] tree-v2:175 renderEmpty；实现：packages/components/tree/index.tsx；测试：tests/tree-v2.test.tsx
