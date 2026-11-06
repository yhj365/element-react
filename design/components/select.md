# Select 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/select.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- Option/OptionGroup。
- 单选/多选、过滤/远程、创建。
- 对象值键、禁用、清空、标签折叠。
- 头尾/空/加载/标签/选中项定制。
- 键盘高亮、面板滚动和表单。

## 2. 源文档场景清单

- [ ] Basic usage（原文第16行）：建立React示例与对应行为/视觉断言。
- [ ] Options attribute ^(2.10.5)（原文第24行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled option（原文第32行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled select（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Clearable（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Basic multiple select（原文第68行）：建立React示例与对应行为/视觉断言。
- [ ] Custom template（原文第78行）：建立React示例与对应行为/视觉断言。
- [ ] Header of the dropdown ^(2.4.3)（原文第88行）：建立React示例与对应行为/视觉断言。
- [ ] Footer of the dropdown ^(2.4.3)（原文第98行）：建立React示例与对应行为/视觉断言。
- [ ] Grouping（原文第108行）：建立React示例与对应行为/视觉断言。
- [ ] Option filtering（原文第118行）：建立React示例与对应行为/视觉断言。
- [ ] Remote Search（原文第128行）：建立React示例与对应行为/视觉断言。
- [ ] Create new items（原文第138行）：建立React示例与对应行为/视觉断言。
- [ ] Use value-key attribute（原文第148行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Tag ^(2.5.0)（原文第158行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Loading ^(2.5.2)（原文第168行）：建立React示例与对应行为/视觉断言。
- [ ] Empty Values ^(2.7.0)（原文第178行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Label ^(2.7.4)（原文第190行）：建立React示例与对应行为/视觉断言。
- [ ] tag-tooltip ^(2.13.3)（原文第275行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

分离selectedValues、query、expanded、highlightedOption与remoteRequest。选项注册有稳定key；对象值按valueKey回显。过滤/懒载不删除已选标签；disabled选项不能被键盘提交。多选删除和clear分别产生来源语义事件；返回过期远程结果不得覆盖新查询。

## 3. React 19 结构与交互契约

- 主导出拟为 Select，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Select Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 206 |
| Select Attributes | prop | multiple | multiple | 207 |
| Select Attributes | prop | options | options | 208 |
| Select Attributes | prop | [props](#props) | [props](#props) | 209 |
| Select Attributes | prop | disabled | disabled | 210 |
| Select Attributes | prop | value-key | valueKey | 211 |
| Select Attributes | prop | size | size | 212 |
| Select Attributes | prop | clearable | clearable | 213 |
| Select Attributes | prop | collapse-tags | collapseTags | 214 |
| Select Attributes | prop | collapse-tags-tooltip | collapseTagsTooltip | 215 |
| Select Attributes | prop | [tag-tooltip](#tag-tooltip) | [tagTooltip](#tagTooltip) | 216 |
| Select Attributes | prop | multiple-limit | multipleLimit | 217 |
| Select Attributes | prop | id | id | 218 |
| Select Attributes | prop | name | name | 219 |
| Select Attributes | prop | effect | effect | 220 |
| Select Attributes | prop | autocomplete | autocomplete | 221 |
| Select Attributes | prop | placeholder | placeholder | 222 |
| Select Attributes | prop | filterable | filterable | 223 |
| Select Attributes | prop | allow-create | allowCreate | 224 |
| Select Attributes | prop | filter-method | filterMethod | 225 |
| Select Attributes | prop | remote | remote | 226 |
| Select Attributes | prop | debounce | debounce | 227 |
| Select Attributes | prop | remote-method | remoteMethod | 228 |
| Select Attributes | prop | remote-show-suffix | remoteShowSuffix | 229 |
| Select Attributes | prop | loading | loading | 230 |
| Select Attributes | prop | loading-text | loadingText | 231 |
| Select Attributes | prop | no-match-text | noMatchText | 232 |
| Select Attributes | prop | no-data-text | noDataText | 233 |
| Select Attributes | prop | popper-class | popperClass | 234 |
| Select Attributes | prop | popper-style | popperStyle | 235 |
| Select Attributes | prop | reserve-keyword | reserveKeyword | 236 |
| Select Attributes | prop | default-first-option | defaultFirstOption | 237 |
| Select Attributes | prop | teleported | teleported | 238 |
| Select Attributes | prop | append-to | appendTo | 239 |
| Select Attributes | prop | persistent | persistent | 240 |
| Select Attributes | prop | automatic-dropdown | automaticDropdown | 241 |
| Select Attributes | prop | clear-icon | clearIcon | 242 |
| Select Attributes | prop | fit-input-width | fitInputWidth | 243 |
| Select Attributes | prop | suffix-icon | suffixIcon | 244 |
| Select Attributes | prop | tag-type | tagType | 245 |
| Select Attributes | prop | tag-effect | tagEffect | 246 |
| Select Attributes | prop | validate-event | validateEvent | 247 |
| Select Attributes | prop | offset | offset | 248 |
| Select Attributes | prop | show-arrow | showArrow | 249 |
| Select Attributes | prop | placement | placement | 250 |
| Select Attributes | prop | fallback-placements | fallbackPlacements | 251 |
| Select Attributes | prop | max-collapse-tags | maxCollapseTags | 252 |
| Select Attributes | prop | popper-options | popperOptions | 253 |
| Select Attributes | prop | aria-label | ariaLabel | 254 |
| Select Attributes | prop | empty-values | emptyValues | 255 |
| Select Attributes | prop | value-on-clear | valueOnClear | 256 |
| Select Attributes | prop | suffix-transition | suffixTransition | 257 |
| Select Attributes | prop | tabindex | tabindex | 258 |
| props | prop | value | value | 270 |
| props | prop | label | label | 271 |
| props | prop | options | options | 272 |
| props | prop | disabled | disabled | 273 |
| tag-tooltip ^(2.13.3) | reference | append-to | appendTo | 296 |
| tag-tooltip ^(2.13.3) | reference | placement | placement | 297 |
| tag-tooltip ^(2.13.3) | reference | fallback-placements | fallbackPlacements | 298 |
| tag-tooltip ^(2.13.3) | reference | effect | effect | 299 |
| tag-tooltip ^(2.13.3) | reference | popper-class | popperClass | 300 |
| tag-tooltip ^(2.13.3) | reference | popper-style | popperStyle | 301 |
| tag-tooltip ^(2.13.3) | reference | transition | transition | 302 |
| tag-tooltip ^(2.13.3) | reference | teleported | teleported | 303 |
| tag-tooltip ^(2.13.3) | reference | popper-options | popperOptions | 304 |
| tag-tooltip ^(2.13.3) | reference | show-after | showAfter | 305 |
| tag-tooltip ^(2.13.3) | reference | hide-after | hideAfter | 306 |
| tag-tooltip ^(2.13.3) | reference | auto-close | autoClose | 307 |
| tag-tooltip ^(2.13.3) | reference | offset | offset | 308 |
| Select Events | event | change | onChange | 314 |
| Select Events | event | visible-change | onVisibleChange | 315 |
| Select Events | event | remove-tag | onRemoveTag | 316 |
| Select Events | event | clear | onClear | 317 |
| Select Events | event | blur | onBlur | 318 |
| Select Events | event | focus | onFocus | 319 |
| Select Events | event | popup-scroll | onPopupScroll | 320 |
| Select Events | event | end-reached | onEndReached | 321 |
| Select Slots | slot | default | children | 327 |
| Select Slots | slot | header | renderHeader | 328 |
| Select Slots | slot | footer | renderFooter | 329 |
| Select Slots | slot | prefix | renderPrefix | 330 |
| Select Slots | slot | empty | renderEmpty | 331 |
| Select Slots | slot | tag | renderTag | 332 |
| Select Slots | slot | loading | renderLoading | 333 |
| Select Slots | slot | label | renderLabel | 334 |
| Select Exposes | ref | focus | ref.current.focus | 340 |
| Select Exposes | ref | blur | ref.current.blur | 341 |
| Select Exposes | ref | selectedLabel | ref.current.selectedLabel | 342 |
| Option Group Attributes | prop | label | label | 350 |
| Option Group Attributes | prop | disabled | disabled | 351 |
| Option Group Slots | slot | default | children | 357 |
| Option Attributes | prop | value | value | 365 |
| Option Attributes | prop | label | label | 366 |
| Option Attributes | prop | disabled | disabled | 367 |
| Option Slots | slot | default | children | 373 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| select:206 | Select Attributes | model-value / v-model | binding value | ^[string] / ^[number] / ^[boolean] / ^[object] / ^[array] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| select:207 | Select Attributes | multiple | whether multiple-select is activated | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:208 | Select Attributes | options | data of the options, the key of `value` and `label` and `disabled` can be customize by `props` | ^[array]`Array<{[key: string]: any}>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:209 | Select Attributes | [props](#props) | configuration options | ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:210 | Select Attributes | disabled | whether Select is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:211 | Select Attributes | value-key | unique identity key name for value, required when value is an object | ^[string] | value | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:212 | Select Attributes | size | size of Input | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:213 | Select Attributes | clearable | whether select can be cleared | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:214 | Select Attributes | collapse-tags | whether to collapse tags to a text when multiple selecting | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:215 | Select Attributes | collapse-tags-tooltip | whether show all selected tags when mouse hover text of collapse-tags. To use this, `collapse-tags` must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:216 | Select Attributes | [tag-tooltip](#tag-tooltip) | configuration object for the collapse-tags tooltip. To use this, `collapse-tags` and `collapse-tags-tooltip` must be true | ^[object]`TagTooltipProps` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:217 | Select Attributes | multiple-limit | maximum number of options user can select when `multiple` is `true`. No limit when set to 0 | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:218 | Select Attributes | id | native input id input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:219 | Select Attributes | name | the name attribute of select input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:220 | Select Attributes | effect | tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:221 | Select Attributes | autocomplete | the autocomplete attribute of select input | ^[string] | off | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:222 | Select Attributes | placeholder | placeholder, default is 'Select' | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:223 | Select Attributes | filterable | whether Select is filterable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:224 | Select Attributes | allow-create | whether creating new items is allowed. To use this, `filterable` must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:225 | Select Attributes | filter-method | custom filter method, the first parameter is the current input value. To use this, `filterable` must be true | ^[Function]`(query: string) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:226 | Select Attributes | remote | whether options are loaded from server | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:227 | Select Attributes | debounce | debounce delay during remote search, in milliseconds | ^[number] | 300 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:228 | Select Attributes | remote-method | function that gets called when the input value changes. Its parameter is the current input value. To use this, `filterable` must be true | ^[Function]`(query: string) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:229 | Select Attributes | remote-show-suffix | in remote search method show suffix icon | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:230 | Select Attributes | loading | whether Select is loading data from server | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:231 | Select Attributes | loading-text | displayed text while loading data from server, default is 'Loading' | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:232 | Select Attributes | no-match-text | displayed text when no data matches the filtering query, you can also use slot `empty`, default is 'No matching data' | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:233 | Select Attributes | no-data-text | displayed text when there is no options, you can also use slot `empty`, default is 'No data' | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:234 | Select Attributes | popper-class | custom class name for Select's dropdown and tags' tooltip | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:235 | Select Attributes | popper-style | custom style for Select's dropdown and tags' tooltip | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:236 | Select Attributes | reserve-keyword | when `multiple` and `filterable` is true, whether to reserve current keyword after selecting an option | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:237 | Select Attributes | default-first-option | select first matching option on enter key. Use with `filterable` or `remote` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:238 | Select Attributes | teleported | whether select dropdown is teleported, if `true` it will be teleported to where `append-to` sets | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:239 | Select Attributes | append-to | which element the select dropdown appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:240 | Select Attributes | persistent | when select dropdown is inactive and `persistent` is `false`, select dropdown will be destroyed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:241 | Select Attributes | automatic-dropdown | for non-filterable Select, this prop decides if the option menu pops up when the input is focused | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:242 | Select Attributes | clear-icon | custom clear icon component | ^[string] / ^[object]`Component` | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:243 | Select Attributes | fit-input-width | whether the width of the dropdown is the same as the input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:244 | Select Attributes | suffix-icon | custom suffix icon component | ^[string] / ^[object]`Component` | ArrowDown | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:245 | Select Attributes | tag-type | tag type | ^[enum]`'' \| 'success' \| 'info' \| 'warning' \| 'danger'` | info | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:246 | Select Attributes | tag-effect | tag effect | ^[enum]`'' \| 'light' \| 'dark' \| 'plain'` | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:247 | Select Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:248 | Select Attributes | offset | offset of the dropdown | ^[number] | 12 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:249 | Select Attributes | show-arrow | whether the dropdown has an arrow | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:250 | Select Attributes | placement | position of dropdown | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom-start | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:251 | Select Attributes | fallback-placements | list of possible positions for dropdown [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom-start', 'top-start', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:252 | Select Attributes | max-collapse-tags | the max tags number to be shown. To use this, `collapse-tags` must be true | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:253 | Select Attributes | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object]refer to [popper.js](https://popper.js.org/docs/v2/) doc | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:254 | Select Attributes | aria-label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:255 | Select Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:256 | Select Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:257 | Select Attributes | suffix-transition | animation when dropdown appears/disappears icon | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:258 | Select Attributes | tabindex | tabindex for input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:270 | props | value | specify which key of node object is used as the node's value | ^[string] | value | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:271 | props | label | specify which key of node object is used as the node's label | ^[string] | label | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:272 | props | options | specify which key of node object is used as the node's children | ^[string] | options | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:273 | props | disabled | specify which key of node object is used as the node's disabled | ^[string] | disabled | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:296 | tag-tooltip ^(2.13.3) | append-to | which element the tooltip CONTENT appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:297 | tag-tooltip ^(2.13.3) | placement | position of Tooltip | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:298 | tag-tooltip ^(2.13.3) | fallback-placements | list of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:299 | tag-tooltip ^(2.13.3) | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:300 | tag-tooltip ^(2.13.3) | popper-class | custom class name for Tooltip's popper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:301 | tag-tooltip ^(2.13.3) | popper-style | custom style for Tooltip's popper | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:302 | tag-tooltip ^(2.13.3) | transition | animation name | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:303 | tag-tooltip ^(2.13.3) | teleported | whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:304 | tag-tooltip ^(2.13.3) | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object]refer to [popper.js](https://popper.js.org/docs/v2/) doc | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:305 | tag-tooltip ^(2.13.3) | show-after | delay of appearance, in millisecond | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:306 | tag-tooltip ^(2.13.3) | hide-after | delay of disappear, in millisecond | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:307 | tag-tooltip ^(2.13.3) | auto-close | timeout in milliseconds to hide tooltip | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:308 | tag-tooltip ^(2.13.3) | offset | offset of the Tooltip | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:314 | Select Events | change | triggers when the selected value changes | ^[Function]`(value: any) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:315 | Select Events | visible-change | triggers when the dropdown appears/disappears | ^[Function]`(visible: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:316 | Select Events | remove-tag | triggers when a tag is removed in multiple mode | ^[Function]`(tagValue: any) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:317 | Select Events | clear | triggers when the clear icon is clicked in a clearable Select | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:318 | Select Events | blur | triggers when Input blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:319 | Select Events | focus | triggers when Input focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:320 | Select Events | popup-scroll | triggers when dropdown scrolls | ^[Function]`(data:{scrollTop: number, scrollLeft: number}) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:321 | Select Events | end-reached | triggers when dropdown scroll reaches an end | ^[Function]`(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select:327 | Select Slots | default | option component list | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:328 | Select Slots | header | content at the top of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:329 | Select Slots | footer | content at the bottom of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:330 | Select Slots | prefix | content as Select prefix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:331 | Select Slots | empty | content when there is no options | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:332 | Select Slots | tag | content as Select tag, subTags `data`, `selectDisabled` and `deleteTag` introduced in ^(2.10.3) | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:333 | Select Slots | loading | content as Select loading | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:334 | Select Slots | label | content as Select label. `index` introduced in ^(2.11.2) | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:340 | Select Exposes | focus | focus the Input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| select:341 | Select Exposes | blur | blur the Input component, and hide the dropdown | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| select:342 | Select Exposes | selectedLabel | get the currently selected label | ^[object]`ComputedRef<string \| string[]>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| select:350 | Option Group Attributes | label | name of the group | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:351 | Option Group Attributes | disabled | whether to disable all options in this group | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:357 | Option Group Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select:365 | Option Attributes | value | value of option | ^[string] / ^[number] / ^[boolean] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:366 | Option Attributes | label | label of option, same as `value` if omitted | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:367 | Option Attributes | disabled | whether option is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select:373 | Option Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/option](../source-components/option.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/option-group](../source-components/option-group.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/select](../../reference/element-plus/packages/components/select/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/select/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/options.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/disabled-option.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/clearable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/size.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/multiple.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/custom-template.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/custom-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/custom-footer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/grouping.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/filterable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/remote-search.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/allow-create.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/value-key.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/custom-tag.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/custom-loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/empty-values.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select/custom-label.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
