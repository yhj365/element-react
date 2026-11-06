# Statistic 源码目录设计

- 来源：packages/components/statistic
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：数字格式、精度、分组/小数符、前后缀、标题；自定义 formatter；Countdown 截止时间、格式、变化和完成事件、定时清理。
- 家族设计：[statistic](../components/statistic.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/statistic/index.ts（SHA256 44d8456e90b0fccdb647a4131ff856135f7d3506c8cc3b7ef681dad40c4770fe）
- packages/components/statistic/src/statistic.ts（SHA256 3fb40535d0c96fc9520e076adfa3a1eaaa1aef3c2a6150ac383cb6548e94c341）
- packages/components/statistic/src/statistic.vue（SHA256 f5380d57c24a19219eb30f95679e967ff6bdc100c07e93e85e7e2f9a1ca81fab）
- packages/components/statistic/style/css.ts（SHA256 140f000e06e15d5198a6e604f51ca6fab98dcf2f75ff5b23aa8da15885d06544）
- packages/components/statistic/style/index.ts（SHA256 d8a45999b96c786850ccaeccb529def496bcd9fe00c4114ea4cdab393b333dcb）
- packages/components/statistic/__tests__/statistic.test.tsx（SHA256 274ecc7d5d9d2ea809598a1dd737b4390633d4bf1341853a9be4fcf4a99a139f）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Statistic.vue — packages/components/statistic/__tests__/statistic.test.tsx
- render test — packages/components/statistic/__tests__/statistic.test.tsx
- basics test — packages/components/statistic/__tests__/statistic.test.tsx
- precision — packages/components/statistic/__tests__/statistic.test.tsx
- prefix & suffix — packages/components/statistic/__tests__/statistic.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
