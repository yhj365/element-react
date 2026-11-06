# PageHeader 源码目录设计

- 来源：packages/components/page-header
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：返回按钮、图标、标题、内容和额外操作；面包屑；返回事件及窄屏布局。
- 家族设计：[page-header](../components/page-header.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/page-header/index.ts（SHA256 8c007105402e44f2c53dee148143ee82ad66658f24d54efc13bf694cefda6a7a）
- packages/components/page-header/src/page-header.ts（SHA256 2d5ebd53f3fbe6c5568385e51df3f9f87900477426ccdc75a727f24a09e473b2）
- packages/components/page-header/src/page-header.vue（SHA256 90d071f5f275cdfdb08bda434f744bf248603841cc9628a6989388b669e5fb81）
- packages/components/page-header/style/css.ts（SHA256 22f125db2a08602a5e11748ea4bd30e993b6e821c4298a26e824c780c020147c）
- packages/components/page-header/style/index.ts（SHA256 38ec5e6d0267489d38602a9f5bb3094d495d929386b325731a6d4fd8f4dd396e）
- packages/components/page-header/__tests__/page-header.test.tsx（SHA256 67ba69cc5605c038a4414a3c13dadf1e511509e7bec3f759b65b39e4358e6d75）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- PageHeader.vue — packages/components/page-header/__tests__/page-header.test.tsx
- render test — packages/components/page-header/__tests__/page-header.test.tsx
- should render icon props — packages/components/page-header/__tests__/page-header.test.tsx
- should render icon slots — packages/components/page-header/__tests__/page-header.test.tsx
- slots — packages/components/page-header/__tests__/page-header.test.tsx
- content — packages/components/page-header/__tests__/page-header.test.tsx
- breadcrumb — packages/components/page-header/__tests__/page-header.test.tsx
- extra — packages/components/page-header/__tests__/page-header.test.tsx
- default — packages/components/page-header/__tests__/page-header.test.tsx
- prop title — packages/components/page-header/__tests__/page-header.test.tsx
- slot prop — packages/components/page-header/__tests__/page-header.test.tsx
- conditional slots rendering — packages/components/page-header/__tests__/page-header.test.tsx
- event back — packages/components/page-header/__tests__/page-header.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
