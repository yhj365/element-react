# Badge 源码目录设计

- 来源：packages/components/badge
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：数字/文本、最大值折叠、小圆点；隐藏与零值规则；颜色、偏移和自定义内容；定位与读屏提示。
- 家族设计：[badge](../components/badge.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/badge/index.ts（SHA256 2a9dc79cd5dadeccfb8053205de4045cc1fff306e4e6b7e5ee75d3dd9a584ead）
- packages/components/badge/src/badge.ts（SHA256 4d49355f1e67ee15c05389c91f5e0bca5275994442c6e6456a46984a2cc00a06）
- packages/components/badge/src/badge.vue（SHA256 05b30df4c2e61bcec8b2318c9c82ab4fed53e9d6ba8a7eb61fcbaca2159fe822）
- packages/components/badge/src/instance.ts（SHA256 0501b39ed4cfecc57aef161b285a21bc0800b1ed8250dfa066927eb8c726f60a）
- packages/components/badge/style/css.ts（SHA256 2c76d077e0b9ead0bc9f780c110b2d50bcb3a359cad27879462794173220ef95）
- packages/components/badge/style/index.ts（SHA256 a13354c627c7110df619c4707b46c8533206221e018ec1f0ef5b49429cc6ea07）
- packages/components/badge/__tests__/badge.test.tsx（SHA256 d3ce3378a3c71395e2c4f64930cb283b30ff32a46cfe88bd454105eff93985a3）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Badge — packages/components/badge/__tests__/badge.test.tsx
- has value — packages/components/badge/__tests__/badge.test.tsx
- is fixed — packages/components/badge/__tests__/badge.test.tsx
- is dot — packages/components/badge/__tests__/badge.test.tsx
- is dot with type — packages/components/badge/__tests__/badge.test.tsx
- hidden — packages/components/badge/__tests__/badge.test.tsx
- max — packages/components/badge/__tests__/badge.test.tsx
- showZero — packages/components/badge/__tests__/badge.test.tsx
- showZero with max — packages/components/badge/__tests__/badge.test.tsx
- color — packages/components/badge/__tests__/badge.test.tsx
- badgeStyle — packages/components/badge/__tests__/badge.test.tsx
- badgeClass — packages/components/badge/__tests__/badge.test.tsx
- offset — packages/components/badge/__tests__/badge.test.tsx
- content slot — packages/components/badge/__tests__/badge.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
