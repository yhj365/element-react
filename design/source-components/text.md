# Text 源码目录设计

- 来源：packages/components/text
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：尺寸、语义色、自定义标签；截断和多行截断；内联文本和样式继承。
- 家族设计：[text](../components/text.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/text/index.ts（SHA256 bb7164a45975d436b0746c68c477c230616dd1dcf40360932fe83d691902b295）
- packages/components/text/src/text.ts（SHA256 fd0448a43979a3cd2a6fc628005e2c65e94f4bee6114d3ae28b015e9e51004dd）
- packages/components/text/src/text.vue（SHA256 a543fbcbb7911b88ca82ab159d70c8ddf1f7bd3686d8aeb3e814556cbce4a36a）
- packages/components/text/style/css.ts（SHA256 8721382a2b7c08d652a513a5a6499dc873dcffda2d87aafd831738d897313d94）
- packages/components/text/style/index.ts（SHA256 117f59d00f2541b98ac31ee7bb1622e3bf68b1639c006d9c93b345cde3bd67aa）
- packages/components/text/__tests__/text.test.tsx（SHA256 79f08e5445025653ab0c61049dbefd0e2d31ecb578e05e654b1c8915ea133822）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Text.vue — packages/components/text/__tests__/text.test.tsx
- create — packages/components/text/__tests__/text.test.tsx
- type — packages/components/text/__tests__/text.test.tsx
- size — packages/components/text/__tests__/text.test.tsx
- truncated — packages/components/text/__tests__/text.test.tsx
- truncated title updates after resize — packages/components/text/__tests__/text.test.tsx
- truncated title updates after prop changes — packages/components/text/__tests__/text.test.tsx
- line-clamp — packages/components/text/__tests__/text.test.tsx
- tag — packages/components/text/__tests__/text.test.tsx
- default slot — packages/components/text/__tests__/text.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
