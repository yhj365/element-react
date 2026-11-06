# Form 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/form.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- Form/FormItem。
- 嵌套字段路径、同步异步规则。
- 触发时机、全量/单字段校验。
- 重置、清理、滚动到字段。
- 动态字段注册、初始值、错误提示及尺寸/禁用继承。

## 2. 源文档场景清单

- [ ] Basic Form（原文第16行）：建立React示例与对应行为/视觉断言。
- [ ] Inline Form（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Alignment（原文第46行）：建立React示例与对应行为/视觉断言。
- [ ] Validation（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Validation Rules（原文第68行）：建立React示例与对应行为/视觉断言。
- [ ] Add/Delete Form Item（原文第84行）：建立React示例与对应行为/视觉断言。
- [ ] Number Validate（原文第92行）：建立React示例与对应行为/视觉断言。
- [ ] Size Control（原文第106行）：建立React示例与对应行为/视觉断言。
- [ ] Accessibility（原文第116行）：建立React示例与对应行为/视觉断言。
- [ ] FormItemRule（原文第193行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

字段以路径注册，值、初始快照、errors、validating和touched分开；动态卸载保留/移除策略对齐来源。validate返回Promise/回调的结果、reject内容和先后顺序必须有类型。并发校验仅最新结果写入；reset恢复初始值并清错，父级受控拒绝时不得伪造重置成功。

## 3. React 19 结构与交互契约

- 主导出拟为 Form，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Form Attributes | prop | model | model | 132 |
| Form Attributes | prop | rules | rules | 133 |
| Form Attributes | prop | inline | inline | 134 |
| Form Attributes | prop | label-position | labelPosition | 135 |
| Form Attributes | prop | label-width | labelWidth | 136 |
| Form Attributes | prop | label-suffix | labelSuffix | 137 |
| Form Attributes | prop | hide-required-asterisk | hideRequiredAsterisk | 138 |
| Form Attributes | prop | require-asterisk-position | requireAsteriskPosition | 139 |
| Form Attributes | prop | show-message | showMessage | 140 |
| Form Attributes | prop | inline-message | inlineMessage | 141 |
| Form Attributes | prop | status-icon | statusIcon | 142 |
| Form Attributes | prop | validate-on-rule-change | validateOnRuleChange | 143 |
| Form Attributes | prop | size | size | 144 |
| Form Attributes | prop | disabled | disabled | 145 |
| Form Attributes | prop | scroll-to-error | scrollToError | 146 |
| Form Attributes | prop | scroll-into-view-options | scrollIntoViewOptions | 147 |
| Form Events | event | validate | onValidate | 153 |
| Form Slots | slot | default | children | 159 |
| Form Exposes | ref | validate | ref.current.validate | 165 |
| Form Exposes | ref | validateField | ref.current.validateField | 166 |
| Form Exposes | ref | resetFields | ref.current.resetFields | 167 |
| Form Exposes | ref | scrollToField | ref.current.scrollToField | 168 |
| Form Exposes | ref | clearValidate | ref.current.clearValidate | 169 |
| Form Exposes | ref | fields | ref.current.fields | 170 |
| Form Exposes | ref | getField | ref.current.getField | 171 |
| Form Exposes | ref | setInitialValues | ref.current.setInitialValues | 172 |
| FormItem Attributes | prop | prop | prop | 180 |
| FormItem Attributes | prop | label | label | 181 |
| FormItem Attributes | prop | label-position | labelPosition | 182 |
| FormItem Attributes | prop | label-width | labelWidth | 183 |
| FormItem Attributes | prop | required | required | 184 |
| FormItem Attributes | prop | rules | rules | 185 |
| FormItem Attributes | prop | error | error | 186 |
| FormItem Attributes | prop | show-message | showMessage | 187 |
| FormItem Attributes | prop | inline-message | inlineMessage | 188 |
| FormItem Attributes | prop | size | size | 189 |
| FormItem Attributes | prop | for | for | 190 |
| FormItem Attributes | prop | validate-status | validateStatus | 191 |
| FormItemRule | reference | trigger | trigger | 197 |
| FormItem Slots | slot | default | children | 209 |
| FormItem Slots | slot | label | renderLabel | 210 |
| FormItem Slots | slot | error | renderError | 211 |
| FormItem Exposes | ref | size | ref.current.size | 217 |
| FormItem Exposes | ref | validateMessage | ref.current.validateMessage | 218 |
| FormItem Exposes | ref | validateState | ref.current.validateState | 219 |
| FormItem Exposes | ref | validate | ref.current.validate | 220 |
| FormItem Exposes | ref | resetField | ref.current.resetField | 221 |
| FormItem Exposes | ref | clearValidate | ref.current.clearValidate | 222 |
| FormItem Exposes | ref | setInitialValue | ref.current.setInitialValue | 223 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| form:132 | Form Attributes | model | Data of form component. | ^[object]`Record<string, any>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:133 | Form Attributes | rules | Validation rules of form. | ^[object]`FormRules` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:134 | Form Attributes | inline | Whether the form is inline. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:135 | Form Attributes | label-position | Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required. | ^[enum]`'left' \| 'right' \| 'top'` | right | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:136 | Form Attributes | label-width | Width of label, e.g. `'50px'`. All its direct child form items will inherit this value. `auto` is supported. | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:137 | Form Attributes | label-suffix | Suffix of the label. | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:138 | Form Attributes | hide-required-asterisk | Whether to hide required fields should have a red asterisk (star) beside their labels. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:139 | Form Attributes | require-asterisk-position | Position of asterisk. | ^[enum]`'left' \| 'right'` | left | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:140 | Form Attributes | show-message | Whether to show the error message. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:141 | Form Attributes | inline-message | Whether to display the error message inline with the form item. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:142 | Form Attributes | status-icon | Whether to display an icon indicating the validation result. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:143 | Form Attributes | validate-on-rule-change | Whether to trigger validation when the `rules` prop is changed. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:144 | Form Attributes | size | Control the size of components in this form. | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:145 | Form Attributes | disabled | Whether to disable all components in this form. Before ^(2.12.0), if set to `true`, it will override the `disabled` prop of the inner component. After ^(2.12.0), the configuration of the internal components takes precedence. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:146 | Form Attributes | scroll-to-error | When validation fails, scroll to the first error form entry. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:147 | Form Attributes | scroll-into-view-options | When validation fails, it scrolls to the first error item based on the scrollIntoView option. [scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView). | ^[object]`ScrollIntoViewOptions` / ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:153 | Form Events | validate | triggers after a form item is validated | ^[Function]`(prop: FormItemProp, isValid: boolean, message: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| form:159 | Form Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| form:165 | Form Exposes | validate | Validate the whole form. Receives a callback or returns `Promise`. | ^[Function]`(callback?: FormValidateCallback) => Promise<void>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:166 | Form Exposes | validateField | Validate specified fields. | ^[Function]`(props?: Arrayable<FormItemProp> \| undefined, callback?: FormValidateCallback \| undefined) => FormValidationResult` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:167 | Form Exposes | resetFields | Reset specified fields and remove validation result. | ^[Function]`(props?: Arrayable<FormItemProp> \| undefined) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:168 | Form Exposes | scrollToField | Scroll to the specified fields. | ^[Function]`(prop: FormItemProp) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:169 | Form Exposes | clearValidate | Clear validation messages for all or specified fields. | ^[Function]`(props?: Arrayable<FormItemProp> \| undefined) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:170 | Form Exposes | fields | Get all fields context. | ^[array]`FormItemContext[]` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:171 | Form Exposes | getField | Get a field context. | ^[Function]`(prop: FormItemProp) => FormItemContext \| undefined` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:172 | Form Exposes | setInitialValues | Set initial values for form fields. When `resetFields` is called, fields will reset to these values. | ^[Function]`(initModel: Record<string, any>) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:180 | FormItem Attributes | prop | A key of `model`. It could be a path of the property (e.g `a.b.0` or `['a', 'b', '0']`). In the use of `validate` and `resetFields` method, the attribute is required. | ^[string] / ^[string&#91;&#93;] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:181 | FormItem Attributes | label | Label text. | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:182 | FormItem Attributes | label-position | Position of item label. If set to `'left'` or `'right'`, `label-width` prop is also required. Default extend `label-position` of `form`. | ^[enum]`'left' \| 'right' \| 'top'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:183 | FormItem Attributes | label-width | Width of label, e.g. `'50px'`. `'auto'` is supported. | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:184 | FormItem Attributes | required | Whether the field is required or not, will be determined by validation rules if omitted. | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:185 | FormItem Attributes | rules | Validation rules of form, see the [following table](#formitemrule), more advanced usage at [async-validator](https://github.com/yiminghe/async-validator). | ^[object]`Arrayable<FormItemRule>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:186 | FormItem Attributes | error | Field error message, set its value and the field will validate error and show this message immediately. | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:187 | FormItem Attributes | show-message | Whether to show the error message. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:188 | FormItem Attributes | inline-message | Inline style validate message. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:189 | FormItem Attributes | size | Control the size of components in this form-item. | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:190 | FormItem Attributes | for | Same as for in native label. | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:191 | FormItem Attributes | validate-status | Validation state of formItem. | ^[enum]`'' \| 'error' \| 'validating' \| 'success'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:197 | FormItemRule | trigger | How the validator is triggered. | ^[enum]`'blur' \| 'change'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| form:209 | FormItem Slots | default | Content of Form Item. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| form:210 | FormItem Slots | label | Custom content to display on label. | ^[object]`{ label: string }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| form:211 | FormItem Slots | error | Custom content to display validation message. | ^[object]`{ error: string }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| form:217 | FormItem Exposes | size | Form item size. | ^[object]`ComputedRef<'' \| 'large' \| 'default' \| 'small'>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:218 | FormItem Exposes | validateMessage | Validation message. | ^[object]`Ref<string>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:219 | FormItem Exposes | validateState | Validation state. | ^[object]`Ref<'' \| 'error' \| 'validating' \| 'success'>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:220 | FormItem Exposes | validate | Validate form item. | ^[Function]`(trigger: string, callback?: FormValidateCallback \| undefined) => FormValidationResult` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:221 | FormItem Exposes | resetField | Reset current field and remove validation result. | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:222 | FormItem Exposes | clearValidate | Remove validation status of the field. | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| form:223 | FormItem Exposes | setInitialValue | Set initial value for this field. When `resetField` is called, the field will reset to this value. | ^[Function]`(value: any) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/form](../../reference/element-plus/packages/components/form/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/form-item](../source-components/form-item.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/form/basic-form.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/inline-form.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/alignment.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/validation.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/custom-validation.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/form-items.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/number-validate.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/size-control.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/form/accessibility.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
