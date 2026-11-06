# Rate 源码目录设计

- 来源：packages/components/rate
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：星级、半星、最大值、只读、清空；颜色和图标阈值；文本与分数；hover/change、键盘和 aria 值。
- 家族设计：[rate](../components/rate.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/rate/index.ts（SHA256 92ef62fd29debe859a7cf27a8128994fc6172ad0365e62d901674558ef63f5d6）
- packages/components/rate/src/rate.ts（SHA256 4ba06a959141a8e7c2926e09bb0fc9cc5136f45ca4a8948200041728d8064cdc）
- packages/components/rate/src/rate.vue（SHA256 4a711f9cec510494592c0c904726641707a3a182ca2a90c9e67e1279af778662）
- packages/components/rate/style/css.ts（SHA256 ec31b6e006d79dc18c87549f5da8cc506ce7ecb9c9981b1aa4f57c92a5f720e7）
- packages/components/rate/style/index.ts（SHA256 2246d4abfeed009105eeb94ee16b05b02b70f73e184db80f5cd1eb2f216d8603）
- packages/components/rate/__tests__/rate.test.tsx（SHA256 0e257e92120cde0847c067a422d108d266af951f6d5ea94e22dc00606aeb8edf）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Rate.vue — packages/components/rate/__tests__/rate.test.tsx
- create — packages/components/rate/__tests__/rate.test.tsx
- size — packages/components/rate/__tests__/rate.test.tsx
- allow half — packages/components/rate/__tests__/rate.test.tsx
- with texts — packages/components/rate/__tests__/rate.test.tsx
- text color — packages/components/rate/__tests__/rate.test.tsx
- value change — packages/components/rate/__tests__/rate.test.tsx
- click — packages/components/rate/__tests__/rate.test.tsx
- colors — packages/components/rate/__tests__/rate.test.tsx
- change event — packages/components/rate/__tests__/rate.test.tsx
- clearable — packages/components/rate/__tests__/rate.test.tsx
- show background icon when allow-half attribute is true — packages/components/rate/__tests__/rate.test.tsx
- show background icon when disabled attribute is true — packages/components/rate/__tests__/rate.test.tsx
- should clamp modelValue to max when modelValue exceeds max — packages/components/rate/__tests__/rate.test.tsx
- should display correct text when modelValue exceeds max and showText is enabled — packages/components/rate/__tests__/rate.test.tsx
- form item accessibility integration — packages/components/rate/__tests__/rate.test.tsx
- automatic id attachment — packages/components/rate/__tests__/rate.test.tsx
- specified id attachment — packages/components/rate/__tests__/rate.test.tsx
- form item role is group when multiple rates — packages/components/rate/__tests__/rate.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/rate/__tests__/rate.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
