# Notification 源码目录设计

- 来源：packages/components/notification
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：标题、正文、图标、类型；四角位置/源支持位置、偏移和堆叠；duration、关闭/点击；实例控制、Provider 绑定和销毁。
- 家族设计：[notification](../components/notification.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/notification/index.ts（SHA256 436226141e364ac6c0aadefe61fb144f2ea2e65a79ab5fef0a618bbdfa61904e）
- packages/components/notification/src/notification.ts（SHA256 a0f947db957685c8e78320f7e9a176c736fe325d23c9c4909d8a9ab36c834fa5）
- packages/components/notification/src/notification.vue（SHA256 6f43d5b973829f8ac6b67c9b28dfb171c055d7878062588722bae54134f25db7）
- packages/components/notification/src/notify.ts（SHA256 0ab790dd8f3c528e5fba920d694f9c6a52f04fd2746f4ba1e8b9c9fe5b467a5c）
- packages/components/notification/style/css.ts（SHA256 27328ca5772a8ccb4f8c8201a5253a48756232829cfede5dda4aaf0058c58a28）
- packages/components/notification/style/index.ts（SHA256 4430090801acf911ba76706c78ab483ad4335dcf59467d2667f17a4294fc85d9）
- packages/components/notification/__tests__/notification.test.tsx（SHA256 0c55872f6e11f50a97d4a37aaa2dd7140c3aa7b6907895d7aad3924a289b1b50）
- packages/components/notification/__tests__/notify.test.tsx（SHA256 3957ef2a4f05f07181c912d2244ab321b2d679e54b96c5c564318b3e9d56b255）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Notification.vue — packages/components/notification/__tests__/notification.test.tsx
- render — packages/components/notification/__tests__/notification.test.tsx
- basic render test — packages/components/notification/__tests__/notification.test.tsx
- should be able to render VNode — packages/components/notification/__tests__/notification.test.tsx
- should be able to render raw HTML tag with dangerouslyUseHTMLString flag — packages/components/notification/__tests__/notification.test.tsx
- should not be able to render raw HTML tag without dangerouslyUseHTMLString flag — packages/components/notification/__tests__/notification.test.tsx
- should be able to render z-index style with zIndex flag — packages/components/notification/__tests__/notification.test.tsx
- should be able to render default close icon — packages/components/notification/__tests__/notification.test.tsx
- should be able to render custom close icon — packages/components/notification/__tests__/notification.test.tsx
- Notification.type — packages/components/notification/__tests__/notification.test.tsx
- should be able to render typed notification — packages/components/notification/__tests__/notification.test.tsx
- should not be able to render invalid type icon — packages/components/notification/__tests__/notification.test.tsx
- event handlers — packages/components/notification/__tests__/notification.test.tsx
- it should be able to close the notification by clicking close button — packages/components/notification/__tests__/notification.test.tsx
- should be able to close after duration — packages/components/notification/__tests__/notification.test.tsx
- should be able to prevent close itself when hover over — packages/components/notification/__tests__/notification.test.tsx
- should not be able to close when duration is set to 0 — packages/components/notification/__tests__/notification.test.tsx
- should be able to handle click event — packages/components/notification/__tests__/notification.test.tsx
- should be able to delete timer when press delete — packages/components/notification/__tests__/notification.test.tsx
- should be able to close the notification immediately when press esc — packages/components/notification/__tests__/notification.test.tsx
- should keep hover-paused notification paused on unrelated keydown — packages/components/notification/__tests__/notification.test.tsx
- progress bar — packages/components/notification/__tests__/notification.test.tsx
- should render progress bar when progress is true — packages/components/notification/__tests__/notification.test.tsx
- should not render progress bar by default — packages/components/notification/__tests__/notification.test.tsx
- should not render progress bar when duration is 0 — packages/components/notification/__tests__/notification.test.tsx
- should apply custom progress options — packages/components/notification/__tests__/notification.test.tsx
- should pause and resume the progress bar on hover — packages/components/notification/__tests__/notification.test.tsx
- Notification on command — packages/components/notification/__tests__/notify.test.tsx
- it should get component handle — packages/components/notification/__tests__/notify.test.tsx
- it should be able to render vnode — packages/components/notification/__tests__/notify.test.tsx
- it should be able to render function that return vnode — packages/components/notification/__tests__/notify.test.tsx
- it should be able to close notification by manually close — packages/components/notification/__tests__/notify.test.tsx
- it should close all notifications — packages/components/notification/__tests__/notify.test.tsx
- it should update offsets notifications — packages/components/notification/__tests__/notify.test.tsx
- it should be able to render all types notification — packages/components/notification/__tests__/notify.test.tsx
- it should appendTo specified HTMLElement — packages/components/notification/__tests__/notify.test.tsx
- it should appendTo specified selector — packages/components/notification/__tests__/notify.test.tsx
- should globally inherit context correctly — packages/components/notification/__tests__/notify.test.tsx
- should be possible to set the context individually — packages/components/notification/__tests__/notify.test.tsx
- set dangerouslyUseHTMLString should render html string — packages/components/notification/__tests__/notify.test.tsx
- not set dangerouslyUseHTMLString should render text — packages/components/notification/__tests__/notify.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
