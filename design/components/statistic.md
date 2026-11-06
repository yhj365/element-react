# Statistic 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/statistic.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 数字格式、精度、分组/小数符、前后缀、标题。
- 自定义 formatter。
- Countdown 截止时间、格式、变化和完成事件、定时清理。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Countdown（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Card usage（原文第30行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Statistic，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Statistic Attributes | prop | value | value | 44 |
| Statistic Attributes | prop | decimal-separator | decimalSeparator | 45 |
| Statistic Attributes | prop | formatter | formatter | 46 |
| Statistic Attributes | prop | group-separator | groupSeparator | 47 |
| Statistic Attributes | prop | precision | precision | 48 |
| Statistic Attributes | prop | prefix | prefix | 49 |
| Statistic Attributes | prop | suffix | suffix | 50 |
| Statistic Attributes | prop | title | title | 51 |
| Statistic Attributes | prop | value-style | valueStyle | 52 |
| Statistic Slots | slot | prefix | renderPrefix | 58 |
| Statistic Slots | slot | suffix | renderSuffix | 59 |
| Statistic Slots | slot | title | renderTitle | 60 |
| Statistic Exposes | ref | displayValue | ref.current.displayValue | 66 |
| Countdown Attributes | prop | value | value | 74 |
| Countdown Attributes | prop | format | format | 75 |
| Countdown Attributes | prop | prefix | prefix | 76 |
| Countdown Attributes | prop | suffix | suffix | 77 |
| Countdown Attributes | prop | title | title | 78 |
| Countdown Attributes | prop | value-style | valueStyle | 79 |
| Countdown Events | event | change | onChange | 85 |
| Countdown Events | event | finish | onFinish | 86 |
| Countdown Slots | slot | prefix | renderPrefix | 92 |
| Countdown Slots | slot | suffix | renderSuffix | 93 |
| Countdown Slots | slot | title | renderTitle | 94 |
| Countdown Exposes | ref | displayValue | ref.current.displayValue | 100 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| statistic:44 | Statistic Attributes | value | Numerical content | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:45 | Statistic Attributes | decimal-separator | Setting the decimal point | ^[string] | . | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:46 | Statistic Attributes | formatter | Custom numerical presentation | ^[Function]`(value: number) => string \| number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:47 | Statistic Attributes | group-separator | Sets the thousandth identifier | ^[string] | , | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:48 | Statistic Attributes | precision | numerical precision | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:49 | Statistic Attributes | prefix | Sets the prefix of a number | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:50 | Statistic Attributes | suffix | Sets the suffix of a number | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:51 | Statistic Attributes | title | Numeric titles | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:52 | Statistic Attributes | value-style | Styles numeric values | ^[string] / ^[object]`CSSProperties \| CSSProperties[] \| string[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:58 | Statistic Slots | prefix | Numeric prefix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| statistic:59 | Statistic Slots | suffix | Suffixes for numeric values | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| statistic:60 | Statistic Slots | title | Numeric titles | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| statistic:66 | Statistic Exposes | displayValue | current display value | ^[object]`Ref<string \| number>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| statistic:74 | Countdown Attributes | value | target time | ^[number] / ^[Dayjs] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:75 | Countdown Attributes | format | Formatting the countdown display | ^[string] | HH:mm:ss | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:76 | Countdown Attributes | prefix | Sets the prefix of a countdown | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:77 | Countdown Attributes | suffix | Sets the suffix of a countdown | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:78 | Countdown Attributes | title | countdown titles | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:79 | Countdown Attributes | value-style | Styles countdown values | ^[string] / ^[object]`CSSProperties \| CSSProperties[] \| string[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| statistic:85 | Countdown Events | change | Time difference change event | ^[Function]`(value: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| statistic:86 | Countdown Events | finish | countdown end event | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| statistic:92 | Countdown Slots | prefix | countdown value prefix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| statistic:93 | Countdown Slots | suffix | countdown value suffix | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| statistic:94 | Countdown Slots | title | countdown title | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| statistic:100 | Countdown Exposes | displayValue | current display value | ^[object]`Ref<string>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/countdown](../../reference/element-plus/packages/components/countdown/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/statistic](../../reference/element-plus/packages/components/statistic/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/statistic/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/statistic/countdown.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/statistic/card.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
