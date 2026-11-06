# Autocomplete 源码目录设计

- 来源：packages/components/autocomplete
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：同步/异步建议；输入防抖、触发策略；键盘高亮和选择；自定义建议渲染、清空、远程结果过期保护。
- 家族设计：[autocomplete](../components/autocomplete.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/autocomplete/index.ts（SHA256 f594e43507e444ab2791c55064b8d84f22f2830167e7e2aaf54c636df220a824）
- packages/components/autocomplete/src/autocomplete.ts（SHA256 dcefe3e1826857f742b52bcfe7c27d3d9014c050875793301aca5534aa3c1e1c）
- packages/components/autocomplete/src/autocomplete.vue（SHA256 43adeb64e862633b969b002be06c0694b748e56482047f79e9a7e3df7aa6e37d）
- packages/components/autocomplete/style/css.ts（SHA256 b591375013df9e926e1c90f7920e6fdaddc9d0f35a9f6df521d98dc1b6e7468f）
- packages/components/autocomplete/style/index.ts（SHA256 4470aa8f055bd4ea4343b649a7f41354564f32a1716b8a61afd3cb94638523ca）
- packages/components/autocomplete/__tests__/autocomplete.test.tsx（SHA256 59d9ae4e6b42a6ff2aae2f3417a70cd75fcb2c91af170eda2b779ea57eb6ec55）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Autocomplete.vue — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- placeholder — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- triggerOnFocus — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- triggerOnEnter — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- focus triggerOnEnter — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- popperClass — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- teleported — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- debounce / fetchSuggestions — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- fetchSuggestions with fn-promise — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- fetchSuggestions with fn-async — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- fetchSuggestions with fn-arr — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- fetchSuggestions with arr — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- valueKey / modelValue — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- modelValue default null — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- hideLoading — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- selectWhenUnmatched — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- highlightFirstItem — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- keyboard navigation should loop when loopNavigation is true — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- keyboard navigation should not loop when loopNavigation is false — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- keyboard navigation with Home, End, PageUp, PageDown — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- fitInputWidth — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- teleported API — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- should mount on popper container — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- should not mount on the popper container — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- form item accessibility integration — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- automatic id attachment — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- specified id attachment — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- form item role is group when multiple autocompletes — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- event:focus — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- event:blur — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- test a11y supports — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- test a11y attributes — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- new slots: header & footer — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- header slot renders — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- should render footer slot — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- should select the option when using Enter or Numpad Enter — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- use Enter — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- use Numpad Enter — packages/components/autocomplete/__tests__/autocomplete.test.tsx
- clears stale suggestions on refocus before debounce completes — packages/components/autocomplete/__tests__/autocomplete.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
