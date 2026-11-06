# Menu 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/menu.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 横向/纵向、展开/折叠、唯一展开。
- MenuItem/SubMenu/MenuItemGroup。
- 激活路径、禁用、路由适配。
- 溢出、弹出层、键盘与选择/打开/关闭事件。

## 2. 源文档场景清单

- [ ] Top bar（原文第22行）：建立React示例与对应行为/视觉断言。
- [ ] Left And Right（原文第32行）：建立React示例与对应行为/视觉断言。
- [ ] Side bar（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Collapse（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Popper Offset ^(2.4.4)（原文第60行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Menu，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Menu Attributes | prop | mode | mode | 76 |
| Menu Attributes | prop | collapse | collapse | 77 |
| Menu Attributes | prop | ellipsis | ellipsis | 78 |
| Menu Attributes | prop | ellipsis-icon | ellipsisIcon | 79 |
| Menu Attributes | prop | popper-offset | popperOffset | 80 |
| Menu Attributes | prop | default-active | defaultActive | 81 |
| Menu Attributes | prop | default-openeds | defaultOpeneds | 82 |
| Menu Attributes | prop | unique-opened | uniqueOpened | 83 |
| Menu Attributes | prop | menu-trigger | menuTrigger | 84 |
| Menu Attributes | prop | router | router | 85 |
| Menu Attributes | prop | collapse-transition | collapseTransition | 86 |
| Menu Attributes | prop | popper-effect | popperEffect | 87 |
| Menu Attributes | prop | close-on-click-outside | closeOnClickOutside | 88 |
| Menu Attributes | prop | popper-class | popperClass | 89 |
| Menu Attributes | prop | popper-style | popperStyle | 90 |
| Menu Attributes | prop | show-timeout | showTimeout | 91 |
| Menu Attributes | prop | hide-timeout | hideTimeout | 92 |
| Menu Attributes | prop | background-color | backgroundColor | 93 |
| Menu Attributes | prop | text-color | textColor | 94 |
| Menu Attributes | prop | active-text-color | activeTextColor | 95 |
| Menu Attributes | prop | persistent | persistent | 96 |
| Menu Events | event | select | onSelect | 102 |
| Menu Events | event | open | onOpen | 103 |
| Menu Events | event | close | onClose | 104 |
| Menu Slots | slot | default | children | 110 |
| Menu Exposes | ref | open | ref.current.open | 116 |
| Menu Exposes | ref | close | ref.current.close | 117 |
| Menu Exposes | ref | handleResize | ref.current.handleResize | 118 |
| Menu Exposes | ref | updateActiveIndex | ref.current.updateActiveIndex | 119 |
| SubMenu Attributes | prop | index | index | 127 |
| SubMenu Attributes | prop | popper-class | popperClass | 128 |
| SubMenu Attributes | prop | popper-style | popperStyle | 129 |
| SubMenu Attributes | prop | show-timeout | showTimeout | 130 |
| SubMenu Attributes | prop | hide-timeout | hideTimeout | 131 |
| SubMenu Attributes | prop | disabled | disabled | 132 |
| SubMenu Attributes | prop | teleported | teleported | 133 |
| SubMenu Attributes | prop | popper-offset | popperOffset | 134 |
| SubMenu Attributes | prop | expand-close-icon | expandCloseIcon | 135 |
| SubMenu Attributes | prop | expand-open-icon | expandOpenIcon | 136 |
| SubMenu Attributes | prop | collapse-close-icon | collapseCloseIcon | 137 |
| SubMenu Attributes | prop | collapse-open-icon | collapseOpenIcon | 138 |
| SubMenu Slots | slot | default | children | 144 |
| SubMenu Slots | slot | title | renderTitle | 145 |
| Menu-Item Attributes | prop | index | index | 153 |
| Menu-Item Attributes | prop | route | route | 154 |
| Menu-Item Attributes | prop | disabled | disabled | 155 |
| Menu-Item Events | event | click | onClick | 161 |
| Menu-Item Slots | slot | default | children | 167 |
| Menu-Item Slots | slot | title | renderTitle | 168 |
| Menu-Item-Group Attributes | prop | title | title | 176 |
| Menu-Item-Group Slots | slot | default | children | 182 |
| Menu-Item-Group Slots | slot | title | renderTitle | 183 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| menu:76 | Menu Attributes | mode | menu display mode | ^[enum]`'horizontal' \| 'vertical'` | vertical | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:77 | Menu Attributes | collapse | whether the menu is collapsed (available only in vertical mode) | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:78 | Menu Attributes | ellipsis | whether the menu is ellipsis (available only in horizontal mode) | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:79 | Menu Attributes | ellipsis-icon | custom ellipsis icon (available only in horizontal mode and ellipsis is true) | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:80 | Menu Attributes | popper-offset | offset of the popper (effective for all submenus) | ^[number] | 6 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:81 | Menu Attributes | default-active | index of active menu on page load | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:82 | Menu Attributes | default-openeds | array that contains indexes of currently active sub-menus | ^[array]`string[]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:83 | Menu Attributes | unique-opened | whether only one sub-menu can be active | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:84 | Menu Attributes | menu-trigger | how sub-menus are triggered, only works when `mode` is 'horizontal' | ^[enum]`'hover' \| 'click'` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:85 | Menu Attributes | router | whether `vue-router` mode is activated. If true, index will be used as 'path' to activate the route action. Use with `default-active` to set the active item on load. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:86 | Menu Attributes | collapse-transition | whether to enable the collapse transition | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:87 | Menu Attributes | popper-effect | Tooltip theme, built-in theme: `dark` / `light` when menu is collapsed | ^[enum]`'dark' \| 'light'` / ^[string] | dark | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:88 | Menu Attributes | close-on-click-outside | optional, whether menu is collapsed when clicking outside | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:89 | Menu Attributes | popper-class | custom class name for all popup menus and titles' tooltips | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:90 | Menu Attributes | popper-style | custom style for all popup menus and titles' tooltips | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:91 | Menu Attributes | show-timeout | control timeout for all menus before showing | ^[number] | 300 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:92 | Menu Attributes | hide-timeout | control timeout for all menus before hiding | ^[number] | 300 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:93 | Menu Attributes | background-color | background color of Menu (hex format) (use `--el-menu-bg-color` in a style class instead) | ^[string] | #ffffff | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:94 | Menu Attributes | text-color | text color of Menu (hex format) ( use `--el-menu-text-color` in a style class instead) | ^[string] | #303133 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:95 | Menu Attributes | active-text-color | text color of currently active menu item (hex format) ( use `--el-menu-active-color` in a style class instead) | ^[string] | #409eff | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:96 | Menu Attributes | persistent | when menu inactive and `persistent` is `false` , dropdown menu will be destroyed | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:102 | Menu Events | select | callback function when menu is activated | ^[Function]`MenuSelectEvent` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| menu:103 | Menu Events | open | callback function when sub-menu expands | ^[Function]`MenuOpenEvent` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| menu:104 | Menu Events | close | callback function when sub-menu collapses | ^[Function]`MenuCloseEvent` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| menu:110 | Menu Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| menu:116 | Menu Exposes | open | open a specific sub-menu, the param is index of the sub-menu to open | ^[Function]`(index: string) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| menu:117 | Menu Exposes | close | close a specific sub-menu, the param is index of the sub-menu to close | ^[Function]`(index: string) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| menu:118 | Menu Exposes | handleResize | manually trigger menu width recalculation | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| menu:119 | Menu Exposes | updateActiveIndex | set index of active menu | ^[Function]`(index: string) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| menu:127 | SubMenu Attributes | index | unique identification | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:128 | SubMenu Attributes | popper-class | custom class name for the popup menu | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:129 | SubMenu Attributes | popper-style | custom style for the popup menu | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:130 | SubMenu Attributes | show-timeout | timeout before showing a sub-menu(inherit `show-timeout` of the menu by default.) | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:131 | SubMenu Attributes | hide-timeout | timeout before hiding a sub-menu(inherit `hide-timeout` of the menu by default.) | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:132 | SubMenu Attributes | disabled | whether the sub-menu is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:133 | SubMenu Attributes | teleported | whether popup menu is teleported to the body, the default is true for the level one SubMenu, false for other SubMenus | ^[boolean] | undefined | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:134 | SubMenu Attributes | popper-offset | offset of the popper (overrides the `popper` of menu) | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:135 | SubMenu Attributes | expand-close-icon | Icon when menu are expanded and submenu are closed, `expand-close-icon` and `expand-open-icon` need to be passed together to take effect | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:136 | SubMenu Attributes | expand-open-icon | Icon when menu are expanded and submenu are opened, `expand-open-icon` and `expand-close-icon` need to be passed together to take effect | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:137 | SubMenu Attributes | collapse-close-icon | Icon when menu are collapsed and submenu are closed, `collapse-close-icon` and `collapse-open-icon` need to be passed together to take effect | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:138 | SubMenu Attributes | collapse-open-icon | Icon when menu are collapsed and submenu are opened, `collapse-open-icon` and `collapse-close-icon` need to be passed together to take effect | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:144 | SubMenu Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| menu:145 | SubMenu Slots | title | customize title content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| menu:153 | Menu-Item Attributes | index | unique identification | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:154 | Menu-Item Attributes | route | Vue Router Route Location Parameters | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:155 | Menu-Item Attributes | disabled | whether disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:161 | Menu-Item Events | click | callback function when menu-item is clicked, the param is menu-item instance | ^[Function]`(item: MenuItemRegistered) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| menu:167 | Menu-Item Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| menu:168 | Menu-Item Slots | title | customize title content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| menu:176 | Menu-Item-Group Attributes | title | group title | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| menu:182 | Menu-Item-Group Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| menu:183 | Menu-Item-Group Slots | title | customize group title | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/menu](../../reference/element-plus/packages/components/menu/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/menu-item](../source-components/menu-item.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/menu-item-group](../source-components/menu-item-group.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/sub-menu](../source-components/sub-menu.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/menu/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/menu/left-and-right.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/menu/vertical.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/menu/collapse.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/menu/popper-offset.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
