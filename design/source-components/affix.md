# Affix 源码目录设计

- 来源：packages/components/affix
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：相对窗口或指定容器吸顶/吸底；offset 与 zIndex；固定状态变化和滚动事件；容器边界约束及卸载清理。
- 家族设计：[affix](../components/affix.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/affix/index.ts（SHA256 23bb33cf36f5bd512ba729f1123bfb66c60286ffe05fddff54fe26eef54259d3）
- packages/components/affix/src/affix.ts（SHA256 517b2c4744187b4826d8a90557df47f6799f1291be035dfe6ad10b2858f4937d）
- packages/components/affix/src/affix.vue（SHA256 af9948d3896c72bd08e7390a7abf6ed9739675846dc1df2760bd1edda8f423f6）
- packages/components/affix/style/css.ts（SHA256 6e57f5c9c493bcefaa0b93891da91e3d2dbed43829fb4f98d8b6ccf2b7849a03）
- packages/components/affix/style/index.ts（SHA256 1f718e7aa273d98b41165245998653a83b517439649a709686a3f4c49d53dde4）
- packages/components/affix/__tests__/affix.test.tsx（SHA256 c531735f56566dcc928f156e373e0e28861871a3c1c829cb3c169566e7d7bd0b）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Affix.vue — packages/components/affix/__tests__/affix.test.tsx
- render test — packages/components/affix/__tests__/affix.test.tsx
- should render offset props — packages/components/affix/__tests__/affix.test.tsx
- should render position props — packages/components/affix/__tests__/affix.test.tsx
- should render target props — packages/components/affix/__tests__/affix.test.tsx
- should render z-index props — packages/components/affix/__tests__/affix.test.tsx
- should render append-to props — packages/components/affix/__tests__/affix.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
