# TreeV2 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/tree-v2.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 固定高度虚拟树。
- 数据字段映射、展开、选中、复选/半选。
- 过滤、滚动到节点、键盘。
- 与普通Tree的懒加载/拖拽差异按原API验收。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Selectable（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled checkbox（原文第37行）：建立React示例与对应行为/视觉断言。
- [ ] Default expanded and default checked（原文第47行）：建立React示例与对应行为/视觉断言。
- [ ] Custom node content（原文第57行）：建立React示例与对应行为/视觉断言。
- [ ] Custom node class ^(2.9.0)（原文第67行）：建立React示例与对应行为/视觉断言。
- [ ] Custom node icon ^(2.10.3)（原文第77行）：建立React示例与对应行为/视觉断言。
- [ ] Tree node filtering ^(2.9.1)（原文第87行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

虚拟窗口只影响渲染，不影响整树勾选/半选与过滤计算；展平可视节点后保持稳定key。展开收缩使滚动锚与当前焦点可恢复；源不支持的普通Tree功能不默认加入。

## 3. React 19 结构与交互契约

- 主导出拟为 TreeV2，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| TreeV2 Attributes | prop | data | data | 104 |
| TreeV2 Attributes | prop | empty-text | emptyText | 105 |
| TreeV2 Attributes | prop | [props](#props) | [props](#props) | 106 |
| TreeV2 Attributes | prop | highlight-current | highlightCurrent | 107 |
| TreeV2 Attributes | prop | expand-on-click-node | expandOnClickNode | 108 |
| TreeV2 Attributes | prop | check-on-click-node | checkOnClickNode | 109 |
| TreeV2 Attributes | prop | check-on-click-leaf | checkOnClickLeaf | 110 |
| TreeV2 Attributes | prop | default-expanded-keys | defaultExpandedKeys | 111 |
| TreeV2 Attributes | prop | show-checkbox | showCheckbox | 112 |
| TreeV2 Attributes | prop | check-strictly | checkStrictly | 113 |
| TreeV2 Attributes | prop | default-checked-keys | defaultCheckedKeys | 114 |
| TreeV2 Attributes | prop | current-node-key | currentNodeKey | 115 |
| TreeV2 Attributes | prop | filter-method | filterMethod | 116 |
| TreeV2 Attributes | prop | indent | indent | 117 |
| TreeV2 Attributes | prop | icon | icon | 118 |
| TreeV2 Attributes | prop | item-size | itemSize | 119 |
| TreeV2 Attributes | prop | scrollbar-always-on | scrollbarAlwaysOn | 120 |
| TreeV2 Attributes | prop | height | height | 121 |
| props | prop | value | value | 127 |
| props | prop | label | label | 128 |
| props | prop | children | children | 129 |
| props | prop | disabled | disabled | 130 |
| props | prop | class | className | 131 |
| TreeV2 Exposes | ref | filter | ref.current.filter | 139 |
| TreeV2 Exposes | ref | getCheckedNodes | ref.current.getCheckedNodes | 140 |
| TreeV2 Exposes | ref | getCheckedKeys | ref.current.getCheckedKeys | 141 |
| TreeV2 Exposes | ref | setCheckedKeys | ref.current.setCheckedKeys | 142 |
| TreeV2 Exposes | ref | setChecked | ref.current.setChecked | 143 |
| TreeV2 Exposes | ref | setExpandedKeys | ref.current.setExpandedKeys | 144 |
| TreeV2 Exposes | ref | getHalfCheckedNodes | ref.current.getHalfCheckedNodes | 145 |
| TreeV2 Exposes | ref | getHalfCheckedKeys | ref.current.getHalfCheckedKeys | 146 |
| TreeV2 Exposes | ref | getCurrentKey | ref.current.getCurrentKey | 147 |
| TreeV2 Exposes | ref | getCurrentNode | ref.current.getCurrentNode | 148 |
| TreeV2 Exposes | ref | setCurrentKey | ref.current.setCurrentKey | 149 |
| TreeV2 Exposes | ref | getNode | ref.current.getNode | 150 |
| TreeV2 Exposes | ref | expandNode | ref.current.expandNode | 151 |
| TreeV2 Exposes | ref | collapseNode | ref.current.collapseNode | 152 |
| TreeV2 Exposes | ref | setData | ref.current.setData | 153 |
| TreeV2 Exposes | ref | scrollTo | ref.current.scrollTo | 154 |
| TreeV2 Exposes | ref | scrollToNode | ref.current.scrollToNode | 155 |
| TreeV2 Events | event | node-click | onNodeClick | 161 |
| TreeV2 Events | event | node-drop | onNodeDrop | 162 |
| TreeV2 Events | event | node-contextmenu | onNodeContextmenu | 163 |
| TreeV2 Events | event | check-change | onCheckChange | 164 |
| TreeV2 Events | event | check | onCheck | 165 |
| TreeV2 Events | event | current-change | onCurrentChange | 166 |
| TreeV2 Events | event | node-expand | onNodeExpand | 167 |
| TreeV2 Events | event | node-collapse | onNodeCollapse | 168 |
| TreeV2 Slots | slot | default | children | 174 |
| TreeV2 Slots | slot | empty | renderEmpty | 175 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| tree-v2:104 | TreeV2 Attributes | data | tree data | ^[array]`Array<{[key: string]: any}>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:105 | TreeV2 Attributes | empty-text | text displayed when data is void | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:106 | TreeV2 Attributes | [props](#props) | configuration options, see the following table | ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:107 | TreeV2 Attributes | highlight-current | whether current node is highlighted | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:108 | TreeV2 Attributes | expand-on-click-node | whether to expand or collapse node when clicking on the node, if false, then expand or collapse node only when clicking on the arrow icon. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:109 | TreeV2 Attributes | check-on-click-node | whether to check or uncheck node when clicking on the node, if false, the node can only be checked or unchecked by clicking on the checkbox. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:110 | TreeV2 Attributes | check-on-click-leaf | whether to check or uncheck node when clicking on leaf node (last children). | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:111 | TreeV2 Attributes | default-expanded-keys | array of keys of initially expanded nodes | ^[array]`Array<string \| number>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:112 | TreeV2 Attributes | show-checkbox | whether node is selectable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:113 | TreeV2 Attributes | check-strictly | whether checked state of a node not affects its father and child nodes when `show-checkbox` is `true` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:114 | TreeV2 Attributes | default-checked-keys | array of keys of initially checked nodes | ^[array]`Array<string \| number>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:115 | TreeV2 Attributes | current-node-key | key of initially selected node | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:116 | TreeV2 Attributes | filter-method | this function will be executed on each node when use filter method. if return `false`, tree node will be hidden. | ^[Function]`(query: string, data: TreeNodeData, node: TreeNode) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:117 | TreeV2 Attributes | indent | horizontal indentation of nodes in adjacent levels in pixels | ^[number] | 16 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:118 | TreeV2 Attributes | icon | custom tree node icon component | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:119 | TreeV2 Attributes | item-size | custom tree node height | ^[number] | 26 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:120 | TreeV2 Attributes | scrollbar-always-on | always show scrollbar | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:121 | TreeV2 Attributes | height | height of the tree | ^[number] | 200 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:127 | props | value | unique identity key name for nodes, its value should be unique across the whole tree | ^[string] | id | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:128 | props | label | specify which key of node object is used as the node's label | ^[string] | label | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:129 | props | children | specify which node object is used as the node's subtree | ^[string] | children | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:130 | props | disabled | specify which key of node object represents if node's checkbox is disabled | ^[string] | disabled | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-v2:131 | props | class | custom node class name | ^[string] / ^[Function]`(data: TreeNodeData, node: TreeNode) => string \| {[key: string]: boolean}` | — | 保留根节点与内部节点位置，不覆盖必需状态类名。 |
| tree-v2:139 | TreeV2 Exposes | filter | filter all tree nodes, filtered nodes will be hidden | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:140 | TreeV2 Exposes | getCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:141 | TreeV2 Exposes | getCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of node's keys | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:142 | TreeV2 Exposes | setCheckedKeys | set certain nodes to be checked | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:143 | TreeV2 Exposes | setChecked | set node to be checked or not, `deep` (added in ^(2.14.0)) indicates whether child nodes should be recursively checked/unchecked. | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:144 | TreeV2 Exposes | setExpandedKeys | set certain nodes to be expanded | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:145 | TreeV2 Exposes | getHalfCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of nodes | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:146 | TreeV2 Exposes | getHalfCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of node's keys | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:147 | TreeV2 Exposes | getCurrentKey | return the highlight node's key (undefined if no node is highlighted) | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:148 | TreeV2 Exposes | getCurrentNode | return the highlight node's data (undefined if no node is highlighted) | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:149 | TreeV2 Exposes | setCurrentKey | set highlighted node by key | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:150 | TreeV2 Exposes | getNode | get node by key or data | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:151 | TreeV2 Exposes | expandNode | expand specified node | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:152 | TreeV2 Exposes | collapseNode | collapse specified node | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:153 | TreeV2 Exposes | setData | When the data is very large, using reactive data will cause the poor performance, so we provide a way to avoid this situation | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:154 | TreeV2 Exposes | scrollTo | scroll to a given position | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:155 | TreeV2 Exposes | scrollToNode | scroll to a given tree key with specified scroll strategy | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-v2:161 | TreeV2 Events | node-click | triggers when a node is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:162 | TreeV2 Events | node-drop | triggers when drag something and drop on a node | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:163 | TreeV2 Events | node-contextmenu | triggers when a node is clicked by right button | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:164 | TreeV2 Events | check-change | triggers when the selected state of the node changes | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:165 | TreeV2 Events | check | triggers after clicking the checkbox of a node | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:166 | TreeV2 Events | current-change | triggers when current node changes | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:167 | TreeV2 Events | node-expand | triggers when current node open | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:168 | TreeV2 Events | node-collapse | triggers when current node close | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tree-v2:174 | TreeV2 Slots | default | custom content for tree nodes | ^[object]`{ node: TreeNode, data: TreeNodeData }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tree-v2:175 | TreeV2 Slots | empty | custom content when data is empty | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/tree-v2](../../reference/element-plus/packages/components/tree-v2/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/tree-v2/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/selectable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/default-state.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/custom-node.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/custom-node-class.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/custom-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-v2/filter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
