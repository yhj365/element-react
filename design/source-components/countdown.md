# Countdown 源码目录设计

- 来源：packages/components/countdown
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：数字格式、精度、分组/小数符、前后缀、标题；自定义 formatter；Countdown 截止时间、格式、变化和完成事件、定时清理。
- 家族设计：[statistic](../components/statistic.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/countdown/index.ts（SHA256 28ce4a4c296a15ef6806043ef5c46102a1cdadc1331717e9b285cbebb0700659）
- packages/components/countdown/src/countdown.ts（SHA256 f9df319254b2542995c782b0bc451a69eaab1c0eeb766fefde1ad87064345946）
- packages/components/countdown/src/countdown.vue（SHA256 e3db5de00b1bdcf1f96b6dadada67b4c1a8df8b0ca4a4260571465679fb699a0）
- packages/components/countdown/src/utils.ts（SHA256 d776a998135392c63f6e1ea0cc7ea5fe052be1fe013120d3321c9577665379ac）
- packages/components/countdown/style/css.ts（SHA256 140f000e06e15d5198a6e604f51ca6fab98dcf2f75ff5b23aa8da15885d06544）
- packages/components/countdown/style/index.ts（SHA256 d8a45999b96c786850ccaeccb529def496bcd9fe00c4114ea4cdab393b333dcb）
- packages/components/countdown/__tests__/countdown.test.tsx（SHA256 46161c7d9b150ef0be4ce251511f453adf75fbd50761b93bab209dfe672ce898）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Countdown.vue — packages/components/countdown/__tests__/countdown.test.tsx
- render test — packages/components/countdown/__tests__/countdown.test.tsx
- format — packages/components/countdown/__tests__/countdown.test.tsx
- change event — packages/components/countdown/__tests__/countdown.test.tsx
- finish event — packages/components/countdown/__tests__/countdown.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
