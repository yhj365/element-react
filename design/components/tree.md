# Tree 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/tree.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 树数据、节点键、字段映射。
- 展开/选中/勾选/半选、严格关联。
- 懒加载、过滤、自定义节点。
- 拖拽约束、节点增删改查和实例方法。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Selectable（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Custom leaf node in lazy mode（原文第37行）：建立React示例与对应行为/视觉断言。
- [ ] Lazy loading multiple times ^(2.6.3)（原文第45行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled checkbox（原文第53行）：建立React示例与对应行为/视觉断言。
- [ ] Default expanded and default checked（原文第63行）：建立React示例与对应行为/视觉断言。
- [ ] Checking tree nodes（原文第73行）：建立React示例与对应行为/视觉断言。
- [ ] Custom node content（原文第81行）：建立React示例与对应行为/视觉断言。
- [ ] Custom node class（原文第91行）：建立React示例与对应行为/视觉断言。
- [ ] Tree node filtering（原文第101行）：建立React示例与对应行为/视觉断言。
- [ ] Accordion（原文第111行）：建立React示例与对应行为/视觉断言。
- [ ] Draggable（原文第121行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

节点索引保留原始数据引用语义、parent/children/level；checked、halfChecked、expanded、current和loading独立。严格勾选与父子关联分支分别实现；filter不破坏勾选。懒载和拖拽取消具有回滚与过期保护，实例节点查询不能泄漏React内部对象。

## 3. React 19 结构与交互契约

- 主导出拟为 Tree，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
- 属性采用camelCase；modelValue映射value/defaultValue/onValueChange；源change映射onChange并保留原语义。涉及visible、checked、active等状态时，按照源API单独建受控通道，不强行改名为open。
- 静态内容使用ReactNode；默认区域children；具名区域renderXxx；带参数的区域使用类型化render函数。原函数不得接收或返回Vue VNode。
- ref作为React19属性；仅暴露来源已公开的实例能力，底层DOM与组件handle区分；state不可通过修改ref绕过受控模型。
- 事件由用户交互或明确实例调用触发；父级回写Props不得重复触发change。IME、disabled、readonly、loading只在来源支持时适用；不得凭通用模板扩展未有API。
- 外观复用源SCSS、变量、状态类、尺寸和动画基线；默认保留el命名空间以降低样式偏差，自定义namespace同步编译主题，禁止直接换为其他库外观。
- 所有时序、优先级、异步取消与事件顺序以源实现/测试确认；未审计项登记，不用推测填成已兼容。

## 4. 逐项 API 对照

下表覆盖源文档所有表格行，包括复合子组件；section列区分所属API。原类型/参数/默认值完整保存在来源快照及api-matrix.json，不把机械命名转换视为最终TypeScript签名。特别是布尔双向绑定、Date/Dayjs、DOM事件、VNode回调、路由和Promise均需逐项完成类型审计。

| 来源章节 | 类别 | 来源名称 | React拟定接口 | 来源行 |
|---|---|---|---|---|
| Attributes | prop | data | data | 137 |
| Attributes | prop | empty-text | emptyText | 138 |
| Attributes | prop | node-key | nodeKey | 139 |
| Attributes | prop | [props](#props) | [props](#props) | 140 |
| Attributes | prop | render-after-expand | renderAfterExpand | 141 |
| Attributes | prop | load | load | 142 |
| Attributes | prop | render-content | renderContent | 143 |
| Attributes | prop | highlight-current | highlightCurrent | 144 |
| Attributes | prop | default-expand-all | defaultExpandAll | 145 |
| Attributes | prop | expand-on-click-node | expandOnClickNode | 146 |
| Attributes | prop | check-on-click-node | checkOnClickNode | 147 |
| Attributes | prop | check-on-click-leaf | checkOnClickLeaf | 148 |
| Attributes | prop | auto-expand-parent | autoExpandParent | 149 |
| Attributes | prop | default-expanded-keys | defaultExpandedKeys | 150 |
| Attributes | prop | show-checkbox | showCheckbox | 151 |
| Attributes | prop | check-strictly | checkStrictly | 152 |
| Attributes | prop | default-checked-keys | defaultCheckedKeys | 153 |
| Attributes | prop | current-node-key | currentNodeKey | 154 |
| Attributes | prop | filter-node-method | filterNodeMethod | 155 |
| Attributes | prop | accordion | accordion | 156 |
| Attributes | prop | indent | indent | 157 |
| Attributes | prop | icon | icon | 158 |
| Attributes | prop | lazy | lazy | 159 |
| Attributes | prop | draggable | draggable | 160 |
| Attributes | prop | allow-drag | allowDrag | 161 |
| Attributes | prop | allow-drop | allowDrop | 162 |
| props | prop | label | label | 168 |
| props | prop | children | children | 169 |
| props | prop | disabled | disabled | 170 |
| props | prop | isLeaf | isLeaf | 171 |
| props | prop | class | className | 172 |
| Exposes | ref | filter | ref.current.filter | 180 |
| Exposes | ref | updateKeyChildren | ref.current.updateKeyChildren | 181 |
| Exposes | ref | getCheckedNodes | ref.current.getCheckedNodes | 182 |
| Exposes | ref | setCheckedNodes | ref.current.setCheckedNodes | 183 |
| Exposes | ref | getCheckedKeys | ref.current.getCheckedKeys | 184 |
| Exposes | ref | setCheckedKeys | ref.current.setCheckedKeys | 185 |
| Exposes | ref | setChecked | ref.current.setChecked | 186 |
| Exposes | ref | getHalfCheckedNodes | ref.current.getHalfCheckedNodes | 187 |
| Exposes | ref | getHalfCheckedKeys | ref.current.getHalfCheckedKeys | 188 |
| Exposes | ref | getCurrentKey | ref.current.getCurrentKey | 189 |
| Exposes | ref | getCurrentNode | ref.current.getCurrentNode | 190 |
| Exposes | ref | setCurrentKey | ref.current.setCurrentKey | 191 |
| Exposes | ref | setCurrentNode | ref.current.setCurrentNode | 192 |
| Exposes | ref | getNode | ref.current.getNode | 193 |
| Exposes | ref | remove | ref.current.remove | 194 |
| Exposes | ref | append | ref.current.append | 195 |
| Exposes | ref | insertBefore | ref.current.insertBefore | 196 |
| Exposes | ref | insertAfter | ref.current.insertAfter | 197 |
| Events | event | node-click | onNodeClick | 203 |
| Events | event | node-contextmenu | onNodeContextmenu | 204 |
| Events | event | check-change | onCheckChange | 205 |
| Events | event | check | onCheck | 206 |
| Events | event | current-change | onCurrentChange | 207 |
| Events | event | node-expand | onNodeExpand | 208 |
| Events | event | node-collapse | onNodeCollapse | 209 |
| Events | event | node-drag-start | onNodeDragStart | 210 |
| Events | event | node-drag-enter | onNodeDragEnter | 211 |
| Events | event | node-drag-leave | onNodeDragLeave | 212 |
| Events | event | node-drag-over | onNodeDragOver | 213 |
| Events | event | node-drag-end | onNodeDragEnd | 214 |
| Events | event | node-drop | onNodeDrop | 215 |
| Slots | slot | default | children | 221 |
| Slots | slot | empty | renderEmpty | 222 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| tree:137 | Attributes | data | tree data | ^[array]`Array<{[key: string]: any}>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:138 | Attributes | empty-text | text displayed when data is void | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:139 | Attributes | node-key | unique identity key name for nodes, its value should be unique across the whole tree | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:140 | Attributes | [props](#props) | configuration options, see the following table | ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:141 | Attributes | render-after-expand | whether to render child nodes only after a parent node is expanded for the first time | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:142 | Attributes | load | method for loading subtree data, only works when `lazy` is true | ^[Function]`(node, resolve, reject) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:143 | Attributes | render-content | render function for tree node | ^[Function]`(h, { node, data, store }) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:144 | Attributes | highlight-current | whether current node is highlighted | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:145 | Attributes | default-expand-all | whether to expand all nodes by default | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:146 | Attributes | expand-on-click-node | whether to expand or collapse node when clicking on the node, if false, then expand or collapse node only when clicking on the arrow icon. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:147 | Attributes | check-on-click-node | whether to check or uncheck node when clicking on the node, if false, the node can only be checked or unchecked by clicking on the checkbox. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:148 | Attributes | check-on-click-leaf | whether to check or uncheck node when clicking on leaf node (last children). | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:149 | Attributes | auto-expand-parent | whether to expand father node when a child node is expanded | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:150 | Attributes | default-expanded-keys | array of keys of initially expanded nodes | ^[array]`Array<string \| number>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:151 | Attributes | show-checkbox | whether node is selectable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:152 | Attributes | check-strictly | whether checked state of a node not affects its father and child nodes when `show-checkbox` is `true` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:153 | Attributes | default-checked-keys | array of keys of initially checked nodes | ^[array]`Array<string \| number>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:154 | Attributes | current-node-key | key of initially selected node | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:155 | Attributes | filter-node-method | this function will be executed on each node when use filter method. if return `false`, tree node will be hidden. | ^[Function]`(value, data, node) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:156 | Attributes | accordion | whether only one node among the same level can be expanded at one time | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:157 | Attributes | indent | horizontal indentation of nodes in adjacent levels in pixels | ^[number] | 18 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:158 | Attributes | icon | custom tree node icon component | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:159 | Attributes | lazy | whether to lazy load leaf node, used with `load` attribute | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:160 | Attributes | draggable | whether enable tree nodes drag and drop | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:161 | Attributes | allow-drag | this function will be executed before dragging a node. If `false` is returned, the node can not be dragged | ^[Function]`(node) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:162 | Attributes | allow-drop | this function will be executed before the dragging node is dropped. If `false` is returned, the dragging node can not be dropped at the target node. `type` has three possible values: 'prev' (inserting the dragging node before the target node), 'inner' (inserting the dragging node to the target node) and 'next' (inserting the dragging node after the target node) | ^[Function]`(draggingNode, dropNode, type) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:168 | props | label | specify which key of node object is used as the node's label | ^[string] / ^[Function]`(data, node) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:169 | props | children | specify which node object is used as the node's subtree | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:170 | props | disabled | specify which key of node object represents if node's checkbox is disabled | ^[string] / ^[Function]`(data, node) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:171 | props | isLeaf | specify whether the node is a leaf node, only works when lazy load is enabled | ^[string] / ^[Function]`(data, node) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree:172 | props | class | custom node class name | ^[string] / ^[Function]`(data, node) => string` | — | 保留根节点与内部节点位置，不覆盖必需状态类名。 |
| tree:180 | Exposes | filter | filter all tree nodes, filtered nodes will be hidden | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:181 | Exposes | updateKeyChildren | set new data to node, only works when `node-key` is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:182 | Exposes | getCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:183 | Exposes | setCheckedNodes | set certain nodes to be checked, only works when `node-key` is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:184 | Exposes | getCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of node's keys | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:185 | Exposes | setCheckedKeys | set certain nodes to be checked, only works when `node-key` is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:186 | Exposes | setChecked | set node to be checked or not, only works when `node-key` is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:187 | Exposes | getHalfCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of nodes | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:188 | Exposes | getHalfCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of node's keys | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:189 | Exposes | getCurrentKey | return the highlight node's key (null if no node is highlighted) | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:190 | Exposes | getCurrentNode | return the highlight node's data (null if no node is highlighted) | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:191 | Exposes | setCurrentKey | set highlighted node by key, only works when `node-key` is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:192 | Exposes | setCurrentNode | set highlighted node, only works when `node-key` is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:193 | Exposes | getNode | get node by data or key | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:194 | Exposes | remove | remove a node, only works when node-key is assigned | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:195 | Exposes | append | append a child node to a given node in the tree | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:196 | Exposes | insertBefore | insert a node before a given node in the tree | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:197 | Exposes | insertAfter | insert a node after a given node in the tree | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree:203 | Events | node-click | triggers when a node is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:204 | Events | node-contextmenu | triggers when a node is clicked by right button | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:205 | Events | check-change | triggers when the selected state of the node changes | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:206 | Events | check | triggers after clicking the checkbox of a node | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:207 | Events | current-change | triggers when current node changes | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:208 | Events | node-expand | triggers when current node open | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:209 | Events | node-collapse | triggers when current node close | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:210 | Events | node-drag-start | triggers when dragging starts | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:211 | Events | node-drag-enter | triggers when the dragging node enters another node | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:212 | Events | node-drag-leave | triggers when the dragging node leaves a node | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:213 | Events | node-drag-over | triggers when dragging over a node (like mouseover event) | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:214 | Events | node-drag-end | triggers when dragging ends | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:215 | Events | node-drop | triggers after the dragging node is dropped | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree:221 | Slots | default | custom content for tree nodes | ^[object]`{ node: UnwrapRef<RootTreeType['root']>, data: Tree \| TreeOptionProps }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tree:222 | Slots | empty | custom content when data is empty | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/tree](../../reference/element-plus/packages/components/tree/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/tree/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/selectable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/custom-leaf.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/multiple-times-load.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/default-state.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/checking-tree.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/customized-node.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/custom-node-class.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/filtering.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/accordion.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree/draggable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
