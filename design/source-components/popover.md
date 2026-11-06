# Popover 源码目录设计

- 来源：packages/components/popover
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：多触发方式、受控显隐；标题和内容/自定义内容；宽度、定位、延迟、虚拟触发；复用 Tooltip 内核而保持原API差异。
- 家族设计：[popover](../components/popover.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/popover/index.ts（SHA256 2e6991a1ae28e458033bd83de4af12ffc95f1a97cd75dfc0ece170bae69cd070）
- packages/components/popover/src/directive.ts（SHA256 563c3864971652adda0614fed105e2a3a0dfde5a55adaf13076018b04c6e587c）
- packages/components/popover/src/popover.ts（SHA256 9469e4a203e4c196de00e49ffc90c76148e1d3f9b44cfbe58eb5ec0f0495eab8）
- packages/components/popover/src/popover.vue（SHA256 4a643cc5c3d8a6963196e0f7ec8dc431c79b2c260203b851c358e17286b8c7e7）
- packages/components/popover/style/css.ts（SHA256 8691c486a7acadd5e4f762dac72b43ab3c6ef775279ce96c24315bc940ef791a）
- packages/components/popover/style/index.ts（SHA256 dba6fac892a86e873f3a73ce716d02efbeafd7c389fe1d49d51873b6811e63fc）
- packages/components/popover/__tests__/directive.test.ts（SHA256 b6dcb85dfb386135a3b97c284702c9b6857134ab58905bf251f43fbc9188376b）
- packages/components/popover/__tests__/directive.test.tsx（SHA256 fe42e7e38936512f584dcb5d98d9047dc62c6bbaab9be497e786d6d226ccbe3e）
- packages/components/popover/__tests__/popover.test.tsx（SHA256 69b240d74a320184720d02e9cca84f8724bb2db7de76945a4dbf5327d00db34b）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- v-popover — packages/components/popover/__tests__/directive.test.ts
- should render correctly — packages/components/popover/__tests__/directive.test.ts
- should show popover when reference is mounted — packages/components/popover/__tests__/directive.test.ts
- v-popover — packages/components/popover/__tests__/directive.test.tsx
- should render correctly — packages/components/popover/__tests__/directive.test.tsx
- should show popover when reference is mounted — packages/components/popover/__tests__/directive.test.tsx
- Popover.vue — packages/components/popover/__tests__/popover.test.tsx
- render test — packages/components/popover/__tests__/popover.test.tsx
- should render with title — packages/components/popover/__tests__/popover.test.tsx
- the content should be overrode by slots — packages/components/popover/__tests__/popover.test.tsx
- should render content when no slots were passed — packages/components/popover/__tests__/popover.test.tsx
- popper z-index should be dynamical — packages/components/popover/__tests__/popover.test.tsx
- defined hide method — packages/components/popover/__tests__/popover.test.tsx
- should be able to emit after-enter and after-leave — packages/components/popover/__tests__/popover.test.tsx
- test visible controlled mode trigger invalid — packages/components/popover/__tests__/popover.test.tsx
- test v-model:visible — packages/components/popover/__tests__/popover.test.tsx
- teleported API — packages/components/popover/__tests__/popover.test.tsx
- should mount on popper container — packages/components/popover/__tests__/popover.test.tsx
- should not mount on the popper container — packages/components/popover/__tests__/popover.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
