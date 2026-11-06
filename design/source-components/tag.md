# Tag 源码目录设计

- 来源：packages/components/tag
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：类型、尺寸、effect、round；可关闭、关闭图标和过渡；点击/关闭事件；标签内容与主题。
- 家族设计：[tag](../components/tag.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tag/index.ts（SHA256 29628456282663a1a662fb4d20cfa4ba2861a04771ba21af2ac863ef7b901e52）
- packages/components/tag/src/tag.ts（SHA256 e06ad78fd1917fb6b6e258b5faeb21d14fae4d9a345c8a718640fbc610607284）
- packages/components/tag/src/tag.vue（SHA256 fbf18bf0ad1957e93d84f67ed3d4279963f1c7f4c351011268a8800d0b9df8d8）
- packages/components/tag/style/css.ts（SHA256 5315bcd9429352e43f02f9fde1a62089364ee1e1b3309f6c365bfd3ead7953a8）
- packages/components/tag/style/index.ts（SHA256 28a28f6f3fddcf2b52743d8ab91cd651a113e272c681f282a0036676a3bd8245）
- packages/components/tag/__tests__/tag.test.tsx（SHA256 27b6a1533a1b82f0dd1d8382ee46b69c2f221330e8c8a7347dec2a8c4daa6ac0）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Tag.vue — packages/components/tag/__tests__/tag.test.tsx
- render text & class — packages/components/tag/__tests__/tag.test.tsx
- type — packages/components/tag/__tests__/tag.test.tsx
- hit — packages/components/tag/__tests__/tag.test.tsx
- closable — packages/components/tag/__tests__/tag.test.tsx
- disableTransitions — packages/components/tag/__tests__/tag.test.tsx
- color — packages/components/tag/__tests__/tag.test.tsx
- theme — packages/components/tag/__tests__/tag.test.tsx
- size — packages/components/tag/__tests__/tag.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
