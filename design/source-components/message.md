# Message 源码目录设计

- 来源：packages/components/message
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：语义类型、图标、duration、关闭；多位置堆叠、偏移、分组、重复计数；可更新/关闭实例、closeAll；App Provider 上下文与定时器。
- 家族设计：[message](../components/message.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/message/index.ts（SHA256 aaf260b0d00577e7979ad24838e8868c4ab48b64e51ddc84051ada171ceabd33）
- packages/components/message/src/instance.ts（SHA256 4abf74bede025a8ca0be59f78d54a4668766b1c3982e5c2249bc9dd77715992b）
- packages/components/message/src/message.ts（SHA256 6c9cd98e0e6d5c47728fbd62a9ae4d7055aefb6545ea8d8770f6260b2600eac7）
- packages/components/message/src/message.vue（SHA256 ac79a156e0901b244b8027bc0f84e4120d2dc6f93d95701d18d8e618569358f3）
- packages/components/message/src/method.ts（SHA256 81457edff83dd27f4a3159afad1fd0c7ff7f620bb687c3beedffdfad6c080fbf）
- packages/components/message/style/css.ts（SHA256 1d1954c9770d5eb02de257c5a386555b04573415cab00ed15ff126f5bb759ee0）
- packages/components/message/style/index.ts（SHA256 3660e3b02bf1613be404389925e9e2995a0d4b7847d1636235f90cc253d0f0a1）
- packages/components/message/__tests__/message-manager.test.tsx（SHA256 dc26162066642a5e5426455727531bac6b86de5b565210dae951bc95872dc3a6）
- packages/components/message/__tests__/message.test.ts（SHA256 0df4505e7b6a28a03c8612675f1e38d641a397108a11d5f6f0ed03276fe1c879）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Message on command — packages/components/message/__tests__/message-manager.test.tsx
- it should get component handle — packages/components/message/__tests__/message-manager.test.tsx
- it should be able to manually close a message — packages/components/message/__tests__/message-manager.test.tsx
- it should close all messages — packages/components/message/__tests__/message-manager.test.tsx
- it should close all messages with mixed placement — packages/components/message/__tests__/message-manager.test.tsx
- it should close all messages of the specified type — packages/components/message/__tests__/message-manager.test.tsx
- it should close all messages by specified placement — packages/components/message/__tests__/message-manager.test.tsx
- it should stack messages — packages/components/message/__tests__/message-manager.test.tsx
- correct space when set offset — packages/components/message/__tests__/message-manager.test.tsx
- it should have 4 other types of message — packages/components/message/__tests__/message-manager.test.tsx
- it should appendTo specified HTMLElement — packages/components/message/__tests__/message-manager.test.tsx
- it should appendTo specified selector — packages/components/message/__tests__/message-manager.test.tsx
- it should render vnode function — packages/components/message/__tests__/message-manager.test.tsx
- context inheritance — packages/components/message/__tests__/message-manager.test.tsx
- should globally inherit context correctly — packages/components/message/__tests__/message-manager.test.tsx
- it should destroy self immediately — packages/components/message/__tests__/message-manager.test.tsx
- Message.vue — packages/components/message/__tests__/message.test.ts
- render — packages/components/message/__tests__/message.test.ts
- basic render test — packages/components/message/__tests__/message.test.ts
- should be able to render VNode — packages/components/message/__tests__/message.test.ts
- VNode should be wrapped in .el-message__content — packages/components/message/__tests__/message.test.ts
- should be able to render raw HTML with dangerouslyUseHTMLString prop — packages/components/message/__tests__/message.test.ts
- should not be able to render raw HTML without dangerouslyUseHTMLString prop — packages/components/message/__tests__/message.test.ts
- Message.type — packages/components/message/__tests__/message.test.ts
- should be able to render typed messages — packages/components/message/__tests__/message.test.ts
- should not be able to render invalid type icon — packages/components/message/__tests__/message.test.ts
- event handlers — packages/components/message/__tests__/message.test.ts
- it should be able to close the message by clicking close button — packages/components/message/__tests__/message.test.ts
- it should close after duration — packages/components/message/__tests__/message.test.ts
- it should prevent close when hovered — packages/components/message/__tests__/message.test.ts
- it should not close when duration is set to 0 — packages/components/message/__tests__/message.test.ts
- it should close when esc is pressed — packages/components/message/__tests__/message.test.ts
- it should call close after transition ends — packages/components/message/__tests__/message.test.ts
- placement — packages/components/message/__tests__/message.test.ts
- should render with top placement by default — packages/components/message/__tests__/message.test.ts
- should render with top-left placement — packages/components/message/__tests__/message.test.ts
- should render with top-right placement — packages/components/message/__tests__/message.test.ts
- should render with bottom placement — packages/components/message/__tests__/message.test.ts
- should render with bottom-left placement — packages/components/message/__tests__/message.test.ts
- should render with bottom-right placement — packages/components/message/__tests__/message.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
