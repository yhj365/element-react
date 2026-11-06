# TableV2 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/table-v2.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 固定/动态行高虚拟表格。
- columns/data/rowKey。
- 固定列、宽高、缓存与滚动。
- 树展开、排序状态、自定义行/单元格/头部。
- AutoResizer。
- 不自动宣称拥有Table全部功能。

## 2. 源文档场景清单

- [ ] Basic usage（原文第21行）：建立React示例与对应行为/视觉断言。
- [ ] Auto resizer（原文第31行）：建立React示例与对应行为/视觉断言。
- [ ] Customize Cell Renderer{#customize-cell-renderer}（原文第51行）：建立React示例与对应行为/视觉断言。
- [ ] Table with selections（原文第61行）：建立React示例与对应行为/视觉断言。
- [ ] Inline editing（原文第71行）：建立React示例与对应行为/视觉断言。
- [ ] Table with status（原文第81行）：建立React示例与对应行为/视觉断言。
- [ ] Table with sticky rows（原文第93行）：建立React示例与对应行为/视觉断言。
- [ ] Table with fixed columns（原文第105行）：建立React示例与对应行为/视觉断言。
- [ ] Grouping header（原文第117行）：建立React示例与对应行为/视觉断言。
- [ ] Filter（原文第135行）：建立React示例与对应行为/视觉断言。
- [ ] Sortable（原文第145行）：建立React示例与对应行为/视觉断言。
- [ ] Controlled Sort（原文第155行）：建立React示例与对应行为/视觉断言。
- [ ] Cross hovering（原文第166行）：建立React示例与对应行为/视觉断言。
- [ ] Colspan（原文第176行）：建立React示例与对应行为/视觉断言。
- [ ] Rowspan（原文第186行）：建立React示例与对应行为/视觉断言。
- [ ] Rowspan and Colspan together（原文第197行）：建立React示例与对应行为/视觉断言。
- [ ] Tree data（原文第207行）：建立React示例与对应行为/视觉断言。
- [ ] Dynamic height rows（原文第217行）：建立React示例与对应行为/视觉断言。
- [ ] Detail view（原文第236行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Footer（原文第246行）：建立React示例与对应行为/视觉断言。
- [ ] Customized Empty Renderer（原文第256行）：建立React示例与对应行为/视觉断言。
- [ ] Overlay（原文第266行）：建立React示例与对应行为/视觉断言。
- [ ] Manual scrolling（原文第276行）：建立React示例与对应行为/视觉断言。
- [ ] Column Attribute（原文第372行）：建立React示例与对应行为/视觉断言。
- [ ] Typings{#typings}（原文第394行）：建立React示例与对应行为/视觉断言。
- [ ] FAQs（原文第577行）：建立React示例与对应行为/视觉断言。
- [ ] How do I render a list with a checkbox in the first column?（原文第579行）：建立React示例与对应行为/视觉断言。
- [ ] Why does virtualized table provide less features than [TableV1](./table.md)（原文第585行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

columns描述渲染器、宽度和固定位置；行键与可视窗口独立。滚动偏移驱动行窗口与固定区同步，动态高度使尺寸缓存失效并稳定锚点。排序仅依来源sortBy/sortState事件约定；AutoResizer单独验证零尺寸和重新可见。

## 3. React 19 结构与交互契约

- 主导出拟为 TableV2，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| TableV2 Attributes | prop | cache | cache | 302 |
| TableV2 Attributes | prop | estimated-row-height | estimatedRowHeight | 303 |
| TableV2 Attributes | prop | header-class | headerClass | 304 |
| TableV2 Attributes | prop | header-props | headerProps | 305 |
| TableV2 Attributes | prop | header-cell-props | headerCellProps | 306 |
| TableV2 Attributes | prop | header-height | headerHeight | 307 |
| TableV2 Attributes | prop | footer-height | footerHeight | 308 |
| TableV2 Attributes | prop | row-class | rowClass | 309 |
| TableV2 Attributes | prop | row-key | rowKey | 310 |
| TableV2 Attributes | prop | row-props | rowProps | 311 |
| TableV2 Attributes | prop | row-height | rowHeight | 312 |
| TableV2 Attributes | prop | row-event-handlers | rowEventHandlers | 313 |
| TableV2 Attributes | prop | cell-props | cellProps | 314 |
| TableV2 Attributes | prop | columns | columns | 315 |
| TableV2 Attributes | prop | data | data | 316 |
| TableV2 Attributes | prop | data-getter | dataGetter | 317 |
| TableV2 Attributes | prop | fixed-data | fixedData | 318 |
| TableV2 Attributes | prop | expand-column-key | expandColumnKey | 319 |
| TableV2 Attributes | prop | expanded-row-keys | expandedRowKeys | 320 |
| TableV2 Attributes | prop | default-expanded-row-keys | defaultExpandedRowKeys | 321 |
| TableV2 Attributes | prop | class | className | 322 |
| TableV2 Attributes | prop | fixed | fixed | 323 |
| TableV2 Attributes | prop | width | width | 324 |
| TableV2 Attributes | prop | height | height | 325 |
| TableV2 Attributes | prop | max-height | maxHeight | 326 |
| TableV2 Attributes | prop | indent-size | indentSize | 327 |
| TableV2 Attributes | prop | h-scrollbar-size | hScrollbarSize | 328 |
| TableV2 Attributes | prop | v-scrollbar-size | vScrollbarSize | 329 |
| TableV2 Attributes | prop | scrollbar-always-on | scrollbarAlwaysOn | 330 |
| TableV2 Attributes | prop | sort-by | sortBy | 331 |
| TableV2 Attributes | prop | sort-state | sortState | 332 |
| TableV2 Slots | slot | cell | renderCell | 338 |
| TableV2 Slots | slot | header | renderHeader | 339 |
| TableV2 Slots | slot | header-cell | renderHeaderCell | 340 |
| TableV2 Slots | slot | row | renderRow | 341 |
| TableV2 Slots | slot | footer | renderFooter | 342 |
| TableV2 Slots | slot | empty | renderEmpty | 343 |
| TableV2 Slots | slot | overlay | renderOverlay | 344 |
| TableV2 Events | event | column-sort | onColumnSort | 350 |
| TableV2 Events | event | expanded-rows-change | onExpandedRowsChange | 351 |
| TableV2 Events | event | end-reached | onEndReached | 352 |
| TableV2 Events | event | scroll | onScroll | 353 |
| TableV2 Events | event | rows-rendered | onRowsRendered | 354 |
| TableV2 Events | event | row-expand | onRowExpand | 355 |
| TableV2 Exposes | ref | scrollTo | ref.current.scrollTo | 361 |
| TableV2 Exposes | ref | scrollToLeft | ref.current.scrollToLeft | 362 |
| TableV2 Exposes | ref | scrollToTop | ref.current.scrollToTop | 363 |
| TableV2 Exposes | ref | scrollToRow | ref.current.scrollToRow | 364 |
| Column Attribute | prop | align | align | 376 |
| Column Attribute | prop | class | className | 377 |
| Column Attribute | prop | key | key | 378 |
| Column Attribute | prop | dataKey | dataKey | 379 |
| Column Attribute | prop | fixed | fixed | 380 |
| Column Attribute | prop | flexGrow | flexGrow | 381 |
| Column Attribute | prop | flexShrink | flexShrink | 382 |
| Column Attribute | prop | headerClass | headerClass | 383 |
| Column Attribute | prop | hidden | hidden | 384 |
| Column Attribute | prop | style | style | 385 |
| Column Attribute | prop | sortable | sortable | 386 |
| Column Attribute | prop | title | title | 387 |
| Column Attribute | prop | maxWidth | maxWidth | 388 |
| Column Attribute | prop | minWidth | minWidth | 389 |
| Column Attribute | prop | width | width | 390 |
| Column Attribute | prop | cellRenderer | cellRenderer | 391 |
| Column Attribute | prop | headerCellRenderer | headerCellRenderer | 392 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| table-v2:302 | TableV2 Attributes | cache | Number of rows rendered in advance to boost the performance | `number` | 2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:303 | TableV2 Attributes | estimated-row-height | The estimated row height for rendering dynamic height rows | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:304 | TableV2 Attributes | header-class | Customized class name passed to header wrapper | `string` / Function<[HeaderClassGetter](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:305 | TableV2 Attributes | header-props | Customized props name passed to header component | `object` / Function<[HeaderPropsGetter](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:306 | TableV2 Attributes | header-cell-props | Customized props name passed to header cell component | `object` / Function<[HeaderCellPropsGetter](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:307 | TableV2 Attributes | header-height | The height of the header is set by `height`. If given an array, it renders header rows equal to its length | `number`/ `number[]` | 50 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:308 | TableV2 Attributes | footer-height | The height of the footer element, when provided, will be part to the calculation of the table's height. | `number` | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:309 | TableV2 Attributes | row-class | Customized class name passed to row wrapper | `string` / Function<[RowClassGetter](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:310 | TableV2 Attributes | row-key | The key of each row, if not provided, will be the index of the row | `string` / `Symbol` / `number` | id | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:311 | TableV2 Attributes | row-props | Customized props name passed to row component | `object` / Function<[RowPropsGetter](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:312 | TableV2 Attributes | row-height | The height of each row, used for calculating the total height of the table | `number` | 50 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:313 | TableV2 Attributes | row-event-handlers | A collection of handlers attached to each row | `object`\<[RowEventHandlers](#typings)\> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:314 | TableV2 Attributes | cell-props | extra props passed to each cell (except header cells) | `object` / Function<[CellPropsGetter](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:315 | TableV2 Attributes | columns | An array of column definitions. | [Column[]](#column-attribute) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:316 | TableV2 Attributes | data | An array of data to be rendered in the table. | [Data[]](#typings) | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:317 | TableV2 Attributes | data-getter | A method to customize data fetch from the data source. | Function<[DataGetter\<T\>](#typings)> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:318 | TableV2 Attributes | fixed-data | Data for rendering rows above the main content and below the header | `object`\<[Data](#typings)\> | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:319 | TableV2 Attributes | expand-column-key | The column key indicates which row is expandable | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:320 | TableV2 Attributes | expanded-row-keys | An array of keys for expanded rows, can be used with `v-model` | [KeyType[]](#typings) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:321 | TableV2 Attributes | default-expanded-row-keys | An array of keys for default expanded rows, **NON REACTIVE** | [KeyType[]](#typings) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:322 | TableV2 Attributes | class | Class name for the virtual table, will be applied to all three tables (left, right, main) | `string` / `array` / `object` | — | 保留根节点与内部节点位置，不覆盖必需状态类名。 |
| table-v2:323 | TableV2 Attributes | fixed | Flag indicates the table column's width to be fixed or flexible. | `boolean` | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:324 | TableV2 Attributes | width | Width of the table | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:325 | TableV2 Attributes | height | Height of the table | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:326 | TableV2 Attributes | max-height | Maximum height of the table | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:327 | TableV2 Attributes | indent-size | horizontal indentation of tree table | `number` | 12 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:328 | TableV2 Attributes | h-scrollbar-size | Indicates the horizontal scrollbar's size for the table, used to prevent the horizontal and vertical scrollbar to collapse | `number` | 6 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:329 | TableV2 Attributes | v-scrollbar-size | Indicates the vertical scrollbar's size for the table, used to prevent the horizontal and vertical scrollbar to collapse | `number` | 6 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:330 | TableV2 Attributes | scrollbar-always-on | If true, the scrollbar will always be shown instead of when mouse is placed above the table | `boolean` | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:331 | TableV2 Attributes | sort-by | Sort indicator | `object`\<[SortBy](#typings)\> | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:332 | TableV2 Attributes | sort-state | Multiple sort indicator | `object`\<[SortState](#typings)\> | undefined | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:338 | TableV2 Slots | cell | 参见原表其他列 | `object`\<[CellSlotProps](#typings)\> | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:339 | TableV2 Slots | header | 参见原表其他列 | `object`\<[HeaderSlotProps](#typings)\> | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:340 | TableV2 Slots | header-cell | 参见原表其他列 | `object`\<[HeaderCellSlotProps](#typings)\> | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:341 | TableV2 Slots | row | 参见原表其他列 | `object`\<[RowSlotProps](#typings)\> | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:342 | TableV2 Slots | footer | 参见原表其他列 | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:343 | TableV2 Slots | empty | 参见原表其他列 | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:344 | TableV2 Slots | overlay | 参见原表其他列 | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table-v2:350 | TableV2 Events | column-sort | Invoked when column sorted | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table-v2:351 | TableV2 Events | expanded-rows-change | Invoked when expanded rows changed | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table-v2:352 | TableV2 Events | end-reached | Invoked when the end of the table is reached. The callback contain the remain distance, it is the usually the scrollbar height. | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table-v2:353 | TableV2 Events | scroll | Invoked after scrolling | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table-v2:354 | TableV2 Events | rows-rendered | Invoked when rows are rendered | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table-v2:355 | TableV2 Events | row-expand | Invoked when expand/collapse the tree node by clicking the arrow icon | — | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table-v2:361 | TableV2 Exposes | scrollTo | Scroll to a given position | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table-v2:362 | TableV2 Exposes | scrollToLeft | Scroll to a given horizontal position | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table-v2:363 | TableV2 Exposes | scrollToTop | Scroll to a given vertical position | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table-v2:364 | TableV2 Exposes | scrollToRow | scroll to a given row with specified scroll strategy | — | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table-v2:376 | Column Attribute | align | Alignment of the table cell content | [Alignment](https://github.com/element-plus/element-plus/blob/b92b22932758f0ddea98810ae248f6ca62f77e25/packages/components/table-v2/src/constants.ts#L6) | left | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:377 | Column Attribute | class | Class name for the column | `string` | — | 保留根节点与内部节点位置，不覆盖必需状态类名。 |
| table-v2:378 | Column Attribute | key | Unique identification | [KeyType](#typings) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:379 | Column Attribute | dataKey | Unique identification of data | [KeyType](#typings) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:380 | Column Attribute | fixed | Fixed direction of the column | `boolean` / [FixedDir](https://github.com/element-plus/element-plus/blob/b92b22932758f0ddea98810ae248f6ca62f77e25/packages/components/table-v2/src/constants.ts#L11) | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:381 | Column Attribute | flexGrow | CSSProperties flex grow, Only useful when this is not a fixed table | `number` | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:382 | Column Attribute | flexShrink | CSSProperties flex shrink, Only useful when this is not a fixed table | `number` | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:383 | Column Attribute | headerClass | Used for customizing header column class | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:384 | Column Attribute | hidden | Whether the column is invisible | `boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:385 | Column Attribute | style | Customized style for column cell, will be merged with grid cell | ^[object]`CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:386 | Column Attribute | sortable | Indicates whether the column is sortable | `boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:387 | Column Attribute | title | The default text rendered in header cell | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:388 | Column Attribute | maxWidth | Maximum width for the column | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:389 | Column Attribute | minWidth | Minimum width for the column | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:390 | Column Attribute | width | Width for the column | `number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:391 | Column Attribute | cellRenderer | Customized Cell renderer | `VueComponent` / (props: [CellRenderProps](#typings)) => VNode | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table-v2:392 | Column Attribute | headerCellRenderer | Customized Header renderer | `VueComponent` / (props: [HeaderRenderProps](#typings)) => VNode | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/table-v2](../../reference/element-plus/packages/components/table-v2/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/table-v2/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/auto-resizer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/cell-templating.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/selection.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/inline-editing.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/row-class.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/sticky-rows.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/fixed-columns.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/grouping-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/filter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/sort.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/controlled-sort.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/cross-hovering.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/colspan.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/rowspan.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/spans.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/tree-data.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/dynamic-height.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/detailed-view.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/footer.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/empty.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/overlay.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table-v2/manual-scroll.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
