# CascaderPanel 源码目录设计

- 来源：packages/components/cascader-panel
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：单选/多选、严格选择、路径值；hover/click 展开；可搜索、懒加载、禁用节点；标签折叠、清空、面包路径；CascaderPanel 和节点渲染。
- 家族设计：[cascader](../components/cascader.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/cascader-panel/index.ts（SHA256 0564a09bdca31e0517bfa1762092d571b63ba464a65aa8d5e037eb36be990bed）
- packages/components/cascader-panel/src/config.ts（SHA256 831c491fff57793ec058ad45c106fb7a7e51c24ad48bddc64b8e1dfb7c2a3cc9）
- packages/components/cascader-panel/src/index.vue（SHA256 da0f491a26b2c32b6da8265850f0c6588a8463497dc740056c58655b78dde88c）
- packages/components/cascader-panel/src/instance.ts（SHA256 717873831aa0edd40a0e83d27edd7d9299f810c3afcecf55d59c48ba4b9734df）
- packages/components/cascader-panel/src/menu.vue（SHA256 eb167995ee4dff1131f2af324b6b656aadb6cce5ee2ad9f8106e794db14df9a3）
- packages/components/cascader-panel/src/node-content.tsx（SHA256 b793b4134dbe66859ea2cb3a2e541801427e60d4005473ed7277d27c1a89d9cd）
- packages/components/cascader-panel/src/node.ts（SHA256 33f8d92ae619f98768c5a07048a82a78d1bde5a67501866284858d29073f332c）
- packages/components/cascader-panel/src/node.vue（SHA256 8a0e4e8a7d7e85c0d5047216ad64788b9bb61294d1de04ea29848a700d294daf）
- packages/components/cascader-panel/src/store.ts（SHA256 eb26420238b31e9b2a6658ba32e88420ef1bc189ec7b280f1385475bed898e63）
- packages/components/cascader-panel/src/types.ts（SHA256 46d81b06aa4baa87e0dc46e57a3df8a3ffd593a9db6e25293ea42b0de93f387a）
- packages/components/cascader-panel/src/utils.ts（SHA256 d1eee008e8539ef56694b7f50538c97cacc1ea944558e2a50842feafea84a4bf）
- packages/components/cascader-panel/style/css.ts（SHA256 054ee3ffc9cfee69e287c8c28989882a64e75275110ef85582ec5d753f770dd8）
- packages/components/cascader-panel/style/index.ts（SHA256 39de5042a17b1ad64bf25c8e5f86a75e66a8ee9efdc50d8a6808366094d3df34）
- packages/components/cascader-panel/__tests__/cascader-panel.test.tsx（SHA256 9abc1f10b11da21022fd1df0e030229252b8d1b6b56c8ae282e147ae627b4bc4）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- avoid other test case affecting this test case — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- check strictly in single mode with first option — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- CascaderPanel.vue — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- expand and check — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- with default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- disabled options — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- options change — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- expand by hover — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- click to select in hover mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- emit value only — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- value can be an empty string — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- emit value only, issue 1531 — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- multiple mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- multiple mode with disabled default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- check strictly in single mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- check strictly in single mode with disabled options — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- check strictly in multiple mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- custom props — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load with loaded fails — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load with first level loaded fails — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load with first and second level loaded success and third level loaded fails — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load with default primitive value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load with default object value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- no loaded nodes should not be checked — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- no loaded nodes with checkStrictly should be selectable — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- lazy load with return item has children — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- getCheckedNodes and clearCheckedNodes — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- options async load with default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- rerender node after changing model-value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- when lazy loading returns empty data, the leaf nodes can perform single selection normally — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- ensure set null after clear — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- ensure only one update model value is fired on single mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- ensure only one update model value is fired on multiple mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- should allow click node to check value on multiple mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- should allow click node to check value on checkStrictly mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- CascaderPanel.vue - Virtual Scroll — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Basic Rendering — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll renders correctly with FixedSizeList — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- non-virtual scroll mode still works (backward compatibility) — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll default values — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll custom itemSize and height — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with empty options — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll renders correct number of visible items — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Selection and Expansion — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll expand and check — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with deep default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll change value programmatically — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Multiple Mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll multiple mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll multiple mode select all children — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll multiple mode with default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- checkStrictly Mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll checkStrictly mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll checkStrictly with expand — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll checkStrictly multiple mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Disabled Options — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll disabled options — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll disabled options cannot be selected — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Hover Mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll hover mode — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll hover mode with click to select — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Large Dataset Performance — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with 2000 options renders efficiently — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll scrollToItem with large dataset — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll navigate through large dataset — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll arrow navigation should skip disabled nodes — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll change selection in large dataset — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll resolves active index by menu level — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Lazy Loading — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with lazy load — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Events — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll emits change event — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll emits expand-change event — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- getCheckedNodes and clearCheckedNodes — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll getCheckedNodes works — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll clearCheckedNodes works — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Dynamic Options — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll options change — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll options async load with default value — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- Edge Cases — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with single leaf option — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll toggle selection — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx
- virtual scroll with emitPath false — packages/components/cascader-panel/__tests__/cascader-panel.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
