# MenuItem 源码目录设计

- 来源：packages/components/menu-item
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：横向/纵向、展开/折叠、唯一展开；MenuItem/SubMenu/MenuItemGroup；激活路径、禁用、路由适配；溢出、弹出层、键盘与选择/打开/关闭事件。
- 家族设计：[menu](../components/menu.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/menu-item/style/css.ts（SHA256 389084329b6a831bdad43734fdff48b266955a3e09757412f17ff0a11746bee8）
- packages/components/menu-item/style/index.ts（SHA256 ec6f6b91c2d066f906c15f8a973610375a1b1fe68fb0b175e7fbbaca80c488d3）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
