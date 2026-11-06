# Space 源码目录设计

- 来源：packages/components/space
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：方向、尺寸、换行、对齐、填充比例；分隔符；间距和子节点处理。
- 家族设计：[space](../components/space.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/space/index.ts（SHA256 cbfb43dbfe47444369b94558b4b296b47cf4272ffaee9e33fa63a9bfa843a2f2）
- packages/components/space/src/item.ts（SHA256 6e38c3cff5ba21eb88aa97995bfe81726d674bd77154371b1f452c8d44484b2c）
- packages/components/space/src/space.ts（SHA256 3d2bd1360af80772c51c28fcc885d6ab06682a8e5c22caa685dc9e0b188129b5）
- packages/components/space/src/use-space.ts（SHA256 82d3b0104ad4c2b228191b67b3debb8cf3c2493c75ba55b86163b0ec67278717）
- packages/components/space/style/css.ts（SHA256 c7d4b2e4412d1418771cfc2849095aa0683b43f6ececc01b9e7d85752fbcd0ed）
- packages/components/space/style/index.ts（SHA256 aca444d6486fde3714ed51a9c687bbbd3e13042606153784ca2c725166e88c48）
- packages/components/space/__tests__/space.test.tsx（SHA256 3c11addcf931c91b0c772d8a78d5d780cb5ecefea79c36ccade08a9559b665c1）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Space.vue — packages/components/space/__tests__/space.test.tsx
- render test — packages/components/space/__tests__/space.test.tsx
- sizes — packages/components/space/__tests__/space.test.tsx
- should render with spacer — packages/components/space/__tests__/space.test.tsx
- should render every component vnode spacer after hydration — packages/components/space/__tests__/space.test.tsx
- fill — packages/components/space/__tests__/space.test.tsx
- should handle empty conditional templates correctly — packages/components/space/__tests__/space.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
