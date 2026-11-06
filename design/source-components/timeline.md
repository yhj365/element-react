# Timeline 源码目录设计

- 来源：packages/components/timeline
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：TimelineItem；时间戳位置、类型/尺寸/颜色/图标和空心节点；自定义内容、顺序及长文本。
- 家族设计：[timeline](../components/timeline.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/timeline/index.ts（SHA256 4d968a481ea70391d64de8ac998e06d25a0e403c584f2fcef0103b238460672b）
- packages/components/timeline/src/timeline-item.ts（SHA256 8113614a3bef767541b54b3d1ff7d5e44431d5a988ee1f1ee0fad4d09a2a264c）
- packages/components/timeline/src/timeline-item.vue（SHA256 fba8a40ec3859e502aaf46069c0b740f94530697c3cb95c61ee6d1cfddc61cd0）
- packages/components/timeline/src/timeline.ts（SHA256 9450adb87dc7983da9f6e99fc96825e24f2a9c0f73bda73e46372ff878c85db1）
- packages/components/timeline/src/tokens.ts（SHA256 e84e544b052bfe90adce3a83e77bfd71fb4ea8a3ac7d2c205f66498ca15b07bb）
- packages/components/timeline/style/css.ts（SHA256 2c4ff8574296a187b02734b07269bfaa05939d7e7e30f8241a3a716d319d79cf）
- packages/components/timeline/style/index.ts（SHA256 7b5a116c282c591deb53e9f852273440f8441205e25b85a818ac14ba09613197）
- packages/components/timeline/__tests__/timeline.test.tsx（SHA256 001a63c3b06b31a7a362f113b7bbc2e8c171a5f58bbe9e507686327593dcee64）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- TimeLine.vue — packages/components/timeline/__tests__/timeline.test.tsx
- create — packages/components/timeline/__tests__/timeline.test.tsx
- placement — packages/components/timeline/__tests__/timeline.test.tsx
- mode — packages/components/timeline/__tests__/timeline.test.tsx
- mode-start — packages/components/timeline/__tests__/timeline.test.tsx
- mode-alternate — packages/components/timeline/__tests__/timeline.test.tsx
- mode-alternate-reverse — packages/components/timeline/__tests__/timeline.test.tsx
- mode-end — packages/components/timeline/__tests__/timeline.test.tsx
- hide-timestamp — packages/components/timeline/__tests__/timeline.test.tsx
- color — packages/components/timeline/__tests__/timeline.test.tsx
- type — packages/components/timeline/__tests__/timeline.test.tsx
- size — packages/components/timeline/__tests__/timeline.test.tsx
- icon — packages/components/timeline/__tests__/timeline.test.tsx
- hollow — packages/components/timeline/__tests__/timeline.test.tsx
- dot — packages/components/timeline/__tests__/timeline.test.tsx
- center — packages/components/timeline/__tests__/timeline.test.tsx
- The content that is not a timeline item in the sub-slot should be rendered — packages/components/timeline/__tests__/timeline.test.tsx
- reverse — packages/components/timeline/__tests__/timeline.test.tsx
- v-for children — packages/components/timeline/__tests__/timeline.test.tsx
- manual children — packages/components/timeline/__tests__/timeline.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
