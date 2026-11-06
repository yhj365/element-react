# SelectV2 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/select-v2.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 虚拟选项列表。
- 单选/多选、过滤/远程、创建、分组、禁用。
- 标签折叠、清空、回显和自定义选项。
- 滚动定位与普通Select边界分开验收。

## 2. 源文档场景清单

- [ ] Background（原文第14行）：建立React示例与对应行为/视觉断言。
- [ ] Basic usage（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Multi select（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Hide extra tags when the selected items are too many（原文第48行）：建立React示例与对应行为/视觉断言。
- [ ] Filterable multi-select（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled selector and select options（原文第68行）：建立React示例与对应行为/视觉断言。
- [ ] Option Grouping（原文第78行）：建立React示例与对应行为/视觉断言。
- [ ] Clearable selector（原文第88行）：建立React示例与对应行为/视觉断言。
- [ ] Customized option renderer（原文第98行）：建立React示例与对应行为/视觉断言。
- [ ] Header of the dropdown ^(2.5.2)（原文第108行）：建立React示例与对应行为/视觉断言。
- [ ] Footer of the dropdown ^(2.5.2)（原文第118行）：建立React示例与对应行为/视觉断言。
- [ ] Create Option（原文第128行）：建立React示例与对应行为/视觉断言。
- [ ] Remote search（原文第146行）：建立React示例与对应行为/视觉断言。
- [ ] Use value-key attribute（原文第156行）：建立React示例与对应行为/视觉断言。
- [ ] Aliases for custom options ^(2.4.2)（原文第172行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Tag ^(2.5.0)（原文第182行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Loading ^(2.5.2)（原文第192行）：建立React示例与对应行为/视觉断言。
- [ ] Empty Values ^(2.7.0)（原文第202行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Label ^(2.7.4)（原文第214行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Width ^(2.9.2)（原文第224行）：建立React示例与对应行为/视觉断言。
- [ ] tag-tooltip ^(2.13.3)（原文第307行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

选中值与过滤结果不绑定节点挂载；虚拟滚动用稳定项键与尺寸缓存。键盘高亮项滚动入可视区后更新aria-activedescendant；卸载选项不能使已选标签丢失。过滤、分组、远程和自定义渲染分别按原API范围验收。

## 3. React 19 结构与交互契约

- 主导出拟为 SelectV2，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 240 |
| Attributes | prop | options | options | 241 |
| Attributes | prop | [props](#props) | [props](#props) | 242 |
| Attributes | prop | multiple | multiple | 243 |
| Attributes | prop | disabled | disabled | 244 |
| Attributes | prop | value-key | valueKey | 245 |
| Attributes | prop | size | size | 246 |
| Attributes | prop | clearable | clearable | 247 |
| Attributes | prop | clear-icon | clearIcon | 248 |
| Attributes | prop | collapse-tags | collapseTags | 249 |
| Attributes | prop | multiple-limit | multipleLimit | 250 |
| Attributes | prop | id | id | 251 |
| Attributes | prop | name | name | 252 |
| Attributes | prop | effect | effect | 253 |
| Attributes | prop | autocomplete | autocomplete | 254 |
| Attributes | prop | placeholder | placeholder | 255 |
| Attributes | prop | filterable | filterable | 256 |
| Attributes | prop | allow-create | allowCreate | 257 |
| Attributes | prop | filter-method | filterMethod | 258 |
| Attributes | prop | loading | loading | 259 |
| Attributes | prop | loading-text | loadingText | 260 |
| Attributes | prop | reserve-keyword | reserveKeyword | 261 |
| Attributes | prop | default-first-option | defaultFirstOption | 262 |
| Attributes | prop | no-match-text | noMatchText | 263 |
| Attributes | prop | no-data-text | noDataText | 264 |
| Attributes | prop | popper-class | popperClass | 265 |
| Attributes | prop | popper-style | popperStyle | 266 |
| Attributes | prop | teleported | teleported | 267 |
| Attributes | prop | append-to | appendTo | 268 |
| Attributes | prop | persistent | persistent | 269 |
| Attributes | prop | popper-options | popperOptions | 270 |
| Attributes | prop | automatic-dropdown | automaticDropdown | 271 |
| Attributes | prop | fit-input-width | fitInputWidth | 272 |
| Attributes | prop | suffix-icon | suffixIcon | 273 |
| Attributes | prop | height | height | 274 |
| Attributes | prop | item-height | itemHeight | 275 |
| Attributes | prop | estimated-option-height | estimatedOptionHeight | 276 |
| Attributes | prop | scrollbar-always-on | scrollbarAlwaysOn | 277 |
| Attributes | prop | remote | remote | 278 |
| Attributes | prop | debounce | debounce | 279 |
| Attributes | prop | remote-method | remoteMethod | 280 |
| Attributes | prop | remote-show-suffix | remoteShowSuffix | 281 |
| Attributes | prop | validate-event | validateEvent | 282 |
| Attributes | prop | offset | offset | 283 |
| Attributes | prop | show-arrow | showArrow | 284 |
| Attributes | prop | placement | placement | 285 |
| Attributes | prop | fallback-placements | fallbackPlacements | 286 |
| Attributes | prop | collapse-tags-tooltip | collapseTagsTooltip | 287 |
| Attributes | prop | [tag-tooltip](#tag-tooltip) | [tagTooltip](#tagTooltip) | 288 |
| Attributes | prop | max-collapse-tags | maxCollapseTags | 289 |
| Attributes | prop | tag-type | tagType | 290 |
| Attributes | prop | tag-effect | tagEffect | 291 |
| Attributes | prop | aria-label | ariaLabel | 292 |
| Attributes | prop | empty-values | emptyValues | 293 |
| Attributes | prop | value-on-clear | valueOnClear | 294 |
| Attributes | prop | popper-append-to-body | popperAppendToBody | 295 |
| Attributes | prop | tabindex | tabindex | 296 |
| props | prop | value | value | 302 |
| props | prop | label | label | 303 |
| props | prop | options | options | 304 |
| props | prop | disabled | disabled | 305 |
| tag-tooltip ^(2.13.3) | reference | append-to | appendTo | 328 |
| tag-tooltip ^(2.13.3) | reference | placement | placement | 329 |
| tag-tooltip ^(2.13.3) | reference | fallback-placements | fallbackPlacements | 330 |
| tag-tooltip ^(2.13.3) | reference | effect | effect | 331 |
| tag-tooltip ^(2.13.3) | reference | popper-class | popperClass | 332 |
| tag-tooltip ^(2.13.3) | reference | popper-style | popperStyle | 333 |
| tag-tooltip ^(2.13.3) | reference | transition | transition | 334 |
| tag-tooltip ^(2.13.3) | reference | teleported | teleported | 335 |
| tag-tooltip ^(2.13.3) | reference | popper-options | popperOptions | 336 |
| tag-tooltip ^(2.13.3) | reference | show-after | showAfter | 337 |
| tag-tooltip ^(2.13.3) | reference | hide-after | hideAfter | 338 |
| tag-tooltip ^(2.13.3) | reference | auto-close | autoClose | 339 |
| tag-tooltip ^(2.13.3) | reference | offset | offset | 340 |
| Events | event | change | onChange | 346 |
| Events | event | visible-change | onVisibleChange | 347 |
| Events | event | remove-tag | onRemoveTag | 348 |
| Events | event | clear | onClear | 349 |
| Events | event | blur | onBlur | 350 |
| Events | event | focus | onFocus | 351 |
| Events | event | end-reached | onEndReached | 352 |
| Slots | slot | default | children | 358 |
| Slots | slot | header | renderHeader | 359 |
| Slots | slot | footer | renderFooter | 360 |
| Slots | slot | empty | renderEmpty | 361 |
| Slots | slot | prefix | renderPrefix | 362 |
| Slots | slot | tag | renderTag | 363 |
| Slots | slot | loading | renderLoading | 364 |
| Slots | slot | label | renderLabel | 365 |
| Exposes | ref | focus | ref.current.focus | 371 |
| Exposes | ref | blur | ref.current.blur | 372 |
| Exposes | ref | selectedLabel | ref.current.selectedLabel | 373 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| select-v2:240 | Attributes | model-value / v-model | binding value | ^[string] / ^[number] / ^[boolean] / ^[object] / ^[array] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| select-v2:241 | Attributes | options | data of the options, the key of `value` and `label` can be customize by `props` | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:242 | Attributes | [props](#props) | configuration options, see the following table | ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:243 | Attributes | multiple | is multiple | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:244 | Attributes | disabled | is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:245 | Attributes | value-key | unique identity key name for value, required when value is an object | ^[string] | value | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:246 | Attributes | size | size of component | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:247 | Attributes | clearable | whether select can be cleared | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:248 | Attributes | clear-icon | custom clear icon | ^[string] / ^[object]`Component` | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:249 | Attributes | collapse-tags | whether to collapse tags to a text when multiple selecting | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:250 | Attributes | multiple-limit | maximum number of options user can select when multiple is true. No limit when set to 0 | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:251 | Attributes | id | native input id input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:252 | Attributes | name | the name attribute of select input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:253 | Attributes | effect | tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:254 | Attributes | autocomplete | autocomplete of select input | ^[string] | off | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:255 | Attributes | placeholder | placeholder | ^[string] | Please select | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:256 | Attributes | filterable | whether Select is filterable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:257 | Attributes | allow-create | whether creating new items is allowed. To use this, `filterable` must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:258 | Attributes | filter-method | custom filter method, the first parameter is the current input value. To use this, `filterable` must be true method | ^[Function]`(query: string) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:259 | Attributes | loading | whether Select is loading data from server | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:260 | Attributes | loading-text | displayed text while loading data from server, default is 'Loading' | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:261 | Attributes | reserve-keyword | whether reserve the keyword after select filtered option. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:262 | Attributes | default-first-option | select first matching option on enter key. Use with `filterable` or `remote` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:263 | Attributes | no-match-text | displayed text when no data matches the filtering query, you can also use slot `empty`, default is 'No matching data' | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:264 | Attributes | no-data-text | displayed text when there is no options, you can also use slot empty | ^[string] | No Data | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:265 | Attributes | popper-class | custom class name for Select's dropdown and tags' tooltip | ^[string] / ^[object] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:266 | Attributes | popper-style | custom style for Select's dropdown and tags' tooltip | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:267 | Attributes | teleported | whether select dropdown is teleported, if `true` it will be teleported to where `append-to` sets | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:268 | Attributes | append-to | which element the select dropdown appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:269 | Attributes | persistent | when select dropdown is inactive and `persistent` is `false`, select dropdown will be destroyed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:270 | Attributes | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object]refer to [popper.js](https://popper.js.org/docs/v2/) doc | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:271 | Attributes | automatic-dropdown | for non-filterable Select, this prop decides if the option menu pops up when the input is focused | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:272 | Attributes | fit-input-width | whether the width of the dropdown is the same as the input, if the value is `number`, then the width is fixed | ^[boolean] / ^[number] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:273 | Attributes | suffix-icon | custom suffix icon component | ^[string] / ^[object]`Component` | ArrowDown | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:274 | Attributes | height | The height of the dropdown panel, 34px for each item | ^[number] | 274 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:275 | Attributes | item-height | The height of the dropdown item | ^[number] | 34 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:276 | Attributes | estimated-option-height | Controls virtual-list sizing mode: if undefined, the list uses fixed item height from `item-height`; if provided, the list uses dynamic item sizing and this value as the estimated item height. | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:277 | Attributes | scrollbar-always-on | Controls whether the scrollbar is always displayed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:278 | Attributes | remote | whether search data from server | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:279 | Attributes | debounce | debounce delay during remote search, in milliseconds | ^[number] | 300 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:280 | Attributes | remote-method | function that gets called when the input value changes. Its parameter is the current input value. To use this, `filterable` must be true | ^[Function]`(query: string) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:281 | Attributes | remote-show-suffix | in remote search method show suffix icon | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:282 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:283 | Attributes | offset | offset of the dropdown | ^[number] | 12 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:284 | Attributes | show-arrow | whether the dropdown has an arrow | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:285 | Attributes | placement | position of dropdown | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom-start | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:286 | Attributes | fallback-placements | list of possible positions for dropdown [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom-start', 'top-start', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:287 | Attributes | collapse-tags-tooltip | whether show all selected tags when mouse hover text of collapse-tags. To use this, `collapse-tags` must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:288 | Attributes | [tag-tooltip](#tag-tooltip) | configuration object for the collapse-tags tooltip. To use this, `collapse-tags` and `collapse-tags-tooltip` must be true | ^[object]`TagTooltipProps` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:289 | Attributes | max-collapse-tags | The max tags number to be shown. To use this, `collapse-tags` must be true | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:290 | Attributes | tag-type | tag type | ^[enum]`'' \| 'success' \| 'info' \| 'warning' \| 'danger'` | info | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:291 | Attributes | tag-effect | tag effect | ^[enum]`'' \| 'light' \| 'dark' \| 'plain'` | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:292 | Attributes | aria-label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:293 | Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:294 | Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:295 | Attributes | popper-append-to-body | whether to append the popper menu to body. If the positioning of the popper is wrong, you can try to set this prop to false | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:296 | Attributes | tabindex | tabindex for input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:302 | props | value | specify which key of node object is used as the node's value | ^[string] | value | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:303 | props | label | specify which key of node object is used as the node's label | ^[string] | label | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:304 | props | options | specify which key of node object is used as the node's children | ^[string] | options | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:305 | props | disabled | specify which key of node object is used as the node's disabled | ^[string] | disabled | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:328 | tag-tooltip ^(2.13.3) | append-to | which element the tooltip CONTENT appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:329 | tag-tooltip ^(2.13.3) | placement | position of Tooltip | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:330 | tag-tooltip ^(2.13.3) | fallback-placements | list of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:331 | tag-tooltip ^(2.13.3) | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:332 | tag-tooltip ^(2.13.3) | popper-class | custom class name for Tooltip's popper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:333 | tag-tooltip ^(2.13.3) | popper-style | custom style for Tooltip's popper | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:334 | tag-tooltip ^(2.13.3) | transition | animation name | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:335 | tag-tooltip ^(2.13.3) | teleported | whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:336 | tag-tooltip ^(2.13.3) | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object]refer to [popper.js](https://popper.js.org/docs/v2/) doc | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:337 | tag-tooltip ^(2.13.3) | show-after | delay of appearance, in millisecond | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:338 | tag-tooltip ^(2.13.3) | hide-after | delay of disappear, in millisecond | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:339 | tag-tooltip ^(2.13.3) | auto-close | timeout in milliseconds to hide tooltip | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:340 | tag-tooltip ^(2.13.3) | offset | offset of the Tooltip | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| select-v2:346 | Events | change | triggers when the selected value changes, the param is current selected value | ^[Function]`(val: any) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:347 | Events | visible-change | triggers when the dropdown appears/disappears, the param will be true when it appears, and false otherwise | ^[Function]`(visible: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:348 | Events | remove-tag | triggers when a tag is removed in multiple mode, the param is removed tag value | ^[Function]`(tagValue: any) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:349 | Events | clear | triggers when the clear icon is clicked in a clearable Select | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:350 | Events | blur | triggers when Input blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:351 | Events | focus | triggers when Input focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:352 | Events | end-reached | triggers when dropdown scroll reaches an end | ^[Function]`(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| select-v2:358 | Slots | default | Option renderer | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:359 | Slots | header | content at the top of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:360 | Slots | footer | content at the bottom of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:361 | Slots | empty | content when options is empty | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:362 | Slots | prefix | prefix content of input | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:363 | Slots | tag | content as Select tag, subTags `data`, `selectDisabled` and `deleteTag` introduced in ^(2.10.3) | ^[object]`{ data: Option[], selectDisabled: boolean, deleteTag: (event: MouseEvent, option: Option) => void }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:364 | Slots | loading | content as Select loading | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:365 | Slots | label | content as Select label. `index` introduced in ^(2.11.2) | ^[object]`{ index: number, label: string \| any, value: string \| any }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| select-v2:371 | Exposes | focus | focus the Input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| select-v2:372 | Exposes | blur | blur the Input component, and hide the dropdown | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| select-v2:373 | Exposes | selectedLabel | get the currently selected label | ^[object]`ComputedRef<string \| string[]>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/select-v2](../../reference/element-plus/packages/components/select-v2/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/select-v2/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/multiple.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/size.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/hide-extra-tags.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/filterable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/grouping.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/clearable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/customized-option.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/custom-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/custom-footer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/allow-create.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/remote-search.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/use-valueKey.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/props.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/custom-tag.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/custom-loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/empty-values.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/custom-label.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/select-v2/custom-width.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
