# Tour 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/tour.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- Tour/TourStep。
- 目标查找、遮罩镂空、高亮、滚动到目标。
- 步骤受控切换、前后按钮、关闭和完成。
- 丢失目标和动态布局。
- 焦点与层级。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Non modal（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Placement（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Custom mask style（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Custom indicator（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Target（原文第60行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Tour，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Tour Attributes | prop | append-to | appendTo | 80 |
| Tour Attributes | prop | show-arrow | showArrow | 81 |
| Tour Attributes | prop | placement | placement | 82 |
| Tour Attributes | prop | content-style | contentStyle | 83 |
| Tour Attributes | prop | mask | mask | 84 |
| Tour Attributes | prop | gap | gap | 85 |
| Tour Attributes | prop | type | type | 86 |
| Tour Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 87 |
| Tour Attributes | prop | current / v-model:current | current / defaultCurrent / onCurrentChange | 88 |
| Tour Attributes | prop | scroll-into-view-options | scrollIntoViewOptions | 89 |
| Tour Attributes | prop | z-index | zIndex | 90 |
| Tour Attributes | prop | show-close | showClose | 91 |
| Tour Attributes | prop | close-icon | closeIcon | 92 |
| Tour Attributes | prop | close-on-press-escape | closeOnPressEscape | 93 |
| Tour Attributes | prop | target-area-clickable | targetAreaClickable | 94 |
| Tour slots | slot | default | children | 100 |
| Tour slots | slot | indicators | renderIndicators | 101 |
| Tour events | event | close | onClose | 107 |
| Tour events | event | finish | onFinish | 108 |
| Tour events | event | change | onChange | 109 |
| TourStep Attributes | prop | target | target | 117 |
| TourStep Attributes | prop | show-arrow | showArrow | 118 |
| TourStep Attributes | prop | title | title | 119 |
| TourStep Attributes | prop | description | description | 120 |
| TourStep Attributes | prop | placement | placement | 121 |
| TourStep Attributes | prop | content-style | contentStyle | 122 |
| TourStep Attributes | prop | mask | mask | 123 |
| TourStep Attributes | prop | type | type | 124 |
| TourStep Attributes | prop | next-button-props | nextButtonProps | 125 |
| TourStep Attributes | prop | prev-button-props | prevButtonProps | 126 |
| TourStep Attributes | prop | scroll-into-view-options | scrollIntoViewOptions | 127 |
| TourStep Attributes | prop | show-close | showClose | 128 |
| TourStep Attributes | prop | close-icon | closeIcon | 129 |
| TourStep slots | slot | default | children | 135 |
| TourStep slots | slot | header | renderHeader | 136 |
| TourStep events | event | close | onClose | 142 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| tour:80 | Tour Attributes | append-to | which element the TourContent appends to | ^[CSSSelector] / ^[HTMLElement] | `body` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:81 | Tour Attributes | show-arrow | whether to show the arrow | `boolean` | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:82 | Tour Attributes | placement | position of the guide card relative to the target element | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `bottom` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:83 | Tour Attributes | content-style | custom style for content | `CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:84 | Tour Attributes | mask | whether to enable masking, change mask style and fill color by pass custom props | `boolean` \| ^[Object]`{ style?: CSSProperties; color?: string; }` | `true` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:85 | Tour Attributes | gap | transparent gap between mask and target | `TourGap` | ^[Object]`{ offset: 6, radius: 2}` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:86 | Tour Attributes | type | type, affects the background color and text color | `default` \| `primary` | `default` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:87 | Tour Attributes | model-value / v-model | open tour | `boolean` | `false` | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| tour:88 | Tour Attributes | current / v-model:current | what is the current step | `number` | `0` | 具名双向绑定独立受控通道；与源同名语义事件发生冲突时必须在类型审计裁决，不机械合并。 |
| tour:89 | Tour Attributes | scroll-into-view-options | support pass custom scrollIntoView options | `boolean` \| `ScrollIntoViewOptions` | ^[Object]`{ block: 'center' }` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:90 | Tour Attributes | z-index | Tour's zIndex | `number` | `2001` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:91 | Tour Attributes | show-close | whether to show a close button | `boolean` | `true` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:92 | Tour Attributes | close-icon | custom close icon, default is Close | `string` \| `Component` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:93 | Tour Attributes | close-on-press-escape | whether the Dialog can be closed by pressing ESC | `boolean` | `true` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:94 | Tour Attributes | target-area-clickable | whether the target element can be clickable, when using mask | `boolean` | `true` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:100 | Tour slots | default | tourStep component list | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tour:101 | Tour slots | indicators | custom indicator | ^[object]`{ current: number, total: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tour:107 | Tour events | close | callback function on shutdown | ^[Function]`(current: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tour:108 | Tour events | finish | callback function on finished | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tour:109 | Tour events | change | callback when the step changes | ^[Function]`(current: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tour:117 | TourStep Attributes | target | get the element the guide card points to. Empty makes it show in center of screen. the string and Function types are supported since ^(2.5.2). the string type is selectors of document.querySelector. | `HTMLElement` \| `string` \| ^[Function]`() => HTMLElement` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:118 | TourStep Attributes | show-arrow | whether to show the arrow | `boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:119 | TourStep Attributes | title | title | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:120 | TourStep Attributes | description | description | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:121 | TourStep Attributes | placement | position of the guide card relative to the target element | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `bottom` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:122 | TourStep Attributes | content-style | custom style for content | `CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:123 | TourStep Attributes | mask | whether to enable masking, change mask style and fill color by pass custom props | `boolean` \| ^[Object]`{ style?: CSSProperties; color?: string; }` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:124 | TourStep Attributes | type | type, affects the background color and text color | `default` \| `primary` | `default` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:125 | TourStep Attributes | next-button-props | properties of the Next button | ^[Object]`{ children: VueNode \| string; onClick: Function }` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:126 | TourStep Attributes | prev-button-props | properties of the previous button | ^[Object]`{ children: VueNode \| string; onClick: Function }` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:127 | TourStep Attributes | scroll-into-view-options | support pass custom scrollIntoView options, the default follows the `scrollIntoViewOptions` property of Tour | `boolean` \| `ScrollIntoViewOptions` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:128 | TourStep Attributes | show-close | whether to show a close button | `boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:129 | TourStep Attributes | close-icon | custom close icon, default is Close | `string` \| `Component` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tour:135 | TourStep slots | default | custom description | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tour:136 | TourStep slots | header | custom header content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tour:142 | TourStep events | close | callback function on shutdown | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/tour](../../reference/element-plus/packages/components/tour/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/tour-step](../source-components/tour-step.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/tour/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tour/non-modal.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tour/placement.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tour/mask.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tour/indicator.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tour/target.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
