# Segmented 源码目录设计

- 来源：packages/components/segmented
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：标量/对象选项、label/value/disabled；尺寸、方向、块级；自定义渲染；选中背景动画、键盘与表单。
- 家族设计：[segmented](../components/segmented.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/segmented/index.ts（SHA256 22aa1fd2f4fed2b0087b31a5f86aba4ce7c488618126bc8935e3d50fe95abd4b）
- packages/components/segmented/src/segmented.ts（SHA256 39e589b990db3fe8041582bd5714a73497bcbdd00bebc2e50fa14a4da274ae69）
- packages/components/segmented/src/segmented.vue（SHA256 acff41aa42402d0a9609c2596dffdd6dadf6dac68a083861bcac2826389ae089）
- packages/components/segmented/src/types.ts（SHA256 e58d338b71b9fd894dc5e0be3c9771a5838f122aeaa7cfb878821ca4efd35d58）
- packages/components/segmented/style/css.ts（SHA256 873ec9a5dd281786611dad2cd4ed434e4bc290729f0a16dc3973293327b8d8b7）
- packages/components/segmented/style/index.ts（SHA256 e504654ce43c78b24b123db62acfa4997d4496da462dba25a7b432d4cbe62dbe）
- packages/components/segmented/__tests__/segmented.test.tsx（SHA256 0017accc4a6a5a918e1e51c7a961d7d373a10e9716116dac3bf5ac789efdb2bc）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Segmented.vue — packages/components/segmented/__tests__/segmented.test.tsx
- render test — packages/components/segmented/__tests__/segmented.test.tsx
- render v-model — packages/components/segmented/__tests__/segmented.test.tsx
- render options — packages/components/segmented/__tests__/segmented.test.tsx
- render block — packages/components/segmented/__tests__/segmented.test.tsx
- render size — packages/components/segmented/__tests__/segmented.test.tsx
- render disabled — packages/components/segmented/__tests__/segmented.test.tsx
- render option disabled — packages/components/segmented/__tests__/segmented.test.tsx
- render options props — packages/components/segmented/__tests__/segmented.test.tsx
- render accessible attributes — packages/components/segmented/__tests__/segmented.test.tsx
- async disabled — packages/components/segmented/__tests__/segmented.test.tsx
- should fire the change event until it is equal to model-value — packages/components/segmented/__tests__/segmented.test.tsx
- should update indicator when options are reordered — packages/components/segmented/__tests__/segmented.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/segmented/__tests__/segmented.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
