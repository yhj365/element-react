# Dropdown 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/dropdown.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- hover/click/contextmenu 等源触发。
- 延迟、定位、拆分按钮。
- DropdownMenu/DropdownItem 命令、禁用、分隔。
- 键盘游走和命令回调。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Placement（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Triggering element（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] How to trigger（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Menu hiding behavior（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Command event（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第80行）：建立React示例与对应行为/视觉断言。
- [ ] Virtual triggering ^(2.11.3)（原文第90行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Dropdown，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Dropdown Attributes | prop | type | type | 106 |
| Dropdown Attributes | prop | size | size | 107 |
| Dropdown Attributes | prop | button-props | buttonProps | 108 |
| Dropdown Attributes | prop | max-height | maxHeight | 109 |
| Dropdown Attributes | prop | split-button | splitButton | 110 |
| Dropdown Attributes | prop | disabled | disabled | 111 |
| Dropdown Attributes | prop | placement | placement | 112 |
| Dropdown Attributes | prop | effect | effect | 113 |
| Dropdown Attributes | prop | trigger | trigger | 114 |
| Dropdown Attributes | prop | trigger-keys | triggerKeys | 115 |
| Dropdown Attributes | prop | virtual-triggering | virtualTriggering | 116 |
| Dropdown Attributes | prop | virtual-ref | virtualRef | 117 |
| Dropdown Attributes | prop | hide-on-click | hideOnClick | 118 |
| Dropdown Attributes | prop | show-arrow | showArrow | 119 |
| Dropdown Attributes | prop | show-timeout | showTimeout | 120 |
| Dropdown Attributes | prop | hide-timeout | hideTimeout | 121 |
| Dropdown Attributes | prop | role | role | 122 |
| Dropdown Attributes | prop | tabindex | tabindex | 123 |
| Dropdown Attributes | prop | popper-class | popperClass | 124 |
| Dropdown Attributes | prop | popper-style | popperStyle | 125 |
| Dropdown Attributes | prop | popper-options | popperOptions | 126 |
| Dropdown Attributes | prop | teleported | teleported | 127 |
| Dropdown Attributes | prop | append-to | appendTo | 128 |
| Dropdown Attributes | prop | persistent | persistent | 129 |
| Dropdown Slots | slot | default | children | 135 |
| Dropdown Slots | slot | dropdown | renderDropdown | 136 |
| Dropdown Events | event | click | onClick | 142 |
| Dropdown Events | event | command | onCommand | 143 |
| Dropdown Events | event | visible-change | onVisibleChange | 144 |
| Dropdown Exposes | ref | handleOpen | ref.current.handleOpen | 150 |
| Dropdown Exposes | ref | handleClose | ref.current.handleClose | 151 |
| Dropdown-Menu Slots | slot | default | children | 159 |
| Dropdown-Item Attributes | prop | command | command | 167 |
| Dropdown-Item Attributes | prop | disabled | disabled | 168 |
| Dropdown-Item Attributes | prop | divided | divided | 169 |
| Dropdown-Item Attributes | prop | icon | icon | 170 |
| Dropdown-Item Slots | slot | default | children | 176 |
| Dropdown-Item Slots | slot | icon | renderIcon | 177 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| dropdown:106 | Dropdown Attributes | type | menu button type, refer to `Button` Component, only works when `split-button` is true | ^[enum]`'' \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'text' (deprecated)` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:107 | Dropdown Attributes | size | menu size, also works on the split button | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:108 | Dropdown Attributes | button-props | props for the button component, refer to [Button Attributes](./button.md#button-attributes) | ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:109 | Dropdown Attributes | max-height | the max height of menu | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:110 | Dropdown Attributes | split-button | whether a button group is displayed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:111 | Dropdown Attributes | disabled | whether to disable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:112 | Dropdown Attributes | placement | placement of pop menu | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | bottom | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:113 | Dropdown Attributes | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:114 | Dropdown Attributes | trigger | how to trigger | ^[enum]`'click' \| 'hover' \| 'contextmenu'` / ^[array]`Array<'click' \| 'hover' \| 'contextmenu'>` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:115 | Dropdown Attributes | trigger-keys | specify which keys on the keyboard can trigger when pressed | ^[array]`string[]` | `['Enter', 'Space', 'ArrowDown', 'NumpadEnter']` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:116 | Dropdown Attributes | virtual-triggering | indicates whether virtual triggering is enabled | ^[boolean] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:117 | Dropdown Attributes | virtual-ref | indicates the reference element to which the dropdown is attached | ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:118 | Dropdown Attributes | hide-on-click | whether to hide menu after clicking menu-item | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:119 | Dropdown Attributes | show-arrow | whether the tooltip content has an arrow | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:120 | Dropdown Attributes | show-timeout | delay time before show a dropdown (only works when trigger is `hover`) | ^[number] | 150 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:121 | Dropdown Attributes | hide-timeout | delay time before hide a dropdown (only works when trigger is `hover`) | ^[number] | 150 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:122 | Dropdown Attributes | role | the ARIA role attribute for the dropdown menu. Depending on the use case, you may want to change this to 'navigation' | ^[enum]`'dialog' \| 'grid' \| 'group' \| 'listbox' \| 'menu' \| 'navigation' \| 'tooltip' \| 'tree'` | menu | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:123 | Dropdown Attributes | tabindex | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Dropdown | ^[number] / ^[string] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:124 | Dropdown Attributes | popper-class | custom class name for Dropdown's dropdown | ^[string] / ^[object] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:125 | Dropdown Attributes | popper-style | custom style for Dropdown's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:126 | Dropdown Attributes | popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | ^[object] | `{modifiers: [{name: 'computeStyles',options: {gpuAcceleration: false}}]}` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:127 | Dropdown Attributes | teleported | whether the dropdown popup is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:128 | Dropdown Attributes | append-to | which element the dropdown CONTENT appends to | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:129 | Dropdown Attributes | persistent | when dropdown inactive and `persistent` is `false` , dropdown menu will be destroyed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:135 | Dropdown Slots | default | content of Dropdown. Notice: Must be a valid html dom element (ex. `<span>, <button> etc.`) or `el-component`, to attach the trigger listener | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dropdown:136 | Dropdown Slots | dropdown | content of the Dropdown Menu, usually a `<el-dropdown-menu>` element | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dropdown:142 | Dropdown Events | click | if `split-button` is `true`, triggers when left button is clicked | ^[Function]`(e: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dropdown:143 | Dropdown Events | command | triggers when a dropdown item is clicked, the parameters is the command dispatched from the dropdown item | ^[Function]`(...args: any[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dropdown:144 | Dropdown Events | visible-change | triggers when the dropdown appears/disappears, the param is true when it appears, and false otherwise | ^[Function]`(val: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| dropdown:150 | Dropdown Exposes | handleOpen | open the dropdown menu | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| dropdown:151 | Dropdown Exposes | handleClose | close the dropdown menu | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| dropdown:159 | Dropdown-Menu Slots | default | content of Dropdown Menu | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dropdown:167 | Dropdown-Item Attributes | command | a command to be dispatched to Dropdown's `command` callback | ^[string] / ^[number] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:168 | Dropdown-Item Attributes | disabled | whether the item is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:169 | Dropdown-Item Attributes | divided | whether a divider is displayed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:170 | Dropdown-Item Attributes | icon | custom icon | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| dropdown:176 | Dropdown-Item Slots | default | customize of Dropdown Item | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| dropdown:177 | Dropdown-Item Slots | icon | custom icon, it will override the icon prop | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/dropdown](../../reference/element-plus/packages/components/dropdown/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/dropdown-item](../source-components/dropdown-item.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/dropdown-menu](../source-components/dropdown-menu.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/dropdown/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/placements.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/triggering-element.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/how-to-trigger.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/menu-hiding-behavior.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/command-event.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/dropdown-methods.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/sizes.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/dropdown/virtual-trigger.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
