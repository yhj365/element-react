# TreeSelect 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/tree-select.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 选择器与树组合。
- 单选/多选、checkbox、严格选择。
- 过滤/懒加载、缓存标签、默认展开。
- 树节点和选中值双向协调。

## 2. 源文档场景清单

- [ ] Basic usage（原文第11行）：建立React示例与对应行为/视觉断言。
- [ ] Select any level（原文第21行）：建立React示例与对应行为/视觉断言。
- [ ] Multiple Selection（原文第47行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled Selection（原文第57行）：建立React示例与对应行为/视觉断言。
- [ ] Filterable（原文第67行）：建立React示例与对应行为/视觉断言。
- [ ] Custom content（原文第79行）：建立React示例与对应行为/视觉断言。
- [ ] LazyLoad（原文第89行）：建立React示例与对应行为/视觉断言。
- [ ] Use node-key attribute（原文第99行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 TreeSelect，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | [tree](./tree.md#attributes) | [tree](./tree.md#attributes) | 128 |
| Attributes | prop | [select](./select.md#select-attributes) | [select](./select.md#selectAttributes) | 129 |
| Own Attributes | prop | cache-data | cacheData | 135 |
| Exposes | ref | treeRef | ref.current.treeRef | 147 |
| Exposes | ref | selectRef | ref.current.selectRef | 148 |
| Exposes | ref | filter | ref.current.filter | 149 |
| Exposes | ref | updateKeyChildren | ref.current.updateKeyChildren | 150 |
| Exposes | ref | getCheckedNodes | ref.current.getCheckedNodes | 151 |
| Exposes | ref | setCheckedNodes | ref.current.setCheckedNodes | 152 |
| Exposes | ref | getCheckedKeys | ref.current.getCheckedKeys | 153 |
| Exposes | ref | setCheckedKeys | ref.current.setCheckedKeys | 154 |
| Exposes | ref | setChecked | ref.current.setChecked | 155 |
| Exposes | ref | getHalfCheckedNodes | ref.current.getHalfCheckedNodes | 156 |
| Exposes | ref | getHalfCheckedKeys | ref.current.getHalfCheckedKeys | 157 |
| Exposes | ref | getCurrentKey | ref.current.getCurrentKey | 158 |
| Exposes | ref | getCurrentNode | ref.current.getCurrentNode | 159 |
| Exposes | ref | setCurrentKey | ref.current.setCurrentKey | 160 |
| Exposes | ref | setCurrentNode | ref.current.setCurrentNode | 161 |
| Exposes | ref | getNode | ref.current.getNode | 162 |
| Exposes | ref | remove | ref.current.remove | 163 |
| Exposes | ref | append | ref.current.append | 164 |
| Exposes | ref | insertBefore | ref.current.insertBefore | 165 |
| Exposes | ref | insertAfter | ref.current.insertAfter | 166 |
| Exposes | ref | focus | ref.current.focus | 167 |
| Exposes | ref | blur | ref.current.blur | 168 |
| Exposes | ref | selectedLabel | ref.current.selectedLabel | 169 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| tree-select:128 | Attributes | [tree](./tree.md#attributes) | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-select:129 | Attributes | [select](./select.md#select-attributes) | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-select:135 | Own Attributes | cache-data | The cached data of the lazy node, the structure is the same as the data, used to get the label of the unloaded data | ^[array]`CacheOption[]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tree-select:147 | Exposes | treeRef | Tree component instance | `TreeInstance` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:148 | Exposes | selectRef | Select component instance | `SelectInstance` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:149 | Exposes | filter | filter all tree nodes, filtered nodes will be hidden | Accept a parameter which will be used as first parameter for filter-node-method | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:150 | Exposes | updateKeyChildren | set new data to node, only works when `node-key` is assigned | (key, data) Accept two parameters: 1. key of node 2. new data | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:151 | Exposes | getCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of nodes | (leafOnly, includeHalfChecked) Accept two boolean type parameters: 1. default value is `false`. If the parameter is `true`, it only returns the currently selected array of sub-nodes. 2. default value is `false`. If the parameter is `true`, the return value contains halfchecked nodes | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:152 | Exposes | setCheckedNodes | set certain nodes to be checked, only works when `node-key` is assigned | an array of nodes to be checked | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:153 | Exposes | getCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently selected array of node's keys | (leafOnly) Accept a boolean type parameter whose default value is `false`. If the parameter is `true`, it only returns the currently selected array of sub-nodes. | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:154 | Exposes | setCheckedKeys | set certain nodes to be checked, only works when `node-key` is assigned | (keys, leafOnly) Accept two parameters: 1. an array of node's keys to be checked 2. a boolean parameter. If set to `true`, only the checked status of leaf nodes will be set. The default value is `false`. | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:155 | Exposes | setChecked | set node to be checked or not, only works when `node-key` is assigned | (key/data, checked, deep) Accept three parameters: 1. node's key or data to be checked 2. a boolean typed parameter indicating checked or not. 3. a boolean typed parameter indicating whether to recursively check/uncheck child nodes (since ^(2.14.0), this works regardless of the `check-strictly` setting). | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:156 | Exposes | getHalfCheckedNodes | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of nodes | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:157 | Exposes | getHalfCheckedKeys | If the node can be selected (`show-checkbox` is `true`), it returns the currently half selected array of node's keys | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:158 | Exposes | getCurrentKey | return the highlight node's key (null if no node is highlighted) | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:159 | Exposes | getCurrentNode | return the highlight node's data (null if no node is highlighted) | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:160 | Exposes | setCurrentKey | set highlighted node by key, only works when `node-key` is assigned | (key, shouldAutoExpandParent=true) 1. the node's key to be highlighted. If `null`, cancel the currently highlighted node 2. whether to automatically expand parent node | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:161 | Exposes | setCurrentNode | set highlighted node, only works when `node-key` is assigned | (node, shouldAutoExpandParent=true) 1. the node to be highlighted 2. whether to automatically expand parent node | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:162 | Exposes | getNode | get node by data or key | (data) the node's data or key | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:163 | Exposes | remove | remove a node, only works when node-key is assigned | (data) the node's data or node to be deleted | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:164 | Exposes | append | append a child node to a given node in the tree | (data, parentNode) 1. child node's data to be appended 2. parent node's data, key or node | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:165 | Exposes | insertBefore | insert a node before a given node in the tree | (data, refNode) 1. node's data to be inserted 2. reference node's data, key or node | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:166 | Exposes | insertAfter | insert a node after a given node in the tree | (data, refNode) 1. node's data to be inserted 2. reference node's data, key or node | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:167 | Exposes | focus | focus the Input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:168 | Exposes | blur | blur the Input component, and hide the dropdown | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tree-select:169 | Exposes | selectedLabel | get the currently selected label | ^[object]`ComputedRef<string \| string[]>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/tree-select](../../reference/element-plus/packages/components/tree-select/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/tree-select/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/check-strictly.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/multiple.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/filterable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/slots.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/lazy.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tree-select/node-key.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
