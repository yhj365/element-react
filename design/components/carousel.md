# Carousel 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/carousel.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 自动播放、间隔、暂停、循环、初始索引。
- 水平/垂直、卡片模式。
- 指示器、箭头和切换触发。
- CarouselItem。
- 尺寸变化和定时器清理。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Motion blur ^(2.6.0)（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Indicators（原文第28行）：建立React示例与对应行为/视觉断言。
- [ ] Arrows（原文第38行）：建立React示例与对应行为/视觉断言。
- [ ] Auto height（原文第48行）：建立React示例与对应行为/视觉断言。
- [ ] Card mode（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Vertical（原文第68行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Carousel，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Carousel Attributes | prop | height | height | 84 |
| Carousel Attributes | prop | initial-index | initialIndex | 85 |
| Carousel Attributes | prop | trigger | trigger | 86 |
| Carousel Attributes | prop | autoplay | autoplay | 87 |
| Carousel Attributes | prop | interval | interval | 88 |
| Carousel Attributes | prop | indicator-position | indicatorPosition | 89 |
| Carousel Attributes | prop | arrow | arrow | 90 |
| Carousel Attributes | prop | type | type | 91 |
| Carousel Attributes | prop | card-scale | cardScale | 92 |
| Carousel Attributes | prop | loop | loop | 93 |
| Carousel Attributes | prop | direction | direction | 94 |
| Carousel Attributes | prop | pause-on-hover | pauseOnHover | 95 |
| Carousel Attributes | prop | motion-blur | motionBlur | 96 |
| Carousel Events | event | change | onChange | 102 |
| Carousel Slots | slot | default | children | 108 |
| Carousel Exposes | ref | activeIndex | ref.current.activeIndex | 114 |
| Carousel Exposes | ref | setActiveItem | ref.current.setActiveItem | 115 |
| Carousel Exposes | ref | prev | ref.current.prev | 116 |
| Carousel Exposes | ref | next | ref.current.next | 117 |
| Carousel-Item Attributes | prop | name | name | 125 |
| Carousel-Item Attributes | prop | label | label | 126 |
| Carousel-Item Slots | slot | default | children | 132 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| carousel:84 | Carousel Attributes | height | height of the carousel | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:85 | Carousel Attributes | initial-index | index of the initially active slide (starting from 0) | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:86 | Carousel Attributes | trigger | how indicators are triggered | ^[enum]`'hover' \| 'click'` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:87 | Carousel Attributes | autoplay | whether automatically loop the slides | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:88 | Carousel Attributes | interval | interval of the auto loop, in milliseconds | ^[number] | 3000 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:89 | Carousel Attributes | indicator-position | position of the indicators | ^[enum]`'' \| 'none' \| 'outside'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:90 | Carousel Attributes | arrow | when arrows are shown | ^[enum]`'always' \| 'hover' \| 'never'` | hover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:91 | Carousel Attributes | type | type of the Carousel | ^[enum]`'' \| 'card'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:92 | Carousel Attributes | card-scale | when type is card, scaled size of secondary cards | ^[number] | 0.83 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:93 | Carousel Attributes | loop | display the items in loop | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:94 | Carousel Attributes | direction | display direction | ^[enum]`'horizontal' \| 'vertical'` | horizontal | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:95 | Carousel Attributes | pause-on-hover | pause autoplay when hover | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:96 | Carousel Attributes | motion-blur | infuse dynamism and smoothness into the carousel | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:102 | Carousel Events | change | triggers when the active slide switches, it has two parameters, the one is the index of the new active slide, and other is index of the old active slide | ^[Function]`(current: number, prev: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| carousel:108 | Carousel Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| carousel:114 | Carousel Exposes | activeIndex | active slide index | ^[number] | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| carousel:115 | Carousel Exposes | setActiveItem | manually switch slide, index of the slide to be switched to, starting from 0; or the `name` of corresponding `el-carousel-item` | ^[Function]`(index: string \| number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| carousel:116 | Carousel Exposes | prev | switch to the previous slide | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| carousel:117 | Carousel Exposes | next | switch to the next slide | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| carousel:125 | Carousel-Item Attributes | name | name of the item, can be used in `setActiveItem` | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:126 | Carousel-Item Attributes | label | text content for the corresponding indicator | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| carousel:132 | Carousel-Item Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/carousel](../../reference/element-plus/packages/components/carousel/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/carousel-item](../source-components/carousel-item.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/carousel/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/carousel/motion-blur.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/carousel/indicator.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/carousel/arrows.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/carousel/auto-height.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/carousel/card.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/carousel/vertical.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
