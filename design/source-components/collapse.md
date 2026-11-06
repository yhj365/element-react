# Collapse 源码目录设计

- 来源：packages/components/collapse
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：多展开/手风琴；CollapseItem 标识、禁用、标题和图标；受控展开项；过渡、键盘操作和变化通知。
- 家族设计：[collapse](../components/collapse.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/collapse/index.ts（SHA256 e476bff367370bdbec69fc73400c72a53d5c8ba5bbe5d219f0363e3e2160bc18）
- packages/components/collapse/src/collapse-item.ts（SHA256 1f69d3ac28e083e1f2b682c9e47bca1aa485460a607647b41d6222c515cf291b）
- packages/components/collapse/src/collapse-item.vue（SHA256 652c99236acec695092d9accb3143f999d7de22d8b8c864368bddb897583a0a8）
- packages/components/collapse/src/collapse.ts（SHA256 9452edbaa3f60201a50d679d83b5ef2fa1f534f3a8db165257230b401139ccb9）
- packages/components/collapse/src/collapse.vue（SHA256 d118a1e8a9b181fbc06d291afc9af5739887af7cee41f9d258c8a24a2ef9fc9f）
- packages/components/collapse/src/constants.ts（SHA256 334080449728ab35fa9bd00f20b4942c5f09b0d03b2101c26ffdf7bb62ea9ce0）
- packages/components/collapse/src/instance.ts（SHA256 a44ed17dc0b8b58eff0c545bf71413b4d2ee75a86aecad0d377d51bea6cbcfe4）
- packages/components/collapse/src/use-collapse-item.ts（SHA256 39da45852825b312c03a1800aca0eb71c1caff94a6a290d24adef74ac3d29276）
- packages/components/collapse/src/use-collapse.ts（SHA256 c9e68ffa31599248f43dc7c0496058527b07b738d964debed8586cdba9745727）
- packages/components/collapse/style/css.ts（SHA256 6073e93c6f1d0d09078165be80f6844fc8486340f97152056ae284a9b91fb68b）
- packages/components/collapse/style/index.ts（SHA256 e2fc528fdaef11b6b4af0f0ff0948f7260f57c3368e75cd1616c3ad392ba592f）
- packages/components/collapse/__tests__/collapse.test.tsx（SHA256 f8d259a1cd47e14b85657599cb275af413cbae1336df2015c74f2e7cff3f1a91）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Collapse.vue — packages/components/collapse/__tests__/collapse.test.tsx
- create — packages/components/collapse/__tests__/collapse.test.tsx
- accordion — packages/components/collapse/__tests__/collapse.test.tsx
- event:change — packages/components/collapse/__tests__/collapse.test.tsx
- deep watch modelValue — packages/components/collapse/__tests__/collapse.test.tsx
- title slot — packages/components/collapse/__tests__/collapse.test.tsx
- beforeCollapse function return promise — packages/components/collapse/__tests__/collapse.test.tsx
- beforeCollapse function return boolean — packages/components/collapse/__tests__/collapse.test.tsx
- Nested Input Interaction — packages/components/collapse/__tests__/collapse.test.tsx
- should not toggle collapse when clicking on input — packages/components/collapse/__tests__/collapse.test.tsx
- should not toggle collapse when pressing enter on input — packages/components/collapse/__tests__/collapse.test.tsx
- should not toggle collapse when pressing space on input — packages/components/collapse/__tests__/collapse.test.tsx
- Accessibility — packages/components/collapse/__tests__/collapse.test.tsx
- should have appropriate ARIA attributes — packages/components/collapse/__tests__/collapse.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
