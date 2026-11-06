# TimeSelect 源码目录设计

- 来源：packages/components/time-select
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：start/end/step 生成选项；min/max 排除；格式和可编辑/可清空；选择联动、禁用和空集合。
- 家族设计：[time-select](../components/time-select.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/time-select/index.ts（SHA256 29b8066f9770f577fd73cdfa0c6ef2b21bd84b3bcfb3ee9103998e4f46451964）
- packages/components/time-select/src/time-select.ts（SHA256 a24831c27c73ce943b32ab3f0a9918f49662c729fd574613fdabf5505da62183）
- packages/components/time-select/src/time-select.vue（SHA256 20e403bee16dd88d0215cf8ee0c174b42b87f349bd7d2153bf3d87092ec5c0fc）
- packages/components/time-select/src/utils.ts（SHA256 a891bfc2f17c2ad288e392d65c5799ce3adb96ae17808158352de897f0f5bae3）
- packages/components/time-select/style/css.ts（SHA256 8a98f86056a6b1016c8cb917d53ea3aca986a1b2e4578d3060de660e3549b546）
- packages/components/time-select/style/index.ts（SHA256 68056c1ac32487031d163daefd2f510ee7beefd0c24c618ef1f4723817c652ac）
- packages/components/time-select/__tests__/time-select.test.tsx（SHA256 3a5dfec73e2aba564f26098b2c5367b2c456d63431b1db03873e6faab5048240）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- TimeSelect — packages/components/time-select/__tests__/time-select.test.tsx
- create — packages/components/time-select/__tests__/time-select.test.tsx
- should show clear btn on focus — packages/components/time-select/__tests__/time-select.test.tsx
- set default value — packages/components/time-select/__tests__/time-select.test.tsx
- set minTime — packages/components/time-select/__tests__/time-select.test.tsx
- set maxTime — packages/components/time-select/__tests__/time-select.test.tsx
- set value update — packages/components/time-select/__tests__/time-select.test.tsx
- update value — packages/components/time-select/__tests__/time-select.test.tsx
- set disabled — packages/components/time-select/__tests__/time-select.test.tsx
- set editable — packages/components/time-select/__tests__/time-select.test.tsx
- should include end time — packages/components/time-select/__tests__/time-select.test.tsx
- should not duplicate end time when includeEndTime with custom format — packages/components/time-select/__tests__/time-select.test.tsx
- should not include end time — packages/components/time-select/__tests__/time-select.test.tsx
- should include end whenever includeEndTime is false — packages/components/time-select/__tests__/time-select.test.tsx
- ref focus — packages/components/time-select/__tests__/time-select.test.tsx
- ref blur — packages/components/time-select/__tests__/time-select.test.tsx
- set format — packages/components/time-select/__tests__/time-select.test.tsx
- should pass name to inner input — packages/components/time-select/__tests__/time-select.test.tsx
- should fallback to default step when step is 00:00 — packages/components/time-select/__tests__/time-select.test.tsx
- should fallback to default start time when start time is invalid — packages/components/time-select/__tests__/time-select.test.tsx
- should fallback to default start time when start time is negative — packages/components/time-select/__tests__/time-select.test.tsx
- should fallback to default end time when end time is invalid — packages/components/time-select/__tests__/time-select.test.tsx
- should fallback to default end time when end time is negative — packages/components/time-select/__tests__/time-select.test.tsx
- form item accessibility integration — packages/components/time-select/__tests__/time-select.test.tsx
- automatic id attachment — packages/components/time-select/__tests__/time-select.test.tsx
- specified id attachment — packages/components/time-select/__tests__/time-select.test.tsx
- form item role is group when multiple inputs — packages/components/time-select/__tests__/time-select.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/time-select/__tests__/time-select.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
