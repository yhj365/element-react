# TableColumn 源码目录设计

- 来源：packages/components/table-column
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：TableColumn；列分组、宽度、固定列、表头；选择/保留选择、排序/自定义排序、筛选；展开/树/懒加载；合计/合并单元格、索引；溢出提示、滚动、布局和全套实例方法。
- 家族设计：[table](../components/table.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/table-column/style/css.ts（SHA256 396a20711e1fb92edd331e5dc787e184835263271224141cc16cbd6d725b920c）
- packages/components/table-column/style/index.ts（SHA256 61cd2e36a69c893301280f9605f99821a92b2d3b7f4c9b34e3bf02e1c68cdca9）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
