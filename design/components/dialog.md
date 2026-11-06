# Dialog 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/dialog.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 受控显隐。
- 标题/头部/底部。
- 模态和遮罩关闭。
- Escape、beforeClose。
- 宽度、居中、全屏、拖拽/缩放按源API。
- 焦点捕获恢复、滚动锁和嵌套层级。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Content（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Header（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Nested Dialog（原文第46行）：建立React示例与对应行为/视觉断言。
- [ ] Centered content（原文第56行）：建立React示例与对应行为/视觉断言。
- [ ] Align Center dialog（原文第72行）：建立React示例与对应行为/视觉断言。
- [ ] Destroy on Close（原文第82行）：建立React示例与对应行为/视觉断言。
- [ ] Draggable Dialog（原文第92行）：建立React示例与对应行为/视觉断言。
- [ ] Fullscreen（原文第108行）：建立React示例与对应行为/视觉断言。
- [ ] Modal（原文第124行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Animation ^(2.10.5)（原文第136行）：建立React示例与对应行为/视觉断言。
- [ ] FAQ（原文第242行）：建立React示例与对应行为/视觉断言。
- [ ] Using dialog in SFC, the scope style does not take effect（原文第244行）：建立React示例与对应行为/视觉断言。
- [ ] When the dialog is displayed and hidden, there is a situation where the page elements are displaced back and forth（原文第250行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

presence至少含closed/opening/open/closing。beforeClose可阻止请求；开/关过渡事件按开始和完成分离。关闭时保留内容至过渡结束，destroyOnClose仅随后卸载。最上层响应Escape、滚动锁引用计数；触发器卸载后焦点回退要明确。

## 3. React 19 结构与交互契约

- 主导出拟为 Dialog，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 172 |
| Attributes | prop | title | title | 173 |
| Attributes | prop | width | width | 174 |
| Attributes | prop | fullscreen | fullscreen | 175 |
| Attributes | prop | top | top | 176 |
| Attributes | prop | modal | modal | 177 |
| Attributes | prop | modal-penetrable | modalPenetrable | 178 |
| Attributes | prop | modal-class | modalClass | 179 |
| Attributes | prop | header-class | headerClass | 180 |
| Attributes | prop | body-class | bodyClass | 181 |
| Attributes | prop | footer-class | footerClass | 182 |
| Attributes | prop | append-to-body | appendToBody | 183 |
| Attributes | prop | append-to | appendTo | 184 |
| Attributes | prop | lock-scroll | lockScroll | 185 |
| Attributes | prop | open-delay | openDelay | 186 |
| Attributes | prop | close-delay | closeDelay | 187 |
| Attributes | prop | close-on-click-modal | closeOnClickModal | 188 |
| Attributes | prop | close-on-press-escape | closeOnPressEscape | 189 |
| Attributes | prop | show-close | showClose | 190 |
| Attributes | prop | before-close | beforeClose | 191 |
| Attributes | prop | draggable | draggable | 192 |
| Attributes | prop | overflow | overflow | 193 |
| Attributes | prop | center | center | 194 |
| Attributes | prop | align-center | alignCenter | 195 |
| Attributes | prop | destroy-on-close | destroyOnClose | 196 |
| Attributes | prop | close-icon | closeIcon | 197 |
| Attributes | prop | z-index | zIndex | 198 |
| Attributes | prop | header-aria-level | headerAriaLevel | 199 |
| Attributes | prop | transition | transition | 200 |
| Attributes | prop | custom-class | customClass | 201 |
| Slots | slot | default | children | 213 |
| Slots | slot | header | renderHeader | 214 |
| Slots | slot | footer | renderFooter | 215 |
| Slots | slot | title | renderTitle | 216 |
| Events | event | open | onOpen | 228 |
| Events | event | opened | onOpened | 229 |
| Events | event | close | onClose | 230 |
| Events | event | closed | onClosed | 231 |
| Events | event | open-auto-focus | onOpenAutoFocus | 232 |
| Events | event | close-auto-focus | onCloseAutoFocus | 233 |
| Exposes | ref | resetPosition | ref.current.resetPosition | 239 |
| Exposes | ref | handleClose | ref.current.handleClose | 240 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| dialog:172 | Attributes | model-value / v-model | visibility of Dialog | ^[boolean] | false | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| dialog:173 | Attributes | title | title of Dialog. Can also be passed with a named slot (see the following table) | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:174 | Attributes | width | width of Dialog, default is 50% | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:175 | Attributes | fullscreen | whether the Dialog takes up full screen | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:176 | Attributes | top | value for `margin-top` of Dialog CSS, default is 15vh | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:177 | Attributes | modal | whether a mask is displayed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:178 | Attributes | modal-penetrable | whether the mask is penetrable. The modal attribute must be `false`. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:179 | Attributes | modal-class | custom class names for mask | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:180 | Attributes | header-class | custom class names for header wrapper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:181 | Attributes | body-class | custom class names for body wrapper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:182 | Attributes | footer-class | custom class names for footer wrapper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:183 | Attributes | append-to-body | whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:184 | Attributes | append-to | which element the Dialog appends to. Will override `append-to-body` | ^[CSSSelector] / ^[HTMLElement] | body | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:185 | Attributes | lock-scroll | whether scroll of body is disabled while Dialog is displayed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:186 | Attributes | open-delay | the Time(milliseconds) before open | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:187 | Attributes | close-delay | the Time(milliseconds) before close | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:188 | Attributes | close-on-click-modal | whether the Dialog can be closed by clicking the mask | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:189 | Attributes | close-on-press-escape | whether the Dialog can be closed by pressing ESC | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:190 | Attributes | show-close | whether to show a close button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:191 | Attributes | before-close | callback before Dialog closes, and it will prevent Dialog from closing, use done to close the dialog | ^[Function]`(done: DoneFn) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:192 | Attributes | draggable | enable dragging feature for Dialog | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:193 | Attributes | overflow | draggable Dialog can overflow the viewport | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:194 | Attributes | center | whether to align the header and footer in center | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:195 | Attributes | align-center | whether to align the dialog both horizontally and vertically | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:196 | Attributes | destroy-on-close | destroy elements in Dialog when closed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:197 | Attributes | close-icon | custom close icon, default is Close | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:198 | Attributes | z-index | same as z-index in native CSS, z-order of dialog | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:199 | Attributes | header-aria-level | header's `aria-level` attribute | ^[string] | 2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:200 | Attributes | transition | custom transition configuration for dialog animation. Can be a string (transition name) or an object with Vue transition props | ^[string] / ^[object]`TransitionProps` | dialog-fade | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:201 | Attributes | custom-class | custom class names for Dialog | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dialog:213 | Slots | default | default content of Dialog | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dialog:214 | Slots | header | content of the Dialog header; Replacing this removes the title, but does not remove the close button. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dialog:215 | Slots | footer | content of the Dialog footer | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dialog:216 | Slots | title | works the same as the header slot. Use that instead. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dialog:228 | Events | open | triggers when the Dialog opens | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dialog:229 | Events | opened | triggers when the Dialog opening animation ends | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dialog:230 | Events | close | triggers when the Dialog closes | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dialog:231 | Events | closed | triggers when the Dialog closing animation ends | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dialog:232 | Events | open-auto-focus | triggers after Dialog opens and content focused | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dialog:233 | Events | close-auto-focus | triggers after Dialog closed and content focused | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dialog:239 | Exposes | resetPosition | reset position | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| dialog:240 | Exposes | handleClose | close dialog | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/dialog](../../reference/element-plus/packages/components/dialog/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/dialog/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/customization-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/customization-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/nested-dialog.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/centered-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/align-center.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/destroy-on-close.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/draggable-dialog.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/fullscreen.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/modal.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/custom-animation.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dialog/events.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
