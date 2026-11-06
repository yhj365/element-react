# Mention 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/mention.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 触发前缀、分隔字符、光标定位。
- 过滤/远程建议、加载。
- 键盘选择、插入文本。
- 自定义选项与标签。
- 输入法和异步结果顺序。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Textarea（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Customize label（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Load remote options（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Customize trigger token（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Delete as a whole（原文第70行）：建立React示例与对应行为/视觉断言。
- [ ] Work with form（原文第80行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Mention，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | options | options | 101 |
| Attributes | prop | props | props | 102 |
| Attributes | prop | prefix | prefix | 103 |
| Attributes | prop | split | split | 104 |
| Attributes | prop | filter-option | filterOption | 105 |
| Attributes | prop | placement | placement | 106 |
| Attributes | prop | show-arrow | showArrow | 107 |
| Attributes | prop | offset | offset | 108 |
| Attributes | prop | whole | whole | 109 |
| Attributes | prop | check-is-whole | checkIsWhole | 110 |
| Attributes | prop | loading | loading | 111 |
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 112 |
| Attributes | prop | popper-class | popperClass | 113 |
| Attributes | prop | popper-style | popperStyle | 114 |
| Attributes | prop | popper-options | popperOptions | 115 |
| Attributes | prop | [input props](./input.md#attributes) | [input props](./input.md#attributes) | 116 |
| Events | event | search | onSearch | 122 |
| Events | event | select | onSelect | 123 |
| Events | event | whole-remove | onWholeRemove | 124 |
| Events | event | [input events](./input.md#events) | on[input events](./input.md#events) | 125 |
| Slots | slot | label | renderLabel | 131 |
| Slots | slot | loading | renderLoading | 132 |
| Slots | slot | header | renderHeader | 133 |
| Slots | slot | footer | renderFooter | 134 |
| Slots | slot | [input slots](./input.md#slots) | render[input slots](./input.md#slots) | 135 |
| Exposes | ref | input | ref.current.input | 141 |
| Exposes | ref | tooltip | ref.current.tooltip | 142 |
| Exposes | ref | dropdownVisible | ref.current.dropdownVisible | 143 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| mention:101 | Attributes | options | mention options list | ^[array]`MentionOption[]` | `[]` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:102 | Attributes | props | configuration options | ^[object]`MentionOptionProps` | `{value: 'value', label: 'label', disabled: 'disabled'}` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:103 | Attributes | prefix | prefix character to trigger mentions. The string length must be exactly 1 | ^[string] \| ^[array]`string[]` | `'@'` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:104 | Attributes | split | character to split mentions. The string length must be exactly 1 | ^[string] | `' '` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:105 | Attributes | filter-option | customize filter option logic | ^[false] \| ^[Function]`(pattern: string, option: MentionOption) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:106 | Attributes | placement | set popup placement | ^[string]`'bottom' \| 'top'` | `'bottom'` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:107 | Attributes | show-arrow | whether the dropdown panel has an arrow | ^[boolean] | `false` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:108 | Attributes | offset | offset of the dropdown panel | ^[number] | `0` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:109 | Attributes | whole | when backspace is pressed to delete, whether the mention content is deleted as a whole | ^[boolean] | `false` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:110 | Attributes | check-is-whole | when backspace is pressed to delete, check if the mention is a whole | ^[Function]`(pattern: string, prefix: string) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:111 | Attributes | loading | whether the dropdown panel of mentions is in a loading state | ^[boolean] | `false` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:112 | Attributes | model-value / v-model | input value | ^[string] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| mention:113 | Attributes | popper-class | custom class name for dropdown panel | ^[string] / ^[object] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:114 | Attributes | popper-style | custom style for dropdown panel | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:115 | Attributes | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object] refer to [popper.js doc](https://popper.js.org/docs/v2/) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:116 | Attributes | [input props](./input.md#attributes) | — | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| mention:122 | Events | search | trigger when prefix hit | ^[Function]`(pattern: string, prefix: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| mention:123 | Events | select | trigger when user select the option | ^[Function]`(option: MentionOption, prefix: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| mention:124 | Events | whole-remove | trigger when a whole mention is removed and `whole` is `true` or `check-is-whole` is `true` | ^[Function]`(pattern: string, prefix: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| mention:125 | Events | [input events](./input.md#events) | — | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| mention:131 | Slots | label | content as option label | ^[object]`{ item: MentionOption, index: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| mention:132 | Slots | loading | content as option loading | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| mention:133 | Slots | header | content at the top of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| mention:134 | Slots | footer | content at the bottom of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| mention:135 | Slots | [input slots](./input.md#slots) | — | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| mention:141 | Exposes | input | el-input component instance | ^[object]`Ref<InputInstance \| null>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| mention:142 | Exposes | tooltip | el-tooltip component instance | ^[object]`Ref<TooltipInstance \| null>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| mention:143 | Exposes | dropdownVisible | tooltip display status | ^[object]`ComputedRef<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/mention](../../reference/element-plus/packages/components/mention/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/mention/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/props.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/textarea.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/label.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/prefix.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/whole.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/mention/form.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
