# DatetimePicker 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/datetime-picker.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- DatePicker 的日期时间及范围场景。
- 日期/时间联合约束。
- 默认时间、秒和格式、确认取消。
- 不是独立重造一套日期内核。

## 2. 源文档场景清单

- [ ] Date and time（原文第16行）：建立React示例与对应行为/视觉断言。
- [ ] DateTime Formats（原文第24行）：建立React示例与对应行为/视觉断言。
- [ ] Date and time formats in dropdown panel（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] Date and time range（原文第54行）：建立React示例与对应行为/视觉断言。
- [ ] Single Panel ^(2.14.0)（原文第62行）：建立React示例与对应行为/视觉断言。
- [ ] Default time value for start date and end date（原文第70行）：建立React示例与对应行为/视觉断言。
- [ ] Custom icon ^(2.8.0)（原文第78行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 DatePicker（日期时间场景），组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 94 |
| Attributes | prop | readonly | readonly | 95 |
| Attributes | prop | disabled | disabled | 96 |
| Attributes | prop | editable | editable | 97 |
| Attributes | prop | clearable | clearable | 98 |
| Attributes | prop | size | size | 99 |
| Attributes | prop | placeholder | placeholder | 100 |
| Attributes | prop | start-placeholder | startPlaceholder | 101 |
| Attributes | prop | end-placeholder | endPlaceholder | 102 |
| Attributes | prop | arrow-control | arrowControl | 103 |
| Attributes | prop | type | type | 104 |
| Attributes | prop | format | format | 105 |
| Attributes | prop | popper-class | popperClass | 106 |
| Attributes | prop | popper-style | popperStyle | 107 |
| Attributes | prop | popper-options | popperOptions | 108 |
| Attributes | prop | fallback-placements | fallbackPlacements | 109 |
| Attributes | prop | placement | placement | 110 |
| Attributes | prop | range-separator | rangeSeparator | 111 |
| Attributes | prop | default-value | defaultValue | 112 |
| Attributes | prop | default-time | defaultTime | 113 |
| Attributes | prop | value-format | valueFormat | 114 |
| Attributes | prop | date-format | dateFormat | 115 |
| Attributes | prop | time-format | timeFormat | 116 |
| Attributes | prop | id | id | 117 |
| Attributes | prop | name | name | 118 |
| Attributes | prop | unlink-panels | unlinkPanels | 119 |
| Attributes | prop | single-panel | singlePanel | 120 |
| Attributes | prop | prefix-icon | prefixIcon | 121 |
| Attributes | prop | clear-icon | clearIcon | 122 |
| Attributes | prop | shortcuts | shortcuts | 123 |
| Attributes | prop | disabled-date | disabledDate | 124 |
| Attributes | prop | disabled-hours | disabledHours | 125 |
| Attributes | prop | disabled-minutes | disabledMinutes | 126 |
| Attributes | prop | disabled-seconds | disabledSeconds | 127 |
| Attributes | prop | cell-class-name | cellClassName | 128 |
| Attributes | prop | teleported | teleported | 129 |
| Attributes | prop | empty-values | emptyValues | 130 |
| Attributes | prop | value-on-clear | valueOnClear | 131 |
| Attributes | prop | show-now | showNow | 132 |
| Attributes | prop | show-footer | showFooter | 133 |
| Attributes | prop | show-confirm | showConfirm | 134 |
| Attributes | prop | show-week-number | showWeekNumber | 135 |
| Events | event | change | onChange | 141 |
| Events | event | blur | onBlur | 142 |
| Events | event | focus | onFocus | 143 |
| Events | event | clear | onClear | 144 |
| Events | event | calendar-change | onCalendarChange | 145 |
| Events | event | panel-change | onPanelChange | 146 |
| Events | event | visible-change | onVisibleChange | 147 |
| Slots | slot | default | children | 153 |
| Slots | slot | range-separator | renderRangeSeparator | 154 |
| Slots | slot | prev-month | renderPrevMonth | 155 |
| Slots | slot | next-month | renderNextMonth | 156 |
| Slots | slot | prev-year | renderPrevYear | 157 |
| Slots | slot | next-year | renderNextYear | 158 |
| Exposes | ref | focus | ref.current.focus | 164 |
| Exposes | ref | blur | ref.current.blur | 165 |
| Type Declarations | reference | 'top-start' | 'topStart' | 175 |
| Type Declarations | reference | 'top-end' | 'topEnd' | 176 |
| Type Declarations | reference | 'bottom' | 'bottom' | 177 |
| Type Declarations | reference | 'bottom-start' | 'bottomStart' | 178 |
| Type Declarations | reference | 'bottom-end' | 'bottomEnd' | 179 |
| Type Declarations | reference | 'left' | 'left' | 180 |
| Type Declarations | reference | 'left-start' | 'leftStart' | 181 |
| Type Declarations | reference | 'left-end' | 'leftEnd' | 182 |
| Type Declarations | reference | 'right' | 'right' | 183 |
| Type Declarations | reference | 'right-start' | 'rightStart' | 184 |
| Type Declarations | reference | 'right-end' | 'rightEnd' | 185 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| datetime-picker:94 | Attributes | model-value / v-model | binding value, if it is an `range` picker, the length of the array should be 2 | ^[number] / ^[string] / ^[Date] / ^[array]`number[] \| string[] \| Date[]` | '' | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| datetime-picker:95 | Attributes | readonly | whether DatePicker is read only | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:96 | Attributes | disabled | whether DatePicker is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:97 | Attributes | editable | whether the input is editable | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:98 | Attributes | clearable | whether to show clear button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:99 | Attributes | size | size of Input | ^[enum]`'large' \| 'default' \| 'small'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:100 | Attributes | placeholder | placeholder in non-range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:101 | Attributes | start-placeholder | placeholder for the start date in range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:102 | Attributes | end-placeholder | placeholder for the end date in range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:103 | Attributes | arrow-control | whether to pick time using arrow buttons | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:104 | Attributes | type | type of the picker | ^[enum]`'year' \| 'month' \| 'date' \| 'datetime' \| 'week' \| 'datetimerange' \| 'daterange'` | date | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:105 | Attributes | format | format of the displayed value in the input box | ^[string] see [date formats](./date-picker.md#date-formats) | YYYY-MM-DD HH:mm:ss | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:106 | Attributes | popper-class | custom class name for DateTimePicker's dropdown | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:107 | Attributes | popper-style | custom style for DateTimePicker's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:108 | Attributes | popper-options | Customized popper option see more at [popper.js](https://popper.js.org/docs/v2/) | ^[object]`Partial<PopperOptions>` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:109 | Attributes | fallback-placements | list of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:110 | Attributes | placement | position of dropdown | `Placement` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:111 | Attributes | range-separator | range separator | ^[string] | '-' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:112 | Attributes | default-value | optional, default date of the calendar | ^[object]`Date \| [Date, Date]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:113 | Attributes | default-time | the default time value after picking a date. Time `00:00:00` will be used if not specified | ^[object]`Date \| [Date, Date]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:114 | Attributes | value-format | optional, format of binding value. If not specified, the binding value will be a Date object | ^[string] see [date formats](https://day.js.org/docs/en/display/format) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:115 | Attributes | date-format | optional, format of the date displayed in input's inner panel | ^[string] see [date formats](https://day.js.org/docs/en/display/format) | YYYY-MM-DD | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:116 | Attributes | time-format | optional, format of the time displayed in input's inner panel | ^[string] see [date formats](https://day.js.org/docs/en/display/format) | HH:mm:ss | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:117 | Attributes | id | same as `id` in native input | ^[string] / ^[array]`[string, string]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:118 | Attributes | name | same as `name` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:119 | Attributes | unlink-panels | unlink two date-panels in range-picker | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:120 | Attributes | single-panel | show only one panel in range-picker | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:121 | Attributes | prefix-icon | Custom prefix icon component | ^[string] / `Component` | Date | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:122 | Attributes | clear-icon | Custom clear icon component | ^[string] / `Component` | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:123 | Attributes | shortcuts | an object array to set shortcut options | ^[array]`Array<{ text: string, value: Date \| Function }>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:124 | Attributes | disabled-date | a function determining if a date is disabled with that date as its parameter. Should return a Boolean | ^[Function]`(data: Date) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:125 | Attributes | disabled-hours | To specify the array of hours that cannot be selected | ^[Function]`(role: string, comparingDate?: Dayjs) => number[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:126 | Attributes | disabled-minutes | To specify the array of minutes that cannot be selected | ^[Function]`(hour: number, role: string, comparingDate?: Dayjs) => number[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:127 | Attributes | disabled-seconds | To specify the array of seconds that cannot be selected | ^[Function]`(hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:128 | Attributes | cell-class-name | set custom className | ^[Function]`(data: Date) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:129 | Attributes | teleported | whether datetime-picker dropdown is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:130 | Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:131 | Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:132 | Attributes | show-now | whether to show the now button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:133 | Attributes | show-footer | whether to show footer where the date picker is one ^[enum]`'datetime' \| 'datetimerange'` | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:134 | Attributes | show-confirm | whether to show the confirm button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:135 | Attributes | show-week-number | show the week number besides the week | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:141 | Events | change | triggers when user confirms the value or click outside | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:142 | Events | blur | triggers when Input blurs | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:143 | Events | focus | triggers when Input focuses | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:144 | Events | clear | triggers when a clear button is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:145 | Events | calendar-change | triggers when the calendar selected date is changed. Only for `range` | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:146 | Events | panel-change | triggers when the navigation button click. | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:147 | Events | visible-change | triggers when the DateTimePicker's dropdown appears/disappears | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| datetime-picker:153 | Slots | default | custom cell content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| datetime-picker:154 | Slots | range-separator | custom range separator content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| datetime-picker:155 | Slots | prev-month | prev month icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| datetime-picker:156 | Slots | next-month | next month icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| datetime-picker:157 | Slots | prev-year | prev year icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| datetime-picker:158 | Slots | next-year | next year icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| datetime-picker:164 | Exposes | focus | focus the DatePicker component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| datetime-picker:165 | Exposes | blur | blur the DatePicker component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| datetime-picker:175 | Type Declarations | 'top-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:176 | Type Declarations | 'top-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:177 | Type Declarations | 'bottom' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:178 | Type Declarations | 'bottom-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:179 | Type Declarations | 'bottom-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:180 | Type Declarations | 'left' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:181 | Type Declarations | 'left-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:182 | Type Declarations | 'left-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:183 | Type Declarations | 'right' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:184 | Type Declarations | 'right-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| datetime-picker:185 | Type Declarations | 'right-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- 这是组合场景或基础规范；应通过下方示例反查关联组件。
- 示例：docs/examples/datetime-picker/date-and-time.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/datetime-picker/date-and-time-formats.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/datetime-picker/date-and-time-formats-panel.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/datetime-picker/date-and-time-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/datetime-picker/single-panel.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/datetime-picker/default-time.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/datetime-picker/custom-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
