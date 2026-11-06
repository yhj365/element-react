# ConfigProvider 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/config-provider.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 语言、尺寸、namespace、zIndex。
- 键盘和无障碍开关。
- 空值/清空值策略。
- Button/Card/Dialog/Link/Message/Table 默认配置。
- 嵌套与服务上下文。

## 2. 源文档场景清单

- [ ] i18n Configurations（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Button Configurations（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Link Configurations ^(2.9.11)（原文第28行）：建立React示例与对应行为/视觉断言。
- [ ] Card Configurations ^(2.10.5)（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Dialog Configurations ^(2.10.7)（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] Message Configurations（原文第52行）：建立React示例与对应行为/视觉断言。
- [ ] Empty Values Configurations ^(2.7.0)（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Table Configurations ^(2.13.3)（原文第86行）：建立React示例与对应行为/视觉断言。
- [ ] Experimental features（原文第94行）：建立React示例与对应行为/视觉断言。
- [ ] Button Attribute（原文第119行）：建立React示例与对应行为/视觉断言。
- [ ] Link Attribute（原文第130行）：建立React示例与对应行为/视觉断言。
- [ ] Card Attribute（原文第137行）：建立React示例与对应行为/视觉断言。
- [ ] Dialog Attribute（原文第143行）：建立React示例与对应行为/视觉断言。
- [ ] Message Attribute（原文第152行）：建立React示例与对应行为/视觉断言。
- [ ] Table Attribute ^(2.13.3)（原文第164行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 ConfigProvider，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Config Provider Attributes | prop | locale | locale | 106 |
| Config Provider Attributes | prop | size | size | 107 |
| Config Provider Attributes | prop | zIndex | zIndex | 108 |
| Config Provider Attributes | prop | namespace | namespace | 109 |
| Config Provider Attributes | prop | button | button | 110 |
| Config Provider Attributes | prop | link | link | 111 |
| Config Provider Attributes | prop | dialog | dialog | 112 |
| Config Provider Attributes | prop | message | message | 113 |
| Config Provider Attributes | prop | experimental-features | experimentalFeatures | 114 |
| Config Provider Attributes | prop | empty-values | emptyValues | 115 |
| Config Provider Attributes | prop | value-on-clear | valueOnClear | 116 |
| Config Provider Attributes | prop | table | table | 117 |
| Button Attribute | prop | type | type | 123 |
| Button Attribute | prop | autoInsertSpace | autoInsertSpace | 124 |
| Button Attribute | prop | plain | plain | 125 |
| Button Attribute | prop | text | text | 126 |
| Button Attribute | prop | round | round | 127 |
| Button Attribute | prop | dashed | dashed | 128 |
| Link Attribute | prop | type | type | 134 |
| Link Attribute | prop | underline | underline | 135 |
| Card Attribute | prop | shadow | shadow | 141 |
| Dialog Attribute | prop | align-center | alignCenter | 147 |
| Dialog Attribute | prop | draggable | draggable | 148 |
| Dialog Attribute | prop | overflow | overflow | 149 |
| Dialog Attribute | prop | transition | transition | 150 |
| Message Attribute | prop | max | max | 156 |
| Message Attribute | prop | grouping | grouping | 157 |
| Message Attribute | prop | duration | duration | 158 |
| Message Attribute | prop | showClose | showClose | 159 |
| Message Attribute | prop | offset | offset | 160 |
| Message Attribute | prop | plain | plain | 161 |
| Message Attribute | prop | placement | placement | 162 |
| Table Attribute ^(2.13.3) | prop | show-overflow-tooltip | showOverflowTooltip | 168 |
| Table Attribute ^(2.13.3) | prop | tooltip-effect | tooltipEffect | 169 |
| Table Attribute ^(2.13.3) | prop | tooltip-options | tooltipOptions | 170 |
| Table Attribute ^(2.13.3) | prop | tooltip-formatter | tooltipFormatter | 171 |
| Config Provider Slots | slot | default | children | 177 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| config-provider:106 | Config Provider Attributes | locale | Locale Object | ^[object]`{name: string, el: TranslatePair}`[](https://github.com/element-plus/element-plus/blob/a98ff9b40c0c3d2b9959f99919bd8363e3e3c25a/packages/locale/index.ts#L5) [languages](https://github.com/element-plus/element-plus/tree/dev/packages/locale/lang) | [en](https://github.com/element-plus/element-plus/blob/dev/packages/locale/lang/en.ts) | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:107 | Config Provider Attributes | size | global component size | ^[enum]`'large' \| 'default' \| 'small'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:108 | Config Provider Attributes | zIndex | global Initial zIndex | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:109 | Config Provider Attributes | namespace | global component className prefix (cooperated with [$namespace](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string] | el | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:110 | Config Provider Attributes | button | button related configuration, [see the following table](#button-attribute) | ^[object]`{autoInsertSpace?: boolean, type?: string, plain?: boolean, text?: boolean, round?: boolean, dashed?: boolean}` | see the following table | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:111 | Config Provider Attributes | link | link related configuration, [see the following table](#link-attribute) | ^[object]`{type?: string, underline?: boolean \| string}` | see the following table | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:112 | Config Provider Attributes | dialog | dialog related configuration, [see the following table](#dialog-attribute) | ^[object]`{alignCenter?: boolean, draggable?: boolean, overflow?: boolean, transition?: DialogTransition}` | see the following table | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:113 | Config Provider Attributes | message | message related configuration, [see the following table](#message-attribute) | ^[object]`{max?: number}` | see the following table | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:114 | Config Provider Attributes | experimental-features | features at experimental stage to be added, all features are default to be set to false | ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:115 | Config Provider Attributes | empty-values | global empty values of components | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:116 | Config Provider Attributes | value-on-clear | global clear return value | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:117 | Config Provider Attributes | table | table related configuration, [see the following table](#table-attribute) | ^[object]`{showOverflowTooltip?: boolean \| object, tooltipEffect?: string, tooltipOptions?: object, tooltipFormatter?: Function}` | see the following table | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:123 | Button Attribute | type | button type, when setting `color`, the latter prevails | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' (deprecated)` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:124 | Button Attribute | autoInsertSpace | automatically insert a space between two chinese characters(this will only take effect when the text length is 2 and all characters are in Chinese.) | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:125 | Button Attribute | plain | determine whether it's a plain button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:126 | Button Attribute | text | determine whether it's a text button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:127 | Button Attribute | round | determine whether it's a round button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:128 | Button Attribute | dashed | determine whether it's a dashed button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:134 | Link Attribute | type | type | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:135 | Link Attribute | underline | when underlines should appear | ^[enum]`'always' \| 'hover' \| 'never' \| boolean` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:141 | Card Attribute | shadow | when to show card shadows | ^[enum]`always \| never \| hover` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:147 | Dialog Attribute | align-center | whether to align the dialog both horizontally and vertically | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:148 | Dialog Attribute | draggable | enable dragging feature for Dialog | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:149 | Dialog Attribute | overflow | draggable Dialog can overflow the viewport long | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:150 | Dialog Attribute | transition | custom transition configuration for dialog animation. Can be a string (transition name) or an object with Vue transition props | ^[string] / ^[object]`TransitionProps` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:156 | Message Attribute | max | the maximum number of messages that can be displayed at the same time | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:157 | Message Attribute | grouping | merge messages with the same content, type of VNode message is not supported | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:158 | Message Attribute | duration | display duration, millisecond. If set to 0, it will not turn off automatically | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:159 | Message Attribute | showClose | whether to show a close button | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:160 | Message Attribute | offset | set the distance to the top of viewport | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:161 | Message Attribute | plain | whether message is plain | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:162 | Message Attribute | placement | message placement position | ^[enum]`'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:168 | Table Attribute ^(2.13.3) | show-overflow-tooltip | whether to hide extra content and show them in a tooltip when hovering on the cell.It will affect all the table columns, refer to table tooltip-options | ^[boolean] / [`object`] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:169 | Table Attribute ^(2.13.3) | tooltip-effect | the `effect` of the overflow tooltip | ^[enum]`'dark' \| 'light'` | dark | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:170 | Table Attribute ^(2.13.3) | tooltip-options | the options for the overflow tooltip, [see the following tooltip component](./tooltip.md#attributes) | ^[object]`Pick<ElTooltipProps, 'effect' \| 'enterable' \| 'hideAfter' \| 'offset' \| 'placement' \| 'popperClass' \| 'popperOptions' \| 'showAfter' \| 'showArrow'>` | ^[object]`{ enterable: true, placement: 'top', showArrow: true, hideAfter: 200, popperOptions: { strategy: 'fixed' } }` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:171 | Table Attribute ^(2.13.3) | tooltip-formatter | customize tooltip content when using `show-overflow-tooltip` | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, cellValue: any }) => VNode \| string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| config-provider:177 | Config Provider Slots | default | customize default content | config: provided global config (inherited from the top) | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/config-provider](../../reference/element-plus/packages/components/config-provider/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/config-provider/usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/button.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/link.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/card.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/dialog.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/message.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/empty-values.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/config-provider/table.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
