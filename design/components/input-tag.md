# InputTag 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/input-tag.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 标签新增/删除/拖动按原API。
- 触发键、最大数量、清空。
- 折叠与溢出提示。
- 自定义标签、IME及表单交互。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Trigger（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Maximum Tags（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Collapse Tags ^(2.11.0)（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Clearable（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Clear Icon ^(2.11.0)（原文第70行）：建立React示例与对应行为/视觉断言。
- [ ] Draggable（原文第80行）：建立React示例与对应行为/视觉断言。
- [ ] Delimiter ^(2.9.9)（原文第90行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第100行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Tag（原文第110行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Prefix and Suffix（原文第120行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 InputTag，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 136 |
| Attributes | prop | max | max | 137 |
| Attributes | prop | tag-type | tagType | 138 |
| Attributes | prop | tag-effect | tagEffect | 139 |
| Attributes | prop | effect | effect | 140 |
| Attributes | prop | trigger | trigger | 141 |
| Attributes | prop | draggable | draggable | 142 |
| Attributes | prop | delimiter | delimiter | 143 |
| Attributes | prop | size | size | 144 |
| Attributes | prop | collapse-tags | collapseTags | 145 |
| Attributes | prop | collapse-tags-tooltip | collapseTagsTooltip | 146 |
| Attributes | prop | save-on-blur | saveOnBlur | 147 |
| Attributes | prop | clearable | clearable | 148 |
| Attributes | prop | clear-icon | clearIcon | 149 |
| Attributes | prop | disabled | disabled | 150 |
| Attributes | prop | validate-event | validateEvent | 151 |
| Attributes | prop | readonly | readonly | 152 |
| Attributes | prop | autofocus | autofocus | 153 |
| Attributes | prop | id | id | 154 |
| Attributes | prop | tabindex | tabindex | 155 |
| Attributes | prop | max-collapse-tags | maxCollapseTags | 156 |
| Attributes | prop | maxlength | maxlength | 157 |
| Attributes | prop | minlength | minlength | 158 |
| Attributes | prop | placeholder | placeholder | 159 |
| Attributes | prop | autocomplete | autocomplete | 160 |
| Attributes | prop | aria-label | ariaLabel | 161 |
| Events | event | change | onChange | 167 |
| Events | event | input | onInput | 168 |
| Events | event | add-tag | onAddTag | 169 |
| Events | event | remove-tag | onRemoveTag | 170 |
| Events | event | drag-tag | onDragTag | 171 |
| Events | event | focus | onFocus | 172 |
| Events | event | blur | onBlur | 173 |
| Events | event | clear | onClear | 174 |
| Slots | slot | tag | renderTag | 180 |
| Slots | slot | prefix | renderPrefix | 181 |
| Slots | slot | suffix | renderSuffix | 182 |
| Exposes | ref | focus | ref.current.focus | 188 |
| Exposes | ref | blur | ref.current.blur | 189 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| input-tag:136 | Attributes | model-value / v-model | binding value | ^[array]`string[]` | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| input-tag:137 | Attributes | max | max number tags that can be enter | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:138 | Attributes | tag-type | tag type | ^[enum]`'' \| 'success' \| 'info' \| 'warning' \| 'danger'` | info | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:139 | Attributes | tag-effect | tag effect | ^[enum]`'' \| 'light' \| 'dark' \| 'plain'` | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:140 | Attributes | effect | tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:141 | Attributes | trigger | the key to trigger input tag | ^[enum]`'Enter' \| 'Space'` | Enter | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:142 | Attributes | draggable | whether tags can be dragged | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:143 | Attributes | delimiter | add a tag when a delimiter is matched | ^[string] / ^[regex] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:144 | Attributes | size | input box size | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:145 | Attributes | collapse-tags | whether to collapse tags to a text when multiple selecting | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:146 | Attributes | collapse-tags-tooltip | whether show all selected tags when mouse hover text of collapse-tags. To use this, collapse-tags must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:147 | Attributes | save-on-blur | whether to save the input value when the input loses focus | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:148 | Attributes | clearable | whether to show clear button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:149 | Attributes | clear-icon | custom clear icon component | ^[string] / ^[object]`Component` | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:150 | Attributes | disabled | whether to disable input-tag | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:151 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:152 | Attributes | readonly | same as `readonly` in native input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:153 | Attributes | autofocus | same as `autofocus` in native input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:154 | Attributes | id | same as `id` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:155 | Attributes | tabindex | same as `tabindex` in native input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:156 | Attributes | max-collapse-tags | the max tags number to be shown. To use this, collapse-tags must be true | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:157 | Attributes | maxlength | same as `maxlength` in native input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:158 | Attributes | minlength | same as `minlength` in native input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:159 | Attributes | placeholder | placeholder of input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:160 | Attributes | autocomplete | same as `autocomplete` in native input | ^[string] | off | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:161 | Attributes | aria-label | native `aria-label` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-tag:167 | Events | change | triggers when the modelValue change | ^[Function]`(value: string[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:168 | Events | input | triggers when the input value change | ^[Function]`(value: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:169 | Events | add-tag | triggers when a tag is added | ^[Function]`(value: string \| string []) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:170 | Events | remove-tag | triggers when a tag is removed | ^[Function]`(value: string, index: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:171 | Events | drag-tag | triggers when a tag is dragged | ^[Function]`(oldIndex: number, newIndex: number, value: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:172 | Events | focus | triggers when InputTag focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:173 | Events | blur | triggers when InputTag blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:174 | Events | clear | triggers when the clear icon is clicked | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-tag:180 | Slots | tag | content as tag | ^[object]`{ value: string, index: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-tag:181 | Slots | prefix | content as InputTag prefix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-tag:182 | Slots | suffix | content as InputTag suffix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-tag:188 | Exposes | focus | focus the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input-tag:189 | Exposes | blur | blur the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/input-tag](../../reference/element-plus/packages/components/input-tag/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/input-tag/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/trigger.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/max.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/collapse.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/clearable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/clear-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/draggable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/delimiter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/size.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/tag.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-tag/prefix-suffix.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
