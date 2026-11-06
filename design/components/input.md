# Input 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/input.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- input/textarea、密码显隐、字数限制。
- clearable、前后缀/前后置内容。
- autosize、格式化和解析。
- IME、光标保持、focus/blur/select/clear。
- 原生属性透传。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Clearable（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Clear Icon ^(2.11.0)（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Formatter（原文第42行）：建立React示例与对应行为/视觉断言。
- [ ] Password box（原文第52行）：建立React示例与对应行为/视觉断言。
- [ ] Input with icon（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Textarea（原文第70行）：建立React示例与对应行为/视觉断言。
- [ ] Autosize Textarea（原文第80行）：建立React示例与对应行为/视觉断言。
- [ ] Mixed input（原文第90行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第100行）：建立React示例与对应行为/视觉断言。
- [ ] Limit length（原文第108行）：建立React示例与对应行为/视觉断言。
- [ ] Count graphemes ^(2.13.7)（原文第116行）：建立React示例与对应行为/视觉断言。
- [ ] FAQ（原文第222行）：建立React示例与对应行为/视觉断言。
- [ ] Why is the width of the ElInput component expanded by clearable?（原文第224行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

内部维护显示文本、组合输入标志、selection及可选非受控值。composition期间不提前格式化破坏候选词；formatter/parser与外部回写分离。清空按钮按来源决定事件序列；光标和focus实例能力保留。textarea autosize须在挂载/值/容器变化后测量并恢复样式。

## 3. React 19 结构与交互契约

- 主导出拟为 Input，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | type | type | 144 |
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 145 |
| Attributes | prop | model-modifiers | modelModifiers | 146 |
| Attributes | prop | maxlength | maxlength | 147 |
| Attributes | prop | minlength | minlength | 148 |
| Attributes | prop | show-word-limit | showWordLimit | 149 |
| Attributes | prop | word-limit-position | wordLimitPosition | 150 |
| Attributes | prop | placeholder | placeholder | 151 |
| Attributes | prop | clearable | clearable | 152 |
| Attributes | prop | clear-icon | clearIcon | 153 |
| Attributes | prop | formatter | formatter | 154 |
| Attributes | prop | parser | parser | 155 |
| Attributes | prop | show-password | showPassword | 156 |
| Attributes | prop | disabled | disabled | 157 |
| Attributes | prop | size | size | 158 |
| Attributes | prop | prefix-icon | prefixIcon | 159 |
| Attributes | prop | suffix-icon | suffixIcon | 160 |
| Attributes | prop | rows | rows | 161 |
| Attributes | prop | autosize | autosize | 162 |
| Attributes | prop | autocomplete | autocomplete | 163 |
| Attributes | prop | name | name | 164 |
| Attributes | prop | readonly | readonly | 165 |
| Attributes | prop | max | max | 166 |
| Attributes | prop | min | min | 167 |
| Attributes | prop | step | step | 168 |
| Attributes | prop | resize | resize | 169 |
| Attributes | prop | autofocus | autofocus | 170 |
| Attributes | prop | form | form | 171 |
| Attributes | prop | aria-label | ariaLabel | 172 |
| Attributes | prop | tabindex | tabindex | 173 |
| Attributes | prop | validate-event | validateEvent | 174 |
| Attributes | prop | input-style | inputStyle | 175 |
| Attributes | prop | label | label | 176 |
| Attributes | prop | inputmode | inputmode | 177 |
| Attributes | prop | count-graphemes | countGraphemes | 178 |
| Events | event | blur | onBlur | 184 |
| Events | event | focus | onFocus | 185 |
| Events | event | change | onChange | 186 |
| Events | event | input | onInput | 187 |
| Events | event | clear | onClear | 188 |
| Events | event | keydown | onKeydown | 189 |
| Events | event | mouseleave | onMouseleave | 190 |
| Events | event | mouseenter | onMouseenter | 191 |
| Events | event | compositionstart | onCompositionstart | 192 |
| Events | event | compositionupdate | onCompositionupdate | 193 |
| Events | event | compositionend | onCompositionend | 194 |
| Slots | slot | prefix | renderPrefix | 200 |
| Slots | slot | suffix | renderSuffix | 201 |
| Slots | slot | prepend | renderPrepend | 202 |
| Slots | slot | append | renderAppend | 203 |
| Slots | slot | password-icon | renderPasswordIcon | 204 |
| Exposes | ref | blur | ref.current.blur | 210 |
| Exposes | ref | clear | ref.current.clear | 211 |
| Exposes | ref | focus | ref.current.focus | 212 |
| Exposes | ref | input | ref.current.input | 213 |
| Exposes | ref | ref | ref.current.ref | 214 |
| Exposes | ref | resizeTextarea | ref.current.resizeTextarea | 215 |
| Exposes | ref | select | ref.current.select | 216 |
| Exposes | ref | textarea | ref.current.textarea | 217 |
| Exposes | ref | textareaStyle | ref.current.textareaStyle | 218 |
| Exposes | ref | isComposing | ref.current.isComposing | 219 |
| Exposes | ref | passwordVisible | ref.current.passwordVisible | 220 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| input:144 | Attributes | type | type of input, see more in [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) | ^[string]`'text' \| 'textarea' \| 'number' \| 'password' \| 'email' \| 'search' \| 'tel' \|  'url'` | text | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:145 | Attributes | model-value / v-model | binding value | ^[string] / ^[number] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| input:146 | Attributes | model-modifiers | v-model modifiers, reference [Vue modifiers](https://vuejs.org/guide/essentials/forms.html#modifiers) | ^[object]`{ lazy?: true, number?: true, trim?: true }` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:147 | Attributes | maxlength | same as `maxlength` in native input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:148 | Attributes | minlength | same as `minlength` in native input | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:149 | Attributes | show-word-limit | whether show word count, only works when `type` is 'text' or 'textarea' | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:150 | Attributes | word-limit-position | word count position, valid when `show-word-limit` is true | ^[enum]`'inside' \| 'outside'` | "inside" | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:151 | Attributes | placeholder | placeholder of Input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:152 | Attributes | clearable | whether to show clear button, only works when `type` is not 'textarea' | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:153 | Attributes | clear-icon | custom clear icon component | ^[string] / ^[object]`Component` | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:154 | Attributes | formatter | specifies the format of the value presented input.(only works when `type` is 'text') | ^[Function]`(value: string \| number) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:155 | Attributes | parser | specifies the value extracted from formatter input.(only works when `type` is 'text') | ^[Function]`(value: string) => string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:156 | Attributes | show-password | whether to show toggleable password input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:157 | Attributes | disabled | whether Input is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:158 | Attributes | size | size of Input, works when `type` is not 'textarea' | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:159 | Attributes | prefix-icon | prefix icon component | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:160 | Attributes | suffix-icon | suffix icon component | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:161 | Attributes | rows | number of rows of textarea, only works when `type` is 'textarea' | ^[number] | 2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:162 | Attributes | autosize | whether textarea has an adaptive height, only works when `type` is 'textarea'. Can accept an object, e.g. `{ minRows: 2, maxRows: 6 }` | ^[boolean] / ^[object]`{ minRows?: number, maxRows?: number }` | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:163 | Attributes | autocomplete | same as `autocomplete` in native input | ^[string] | off | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:164 | Attributes | name | same as `name` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:165 | Attributes | readonly | same as `readonly` in native input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:166 | Attributes | max | same as `max` in native input | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:167 | Attributes | min | same as `min` in native input | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:168 | Attributes | step | same as `step` in native input | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:169 | Attributes | resize | control the resizability | ^[enum]`'none' \| 'both' \| 'horizontal' \| 'vertical'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:170 | Attributes | autofocus | same as `autofocus` in native input | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:171 | Attributes | form | same as `form` in native input | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:172 | Attributes | aria-label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:173 | Attributes | tabindex | input tabindex | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:174 | Attributes | validate-event | whether to trigger form validation | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:175 | Attributes | input-style | the style of the input element or textarea element | ^[string] / ^[object]`CSSProperties \| CSSProperties[] \| string[]` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:176 | Attributes | label | same as `aria-label` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:177 | Attributes | inputmode | same as `inputmode` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:178 | Attributes | count-graphemes | custom function to count graphemes; when set, native `maxlength`/`minlength` constraints are bypassed. Component uses `Intl.Segmenter` (Chrome 87+, Firefox 125+, Safari 14.1+) for proper grapheme clustering; older browsers fall back to `Array.from()` for code-point iteration | ^[Function]`(value: string) => number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| input:184 | Events | blur | triggers when Input blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:185 | Events | focus | triggers when Input focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:186 | Events | change | triggers when the input box loses focus or the user presses Enter, only if the modelValue has changed | ^[Function]`(value: string \| number, evt?: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:187 | Events | input | triggers when the Input value change | ^[Function]`(value: string \| number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:188 | Events | clear | triggers when the Input is cleared by clicking the clear button | ^[Function]`(evt?: MouseEvent) => void (After version 2.13.4, the evt parameter can be received)` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:189 | Events | keydown | triggers when a key is pressed down | ^[Function]`(event: KeyboardEvent \| Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:190 | Events | mouseleave | triggers when the mouse leaves the Input element | ^[Function]`(event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:191 | Events | mouseenter | triggers when the mouse enters the Input element | ^[Function]`(event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:192 | Events | compositionstart | triggers when the composition starts | ^[Function]`(event: CompositionEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:193 | Events | compositionupdate | triggers when the composition is updated | ^[Function]`(event: CompositionEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:194 | Events | compositionend | triggers when the composition ends | ^[Function]`(event: CompositionEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| input:200 | Slots | prefix | content as Input prefix, only works when `type` is not 'textarea' | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input:201 | Slots | suffix | content as Input suffix, only works when `type` is not 'textarea' | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input:202 | Slots | prepend | content to prepend before Input, only works when `type` is not 'textarea' | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input:203 | Slots | append | content to append after Input, only works when `type` is not 'textarea' | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input:204 | Slots | password-icon | content as Input password icon, only works when `show-password` is true. The scope variable is `{ visible: boolean }` | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| input:210 | Exposes | blur | blur the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:211 | Exposes | clear | clear input value | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:212 | Exposes | focus | focus the input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:213 | Exposes | input | HTML input element | ^[object]`Ref<HTMLInputElement>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:214 | Exposes | ref | HTML element, input or textarea | ^[object]`Ref<HTMLInputElement \| HTMLTextAreaElement>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:215 | Exposes | resizeTextarea | resize textarea | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:216 | Exposes | select | select the text in input element | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:217 | Exposes | textarea | HTML textarea element | ^[object]`Ref<HTMLTextAreaElement>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:218 | Exposes | textareaStyle | style of textarea | ^[object]`Ref<StyleValue>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:219 | Exposes | isComposing | is input composing | ^[object]`Ref<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| input:220 | Exposes | passwordVisible | whether the password is visible | ^[object]`Ref<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/input](../../reference/element-plus/packages/components/input/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/input/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/clearable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/clear-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/formatter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/password.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/with-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/textarea.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/auto-sizing-textarea.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/mixed-input.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/various-size.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/length-limiting.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/input/count-graphemes.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
