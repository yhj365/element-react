# Table 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/table.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- TableColumn。
- 列分组、宽度、固定列、表头。
- 选择/保留选择、排序/自定义排序、筛选。
- 展开/树/懒加载。
- 合计/合并单元格、索引。
- 溢出提示、滚动、布局和全套实例方法。

## 2. 源文档场景清单

- [ ] Basic table（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Striped Table（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Table with border（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Table with status（原文第38行）：建立React示例与对应行为/视觉断言。
- [ ] Table with show overflow tooltip（原文第48行）：建立React示例与对应行为/视觉断言。
- [ ] Table with fixed header（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Table with fixed column（原文第68行）：建立React示例与对应行为/视觉断言。
- [ ] Table with fixed columns and header（原文第78行）：建立React示例与对应行为/视觉断言。
- [ ] Fluid-height Table with fixed header (and columns)（原文第88行）：建立React示例与对应行为/视觉断言。
- [ ] Grouping table head（原文第98行）：建立React示例与对应行为/视觉断言。
- [ ] Table with fixed group header（原文第108行）：建立React示例与对应行为/视觉断言。
- [ ] Single select（原文第118行）：建立React示例与对应行为/视觉断言。
- [ ] Multiple select（原文第128行）：建立React示例与对应行为/视觉断言。
- [ ] Sorting（原文第140行）：建立React示例与对应行为/视觉断言。
- [ ] Filter（原文第150行）：建立React示例与对应行为/视觉断言。
- [ ] Custom column template（原文第160行）：建立React示例与对应行为/视觉断言。
- [ ] Table with custom header（原文第170行）：建立React示例与对应行为/视觉断言。
- [ ] Expandable row（原文第180行）：建立React示例与对应行为/视觉断言。
- [ ] Tree data and lazy mode（原文第192行）：建立React示例与对应行为/视觉断言。
- [ ] Selectable tree ^(2.8.0)（原文第200行）：建立React示例与对应行为/视觉断言。
- [ ] Summary row（原文第208行）：建立React示例与对应行为/视觉断言。
- [ ] Rowspan and colspan（原文第218行）：建立React示例与对应行为/视觉断言。
- [ ] Custom index（原文第228行）：建立React示例与对应行为/视觉断言。
- [ ] Table Layout（原文第238行）：建立React示例与对应行为/视觉断言。
- [ ] Tooltip formatter ^(2.9.4)（原文第248行）：建立React示例与对应行为/视觉断言。
- [ ] FAQ（原文第491行）：建立React示例与对应行为/视觉断言。
- [ ] How to infer the correct slot types for `el-table-column`?（原文第493行）：建立React示例与对应行为/视觉断言。
- [ ] How to use image preview in the table?（原文第524行）：建立React示例与对应行为/视觉断言。
- [ ] Why column is not rendered when use DOM templates?（原文第536行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

列元数据与行数据分开管理，rowKey支撑选择/展开/树节点稳定性；selection、sort、filters、expandedRows、currentRow分别建模。列注册顺序对应DOM顺序，动态列触发布局失效。远程排序仅发事件，不能额外改排业务数据；保留选择、跨页、懒载和合并单元格分别建对照用例。

## 3. React 19 结构与交互契约

- 主导出拟为 Table，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Table Attributes | prop | data | data | 264 |
| Table Attributes | prop | height | height | 265 |
| Table Attributes | prop | max-height | maxHeight | 266 |
| Table Attributes | prop | stripe | stripe | 267 |
| Table Attributes | prop | border | border | 268 |
| Table Attributes | prop | size | size | 269 |
| Table Attributes | prop | fit | fit | 270 |
| Table Attributes | prop | show-header | showHeader | 271 |
| Table Attributes | prop | highlight-current-row | highlightCurrentRow | 272 |
| Table Attributes | prop | current-row-key | currentRowKey | 273 |
| Table Attributes | prop | row-class-name | rowClassName | 274 |
| Table Attributes | prop | row-style | rowStyle | 275 |
| Table Attributes | prop | cell-class-name | cellClassName | 276 |
| Table Attributes | prop | cell-style | cellStyle | 277 |
| Table Attributes | prop | header-row-class-name | headerRowClassName | 278 |
| Table Attributes | prop | header-row-style | headerRowStyle | 279 |
| Table Attributes | prop | header-cell-class-name | headerCellClassName | 280 |
| Table Attributes | prop | header-cell-style | headerCellStyle | 281 |
| Table Attributes | prop | row-key | rowKey | 282 |
| Table Attributes | prop | empty-text | emptyText | 283 |
| Table Attributes | prop | default-expand-all | defaultExpandAll | 284 |
| Table Attributes | prop | expand-row-keys | expandRowKeys | 285 |
| Table Attributes | prop | default-sort | defaultSort | 286 |
| Table Attributes | prop | tooltip-effect | tooltipEffect | 287 |
| Table Attributes | prop | tooltip-options | tooltipOptions | 288 |
| Table Attributes | prop | append-filter-panel-to | appendFilterPanelTo | 289 |
| Table Attributes | prop | show-summary | showSummary | 290 |
| Table Attributes | prop | sum-text | sumText | 291 |
| Table Attributes | prop | summary-method | summaryMethod | 292 |
| Table Attributes | prop | span-method | spanMethod | 293 |
| Table Attributes | prop | select-on-indeterminate | selectOnIndeterminate | 294 |
| Table Attributes | prop | indent | indent | 295 |
| Table Attributes | prop | lazy | lazy | 296 |
| Table Attributes | prop | load | load | 297 |
| Table Attributes | prop | tree-props | treeProps | 298 |
| Table Attributes | prop | table-layout | tableLayout | 299 |
| Table Attributes | prop | scrollbar-always-on | scrollbarAlwaysOn | 300 |
| Table Attributes | prop | show-overflow-tooltip | showOverflowTooltip | 301 |
| Table Attributes | prop | flexible | flexible | 302 |
| Table Attributes | prop | scrollbar-tabindex | scrollbarTabindex | 303 |
| Table Attributes | prop | allow-drag-last-column | allowDragLastColumn | 304 |
| Table Attributes | prop | tooltip-formatter | tooltipFormatter | 305 |
| Table Attributes | prop | preserve-expanded-content | preserveExpandedContent | 306 |
| Table Attributes | prop | native-scrollbar | nativeScrollbar | 307 |
| Table Attributes | prop | row-expandable | rowExpandable | 308 |
| Table Events | event | select | onSelect | 314 |
| Table Events | event | select-all | onSelectAll | 315 |
| Table Events | event | selection-change | onSelectionChange | 316 |
| Table Events | event | cell-mouse-enter | onCellMouseEnter | 317 |
| Table Events | event | cell-mouse-leave | onCellMouseLeave | 318 |
| Table Events | event | cell-click | onCellClick | 319 |
| Table Events | event | cell-dblclick | onCellDblclick | 320 |
| Table Events | event | cell-contextmenu | onCellContextmenu | 321 |
| Table Events | event | row-click | onRowClick | 322 |
| Table Events | event | row-contextmenu | onRowContextmenu | 323 |
| Table Events | event | row-dblclick | onRowDblclick | 324 |
| Table Events | event | header-click | onHeaderClick | 325 |
| Table Events | event | header-contextmenu | onHeaderContextmenu | 326 |
| Table Events | event | sort-change | onSortChange | 327 |
| Table Events | event | filter-change | onFilterChange | 328 |
| Table Events | event | current-change | onCurrentChange | 329 |
| Table Events | event | header-dragend | onHeaderDragend | 330 |
| Table Events | event | expand-change | onExpandChange | 331 |
| Table Events | event | scroll | onScroll | 332 |
| Table Slots | slot | default | children | 338 |
| Table Slots | slot | append | renderAppend | 339 |
| Table Slots | slot | empty | renderEmpty | 340 |
| Table Exposes | ref | clearSelection | ref.current.clearSelection | 346 |
| Table Exposes | ref | getSelectionRows | ref.current.getSelectionRows | 347 |
| Table Exposes | ref | getHalfSelectionRows | ref.current.getHalfSelectionRows | 348 |
| Table Exposes | ref | toggleRowSelection | ref.current.toggleRowSelection | 349 |
| Table Exposes | ref | toggleAllSelection | ref.current.toggleAllSelection | 350 |
| Table Exposes | ref | toggleRowExpansion | ref.current.toggleRowExpansion | 351 |
| Table Exposes | ref | setCurrentRow | ref.current.setCurrentRow | 352 |
| Table Exposes | ref | clearSort | ref.current.clearSort | 353 |
| Table Exposes | ref | clearFilter | ref.current.clearFilter | 354 |
| Table Exposes | ref | doLayout | ref.current.doLayout | 355 |
| Table Exposes | ref | sort | ref.current.sort | 356 |
| Table Exposes | ref | scrollTo | ref.current.scrollTo | 357 |
| Table Exposes | ref | setScrollTop | ref.current.setScrollTop | 358 |
| Table Exposes | ref | setScrollLeft | ref.current.setScrollLeft | 359 |
| Table Exposes | ref | columns | ref.current.columns | 360 |
| Table Exposes | ref | updateKeyChildren | ref.current.updateKeyChildren | 361 |
| Table-column Attributes | prop | type | type | 369 |
| Table-column Attributes | prop | index | index | 370 |
| Table-column Attributes | prop | label | label | 371 |
| Table-column Attributes | prop | column-key | columnKey | 372 |
| Table-column Attributes | prop | prop | prop | 373 |
| Table-column Attributes | prop | width | width | 374 |
| Table-column Attributes | prop | min-width | minWidth | 375 |
| Table-column Attributes | prop | fixed | fixed | 376 |
| Table-column Attributes | prop | render-header | renderHeader | 377 |
| Table-column Attributes | prop | sortable | sortable | 378 |
| Table-column Attributes | prop | sort-method | sortMethod | 379 |
| Table-column Attributes | prop | sort-by | sortBy | 380 |
| Table-column Attributes | prop | sort-orders | sortOrders | 381 |
| Table-column Attributes | prop | resizable | resizable | 382 |
| Table-column Attributes | prop | formatter | formatter | 383 |
| Table-column Attributes | prop | show-overflow-tooltip | showOverflowTooltip | 384 |
| Table-column Attributes | prop | align | align | 385 |
| Table-column Attributes | prop | header-align | headerAlign | 386 |
| Table-column Attributes | prop | class-name | className | 387 |
| Table-column Attributes | prop | label-class-name | labelClassName | 388 |
| Table-column Attributes | prop | selectable | selectable | 389 |
| Table-column Attributes | prop | reserve-selection | reserveSelection | 390 |
| Table-column Attributes | prop | filters | filters | 391 |
| Table-column Attributes | prop | filter-placement | filterPlacement | 392 |
| Table-column Attributes | prop | filter-class-name | filterClassName | 393 |
| Table-column Attributes | prop | filter-multiple | filterMultiple | 394 |
| Table-column Attributes | prop | filter-method | filterMethod | 395 |
| Table-column Attributes | prop | filtered-value | filteredValue | 396 |
| Table-column Attributes | prop | tooltip-formatter | tooltipFormatter | 397 |
| Table-column Slots | slot | default | children | 403 |
| Table-column Slots | slot | header | renderHeader | 404 |
| Table-column Slots | slot | filter-icon | renderFilterIcon | 405 |
| Table-column Slots | slot | expand | renderExpand | 406 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| table:264 | Table Attributes | data | table data | ^[array]`any[]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:265 | Table Attributes | height | table's height. By default it has an `auto` height. If its value is a number, the height is measured in pixels; if its value is a string, the value will be assigned to element's style.height, the height is affected by external styles | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:266 | Table Attributes | max-height | table's max-height. The legal value is a number or the height in px | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:267 | Table Attributes | stripe | whether Table is striped | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:268 | Table Attributes | border | whether Table has vertical border | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:269 | Table Attributes | size | size of Table | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:270 | Table Attributes | fit | whether width of column automatically fits its container | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:271 | Table Attributes | show-header | whether Table header is visible | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:272 | Table Attributes | highlight-current-row | whether current row is highlighted | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:273 | Table Attributes | current-row-key | key of current row, a set only prop | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:274 | Table Attributes | row-class-name | function that returns custom class names for a row, or a string assigning class names for every row | ^[Function]`(data: { row: any, rowIndex: number }) => string` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:275 | Table Attributes | row-style | function that returns custom style for a row, or an object assigning custom style for every row | ^[Function]`(data: { row: any, rowIndex: number }) => CSSProperties` / ^[object]`CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:276 | Table Attributes | cell-class-name | function that returns custom class names for a cell, or a string assigning class names for every cell | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, rowIndex: number, columnIndex: number }) => string` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:277 | Table Attributes | cell-style | function that returns custom style for a cell, or an object assigning custom style for every cell | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, rowIndex: number, columnIndex: number }) => CSSProperties` / ^[object]`CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:278 | Table Attributes | header-row-class-name | function that returns custom class names for a row in table header, or a string assigning class names for every row in table header | ^[Function]`(data: { row: any, rowIndex: number }) => string` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:279 | Table Attributes | header-row-style | function that returns custom style for a row in table header, or an object assigning custom style for every row in table header | ^[Function]`(data: { row: any, rowIndex: number }) => CSSProperties` / ^[object]`CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:280 | Table Attributes | header-cell-class-name | function that returns custom class names for a cell in table header, or a string assigning class names for every cell in table header | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, rowIndex: number, columnIndex: number }) => string` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:281 | Table Attributes | header-cell-style | function that returns custom style for a cell in table header, or an object assigning custom style for every cell in table header | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, rowIndex: number, columnIndex: number }) => CSSProperties` / ^[object]`CSSProperties` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:282 | Table Attributes | row-key | key of row data, used for optimizing rendering. Required if `reserve-selection` is on or display tree data. When its type is String, multi-level access is supported, e.g. `user.info.id`, but `user.info[0].id` is not supported, in which case `Function` should be used | ^[Function]`(row: any) => string` / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:283 | Table Attributes | empty-text | displayed text when data is empty. You can customize this area with `#empty` | ^[string] | No Data | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:284 | Table Attributes | default-expand-all | whether expand all rows by default, works when the table has a column type="expand" or contains tree structure data | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:285 | Table Attributes | expand-row-keys | set expanded rows by this prop, prop's value is the keys of expand rows, you should set row-key before using this prop. | ^[array]`Array<string>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:286 | Table Attributes | default-sort | set the default sort column and order. property `prop` is used to set default sort column, property `order` is used to set default sort order | ^[object]`Sort` | if `prop` is set, and `order` is not set, then `order` is default to ascending | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:287 | Table Attributes | tooltip-effect | the `effect` of the overflow tooltip | ^[enum]`'dark' \| 'light'` | dark | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:288 | Table Attributes | tooltip-options | the options for the overflow tooltip, [see the following tooltip component](./tooltip.md#attributes) | ^[object]`Pick<ElTooltipProps, 'effect' \| 'enterable' \| 'hideAfter' \| 'offset' \| 'placement' \| 'popperClass' \| 'popperOptions' \| 'showAfter' \| 'showArrow'>` | ^[object]`{ enterable: true, placement: 'top', showArrow: true, hideAfter: 200, popperOptions: { strategy: 'fixed' } }` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:289 | Table Attributes | append-filter-panel-to | which element the filter panels appends to | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:290 | Table Attributes | show-summary | whether to display a summary row | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:291 | Table Attributes | sum-text | displayed text for the first column of summary row | ^[string] | Sum | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:292 | Table Attributes | summary-method | custom summary method | ^[Function]`(data: { columns: any[], data: any[] }) => (VNode \| string)[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:293 | Table Attributes | span-method | method that returns rowspan and colspan | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, rowIndex: number, columnIndex: number }) => number[] \| { rowspan: number, colspan: number } \| void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:294 | Table Attributes | select-on-indeterminate | controls the behavior of master checkbox in multi-select tables when only some rows are selected (but not all). If true, all rows will be selected, else deselected | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:295 | Table Attributes | indent | horizontal indentation of tree data | ^[number] | 16 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:296 | Table Attributes | lazy | whether to lazy loading data | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:297 | Table Attributes | load | method for loading child row data, only works when `lazy` is true | ^[Function]`(row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:298 | Table Attributes | tree-props | configuration for rendering nested data | ^[object]`{ hasChildren?: string, children?: string, checkStrictly?: boolean }` | ^[object]`{ hasChildren: 'hasChildren', children: 'children', checkStrictly: false }` | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:299 | Table Attributes | table-layout | sets the algorithm used to lay out table cells, rows, and columns | ^[enum]`'fixed' \| 'auto'` | fixed | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:300 | Table Attributes | scrollbar-always-on | always show scrollbar | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:301 | Table Attributes | show-overflow-tooltip | whether to hide extra content and show them in a tooltip when hovering on the cell.It will affect all the table columns, refer to table [tooltip-options](#table-attributes) | ^[boolean] / [`object`](#table-attributes) ^(2.3.7) | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:302 | Table Attributes | flexible | ensure main axis minimum-size doesn't follow the content | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:303 | Table Attributes | scrollbar-tabindex | body scrollbar's wrap container tabindex | ^[string] / ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:304 | Table Attributes | allow-drag-last-column | whether to allow drag the last column | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:305 | Table Attributes | tooltip-formatter | customize tooltip content when using `show-overflow-tooltip` | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, cellValue: any }) => VNode \| string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:306 | Table Attributes | preserve-expanded-content | whether to preserve expanded row content in DOM when collapsed | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:307 | Table Attributes | native-scrollbar | whether to use native scrollbars | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:308 | Table Attributes | row-expandable | enable expandable rows, works when the table has a column type="expand" | ^[Function]`(row: any, index: number) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:314 | Table Events | select | triggers when user clicks the checkbox in a row | ^[Function]`<T = DefaultRow>(selection: T[], row: T) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:315 | Table Events | select-all | triggers when user clicks the checkbox in table header | ^[Function]`<T = DefaultRow>(selection: T[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:316 | Table Events | selection-change | triggers when selection changes | ^[Function]`<T = DefaultRow>(newSelection: T[]) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:317 | Table Events | cell-mouse-enter | triggers when hovering into a cell | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:318 | Table Events | cell-mouse-leave | triggers when hovering out of a cell | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:319 | Table Events | cell-click | triggers when clicking a cell | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: PointerEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:320 | Table Events | cell-dblclick | triggers when double clicking a cell | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:321 | Table Events | cell-contextmenu | triggers when user right clicks on a cell | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: PointerEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:322 | Table Events | row-click | triggers when clicking a row | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T> \| null, event: PointerEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:323 | Table Events | row-contextmenu | triggers when user right clicks on a row | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T> \| null, event: PointerEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:324 | Table Events | row-dblclick | triggers when double clicking a row | ^[Function]`<T = DefaultRow>(row: T, column: TableColumnCtx<T> \| null, event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:325 | Table Events | header-click | triggers when clicking a column header | ^[Function]`<T = DefaultRow>(column: TableColumnCtx<T>, event: PointerEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:326 | Table Events | header-contextmenu | triggers when user right clicks on a column header | ^[Function]`<T = DefaultRow>(column: TableColumnCtx<T>, event: PointerEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:327 | Table Events | sort-change | triggers when Table's sorting changes | ^[Function]`<T = DefaultRow>(data: {column: TableColumnCtx<T>, prop: string \| null, order: TableSortOrder \| null }) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:328 | Table Events | filter-change | triggers when the table's filter changes | ^[Function]`(newFilters: Record<string, string[]>) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:329 | Table Events | current-change | triggers when current row changes | ^[Function]`<T = DefaultRow>(currentRow: T \| null, oldCurrentRow: T \| null) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:330 | Table Events | header-dragend | triggers after changing a column's width by dragging the column header's border | ^[Function]`<T = DefaultRow>(newWidth: number, oldWidth: number, column: TableColumnCtx<T>, event: MouseEvent) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:331 | Table Events | expand-change | triggers when user expands or collapses a row (for expandable table, second param is expandedRows; for tree Table, second param is expanded) | ^[Function]`<T = DefaultRow>(row: T, expandedRows: T[]) => void & <T = DefaultRow>(row: T, expanded: boolean) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:332 | Table Events | scroll | Invoked after scrolled | ^[Function]`({ scrollLeft: number, scrollTop: number }) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| table:338 | Table Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table:339 | Table Slots | append | Contents to be inserted after the last row. You may need this slot if you want to implement infinite scroll for the table. This slot will be displayed above the summary row if there is one. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table:340 | Table Slots | empty | you can customize content when data is empty. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table:346 | Table Exposes | clearSelection | used in multiple selection Table, clear user selection | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:347 | Table Exposes | getSelectionRows | returns the currently selected rows | ^[Function]`() => any[]` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:348 | Table Exposes | getHalfSelectionRows | returns the currently half-selected rows | ^[Function]`() => any[]` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:349 | Table Exposes | toggleRowSelection | used in multiple selection Table, toggle if a certain row is selected. With the second parameter, you can directly set if this row is selected | ^[Function]`(row: any, selected?: boolean, ignoreSelectable = true) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:350 | Table Exposes | toggleAllSelection | used in multiple selection Table, toggle select all and deselect all | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:351 | Table Exposes | toggleRowExpansion | used in expandable Table or tree Table, toggle if a certain row is expanded. With the second parameter, you can directly set if this row is expanded or collapsed | ^[Function]`(row: any, expanded?: boolean) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:352 | Table Exposes | setCurrentRow | used in single selection Table, set a certain row selected. If called without any parameter, it will clear selection | ^[Function]`(row: any) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:353 | Table Exposes | clearSort | clear sorting, restore data to the original order | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:354 | Table Exposes | clearFilter | clear filters of the columns whose `columnKey` are passed in. If no params, clear all filters | ^[Function]`(columnKeys?: string[]) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:355 | Table Exposes | doLayout | refresh the layout of Table. When the visibility of Table changes, you may need to call this method to get a correct layout | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:356 | Table Exposes | sort | sort Table manually. Property `prop` is used to set sort column, property `order` is used to set sort order | ^[Function]`(prop: string, order: string) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:357 | Table Exposes | scrollTo | scrolls to a particular set of coordinates | ^[Function]`(options: number \| ScrollToOptions, yCoord?: number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:358 | Table Exposes | setScrollTop | set vertical scroll position | ^[Function]`(top?: number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:359 | Table Exposes | setScrollLeft | set horizontal scroll position | ^[Function]`(left?: number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:360 | Table Exposes | columns | Get table columns context. | ^[array]`TableColumnCtx<T>[]` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:361 | Table Exposes | updateKeyChildren | used in lazy Table, must set `rowKey`, update key children | ^[Function]`(key: string, data: T[]) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| table:369 | Table-column Attributes | type | type of the column. If set to `selection`, the column will display checkbox. If set to `index`, the column will display index of the row (staring from 1). If set to `expand`, the column will display expand icon | ^[enum]`'default' \| 'selection' \| 'index' \| 'expand'` | default | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:370 | Table-column Attributes | index | customize indices for each row, works on columns with `type=index` | ^[number] / ^[Function]`(index: number) => number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:371 | Table-column Attributes | label | column label | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:372 | Table-column Attributes | column-key | column's key. If you need to use the filter-change event, you need this attribute to identify which column is being filtered | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:373 | Table-column Attributes | prop | field name. You can also use its alias: `property` | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:374 | Table-column Attributes | width | column width | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:375 | Table-column Attributes | min-width | column minimum width. Columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion | ^[string] / ^[number] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:376 | Table-column Attributes | fixed | whether column is fixed at left / right. Will be fixed at left if `true` | ^[enum]`'left' \| 'right'` / ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:377 | Table-column Attributes | render-header | render function for table header of this column | ^[Function]`(data: { column: TableColumnCtx<T>, $index: number }) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:378 | Table-column Attributes | sortable | whether column can be sorted. Remote sorting can be done by setting this attribute to 'custom' and listening to the `sort-change` event of Table | ^[boolean] / ^[string] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:379 | Table-column Attributes | sort-method | sorting method, works when `sortable` is `true`. Should return a number, just like Array.sort | ^[Function]`<T = any>(a: T, b: T) => number` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:380 | Table-column Attributes | sort-by | specify which property to sort by, works when `sortable` is `true` and `sort-method` is `undefined`. If set to an Array, the column will sequentially sort by the next property if the previous one is equal | ^[Function]`(row: any, index: number) => string` / ^[string] / ^[array]`string[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:381 | Table-column Attributes | sort-orders | the order of the sorting strategies used when sorting the data, works when `sortable` is `true`. Accepts an array, as the user clicks on the header, the column is sorted in order of the elements in the array | ^[object]`('ascending' \| 'descending' \| null)[]` | ['ascending', 'descending', null] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:382 | Table-column Attributes | resizable | whether column width can be resized, works when `border` of `el-table` is `true` | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:383 | Table-column Attributes | formatter | function that formats cell content | ^[Function]`(row: any, column: TableColumnCtx<T>, cellValue: any, index: number) => VNode \| string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:384 | Table-column Attributes | show-overflow-tooltip | whether to hide extra content and show them in a tooltip when hovering on the cell | ^[boolean] / [`object`](#table-attributes) ^(2.2.28) | undefined | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:385 | Table-column Attributes | align | alignment | ^[enum]`'left' \| 'center' \| 'right'` | left | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:386 | Table-column Attributes | header-align | alignment of the table header. If omitted, the value of the above `align` attribute will be applied | ^[enum]`'left' \| 'center' \| 'right'` | left | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:387 | Table-column Attributes | class-name | class name of cells in the column | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:388 | Table-column Attributes | label-class-name | class name of the label of this column | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:389 | Table-column Attributes | selectable | function that determines if a certain row can be selected, works when `type` is 'selection' | ^[Function]`(row: any, index: number) => boolean` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:390 | Table-column Attributes | reserve-selection | whether to reserve selection after data refreshing, works when `type` is 'selection'. Note that `row-key` is required for this to work | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:391 | Table-column Attributes | filters | an array of data filtering options. For each element in this array, `text` and `value` are required | ^[array]`Array<{text: string, value: string}>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:392 | Table-column Attributes | filter-placement | placement for the filter dropdown | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:393 | Table-column Attributes | filter-class-name | className for the filter dropdown | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:394 | Table-column Attributes | filter-multiple | whether data filtering supports multiple options | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:395 | Table-column Attributes | filter-method | data filtering method. If `filter-multiple` is on, this method will be called multiple times for each row, and a row will display if one of the calls returns `true` | ^[Function]`(value: any, row: any, column: TableColumnCtx<T>) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:396 | Table-column Attributes | filtered-value | filter value for selected data, might be useful when table header is rendered with `render-header` | ^[array]`string[]` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:397 | Table-column Attributes | tooltip-formatter | customize tooltip content when using `show-overflow-tooltip` | ^[Function]`(data: { row: any, column: TableColumnCtx<T>, cellValue: any }) => VNode \| string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| table:403 | Table-column Slots | default | Custom content for table columns | ^[object]`{ row: any, column: TableColumnCtx<T>, $index: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table:404 | Table-column Slots | header | Custom content for table header | ^[object]`{ column: TableColumnCtx<T>, $index: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table:405 | Table-column Slots | filter-icon | Custom content for filter icon | ^[object]`{ filterOpened: boolean }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| table:406 | Table-column Slots | expand | Custom content for expand columns. The `expandable` property is supported starting from v2.13.2. | ^[object]`{ expanded: boolean, expandable: boolean }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/table](../../reference/element-plus/packages/components/table/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/table-column](../source-components/table-column.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/table/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/striped.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/with-border.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/with-status.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/show-overflow-tooltip.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/fixed-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/fixed-column.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/fixed-column-and-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/fixed-header-with-fluid-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/grouping-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/fixed-column-and-group-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/single-select.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/multi-select.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/sort.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/filter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/custom-column.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/custom-header.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/expandable-row.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/tree-and-lazy.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/check-strictly.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/summary.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/rowspan-and-colspan.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/custom-index.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/table-layout.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/table/tooltip-formatter.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
