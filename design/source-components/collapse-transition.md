# CollapseTransition 源码目录设计

- 来源：packages/components/collapse-transition
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：多展开/手风琴；CollapseItem 标识、禁用、标题和图标；受控展开项；过渡、键盘操作和变化通知。
- 家族设计：[collapse](../components/collapse.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/collapse-transition/index.ts（SHA256 7b8001d57fac9e8bea88478ca2099c07dd0435d71067e71e3996fb21524851d7）
- packages/components/collapse-transition/src/collapse-transition.vue（SHA256 4a98a7f4c32cab18b88c8158dd6bf9ef3e9f37d06f238a59df8f0ea509331087）
- packages/components/collapse-transition/style/css.ts（SHA256 4c4dbe276b79bf261ee1bab2911927b6da9a8df07a5b1670d3b34cfe394ffa90）
- packages/components/collapse-transition/style/index.ts（SHA256 b4b60c1109b549904f489551925a088384cec99d3e3e3dadacf819904208d1f3）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
