# Tour 源码目录设计

- 来源：packages/components/tour
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Tour/TourStep；目标查找、遮罩镂空、高亮、滚动到目标；步骤受控切换、前后按钮、关闭和完成；丢失目标和动态布局；焦点与层级。
- 家族设计：[tour](../components/tour.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tour/index.ts（SHA256 4baf616b359ede948798e46cb45d87295332d054a46e8569fc6d45869d2f2018）
- packages/components/tour/src/content.ts（SHA256 b8b3ecaa648e2e533a4074afbeff0ffa464ac988e2f3120a95fd520353d7478c）
- packages/components/tour/src/content.vue（SHA256 eabe11871a8d55196e965288f16d61c06f1fb6f39fdeec9b24a13b120489bcbc）
- packages/components/tour/src/helper.ts（SHA256 9eb4222c4ebbb8f56849cec10ffa60c3cca4c6e078a451a8f59c5bf65c289baf）
- packages/components/tour/src/mask.ts（SHA256 25b6fe68b413308ba23a7c0d17d0d0d60112273287dc7a1831ee4be5bb2f4783）
- packages/components/tour/src/mask.vue（SHA256 209503b018e5b6b7285cafdd10e453711363ae57bc0d5434a85a144ab70f2d29）
- packages/components/tour/src/step.ts（SHA256 c6de07c87b984df52da8ea336ba9bf0bb310f9368d14624d035e4a50a8c166a4）
- packages/components/tour/src/step.vue（SHA256 278bf4ed82627e8a234e0347d73e0cf6bd55061d7a883e1ca4e9bb365198107a）
- packages/components/tour/src/steps.ts（SHA256 0b48ee016fa34016977b7a64a10a99c0e5a09f491ff85b11de0cada4d2dd27ed）
- packages/components/tour/src/tour.ts（SHA256 b1a2147960d77232979d9dd0e5d73bee3c97ec3003a9fcaacb9debe80509e74f）
- packages/components/tour/src/tour.vue（SHA256 7a84e2f71fc06ff895db7a827dd571c50a8aceeb8af1b48f5095cfd4ce998c1a）
- packages/components/tour/src/types.ts（SHA256 0db507e4fa47612fe1bef6e0c69e8b276d7e48d1bf329a5220abe8b1f83d0b25）
- packages/components/tour/style/css.ts（SHA256 720fcf8f385bbb0405dc32246eb826f1b56b792fd9ab4af72f5975f6e24df0f3）
- packages/components/tour/style/index.ts（SHA256 6a0263281249c4a6eb433b52aa7073aa2e563ba148f002ae36635c55374f5062）
- packages/components/tour/__tests__/tour.test.tsx（SHA256 7ddb02d806ae84e5996cbbdf1aadd7c0f926cac2c70574a5a5d8cd008066d76b）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Tour.vue — packages/components/tour/__tests__/tour.test.tsx
- basic — packages/components/tour/__tests__/tour.test.tsx
- controlled current — packages/components/tour/__tests__/tour.test.tsx
- uncontrolled current emits update and change with the new step — packages/components/tour/__tests__/tour.test.tsx
- controlled current emits update before change after parent syncs — packages/components/tour/__tests__/tour.test.tsx
- controlled current (fixed value) — packages/components/tour/__tests__/tour.test.tsx
- no mask — packages/components/tour/__tests__/tour.test.tsx
- custom indicator — packages/components/tour/__tests__/tour.test.tsx
- primary — packages/components/tour/__tests__/tour.test.tsx
- no target — packages/components/tour/__tests__/tour.test.tsx
- button props — packages/components/tour/__tests__/tour.test.tsx
- close-on-press-escape — packages/components/tour/__tests__/tour.test.tsx
- closing does not emit change when current resets — packages/components/tour/__tests__/tour.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
