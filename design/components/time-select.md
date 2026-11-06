# TimeSelect 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/time-select.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- start/end/step 生成选项。
- min/max 排除。
- 格式和可编辑/可清空。
- 选择联动、禁用和空集合。

## 2. 源文档场景清单

- [ ] Fixed time picker（原文第12行）：建立React示例与对应行为/视觉断言。
- [ ] Time Formats（原文第22行）：建立React示例与对应行为/视觉断言。
- [ ] Fixed time range（原文第40行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 TimeSelect，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | model-value / v-model | value / defaultValue / onValueChange | 56 |
| Attributes | prop | disabled | disabled | 57 |
| Attributes | prop | editable | editable | 58 |
| Attributes | prop | clearable | clearable | 59 |
| Attributes | prop | include-end-time | includeEndTime | 60 |
| Attributes | prop | size | size | 61 |
| Attributes | prop | placeholder | placeholder | 62 |
| Attributes | prop | name | name | 63 |
| Attributes | prop | effect | effect | 64 |
| Attributes | prop | prefix-icon | prefixIcon | 65 |
| Attributes | prop | clear-icon | clearIcon | 66 |
| Attributes | prop | start | start | 67 |
| Attributes | prop | end | end | 68 |
| Attributes | prop | step | step | 69 |
| Attributes | prop | min-time | minTime | 70 |
| Attributes | prop | max-time | maxTime | 71 |
| Attributes | prop | format | format | 72 |
| Attributes | prop | empty-values | emptyValues | 73 |
| Attributes | prop | value-on-clear | valueOnClear | 74 |
| Attributes | prop | popper-class | popperClass | 75 |
| Attributes | prop | popper-style | popperStyle | 76 |
| Events | event | change | onChange | 82 |
| Events | event | blur | onBlur | 83 |
| Events | event | focus | onFocus | 84 |
| Events | event | clear | onClear | 85 |
| Exposes | ref | focus | ref.current.focus | 91 |
| Exposes | ref | blur | ref.current.blur | 92 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| time-select:56 | Attributes | model-value / v-model | binding value | ^[string] | — | 受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。 |
| time-select:57 | Attributes | disabled | whether TimeSelect is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:58 | Attributes | editable | whether the input is editable | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:59 | Attributes | clearable | whether to show clear button | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:60 | Attributes | include-end-time | whether `end` is included in options | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:61 | Attributes | size | size of Input | ^[enum]`'large' \| 'default' \| 'small'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:62 | Attributes | placeholder | placeholder in non-range mode | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:63 | Attributes | name | same as `name` in native input | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:64 | Attributes | effect | Tooltip theme, built-in theme: `dark` / `light` | ^[string] / ^[enum]`'dark' \| 'light'` | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:65 | Attributes | prefix-icon | custom prefix icon component | ^[string] / ^[Component] | Clock | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:66 | Attributes | clear-icon | custom clear icon component | ^[string] / ^[Component] | CircleClose | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:67 | Attributes | start | start time | ^[string] | 09:00 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:68 | Attributes | end | end time | ^[string] | 18:00 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:69 | Attributes | step | time step | ^[string] | 00:30 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:70 | Attributes | min-time | minimum time, any time before this time will be disabled | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:71 | Attributes | max-time | maximum time, any time after this time will be disabled | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:72 | Attributes | format | set format of time | ^[string] see [formats](https://day.js.org/docs/en/display/format#list-of-all-available-formats) | HH:mm | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:73 | Attributes | empty-values | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | ^[array] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:74 | Attributes | value-on-clear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | ^[string] / ^[number] / ^[boolean] / ^[Function] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:75 | Attributes | popper-class | custom class name for TimeSelect's dropdown | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:76 | Attributes | popper-style | custom style for TimeSelect's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| time-select:82 | Events | change | triggers when user confirms the value | ^[Function]`(value: string) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-select:83 | Events | blur | triggers when Input blurs | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-select:84 | Events | focus | triggers when Input focuses | ^[Function]`(event: FocusEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-select:85 | Events | clear | triggers when the clear icon is clicked in a clearable TimeSelect | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| time-select:91 | Exposes | focus | focus the Input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| time-select:92 | Exposes | blur | blur the Input component | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/time-select](../../reference/element-plus/packages/components/time-select/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/time-select/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/time-select/time-formats.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/time-select/time-range.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
