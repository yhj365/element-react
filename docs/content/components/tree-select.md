# TreeSelect 树形选择

展开树选择叶节点，按配置支持任意层级、多选和搜索。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" clearable />
    </div>
  );
}
```

### 选择任意层级

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/check-strictly对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" checkStrictly />
    </div>
  );
}
```

### 多选

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/multiple对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" multiple showCheckbox clearable />
    </div>
  );
}
```

### 禁用选择

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/disabled对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" showCheckbox multiple defaultExpandAll />
    </div>
  );
}
```

### 可搜索

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/filterable对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" filterable clearable />
    </div>
  );
}
```

### 自定义内容

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/slots对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect
        data={data}
        ariaLabel="Tree selection"
        renderContent={({ node }) => (
          <span>
            <b>{node.label}</b> <small>#{String(node.key)}</small>
          </span>
        )}
      />
    </div>
  );
}
```

### 懒加载

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';

/** 官方tree-select/lazy对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect
        ariaLabel="Tree selection"
        lazy
        load={(node, resolve) =>
          resolve(
            node.level === 0
              ? [{ value: 1, label: 'Lazy root' }]
              : [{ value: 11, label: 'Lazy leaf', isLeaf: true }],
          )
        }
        cacheData={[{ value: 11, currentLabel: 'Lazy leaf' }]}
        defaultValue={11}
      />
    </div>
  );
}
```

### 自定义节点键

展开树选择叶节点，按配置支持任意层级、多选和搜索。

```tsx
import { TreeSelect } from 'element-react';
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
/** 官方tree-select/node-key对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" nodeKey="id" />
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | [tree](./tree.md#attributes) | [tree](./tree.md#attributes) | 详见来源契约 |  | — |
| Attributes | [select](./select.md#select-attributes) | [select](./select.md#selectAttributes) | 详见来源契约 |  | — |
| Own Attributes | cache-data | cacheData | The cached data of the lazy node, the structure is the same as the data, used to get the label of the unloaded data | arrayCacheOption[] | [] |
| Exposes | treeRef | ref.current.treeRef | Tree component instance | TreeInstance | — |
| Exposes | selectRef | ref.current.selectRef | Select component instance | SelectInstance | — |
| Exposes | filter | ref.current.filter | filter all tree nodes, filtered nodes will be hidden | Accept a parameter which will be used as first parameter for filter-node-method | — |
| Exposes | updateKeyChildren | ref.current.updateKeyChildren | set new data to node, only works when `node-key` is assigned | (key, data) Accept two parameters: 1. key of node 2. new data | — |
| Exposes | getCheckedNodes | ref.current.getCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes | (leafOnly, includeHalfChecked) Accept two boolean type parameters: 1. default value is false. If the parameter is true, it only returns the currently selected array of sub-nodes. 2. default value is false. If the parameter is true, the return value contains halfchecked nodes | — |
| Exposes | setCheckedNodes | ref.current.setCheckedNodes | set certain nodes to be checked, only works when `node-key` is assigned | an array of nodes to be checked | — |
| Exposes | getCheckedKeys | ref.current.getCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of node's keys | (leafOnly) Accept a boolean type parameter whose default value is false. If the parameter is true, it only returns the currently selected array of sub-nodes. | — |
| Exposes | setCheckedKeys | ref.current.setCheckedKeys | set certain nodes to be checked, only works when `node-key` is assigned | (keys, leafOnly) Accept two parameters: 1. an array of node's keys to be checked 2. a boolean parameter. If set to true, only the checked status of leaf nodes will be set. The default value is false. | — |
| Exposes | setChecked | ref.current.setChecked | set node to be checked or not, only works when `node-key` is assigned | (key/data, checked, deep) Accept three parameters: 1. node's key or data to be checked 2. a boolean typed parameter indicating checked or not. 3. a boolean typed parameter indicating whether to recursively check/uncheck child nodes (since ^(2.14.0), this works regardless of the check-strictly setting). | — |
| Exposes | getHalfCheckedNodes | ref.current.getHalfCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of nodes | — | — |
| Exposes | getHalfCheckedKeys | ref.current.getHalfCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of node's keys | — | — |
| Exposes | getCurrentKey | ref.current.getCurrentKey | return the highlight node's key (null if no node is highlighted) | — | — |
| Exposes | getCurrentNode | ref.current.getCurrentNode | return the highlight node's data (null if no node is highlighted) | — | — |
| Exposes | setCurrentKey | ref.current.setCurrentKey | set highlighted node by key, only works when `node-key` is assigned | (key, shouldAutoExpandParent=true) 1. the node's key to be highlighted. If null, cancel the currently highlighted node 2. whether to automatically expand parent node | — |
| Exposes | setCurrentNode | ref.current.setCurrentNode | set highlighted node, only works when `node-key` is assigned | (node, shouldAutoExpandParent=true) 1. the node to be highlighted 2. whether to automatically expand parent node | — |
| Exposes | getNode | ref.current.getNode | get node by data or key | (data) the node's data or key | — |
| Exposes | remove | ref.current.remove | remove a node, only works when node-key is assigned | (data) the node's data or node to be deleted | — |
| Exposes | append | ref.current.append | append a child node to a given node in the tree | (data, parentNode) 1. child node's data to be appended 2. parent node's data, key or node | — |
| Exposes | insertBefore | ref.current.insertBefore | insert a node before a given node in the tree | (data, refNode) 1. node's data to be inserted 2. reference node's data, key or node | — |
| Exposes | insertAfter | ref.current.insertAfter | insert a node after a given node in the tree | (data, refNode) 1. node's data to be inserted 2. reference node's data, key or node | — |
| Exposes | focus | ref.current.focus | focus the Input component | Function() => void | — |
| Exposes | blur | ref.current.blur | blur the Input component, and hide the dropdown | Function() => void | — |
| Exposes | selectedLabel | ref.current.selectedLabel | get the currently selected label | objectComputedRef<string \| string[]> | — |

## 完成记录

- [x] tree-select:128 [tree](./tree.md#attributes)；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:129 [select](./select.md#selectAttributes)；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:135 cacheData；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:147 ref.current.treeRef；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:148 ref.current.selectRef；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:149 ref.current.filter；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:150 ref.current.updateKeyChildren；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:151 ref.current.getCheckedNodes；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:152 ref.current.setCheckedNodes；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:153 ref.current.getCheckedKeys；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:154 ref.current.setCheckedKeys；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:155 ref.current.setChecked；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:156 ref.current.getHalfCheckedNodes；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:157 ref.current.getHalfCheckedKeys；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:158 ref.current.getCurrentKey；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:159 ref.current.getCurrentNode；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:160 ref.current.setCurrentKey；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:161 ref.current.setCurrentNode；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:162 ref.current.getNode；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:163 ref.current.remove；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:164 ref.current.append；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:165 ref.current.insertBefore；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:166 ref.current.insertAfter；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:167 ref.current.focus；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:168 ref.current.blur；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
- [x] tree-select:169 ref.current.selectedLabel；实现：packages/components/tree-select/index.tsx；测试：tests/tree-select.test.tsx
