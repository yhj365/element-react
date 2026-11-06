# TreeSelect 源码目录设计

- 来源：packages/components/tree-select
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：选择器与树组合；单选/多选、checkbox、严格选择；过滤/懒加载、缓存标签、默认展开；树节点和选中值双向协调。
- 家族设计：[tree-select](../components/tree-select.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tree-select/index.ts（SHA256 72db5429354ef48bc398abb6300c323c2aac956312edaa72b6fc02563a7204a3）
- packages/components/tree-select/src/cache-options.ts（SHA256 502940863d7eff9fa48917e8295189070bc82d761c129fe713c8b040481c8998）
- packages/components/tree-select/src/instance.ts（SHA256 6b88a3c21ed97b11b21a56d518761c9e1eaeffd2d684539673e7bc435f85ce88）
- packages/components/tree-select/src/select.ts（SHA256 24ff118dfc99ae67270fcfbea4ee44a748df9cedd4ad975305ab570bbb3adbb0）
- packages/components/tree-select/src/tree-select-option.ts（SHA256 67efe225ee6159f522e1d4c31302d19554d8171de193be809115e535ebdfa968）
- packages/components/tree-select/src/tree-select.vue（SHA256 f7f87d6c186c6c7e2f0e7a06887d07fe3c61bf898a32582f91bcd79808df49d6）
- packages/components/tree-select/src/tree.ts（SHA256 a515791fa7aa9c48c51cf7a0cceab771261e01edb931138f73ff11f3b81ce1b7）
- packages/components/tree-select/src/utils.ts（SHA256 a41b25ccb868717f06bb9543b18780a4d5658beb648fa3f074e2b421afb5e8ae）
- packages/components/tree-select/style/css.ts（SHA256 e4092d4dfaf0f563b3d6359a66fd49fb795a75cc3e5e67d4560e57b835c04ba5）
- packages/components/tree-select/style/index.ts（SHA256 c56c52b37a8ad9d33b07004954ddca3dbd584774fcb32959625bf975ae57870f）
- packages/components/tree-select/__tests__/tree-select.test.tsx（SHA256 94e7322fccd6893a25e5ee4b3247accadd530b99022f76ddf5dd22f57f02e32f）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- TreeSelect.vue — packages/components/tree-select/__tests__/tree-select.test.tsx
- render test — packages/components/tree-select/__tests__/tree-select.test.tsx
- render tree-select with default value and persistent is false — packages/components/tree-select/__tests__/tree-select.test.tsx
- render tree-select with dynamic class — packages/components/tree-select/__tests__/tree-select.test.tsx
- modelValue — packages/components/tree-select/__tests__/tree-select.test.tsx
- disabled — packages/components/tree-select/__tests__/tree-select.test.tsx
- multiple — packages/components/tree-select/__tests__/tree-select.test.tsx
- filter — packages/components/tree-select/__tests__/tree-select.test.tsx
- props — packages/components/tree-select/__tests__/tree-select.test.tsx
- slots — packages/components/tree-select/__tests__/tree-select.test.tsx
- renderContent — packages/components/tree-select/__tests__/tree-select.test.tsx
- lazy — packages/components/tree-select/__tests__/tree-select.test.tsx
- events — packages/components/tree-select/__tests__/tree-select.test.tsx
- check-strictly showCheckbox click node — packages/components/tree-select/__tests__/tree-select.test.tsx
- check-strictly showCheckbox checkOnClickNode click node — packages/components/tree-select/__tests__/tree-select.test.tsx
- only show checkbox — packages/components/tree-select/__tests__/tree-select.test.tsx
- show checkbox and check on click node — packages/components/tree-select/__tests__/tree-select.test.tsx
- emit change when toggling node via label click — packages/components/tree-select/__tests__/tree-select.test.tsx
- emit change once when toggling node via checkbox click — packages/components/tree-select/__tests__/tree-select.test.tsx
- expand-on-click-node — packages/components/tree-select/__tests__/tree-select.test.tsx
- navigate down — packages/components/tree-select/__tests__/tree-select.test.tsx
- navigate up — packages/components/tree-select/__tests__/tree-select.test.tsx
- show correct label when child options are not rendered — packages/components/tree-select/__tests__/tree-select.test.tsx
- show correct label when lazy load — packages/components/tree-select/__tests__/tree-select.test.tsx
- filter method and remote method — packages/components/tree-select/__tests__/tree-select.test.tsx
- filter-method — packages/components/tree-select/__tests__/tree-select.test.tsx
- filter-method and checkbox — packages/components/tree-select/__tests__/tree-select.test.tsx
- filter-method and checkbox & check-strictly — packages/components/tree-select/__tests__/tree-select.test.tsx
- remote-method — packages/components/tree-select/__tests__/tree-select.test.tsx
- check/check-change events can accept correct params — packages/components/tree-select/__tests__/tree-select.test.tsx
- checking node will not reset checked cache node — packages/components/tree-select/__tests__/tree-select.test.tsx
- cached checked node can be canceled — packages/components/tree-select/__tests__/tree-select.test.tsx
- cached checked node and use lazy multiple — packages/components/tree-select/__tests__/tree-select.test.tsx
- check by click on leaf node — packages/components/tree-select/__tests__/tree-select.test.tsx
- no checkbox and check on click node — packages/components/tree-select/__tests__/tree-select.test.tsx
- v-model source change — packages/components/tree-select/__tests__/tree-select.test.tsx
- always focus when using filters — packages/components/tree-select/__tests__/tree-select.test.tsx
- should show clear btn on focus — packages/components/tree-select/__tests__/tree-select.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
