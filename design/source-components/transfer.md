# Transfer 源码目录设计

- 来源：packages/components/transfer
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：左右列表、搜索、勾选和批量移动；禁用、字段映射、顺序、标题和计数；自定义条目、底部内容；值和选中状态事件。
- 家族设计：[transfer](../components/transfer.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/transfer/index.ts（SHA256 02c8143ffd871fef750f151fcf9def585bd9bfb1f5a082f098e33ee3bd72a4e5）
- packages/components/transfer/src/composables/index.ts（SHA256 89bc91271716c1d0be98d9f303f666f2563d45def425c144d325be7f9ced697c）
- packages/components/transfer/src/composables/use-check.ts（SHA256 74c0c17790c055125ada42475ecd382d15532756924e72a44cf2cf91a3ff785c）
- packages/components/transfer/src/composables/use-checked-change.ts（SHA256 742817f7be154ac6aab0d8a898f0e696978bb5d4e9152adc88ea8dfa4e56487f）
- packages/components/transfer/src/composables/use-computed-data.ts（SHA256 3e73858a80625f2bdcf21f16a313c8a410261d533a505fa1e4f8b1eff7f294e3）
- packages/components/transfer/src/composables/use-move.ts（SHA256 5e1e5f1cd75e162db96efd86941e405caac0a426af407f810de0c30dd29e435f）
- packages/components/transfer/src/composables/use-props-alias.ts（SHA256 b75cf2f56b5cd8ed3ee770cff44ab00246f7c0c04bc7e859d2f3a957f127c44f）
- packages/components/transfer/src/transfer-panel.ts（SHA256 c2798b59f0a9ae237da1b017c3c1e010200abbf93a4928cd0822945c25f12bbf）
- packages/components/transfer/src/transfer-panel.vue（SHA256 a69758c804fbc86944233489a033509963a07dae732b8644edac2ace9ed97ccd）
- packages/components/transfer/src/transfer.ts（SHA256 8c5a041f279ab546cbcb7c0c97e6cc7416b727cab89feedb702ca7ed0e4970eb）
- packages/components/transfer/src/transfer.vue（SHA256 4af9a3aaa03e04ee949551eecf81365fcca6aad03493c89a5311361514fbe5ea）
- packages/components/transfer/style/css.ts（SHA256 dd936ae45416ca5704e05be0dbba51de8446c60a760c1dda80f85d30fba44d07）
- packages/components/transfer/style/index.ts（SHA256 9b0da3af797c421d775c535dae8a1059741026d338ed3d084f95754f5036e5c3）
- packages/components/transfer/__tests__/transfer.test.tsx（SHA256 8deca0ac4885a7dd7a28a51ae6172fa274310500df18a0e84c679c3c80d6f6c7）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Transfer — packages/components/transfer/__tests__/transfer.test.tsx
- create — packages/components/transfer/__tests__/transfer.test.tsx
- default target list — packages/components/transfer/__tests__/transfer.test.tsx
- filterable — packages/components/transfer/__tests__/transfer.test.tsx
- transfer — packages/components/transfer/__tests__/transfer.test.tsx
- customize — packages/components/transfer/__tests__/transfer.test.tsx
- check — packages/components/transfer/__tests__/transfer.test.tsx
- target order — packages/components/transfer/__tests__/transfer.test.tsx
- original(default) — packages/components/transfer/__tests__/transfer.test.tsx
- push — packages/components/transfer/__tests__/transfer.test.tsx
- unshift — packages/components/transfer/__tests__/transfer.test.tsx
- validate clearQuery — packages/components/transfer/__tests__/transfer.test.tsx
- set query and clear query — packages/components/transfer/__tests__/transfer.test.tsx
- render default slot — packages/components/transfer/__tests__/transfer.test.tsx
- single comment node — packages/components/transfer/__tests__/transfer.test.tsx
- multiple comment nodes — packages/components/transfer/__tests__/transfer.test.tsx
- contents with multiple comment nodes — packages/components/transfer/__tests__/transfer.test.tsx
- empty slots — packages/components/transfer/__tests__/transfer.test.tsx
- render left-empty and right-empty slots — packages/components/transfer/__tests__/transfer.test.tsx
- render default empty content when slots not provided — packages/components/transfer/__tests__/transfer.test.tsx
- show no match content when filtering — packages/components/transfer/__tests__/transfer.test.tsx
- virtual scroll — packages/components/transfer/__tests__/transfer.test.tsx
- create with item-size — packages/components/transfer/__tests__/transfer.test.tsx
- check — packages/components/transfer/__tests__/transfer.test.tsx
- transfer — packages/components/transfer/__tests__/transfer.test.tsx
- reset scroll offset after filtering — packages/components/transfer/__tests__/transfer.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
