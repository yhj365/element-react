# Tree 树形控件

展开层级节点并操作当前场景中的选择、过滤或拖放。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree data={data} nodeKey="id" />
    </div>
  );
}
```

### 可选择

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/selectable对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree data={data} nodeKey="id" showCheckbox />
    </div>
  );
}
```

### 自定义叶节点

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';

/** 官方tree/custom-leaf对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree
        nodeKey="id"
        lazy
        load={(node, resolve) =>
          resolve(
            node.level === 0
              ? [{ id: 1, label: 'Lazy root' }]
              : [{ id: 11, label: 'Lazy leaf', isLeaf: true }],
          )
        }
      />
    </div>
  );
}
```

### 懒加载重试

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { useRef } from 'react';
import { Tree } from 'element-react';

/** 官方tree/multiple-times-load对应场景。 */
export default function Example() {
  const attempted = useRef(false);
  return (
    <div className="w-full">
      <Tree
        nodeKey="id"
        lazy
        load={(node, resolve, reject) => {
          if (node.level === 0) resolve([{ id: 1, label: 'Retry loading' }]);
          else if (!attempted.current) {
            attempted.current = true;
            reject();
          } else resolve([{ id: 11, label: 'Loaded after retry', isLeaf: true }]);
        }}
      />
    </div>
  );
}
```

### 禁用复选框

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/disabled对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree data={data} nodeKey="id" showCheckbox defaultExpandAll />
    </div>
  );
}
```

### 默认展开和勾选

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/default-state对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree data={data} nodeKey="id" showCheckbox defaultExpandedKeys={[1]} defaultCheckedKeys={[11]} />
    </div>
  );
}
```

### 节点勾选操作

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { useRef } from 'react';
import { Tree, Button } from 'element-react';
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
/** 官方tree/checking-tree对应场景。 */
export default function Example() {
  const tree = useRef<TreeHandle>(null);
  return (
    <div className="w-full">
      <Button onClick={() => tree.current?.setCheckedKeys([11, 21])}>Check leaf nodes</Button>
      <Button onClick={() => tree.current?.setCheckedKeys([])}>Reset</Button>
      <Tree data={data} nodeKey="id" ref={tree} showCheckbox defaultExpandAll />
    </div>
  );
}
```

### 自定义节点内容

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { useRef } from 'react';
import { Tree, Button } from 'element-react';
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
/** 官方tree/customized-node对应场景。 */
export default function Example() {
  const tree = useRef<TreeHandle>(null);
  return (
    <div className="w-full">
      <Tree
        data={data}
        nodeKey="id"
        ref={tree}
        renderContent={({ node }) => (
          <span>
            {node.label}{' '}
            <Button
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                tree.current?.append({ id: Date.now(), label: 'New child' }, node.key);
              }}
            >
              Append
            </Button>
          </span>
        )}
      />
    </div>
  );
}
```

### 自定义节点类名

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/custom-node-class对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree
        data={data}
        nodeKey="id"
        props={{ class: (_data, node) => (node.isLeaf ? 'text-blue-500' : 'font-semibold') }}
        defaultExpandAll
      />
    </div>
  );
}
```

### 节点过滤

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { useRef } from 'react';
import { Tree, Input } from 'element-react';
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
/** 官方tree/filtering对应场景。 */
export default function Example() {
  const tree = useRef<TreeHandle>(null);
  return (
    <div className="w-full">
      <Input
        aria-label="Filter tree"
        placeholder="Filter keyword"
        onValueChange={(query) => tree.current?.filter(query)}
      />
      <Tree
        data={data}
        nodeKey="id"
        ref={tree}
        defaultExpandAll
        filterNodeMethod={(query, data) =>
          String(data.label).toLowerCase().includes(String(query).toLowerCase())
        }
      />
    </div>
  );
}
```

### 手风琴

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/accordion对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree data={data} nodeKey="id" accordion />
    </div>
  );
}
```

### 可拖拽

展开层级节点并操作当前场景中的选择、过滤或拖放。

```tsx
import { Tree } from 'element-react';
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
/** 官方tree/draggable对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree
        data={data}
        nodeKey="id"
        draggable
        defaultExpandAll
        allowDrop={(dragging, target) => dragging.key !== target.key}
      />
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | data | data | tree data | arrayArray<{[key: string]: any}> | — |
| Attributes | empty-text | emptyText | text displayed when data is void | string | — |
| Attributes | node-key | nodeKey | unique identity key name for nodes, its value should be unique across the whole tree | string | — |
| Attributes | [props](#props) | props | configuration options, see the following table | object | — |
| Attributes | render-after-expand | renderAfterExpand | whether to render child nodes only after a parent node is expanded for the first time | boolean | true |
| Attributes | load | load | method for loading subtree data, only works when `lazy` is true | Function(node, resolve, reject) => void | — |
| Attributes | render-content | renderContent | render function for tree node | Function(h, { node, data, store }) => void | — |
| Attributes | highlight-current | highlightCurrent | whether current node is highlighted | boolean | false |
| Attributes | default-expand-all | defaultExpandAll | whether to expand all nodes by default | boolean | false |
| Attributes | expand-on-click-node | expandOnClickNode | whether to expand or collapse node when clicking on the node, if false, then expand or collapse node only when clicking on the arrow icon. | boolean | true |
| Attributes | check-on-click-node | checkOnClickNode | whether to check or uncheck node when clicking on the node, if false, the node can only be checked or unchecked by clicking on the checkbox. | boolean | false |
| Attributes | check-on-click-leaf | checkOnClickLeaf | whether to check or uncheck node when clicking on leaf node (last children). | boolean | true |
| Attributes | auto-expand-parent | autoExpandParent | whether to expand father node when a child node is expanded | boolean | true |
| Attributes | default-expanded-keys | defaultExpandedKeys | array of keys of initially expanded nodes | arrayArray<string \| number> | — |
| Attributes | show-checkbox | showCheckbox | whether node is selectable | boolean | false |
| Attributes | check-strictly | checkStrictly | whether checked state of a node not affects its father and child nodes when `show-checkbox` is `true` | boolean | false |
| Attributes | default-checked-keys | defaultCheckedKeys | array of keys of initially checked nodes | arrayArray<string \| number> | — |
| Attributes | current-node-key | currentNodeKey | key of initially selected node | string / number | — |
| Attributes | filter-node-method | filterNodeMethod | this function will be executed on each node when use filter method. if return `false`, tree node will be hidden. | Function(value, data, node) => boolean | — |
| Attributes | accordion | accordion | whether only one node among the same level can be expanded at one time | boolean | false |
| Attributes | indent | indent | horizontal indentation of nodes in adjacent levels in pixels | number | 18 |
| Attributes | icon | icon | custom tree node icon component | string / Component | — |
| Attributes | lazy | lazy | whether to lazy load leaf node, used with `load` attribute | boolean | false |
| Attributes | draggable | draggable | whether enable tree nodes drag and drop | boolean | false |
| Attributes | allow-drag | allowDrag | this function will be executed before dragging a node. If `false` is returned, the node can not be dragged | Function(node) => boolean | — |
| Attributes | allow-drop | allowDrop | this function will be executed before the dragging node is dropped. If `false` is returned, the dragging node can not be dropped at the target node. `type` has three possible values: 'prev' (inserting the dragging node before the target node), 'inner' (inserting the dragging node to the target node) and 'next' (inserting the dragging node after the target node) | Function(draggingNode, dropNode, type) => boolean | — |
| props | label | label | specify which key of node object is used as the node's label | string / Function(data, node) => string | — |
| props | children | children | specify which node object is used as the node's subtree | string | — |
| props | disabled | disabled | specify which key of node object represents if node's checkbox is disabled | string / Function(data, node) => boolean | — |
| props | isLeaf | isLeaf | specify whether the node is a leaf node, only works when lazy load is enabled | string / Function(data, node) => boolean | — |
| props | class | className | custom node class name | string / Function(data, node) => string | — |
| Exposes | filter | ref.current.filter | filter all tree nodes, filtered nodes will be hidden |  | — |
| Exposes | updateKeyChildren | ref.current.updateKeyChildren | set new data to node, only works when `node-key` is assigned |  | — |
| Exposes | getCheckedNodes | ref.current.getCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes |  | — |
| Exposes | setCheckedNodes | ref.current.setCheckedNodes | set certain nodes to be checked, only works when `node-key` is assigned |  | — |
| Exposes | getCheckedKeys | ref.current.getCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of node's keys |  | — |
| Exposes | setCheckedKeys | ref.current.setCheckedKeys | set certain nodes to be checked, only works when `node-key` is assigned |  | — |
| Exposes | setChecked | ref.current.setChecked | set node to be checked or not, only works when `node-key` is assigned |  | — |
| Exposes | getHalfCheckedNodes | ref.current.getHalfCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of nodes |  | — |
| Exposes | getHalfCheckedKeys | ref.current.getHalfCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of node's keys |  | — |
| Exposes | getCurrentKey | ref.current.getCurrentKey | return the highlight node's key (null if no node is highlighted) |  | — |
| Exposes | getCurrentNode | ref.current.getCurrentNode | return the highlight node's data (null if no node is highlighted) |  | — |
| Exposes | setCurrentKey | ref.current.setCurrentKey | set highlighted node by key, only works when `node-key` is assigned |  | — |
| Exposes | setCurrentNode | ref.current.setCurrentNode | set highlighted node, only works when `node-key` is assigned |  | — |
| Exposes | getNode | ref.current.getNode | get node by data or key |  | — |
| Exposes | remove | ref.current.remove | remove a node, only works when node-key is assigned |  | — |
| Exposes | append | ref.current.append | append a child node to a given node in the tree |  | — |
| Exposes | insertBefore | ref.current.insertBefore | insert a node before a given node in the tree |  | — |
| Exposes | insertAfter | ref.current.insertAfter | insert a node after a given node in the tree |  | — |
| Events | node-click | onNodeClick | triggers when a node is clicked |  | — |
| Events | node-contextmenu | onNodeContextmenu | triggers when a node is clicked by right button |  | — |
| Events | check-change | onCheckChange | triggers when the selected state of the node changes |  | — |
| Events | check | onCheck | triggers after clicking the checkbox of a node |  | — |
| Events | current-change | onCurrentChange | triggers when current node changes |  | — |
| Events | node-expand | onNodeExpand | triggers when current node open |  | — |
| Events | node-collapse | onNodeCollapse | triggers when current node close |  | — |
| Events | node-drag-start | onNodeDragStart | triggers when dragging starts |  | — |
| Events | node-drag-enter | onNodeDragEnter | triggers when the dragging node enters another node |  | — |
| Events | node-drag-leave | onNodeDragLeave | triggers when the dragging node leaves a node |  | — |
| Events | node-drag-over | onNodeDragOver | triggers when dragging over a node (like mouseover event) |  | — |
| Events | node-drag-end | onNodeDragEnd | triggers when dragging ends |  | — |
| Events | node-drop | onNodeDrop | triggers after the dragging node is dropped |  | — |
| Slots | default | renderContent | custom content for tree nodes | object{ node: UnwrapRef<RootTreeType['root']>, data: Tree \| TreeOptionProps } | — |
| Slots | empty | renderEmpty | custom content when data is empty | — | — |

## 完成记录

- [x] tree:137 data；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:138 emptyText；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:139 nodeKey；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:140 props；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:141 renderAfterExpand；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:142 load；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:143 renderContent；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:144 highlightCurrent；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:145 defaultExpandAll；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:146 expandOnClickNode；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:147 checkOnClickNode；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:148 checkOnClickLeaf；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:149 autoExpandParent；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:150 defaultExpandedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:151 showCheckbox；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:152 checkStrictly；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:153 defaultCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:154 currentNodeKey；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:155 filterNodeMethod；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:156 accordion；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:157 indent；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:158 icon；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:159 lazy；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:160 draggable；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:161 allowDrag；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:162 allowDrop；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:168 label；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:169 children；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:170 disabled；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:171 isLeaf；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:172 className；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:180 ref.current.filter；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:181 ref.current.updateKeyChildren；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:182 ref.current.getCheckedNodes；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:183 ref.current.setCheckedNodes；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:184 ref.current.getCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:185 ref.current.setCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:186 ref.current.setChecked；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:187 ref.current.getHalfCheckedNodes；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:188 ref.current.getHalfCheckedKeys；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:189 ref.current.getCurrentKey；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:190 ref.current.getCurrentNode；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:191 ref.current.setCurrentKey；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:192 ref.current.setCurrentNode；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:193 ref.current.getNode；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:194 ref.current.remove；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:195 ref.current.append；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:196 ref.current.insertBefore；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:197 ref.current.insertAfter；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:203 onNodeClick；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:204 onNodeContextmenu；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:205 onCheckChange；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:206 onCheck；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:207 onCurrentChange；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:208 onNodeExpand；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:209 onNodeCollapse；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:210 onNodeDragStart；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:211 onNodeDragEnter；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:212 onNodeDragLeave；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:213 onNodeDragOver；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:214 onNodeDragEnd；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:215 onNodeDrop；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:221 renderContent；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
- [x] tree:222 renderEmpty；实现：packages/components/tree/index.tsx；测试：tests/tree.test.tsx
