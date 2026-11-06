# Cascader 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/cascader.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 单选/多选、严格选择、路径值。
- hover/click 展开。
- 可搜索、懒加载、禁用节点。
- 标签折叠、清空、面包路径。
- CascaderPanel 和节点渲染。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled option（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Clearable（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Clear Icon ^(2.11.0)（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Display only the last level（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Multiple Selection（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Select any level of options（原文第91行）：建立React示例与对应行为/视觉断言。
- [ ] Dynamic loading（原文第101行）：建立React示例与对应行为/视觉断言。
- [ ] Filterable（原文第111行）：建立React示例与对应行为/视觉断言。
- [ ] Custom option content（原文第121行）：建立React示例与对应行为/视觉断言。
- [ ] Custom suggestion item ^(2.9.5)（原文第131行）：建立React示例与对应行为/视觉断言。
- [ ] Cascader panel（原文第141行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Tag ^(2.10.3)（原文第151行）：建立React示例与对应行为/视觉断言。
- [ ] Show Checked Strategy ^(2.10.5)（原文第161行）：建立React示例与对应行为/视觉断言。
- [ ] Click to Check Node ^(2.10.5)（原文第171行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Header & Footer ^(2.10.5)（原文第186行）：建立React示例与对应行为/视觉断言。
- [ ] Virtual Scroll ^(2.14.0)（原文第196行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Suggestion Width ^(2.14.0)（原文第206行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Cascader，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Cascader Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 228 |
| Cascader Attributes | prop | options | options | 229 |
| Cascader Attributes | prop | [props](#cascaderprops) | [props](#cascaderprops) | 230 |
| Cascader Attributes | prop | size | size | 231 |
| Cascader Attributes | prop | placeholder | placeholder | 232 |
| Cascader Attributes | prop | disabled | disabled | 233 |
| Cascader Attributes | prop | clearable | clearable | 234 |
| Cascader Attributes | prop | clear-icon | clearIcon | 235 |
| Cascader Attributes | prop | show-all-levels | showAllLevels | 236 |
| Cascader Attributes | prop | collapse-tags | collapseTags | 237 |
| Cascader Attributes | prop | collapse-tags-tooltip | collapseTagsTooltip | 238 |
| Cascader Attributes | prop | max-collapse-tags-tooltip-height | maxCollapseTagsTooltipHeight | 239 |
| Cascader Attributes | prop | separator | separator | 240 |
| Cascader Attributes | prop | filterable | filterable | 241 |
| Cascader Attributes | prop | filter-method | filterMethod | 242 |
| Cascader Attributes | prop | debounce | debounce | 243 |
| Cascader Attributes | prop | before-filter | beforeFilter | 244 |
| Cascader Attributes | prop | popper-class | popperClass | 245 |
| Cascader Attributes | prop | popper-style | popperStyle | 246 |
| Cascader Attributes | prop | teleported | teleported | 247 |
| Cascader Attributes | prop | effect | effect | 248 |
| Cascader Attributes | prop | tag-type | tagType | 249 |
| Cascader Attributes | prop | tag-effect | tagEffect | 250 |
| Cascader Attributes | prop | validate-event | validateEvent | 251 |
| Cascader Attributes | prop | max-collapse-tags | maxCollapseTags | 252 |
| Cascader Attributes | prop | empty-values | emptyValues | 253 |
| Cascader Attributes | prop | value-on-clear | valueOnClear | 254 |
| Cascader Attributes | prop | persistent | persistent | 255 |
| Cascader Attributes | prop | fallback-placements | fallbackPlacements | 256 |
| Cascader Attributes | prop | placement | placement | 257 |
| Cascader Attributes | prop | popper-append-to-body | popperAppendToBody | 258 |
| Cascader Attributes | prop | show-checked-strategy | showCheckedStrategy | 259 |
| Cascader Attributes | prop | virtual-scroll | virtualScroll | 260 |
| Cascader Attributes | prop | fit-input-width | fitInputWidth | 261 |
| Cascader Attributes | prop | item-size | itemSize | 262 |
| Cascader Attributes | prop | height | height | 263 |
| Cascader Events | event | change | onChange | 269 |
| Cascader Events | event | expand-change | onExpandChange | 270 |
| Cascader Events | event | blur | onBlur | 271 |
| Cascader Events | event | focus | onFocus | 272 |
| Cascader Events | event | clear | onClear | 273 |
| Cascader Events | event | visible-change | onVisibleChange | 274 |
| Cascader Events | event | remove-tag | onRemoveTag | 275 |
| Cascader Slots | slot | default | children | 281 |
| Cascader Slots | slot | empty | renderEmpty | 282 |
| Cascader Slots | slot | prefix | renderPrefix | 283 |
| Cascader Slots | slot | suggestion-item | renderSuggestionItem | 284 |
| Cascader Slots | slot | tag | renderTag | 285 |
| Cascader Slots | slot | header | renderHeader | 286 |
| Cascader Slots | slot | footer | renderFooter | 287 |
| Cascader Exposes | ref | getCheckedNodes | ref.current.getCheckedNodes | 293 |
| Cascader Exposes | ref | cascaderPanelRef | ref.current.cascaderPanelRef | 294 |
| Cascader Exposes | ref | togglePopperVisible | ref.current.togglePopperVisible | 295 |
| Cascader Exposes | ref | contentRef | ref.current.contentRef | 296 |
| Cascader Exposes | ref | presentText | ref.current.presentText | 297 |
| Cascader Exposes | ref | focus | ref.current.focus | 298 |
| Cascader Exposes | ref | blur | ref.current.blur | 299 |
| CascaderPanel Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 307 |
| CascaderPanel Attributes | prop | options | options | 308 |
| CascaderPanel Attributes | prop | [props](#cascaderprops) | [props](#cascaderprops) | 309 |
| CascaderPanel Attributes | prop | virtual-scroll | virtualScroll | 310 |
| CascaderPanel Attributes | prop | item-size | itemSize | 311 |
| CascaderPanel Attributes | prop | height | height | 312 |
| CascaderPanel Events | event | change | onChange | 318 |
| CascaderPanel Events | event | update:modelValue | onModelValueChange | 319 |
| CascaderPanel Events | event | expand-change | onExpandChange | 320 |
| CascaderPanel Events | event | close | onClose | 321 |
| CascaderPanel Slots | slot | default | children | 327 |
| CascaderPanel Slots | slot | empty | renderEmpty | 328 |
| CascaderPanel Exposes | ref | getCheckedNodes | ref.current.getCheckedNodes | 334 |
| CascaderPanel Exposes | ref | clearCheckedNodes | ref.current.clearCheckedNodes | 335 |
| CascaderProps | prop | expandTrigger | expandTrigger | 341 |
| CascaderProps | prop | multiple | multiple | 342 |
| CascaderProps | prop | checkStrictly | checkStrictly | 343 |
| CascaderProps | prop | emitPath | emitPath | 344 |
| CascaderProps | prop | lazy | lazy | 345 |
| CascaderProps | prop | lazyLoad | lazyLoad | 346 |
| CascaderProps | prop | value | value | 347 |
| CascaderProps | prop | label | label | 348 |
| CascaderProps | prop | children | children | 349 |
| CascaderProps | prop | disabled | disabled | 350 |
| CascaderProps | prop | leaf | leaf | 351 |
| CascaderProps | prop | hoverThreshold | hoverThreshold | 352 |
| CascaderProps | prop | checkOnClickNode | checkOnClickNode | 353 |
| CascaderProps | prop | checkOnClickLeaf | checkOnClickLeaf | 354 |
| CascaderProps | prop | showPrefix | showPrefix | 355 |
| Type Declarations | reference | CascaderNodePathValue | CascaderNodePathValue | 367 |
| Type Declarations | reference | (CascaderNodeValue | (CascaderNodeValue | 368 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| cascader:228 | Cascader Attributes | model-value / v-model | binding value | ^[string] / ^[number] /^[array]`string[] \| number[] \| any` | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| cascader:229 | Cascader Attributes | options | data of the options, the key of `value` and `label` can be customize by `CascaderProps`. | ^[array]`CascaderOption[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:230 | Cascader Attributes | [props](#cascaderprops) | configuration options, see the following `CascaderProps` table. | ^[object]`CascaderProps` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:231 | Cascader Attributes | size | size of input | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:232 | Cascader Attributes | placeholder | placeholder of input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:233 | Cascader Attributes | disabled | whether Cascader is disabled | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:234 | Cascader Attributes | clearable | whether selected value can be cleared | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:235 | Cascader Attributes | clear-icon | custom clear icon component | ^[string] / ^[object]`Component` | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:236 | Cascader Attributes | show-all-levels | whether to display all levels of the selected value in the input | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:237 | Cascader Attributes | collapse-tags | whether to collapse tags in multiple selection mode | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:238 | Cascader Attributes | collapse-tags-tooltip | whether show all selected tags when mouse hover text of collapse-tags. To use this, `collapse-tags` must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:239 | Cascader Attributes | max-collapse-tags-tooltip-height | max height of collapse-tags tooltip. | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:240 | Cascader Attributes | separator | option label separator | ^[string] | ' / ' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:241 | Cascader Attributes | filterable | whether the options can be searched | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:242 | Cascader Attributes | filter-method | customize search logic, the first parameter is `node`, the second is `keyword`, and need return a boolean value indicating whether it hits. | ^[Function]`(node: CascaderNode, keyword: string) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:243 | Cascader Attributes | debounce | debounce delay when typing filter keyword, in milliseconds | ^[number] | 300 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:244 | Cascader Attributes | before-filter | hook function before filtering with the value to be filtered as its parameter. If `false` is returned or a `Promise` is returned and then is rejected, filtering will be aborted | ^[Function]`(value: string) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:245 | Cascader Attributes | popper-class | custom class name for Cascader's dropdown and tags' tooltip | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:246 | Cascader Attributes | popper-style | custom style for Cascader's dropdown and tags' tooltip | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:247 | Cascader Attributes | teleported | whether cascader popup is teleported | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:248 | Cascader Attributes | effect | tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:249 | Cascader Attributes | tag-type | tag type | ^[enum]`'success' \| 'info' \| 'warning' \| 'danger'` | info | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:250 | Cascader Attributes | tag-effect | tag effect | ^[enum]`'light' \| 'dark' \| 'plain'` | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:251 | Cascader Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:252 | Cascader Attributes | max-collapse-tags | The max tags number to be shown. To use this, `collapse-tags` must be true | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:253 | Cascader Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:254 | Cascader Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:255 | Cascader Attributes | persistent | when dropdown is inactive and `persistent` is `false`, dropdown will be destroyed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:256 | Cascader Attributes | fallback-placements | list of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:257 | Cascader Attributes | placement | position of dropdown | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom-start | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:258 | Cascader Attributes | popper-append-to-body | whether to append the popper menu to body. If the positioning of the popper is wrong, you can try to set this prop to false | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:259 | Cascader Attributes | show-checked-strategy | strategy for displaying checked nodes in multiple selection mode. Use `parent` when you want things tidy. Use `child` when every single item matters | ^[enum]`'parent' \| 'child'` | child | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:260 | Cascader Attributes | virtual-scroll | whether to enable virtual scrolling for large data | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:261 | Cascader Attributes | fit-input-width | whether the width of the suggestion panel is the same as the input, if the value is `number`, then the width is fixed | ^[boolean] / ^[number] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:262 | Cascader Attributes | item-size | node height for virtual scrolling (px) | ^[number] | 34 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:263 | Cascader Attributes | height | menu height for virtual scrolling (px) | ^[number] | 204 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:269 | Cascader Events | change | triggers when the binding value changes | ^[Function]`(value: CascaderValue) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:270 | Cascader Events | expand-change | triggers when expand option changes | ^[Function]`(value: CascaderValue) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:271 | Cascader Events | blur | triggers when Cascader blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:272 | Cascader Events | focus | triggers when Cascader focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:273 | Cascader Events | clear | triggers when the clear icon is clicked in a clearable Select | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:274 | Cascader Events | visible-change | triggers when the dropdown appears/disappears | ^[Function]`(value: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:275 | Cascader Events | remove-tag | triggers when remove tag in multiple selection mode | ^[Function]`(value: CascaderNode['valueByOption']) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:281 | Cascader Slots | default | the custom content of cascader node, which are current Node object and node data respectively. | ^[object]`{ node: any, data: any }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:282 | Cascader Slots | empty | content when there is no matched options. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:283 | Cascader Slots | prefix | content as Input prefix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:284 | Cascader Slots | suggestion-item | custom content for suggestion item when searching | ^[object]`{ item: CascaderNode }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:285 | Cascader Slots | tag | custom tags style | ^[object]`{ data: Tag[], deleteTag: (tag: Tag) => void }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:286 | Cascader Slots | header | content at the top of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:287 | Cascader Slots | footer | content at the bottom of the dropdown | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:293 | Cascader Exposes | getCheckedNodes | get an array of currently selected node,(leafOnly) whether only return the leaf checked nodes, default is `false` | ^[Function]`(leafOnly: boolean) => CascaderNode[] \| undefined` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:294 | Cascader Exposes | cascaderPanelRef | cascader panel ref | ^[object]`ComputedRef<any>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:295 | Cascader Exposes | togglePopperVisible | toggle the visible type of popper | ^[Function]`(visible?: boolean) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:296 | Cascader Exposes | contentRef | cascader content ref | ^[object]`ComputedRef<any>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:297 | Cascader Exposes | presentText | selected content text | ^[object]`ComputedRef<string>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:298 | Cascader Exposes | focus | focus the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:299 | Cascader Exposes | blur | blur the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:307 | CascaderPanel Attributes | model-value / v-model | binding value | ^[string]/^[number]/^[array]`string[] \| number[] \| any` | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| cascader:308 | CascaderPanel Attributes | options | data of the options, the key of `value` and `label` can be customize by `CascaderProps`. | ^[array]`CascaderOption[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:309 | CascaderPanel Attributes | [props](#cascaderprops) | configuration options, see the following `CascaderProps` table. | ^[object]`CascaderProps` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:310 | CascaderPanel Attributes | virtual-scroll | whether to enable virtual scrolling for large data | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:311 | CascaderPanel Attributes | item-size | node height for virtual scrolling (px) | ^[number] | 34 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:312 | CascaderPanel Attributes | height | menu height for virtual scrolling (px) | ^[number] | 204 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:318 | CascaderPanel Events | change | triggers when the binding value changes | ^[Function]`(value: CascaderValue \| undefined) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:319 | CascaderPanel Events | update:modelValue | triggers when the binding value changes | ^[Function]`(value: CascaderValue \| undefined) => void` | — | 对应具名模型请求更新，与语义事件冲突须独立裁决。 |
| cascader:320 | CascaderPanel Events | expand-change | triggers when expand option changes | ^[Function]`(value: CascaderNodePathValue) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:321 | CascaderPanel Events | close | close panel event, provided to Cascader to put away the panel judgment. | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| cascader:327 | CascaderPanel Slots | default | the custom content of cascader node, which are current Node object and node data respectively. | ^[object]`{ node: any, data: any }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:328 | CascaderPanel Slots | empty | the content of the panel when there is no data. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| cascader:334 | CascaderPanel Exposes | getCheckedNodes | get an array of currently selected node,(leafOnly) whether only return the leaf checked nodes, default is `false` | ^[Function]`(leafOnly: boolean) => CascaderNode[] \| undefined` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:335 | CascaderPanel Exposes | clearCheckedNodes | clear checked nodes | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| cascader:341 | CascaderProps | expandTrigger | trigger mode of expanding options | ^[enum]`'click' \| 'hover'` | click | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:342 | CascaderProps | multiple | whether multiple selection is enabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:343 | CascaderProps | checkStrictly | whether checked state of a node not affects its parent and child nodes | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:344 | CascaderProps | emitPath | when checked nodes change, whether to emit an array of node's path, if false, only emit the value of node. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:345 | CascaderProps | lazy | whether to dynamic load child nodes, use with `lazyload` attribute | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:346 | CascaderProps | lazyLoad | method for loading child nodes data, only works when `lazy` is true. The reject parameter is supported after version ^(2.11.5). | ^[Function]`(node: Node, resolve: Resolve, reject: () => void) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:347 | CascaderProps | value | specify which key of node object is used as the node's value | ^[string] | value | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:348 | CascaderProps | label | specify which key of node object is used as the node's label | ^[string] | label | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:349 | CascaderProps | children | specify which key of node object is used as the node's children | ^[string] | children | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:350 | CascaderProps | disabled | specify which key of node object is used as the node's disabled | ^[string] | disabled | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:351 | CascaderProps | leaf | specify which key of node object is used as the node's leaf field | ^[string] | leaf | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:352 | CascaderProps | hoverThreshold | hover threshold of expanding options | ^[number] | 500 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:353 | CascaderProps | checkOnClickNode | whether to check or uncheck node when clicking on the node | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:354 | CascaderProps | checkOnClickLeaf | whether to check or uncheck node when clicking on leaf node (last children). | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:355 | CascaderProps | showPrefix | whether to show the radio or checkbox prefix | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:367 | Type Declarations | CascaderNodePathValue | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| cascader:368 | Type Declarations | (CascaderNodeValue | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/cascader](../../reference/element-plus/packages/components/cascader/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/cascader-panel](../../reference/element-plus/packages/components/cascader-panel/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/cascader/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/option-disabling.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/clearable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/clear-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/last-level.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/multiple-selection.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/any-level.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/dynamic-loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/filterable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/custom-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/custom-suggestion-item.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/panel.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/custom-tag.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/show-checked-strategy.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/check-on-click-node.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/custom-header-footer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/virtual-scroll.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/cascader/fit-input-width.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
