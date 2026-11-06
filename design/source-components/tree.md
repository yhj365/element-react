# Tree 源码目录设计

- 来源：packages/components/tree
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：树数据、节点键、字段映射；展开/选中/勾选/半选、严格关联；懒加载、过滤、自定义节点；拖拽约束、节点增删改查和实例方法。
- 家族设计：[tree](../components/tree.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tree/index.ts（SHA256 e40b1f6b5d0ce2137149fe7704db232e3e8fd1008a842a90c8cbfcb3bf9e42ab）
- packages/components/tree/src/instance.ts（SHA256 75faff4125cc1f4f4a8d1f0d85157ff93d76cc6cb21021700a3cf62168217c44）
- packages/components/tree/src/model/node.ts（SHA256 579175b1998b75a9bd9f395decae271e9349f3a85622f3d093aa6b166eca8ee9）
- packages/components/tree/src/model/tree-store.ts（SHA256 2ec1a296e6f1d4fb569baf60b45d06faa5cfb6eab64c8ec2831d579936599239）
- packages/components/tree/src/model/useDragNode.ts（SHA256 99fd854087f645ad054f434e6e5209f04d2fe4b70e21ef6853e1730206ce70a9）
- packages/components/tree/src/model/useKeydown.ts（SHA256 aa183792b60330065ad2ccb76025987454e40acf3f75aa8b827fdcefccda1987）
- packages/components/tree/src/model/useNodeExpandEventBroadcast.ts（SHA256 16079edcb2e2175eab24e3c027c2f002b65c48acbeb82ffd5f8c6af471063e60）
- packages/components/tree/src/model/util.ts（SHA256 a418fc51c2d7a528b265534440d8f96daf200dc98a3d93afb0d7b9933523d38b）
- packages/components/tree/src/tokens.ts（SHA256 b2fc47314f8856730b99fe45872f5a5b85fe942b6991162e92c3dea95a564325）
- packages/components/tree/src/tree-node-content.vue（SHA256 99ec254cff9dffcff1619610ae432b685fa9068c30b0238e4740b162f80c008d）
- packages/components/tree/src/tree-node.vue（SHA256 b892149939ee212f23b6db5bd278f2c91b1689b594656f4fdbfefcd23e394fd1）
- packages/components/tree/src/tree.ts（SHA256 1201566da61fa662fc910b81ee7b0a6daf8d2b87ae8bfc7c76cb5c44c0d4853a）
- packages/components/tree/src/tree.type.ts（SHA256 fd798ce5813f81814cf8a8053f52fa804a0dd26925c75b1d00beb354755171e9）
- packages/components/tree/src/tree.vue（SHA256 4c503df44d6fcab6f89484ac547d0703a4503e679c88d24e4a7c463929a114e7）
- packages/components/tree/style/css.ts（SHA256 c61d2d9b378967fca34e48962930c4d7244306763423ec576c1dd429ad5a03d6）
- packages/components/tree/style/index.ts（SHA256 d1b168c01aa10b376589a63cd949c26e48abb9fd31757ce63753d083fd3d4bd6）
- packages/components/tree/__tests__/tree.test.ts（SHA256 61d9f919af7b52af75bf25a2fb971d309d47c660927d840fd38fa6539fe009a5）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Tree.vue — packages/components/tree/__tests__/tree.test.ts
- create — packages/components/tree/__tests__/tree.test.ts
- click node — packages/components/tree/__tests__/tree.test.ts
- emptyText — packages/components/tree/__tests__/tree.test.ts
- expandOnNodeClick — packages/components/tree/__tests__/tree.test.ts
- checkOnNodeClick — packages/components/tree/__tests__/tree.test.ts
- current-node-key — packages/components/tree/__tests__/tree.test.ts
- update tree-data after current-node-key — packages/components/tree/__tests__/tree.test.ts
- defaultExpandAll — packages/components/tree/__tests__/tree.test.ts
- defaultExpandedKeys — packages/components/tree/__tests__/tree.test.ts
- defaultExpandedKeys set — packages/components/tree/__tests__/tree.test.ts
- filter-node-method — packages/components/tree/__tests__/tree.test.ts
- lazy load with filter expand loaded node — packages/components/tree/__tests__/tree.test.ts
- autoExpandParent = true — packages/components/tree/__tests__/tree.test.ts
- autoExpandParent = false — packages/components/tree/__tests__/tree.test.ts
- defaultCheckedKeys & check-strictly = false — packages/components/tree/__tests__/tree.test.ts
- defaultCheckedKeys & check-strictly — packages/components/tree/__tests__/tree.test.ts
- show checkbox — packages/components/tree/__tests__/tree.test.ts
- check — packages/components/tree/__tests__/tree.test.ts
- check by clicking on leaf node — packages/components/tree/__tests__/tree.test.ts
- ensure no checked nodes in non show-checkbox mode — packages/components/tree/__tests__/tree.test.ts
- setCheckedNodes — packages/components/tree/__tests__/tree.test.ts
- setCheckedNodes with disabled node — packages/components/tree/__tests__/tree.test.ts
- setCheckedKeys — packages/components/tree/__tests__/tree.test.ts
- setCheckedKeys with checkStrictly — packages/components/tree/__tests__/tree.test.ts
- method setChecked — packages/components/tree/__tests__/tree.test.ts
- should respect deep option when calling setChecked in checkStrictly mode — packages/components/tree/__tests__/tree.test.ts
- setCheckedKeys with leafOnly=false — packages/components/tree/__tests__/tree.test.ts
- setCheckedKeys with leafOnly=true — packages/components/tree/__tests__/tree.test.ts
- setCheckedKeys with leafOnly=true produces consistent parent states — packages/components/tree/__tests__/tree.test.ts
- setCurrentKey — packages/components/tree/__tests__/tree.test.ts
- setCurrentKey should also auto expand parent — packages/components/tree/__tests__/tree.test.ts
- setCurrentKey should not expand self — packages/components/tree/__tests__/tree.test.ts
- setCurrentKey should not have multiple nodes with highlighted states at the same time — packages/components/tree/__tests__/tree.test.ts
- setCurrentNode — packages/components/tree/__tests__/tree.test.ts
- setCurrentNode should also auto expand parent — packages/components/tree/__tests__/tree.test.ts
- setCurrentNode should not expand self — packages/components/tree/__tests__/tree.test.ts
- getCurrentKey — packages/components/tree/__tests__/tree.test.ts
- getCurrentNode — packages/components/tree/__tests__/tree.test.ts
- getNode — packages/components/tree/__tests__/tree.test.ts
- remove — packages/components/tree/__tests__/tree.test.ts
- append — packages/components/tree/__tests__/tree.test.ts
- insertBefore — packages/components/tree/__tests__/tree.test.ts
- insertAfter — packages/components/tree/__tests__/tree.test.ts
- set disabled checkbox — packages/components/tree/__tests__/tree.test.ts
- check strictly — packages/components/tree/__tests__/tree.test.ts
- render content — packages/components/tree/__tests__/tree.test.ts
- custom-node-class — packages/components/tree/__tests__/tree.test.ts
- scoped slot — packages/components/tree/__tests__/tree.test.ts
- load node — packages/components/tree/__tests__/tree.test.ts
- lazy defaultChecked — packages/components/tree/__tests__/tree.test.ts
- lazy expandOnChecked — packages/components/tree/__tests__/tree.test.ts
- lazy without expandOnChecked — packages/components/tree/__tests__/tree.test.ts
- accordion — packages/components/tree/__tests__/tree.test.ts
- handleNodeOpen & handleNodeClose — packages/components/tree/__tests__/tree.test.ts
- updateKeyChildren — packages/components/tree/__tests__/tree.test.ts
- update multi tree data — packages/components/tree/__tests__/tree.test.ts
- navigate with defaultExpandAll — packages/components/tree/__tests__/tree.test.ts
- navigate up — packages/components/tree/__tests__/tree.test.ts
- navigate down — packages/components/tree/__tests__/tree.test.ts
- navigate down with multiple trees — packages/components/tree/__tests__/tree.test.ts
- collapse and navigate down and up — packages/components/tree/__tests__/tree.test.ts
- filter-node-method and navigate down — packages/components/tree/__tests__/tree.test.ts
- expand and render-after-expand set to false — packages/components/tree/__tests__/tree.test.ts
- navigate with disabled — packages/components/tree/__tests__/tree.test.ts
- custom children and label — packages/components/tree/__tests__/tree.test.ts
- navigate with lazy and without node-key — packages/components/tree/__tests__/tree.test.ts
- customize some node contents — packages/components/tree/__tests__/tree.test.ts
- should correctly handle checkbox state when disabled nodes exist — packages/components/tree/__tests__/tree.test.ts
- should not block descendant updates when a disabled non-leaf node exists — packages/components/tree/__tests__/tree.test.ts
- should correctly handle checkbox state in lazy mode when disabled nodes exist — packages/components/tree/__tests__/tree.test.ts
- should correctly handle checkbox state under default-checked-keys when disabled nodes exist — packages/components/tree/__tests__/tree.test.ts
- lazy load with check-strictly should not auto-check children — packages/components/tree/__tests__/tree.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
