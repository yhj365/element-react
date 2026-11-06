# Card 源码目录设计

- 来源：packages/components/card
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：头部、内容、底部；阴影策略；各区域 class/style；全局 Card 配置；长内容、无头部布局。
- 家族设计：[card](../components/card.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/card/index.ts（SHA256 1f0e0638e7863cefb7394d58ced4ab507efbd875b161e1b5ed4603786773661b）
- packages/components/card/src/card.ts（SHA256 cd4ad5dd96f2539b8a455c082f6df97655f1d6ad47d561c2a5e3b1300db4eb21）
- packages/components/card/src/card.vue（SHA256 0dce2f2c2e2aa3ad904295fee81e1947a725ea8026f390be12a6697cdd4191a3）
- packages/components/card/src/instance.ts（SHA256 2b9a5a1ea4324e9387d62a0dbedf5a2e7e516932db4dcd4d6807a35ec0b65d5b）
- packages/components/card/style/css.ts（SHA256 3f1e6ff49cb2e598b43c3d9b52af6b69d71d22443e5f2ac766254cd4752a9f77）
- packages/components/card/style/index.ts（SHA256 44a2c1b3d2695c3760fb186df00694873c51b126182c6bd01c6a1104b6b5a473）
- packages/components/card/__tests__/card.test.tsx（SHA256 ed319518e7b6a7dc972f8acceeed6478046dfcdf9125e49f0176d8696ae1ce31）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Card.vue — packages/components/card/__tests__/card.test.tsx
- render test — packages/components/card/__tests__/card.test.tsx
- string header — packages/components/card/__tests__/card.test.tsx
- vnode header — packages/components/card/__tests__/card.test.tsx
- body style — packages/components/card/__tests__/card.test.tsx
- body style with object — packages/components/card/__tests__/card.test.tsx
- body style with array — packages/components/card/__tests__/card.test.tsx
- should render header-class, body-class and footer-class  props — packages/components/card/__tests__/card.test.tsx
- shadow — packages/components/card/__tests__/card.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
