# Radio 源码目录设计

- 来源：packages/components/radio
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Radio/RadioGroup/RadioButton；值类型、禁用、尺寸和边框；组内选中、键盘和 label/value 兼容；表单联动。
- 家族设计：[radio](../components/radio.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/radio/index.ts（SHA256 2712a2594fe47a98a1ec293005e415f9061f1ec469d501526303d50f55dee196）
- packages/components/radio/src/constants.ts（SHA256 4b9d7ceb2d461fd8f9fcb1facec211583e61e9a9c90443ca0e907b24b7577647）
- packages/components/radio/src/radio-button.ts（SHA256 72990c71050ae8f52d43d88ca509d19473b5e2e7c7df4852a83faa6f4faf5347）
- packages/components/radio/src/radio-button.vue（SHA256 c88387126809ee48bd839d0a60dd6644635fd71ef31a88838960d0abfef0a50c）
- packages/components/radio/src/radio-group.ts（SHA256 bd6d8091255c85e6800dba562a790392ba847f3f965e22eb9127b4a847618018）
- packages/components/radio/src/radio-group.vue（SHA256 b31ccc8fb90d701a13f91e2897e803b5eccead3a6fe38abaa9a19397fb2b493d）
- packages/components/radio/src/radio.ts（SHA256 9ec471eb1eb8ea885ad8026953aa382679c8eb4fcce3a65e65415825ee9c8202）
- packages/components/radio/src/radio.vue（SHA256 bd983141f76fbb1e0a2b7c2334b343b933651e9ca56d9d6153e56ab3b552b546）
- packages/components/radio/src/use-radio.ts（SHA256 0da30a3def4fb6d419860d06fff44a34204227bc2a06059561596670a73f010d）
- packages/components/radio/style/css.ts（SHA256 36e6a9767e1280370ba13242c6001f3d97211755826f210cf5d82fc00a8b7e81）
- packages/components/radio/style/index.ts（SHA256 b64b6f6f36f59d9758413f26c5dab10918d2693f704fe057ba0ca4efd721fe93）
- packages/components/radio/__tests__/radio.test.tsx（SHA256 81ab926b26c9febebdea3000a09b5a35bd4f87c27b82c3aa783546a915f09721）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Radio — packages/components/radio/__tests__/radio.test.tsx
- create — packages/components/radio/__tests__/radio.test.tsx
- disabled — packages/components/radio/__tests__/radio.test.tsx
- border — packages/components/radio/__tests__/radio.test.tsx
- change event — packages/components/radio/__tests__/radio.test.tsx
- change event only triggers on user input — packages/components/radio/__tests__/radio.test.tsx
- Radio group — packages/components/radio/__tests__/radio.test.tsx
- create — packages/components/radio/__tests__/radio.test.tsx
- id auto derive — packages/components/radio/__tests__/radio.test.tsx
- disabled — packages/components/radio/__tests__/radio.test.tsx
- change event — packages/components/radio/__tests__/radio.test.tsx
- change event only triggers on user input — packages/components/radio/__tests__/radio.test.tsx
- disabled when children is radio button — packages/components/radio/__tests__/radio.test.tsx
- renders el-radio-group using default option fields — packages/components/radio/__tests__/radio.test.tsx
- renders el-radio-group with custom option fields — packages/components/radio/__tests__/radio.test.tsx
- renders el-radio-group using default option fields with radio-button — packages/components/radio/__tests__/radio.test.tsx
- renders el-radio-group with custom option fields and disabled using el-radio-button — packages/components/radio/__tests__/radio.test.tsx
- should avoid passing alias fields to el-radio — packages/components/radio/__tests__/radio.test.tsx
- passes custom attributes from options to el-radio — packages/components/radio/__tests__/radio.test.tsx
- Radio Button — packages/components/radio/__tests__/radio.test.tsx
- create — packages/components/radio/__tests__/radio.test.tsx
- custom color — packages/components/radio/__tests__/radio.test.tsx
- change event — packages/components/radio/__tests__/radio.test.tsx
- change event only triggers on user input — packages/components/radio/__tests__/radio.test.tsx
- size — packages/components/radio/__tests__/radio.test.tsx
- form item accessibility integration — packages/components/radio/__tests__/radio.test.tsx
- single radio group in form item — packages/components/radio/__tests__/radio.test.tsx
- single radio group in form item, override label — packages/components/radio/__tests__/radio.test.tsx
- multiple radio groups in form item — packages/components/radio/__tests__/radio.test.tsx
- value is number change event need checked — packages/components/radio/__tests__/radio.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/radio/__tests__/radio.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
