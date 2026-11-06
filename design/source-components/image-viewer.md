# ImageViewer 源码目录设计

- 来源：packages/components/image-viewer
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：加载/失败/占位；fit、懒加载、滚动容器；预览列表、初始索引、缩放旋转、切换、关闭；ImageViewer 焦点、传送和层级。
- 家族设计：[image](../components/image.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/image-viewer/index.ts（SHA256 a8e3351881c935d08a60a6d2f2879ec16dcc70d2404a77eb3c41d7d85f2eba98）
- packages/components/image-viewer/src/image-viewer.ts（SHA256 cd90c7a163beccd7cb7b9600ebe28676a8b638351bdd55751e1059019e7bb2b1）
- packages/components/image-viewer/src/image-viewer.vue（SHA256 b629bdf448557b064f6ba2e1a8f1994c452acc1c8b1b6ecccabba1c755237af9）
- packages/components/image-viewer/style/css.ts（SHA256 0f4516f0ae6473217f25296d07089b7b795da44adab0d0aeb8966e2fd37e3243）
- packages/components/image-viewer/style/index.ts（SHA256 c53b067bdafb5ea5caf8f471f4ef40109ffd85c928221fccb7437d0c0dacb055）
- packages/components/image-viewer/__tests__/image-viewer.test.tsx（SHA256 c9f0cd91e446e3ed10ad2a3058abc157240881712530c4c1bcb5f3b609741d4f）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <image-viewer /> — packages/components/image-viewer/__tests__/image-viewer.test.tsx
- big image preview — packages/components/image-viewer/__tests__/image-viewer.test.tsx
- image preview hide-click-on-modal — packages/components/image-viewer/__tests__/image-viewer.test.tsx
- image preview close-on-press-escape — packages/components/image-viewer/__tests__/image-viewer.test.tsx
- manually switch image — packages/components/image-viewer/__tests__/image-viewer.test.tsx
- image progress render — packages/components/image-viewer/__tests__/image-viewer.test.tsx
- custom ImageViewer load failed slot — packages/components/image-viewer/__tests__/image-viewer.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
