# MessageBox 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/message-box.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- alert/confirm/prompt。
- 按钮文本与类型、输入校验。
- Promise resolve/reject 与 action 回调。
- 关闭/取消区分。
- 异步确认、loading、焦点和滚动锁。

## 2. 源文档场景清单

- [ ] Alert（原文第16行）：建立React示例与对应行为/视觉断言。
- [ ] Confirm（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Prompt（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Use VNode（原文第46行）：建立React示例与对应行为/视觉断言。
- [ ] Use VNode With Action Handlers ^(2.14.0)（原文第56行）：建立React示例与对应行为/视觉断言。
- [ ] Customization（原文第66行）：建立React示例与对应行为/视觉断言。
- [ ] Use HTML String（原文第76行）：建立React示例与对应行为/视觉断言。
- [ ] Distinguishing cancel and close（原文第92行）：建立React示例与对应行为/视觉断言。
- [ ] Centered content（原文第102行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Icon（原文第112行）：建立React示例与对应行为/视觉断言。
- [ ] Draggable（原文第122行）：建立React示例与对应行为/视觉断言。
- [ ] Global method（原文第132行）：建立React示例与对应行为/视觉断言。
- [ ] App context inheritance <el-tag>> 2.0.4</el-tag>（原文第141行）：建立React示例与对应行为/视觉断言。
- [ ] Local import（原文第157行）：建立React示例与对应行为/视觉断言。
- [ ] Options（原文第169行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

实例请求状态含open/validating/pendingAction/closing/settled。确认可异步锁定按钮，输入校验失败不resolve；取消和关闭按来源区分action。每个Promise只结算一次，关闭动画及回调顺序固定；新实例不覆盖旧实例的resolver。

## 3. React 19 结构与交互契约

- 主导出拟为 MessageBox，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Options | prop | autofocus | autofocus | 173 |
| Options | prop | title | title | 174 |
| Options | prop | message | message | 175 |
| Options | prop | dangerouslyUseHTMLString | dangerouslyUseHTMLString | 176 |
| Options | prop | type | type | 177 |
| Options | prop | icon | icon | 178 |
| Options | prop | closeIcon | closeIcon | 179 |
| Options | prop | customClass | customClass | 180 |
| Options | prop | customStyle | customStyle | 181 |
| Options | prop | modal | modal | 182 |
| Options | prop | modalClass | modalClass | 183 |
| Options | prop | callback | callback | 184 |
| Options | prop | showClose | showClose | 185 |
| Options | prop | beforeClose | beforeClose | 186 |
| Options | prop | distinguishCancelAndClose | distinguishCancelAndClose | 187 |
| Options | prop | lockScroll | lockScroll | 188 |
| Options | prop | showCancelButton | showCancelButton | 189 |
| Options | prop | showConfirmButton | showConfirmButton | 190 |
| Options | prop | cancelButtonText | cancelButtonText | 191 |
| Options | prop | confirmButtonText | confirmButtonText | 192 |
| Options | prop | cancelButtonType | cancelButtonType | 193 |
| Options | prop | confirmButtonType | confirmButtonType | 194 |
| Options | prop | cancelButtonLoadingIcon | cancelButtonLoadingIcon | 195 |
| Options | prop | confirmButtonLoadingIcon | confirmButtonLoadingIcon | 196 |
| Options | prop | cancelButtonClass | cancelButtonClass | 197 |
| Options | prop | confirmButtonClass | confirmButtonClass | 198 |
| Options | prop | closeOnClickModal | closeOnClickModal | 199 |
| Options | prop | closeOnPressEscape | closeOnPressEscape | 200 |
| Options | prop | closeOnHashChange | closeOnHashChange | 201 |
| Options | prop | showInput | showInput | 202 |
| Options | prop | inputPlaceholder | inputPlaceholder | 203 |
| Options | prop | inputType | inputType | 204 |
| Options | prop | inputValue | inputValue | 205 |
| Options | prop | inputPattern | inputPattern | 206 |
| Options | prop | inputValidator | inputValidator | 207 |
| Options | prop | inputErrorMessage | inputErrorMessage | 208 |
| Options | prop | center | center | 209 |
| Options | prop | draggable | draggable | 210 |
| Options | prop | overflow | overflow | 211 |
| Options | prop | roundButton | roundButton | 212 |
| Options | prop | buttonSize | buttonSize | 213 |
| Options | prop | appendTo | appendTo | 214 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| message-box:173 | Options | autofocus | auto focus when open MessageBox | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:174 | Options | title | title of the MessageBox | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:175 | Options | message | content of the MessageBox | ^[string] / ^[VNode] / ^[Function]`() => VNode` ^(2.2.17) / ^[Function]`({ confirm, cancel, close }) => VNode` ^(2.14.0) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:176 | Options | dangerouslyUseHTMLString | whether `message` is treated as HTML string | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:177 | Options | type | message type, used for icon display | ^[enum]`'primary' (2.9.11) \| 'success' \| 'info' \| 'warning' \| 'error'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:178 | Options | icon | custom icon component, overrides `type` | ^[string] / ^[Component] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:179 | Options | closeIcon | custom close icon component, default is Close | ^[string] / ^[Component] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:180 | Options | customClass | custom class name for MessageBox | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:181 | Options | customStyle | custom inline style for MessageBox | ^[CSSProperties] | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:182 | Options | modal | whether a mask is displayed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:183 | Options | modalClass | custom class names for mask | string | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:184 | Options | callback | MessageBox closing callback if you don't prefer Promise | ^[Function]`(value: string, action: Action) => any \| (action: Action) => any` | null | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:185 | Options | showClose | whether to show close icon of MessageBox | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:186 | Options | beforeClose | callback before MessageBox closes, and it will prevent MessageBox from closing | ^[Function]`(action: Action, instance: MessageBoxState, done: () => void) => void` | null | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:187 | Options | distinguishCancelAndClose | whether to distinguish canceling and closing the MessageBox | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:188 | Options | lockScroll | whether to lock body scroll when MessageBox prompts | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:189 | Options | showCancelButton | whether to show a cancel button | ^[boolean] | false (true when called with confirm and prompt) | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:190 | Options | showConfirmButton | whether to show a confirm button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:191 | Options | cancelButtonText | text content of cancel button | ^[string] | Cancel | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:192 | Options | confirmButtonText | text content of confirm button | ^[string] | OK | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:193 | Options | cancelButtonType | type of cancel button | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' (deprecated)` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:194 | Options | confirmButtonType | type of confirm button | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' (deprecated)` | primary | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:195 | Options | cancelButtonLoadingIcon | loading icon content of cancel button | ^[string] / ^[Component] | Loading | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:196 | Options | confirmButtonLoadingIcon | loading icon content of confirm button | ^[string] / ^[Component] | Loading | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:197 | Options | cancelButtonClass | custom class name of cancel button | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:198 | Options | confirmButtonClass | custom class name of confirm button | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:199 | Options | closeOnClickModal | whether MessageBox can be closed by clicking the mask | ^[boolean] | true (false when called with alert) | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:200 | Options | closeOnPressEscape | whether MessageBox can be closed by pressing the ESC | ^[boolean] | true (false when called with alert) | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:201 | Options | closeOnHashChange | whether to close MessageBox when hash changes | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:202 | Options | showInput | whether to show an input | ^[boolean] | false (true when called with prompt) | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:203 | Options | inputPlaceholder | placeholder of input | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:204 | Options | inputType | type of input, see more in [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) | ^[string]`'text' \| 'textarea' \| 'number' \| 'password' \| 'email' \| 'search' \| 'tel' \|  'url'` | text | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:205 | Options | inputValue | initial value of input | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:206 | Options | inputPattern | regexp for the input | ^[regexp] | null | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:207 | Options | inputValidator | validation function for the input. Should returns a boolean or string. If a string is returned, it will be assigned to inputErrorMessage | ^[Function]`(value: string) => boolean \| string`/ `undefined` | undefined | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:208 | Options | inputErrorMessage | error message when validation fails | ^[string] | Illegal input | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:209 | Options | center | whether to align the content in center | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:210 | Options | draggable | whether MessageBox is draggable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:211 | Options | overflow | draggable MessageBox can overflow the viewport | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:212 | Options | roundButton | whether to use round button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:213 | Options | buttonSize | custom size of confirm and cancel buttons | ^[string]`'small' \| 'default' \| 'large'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| message-box:214 | Options | appendTo | set the root element for the message box | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/message-box](../../reference/element-plus/packages/components/message-box/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/message-box/alert.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/confirm.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/prompt.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/use-vnode.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/use-vnode-with-action-handlers.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/customization.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/use-html.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/distinguishable-close-cancel.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/centered-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/customized-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/message-box/draggable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
