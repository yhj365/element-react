# Tabs 源码目录设计

- 来源：packages/components/tabs
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Tabs/TabPane；受控激活、位置、风格、拉伸；可新增/删除、beforeLeave 异步拦截；延迟内容挂载；溢出导航、键盘与自定义标签。
- 家族设计：[tabs](../components/tabs.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tabs/index.ts（SHA256 b1841c2216966f7301c70346d3d00d9e8207241aed28c1b0b704c74391c04af3）
- packages/components/tabs/src/composables/use-tab-nav-touch.ts（SHA256 19de4b06d03275472f9e1823aa985f6a9f2fbc247b815a3ce8775ee259830639）
- packages/components/tabs/src/constants.ts（SHA256 94609734ebf33a691bd3e787dcb3112940a3c35bd36e6dfb3734d1fbfa9c168a）
- packages/components/tabs/src/tab-bar.ts（SHA256 2bfd5b47fddf5b8da73a87027735ec3c73c958d4e4f5cf8069cd52b6aa9effb4）
- packages/components/tabs/src/tab-bar.vue（SHA256 14802505c3cbbf3f6b78536e7b1991e8b887db285ac33c3fd9b276e9cbfdd41e）
- packages/components/tabs/src/tab-nav.tsx（SHA256 07e2d6a9ae8d486308e8b299ea59c818d8e65efbf3e2415f93f4ae84cef1c05f）
- packages/components/tabs/src/tab-pane.ts（SHA256 8417f8713eb2b8b7669258716f76b61e91a63748de6c68fb1f2f455e4d3baaba）
- packages/components/tabs/src/tab-pane.vue（SHA256 2ff01b56bbdb2c8d3da8600b98b0892af9ce89f450493f27f0b8ee5e26cbc1a6）
- packages/components/tabs/src/tabs.tsx（SHA256 9ec82e9091665a57fb123ebdd41c23826897ab4389d9900acea0ff0b2b9a643e）
- packages/components/tabs/style/css.ts（SHA256 62fc48b078866d1ce641e1adbcb78c5317afb40b406b3383050dfffed7d92f35）
- packages/components/tabs/style/index.ts（SHA256 3350591cd0d7ad25ab5fcc490492e3e1afa2e17fc9251155066f8eab4afd2bc2）
- packages/components/tabs/__tests__/tabs.test.tsx（SHA256 9b900d514612248718ebae24533ceadfae887e27bfea8d02b839212015b250ba）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Tabs.vue — packages/components/tabs/__tests__/tabs.test.tsx
- create — packages/components/tabs/__tests__/tabs.test.tsx
- active-name — packages/components/tabs/__tests__/tabs.test.tsx
- default-value — packages/components/tabs/__tests__/tabs.test.tsx
- tab bar is always rendered with default-value — packages/components/tabs/__tests__/tabs.test.tsx
- tab bar is visible without default-value — packages/components/tabs/__tests__/tabs.test.tsx
- tab bar disables transition until initial position is ready — packages/components/tabs/__tests__/tabs.test.tsx
- card — packages/components/tabs/__tests__/tabs.test.tsx
- border card — packages/components/tabs/__tests__/tabs.test.tsx
- dynamic — packages/components/tabs/__tests__/tabs.test.tsx
- editable — packages/components/tabs/__tests__/tabs.test.tsx
- addable & closable — packages/components/tabs/__tests__/tabs.test.tsx
- tab order — packages/components/tabs/__tests__/tabs.test.tsx
- closable in tab-pane — packages/components/tabs/__tests__/tabs.test.tsx
- disabled — packages/components/tabs/__tests__/tabs.test.tsx
- tab-position — packages/components/tabs/__tests__/tabs.test.tsx
- stretch — packages/components/tabs/__tests__/tabs.test.tsx
- tab active bar offset — packages/components/tabs/__tests__/tabs.test.tsx
- horizontal-scrollable — packages/components/tabs/__tests__/tabs.test.tsx
- vertical-scrollable — packages/components/tabs/__tests__/tabs.test.tsx
- should work with lazy — packages/components/tabs/__tests__/tabs.test.tsx
- before leave — packages/components/tabs/__tests__/tabs.test.tsx
- keyboard event — packages/components/tabs/__tests__/tabs.test.tsx
- resize — packages/components/tabs/__tests__/tabs.test.tsx
- DOM update finished calculating navOffset — packages/components/tabs/__tests__/tabs.test.tsx
- value type — packages/components/tabs/__tests__/tabs.test.tsx
- both number and string for name — packages/components/tabs/__tests__/tabs.test.tsx
- tab-pane nested — packages/components/tabs/__tests__/tabs.test.tsx
- set modelValue synchronously — packages/components/tabs/__tests__/tabs.test.tsx
- set modelValue asynchronously using beforeLeave — packages/components/tabs/__tests__/tabs.test.tsx
- event order: tabClick -> update:modelValue -> tabChange — packages/components/tabs/__tests__/tabs.test.tsx
- event order with beforeLeave: tabClick -> update:modelValue -> tabChange — packages/components/tabs/__tests__/tabs.test.tsx
- tab order should update when v-for array is reordered — packages/components/tabs/__tests__/tabs.test.tsx
- label slot references an element in array — packages/components/tabs/__tests__/tabs.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
