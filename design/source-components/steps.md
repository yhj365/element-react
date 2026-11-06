# Steps 源码目录设计

- 来源：packages/components/steps
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Steps/Step；横纵方向、active、状态、间距、居中和simple；图标、标题、描述；流程只展示不擅自增加业务跳转。
- 家族设计：[steps](../components/steps.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/steps/index.ts（SHA256 e112d9d73193d5d571f2e82bcf965b2261523057e4fe35dae9791d7cf2790c94）
- packages/components/steps/src/item.ts（SHA256 c862df9aa9dd9ff01ebec2d223166cd380e2c8241f300f5c7fcb1ef79ce15d44）
- packages/components/steps/src/item.vue（SHA256 4b5bd552b6f0e37d85b1113a95d056e6d316f19ee92d7a687b7dee470994b0fb）
- packages/components/steps/src/steps.ts（SHA256 212c1174d55afc16a66fd4f29d16075e894e06d61595e835f779d1367be733c1）
- packages/components/steps/src/steps.vue（SHA256 1a1171564bebb7f12e2b89138c0f30f6128d4b21ad2edc4bdac773bc28da413f）
- packages/components/steps/src/tokens.ts（SHA256 dc8d445fad98459639cf94aa59828ec2686482df68c338c0e0b483af88bbc5fc）
- packages/components/steps/style/css.ts（SHA256 0cc88b286dcfbe337f69f0c3571441f99c58a696a61034c97cd6a6ed99419751）
- packages/components/steps/style/index.ts（SHA256 913c6823df1fc6f323bff09c4f4cc9c1683c94bba582c1b08dbece131e66cb63）
- packages/components/steps/__tests__/steps.test.tsx（SHA256 7c0ff9ca5592ff57b732e45d713c7a5d5efe4f0dc773a4ebd32ceacd1f6290dd）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Steps.vue — packages/components/steps/__tests__/steps.test.tsx
- render — packages/components/steps/__tests__/steps.test.tsx
- space — packages/components/steps/__tests__/steps.test.tsx
- alignCenter — packages/components/steps/__tests__/steps.test.tsx
- direction — packages/components/steps/__tests__/steps.test.tsx
- simple — packages/components/steps/__tests__/steps.test.tsx
- active — packages/components/steps/__tests__/steps.test.tsx
- process-status — packages/components/steps/__tests__/steps.test.tsx
- finish-status — packages/components/steps/__tests__/steps.test.tsx
- step attribute — packages/components/steps/__tests__/steps.test.tsx
- step slot — packages/components/steps/__tests__/steps.test.tsx
- order of step — packages/components/steps/__tests__/steps.test.tsx
- explicit status should not break subsequent step processStatus — packages/components/steps/__tests__/steps.test.tsx
- explicit status with various values should not affect flow — packages/components/steps/__tests__/steps.test.tsx
- step style — packages/components/steps/__tests__/steps.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
