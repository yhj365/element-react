# Drawer 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/drawer.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 四方向、尺寸、头尾内容。
- 模态、Escape、关闭前回调。
- 销毁策略、焦点、滚动锁、层级。
- 方向对应动画。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第16行）：建立React示例与对应行为/视觉断言。
- [ ] No Title（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Content（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Header（原文第46行）：建立React示例与对应行为/视觉断言。
- [ ] Resizable Drawer ^(2.11.0)（原文第56行）：建立React示例与对应行为/视觉断言。
- [ ] Nested Drawer（原文第66行）：建立React示例与对应行为/视觉断言。
- [ ] Modal（原文第76行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

复用模态栈和presence，但四方向分别保留尺寸和动画规则。拖动遮罩边缘不误触关闭；关闭拦截和过渡结束不同阶段；嵌套Drawer最后关闭才解锁滚动。

## 3. React 19 结构与交互契约

- 主导出拟为 Drawer，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 106 |
| Attributes | prop | append-to-body | appendToBody | 107 |
| Attributes | prop | append-to | appendTo | 108 |
| Attributes | prop | lock-scroll | lockScroll | 109 |
| Attributes | prop | before-close | beforeClose | 110 |
| Attributes | prop | close-on-click-modal | closeOnClickModal | 111 |
| Attributes | prop | close-on-press-escape | closeOnPressEscape | 112 |
| Attributes | prop | open-delay | openDelay | 113 |
| Attributes | prop | close-delay | closeDelay | 114 |
| Attributes | prop | destroy-on-close | destroyOnClose | 115 |
| Attributes | prop | modal | modal | 116 |
| Attributes | prop | modal-penetrable | modalPenetrable | 117 |
| Attributes | prop | direction | direction | 118 |
| Attributes | prop | resizable | resizable | 119 |
| Attributes | prop | show-close | showClose | 120 |
| Attributes | prop | size | size | 121 |
| Attributes | prop | title | title | 122 |
| Attributes | prop | with-header | withHeader | 123 |
| Attributes | prop | modal-class | modalClass | 124 |
| Attributes | prop | header-class | headerClass | 125 |
| Attributes | prop | body-class | bodyClass | 126 |
| Attributes | prop | footer-class | footerClass | 127 |
| Attributes | prop | z-index | zIndex | 128 |
| Attributes | prop | header-aria-level | headerAriaLevel | 129 |
| Attributes | prop | custom-class | customClass | 130 |
| Events | event | open | onOpen | 142 |
| Events | event | opened | onOpened | 143 |
| Events | event | close | onClose | 144 |
| Events | event | closed | onClosed | 145 |
| Events | event | open-auto-focus | onOpenAutoFocus | 146 |
| Events | event | close-auto-focus | onCloseAutoFocus | 147 |
| Events | event | resize-start | onResizeStart | 148 |
| Events | event | resize | onResize | 149 |
| Events | event | resize-end | onResizeEnd | 150 |
| Slots | slot | default | children | 156 |
| Slots | slot | header | renderHeader | 157 |
| Slots | slot | footer | renderFooter | 158 |
| Slots | slot | title | renderTitle | 159 |
| Exposes | ref | handleClose | ref.current.handleClose | 171 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| drawer:106 | Attributes | model-value / v-model | Should Drawer be displayed | ^[boolean] | false | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| drawer:107 | Attributes | append-to-body | Controls should Drawer be inserted to DocumentBody Element, nested Drawer must assign this param to **true** | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:108 | Attributes | append-to | which element the Drawer appends to. Will override `append-to-body` | ^[CSSSelector] / ^[HTMLElement] | body | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:109 | Attributes | lock-scroll | whether scroll of body is disabled while Drawer is displayed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:110 | Attributes | before-close | If set, closing procedure will be halted | ^[Function]`(done: (cancel?: boolean) => void) => void(done is function type that accepts a boolean as parameter, calling done with true or without parameter will abort the close procedure)` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:111 | Attributes | close-on-click-modal | whether the Drawer can be closed by clicking the mask | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:112 | Attributes | close-on-press-escape | Indicates whether Drawer can be closed by pressing ESC | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:113 | Attributes | open-delay | Time(milliseconds) before open | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:114 | Attributes | close-delay | Time(milliseconds) before close | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:115 | Attributes | destroy-on-close | Indicates whether children should be destroyed after Drawer closed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:116 | Attributes | modal | Should show shadowing layer | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:117 | Attributes | modal-penetrable | whether the mask is penetrable. The modal attribute must be `false`. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:118 | Attributes | direction | Drawer's opening direction | ^[enum]`'rtl' \| 'ltr' \| 'ttb' \| 'btt'` | rtl | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:119 | Attributes | resizable | enable resizable feature for Drawer | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:120 | Attributes | show-close | Should show close button at the top right of Drawer | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:121 | Attributes | size | Drawer's size, if Drawer is horizontal mode, it effects the width property, otherwise it effects the height property, when size is `number` type, it describes the size by unit of pixels; when size is `string` type, it should be used with `x%` notation, other wise it will be interpreted to pixel unit | ^[number] / ^[string] | 30% | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:122 | Attributes | title | Drawer's title, can also be set by named slot, detailed descriptions can be found in the slot form | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:123 | Attributes | with-header | Flag that controls the header section's existence, default to true, when withHeader set to false, both `title attribute` and `title slot` won't work | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:124 | Attributes | modal-class | Extra class names for shadowing layer | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:125 | Attributes | header-class | custom class names for header wrapper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:126 | Attributes | body-class | custom class names for body wrapper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:127 | Attributes | footer-class | custom class names for footer wrapper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:128 | Attributes | z-index | set z-index | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:129 | Attributes | header-aria-level | header's `aria-level` attribute | ^[string] | 2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:130 | Attributes | custom-class | Extra class names for Drawer | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| drawer:142 | Events | open | Triggered before Drawer opening animation begins | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:143 | Events | opened | Triggered after Drawer opening animation ended | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:144 | Events | close | Triggered before Drawer closing animation begins | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:145 | Events | closed | Triggered after Drawer closing animation ended | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:146 | Events | open-auto-focus | triggers after Drawer opens and content focused | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:147 | Events | close-auto-focus | triggers after Drawer closed and content focused | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:148 | Events | resize-start | Triggered when resizing starts (when `resizable` is enabled) | ^[Function]`(evt: MouseEvent, size: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:149 | Events | resize | Triggered while resizing (when `resizable` is enabled) | ^[Function]`(evt: MouseEvent, size: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:150 | Events | resize-end | Triggered when resizing ends (when `resizable` is enabled) | ^[Function]`(evt: MouseEvent, size: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| drawer:156 | Slots | default | Drawer's Content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| drawer:157 | Slots | header | Drawer header section; Replacing this removes the title, but does not remove the close button. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| drawer:158 | Slots | footer | Drawer footer Section | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| drawer:159 | Slots | title | Works the same as the header slot. Use that instead. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| drawer:171 | Exposes | handleClose | In order to close Drawer, this method will call `before-close`. | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/drawer](../../reference/element-plus/packages/components/drawer/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/drawer/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/drawer/no-title.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/drawer/customization-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/drawer/customization-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/drawer/resizable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/drawer/nested-drawer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/drawer/modal.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
