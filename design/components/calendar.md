# Calendar 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/calendar.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 月历与日期值。
- 日期范围。
- 自定义日期单元格和头部。
- 上一月/下一月/今天切换。
- 日期选择事件和实例导航。

## 2. 源文档场景清单

- [ ] Basic（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Controller Type ^(2.13.1)（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Content（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Range（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Customize header（原文第42行）：建立React示例与对应行为/视觉断言。
- [ ] Localization（原文第50行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Calendar，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 62 |
| Attributes | prop | range | range | 63 |
| Attributes | prop | controller-type | controllerType | 64 |
| Attributes | prop | formatter | formatter | 65 |
| Slots | slot | date-cell | renderDateCell | 71 |
| Slots | slot | header | renderHeader | 72 |
| Exposes | ref | selectedDay | ref.current.selectedDay | 78 |
| Exposes | ref | pickDay | ref.current.pickDay | 79 |
| Exposes | ref | selectDate | ref.current.selectDate | 80 |
| Exposes | ref | calculateValidatedDateRange | ref.current.calculateValidatedDateRange | 81 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| calendar:62 | Attributes | model-value / v-model | binding value | ^[Date] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| calendar:63 | Attributes | range | time range, including start time and end time. Start time must be start day of week, end time must be end day of week, the time span cannot exceed two months. | ^[array]`[Date, Date]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| calendar:64 | Attributes | controller-type | type of the controller for Calendar header | ^[enum]`'button' \| 'select'` | button | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| calendar:65 | Attributes | formatter | format label when `controller-type` is 'select' | ^[Function]`(value: number, type: 'year' \| 'month') => string \| number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| calendar:71 | Slots | date-cell | `type` indicates which month the date belongs, optional values are prev-month, current-month, next-month; `isSelected` indicates whether the date is selected; `day` is the formatted date in the format `YYYY-MM-DD`; `date` is date the cell represents | ^[object]`{ data: { type: 'prev-month' \| 'current-month' \| 'next-month', isSelected: boolean, day: string, date: Date } }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| calendar:72 | Slots | header | content of the Calendar header | ^[object]`{ date: string }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| calendar:78 | Exposes | selectedDay | currently selected date | ^[object]`ComputedRef<Dayjs \| undefined>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| calendar:79 | Exposes | pickDay | select a specific date | ^[Function]`(day: dayjs.Dayjs) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| calendar:80 | Exposes | selectDate | select date | ^[Function]`(type: CalendarDateType) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| calendar:81 | Exposes | calculateValidatedDateRange | Calculate the validate date range according to the start and end dates | ^[Function]`(startDayjs: dayjs.Dayjs, endDayjs: dayjs.Dayjs) => [dayjs.Dayjs, dayjs.Dayjs][]` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/calendar](../../reference/element-plus/packages/components/calendar/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/calendar/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/calendar/controller-type.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/calendar/customize.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/calendar/range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/calendar/header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
