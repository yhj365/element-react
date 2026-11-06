# TableV2 源码目录设计

- 来源：packages/components/table-v2
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：固定/动态行高虚拟表格；columns/data/rowKey；固定列、宽高、缓存与滚动；树展开、排序状态、自定义行/单元格/头部；AutoResizer；不自动宣称拥有Table全部功能。
- 家族设计：[table-v2](../components/table-v2.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/table-v2/index.ts（SHA256 18cd78097b4bade3bb993f92486efa02d5d17d8938681270d2f94921aeb6169b）
- packages/components/table-v2/src/auto-resizer.ts（SHA256 0f9d212daa914bd8d9362612d9e6f926190f93b02b9e86c9842eaca32dea87ca）
- packages/components/table-v2/src/cell.ts（SHA256 56b146cd4bb9ddd10e6e79c3ff20e486836ac8b1e7064f3b2e47cdb5e48c34ad）
- packages/components/table-v2/src/common.ts（SHA256 1ce89adb415569c19f3b918a573c984caf69fcb442d209ca4bffde7e53559eac）
- packages/components/table-v2/src/components/auto-resizer.tsx（SHA256 2eca14620d5ddad1eb2bdac2316f27b940be0daa60eaf488fc3b1e248038766d）
- packages/components/table-v2/src/components/cell.tsx（SHA256 b8a9a0925c948fd51e6fb016a5c74c0d40a7ac246b7bd95489946d33e42fc713）
- packages/components/table-v2/src/components/expand-icon.tsx（SHA256 e2fd07e9e7f274f63bb8f652fc6459c5d32977b9e8771899d70730491f1ec2e5）
- packages/components/table-v2/src/components/header-cell.tsx（SHA256 c3c7578817b2a784e8b7403f0707f03e685d163b5ceedd450beec8543138a180）
- packages/components/table-v2/src/components/header-row.tsx（SHA256 99d811e7371b6698022914c784a1bb53d57a13104c5b835d465a8e084a9d2249）
- packages/components/table-v2/src/components/header.tsx（SHA256 22c5be3285ab5d03061c7d272e46e2d7bac5957f17ed409edb02659d10378b9f）
- packages/components/table-v2/src/components/index.ts（SHA256 c6a04936f5337bff68c581b5a23577defb0a4263c4fbe1f323a9dfea266c5cda）
- packages/components/table-v2/src/components/row.tsx（SHA256 a5fd9c5d777aad80ff8cc346bbf0da35aa2915323fa3aa87987fc583690e9702）
- packages/components/table-v2/src/components/sort-icon.tsx（SHA256 fa01996057dcce343d5a65bb32b61fe4d9986b656f71f0c46649217d4542ee6b）
- packages/components/table-v2/src/composables/index.ts（SHA256 64962aef5c6dfcc1c7803e89cd8561f23b79ccccd476a4f9ef1862f5e34f377d）
- packages/components/table-v2/src/composables/use-auto-resize.ts（SHA256 a2c66083e47cf5ec0b5a5a83230645df3f430d2b76642c06b1b4eeb2fffe0448）
- packages/components/table-v2/src/composables/use-columns.ts（SHA256 ba643e11de36f03daba1d95f8ee853a87c82b03396980b3afc3944a4909d2e4e）
- packages/components/table-v2/src/composables/use-data.ts（SHA256 6d5a8d346a166dac7c53fef603dcff49c7b7f8a3067dbb2c18ad5df2cfde84be）
- packages/components/table-v2/src/composables/use-row.ts（SHA256 c54f4bb82d2d9b8b6b3d40c40611902f0a9f06803445ec5f1455e395dbe82112）
- packages/components/table-v2/src/composables/use-scrollbar.ts（SHA256 f07165b6223dd29dae9b41f4a4c54ac563cd78442cbe92532163816c825f5614）
- packages/components/table-v2/src/composables/use-styles.ts（SHA256 3918e64c23aa948c7fb5a9dfd2e357d239b14a2bfa17400938858ee369c30c16）
- packages/components/table-v2/src/composables/utils.ts（SHA256 6eadc72db652554e433af2fb0942450a63613bf105dfb812d81f7c7d3e03a4ab）
- packages/components/table-v2/src/constants.ts（SHA256 a5adbfb28976d45fec467634ce8223c6f19a640d91dcfd32e1c00a8d22c26508）
- packages/components/table-v2/src/grid.ts（SHA256 f7aadde6e7afffe606de483ff67637ac9a72b32e991eae636933adb39257eb3e）
- packages/components/table-v2/src/header-cell.ts（SHA256 6a6a0438182e5449d0e1913df923718cff7465dca415c505bc39da07b44ef5b6）
- packages/components/table-v2/src/header-row.ts（SHA256 191cedbb55046d63d02fbf825baaaadccf3db1dbd391f4367f3161a400cba1cb）
- packages/components/table-v2/src/header.ts（SHA256 611624aa95597d71f7b55f7aa82ac1ad9062a0b5a6dab8f18ca612f7025b8bbc）
- packages/components/table-v2/src/private.ts（SHA256 5f5f5904b0a9cd38212b8e589149455787be5270242ab4b0e0cb946943068df5）
- packages/components/table-v2/src/renderers/cell.tsx（SHA256 d1900efce56f66d799dd2cab9482241c0ead6f81aef2237a060e468a2789d3de）
- packages/components/table-v2/src/renderers/empty.tsx（SHA256 47ea5aaa74cbe43c134c49111056c43e7bd826d8f4e694d87b7f6ae03d433ec1）
- packages/components/table-v2/src/renderers/footer.tsx（SHA256 945cb67438ad66452a91bb5274fb64773c6c0c0acd3694ec6ee963f1a5739e45）
- packages/components/table-v2/src/renderers/header-cell.tsx（SHA256 e39e60a62d4b28e7700f74489d058b9f95b36461e70f6a173b871c5a1e9ba8e9）
- packages/components/table-v2/src/renderers/header.tsx（SHA256 5c6ff6cb396f8dc974a0abe4baa6e5093b0a3d324ade5e0f334b9719d2227be8）
- packages/components/table-v2/src/renderers/left-table.tsx（SHA256 b4aa417d1bf82362f6a75908be35bf7b43f849570971dc4b5bbb29daf884bf38）
- packages/components/table-v2/src/renderers/main-table.tsx（SHA256 496da8c0ae4b3c49bb0d3e4f6a290bf3f8316537eea04fb90736385bc3a88f8b）
- packages/components/table-v2/src/renderers/overlay.tsx（SHA256 d1f28cff34e227c98beeabd6d278279ef811530a4ff5f13d69b38c632fd9a96d）
- packages/components/table-v2/src/renderers/right-table.tsx（SHA256 ae4829d8ff63a79096948c68b9a1a64f27282b444734c85736f5e393df5eca63）
- packages/components/table-v2/src/renderers/row.tsx（SHA256 20bb5ef66038619987d826d47735034fc6d93a03a0a328977d4b6df1e9437bc7）
- packages/components/table-v2/src/row.ts（SHA256 22fe373793dd060e80d7898ba7916ee09534e09e455477e466cfc1c5493351f8）
- packages/components/table-v2/src/table-grid.tsx（SHA256 ca38097bb6b3ec8ba7cc74f7e86b1244f39a6047473f5dc91d1b240f1561963c）
- packages/components/table-v2/src/table-v2.tsx（SHA256 354d3d1755a1ab6b0ad1e73382770a9446213d572000532f15d4d1b401cb97c5）
- packages/components/table-v2/src/table.ts（SHA256 188926b44e3642266ce57c62780b670996ce6b9066d19b461c1c1d24a300d1b3）
- packages/components/table-v2/src/tokens.ts（SHA256 e102dff635b239cdaff9d32f9ac4417ccd23bfad276f3c652603d0a07b318117）
- packages/components/table-v2/src/types.ts（SHA256 49a77beeacab5f88d1663fde33efa162e7d421b04247877e710211c0e45469ee）
- packages/components/table-v2/src/use-table.ts（SHA256 090118562379881c8d70a289c785313a2116ab5881bb93f70b8f886d55b335c4）
- packages/components/table-v2/src/utils.ts（SHA256 54aeb882405a487370bde50427bfd8642bdbecb284a204dc9249f3f6695c881a）
- packages/components/table-v2/style/css.ts（SHA256 0bc6fd63e747a45aee4d21e9f905729399393f282bea48aa668c7ffe7c64f654）
- packages/components/table-v2/style/index.ts（SHA256 f6c13c6d09c686b2b1e897f2a99a6bd5b00b07ad2d3e67892e09c83276506470）
- packages/components/table-v2/__tests__/table-v2.test.tsx（SHA256 8cfc9b2a404ff69a5989793a2e53bdb169c6343039fc323c45adf0883024c9ba）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- TableV2.vue — packages/components/table-v2/__tests__/table-v2.test.tsx
- slots cell — packages/components/table-v2/__tests__/table-v2.test.tsx
- slots header-cell — packages/components/table-v2/__tests__/table-v2.test.tsx
- slots empty — packages/components/table-v2/__tests__/table-v2.test.tsx
- slots cell scope — packages/components/table-v2/__tests__/table-v2.test.tsx
- slots header-cell scope — packages/components/table-v2/__tests__/table-v2.test.tsx
- respects column flexShrink = 0 — packages/components/table-v2/__tests__/table-v2.test.tsx
- expandable mode wrongly enabled, by column not key — packages/components/table-v2/__tests__/table-v2.test.tsx
- scrollToRow keeps horizontal offset unchanged — packages/components/table-v2/__tests__/table-v2.test.tsx
- a11y — packages/components/table-v2/__tests__/table-v2.test.tsx
- expand button — packages/components/table-v2/__tests__/table-v2.test.tsx
- sort button — packages/components/table-v2/__tests__/table-v2.test.tsx
- expand button of sub-row should not apply margin style of icon — packages/components/table-v2/__tests__/table-v2.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
