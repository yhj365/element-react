# Slider 源码目录设计

- 来源：packages/components/slider
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：单值/范围、min/max/step、刻度/停顿点；输入框、Tooltip、竖向；拖动和键盘、input/change 区分；禁用与非法范围。
- 家族设计：[slider](../components/slider.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/slider/index.ts（SHA256 d724225e88da8a2dfa6a70cf6e283c09628eba29a31a88d9220eb9c36d7d9650）
- packages/components/slider/src/button.ts（SHA256 c5a773fa39c144a6d9613dfce8021f3b01fcd7e260410b8a65ce7a4cf0fb14af）
- packages/components/slider/src/button.vue（SHA256 1619189325326aab6829ae8727628c7dc7d1b91fb5e796801a43039866bc4b3a）
- packages/components/slider/src/composables/index.ts（SHA256 4db8170003872b79b8044a681396d0784220f9b450c16197c55dc49bf4cc8ad2）
- packages/components/slider/src/composables/use-lifecycle.ts（SHA256 af7196b7e95d3ed429bb25c4b6b1fdaaf04245f8f700bc9a4851673a8fc572ae）
- packages/components/slider/src/composables/use-marks.ts（SHA256 312ab9b200ce31fc52d2158e3dd8faad312d1c7e9087ce6c3e98eb4ef454a4a2）
- packages/components/slider/src/composables/use-slide.ts（SHA256 b0911ce824e5f5aab3e2cd3167f351bd3595761fd9ca91ed3531836ef760705f）
- packages/components/slider/src/composables/use-slider-button.ts（SHA256 53867dfede999882064e823ddaff7591e9135ec3c9437855fea4ca0b956a573f）
- packages/components/slider/src/composables/use-stops.ts（SHA256 310a7945e81bbb977edb3ac7656313ce2d5d2a49983bc8ba20787ed4abb3848d）
- packages/components/slider/src/composables/use-watch.ts（SHA256 48fb10d0d422fb9bccf380a70ccc6918c7f7db31a406661746e1f653357f0d84）
- packages/components/slider/src/constants.ts（SHA256 761f10bc0c43e36e3e7535ff32c8e355083a113c6e0eb1d447a26bc6ddb0cb19）
- packages/components/slider/src/marker.ts（SHA256 bba981c4293f972bde6737bd6b597d7beb465e1eae6fc7e79d77caf02f07a9ea）
- packages/components/slider/src/slider.ts（SHA256 ae554656be34bb72200945d35e70f088291fc841e1cd89954eafe61ffafef8e9）
- packages/components/slider/src/slider.vue（SHA256 3c6db3735a6e0f7e012e056ab1ca994c0023dfeff443e33e06181eeb1fac0b82）
- packages/components/slider/style/css.ts（SHA256 60ff875ceb58ef344d06a4ca8c931f0e661cc631f856e119a27702baa83f40ca）
- packages/components/slider/style/index.ts（SHA256 e4658219f1ae72c6f5fbe9ffc7a94993fa35b9d5af00453059960c390814c44c）
- packages/components/slider/__tests__/slider.test.tsx（SHA256 9af10a453a4193f75ad8f8d14a87f33ae3873d6f3f03fc5ec24dad205fa6dd5c）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Slider — packages/components/slider/__tests__/slider.test.tsx
- create — packages/components/slider/__tests__/slider.test.tsx
- should not exceed min and max — packages/components/slider/__tests__/slider.test.tsx
- sizes — packages/components/slider/__tests__/slider.test.tsx
- show tooltip — packages/components/slider/__tests__/slider.test.tsx
- hide tooltip — packages/components/slider/__tests__/slider.test.tsx
- format tooltip — packages/components/slider/__tests__/slider.test.tsx
- placement — packages/components/slider/__tests__/slider.test.tsx
- drag — packages/components/slider/__tests__/slider.test.tsx
- horizontal — packages/components/slider/__tests__/slider.test.tsx
- vertical — packages/components/slider/__tests__/slider.test.tsx
- should correctly handle uneven step sizes — packages/components/slider/__tests__/slider.test.tsx
- accessibility — packages/components/slider/__tests__/slider.test.tsx
- left/right arrows — packages/components/slider/__tests__/slider.test.tsx
- up/down arrows — packages/components/slider/__tests__/slider.test.tsx
- page up/down keys — packages/components/slider/__tests__/slider.test.tsx
- home/end keys — packages/components/slider/__tests__/slider.test.tsx
- should have appropriate ARIA attributes — packages/components/slider/__tests__/slider.test.tsx
- step — packages/components/slider/__tests__/slider.test.tsx
- should restrict value when step is mark — packages/components/slider/__tests__/slider.test.tsx
- should restrict value when step is mark with range — packages/components/slider/__tests__/slider.test.tsx
- should keep mark precision when step is mark — packages/components/slider/__tests__/slider.test.tsx
- click — packages/components/slider/__tests__/slider.test.tsx
- change event — packages/components/slider/__tests__/slider.test.tsx
- input event — packages/components/slider/__tests__/slider.test.tsx
- disabled — packages/components/slider/__tests__/slider.test.tsx
- show input — packages/components/slider/__tests__/slider.test.tsx
- precision accuracy 3 — packages/components/slider/__tests__/slider.test.tsx
- show stops — packages/components/slider/__tests__/slider.test.tsx
- vertical mode — packages/components/slider/__tests__/slider.test.tsx
- rerender with min and show-input — packages/components/slider/__tests__/slider.test.tsx
- range — packages/components/slider/__tests__/slider.test.tsx
- basic ranged slider — packages/components/slider/__tests__/slider.test.tsx
- should not exceed min and max — packages/components/slider/__tests__/slider.test.tsx
- click — packages/components/slider/__tests__/slider.test.tsx
- responsive to dynamic min and max — packages/components/slider/__tests__/slider.test.tsx
- show stops — packages/components/slider/__tests__/slider.test.tsx
- marks — packages/components/slider/__tests__/slider.test.tsx
- form item accessibility integration — packages/components/slider/__tests__/slider.test.tsx
- automatic id attachment — packages/components/slider/__tests__/slider.test.tsx
- range with automatic id attachment — packages/components/slider/__tests__/slider.test.tsx
- specified id attachment — packages/components/slider/__tests__/slider.test.tsx
- range with specified id attachment — packages/components/slider/__tests__/slider.test.tsx
- form item role is group when multiple inputs — packages/components/slider/__tests__/slider.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/slider/__tests__/slider.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
