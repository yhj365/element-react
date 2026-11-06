# Transfer 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/transfer.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 左右列表、搜索、勾选和批量移动。
- 禁用、字段映射、顺序、标题和计数。
- 自定义条目、底部内容。
- 值和选中状态事件。

## 2. 源文档场景清单

- [ ] Basic usage（原文第8行）：建立React示例与对应行为/视觉断言。
- [ ] Filterable（原文第16行）：建立React示例与对应行为/视觉断言。
- [ ] Customizable（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Custom empty content ^(2.9.0)（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Prop aliases（原文第46行）：建立React示例与对应行为/视觉断言。
- [ ] Virtual Scroll ^(2.14.3)（原文第56行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Transfer，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Transfer Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 72 |
| Transfer Attributes | prop | data | data | 73 |
| Transfer Attributes | prop | filterable | filterable | 74 |
| Transfer Attributes | prop | filter-placeholder | filterPlaceholder | 75 |
| Transfer Attributes | prop | filter-method | filterMethod | 76 |
| Transfer Attributes | prop | target-order | targetOrder | 77 |
| Transfer Attributes | prop | titles | titles | 78 |
| Transfer Attributes | prop | button-texts | buttonTexts | 79 |
| Transfer Attributes | prop | render-content | renderContent | 80 |
| Transfer Attributes | prop | format | format | 81 |
| Transfer Attributes | prop | [props](#type-declarations) | [props](#typeDeclarations) | 82 |
| Transfer Attributes | prop | left-default-checked | leftDefaultChecked | 83 |
| Transfer Attributes | prop | right-default-checked | rightDefaultChecked | 84 |
| Transfer Attributes | prop | validate-event | validateEvent | 85 |
| Transfer Attributes | prop | virtual-scroll | virtualScroll | 86 |
| Transfer Attributes | prop | item-size | itemSize | 87 |
| Transfer Events | event | change | onChange | 93 |
| Transfer Events | event | left-check-change | onLeftCheckChange | 94 |
| Transfer Events | event | right-check-change | onRightCheckChange | 95 |
| Transfer Slots | slot | default | children | 101 |
| Transfer Slots | slot | left-footer | renderLeftFooter | 102 |
| Transfer Slots | slot | right-footer | renderRightFooter | 103 |
| Transfer Slots | slot | left-empty | renderLeftEmpty | 104 |
| Transfer Slots | slot | right-empty | renderRightEmpty | 105 |
| Transfer Exposes | ref | clearQuery | ref.current.clearQuery | 111 |
| Transfer Exposes | ref | leftPanel | ref.current.leftPanel | 112 |
| Transfer Exposes | ref | rightPanel | ref.current.rightPanel | 113 |
| Transfer Panel Exposes | ref | query | ref.current.query | 121 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| transfer:72 | Transfer Attributes | model-value / v-model | binding value | ^[array]`Array<string \| number>` | [] | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| transfer:73 | Transfer Attributes | data | data source | ^[array]`Record<string, any>[]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:74 | Transfer Attributes | filterable | whether Transfer is filterable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:75 | Transfer Attributes | filter-placeholder | placeholder for the filter input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:76 | Transfer Attributes | filter-method | custom filter method | ^[Function]`(query: string, item: Record<string, any>) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:77 | Transfer Attributes | target-order | order strategy for elements in the target list. If set to `original`, the elements will keep the same order as the data source. If set to `push`, the newly added elements will be pushed to the bottom. If set to `unshift`, the newly added elements will be inserted on the top | ^[enum]`'original' \| 'push' \| 'unshift'` | original | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:78 | Transfer Attributes | titles | custom list titles | ^[array]`[string, string]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:79 | Transfer Attributes | button-texts | custom button texts | ^[array]`[string, string]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:80 | Transfer Attributes | render-content | custom render function for data items | ^[object]`renderContent` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:81 | Transfer Attributes | format | texts for checking status in list header | ^[object]`TransferFormat` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:82 | Transfer Attributes | [props](#type-declarations) | prop aliases for data source | ^[object]`TransferPropsAlias` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:83 | Transfer Attributes | left-default-checked | key array of initially checked data items of the left list | ^[array]`Array<string \| number>` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:84 | Transfer Attributes | right-default-checked | key array of initially checked data items of the right list | ^[array]`Array<string \| number>` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:85 | Transfer Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:86 | Transfer Attributes | virtual-scroll | whether to enable virtual scrolling | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:87 | Transfer Attributes | item-size | item height for virtual scrolling | ^[number] | 30 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| transfer:93 | Transfer Events | change | triggers when data items change in the right list | ^[Function]`(value: TransferKey[], direction: TransferDirection, movedKeys: TransferKey[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| transfer:94 | Transfer Events | left-check-change | triggers when end user changes the checked state of any data item in the left list | ^[Function]`(value: TransferKey[], movedKeys?: TransferKey[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| transfer:95 | Transfer Events | right-check-change | triggers when end user changes the checked state of any data item in the right list | ^[Function]`(value: TransferKey[], movedKeys?: TransferKey[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| transfer:101 | Transfer Slots | default | Custom content for data items. | ^[object]`{ option: TransferDataItem }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| transfer:102 | Transfer Slots | left-footer | content of left list footer | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| transfer:103 | Transfer Slots | right-footer | content of right list footer | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| transfer:104 | Transfer Slots | left-empty | content when left panel is empty or when no data matches the filter | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| transfer:105 | Transfer Slots | right-empty | content when right panel is empty or when no data matches the filter | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| transfer:111 | Transfer Exposes | clearQuery | clear the filter keyword of a certain panel | ^[Function]`(which: TransferDirection) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| transfer:112 | Transfer Exposes | leftPanel | left panel ref | ^[object]`Ref<TransferPanelInstance>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| transfer:113 | Transfer Exposes | rightPanel | right panel ref | ^[object]`Ref<TransferPanelInstance>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| transfer:121 | Transfer Panel Exposes | query | filter keyword | ^[string] | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/transfer](../../reference/element-plus/packages/components/transfer/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/transfer/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/transfer/filterable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/transfer/customizable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/transfer/empty-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/transfer/prop-alias.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/transfer/virtual-scroll.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
