# Autocomplete 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/autocomplete.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 同步/异步建议。
- 输入防抖、触发策略。
- 键盘高亮和选择。
- 自定义建议渲染、清空、远程结果过期保护。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Custom template（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Remote search（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Loading ^(2.5.0)（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Header & Footer ^(2.10.6)（原文第50行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Autocomplete，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 66 |
| Attributes | prop | placeholder | placeholder | 67 |
| Attributes | prop | clearable | clearable | 68 |
| Attributes | prop | disabled | disabled | 69 |
| Attributes | prop | value-key | valueKey | 70 |
| Attributes | prop | debounce | debounce | 71 |
| Attributes | prop | placement | placement | 72 |
| Attributes | prop | fetch-suggestions | fetchSuggestions | 73 |
| Attributes | prop | trigger-on-focus | triggerOnFocus | 74 |
| Attributes | prop | select-when-unmatched | selectWhenUnmatched | 75 |
| Attributes | prop | name | name | 76 |
| Attributes | prop | aria-label | ariaLabel | 77 |
| Attributes | prop | hide-loading | hideLoading | 78 |
| Attributes | prop | popper-class | popperClass | 79 |
| Attributes | prop | popper-style | popperStyle | 80 |
| Attributes | prop | popper-options | popperOptions | 81 |
| Attributes | prop | show-arrow | showArrow | 82 |
| Attributes | prop | teleported | teleported | 83 |
| Attributes | prop | append-to | appendTo | 84 |
| Attributes | prop | highlight-first-item | highlightFirstItem | 85 |
| Attributes | prop | fit-input-width | fitInputWidth | 86 |
| Attributes | prop | popper-append-to-body | popperAppendToBody | 87 |
| Attributes | prop | loop-navigation | loopNavigation | 88 |
| Attributes | prop | [input props](./input.md#attributes) | [input props](./input.md#attributes) | 89 |
| Events | event | blur | onBlur | 95 |
| Events | event | focus | onFocus | 96 |
| Events | event | input | onInput | 97 |
| Events | event | clear | onClear | 98 |
| Events | event | select | onSelect | 99 |
| Events | event | change | onChange | 100 |
| Slots | slot | default | children | 106 |
| Slots | slot | header | renderHeader | 107 |
| Slots | slot | footer | renderFooter | 108 |
| Slots | slot | prefix | renderPrefix | 109 |
| Slots | slot | suffix | renderSuffix | 110 |
| Slots | slot | prepend | renderPrepend | 111 |
| Slots | slot | append | renderAppend | 112 |
| Slots | slot | loading | renderLoading | 113 |
| Exposes | ref | activated | ref.current.activated | 119 |
| Exposes | ref | blur | ref.current.blur | 120 |
| Exposes | ref | close | ref.current.close | 121 |
| Exposes | ref | focus | ref.current.focus | 122 |
| Exposes | ref | handleSelect | ref.current.handleSelect | 123 |
| Exposes | ref | handleKeyEnter | ref.current.handleKeyEnter | 124 |
| Exposes | ref | highlightedIndex | ref.current.highlightedIndex | 125 |
| Exposes | ref | highlight | ref.current.highlight | 126 |
| Exposes | ref | inputRef | ref.current.inputRef | 127 |
| Exposes | ref | loading | ref.current.loading | 128 |
| Exposes | ref | popperRef | ref.current.popperRef | 129 |
| Exposes | ref | suggestions | ref.current.suggestions | 130 |
| Exposes | ref | getData | ref.current.getData | 131 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| autocomplete:66 | Attributes | model-value / v-model | binding value | ^[string] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| autocomplete:67 | Attributes | placeholder | the placeholder of Autocomplete | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:68 | Attributes | clearable | whether to show clear button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:69 | Attributes | disabled | whether Autocomplete is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:70 | Attributes | value-key | key name of the input suggestion object for display | ^[string] | value | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:71 | Attributes | debounce | debounce delay when typing, in milliseconds | ^[number] | 300 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:72 | Attributes | placement | placement of the popup menu | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | bottom-start | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:73 | Attributes | fetch-suggestions | a method to fetch input suggestions. When suggestions are ready, invoke `callback(data:[])` to return them to Autocomplete | ^[array] / ^[Function]`(queryString: string, callback: callbackfn) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:74 | Attributes | trigger-on-focus | whether show suggestions when input focus | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:75 | Attributes | select-when-unmatched | whether to emit a `select` event on enter when there is no autocomplete match | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:76 | Attributes | name | same as `name` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:77 | Attributes | aria-label | native `aria-label` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:78 | Attributes | hide-loading | whether to hide the loading icon in remote search | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:79 | Attributes | popper-class | custom class name for autocomplete's dropdown | ^[string] / ^[object] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:80 | Attributes | popper-style | custom style for autocomplete's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:81 | Attributes | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object]refer to [popper.js](https://popper.js.org/docs/v2/) doc | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:82 | Attributes | show-arrow | whether the dropdown has an arrow | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:83 | Attributes | teleported | whether select dropdown is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:84 | Attributes | append-to | which select dropdown appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:85 | Attributes | highlight-first-item | whether to highlight first item in remote search suggestions by default | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:86 | Attributes | fit-input-width | whether the width of the dropdown is the same as the input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:87 | Attributes | popper-append-to-body | whether to append the dropdown to body. If the positioning of the dropdown is wrong, you can try to set this prop to false | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:88 | Attributes | loop-navigation | whether keyboard navigation loops from end to start | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:89 | Attributes | [input props](./input.md#attributes) | — | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| autocomplete:95 | Events | blur | triggers when Input blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| autocomplete:96 | Events | focus | triggers when Input focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| autocomplete:97 | Events | input | triggers when the Input value change | ^[Function]`(value: string \| number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| autocomplete:98 | Events | clear | triggers when the Input is cleared by clicking the clear button | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| autocomplete:99 | Events | select | triggers when a suggestion is clicked | ^[Function]`(item: Record<string, any>) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| autocomplete:100 | Events | change | triggers when the icon inside Input value change | ^[Function]`(value: string \| number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| autocomplete:106 | Slots | default | custom content for input suggestions | ^[object]`{ item: Record<string, any> }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:107 | Slots | header | content at the top of the dropdown | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:108 | Slots | footer | content at the bottom of the dropdown | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:109 | Slots | prefix | content as Input prefix | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:110 | Slots | suffix | content as Input suffix | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:111 | Slots | prepend | content to prepend before Input | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:112 | Slots | append | content to append after Input | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:113 | Slots | loading | override loading content | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| autocomplete:119 | Exposes | activated | if autocomplete activated | ^[object]`Ref<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:120 | Exposes | blur | blur the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:121 | Exposes | close | collapse suggestion list | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:122 | Exposes | focus | focus the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:123 | Exposes | handleSelect | triggers when a suggestion is clicked | ^[Function]`(item: any) => Promise<void>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:124 | Exposes | handleKeyEnter | handle keyboard enter event | ^[Function]`() => Promise<void>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:125 | Exposes | highlightedIndex | the index of the currently highlighted item | ^[object]`Ref<number>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:126 | Exposes | highlight | highlight an item in a suggestion | ^[Function]`(itemIndex: number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:127 | Exposes | inputRef | el-input component instance | ^[object]`Ref<ElInputInstance>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:128 | Exposes | loading | remote search loading indicator | ^[object]`Ref<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:129 | Exposes | popperRef | el-tooltip component instance | ^[object]`Ref<ElTooltipInstance>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:130 | Exposes | suggestions | fetch suggestions result | ^[object]`Ref<record<string, any>[]>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| autocomplete:131 | Exposes | getData | loading suggestion list | ^[Function]`(queryString: string) => Promise<void>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/autocomplete](../../reference/element-plus/packages/components/autocomplete/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/autocomplete/autocomplete.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/autocomplete/autocomplete-template.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/autocomplete/remote-search.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/autocomplete/custom-loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/autocomplete/custom-header-footer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
