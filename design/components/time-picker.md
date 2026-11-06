# TimePicker 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/time-picker.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 单时间/范围。
- 展示/值格式、默认时间。
- 小时/分钟/秒禁用函数。
- 箭头/滚轮选择、确认清空。
- 键盘与表单。

## 2. 源文档场景清单

- [ ] Arbitrary time picker（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Limit the time range（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Arbitrary time range（原文第30行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 TimePicker，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 46 |
| Attributes | prop | readonly | readonly | 47 |
| Attributes | prop | disabled | disabled | 48 |
| Attributes | prop | editable | editable | 49 |
| Attributes | prop | clearable | clearable | 50 |
| Attributes | prop | size | size | 51 |
| Attributes | prop | placeholder | placeholder | 52 |
| Attributes | prop | start-placeholder | startPlaceholder | 53 |
| Attributes | prop | end-placeholder | endPlaceholder | 54 |
| Attributes | prop | is-range | isRange | 55 |
| Attributes | prop | arrow-control | arrowControl | 56 |
| Attributes | prop | popper-class | popperClass | 57 |
| Attributes | prop | popper-style | popperStyle | 58 |
| Attributes | prop | popper-options | popperOptions | 59 |
| Attributes | prop | fallback-placements | fallbackPlacements | 60 |
| Attributes | prop | placement | placement | 61 |
| Attributes | prop | range-separator | rangeSeparator | 62 |
| Attributes | prop | format | format | 63 |
| Attributes | prop | default-value | defaultValue | 64 |
| Attributes | prop | value-format | valueFormat | 65 |
| Attributes | prop | id | id | 66 |
| Attributes | prop | name | name | 67 |
| Attributes | prop | aria-label | ariaLabel | 68 |
| Attributes | prop | prefix-icon | prefixIcon | 69 |
| Attributes | prop | clear-icon | clearIcon | 70 |
| Attributes | prop | disabled-hours | disabledHours | 71 |
| Attributes | prop | disabled-minutes | disabledMinutes | 72 |
| Attributes | prop | disabled-seconds | disabledSeconds | 73 |
| Attributes | prop | teleported | teleported | 74 |
| Attributes | prop | tabindex | tabindex | 75 |
| Attributes | prop | empty-values | emptyValues | 76 |
| Attributes | prop | value-on-clear | valueOnClear | 77 |
| Attributes | prop | save-on-blur | saveOnBlur | 78 |
| Attributes | prop | label | label | 79 |
| Events | event | change | onChange | 85 |
| Events | event | blur | onBlur | 86 |
| Events | event | focus | onFocus | 87 |
| Events | event | clear | onClear | 88 |
| Events | event | visible-change | onVisibleChange | 89 |
| Exposes | ref | focus | ref.current.focus | 95 |
| Exposes | ref | blur | ref.current.blur | 96 |
| Exposes | ref | handleOpen | ref.current.handleOpen | 97 |
| Exposes | ref | handleClose | ref.current.handleClose | 98 |
| Type Declarations | reference | 'top-start' | 'topStart' | 108 |
| Type Declarations | reference | 'top-end' | 'topEnd' | 109 |
| Type Declarations | reference | 'bottom' | 'bottom' | 110 |
| Type Declarations | reference | 'bottom-start' | 'bottomStart' | 111 |
| Type Declarations | reference | 'bottom-end' | 'bottomEnd' | 112 |
| Type Declarations | reference | 'left' | 'left' | 113 |
| Type Declarations | reference | 'left-start' | 'leftStart' | 114 |
| Type Declarations | reference | 'left-end' | 'leftEnd' | 115 |
| Type Declarations | reference | 'right' | 'right' | 116 |
| Type Declarations | reference | 'right-start' | 'rightStart' | 117 |
| Type Declarations | reference | 'right-end' | 'rightEnd' | 118 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| time-picker:46 | Attributes | model-value / v-model | binding value, if it is an array, the length should be 2 | ^[number] / ^[string] / ^[object]`Date \| [Date, Date] \| [number, number] \| [string, string]` | '' | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| time-picker:47 | Attributes | readonly | whether TimePicker is read only | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:48 | Attributes | disabled | whether TimePicker is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:49 | Attributes | editable | whether the input is editable | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:50 | Attributes | clearable | whether to show clear button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:51 | Attributes | size | size of Input | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:52 | Attributes | placeholder | placeholder in non-range mode | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:53 | Attributes | start-placeholder | placeholder for the start time in range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:54 | Attributes | end-placeholder | placeholder for the end time in range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:55 | Attributes | is-range | whether to pick a time range | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:56 | Attributes | arrow-control | whether to pick time using arrow buttons | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:57 | Attributes | popper-class | custom class name for TimePicker's dropdown | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:58 | Attributes | popper-style | custom style for TimePicker's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:59 | Attributes | popper-options | Customized popper option see more at [popper.js](https://popper.js.org/docs/v2/) | ^[object]`Partial<PopperOptions>` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:60 | Attributes | fallback-placements | list of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:61 | Attributes | placement | position of dropdown | `Placement` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:62 | Attributes | range-separator | range separator | ^[string] | '-' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:63 | Attributes | format | format of the displayed value in the input box | ^[string] see [date formats](./date-picker.md#date-formats) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:64 | Attributes | default-value | optional, default date of the calendar | ^[Date] / ^[array]`[Date, Date]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:65 | Attributes | value-format | optional, format of binding value. If not specified, the binding value will be a Date object | ^[string] see [date formats](./date-picker.md#date-formats) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:66 | Attributes | id | same as `id` in native input | ^[string] / ^[array]`[string, string]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:67 | Attributes | name | same as `name` in native input | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:68 | Attributes | aria-label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:69 | Attributes | prefix-icon | Custom prefix icon component | ^[string] / ^[Component] | Clock | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:70 | Attributes | clear-icon | Custom clear icon component | ^[string] / ^[Component] | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:71 | Attributes | disabled-hours | To specify the array of hours that cannot be selected | ^[Function]`(role: string, comparingDate?: Dayjs) => number[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:72 | Attributes | disabled-minutes | To specify the array of minutes that cannot be selected | ^[Function]`(hour: number, role: string, comparingDate?: Dayjs) => number[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:73 | Attributes | disabled-seconds | To specify the array of seconds that cannot be selected | ^[Function]`(hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:74 | Attributes | teleported | whether time-picker dropdown is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:75 | Attributes | tabindex | input tabindex | ^[string] / ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:76 | Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:77 | Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:78 | Attributes | save-on-blur | Whether to auto-fill the input with the current time on focus when no value is selected | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:79 | Attributes | label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:85 | Events | change | triggers when user confirms the value | ^[Function]`(val: number \| string \| Date \| [number, number] \| [string, string] \| [Date, Date]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-picker:86 | Events | blur | triggers when Input blurs | ^[Function]`(e: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-picker:87 | Events | focus | triggers when Input focuses | ^[Function]`(e: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-picker:88 | Events | clear | triggers when the clear icon is clicked in a clearable TimePicker | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-picker:89 | Events | visible-change | triggers when the TimePicker's dropdown appears/disappears | ^[Function]`(visibility: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-picker:95 | Exposes | focus | focus the TimePicker component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| time-picker:96 | Exposes | blur | blur the TimePicker component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| time-picker:97 | Exposes | handleOpen | open the TimePicker popper | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| time-picker:98 | Exposes | handleClose | close the TimePicker popper | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| time-picker:108 | Type Declarations | 'top-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:109 | Type Declarations | 'top-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:110 | Type Declarations | 'bottom' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:111 | Type Declarations | 'bottom-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:112 | Type Declarations | 'bottom-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:113 | Type Declarations | 'left' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:114 | Type Declarations | 'left-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:115 | Type Declarations | 'left-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:116 | Type Declarations | 'right' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:117 | Type Declarations | 'right-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-picker:118 | Type Declarations | 'right-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/time-picker](../../reference/element-plus/packages/components/time-picker/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/time-picker/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/time-picker/basic-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/time-picker/range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
