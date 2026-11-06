# Radio 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/radio.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- Radio/RadioGroup/RadioButton。
- 值类型、禁用、尺寸和边框。
- 组内选中、键盘和 label/value 兼容。
- 表单联动。

## 2. 源文档场景清单

- [ ] Basic usage（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] Radio Group（原文第54行）：建立React示例与对应行为/视觉断言。
- [ ] With borders（原文第64行）：建立React示例与对应行为/视觉断言。
- [ ] Options attribute ^(2.11.2)（原文第72行）：建立React示例与对应行为/视觉断言。
- [ ] Radio Button（原文第80行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Radio，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Radio Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 96 |
| Radio Attributes | prop | value | value | 97 |
| Radio Attributes | prop | label | label | 98 |
| Radio Attributes | prop | disabled | disabled | 99 |
| Radio Attributes | prop | border | border | 100 |
| Radio Attributes | prop | size | size | 101 |
| Radio Attributes | prop | name | name | 102 |
| Radio Events | event | change | onChange | 108 |
| Radio Slots | slot | default | children | 114 |
| RadioGroup Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 122 |
| RadioGroup Attributes | prop | size | size | 123 |
| RadioGroup Attributes | prop | disabled | disabled | 124 |
| RadioGroup Attributes | prop | validate-event | validateEvent | 125 |
| RadioGroup Attributes | prop | text-color | textColor | 126 |
| RadioGroup Attributes | prop | fill | fill | 127 |
| RadioGroup Attributes | prop | aria-label | ariaLabel | 128 |
| RadioGroup Attributes | prop | name | name | 129 |
| RadioGroup Attributes | prop | id | id | 130 |
| RadioGroup Attributes | prop | label | label | 131 |
| RadioGroup Attributes | prop | options | options | 132 |
| RadioGroup Attributes | prop | props | props | 133 |
| RadioGroup Attributes | prop | type | type | 134 |
| RadioGroup Events | event | change | onChange | 140 |
| RadioGroup Slots | slot | default | children | 146 |
| RadioButton Attributes | prop | value | value | 154 |
| RadioButton Attributes | prop | label | label | 155 |
| RadioButton Attributes | prop | disabled | disabled | 156 |
| RadioButton Attributes | prop | name | name | 157 |
| RadioButton Slots | slot | default | children | 163 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| radio:96 | Radio Attributes | model-value / v-model | binding value | ^[string] / ^[number] / ^[boolean] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| radio:97 | Radio Attributes | value | the value of Radio | ^[string] / ^[number] / ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:98 | Radio Attributes | label | the label of Radio. If there's no `value`, `label` will act as `value` | ^[string] / ^[number] / ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:99 | Radio Attributes | disabled | whether Radio is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:100 | Radio Attributes | border | whether to add a border around Radio | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:101 | Radio Attributes | size | size of the Radio | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:102 | Radio Attributes | name | native `name` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:108 | Radio Events | change | triggers when the bound value changes | ^[Function]`(value: string \| number \| boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| radio:114 | Radio Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| radio:122 | RadioGroup Attributes | model-value / v-model | binding value | ^[string] / ^[number] / ^[boolean] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| radio:123 | RadioGroup Attributes | size | the size of radio buttons or bordered radios | ^[string] | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:124 | RadioGroup Attributes | disabled | whether the nesting radios are disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:125 | RadioGroup Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:126 | RadioGroup Attributes | text-color | font color when button is active | ^[string] | #ffffff | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:127 | RadioGroup Attributes | fill | border and background color when button is active | ^[string] | #409eff | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:128 | RadioGroup Attributes | aria-label | same as `aria-label` in RadioGroup | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:129 | RadioGroup Attributes | name | native `name` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:130 | RadioGroup Attributes | id | native `id` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:131 | RadioGroup Attributes | label | same as `aria-label` in RadioGroup | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:132 | RadioGroup Attributes | options | data of the options, the key of `value` and `label` and `disabled` can be customize by `props` | ^[array]`Array<{[key: string]: any}>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:133 | RadioGroup Attributes | props | configuration options | ^[object]`{ value?: string, label?: string, disabled?: string}` | `{value: 'value', label: 'label', disabled: 'disabled'}` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:134 | RadioGroup Attributes | type | component type to render options (e.g. `'button'`) | ^[enum]`'radio' \| 'button'` | 'radio' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:140 | RadioGroup Events | change | triggers when the bound value changes | ^[Function]`(value: string \| number \| boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| radio:146 | RadioGroup Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| radio:154 | RadioButton Attributes | value | the value of Radio | ^[string] / ^[number] / ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:155 | RadioButton Attributes | label | the label of Radio. If there's no `value`, `label` will act as `value` | ^[string] / ^[number] / ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:156 | RadioButton Attributes | disabled | whether Radio is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:157 | RadioButton Attributes | name | native 'name' attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| radio:163 | RadioButton Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/radio](../../reference/element-plus/packages/components/radio/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/radio-button](../source-components/radio-button.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/radio-group](../source-components/radio-group.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/radio/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/radio/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/radio/radio-group.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/radio/with-borders.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/radio/options.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/radio/radio-button.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
