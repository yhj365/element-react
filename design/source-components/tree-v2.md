# TreeV2 源码目录设计

- 来源：packages/components/tree-v2
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：固定高度虚拟树；数据字段映射、展开、选中、复选/半选；过滤、滚动到节点、键盘；与普通Tree的懒加载/拖拽差异按原API验收。
- 家族设计：[tree-v2](../components/tree-v2.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tree-v2/index.ts（SHA256 3df0ec3499585a5fd1792dbf31e3a9409f90ecf7c557c6f41cb07538fe021031）
- packages/components/tree-v2/src/composables/useCheck.ts（SHA256 ad72e4d23bf18580817cb545291d4af318c419c1b2ad620c2250cb6a079a1b92）
- packages/components/tree-v2/src/composables/useFilter.ts（SHA256 aedca7a527b2ff1c755d63e9680c4d150e64d7de2af3546b6614b67af55890e6）
- packages/components/tree-v2/src/composables/useTree.ts（SHA256 a5c0dca03226ed8362d19ffd6af1c092db35c104780b6ac1ff8bd9f4661a5595）
- packages/components/tree-v2/src/instance.ts（SHA256 ee2cdf1383c3f81134f2aa3863c261ab5ab0423577de0946421ef20a47154a17）
- packages/components/tree-v2/src/tree-node-content.ts（SHA256 e680ab8c832d8aa9bd0cf30a0f506f3a94f0e85b57df62b75242593e405b0bfa）
- packages/components/tree-v2/src/tree-node.vue（SHA256 130776373ce3e91516c8674b93aa6b59d05e6f910d1e89b7b4b35abfdc1116ad）
- packages/components/tree-v2/src/tree.vue（SHA256 faa8f3d58809adb665db2dca17310c9fec90369003e8655a9af691cc564b9230）
- packages/components/tree-v2/src/types.ts（SHA256 291066e5395fd513c408f3c69393e982c47d651adafc28a67accbffd06d72080）
- packages/components/tree-v2/src/virtual-tree.ts（SHA256 9e8ae2955091e25c9864662d4e942222dac04c3b6ee7cab5d76876bf6b70f389）
- packages/components/tree-v2/style/css.ts（SHA256 16f0cc68e66d09b9b8c914cdc7acafb5dbf18903f159581dec457b99f9baa806）
- packages/components/tree-v2/style/index.ts（SHA256 04985078cc59ee7c9f8f50ec37e5503d9c9d3563a73e90dff80a2deac103b191）
- packages/components/tree-v2/__tests__/tree.test.ts（SHA256 f069b1024209c3f4c9fc829b55c5f77538b56d8d6bdd9c795eea71c2965ef04f）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Virtual Tree — packages/components/tree-v2/__tests__/tree.test.ts
- create — packages/components/tree-v2/__tests__/tree.test.ts
- click node — packages/components/tree-v2/__tests__/tree.test.ts
- getCurrentKey returns clicked node key in node-click event — packages/components/tree-v2/__tests__/tree.test.ts
- drop on node — packages/components/tree-v2/__tests__/tree.test.ts
- emptyText — packages/components/tree-v2/__tests__/tree.test.ts
- render slot empty — packages/components/tree-v2/__tests__/tree.test.ts
- height — packages/components/tree-v2/__tests__/tree.test.ts
- item-size — packages/components/tree-v2/__tests__/tree.test.ts
- props — packages/components/tree-v2/__tests__/tree.test.ts
- highlightCurrent — packages/components/tree-v2/__tests__/tree.test.ts
- showCheckbox — packages/components/tree-v2/__tests__/tree.test.ts
- should correctly handle checkbox state when disabled nodes exist — packages/components/tree-v2/__tests__/tree.test.ts
- showCheckbox checkOnClickLeaf — packages/components/tree-v2/__tests__/tree.test.ts
- defaultCheckedKeys — packages/components/tree-v2/__tests__/tree.test.ts
- checkStrictly — packages/components/tree-v2/__tests__/tree.test.ts
- defaultExpandedKeys — packages/components/tree-v2/__tests__/tree.test.ts
- defaultExpandedKeys change should update expand icon state — packages/components/tree-v2/__tests__/tree.test.ts
- defaultExpandedKeys with child key should expand parent nodes — packages/components/tree-v2/__tests__/tree.test.ts
- setExpandedKeys — packages/components/tree-v2/__tests__/tree.test.ts
- indent — packages/components/tree-v2/__tests__/tree.test.ts
- expandOnClickNode — packages/components/tree-v2/__tests__/tree.test.ts
- checkOnClickNode — packages/components/tree-v2/__tests__/tree.test.ts
- currentNodeKey — packages/components/tree-v2/__tests__/tree.test.ts
- currentNodeKey with zero key — packages/components/tree-v2/__tests__/tree.test.ts
- currentNodeKey with empty string key — packages/components/tree-v2/__tests__/tree.test.ts
- customNodeClass — packages/components/tree-v2/__tests__/tree.test.ts
- custom node content — packages/components/tree-v2/__tests__/tree.test.ts
- scrollbar-always-on — packages/components/tree-v2/__tests__/tree.test.ts
- filter — packages/components/tree-v2/__tests__/tree.test.ts
- events — packages/components/tree-v2/__tests__/tree.test.ts
- current-change — packages/components/tree-v2/__tests__/tree.test.ts
- check — packages/components/tree-v2/__tests__/tree.test.ts
- context-menu — packages/components/tree-v2/__tests__/tree.test.ts
- methods — packages/components/tree-v2/__tests__/tree.test.ts
- getChecked — packages/components/tree-v2/__tests__/tree.test.ts
- setCheckedKeys — packages/components/tree-v2/__tests__/tree.test.ts
- setChecked — packages/components/tree-v2/__tests__/tree.test.ts
- should respect deep option when calling setChecked in checkStrictly mode — packages/components/tree-v2/__tests__/tree.test.ts
- getCurrent — packages/components/tree-v2/__tests__/tree.test.ts
- setCurrentKey — packages/components/tree-v2/__tests__/tree.test.ts
- scrollToNode — packages/components/tree-v2/__tests__/tree.test.ts
- scrollTo — packages/components/tree-v2/__tests__/tree.test.ts
- icon display should be normal when expanding nodes using setExpandedKeys — packages/components/tree-v2/__tests__/tree.test.ts
- call collapseNode/expandNode icon status error — packages/components/tree-v2/__tests__/tree.test.ts
- default slot. node.expanded value — packages/components/tree-v2/__tests__/tree.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
