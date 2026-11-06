# Skeleton 源码目录设计

- 来源：packages/components/skeleton
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Skeleton/SkeletonItem；行数、图形变体、动画；loading 切换、节流和模板；尺寸稳定避免布局跳动。
- 家族设计：[skeleton](../components/skeleton.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/skeleton/index.ts（SHA256 c5174047fcb4de0955d67f323622ea1fe4717e01c9dd6ffd660260ae4a1b0962）
- packages/components/skeleton/src/skeleton-item.ts（SHA256 df7ddf6c84752b94e7ba98f6b9da90b3d6c167338e758076a44782cd39d95d95）
- packages/components/skeleton/src/skeleton-item.vue（SHA256 7c3bd88d26ac1f5609de52ecc76bbb502c08ce03119592f75ba75c9cfda1d01a）
- packages/components/skeleton/src/skeleton.ts（SHA256 608c085c96320b7255d2b66414db98d8f0f3b3d63e2d7809a9f6440f7d241886）
- packages/components/skeleton/src/skeleton.vue（SHA256 860d1df37b67c7ce70946457ea5a3cb192be187a2829957fea4004249234034c）
- packages/components/skeleton/style/css.ts（SHA256 8d46d99816b33a0cd18822e8f254d97f431b2b4cc0ef543912b7a7c6aa5007c5）
- packages/components/skeleton/style/index.ts（SHA256 7d44c6f7000a8a0de47884e76922e2e5f7e256ce9be198b8ea1820aab1e991d6）
- packages/components/skeleton/__tests__/skeleton-item.test.tsx（SHA256 b71324da956b570d1c3af05ab63807724ea0d4fc9649626d582171df0ed64211）
- packages/components/skeleton/__tests__/skeleton.test.tsx（SHA256 1cd523b58a8a29c9d57845cb503f5190dfbfb092c88d8360934d7f8c6f0a0929）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <skeleton-item /> — packages/components/skeleton/__tests__/skeleton-item.test.tsx
- should render correctly — packages/components/skeleton/__tests__/skeleton-item.test.tsx
- should render image placeholder — packages/components/skeleton/__tests__/skeleton-item.test.tsx
- Skeleton.vue — packages/components/skeleton/__tests__/skeleton.test.tsx
- render test — packages/components/skeleton/__tests__/skeleton.test.tsx
- should render with animation — packages/components/skeleton/__tests__/skeleton.test.tsx
- should render x times — packages/components/skeleton/__tests__/skeleton.test.tsx
- should render x rows — packages/components/skeleton/__tests__/skeleton.test.tsx
- should render default slots — packages/components/skeleton/__tests__/skeleton.test.tsx
- should render templates — packages/components/skeleton/__tests__/skeleton.test.tsx
- should throttle rendering — packages/components/skeleton/__tests__/skeleton.test.tsx
- should throttle object rendering — packages/components/skeleton/__tests__/skeleton.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
