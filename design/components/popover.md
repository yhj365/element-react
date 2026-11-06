# Popover 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/popover.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 多触发方式、受控显隐。
- 标题和内容/自定义内容。
- 宽度、定位、延迟、虚拟触发。
- 复用 Tooltip 内核而保持原API差异。

## 2. 源文档场景清单

- [ ] Placement（原文第8行）：建立React示例与对应行为/视觉断言。
- [ ] Basic usage（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Virtual triggering（原文第28行）：建立React示例与对应行为/视觉断言。
- [ ] Rich content（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] Nested operation（原文第54行）：建立React示例与对应行为/视觉断言。
- [ ] Directive（原文第64行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Popover，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | trigger | trigger | 81 |
| Attributes | prop | trigger-keys | triggerKeys | 82 |
| Attributes | prop | title | title | 83 |
| Attributes | prop | effect | effect | 84 |
| Attributes | prop | content | content | 85 |
| Attributes | prop | width | width | 86 |
| Attributes | prop | placement | placement | 87 |
| Attributes | prop | disabled | disabled | 88 |
| Attributes | prop | visible / v-model:visible | visible / defaultVisible / onVisibleChange | 89 |
| Attributes | prop | offset | offset | 90 |
| Attributes | prop | transition | transition | 91 |
| Attributes | prop | show-arrow | showArrow | 92 |
| Attributes | prop | popper-options | popperOptions | 93 |
| Attributes | prop | popper-class | popperClass | 94 |
| Attributes | prop | popper-style | popperStyle | 95 |
| Attributes | prop | show-after | showAfter | 96 |
| Attributes | prop | hide-after | hideAfter | 97 |
| Attributes | prop | auto-close | autoClose | 98 |
| Attributes | prop | tabindex | tabindex | 99 |
| Attributes | prop | teleported | teleported | 100 |
| Attributes | prop | append-to | appendTo | 101 |
| Attributes | prop | persistent | persistent | 102 |
| Attributes | prop | virtual-triggering | virtualTriggering | 103 |
| Attributes | prop | virtual-ref | virtualRef | 104 |
| Attributes | prop | [tooltip](./tooltip.md#attributes) | [tooltip](./tooltip.md#attributes) | 105 |
| Slots | slot | default | children | 111 |
| Slots | slot | reference | renderReference | 112 |
| Events | event | show | onShow | 118 |
| Events | event | before-enter | onBeforeEnter | 119 |
| Events | event | after-enter | onAfterEnter | 120 |
| Events | event | hide | onHide | 121 |
| Events | event | before-leave | onBeforeLeave | 122 |
| Events | event | after-leave | onAfterLeave | 123 |
| Exposes | ref | hide | ref.current.hide | 129 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| popover:81 | Attributes | trigger | how the popover is triggered, not valid in controlled mode | ^[enum]`'click' \| 'focus' \| 'hover' \| 'contextmenu'` / ^[array]`Array<'click' \| 'focus' \| 'hover' \| 'contextmenu'>` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:82 | Attributes | trigger-keys | When you click the mouse to focus on the trigger element, you can define a set of keyboard codes to control the display of popover through the keyboard, not valid in controlled mode | ^[Array] | ['Enter','Space'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:83 | Attributes | title | popover title | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:84 | Attributes | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:85 | Attributes | content | popover content, can be replaced with a default `slot` | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:86 | Attributes | width | popover width | ^[string] / ^[number] | 150 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:87 | Attributes | placement | popover placement | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:88 | Attributes | disabled | whether Popover is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:89 | Attributes | visible / v-model:visible | whether popover is visible | ^[boolean] / ^[null] | null | 具名双向绑定独立受控通道；与源同名语义事件发生冲突时必须在类型审计裁决，不机械合并。 |
| popover:90 | Attributes | offset | popover offset, `Popover` is built with `Tooltip`, offset of `Popover` is `undefined`, but offset of `Tooltip` is 12 | ^[number] | undefined | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:91 | Attributes | transition | popover transition animation, the default is el-fade-in-linear | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:92 | Attributes | show-arrow | whether a tooltip arrow is displayed or not. For more info, please refer to [ElPopper](https://github.com/element-plus/element-plus/tree/dev/packages/components/popper) | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:93 | Attributes | popper-options | parameters for [popper.js](https://popper.js.org/docs/v2/) | ^[object] | `{modifiers: [{name: 'computeStyles',options: {gpuAcceleration: false}}]}` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:94 | Attributes | popper-class | custom class name for popover | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:95 | Attributes | popper-style | custom style for popover | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:96 | Attributes | show-after | delay of appearance, in millisecond, not valid in controlled mode | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:97 | Attributes | hide-after | delay of disappear, in millisecond, not valid in controlled mode | ^[number] | 200 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:98 | Attributes | auto-close | timeout in milliseconds to hide tooltip, not valid in controlled mode | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:99 | Attributes | tabindex | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Popover | ^[number] / ^[string] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:100 | Attributes | teleported | whether popover dropdown is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:101 | Attributes | append-to | which element the popover CONTENT appends to | ^[CSSSelector] / ^[HTMLElement] | body | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:102 | Attributes | persistent | when popover inactive and `persistent` is `false` , popover will be destroyed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:103 | Attributes | virtual-triggering | Indicates whether virtual triggering is enabled | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:104 | Attributes | virtual-ref | Indicates the reference element to which the popover is attached | ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:105 | Attributes | [tooltip](./tooltip.md#attributes) | Inherits all attributes from Tooltip | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popover:111 | Slots | default | content of popover, version ^(2.13.4) and later can receive the hide parameter. | ^[object]`{hide: () => void}` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| popover:112 | Slots | reference | HTML element that triggers popover, only a single root element is accepted | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| popover:118 | Events | show | triggers when popover shows | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popover:119 | Events | before-enter | triggers when the entering transition before | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popover:120 | Events | after-enter | triggers when the entering transition ends | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popover:121 | Events | hide | triggers when popover hides | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popover:122 | Events | before-leave | triggers when the leaving transition before | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popover:123 | Events | after-leave | triggers when the leaving transition ends | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popover:129 | Exposes | hide | hide popover | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/popover](../../reference/element-plus/packages/components/popover/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/popover/placement.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popover/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popover/virtual-triggering.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popover/nested-information.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popover/nested-operation.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popover/directive-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
