# Switch 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/switch.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 开关值、active/inactive 自定义值和文字/图标。
- 内联提示、尺寸、颜色。
- beforeChange 异步拦截、loading、禁用和表单。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Text description（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Display custom icons（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Extended value types（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Loading（原文第66行）：建立React示例与对应行为/视觉断言。
- [ ] Prevent switching（原文第74行）：建立React示例与对应行为/视觉断言。
- [ ] Custom action icon ^(2.3.9)（原文第82行）：建立React示例与对应行为/视觉断言。
- [ ] Custom action slot ^(2.4.4)（原文第90行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

候选值由activeValue/inactiveValue决定，beforeChange返回false或reject则保持旧值；pending期间重复操作按来源处理。受控父级未回写时显示旧值，更新通知与change不能由Effect重复触发。

## 3. React 19 结构与交互契约

- 主导出拟为 Switch，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 104 |
| Attributes | prop | disabled | disabled | 105 |
| Attributes | prop | loading | loading | 106 |
| Attributes | prop | size | size | 107 |
| Attributes | prop | width | width | 108 |
| Attributes | prop | inline-prompt | inlinePrompt | 109 |
| Attributes | prop | active-icon | activeIcon | 110 |
| Attributes | prop | inactive-icon | inactiveIcon | 111 |
| Attributes | prop | active-action-icon | activeActionIcon | 112 |
| Attributes | prop | inactive-action-icon | inactiveActionIcon | 113 |
| Attributes | prop | active-text | activeText | 114 |
| Attributes | prop | inactive-text | inactiveText | 115 |
| Attributes | prop | active-value | activeValue | 116 |
| Attributes | prop | inactive-value | inactiveValue | 117 |
| Attributes | prop | name | name | 118 |
| Attributes | prop | validate-event | validateEvent | 119 |
| Attributes | prop | before-change | beforeChange | 120 |
| Attributes | prop | id | id | 121 |
| Attributes | prop | tabindex | tabindex | 122 |
| Attributes | prop | aria-label | ariaLabel | 123 |
| Attributes | prop | active-color | activeColor | 124 |
| Attributes | prop | inactive-color | inactiveColor | 125 |
| Attributes | prop | border-color | borderColor | 126 |
| Attributes | prop | label | label | 127 |
| Events | event | change | onChange | 133 |
| Switch Slots | slot | active-action | renderActiveAction | 139 |
| Switch Slots | slot | inactive-action | renderInactiveAction | 140 |
| Switch Slots | slot | active | renderActive | 141 |
| Switch Slots | slot | inactive | renderInactive | 142 |
| Exposes | ref | focus | ref.current.focus | 148 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| switch:104 | Attributes | model-value / v-model | binding value, it should be equivalent to either `active-value` or `inactive-value`, by default it's `boolean` type | ^[boolean] / ^[string] / ^[number] | false | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| switch:105 | Attributes | disabled | whether Switch is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:106 | Attributes | loading | whether Switch is in loading state | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:107 | Attributes | size | size of Switch | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:108 | Attributes | width | width of Switch | ^[number] / ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:109 | Attributes | inline-prompt | whether icon or text is displayed inside dot, only the first character will be rendered for text | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:110 | Attributes | active-icon | component of the icon displayed when in `on` state, overrides `active-text` | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:111 | Attributes | inactive-icon | component of the icon displayed when in `off` state, overrides `inactive-text` | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:112 | Attributes | active-action-icon | component of the icon displayed in action when in `on` state | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:113 | Attributes | inactive-action-icon | component of the icon displayed in action when in `off` state | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:114 | Attributes | active-text | text displayed when in `on` state | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:115 | Attributes | inactive-text | text displayed when in `off` state | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:116 | Attributes | active-value | switch value when in `on` state | ^[boolean] / ^[string] / ^[number] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:117 | Attributes | inactive-value | switch value when in `off` state | ^[boolean] / ^[string] / ^[number] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:118 | Attributes | name | input name of Switch | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:119 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:120 | Attributes | before-change | before-change hook before the switch state changes. If `false` is returned or a `Promise` is returned and then is rejected, will stop switching | ^[Function]`() => Promise<boolean> \| boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:121 | Attributes | id | id for input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:122 | Attributes | tabindex | tabindex for input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:123 | Attributes | aria-label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:124 | Attributes | active-color | background color when in `on` state ( use CSS var `--el-switch-on-color` instead ) | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:125 | Attributes | inactive-color | background color when in `off` state ( use CSS var `--el-switch-off-color` instead ) | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:126 | Attributes | border-color | border color of the switch ( use CSS var `--el-switch-border-color` instead ) | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:127 | Attributes | label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| switch:133 | Events | change | triggers when value changes | ^[Function]`(val: boolean \| string \| number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| switch:139 | Switch Slots | active-action | customize active action | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| switch:140 | Switch Slots | inactive-action | customize inactive action | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| switch:141 | Switch Slots | active | customize active content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| switch:142 | Switch Slots | inactive | customize inactive content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| switch:148 | Exposes | focus | manual focus to the switch component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/switch](../../reference/element-plus/packages/components/switch/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/switch/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/sizes.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/text-description.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/custom-icons.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/extended-value-types.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/prevent-switching.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/custom-action-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/switch/custom-action-slot.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
