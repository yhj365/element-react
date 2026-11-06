# Button 源码目录设计

- 来源：packages/components/button
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：语义色、尺寸、plain/text/link/bg/round/circle/dashed；禁用、loading 与自定义图标；原生 submit/reset；自定义标签/颜色；双汉字间距；ButtonGroup 方向及继承。
- 家族设计：[button](../components/button.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/button/index.ts（SHA256 d0f0dcfaab0c0f7e1ca0af6df30e7b9c6dc0925ab1d5335c5bca7811636e016f）
- packages/components/button/src/button-custom.ts（SHA256 d6e93b0046d9e47e789fea7f9fadb8a209ac03d2f6eea023f81c670f07b8716f）
- packages/components/button/src/button-group.ts（SHA256 e07351e77453a944aaf05f50e0d7c250487b57628a625dcd3003bd6e58cfaf77）
- packages/components/button/src/button-group.vue（SHA256 b4ffa4957c7db2216795cfcd912d7582f376b4c50ac47dac51b33740e5ac39a2）
- packages/components/button/src/button.ts（SHA256 8916163e2d9347d286dd04e011678eebfef18a393cfc60606655982bb7c1d065）
- packages/components/button/src/button.vue（SHA256 cb660cc5a9b3f0a65312bf91c3b01723d12663964cd52cbeb4f3b1ae5812eea5）
- packages/components/button/src/constants.ts（SHA256 372012954b82357f3e9034950fdd1fa48ffbe06295c231dbfb5779930b0dd02c）
- packages/components/button/src/instance.ts（SHA256 2612e4a6242910a64c3034084c542c0c51d789ec5d021a43950aabcba8df3bf1）
- packages/components/button/src/use-button.ts（SHA256 d85b8aea537bbc529895b9723e684e68040a474a265081689d310e1cc0471f7b）
- packages/components/button/style/css.ts（SHA256 708f99aa98662ff8e9adbeacbcf3d634ead488c4cbcbbdaf9e91c5251bf253f7）
- packages/components/button/style/index.ts（SHA256 53a2ab9efe1952146be4df56ab59de1e583261ef169531472b907080a98a4e61）
- packages/components/button/__tests__/button.test.tsx（SHA256 bb27f513f43eeaecc4699926e2d37fbbbd20e67e3b304bfb4f7cea8433c6fd01）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Button.vue — packages/components/button/__tests__/button.test.tsx
- create — packages/components/button/__tests__/button.test.tsx
- icon — packages/components/button/__tests__/button.test.tsx
- nativeType — packages/components/button/__tests__/button.test.tsx
- loading — packages/components/button/__tests__/button.test.tsx
- size — packages/components/button/__tests__/button.test.tsx
- plain — packages/components/button/__tests__/button.test.tsx
- round — packages/components/button/__tests__/button.test.tsx
- circle — packages/components/button/__tests__/button.test.tsx
- dashed — packages/components/button/__tests__/button.test.tsx
- should give component dashed higher priority than global — packages/components/button/__tests__/button.test.tsx
- text — packages/components/button/__tests__/button.test.tsx
- link — packages/components/button/__tests__/button.test.tsx
- render text — packages/components/button/__tests__/button.test.tsx
- handle click — packages/components/button/__tests__/button.test.tsx
- handle click inside — packages/components/button/__tests__/button.test.tsx
- loading implies disabled — packages/components/button/__tests__/button.test.tsx
- disabled — packages/components/button/__tests__/button.test.tsx
- loading icon — packages/components/button/__tests__/button.test.tsx
- loading slot — packages/components/button/__tests__/button.test.tsx
- tag — packages/components/button/__tests__/button.test.tsx
- Button Group — packages/components/button/__tests__/button.test.tsx
- create — packages/components/button/__tests__/button.test.tsx
- button group reactive size — packages/components/button/__tests__/button.test.tsx
- button group type — packages/components/button/__tests__/button.test.tsx
- add space in two Chinese characters — packages/components/button/__tests__/button.test.tsx
- add space between two Chinese characters even if there is whitespace at both ends — packages/components/button/__tests__/button.test.tsx
- should use props of form — packages/components/button/__tests__/button.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/button/__tests__/button.test.tsx
- should use size of form-item — packages/components/button/__tests__/button.test.tsx
- use custom tag disabled click not triggered — packages/components/button/__tests__/button.test.tsx
- direction prop — packages/components/button/__tests__/button.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
