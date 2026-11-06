# Pagination 源码目录设计

- 来源：packages/components/pagination
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：页码/页大小/总数；布局配置、简洁模式、背景、小尺寸；跳页、页大小选择、单页隐藏；currentPage/pageSize 双受控通道及事件顺序。
- 家族设计：[pagination](../components/pagination.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/pagination/index.ts（SHA256 c989ea87350e2a5ed2ee617b47bc1095220c7c1bbc801e024180efb88ed96fe9）
- packages/components/pagination/src/components/jumper.ts（SHA256 06edb289cdd615a68a325d79a3916aeecefe4cca1707302c55b9fee9b20183df）
- packages/components/pagination/src/components/jumper.vue（SHA256 238f5210aa2ea494bbbeeb3310c8a4ef1b9ac551a9167d29d915e45d23d32264）
- packages/components/pagination/src/components/next.ts（SHA256 e9f25aff2ab1c93cb4a90071694cc1518d826f9a9ffe187c082a06420a938ad3）
- packages/components/pagination/src/components/next.vue（SHA256 f366cbfebd927a55354b8c45882349861a91638adcd8236d334276c0ac0786ef）
- packages/components/pagination/src/components/pager.ts（SHA256 1650a0168f767525aa96d17f4a8111248001b682394dbda3654a68ace2a1c3ac）
- packages/components/pagination/src/components/pager.vue（SHA256 cfddd433cae7cc27fc405d99ae207919b3e9ecb3353563054228b35e8058b3de）
- packages/components/pagination/src/components/prev.ts（SHA256 221e9ea8c440cec3b89b1db3b675b74a79014b05f0c9735a0a2a11892c815f6e）
- packages/components/pagination/src/components/prev.vue（SHA256 e80537c641d8e5077d66c285639ee122322898e876b17c12d8830198470f9769）
- packages/components/pagination/src/components/sizes.ts（SHA256 6fab735c7a4d6aa934d27e91ab438a0de732e9a00e59f6c1e95b619427076ad6）
- packages/components/pagination/src/components/sizes.vue（SHA256 e5be4028a41b213bd54d35a088b1b3f3678b31a04a02abf872bbef169696e1c0）
- packages/components/pagination/src/components/total.ts（SHA256 8d9e362e6be84af3615b9102a44a5aadf989b411d8dc33f483d17e10b4ca5258）
- packages/components/pagination/src/components/total.vue（SHA256 cb79071b23b8596ff9710a300b4021c58e80ffa6c1e110193d59e0074c0730be）
- packages/components/pagination/src/constants.ts（SHA256 055f828c5a81b4793b88571100bb8f622a5580145a44622191a2b786f4c4256e）
- packages/components/pagination/src/pagination.ts（SHA256 d7162e35e0d74b3da7197701e432be02b9ec14f678a40929836919862b143309）
- packages/components/pagination/src/usePagination.ts（SHA256 7ed454685afec104ff00d43a70fdef5bf00d527c08a793d1cf74f9ca5aa4612e）
- packages/components/pagination/style/css.ts（SHA256 469220cb3084c744e1efc78efc7aaeddc0c55e78c47045afd34fa7bbc4f43f85）
- packages/components/pagination/style/index.ts（SHA256 c311b238559da0e4f13173ee5ddb68234afebae7e86654ba161bdf31dbe1f758）
- packages/components/pagination/__tests__/pagination.test.tsx（SHA256 b6baa85724c79809b579bca395773b5e2e551eea7e5c6fdfe30fb05a213264f4）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Pagination — packages/components/pagination/__tests__/pagination.test.tsx
- test invalid usages — packages/components/pagination/__tests__/pagination.test.tsx
- both absence of total & pageCount is invalid — packages/components/pagination/__tests__/pagination.test.tsx
- current-page defined while absence of current-page listener is invalid — packages/components/pagination/__tests__/pagination.test.tsx
- test layout & layout reactive change — packages/components/pagination/__tests__/pagination.test.tsx
- layout empty — packages/components/pagination/__tests__/pagination.test.tsx
- layout with default layout prop — packages/components/pagination/__tests__/pagination.test.tsx
- test layout with slot — packages/components/pagination/__tests__/pagination.test.tsx
- test small layout — packages/components/pagination/__tests__/pagination.test.tsx
- test with background — packages/components/pagination/__tests__/pagination.test.tsx
- test hide-on-single-page prop — packages/components/pagination/__tests__/pagination.test.tsx
- test custom icon — packages/components/pagination/__tests__/pagination.test.tsx
- test pageSize & currentPage reactive change — packages/components/pagination/__tests__/pagination.test.tsx
- test pageSize change — packages/components/pagination/__tests__/pagination.test.tsx
- test currentPage change — packages/components/pagination/__tests__/pagination.test.tsx
- test more icon — packages/components/pagination/__tests__/pagination.test.tsx
- test pageCount change and side effect — packages/components/pagination/__tests__/pagination.test.tsx
- test listener work — packages/components/pagination/__tests__/pagination.test.tsx
- test a11y supports — packages/components/pagination/__tests__/pagination.test.tsx
- test a11y attributes — packages/components/pagination/__tests__/pagination.test.tsx
- test tabindex interactive — packages/components/pagination/__tests__/pagination.test.tsx
- test tabindex disabled — packages/components/pagination/__tests__/pagination.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
