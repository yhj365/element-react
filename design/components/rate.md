# Rate 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/rate.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 星级、半星、最大值、只读、清空。
- 颜色和图标阈值。
- 文本与分数。
- hover/change、键盘和 aria 值。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] With allow-half（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] With text（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Clearable（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] More icons（原文第52行）：建立React示例与对应行为/视觉断言。
- [ ] Read-only（原文第62行）：建立React示例与对应行为/视觉断言。
- [ ] Custom styles（原文第72行）：建立React示例与对应行为/视觉断言。
- [ ] Default Variables（原文第77行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Rate，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Default Variables | reference | --el-rate-void-color | -ElRateVoidColor | 81 |
| Default Variables | reference | --el-rate-fill-color | -ElRateFillColor | 82 |
| Default Variables | reference | --el-rate-disabled-void-color | -ElRateDisabledVoidColor | 83 |
| Default Variables | reference | --el-rate-text-color | -ElRateTextColor | 84 |
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 92 |
| Attributes | prop | max | max | 93 |
| Attributes | prop | size | size | 94 |
| Attributes | prop | disabled | disabled | 95 |
| Attributes | prop | allow-half | allowHalf | 96 |
| Attributes | prop | low-threshold | lowThreshold | 97 |
| Attributes | prop | high-threshold | highThreshold | 98 |
| Attributes | prop | colors | colors | 99 |
| Attributes | prop | void-color | voidColor | 100 |
| Attributes | prop | disabled-void-color | disabledVoidColor | 101 |
| Attributes | prop | icons | icons | 102 |
| Attributes | prop | void-icon | voidIcon | 103 |
| Attributes | prop | disabled-void-icon | disabledVoidIcon | 104 |
| Attributes | prop | show-text | showText | 105 |
| Attributes | prop | show-score | showScore | 106 |
| Attributes | prop | text-color | textColor | 107 |
| Attributes | prop | texts | texts | 108 |
| Attributes | prop | score-template | scoreTemplate | 109 |
| Attributes | prop | clearable | clearable | 110 |
| Attributes | prop | id | id | 111 |
| Attributes | prop | aria-label | ariaLabel | 112 |
| Attributes | prop | label | label | 113 |
| Events | event | change | onChange | 119 |
| Exposes | ref | setCurrentValue | ref.current.setCurrentValue | 125 |
| Exposes | ref | resetCurrentValue | ref.current.resetCurrentValue | 126 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| rate:81 | Default Variables | --el-rate-void-color | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:82 | Default Variables | --el-rate-fill-color | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:83 | Default Variables | --el-rate-disabled-void-color | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:84 | Default Variables | --el-rate-text-color | 参见原表其他列 | — | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:92 | Attributes | model-value / v-model | binding value | ^[number] | 0 | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| rate:93 | Attributes | max | max rating score | ^[number] | 5 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:94 | Attributes | size | size of Rate | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:95 | Attributes | disabled | whether Rate is read-only | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:96 | Attributes | allow-half | whether picking half start is allowed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:97 | Attributes | low-threshold | threshold value between low and medium level. The value itself will be included in low level | ^[number] | 2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:98 | Attributes | high-threshold | threshold value between medium and high level. The value itself will be included in high level | ^[number] | 4 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:99 | Attributes | colors | colors for icons. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding color | ^[array]`string[]` / ^[object]`Record<number, string>` | ['#f7ba2a', '#f7ba2a', '#f7ba2a'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:100 | Attributes | void-color | color of unselected icons | ^[string] | #c6d1de | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:101 | Attributes | disabled-void-color | color of unselected read-only icons | ^[string] | #eff2f7 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:102 | Attributes | icons | icon components. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding icon component | ^[array]`string[] \| Component[]` / ^[object]`Record<number, string \| Component>` | [StarFilled, StarFilled, StarFilled] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:103 | Attributes | void-icon | component of unselected icons | ^[string] / ^[Component] | Star | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:104 | Attributes | disabled-void-icon | component of unselected read-only icons | ^[string] / ^[Component] | StarFilled | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:105 | Attributes | show-text | whether to display texts | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:106 | Attributes | show-score | whether to display current score. show-score and show-text cannot be true at the same time | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:107 | Attributes | text-color | color of texts | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:108 | Attributes | texts | text array | ^[array]`string[]` | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:109 | Attributes | score-template | score template | ^[string] | {value} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:110 | Attributes | clearable | whether value can be reset to `0` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:111 | Attributes | id | native `id` attribute | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:112 | Attributes | aria-label | same as `aria-label` in Rate | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:113 | Attributes | label | same as `aria-label` in Rate | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| rate:119 | Events | change | Triggers when rate value is changed | ^[Function]`(value: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| rate:125 | Exposes | setCurrentValue | set current value | ^[Function]`(value: number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| rate:126 | Exposes | resetCurrentValue | reset current value | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/rate](../../reference/element-plus/packages/components/rate/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/rate/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/rate/sizes.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/rate/allow-half.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/rate/text.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/rate/clearable.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/rate/more-icons.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/rate/readonly.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
