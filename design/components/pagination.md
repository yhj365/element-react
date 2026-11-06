# Pagination 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/pagination.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 页码/页大小/总数。
- 布局配置、简洁模式、背景、小尺寸。
- 跳页、页大小选择、单页隐藏。
- currentPage/pageSize 双受控通道及事件顺序。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Number of pagers（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Buttons with background color（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Small Pagination（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Hide pagination when there is only one page（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] More elements（原文第54行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Pagination，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | size | size | 70 |
| Attributes | prop | background | background | 71 |
| Attributes | prop | page-size / v-model:page-size | pageSize / defaultPageSize / onPageSizeChange | 72 |
| Attributes | prop | default-page-size | defaultPageSize | 73 |
| Attributes | prop | total | total | 74 |
| Attributes | prop | page-count | pageCount | 75 |
| Attributes | prop | pager-count | pagerCount | 76 |
| Attributes | prop | current-page / v-model:current-page | currentPage / defaultCurrentPage / onCurrentPageChange | 77 |
| Attributes | prop | default-current-page | defaultCurrentPage | 78 |
| Attributes | prop | layout | layout | 79 |
| Attributes | prop | page-sizes | pageSizes | 80 |
| Attributes | prop | append-size-to | appendSizeTo | 81 |
| Attributes | prop | popper-class | popperClass | 82 |
| Attributes | prop | popper-style | popperStyle | 83 |
| Attributes | prop | prev-text | prevText | 84 |
| Attributes | prop | prev-icon | prevIcon | 85 |
| Attributes | prop | next-text | nextText | 86 |
| Attributes | prop | next-icon | nextIcon | 87 |
| Attributes | prop | disabled | disabled | 88 |
| Attributes | prop | teleported | teleported | 89 |
| Attributes | prop | hide-on-single-page | hideOnSinglePage | 90 |
| Attributes | prop | small | small | 91 |
| Events | event | size-change | onSizeChange | 107 |
| Events | event | current-change | onCurrentChange | 108 |
| Events | event | change | onChange | 109 |
| Events | event | prev-click | onPrevClick | 110 |
| Events | event | next-click | onNextClick | 111 |
| Slots | slot | default | children | 123 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| pagination:70 | Attributes | size | pagination size | ^[enum]`'large' \| 'default' \| 'small'` | 'default' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:71 | Attributes | background | whether the buttons have a background color | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:72 | Attributes | page-size / v-model:page-size | item count of each page | ^[number] | — | 独立受控通道；页数收缩、页码调整和size-change顺序按基线测试。 |
| pagination:73 | Attributes | default-page-size | default initial value of page size, not setting is the same as setting 10 | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:74 | Attributes | total | total item count | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:75 | Attributes | page-count | total page count. Set either `total` or `page-count` and pages will be displayed; if you need `page-sizes`, `total` is required | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:76 | Attributes | pager-count | number of pagers. Pagination collapses when the total page count exceeds this value | ^[number]`5 \| 7 \| 9 \| 11 \| 13 \| 15 \| 17 \| 19 \| 21` | 7 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:77 | Attributes | current-page / v-model:current-page | current page number | ^[number] | — | 独立受控通道；保留current-change语义事件，不能和pageSize更新合并。 |
| pagination:78 | Attributes | default-current-page | default initial value of current-page, not setting is the same as setting 1 | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:79 | Attributes | layout | layout of Pagination, elements separated with a comma | ^[string]`string (consists of sizes, prev, pager, next, jumper, ->, total, slot)` | prev, pager, next, jumper, ->, total | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:80 | Attributes | page-sizes | options of item count per page | ^[array]`number[]` | [10, 20, 30, 40, 50, 100] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:81 | Attributes | append-size-to | which element the size dropdown appends to | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:82 | Attributes | popper-class | custom class name for the page size Select's dropdown | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:83 | Attributes | popper-style | custom style for the page size Select's dropdown | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:84 | Attributes | prev-text | text for the prev button | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:85 | Attributes | prev-icon | icon for the prev button, has a lower priority than `prev-text` | ^[string] / ^[Component] | ArrowLeft | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:86 | Attributes | next-text | text for the next button | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:87 | Attributes | next-icon | icon for the next button, has a lower priority than `next-text` | ^[string] / ^[Component] | ArrowRight | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:88 | Attributes | disabled | whether Pagination is disabled | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:89 | Attributes | teleported | whether Pagination select dropdown is teleported to the body | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:90 | Attributes | hide-on-single-page | whether to hide when there's only one page | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:91 | Attributes | small | whether to use small pagination | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| pagination:107 | Events | size-change | triggers when `page-size` changes | ^[Function]`(value: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| pagination:108 | Events | current-change | triggers when `current-page` changes | ^[Function]`(value: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| pagination:109 | Events | change | triggers when `current-page` or `page-size` changes | ^[Function]`(currentPage: number, pageSize: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| pagination:110 | Events | prev-click | triggers when the prev button is clicked and current page changes | ^[Function]`(value: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| pagination:111 | Events | next-click | triggers when the next button is clicked and current page changes | ^[Function]`(value: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| pagination:123 | Slots | default | custom content. To use this, you need to declare `slot` in `layout` | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/pagination](../../reference/element-plus/packages/components/pagination/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/pagination/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/pagination/number-of-pagers.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/pagination/background-color.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/pagination/small-pagination.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/pagination/auto-hide-pagination.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/pagination/more-elements.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
