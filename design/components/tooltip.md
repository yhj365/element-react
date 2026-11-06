# Tooltip 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/tooltip.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- hover/focus/click/contextmenu 等源触发。
- 受控显隐、延迟。
- 位置、碰撞、箭头、主题、HTML和内容。
- virtualTrigger、teleport、persistent。
- Escape与可交互浮层。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Theme（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] More Content（原文第39行）：建立React示例与对应行为/视觉断言。
- [ ] Advanced usage（原文第49行）：建立React示例与对应行为/视觉断言。
- [ ] HTML as content（原文第73行）：建立React示例与对应行为/视觉断言。
- [ ] Virtual triggering（原文第89行）：建立React示例与对应行为/视觉断言。
- [ ] Singleton（原文第107行）：建立React示例与对应行为/视觉断言。
- [ ] Controlled（原文第123行）：建立React示例与对应行为/视觉断言。
- [ ] Animations（原文第133行）：建立React示例与对应行为/视觉断言。
- [ ] Use the `append-to`（原文第149行）：建立React示例与对应行为/视觉断言。
- [ ] FAQ（原文第221行）：建立React示例与对应行为/视觉断言。
- [ ] How to allow spaces in the input box when tooltip is nested?（原文第223行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

分离triggerOpen、controlledVisible、enterTimer、leaveTimer和presence。指针进入浮层时是否取消隐藏由来源enterable决定；快速跨越触发器与内容不闪烁。定位容器、虚拟触发器及延迟注册均可更新和销毁。

## 3. React 19 结构与交互契约

- 主导出拟为 Tooltip，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | append-to | appendTo | 165 |
| Attributes | prop | effect | effect | 166 |
| Attributes | prop | content | content | 167 |
| Attributes | prop | raw-content | rawContent | 168 |
| Attributes | prop | placement | placement | 169 |
| Attributes | prop | fallback-placements | fallbackPlacements | 170 |
| Attributes | prop | visible / v-model:visible | visible / defaultVisible / onVisibleChange | 171 |
| Attributes | prop | disabled | disabled | 172 |
| Attributes | prop | offset | offset | 173 |
| Attributes | prop | transition | transition | 174 |
| Attributes | prop | popper-options | popperOptions | 175 |
| Attributes | prop | arrow-offset | arrowOffset | 176 |
| Attributes | prop | show-after | showAfter | 177 |
| Attributes | prop | show-arrow | showArrow | 178 |
| Attributes | prop | hide-after | hideAfter | 179 |
| Attributes | prop | auto-close | autoClose | 180 |
| Attributes | prop | popper-class | popperClass | 181 |
| Attributes | prop | popper-style | popperStyle | 182 |
| Attributes | prop | enterable | enterable | 183 |
| Attributes | prop | teleported | teleported | 184 |
| Attributes | prop | trigger | trigger | 185 |
| Attributes | prop | virtual-triggering | virtualTriggering | 186 |
| Attributes | prop | virtual-ref | virtualRef | 187 |
| Attributes | prop | trigger-keys | triggerKeys | 188 |
| Attributes | prop | persistent | persistent | 189 |
| Attributes | prop | aria-label | ariaLabel | 190 |
| Attributes | prop | focus-on-target | focusOnTarget | 191 |
| Events | event | before-show | onBeforeShow | 197 |
| Events | event | show | onShow | 198 |
| Events | event | before-hide | onBeforeHide | 199 |
| Events | event | hide | onHide | 200 |
| Slots | slot | default | children | 206 |
| Slots | slot | content | renderContent | 207 |
| Exposes | ref | popperRef | ref.current.popperRef | 213 |
| Exposes | ref | contentRef | ref.current.contentRef | 214 |
| Exposes | ref | isFocusInsideContent | ref.current.isFocusInsideContent | 215 |
| Exposes | ref | updatePopper | ref.current.updatePopper | 216 |
| Exposes | ref | onOpen | ref.current.onOpen | 217 |
| Exposes | ref | onClose | ref.current.onClose | 218 |
| Exposes | ref | hide | ref.current.hide | 219 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| tooltip:165 | Attributes | append-to | Which element the tooltip CONTENT appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:166 | Attributes | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` | dark | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:167 | Attributes | content | Display content, can be overridden by `slot#content` | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:168 | Attributes | raw-content | Whether `content` is treated as HTML string | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:169 | Attributes | placement | Position of Tooltip | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:170 | Attributes | fallback-placements | List of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:171 | Attributes | visible / v-model:visible | Visibility of Tooltip | ^[boolean] | — | 具名双向绑定独立受控通道；与源同名语义事件发生冲突时必须在类型审计裁决，不机械合并。 |
| tooltip:172 | Attributes | disabled | Whether Tooltip is disabled | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:173 | Attributes | offset | Offset of the Tooltip | ^[number] | 12 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:174 | Attributes | transition | Animation name | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:175 | Attributes | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object]refer to [popper.js](https://popper.js.org/docs/v2/) doc | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:176 | Attributes | arrow-offset | Controls the offset (padding) of the tooltip’s arrow relative to the popper. | ^[number] | 5 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:177 | Attributes | show-after | Delay of appearance, in millisecond, not valid in controlled mode | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:178 | Attributes | show-arrow | Whether the tooltip content has an arrow | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:179 | Attributes | hide-after | Delay of disappear, in millisecond, not valid in controlled mode | ^[number] | 200 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:180 | Attributes | auto-close | Timeout in milliseconds to hide tooltip, not valid in controlled mode | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:181 | Attributes | popper-class | Custom class name for Tooltip's popper | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:182 | Attributes | popper-style | Custom style for Tooltip's popper | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:183 | Attributes | enterable | Whether the mouse can enter the tooltip | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:184 | Attributes | teleported | Whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:185 | Attributes | trigger | How should the tooltip be triggered (to show), not valid in controlled mode | ^[enum]`'hover' \| 'click' \| 'focus' \| 'contextmenu'` / ^[array]`Array<'click' \| 'focus' \| 'hover' \| 'contextmenu'>` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:186 | Attributes | virtual-triggering | Indicates whether virtual triggering is enabled | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:187 | Attributes | virtual-ref | Indicates the reference element to which the tooltip is attached | ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:188 | Attributes | trigger-keys | When you click the mouse to focus on the trigger element, you can define a set of keyboard codes to control the display of tooltip through the keyboard, not valid in controlled mode | ^[Array] | ['Enter','Space'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:189 | Attributes | persistent | When tooltip inactive and `persistent` is `false` , tooltip will be destroyed | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:190 | Attributes | aria-label | Same as `aria-label` | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:191 | Attributes | focus-on-target | When triggering tooltips through hover, whether to focus the trigger element, which improves accessibility | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tooltip:197 | Events | before-show | Triggers before tooltip is shown. Passes trigger reason as argument. | ^[Function]`(event?: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tooltip:198 | Events | show | Triggers when tooltip is shown. Passes trigger reason as argument. | ^[Function]`(event?: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tooltip:199 | Events | before-hide | Triggers before tooltip is hidden. Passes trigger reason as argument. | ^[Function]`(event?: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tooltip:200 | Events | hide | Triggers when tooltip is hidden. Passes trigger reason as argument. | ^[Function]`(event?: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tooltip:206 | Slots | default | Tooltip triggering & reference element, only a single root element is accepted | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tooltip:207 | Slots | content | Customize content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tooltip:213 | Exposes | popperRef | el-popper component instance | ^[object]`Ref<PopperInstance \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tooltip:214 | Exposes | contentRef | el-tooltip-content component instance | ^[object]`Ref<TooltipContentInstance \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tooltip:215 | Exposes | isFocusInsideContent | Validate current focus event is trigger inside el-tooltip-content | ^[Function]`() => boolean \| undefined` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tooltip:216 | Exposes | updatePopper | Update el-popper component instance | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tooltip:217 | Exposes | onOpen | Expose onOpen function to manage el-tooltip open state | ^[Function]`(event?: Event \| undefined) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tooltip:218 | Exposes | onClose | Expose onClose function to manage el-tooltip open state | ^[Function]`(event?: Event \| undefined) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tooltip:219 | Exposes | hide | Expose hide function | ^[Function]`(event?: Event \| undefined) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/tooltip](../../reference/element-plus/packages/components/tooltip/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/tooltip/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/theme.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/rich-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/advanced-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/html-content.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/virtual-trigger.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/singleton.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/controlled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/animations.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tooltip/append-to.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
