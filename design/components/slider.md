# Slider 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/slider.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 单值/范围、min/max/step、刻度/停顿点。
- 输入框、Tooltip、竖向。
- 拖动和键盘、input/change 区分。
- 禁用与非法范围。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Discrete values（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Slider with input box（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Placement（原文第48行）：建立React示例与对应行为/视觉断言。
- [ ] Range selection（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Vertical mode（原文第68行）：建立React示例与对应行为/视觉断言。
- [ ] Show marks（原文第76行）：建立React示例与对应行为/视觉断言。
- [ ] Restrict value ^(2.13.6)（原文第84行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Slider，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 98 |
| Attributes | prop | min | min | 99 |
| Attributes | prop | max | max | 100 |
| Attributes | prop | disabled | disabled | 101 |
| Attributes | prop | step | step | 102 |
| Attributes | prop | show-input | showInput | 103 |
| Attributes | prop | show-input-controls | showInputControls | 104 |
| Attributes | prop | size | size | 105 |
| Attributes | prop | input-size | inputSize | 106 |
| Attributes | prop | show-stops | showStops | 107 |
| Attributes | prop | show-tooltip | showTooltip | 108 |
| Attributes | prop | format-tooltip | formatTooltip | 109 |
| Attributes | prop | range | range | 110 |
| Attributes | prop | vertical | vertical | 111 |
| Attributes | prop | height | height | 112 |
| Attributes | prop | aria-label | ariaLabel | 113 |
| Attributes | prop | range-start-label | rangeStartLabel | 114 |
| Attributes | prop | range-end-label | rangeEndLabel | 115 |
| Attributes | prop | format-value-text | formatValueText | 116 |
| Attributes | prop | tooltip-class | tooltipClass | 117 |
| Attributes | prop | placement | placement | 118 |
| Attributes | prop | marks | marks | 119 |
| Attributes | prop | validate-event | validateEvent | 120 |
| Attributes | prop | persistent | persistent | 121 |
| Attributes | prop | label | label | 122 |
| Events | event | change | onChange | 128 |
| Events | event | input | onInput | 129 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| slider:98 | Attributes | model-value / v-model | binding value | ^[number] / ^[array]`number[]` | 0 | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| slider:99 | Attributes | min | minimum value | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:100 | Attributes | max | maximum value | ^[number] | 100 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:101 | Attributes | disabled | whether Slider is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:102 | Attributes | step | step size, can be a number or `'mark'` ^(2.13.6) to restrict values to marks. When set to `'mark'`, the `marks` attribute must be set | ^[number] / ^[string]`'mark'` | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:103 | Attributes | show-input | whether to display an input box, works when `range` is false and `step` is not `'mark'` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:104 | Attributes | show-input-controls | whether to display control buttons when `show-input` is true | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:105 | Attributes | size | size of the slider wrapper, will not work in vertical mode | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:106 | Attributes | input-size | size of the input box, when set `size`, the default is the value of `size` | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:107 | Attributes | show-stops | whether to display breakpoints | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:108 | Attributes | show-tooltip | whether to display tooltip value | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:109 | Attributes | format-tooltip | format to display tooltip value | ^[Function]`(value: number) => number \| string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:110 | Attributes | range | whether to select a range | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:111 | Attributes | vertical | vertical mode | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:112 | Attributes | height | slider height, required in vertical mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:113 | Attributes | aria-label | native `aria-label` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:114 | Attributes | range-start-label | when `range` is true, screen reader label for the start of the range | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:115 | Attributes | range-end-label | when `range` is true, screen reader label for the end of the range | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:116 | Attributes | format-value-text | format to display the `aria-valuenow` attribute for screen readers | ^[Function]`(value: number) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:117 | Attributes | tooltip-class | custom class name for the tooltip | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:118 | Attributes | placement | position of Tooltip | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | top | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:119 | Attributes | marks | marks, type of key must be `number` and must in closed interval `[min, max]`, each mark can custom style | ^[object]`SliderMarks` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:120 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:121 | Attributes | persistent | when slider tooltip inactive and `persistent` is `false` , tooltip will be destroyed. `persistent` always be `false` when `show-tooltip ` is `false` | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:122 | Attributes | label | native `aria-label` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| slider:128 | Events | change | triggers when the value changes (if the mouse is being dragged, this event only fires when the mouse is released) | ^[Function]`(value: Arrayable<number>) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| slider:129 | Events | input | triggers when the data changes (It'll be emitted in real time during sliding) | ^[Function]`(value: Arrayable<number>) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/slider](../../reference/element-plus/packages/components/slider/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/slider/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/discrete-values.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/slider-with-input-box.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/sizes.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/placement.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/range-selection.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/vertical-mode.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/show-marks.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/slider/restrict-value.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
