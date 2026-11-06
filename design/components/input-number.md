# InputNumber 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/input-number.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 步长、严格步长、精度、min/max。
- 空值和非法值。
- 增减按钮位置、禁用和键盘。
- 解析与显示、变更/提交及表单校验。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled（原文第24行）：建立React示例与对应行为/视觉断言。
- [ ] Steps（原文第32行）：建立React示例与对应行为/视觉断言。
- [ ] Step strictly（原文第42行）：建立React示例与对应行为/视觉断言。
- [ ] Precision（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Size（原文第64行）：建立React示例与对应行为/视觉断言。
- [ ] Controls Position（原文第74行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Icon ^(2.6.3)（原文第82行）：建立React示例与对应行为/视觉断言。
- [ ] With prefix and suffix ^(2.8.4)（原文第90行）：建立React示例与对应行为/视觉断言。
- [ ] Formatter ^(2.14.0)（原文第104行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 InputNumber，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 122 |
| Attributes | prop | min | min | 123 |
| Attributes | prop | max | max | 124 |
| Attributes | prop | step | step | 125 |
| Attributes | prop | step-strictly | stepStrictly | 126 |
| Attributes | prop | precision | precision | 127 |
| Attributes | prop | size | size | 128 |
| Attributes | prop | readonly | readonly | 129 |
| Attributes | prop | disabled | disabled | 130 |
| Attributes | prop | controls | controls | 131 |
| Attributes | prop | controls-position | controlsPosition | 132 |
| Attributes | prop | name | name | 133 |
| Attributes | prop | aria-label | ariaLabel | 134 |
| Attributes | prop | placeholder | placeholder | 135 |
| Attributes | prop | id | id | 136 |
| Attributes | prop | value-on-clear | valueOnClear | 137 |
| Attributes | prop | validate-event | validateEvent | 138 |
| Attributes | prop | label | label | 139 |
| Attributes | prop | inputmode | inputmode | 140 |
| Attributes | prop | align | align | 141 |
| Attributes | prop | disabled-scientific | disabledScientific | 142 |
| Attributes | prop | tabindex | tabindex | 143 |
| Attributes | prop | formatter | formatter | 144 |
| Attributes | prop | parser | parser | 145 |
| Slots | slot | decrease-icon | renderDecreaseIcon | 151 |
| Slots | slot | increase-icon | renderIncreaseIcon | 152 |
| Slots | slot | prefix | renderPrefix | 153 |
| Slots | slot | suffix | renderSuffix | 154 |
| Events | event | change | onChange | 160 |
| Events | event | blur | onBlur | 161 |
| Events | event | focus | onFocus | 162 |
| Exposes | ref | focus | ref.current.focus | 168 |
| Exposes | ref | blur | ref.current.blur | 169 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| input-number:122 | Attributes | model-value / v-model | binding value | ^[number] / ^[null] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| input-number:123 | Attributes | min | the minimum allowed value | ^[number] | Number.MIN_SAFE_INTEGER | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:124 | Attributes | max | the maximum allowed value | ^[number] | Number.MAX_SAFE_INTEGER | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:125 | Attributes | step | incremental step | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:126 | Attributes | step-strictly | whether input value can only be multiple of step | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:127 | Attributes | precision | precision of input value | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:128 | Attributes | size | size of the component | ^[enum]`'large' \| 'default' \| 'small'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:129 | Attributes | readonly | same as `readonly` in native input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:130 | Attributes | disabled | whether the component is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:131 | Attributes | controls | whether to enable the control buttons | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:132 | Attributes | controls-position | position of the control buttons | ^[enum]`'' \| 'right'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:133 | Attributes | name | same as `name` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:134 | Attributes | aria-label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:135 | Attributes | placeholder | same as `placeholder` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:136 | Attributes | id | same as `id` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:137 | Attributes | value-on-clear | value should be set when input box is cleared | ^[number] / ^[null] / ^[enum]`'min' \| 'max'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:138 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:139 | Attributes | label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:140 | Attributes | inputmode | same as `inputmode` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:141 | Attributes | align | alignment for the inner input text | ^[enum]`'left' \| 'center' \| 'right'` | 'center' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:142 | Attributes | disabled-scientific | disables input of scientific notation (e.g. 'e') | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:143 | Attributes | tabindex | same as `tabindex` in native input | ^[string] / ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:144 | Attributes | formatter | specifies the format of the value presented in the input | ^[Function]`(value: string) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:145 | Attributes | parser | specifies the value extracted from the formatted input | ^[Function]`(value: string) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input-number:151 | Slots | decrease-icon | custom input box button decrease icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-number:152 | Slots | increase-icon | custom input box button increase icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-number:153 | Slots | prefix | content as Input prefix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-number:154 | Slots | suffix | content as Input suffix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input-number:160 | Events | change | triggers when the value changes | ^[Function]`(currentValue: number \| undefined, oldValue: number \| undefined) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-number:161 | Events | blur | triggers when Input blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-number:162 | Events | focus | triggers when Input focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input-number:168 | Exposes | focus | get focus the input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input-number:169 | Exposes | blur | remove focus the input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/input-number](../../reference/element-plus/packages/components/input-number/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/input-number/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/steps.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/step-strictly.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/precision.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/size.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/controlled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/custom.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/with-prefix-suffix.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input-number/formatter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
