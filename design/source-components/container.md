# Container 源码目录设计

- 来源：packages/components/container
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Container/Header/Aside/Main/Footer 组合；横纵方向推断及覆盖；header/footer 高度、aside 宽度；嵌套滚动与语义区域。
- 家族设计：[container](../components/container.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/container/index.ts（SHA256 57dc197b2fc8a4f17552f868a1ce9f4d259e8cca79c255d68f7fb14f05a30682）
- packages/components/container/src/aside.vue（SHA256 d9dfc26a38ad8c152169aa334f592cbb1a060dcd69af35b9251fef13409124a8）
- packages/components/container/src/container.vue（SHA256 abed5a13e4ab8099e48f513f8efc742d5a1e5b20e8a755b21fbbc92c843af20d）
- packages/components/container/src/footer.vue（SHA256 c1cbab6f63b5d04a1d278194b951ddb4558022c35c84f7727f7451bb2c6441e7）
- packages/components/container/src/header.vue（SHA256 ded8e595e19b4f06b9b4ca91839b9133090db90d1186b74592807b72fe71a244）
- packages/components/container/src/main.vue（SHA256 aad13cf7b62575d9f033b3e435bf930a9ec461fcafad85f9eb69fc615ecc772b）
- packages/components/container/style/css.ts（SHA256 f3c0305865fd4fdfac9f935ffd336605eb9686bb30bd9c451c43c94bf40e02ba）
- packages/components/container/style/index.ts（SHA256 bcdbe1d892bff7ab073283fb9693c3fd5c6b599c019094259d305691e75b9f27）
- packages/components/container/__tests__/container.test.tsx（SHA256 a10e746de42e6b848f1106d8ab3c5e7bed0426161b5be057fc0e5e55630bdf06）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Container.vue — packages/components/container/__tests__/container.test.tsx
- container render test — packages/components/container/__tests__/container.test.tsx
- vertical — packages/components/container/__tests__/container.test.tsx
- direction — packages/components/container/__tests__/container.test.tsx
- Header — packages/components/container/__tests__/container.test.tsx
- create header — packages/components/container/__tests__/container.test.tsx
- header height — packages/components/container/__tests__/container.test.tsx
- Aside — packages/components/container/__tests__/container.test.tsx
- aside create — packages/components/container/__tests__/container.test.tsx
- aside width — packages/components/container/__tests__/container.test.tsx
- Main — packages/components/container/__tests__/container.test.tsx
- main create — packages/components/container/__tests__/container.test.tsx
- Footer — packages/components/container/__tests__/container.test.tsx
- footer create — packages/components/container/__tests__/container.test.tsx
- footer height — packages/components/container/__tests__/container.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
