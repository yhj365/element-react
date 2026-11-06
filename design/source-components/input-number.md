# InputNumber 源码目录设计

- 来源：packages/components/input-number
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：步长、严格步长、精度、min/max；空值和非法值；增减按钮位置、禁用和键盘；解析与显示、变更/提交及表单校验。
- 家族设计：[input-number](../components/input-number.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/input-number/index.ts（SHA256 a424edfcc5613e185c011f97c99461b4c42cdcfd42baa6e35a5742e8e8bc3183）
- packages/components/input-number/src/input-number.ts（SHA256 a45cb3bb6d190c94ae68a60af3892cd5c78590e8113e0c9b5b592771685cec30）
- packages/components/input-number/src/input-number.vue（SHA256 0e89c9024ada2e3fbd1394185d8e128484b0f2cfc941bf9530158f794a4d89b8）
- packages/components/input-number/style/css.ts（SHA256 e2f69ddef7a34614855dfce6b5a79c0cb0d14ff0a82a76adae544e9b211b750d）
- packages/components/input-number/style/index.ts（SHA256 afac5e7be3d1d0b12a70814bcc4d136913cf368d9a0106431907c144afc5b0a4）
- packages/components/input-number/__tests__/input-number.test.tsx（SHA256 efff299cccc43b1f3db64976e4b9cb2c1aa07530f53f26e5d768a40d335f7251）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- InputNumber.vue — packages/components/input-number/__tests__/input-number.test.tsx
- create — packages/components/input-number/__tests__/input-number.test.tsx
- modelValue — packages/components/input-number/__tests__/input-number.test.tsx
- set modelValue undefined to form validate — packages/components/input-number/__tests__/input-number.test.tsx
- dynamic change the precision value should correct re-render — packages/components/input-number/__tests__/input-number.test.tsx
- set modelValue undefined to display placeholder — packages/components/input-number/__tests__/input-number.test.tsx
- Make sure the input action can trigger the modelValue update — packages/components/input-number/__tests__/input-number.test.tsx
- Make sure modelValue correct update when no initial value — packages/components/input-number/__tests__/input-number.test.tsx
- Make sure display value will match actual value — packages/components/input-number/__tests__/input-number.test.tsx
- min — packages/components/input-number/__tests__/input-number.test.tsx
- max — packages/components/input-number/__tests__/input-number.test.tsx
- step, increase and decrease — packages/components/input-number/__tests__/input-number.test.tsx
- step-strictly — packages/components/input-number/__tests__/input-number.test.tsx
- value decimals miss prop precision — packages/components/input-number/__tests__/input-number.test.tsx
- step-strictly precision edge critical judgment — packages/components/input-number/__tests__/input-number.test.tsx
- maximum is less than the minimum — packages/components/input-number/__tests__/input-number.test.tsx
- precision accuracy 2 — packages/components/input-number/__tests__/input-number.test.tsx
- precision accuracy 3 — packages/components/input-number/__tests__/input-number.test.tsx
- readonly — packages/components/input-number/__tests__/input-number.test.tsx
- disabled — packages/components/input-number/__tests__/input-number.test.tsx
- controls — packages/components/input-number/__tests__/input-number.test.tsx
- controls-position — packages/components/input-number/__tests__/input-number.test.tsx
- input-event — packages/components/input-number/__tests__/input-number.test.tsx
- change-event — packages/components/input-number/__tests__/input-number.test.tsx
- blur-event — packages/components/input-number/__tests__/input-number.test.tsx
- focus-event — packages/components/input-number/__tests__/input-number.test.tsx
- check increase and decrease button when modelValue not in [min, max] — packages/components/input-number/__tests__/input-number.test.tsx
- form item accessibility integration — packages/components/input-number/__tests__/input-number.test.tsx
- automatic id attachment — packages/components/input-number/__tests__/input-number.test.tsx
- specified id attachment — packages/components/input-number/__tests__/input-number.test.tsx
- form item role is group when multiple inputs — packages/components/input-number/__tests__/input-number.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/input-number/__tests__/input-number.test.tsx
- use model-value — packages/components/input-number/__tests__/input-number.test.tsx
- use slot custom icon — packages/components/input-number/__tests__/input-number.test.tsx
- step-strictly is true and should keep the initial value and step matching — packages/components/input-number/__tests__/input-number.test.tsx
- align prop class mapping — packages/components/input-number/__tests__/input-number.test.tsx
- correct condition for user input reset — packages/components/input-number/__tests__/input-number.test.tsx
- tabindex — packages/components/input-number/__tests__/input-number.test.tsx
- use formatter and parser — packages/components/input-number/__tests__/input-number.test.tsx
- should display formatted value after blur — packages/components/input-number/__tests__/input-number.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
