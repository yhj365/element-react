# DatePicker 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/date-picker.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 日期、周、月、年及范围等源模式。
- 展示格式和绑定格式分离。
- 禁用日期、快捷项、默认值、清空、确认。
- 左右面板联动、键盘和国际化。

## 2. 源文档场景清单

- [ ] Enter Date（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Other measurements（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Date Range（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Month Range（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Year Range ^(2.8.0)（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Quarter Range ^(2.14.5)（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Single Panel ^(2.14.0)（原文第70行）：建立React示例与对应行为/视觉断言。
- [ ] Default Value（原文第78行）：建立React示例与对应行为/视觉断言。
- [ ] Date Formats（原文第90行）：建立React示例与对应行为/视觉断言。
- [ ] Default time for start date and end date（原文第110行）：建立React示例与对应行为/视觉断言。
- [ ] Set custom content of prefix（原文第120行）：建立React示例与对应行为/视觉断言。
- [ ] Custom content（原文第130行）：建立React示例与对应行为/视觉断言。
- [ ] Custom icon ^(2.8.0)（原文第140行）：建立React示例与对应行为/视觉断言。
- [ ] Localization（原文第173行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

解析输入、面板候选日期、范围起止、活动端点和已提交值分开。输入失效不立即破坏上次合法值；confirm/clear/close处理按源模式分别锁定。显示format与valueFormat独立，年月周、时间及范围禁用条件交叉验证；快捷项与手动选中共用提交通道。

## 3. React 19 结构与交互契约

- 主导出拟为 DatePicker，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 185 |
| Attributes | prop | readonly | readonly | 186 |
| Attributes | prop | disabled | disabled | 187 |
| Attributes | prop | size | size | 188 |
| Attributes | prop | editable | editable | 189 |
| Attributes | prop | clearable | clearable | 190 |
| Attributes | prop | placeholder | placeholder | 191 |
| Attributes | prop | start-placeholder | startPlaceholder | 192 |
| Attributes | prop | end-placeholder | endPlaceholder | 193 |
| Attributes | prop | type | type | 194 |
| Attributes | prop | format | format | 195 |
| Attributes | prop | popper-class | popperClass | 196 |
| Attributes | prop | popper-style | popperStyle | 197 |
| Attributes | prop | popper-options | popperOptions | 198 |
| Attributes | prop | range-separator | rangeSeparator | 199 |
| Attributes | prop | default-value | defaultValue | 200 |
| Attributes | prop | default-time | defaultTime | 201 |
| Attributes | prop | value-format | valueFormat | 202 |
| Attributes | prop | id | id | 203 |
| Attributes | prop | name | name | 204 |
| Attributes | prop | unlink-panels | unlinkPanels | 205 |
| Attributes | prop | single-panel | singlePanel | 206 |
| Attributes | prop | prefix-icon | prefixIcon | 207 |
| Attributes | prop | clear-icon | clearIcon | 208 |
| Attributes | prop | validate-event | validateEvent | 209 |
| Attributes | prop | disabled-date | disabledDate | 210 |
| Attributes | prop | shortcuts | shortcuts | 211 |
| Attributes | prop | cell-class-name | cellClassName | 212 |
| Attributes | prop | teleported | teleported | 213 |
| Attributes | prop | empty-values | emptyValues | 214 |
| Attributes | prop | value-on-clear | valueOnClear | 215 |
| Attributes | prop | fallback-placements | fallbackPlacements | 216 |
| Attributes | prop | placement | placement | 217 |
| Attributes | prop | show-footer | showFooter | 218 |
| Attributes | prop | show-confirm | showConfirm | 219 |
| Attributes | prop | show-week-number | showWeekNumber | 220 |
| Attributes | prop | automatic-dropdown | automaticDropdown | 221 |
| Events | event | change | onChange | 227 |
| Events | event | blur | onBlur | 228 |
| Events | event | focus | onFocus | 229 |
| Events | event | clear | onClear | 230 |
| Events | event | calendar-change | onCalendarChange | 231 |
| Events | event | panel-change | onPanelChange | 232 |
| Events | event | visible-change | onVisibleChange | 233 |
| Slots | slot | default | children | 239 |
| Slots | slot | range-separator | renderRangeSeparator | 240 |
| Slots | slot | prev-month | renderPrevMonth | 241 |
| Slots | slot | next-month | renderNextMonth | 242 |
| Slots | slot | prev-year | renderPrevYear | 243 |
| Slots | slot | next-year | renderNextYear | 244 |
| Exposes | ref | focus | ref.current.focus | 250 |
| Exposes | ref | blur | ref.current.blur | 251 |
| Exposes | ref | handleOpen | ref.current.handleOpen | 252 |
| Exposes | ref | handleClose | ref.current.handleClose | 253 |
| Type Declarations | reference | 'top-start' | 'topStart' | 267 |
| Type Declarations | reference | 'top-end' | 'topEnd' | 268 |
| Type Declarations | reference | 'bottom' | 'bottom' | 269 |
| Type Declarations | reference | 'bottom-start' | 'bottomStart' | 270 |
| Type Declarations | reference | 'bottom-end' | 'bottomEnd' | 271 |
| Type Declarations | reference | 'left' | 'left' | 272 |
| Type Declarations | reference | 'left-start' | 'leftStart' | 273 |
| Type Declarations | reference | 'left-end' | 'leftEnd' | 274 |
| Type Declarations | reference | 'right' | 'right' | 275 |
| Type Declarations | reference | 'right-start' | 'rightStart' | 276 |
| Type Declarations | reference | 'right-end' | 'rightEnd' | 277 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| date-picker:185 | Attributes | model-value / v-model | binding value, if it is an `range` picker, the length of the array should be 2 | ^[number] / ^[string] / ^[Date] / ^[array]`number[] \| string[] \| Date[]` | '' | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| date-picker:186 | Attributes | readonly | whether DatePicker is read only | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:187 | Attributes | disabled | whether DatePicker is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:188 | Attributes | size | size of Input | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:189 | Attributes | editable | whether the input is editable | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:190 | Attributes | clearable | whether to show clear button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:191 | Attributes | placeholder | placeholder in non-range mode | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:192 | Attributes | start-placeholder | placeholder for the start date in range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:193 | Attributes | end-placeholder | placeholder for the end date in range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:194 | Attributes | type | type of the picker. `quarter`, `quarters`, and `quarterrange` are supported since ^(2.14.5) | ^[enum]`'year' \| 'years' \|'month' \| 'months' \| 'date' \| 'dates' \| 'datetime' \| 'week' \| 'quarter' \| 'quarters' \| 'datetimerange' \| 'daterange' \| 'monthrange' \| 'yearrange' \| 'quarterrange'` | date | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:195 | Attributes | format | format of the displayed value in the input box | ^[string] see [date formats](#date-formats) | YYYY-MM-DD | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:196 | Attributes | popper-class | custom class name for DatePicker's dropdown | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:197 | Attributes | popper-style | custom style for DatePicker's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:198 | Attributes | popper-options | Customized popper option see more at [popper.js](https://popper.js.org/docs/v2/) | ^[object]`Partial<PopperOptions>` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:199 | Attributes | range-separator | range separator | ^[string] | '-' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:200 | Attributes | default-value | optional, default date of the calendar | ^[object]`Date \| [Date, Date]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:201 | Attributes | default-time | optional, the time value to use when selecting date range | ^[object]`Date \| [Date, Date]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:202 | Attributes | value-format | optional, format of binding value. If not specified, the binding value will be a Date object | ^[string] see [date formats](#date-formats) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:203 | Attributes | id | same as `id` in native input | ^[string] / ^[array]`[string, string]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:204 | Attributes | name | same as `name` in native input | ^[string] / ^[array]`[string, string]` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:205 | Attributes | unlink-panels | unlink two date-panels in range-picker | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:206 | Attributes | single-panel | show only one panel in range-picker | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:207 | Attributes | prefix-icon | custom prefix icon component. By default, if the value of `type` is `TimeLikeType`, the value is `Clock`, else is `Calendar` | ^[string] / ^[object]`Component` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:208 | Attributes | clear-icon | custom clear icon component | ^[string] / ^[object]`Component` | `CircleClose` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:209 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:210 | Attributes | disabled-date | a function determining if a date is disabled with that date as its parameter. Should return a Boolean | ^[Function]`(data: Date) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:211 | Attributes | shortcuts | an object array to set shortcut options | ^[array]`Array<{ text: string, value: Date \| Function }>` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:212 | Attributes | cell-class-name | set custom className | ^[Function]`(data: Date) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:213 | Attributes | teleported | whether date-picker dropdown is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:214 | Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:215 | Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:216 | Attributes | fallback-placements | list of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:217 | Attributes | placement | position of dropdown | `Placement` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:218 | Attributes | show-footer | whether to show footer where the date picker is one ^[enum]`'dates' \| 'months' \| 'years' \| 'quarters'` | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:219 | Attributes | show-confirm | whether to show the confirm button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:220 | Attributes | show-week-number | show the week number besides the week | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:221 | Attributes | automatic-dropdown | this prop decides if the date picker panel pops up when the input is focused. (The default value will be set to false in version 3.0) | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:227 | Events | change | triggers when user confirms the value or click outside | ^[Function]`(val: typeof v-model) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:228 | Events | blur | triggers when Input blurs | ^[Function]`(e: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:229 | Events | focus | triggers when Input focuses | ^[Function]`(e: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:230 | Events | clear | triggers when a clear button is clicked | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:231 | Events | calendar-change | triggers when the calendar selected date is changed. Only for `range` | ^[Function]`(val: [Date, null \| Date]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:232 | Events | panel-change | triggers when the navigation button click. | ^[Function]`(date: Date \| [Date, Date], mode: 'month' \| 'year', view?: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:233 | Events | visible-change | triggers when the DatePicker's dropdown appears/disappears | ^[Function]`(visibility: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| date-picker:239 | Slots | default | custom cell content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| date-picker:240 | Slots | range-separator | custom range separator content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| date-picker:241 | Slots | prev-month | prev month icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| date-picker:242 | Slots | next-month | next month icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| date-picker:243 | Slots | prev-year | prev year icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| date-picker:244 | Slots | next-year | next year icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| date-picker:250 | Exposes | focus | focus the DatePicker component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| date-picker:251 | Exposes | blur | blur the DatePicker component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| date-picker:252 | Exposes | handleOpen | open the DatePicker popper | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| date-picker:253 | Exposes | handleClose | close the DatePicker popper | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| date-picker:267 | Type Declarations | 'top-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:268 | Type Declarations | 'top-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:269 | Type Declarations | 'bottom' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:270 | Type Declarations | 'bottom-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:271 | Type Declarations | 'bottom-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:272 | Type Declarations | 'left' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:273 | Type Declarations | 'left-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:274 | Type Declarations | 'left-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:275 | Type Declarations | 'right' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:276 | Type Declarations | 'right-start' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| date-picker:277 | Type Declarations | 'right-end' | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/date-picker](../../reference/element-plus/packages/components/date-picker/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/date-picker/enter-date.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/other-measurements.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/date-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/month-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/year-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/quarter-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/single-panel.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/default-value.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/date-formats.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/default-time.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/custom-prefix-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/custom-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/date-picker/custom-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
