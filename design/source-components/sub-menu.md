# SubMenu 源码目录设计

- 来源：packages/components/sub-menu
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：横向/纵向、展开/折叠、唯一展开；MenuItem/SubMenu/MenuItemGroup；激活路径、禁用、路由适配；溢出、弹出层、键盘与选择/打开/关闭事件。
- 家族设计：[menu](../components/menu.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/sub-menu/style/css.ts（SHA256 185463e3529303f300a3cb114ecbf40a8465195eff6ecbe3a4ebac4e238bc591）
- packages/components/sub-menu/style/index.ts（SHA256 58b0226b919f7c33e06a0f4232385eb0f1bccd57181eb26cad1150709a8a5cf3）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
