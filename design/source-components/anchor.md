# Anchor 源码目录设计

- 来源：packages/components/anchor
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：容器内锚点导航；水平/垂直布局；偏移和滚动时长；激活线、链接层级、滚动定位、点击及变化事件。
- 家族设计：[anchor](../components/anchor.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/anchor/index.ts（SHA256 eff3feaed061581c99aec25b375a7b3366b7fc9528820ddb24183b3668fe2139）
- packages/components/anchor/src/anchor-link.ts（SHA256 e3da4404a595a097ee065e0c20d07d4e249a30e5d727926ccd385352efa45773）
- packages/components/anchor/src/anchor-link.vue（SHA256 6e448b71eeea64f1439a0cdc52cf3a98bdeb1e00183fd43e06ffab638c677857）
- packages/components/anchor/src/anchor.ts（SHA256 1d41a0556651c8eb7bdf2329eb60ead0ec0864f08a5f98d9f0b8f1eafb584167）
- packages/components/anchor/src/anchor.vue（SHA256 3a60f68d455f3e582ecffd4639c78ee24fcbf0a2bcfe0ce0cddf03583d78af2f）
- packages/components/anchor/src/constants.ts（SHA256 19feb26c4595c3260ce3a6cc58a4295343de86fd70b8486fc60e3e9af1e5f0c3）
- packages/components/anchor/style/css.ts（SHA256 0c79a99dac32752f10f8ae2de57e4b7c00794a33c5d8ed54467de88a32550588）
- packages/components/anchor/style/index.ts（SHA256 1eed1498587287a0cd40c9449e9f82a9847c727bb7e0499525914d51401eeb0a）
- packages/components/anchor/__tests__/anchor.test.tsx（SHA256 76378201287245dee611ce43e22f814f8df72c82510588dae6a309cb55bf2cfb）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Anchor.vue — packages/components/anchor/__tests__/anchor.test.tsx
- snapshot — packages/components/anchor/__tests__/anchor.test.tsx
- scroll after click — packages/components/anchor/__tests__/anchor.test.tsx
- scrollTo method — packages/components/anchor/__tests__/anchor.test.tsx
- change event — packages/components/anchor/__tests__/anchor.test.tsx
- click event — packages/components/anchor/__tests__/anchor.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
