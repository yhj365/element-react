# Tabs 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/tabs.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- Tabs/TabPane。
- 受控激活、位置、风格、拉伸。
- 可新增/删除、beforeLeave 异步拦截。
- 延迟内容挂载。
- 溢出导航、键盘与自定义标签。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Card Style（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Border card（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Tab position（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Tab（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Add & close tab（原文第60行）：建立React示例与对应行为/视觉断言。
- [ ] Customized add button icon ^(2.4.0)（原文第70行）：建立React示例与对应行为/视觉断言。
- [ ] Customized trigger button of new tab（原文第78行）：建立React示例与对应行为/视觉断言。
- [ ] Default value ^(2.11.9)（原文第86行）：建立React示例与对应行为/视觉断言。
- [ ] FAQ（原文第175行）：建立React示例与对应行为/视觉断言。
- [ ] How to use sortable/draggable tabs ?（原文第177行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

激活项、待切换项和面板挂载历史分开；beforeLeave异步请求用序号隔离。关闭当前项是否自动切换依来源行为，不自作主张；新增/删除/切换事件分别记录。懒加载只影响首次挂载，不能误改成每次切换销毁。

## 3. React 19 结构与交互契约

- 主导出拟为 Tabs，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Tabs Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 100 |
| Tabs Attributes | prop | default-value | defaultValue | 101 |
| Tabs Attributes | prop | type | type | 102 |
| Tabs Attributes | prop | closable | closable | 103 |
| Tabs Attributes | prop | addable | addable | 104 |
| Tabs Attributes | prop | editable | editable | 105 |
| Tabs Attributes | prop | tab-position | tabPosition | 106 |
| Tabs Attributes | prop | stretch | stretch | 107 |
| Tabs Attributes | prop | before-leave | beforeLeave | 108 |
| Tabs Attributes | prop | tabindex | tabindex | 109 |
| Tabs Events | event | tab-click | onTabClick | 115 |
| Tabs Events | event | tab-change | onTabChange | 116 |
| Tabs Events | event | tab-remove | onTabRemove | 117 |
| Tabs Events | event | tab-add | onTabAdd | 118 |
| Tabs Events | event | edit | onEdit | 119 |
| Tabs Slots | slot | default | children | 125 |
| Tabs Slots | slot | add-icon | renderAddIcon | 126 |
| Tabs Slots | slot | addIcon | renderAddIcon | 127 |
| Tabs Exposes | ref | currentName | ref.current.currentName | 133 |
| Tabs Exposes | ref | tabNavRef | ref.current.tabNavRef | 134 |
| Tab-nav Exposes | ref | scrollToActiveTab | ref.current.scrollToActiveTab | 142 |
| Tab-nav Exposes | ref | removeFocus | ref.current.removeFocus | 143 |
| Tab-nav Exposes | ref | tabListRef | ref.current.tabListRef | 144 |
| Tab-nav Exposes | ref | tabBarRef | ref.current.tabBarRef | 145 |
| Tab-bar Exposes | ref | ref | ref.current.ref | 153 |
| Tab-bar Exposes | ref | update | ref.current.update | 154 |
| Tab-pane Attributes | prop | label | label | 162 |
| Tab-pane Attributes | prop | disabled | disabled | 163 |
| Tab-pane Attributes | prop | name | name | 164 |
| Tab-pane Attributes | prop | closable | closable | 165 |
| Tab-pane Attributes | prop | lazy | lazy | 166 |
| Tab-pane Slots | slot | default | children | 172 |
| Tab-pane Slots | slot | label | renderLabel | 173 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| tabs:100 | Tabs Attributes | model-value / v-model | binding value, name of the selected tab, the default value is the name of first tab | ^[string] / ^[number] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| tabs:101 | Tabs Attributes | default-value | The value of the tab that should be active when initially rendered. (avoid initial transition) | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:102 | Tabs Attributes | type | type of Tab | ^[enum]`'' \| 'card' \| 'border-card'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:103 | Tabs Attributes | closable | whether Tab is closable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:104 | Tabs Attributes | addable | whether Tab is addable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:105 | Tabs Attributes | editable | whether Tab is addable and closable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:106 | Tabs Attributes | tab-position | position of tabs | ^[enum]`'top' \| 'right' \| 'bottom' \| 'left'` | top | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:107 | Tabs Attributes | stretch | whether width of tab automatically fits its container | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:108 | Tabs Attributes | before-leave | hook function before switching tab. If `false` is returned or a `Promise` is returned and then is rejected, switching will be prevented | ^[Function]`(activeName: TabPaneName, oldActiveName: TabPaneName) => Awaitable<void \| boolean>` | () => true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:109 | Tabs Attributes | tabindex | tabs tabindex | ^[string] / ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:115 | Tabs Events | tab-click | triggers when a tab is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tabs:116 | Tabs Events | tab-change | triggers when `activeName` is changed | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tabs:117 | Tabs Events | tab-remove | triggers when tab-remove button is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tabs:118 | Tabs Events | tab-add | triggers when tab-add button is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tabs:119 | Tabs Events | edit | triggers when tab-add button or tab-remove is clicked | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| tabs:125 | Tabs Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tabs:126 | Tabs Slots | add-icon | customize add button icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tabs:127 | Tabs Slots | addIcon | customize add button icon | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tabs:133 | Tabs Exposes | currentName | current active pane name | ^[object]`Ref<TabPaneName>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:134 | Tabs Exposes | tabNavRef | tab-nav component instance | ^[object]`Ref<TabNavInstance \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:142 | Tab-nav Exposes | scrollToActiveTab | scroll to the active tab | ^[Function]`() => Promise<void>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:143 | Tab-nav Exposes | removeFocus | remove focus status | ^[Function]`() => boolean` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:144 | Tab-nav Exposes | tabListRef | el_tabs\_\_nav html element | ^[object]`Ref<HTMLDivElement \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:145 | Tab-nav Exposes | tabBarRef | el_tabs\_\_nav bar instance | ^[object]`Ref<TabBarInstance \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:153 | Tab-bar Exposes | ref | tab root html element | ^[object]`Ref<HTMLDivElement \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:154 | Tab-bar Exposes | update | method to manually update tab bar style, return the updated style | ^[Function]`() => CSSProperties` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| tabs:162 | Tab-pane Attributes | label | title of the tab | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:163 | Tab-pane Attributes | disabled | whether Tab is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:164 | Tab-pane Attributes | name | identifier corresponding to the name of Tabs, representing the alias of the tab-pane, the default is ordinal number of the tab-pane in the sequence, e.g. the first tab-pane is '0' | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:165 | Tab-pane Attributes | closable | whether Tab is closable | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:166 | Tab-pane Attributes | lazy | whether Tab is lazily rendered | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| tabs:172 | Tab-pane Slots | default | Tab-pane's content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| tabs:173 | Tab-pane Slots | label | Tab-pane's label | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/tab-pane](../source-components/tab-pane.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/tabs](../../reference/element-plus/packages/components/tabs/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/tabs/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/card-style.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/border-card.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/tab-position.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/custom-tab.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/dynamic-tabs.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/customized-add-button-icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/customized-trigger.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/tabs/default-value.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
