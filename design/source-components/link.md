# Link 源码目录设计

- 来源：packages/components/link
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：语义色、下划线、禁用、图标；href/target 等原生链接属性；全局默认值和键盘语义。
- 家族设计：[link](../components/link.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/link/index.ts（SHA256 1cafefadae51516d274117846cd13c640ff4093cd2902eeb8d18b4c1d5e143f9）
- packages/components/link/src/link.ts（SHA256 d1414f921b20bb11207b94e24c376e27f985eea2cef1b660722891b88b0aaf8d）
- packages/components/link/src/link.vue（SHA256 323a3207c23991007991c55e36334547c8b89b5f818a80af3aaf743512bed21c）
- packages/components/link/style/css.ts（SHA256 8c1f8653f9c59649aa7767668ad34e326795f03ae61a5d3b660ef5729ee9d42d）
- packages/components/link/style/index.ts（SHA256 ab6db51f072c759f356fd7b0f0306ff151f45d18efc2c5402b0531b337a09255）
- packages/components/link/__tests__/link.test.tsx（SHA256 5ce7300c97c49b0fabeb08f253bee1c837087b4dd7bf1cea36a43cbf9c085719）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Link.vue — packages/components/link/__tests__/link.test.tsx
- render test — packages/components/link/__tests__/link.test.tsx
- it should handle click event when link is not disabled — packages/components/link/__tests__/link.test.tsx
- it should disable click when link is disabled — packages/components/link/__tests__/link.test.tsx
- icon slots — packages/components/link/__tests__/link.test.tsx
- underline prop — packages/components/link/__tests__/link.test.tsx
- it should show underline on hover when true — packages/components/link/__tests__/link.test.tsx
- it should not show any underline when false — packages/components/link/__tests__/link.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
