# Descriptions 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/descriptions.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- DescriptionsItem。
- 列数、跨列、行跨度以原API为准。
- 横纵布局、边框、尺寸。
- label/content 样式及自定义标签。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Vertical List（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Rowspan ^(2.8.1)（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Style（原文第42行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Descriptions，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Descriptions Attributes | prop | border | border | 56 |
| Descriptions Attributes | prop | column | column | 57 |
| Descriptions Attributes | prop | direction | direction | 58 |
| Descriptions Attributes | prop | size | size | 59 |
| Descriptions Attributes | prop | title | title | 60 |
| Descriptions Attributes | prop | extra | extra | 61 |
| Descriptions Attributes | prop | label-width | labelWidth | 62 |
| Descriptions Slots | slot | default | children | 68 |
| Descriptions Slots | slot | title | renderTitle | 69 |
| Descriptions Slots | slot | extra | renderExtra | 70 |
| DescriptionsItem Attributes | prop | label | label | 78 |
| DescriptionsItem Attributes | prop | span | span | 79 |
| DescriptionsItem Attributes | prop | rowspan | rowspan | 80 |
| DescriptionsItem Attributes | prop | width | width | 81 |
| DescriptionsItem Attributes | prop | min-width | minWidth | 82 |
| DescriptionsItem Attributes | prop | label-width | labelWidth | 83 |
| DescriptionsItem Attributes | prop | align | align | 84 |
| DescriptionsItem Attributes | prop | label-align | labelAlign | 85 |
| DescriptionsItem Attributes | prop | class-name | className | 86 |
| DescriptionsItem Attributes | prop | label-class-name | labelClassName | 87 |
| DescriptionsItem Slots | slot | default | children | 93 |
| DescriptionsItem Slots | slot | label | renderLabel | 94 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| descriptions:56 | Descriptions Attributes | border | with or without border | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:57 | Descriptions Attributes | column | numbers of `Descriptions Item` in one line | ^[number] | 3 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:58 | Descriptions Attributes | direction | direction of list | ^[enum]`'vertical' \| 'horizontal'` | horizontal | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:59 | Descriptions Attributes | size | size of list | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:60 | Descriptions Attributes | title | title text, display on the top left | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:61 | Descriptions Attributes | extra | extra text, display on the top right | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:62 | Descriptions Attributes | label-width | label width of every column | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:68 | Descriptions Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| descriptions:69 | Descriptions Slots | title | custom title, display on the top left | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| descriptions:70 | Descriptions Slots | extra | custom extra area, display on the top right | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| descriptions:78 | DescriptionsItem Attributes | label | label text | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:79 | DescriptionsItem Attributes | span | colspan of column | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:80 | DescriptionsItem Attributes | rowspan | the number of rows a cell should span | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:81 | DescriptionsItem Attributes | width | column width, the width of the same column in different rows is set by the max value (If no `border`, width contains label and content) | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:82 | DescriptionsItem Attributes | min-width | column minimum width, columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion (If no`border`, width contains label and content) | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:83 | DescriptionsItem Attributes | label-width | column label width, if not set, it will be the same as the width of the column. Higher priority than the `label-width` of `Descriptions` | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:84 | DescriptionsItem Attributes | align | column content alignment (If no `border`, effective for both label and content) | ^[enum]`'left' \| 'center' \| 'right'` | left | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:85 | DescriptionsItem Attributes | label-align | column label alignment, if omitted, the value of the above `align` attribute will be applied (If no `border`, please use `align` attribute) | ^[enum]`'left' \| 'center' \| 'right'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:86 | DescriptionsItem Attributes | class-name | column content custom class name | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:87 | DescriptionsItem Attributes | label-class-name | column label custom class name | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| descriptions:93 | DescriptionsItem Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| descriptions:94 | DescriptionsItem Slots | label | custom label | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/descriptions](../../reference/element-plus/packages/components/descriptions/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/descriptions-item](../source-components/descriptions-item.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/descriptions/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/descriptions/sizes.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/descriptions/vertical-list.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/descriptions/rowspan.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/descriptions/customized-style.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
