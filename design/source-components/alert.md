# Alert 源码目录设计

- 来源：packages/components/alert
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：success/info/warning/error；标题、描述和图标；浅色/深色效果；居中与关闭按钮、自定义关闭文本、关闭事件。
- 家族设计：[alert](../components/alert.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/alert/index.ts（SHA256 32c90ad26a81f5153a0c97f56ce6f42c0f2685d558405d13a3ea69c1a93e5c96）
- packages/components/alert/src/alert.ts（SHA256 f6c476c7eeaa30e20e0dc7729e0ca440c63a5b86c0b4d7c5133f5f5dcd0cbbcb）
- packages/components/alert/src/alert.vue（SHA256 8b5f62e5c7ea9aeb7173d523a7bd0b2272b4cad42888b930a75441b54c81da63）
- packages/components/alert/src/instance.ts（SHA256 ac57afeae8ee2bd8736b1f698903989501bf1d1c007fd5120b9504b3943ae90c）
- packages/components/alert/style/css.ts（SHA256 160880101fc07bf268265b7fa48c5b5a27b60fcce9d79ea415735a725d45b517）
- packages/components/alert/style/index.ts（SHA256 1722dde4a679472a68ff1bcecb0c871a1ef88811f5c30ebaa1bd1e4435033748）
- packages/components/alert/__tests__/alert.test.tsx（SHA256 bf5eb0296ae2f3d6600b5da95acf15604fceeb9a54d309bff78cd670371733db）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Alert.vue — packages/components/alert/__tests__/alert.test.tsx
- render test & class — packages/components/alert/__tests__/alert.test.tsx
- type — packages/components/alert/__tests__/alert.test.tsx
- description — packages/components/alert/__tests__/alert.test.tsx
- theme — packages/components/alert/__tests__/alert.test.tsx
- title slot — packages/components/alert/__tests__/alert.test.tsx
- close — packages/components/alert/__tests__/alert.test.tsx
- default slot — packages/components/alert/__tests__/alert.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
