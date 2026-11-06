# Notification 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/notification.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 标题、正文、图标、类型。
- 四角位置/源支持位置、偏移和堆叠。
- duration、关闭/点击。
- 实例控制、Provider 绑定和销毁。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] With types（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Custom position（原文第28行）：建立React示例与对应行为/视觉断言。
- [ ] With offset（原文第38行）：建立React示例与对应行为/视觉断言。
- [ ] Use HTML string（原文第48行）：建立React示例与对应行为/视觉断言。
- [ ] Message using functions ^(2.9.0)（原文第64行）：建立React示例与对应行为/视觉断言。
- [ ] With progress bar ^(2.14.4)（原文第76行）：建立React示例与对应行为/视觉断言。
- [ ] Hide close button（原文第86行）：建立React示例与对应行为/视觉断言。
- [ ] Global method（原文第96行）：建立React示例与对应行为/视觉断言。
- [ ] Local import（原文第100行）：建立React示例与对应行为/视觉断言。
- [ ] App context inheritance <el-tag>> 2.0.4</el-tag>（原文第115行）：建立React示例与对应行为/视觉断言。
- [ ] Options（原文第138行）：建立React示例与对应行为/视觉断言。
- [ ] Method（原文第160行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Notification，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Options | prop | title | title | 142 |
| Options | prop | message | message | 143 |
| Options | prop | dangerouslyUseHTMLString | dangerouslyUseHTMLString | 144 |
| Options | prop | type | type | 145 |
| Options | prop | icon | icon | 146 |
| Options | prop | customClass | customClass | 147 |
| Options | prop | duration | duration | 148 |
| Options | prop | position | position | 149 |
| Options | prop | showClose | showClose | 150 |
| Options | prop | onClose | onClose | 151 |
| Options | prop | onClick | onClick | 152 |
| Options | prop | offset | offset | 153 |
| Options | prop | appendTo | appendTo | 154 |
| Options | prop | zIndex | zIndex | 155 |
| Options | prop | closeIcon | closeIcon | 156 |
| Options | prop | progress | progress | 157 |
| Options | prop | pauseOnHover | pauseOnHover | 158 |
| Method | ref | close | ref.current.close | 166 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| notification:142 | Options | title | title | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:143 | Options | message | description text | ^[string] / ^[VNode] / ^[Function]`() => VNode` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:144 | Options | dangerouslyUseHTMLString | whether `message` is treated as HTML string | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:145 | Options | type | notification type | ^[enum]`'primary' (2.9.11) \| 'success' \| 'warning' \| 'info' \| 'error' \| ''` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:146 | Options | icon | custom icon component. It will be overridden by `type` | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:147 | Options | customClass | custom class name for Notification | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:148 | Options | duration | duration before close. It will not automatically close if set 0 | ^[number] | 4500 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:149 | Options | position | custom position | ^[enum]`'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | top-right | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:150 | Options | showClose | whether to show a close button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:151 | Options | onClose | callback function when closed | ^[Function]`() => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:152 | Options | onClick | callback function when notification clicked | ^[Function]`() => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:153 | Options | offset | offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:154 | Options | appendTo | set the root element for the notification, default to `document.body` | ^[CSSSelector] / ^[HTMLElement] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:155 | Options | zIndex | initial zIndex | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:156 | Options | closeIcon | custom close icon | ^[string] / ^[Component] | Close | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:157 | Options | progress | progress bar indicating auto-close countdown. Set `true` to show a default bar, or pass an object with [Progress options](./progress.md#attributes) to customize it (`percentage`, `type`, `duration`, `indeterminate` and `width` are excluded) | ^[boolean] / ^[object] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:158 | Options | pauseOnHover | whether to pause the timer when hovering over the notification | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| notification:166 | Method | close | close the Notification | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/notification](../../reference/element-plus/packages/components/notification/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/notification/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/different-types.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/positioning.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/offsetting.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/raw-html.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/use-vnode.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/progress-bar.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/notification/no-close.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
