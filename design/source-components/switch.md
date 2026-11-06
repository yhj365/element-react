# Switch 源码目录设计

- 来源：packages/components/switch
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：开关值、active/inactive 自定义值和文字/图标；内联提示、尺寸、颜色；beforeChange 异步拦截、loading、禁用和表单。
- 家族设计：[switch](../components/switch.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/switch/index.ts（SHA256 c24228dac6eed6283613216bed7e50647031880aeed3c28d0d4de695c17d21a4）
- packages/components/switch/src/switch.ts（SHA256 eeb78de259a8bfc25385a48a6520cfb48d5bd8fe1605d18d28e13910a274398d）
- packages/components/switch/src/switch.vue（SHA256 fbd27cd7c7bc0c84d392950180afb421c9078fdf8fb894c559907d117b129363）
- packages/components/switch/style/css.ts（SHA256 08f836c9fbd1c874803442da036d64e34e7a59f11e40fc0a903bbe30684259a6）
- packages/components/switch/style/index.ts（SHA256 c976fa4c566ff884681280ce00985ae28ab5c82d27c9be1ee6c3326873cd8ff2）
- packages/components/switch/__tests__/switch.test.tsx（SHA256 dc9a0d783808bd78b2027613134780ef6d9b8117abe1772fbef60c15d0452169）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Switch.vue — packages/components/switch/__tests__/switch.test.tsx
- create — packages/components/switch/__tests__/switch.test.tsx
- size — packages/components/switch/__tests__/switch.test.tsx
- tabindex — packages/components/switch/__tests__/switch.test.tsx
- inline prompt — packages/components/switch/__tests__/switch.test.tsx
- switch with icons — packages/components/switch/__tests__/switch.test.tsx
- value correctly update — packages/components/switch/__tests__/switch.test.tsx
- change event — packages/components/switch/__tests__/switch.test.tsx
- disabled switch should not respond to user click — packages/components/switch/__tests__/switch.test.tsx
- expand switch value — packages/components/switch/__tests__/switch.test.tsx
- default switch active-value is false — packages/components/switch/__tests__/switch.test.tsx
- value is the single source of truth — packages/components/switch/__tests__/switch.test.tsx
- model-value is the single source of truth — packages/components/switch/__tests__/switch.test.tsx
- sets checkbox value — packages/components/switch/__tests__/switch.test.tsx
- beforeChange function return promise — packages/components/switch/__tests__/switch.test.tsx
- beforeChange function return boolean — packages/components/switch/__tests__/switch.test.tsx
- custom action icon — packages/components/switch/__tests__/switch.test.tsx
- form item accessibility integration — packages/components/switch/__tests__/switch.test.tsx
- automatic id attachment — packages/components/switch/__tests__/switch.test.tsx
- specified id attachment — packages/components/switch/__tests__/switch.test.tsx
- form item role is group when multiple inputs — packages/components/switch/__tests__/switch.test.tsx
- custom switch action slots — packages/components/switch/__tests__/switch.test.tsx
- should render correctly custom active & inactive slots — packages/components/switch/__tests__/switch.test.tsx
- should render correctly custom active & inactive slots when inline-prompt is true — packages/components/switch/__tests__/switch.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/switch/__tests__/switch.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
