# Popconfirm 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/popconfirm.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 确认气泡。
- 标题、描述/图标、按钮文案。
- 确认/取消事件、actions 渲染。
- 触发和浮层配置、隐藏策略、焦点处理。

## 2. 源文档场景清单

- [ ] Placement（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Basic usage（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Customize（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Trigger event（原文第40行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Popconfirm，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | title | title | 56 |
| Attributes | prop | effect | effect | 57 |
| Attributes | prop | confirm-button-text | confirmButtonText | 58 |
| Attributes | prop | cancel-button-text | cancelButtonText | 59 |
| Attributes | prop | confirm-button-type | confirmButtonType | 60 |
| Attributes | prop | cancel-button-type | cancelButtonType | 61 |
| Attributes | prop | icon | icon | 62 |
| Attributes | prop | icon-color | iconColor | 63 |
| Attributes | prop | hide-icon | hideIcon | 64 |
| Attributes | prop | hide-after | hideAfter | 65 |
| Attributes | prop | teleported | teleported | 66 |
| Attributes | prop | persistent | persistent | 67 |
| Attributes | prop | width | width | 68 |
| Attributes | prop | [tooltip](./tooltip.md#attributes) | [tooltip](./tooltip.md#attributes) | 69 |
| Events | event | confirm | onConfirm | 75 |
| Events | event | cancel | onCancel | 76 |
| Slots | slot | reference | renderReference | 82 |
| Slots | slot | actions | renderActions | 83 |
| Exposes | ref | popperRef | ref.current.popperRef | 89 |
| Exposes | ref | hide | ref.current.hide | 90 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| popconfirm:56 | Attributes | title | Title | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:57 | Attributes | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:58 | Attributes | confirm-button-text | Confirm button text | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:59 | Attributes | cancel-button-text | Cancel button text | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:60 | Attributes | confirm-button-type | Confirm button type | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text'` | primary | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:61 | Attributes | cancel-button-type | Cancel button type | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text'` | text | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:62 | Attributes | icon | Icon Component | ^[string] / ^[Component] | QuestionFilled | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:63 | Attributes | icon-color | Icon color | ^[string] | #f90 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:64 | Attributes | hide-icon | is hide Icon | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:65 | Attributes | hide-after | delay of disappear, in millisecond | ^[number] | 200 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:66 | Attributes | teleported | whether popconfirm is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:67 | Attributes | persistent | when popconfirm inactive and `persistent` is `false` , popconfirm will be destroyed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:68 | Attributes | width | popconfirm width, min width 150px | ^[string] / ^[number] | 150 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:69 | Attributes | [tooltip](./tooltip.md#attributes) | Inherits all attributes from Tooltip, except: `popper-class`, `popper-style`, `fallback-placements` | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| popconfirm:75 | Events | confirm | triggers when click confirm button | ^[Function]`(e: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popconfirm:76 | Events | cancel | triggers when click cancel button | ^[Function]`(e: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| popconfirm:82 | Slots | reference | HTML element that triggers Popconfirm | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| popconfirm:83 | Slots | actions | content of the Popconfirm footer | ^[object]`{ confirm: (e: MouseEvent) => void, cancel: (e: MouseEvent) => void }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| popconfirm:89 | Exposes | popperRef | el-popper component instance | ^[object]`Ref<PopperInstance \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| popconfirm:90 | Exposes | hide | hide popconfirm | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/popconfirm](../../reference/element-plus/packages/components/popconfirm/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/popconfirm/placement.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popconfirm/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popconfirm/customize.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/popconfirm/trigger-event.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
