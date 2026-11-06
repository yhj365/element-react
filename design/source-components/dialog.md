# Dialog 源码目录设计

- 来源：packages/components/dialog
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：受控显隐；标题/头部/底部；模态和遮罩关闭；Escape、beforeClose；宽度、居中、全屏、拖拽/缩放按源API；焦点捕获恢复、滚动锁和嵌套层级。
- 家族设计：[dialog](../components/dialog.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/dialog/index.ts（SHA256 000793328b20169e7608871cc0a48bd1e98202e4b7c5f0a2d249c4ce7b4efc4b）
- packages/components/dialog/src/constants.ts（SHA256 da068ff98bd819c45c3facdc983be5f2213f020b88c76a291d10aef523e54667）
- packages/components/dialog/src/dialog-content.ts（SHA256 260e7482784a03d11dad3eac79bdfb892627afe0f3caf9bba85ce7360c8bffb8）
- packages/components/dialog/src/dialog-content.vue（SHA256 db76906aab60f86987e2e5293fd9887c31c95cb53f24d943c72946632730dbb0）
- packages/components/dialog/src/dialog.ts（SHA256 6082f9b551f6ccd3384f164a8bda7ea4483a8aafed2c865b01be72c212a31c83）
- packages/components/dialog/src/dialog.vue（SHA256 252ad1386eab247bb11fa4ae51250275fc6bfd7cf92a4d2d4ed77a5f8a368e8f）
- packages/components/dialog/src/use-dialog.ts（SHA256 7c52f788bd9996770dd40d333354daa817e75d1c54aa9a1c30ed1000b90479db）
- packages/components/dialog/style/css.ts（SHA256 a9f62a21eeccff9056c9003c1ef699b43a37cb5c611fc1ccdfdda3e992696156）
- packages/components/dialog/style/index.ts（SHA256 29d84856171cc5200871e6f9cedb7ea8bfd7a752683e13430cd06d73658d9898）
- packages/components/dialog/__tests__/dialog.test.tsx（SHA256 7acb19c05f4e0c946d0a279475e8c3399a6e6e05a50e7ffb56995facbab408a4）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Dialog.vue — packages/components/dialog/__tests__/dialog.test.tsx
- render test — packages/components/dialog/__tests__/dialog.test.tsx
- dialog should have a title and header when it has been given — packages/components/dialog/__tests__/dialog.test.tsx
- dialog header should have slot props — packages/components/dialog/__tests__/dialog.test.tsx
- dialog should have a footer when footer has been given — packages/components/dialog/__tests__/dialog.test.tsx
- should append dialog to body when appendToBody is true — packages/components/dialog/__tests__/dialog.test.tsx
- should center dialog — packages/components/dialog/__tests__/dialog.test.tsx
- should show close button — packages/components/dialog/__tests__/dialog.test.tsx
- should hide close button when showClose = false — packages/components/dialog/__tests__/dialog.test.tsx
- should close dialog when click on close button — packages/components/dialog/__tests__/dialog.test.tsx
- should render header-class, body-class and footer-class if setted — packages/components/dialog/__tests__/dialog.test.tsx
- dialog content should not be clickable during close animation — packages/components/dialog/__tests__/dialog.test.tsx
- mask related — packages/components/dialog/__tests__/dialog.test.tsx
- should not have overlay mask when mask is false — packages/components/dialog/__tests__/dialog.test.tsx
- should not click the mask to close when it is penetrable — packages/components/dialog/__tests__/dialog.test.tsx
- should bring the clicked penetrable dialog to front — packages/components/dialog/__tests__/dialog.test.tsx
- life cycles — packages/components/dialog/__tests__/dialog.test.tsx
- should call before close — packages/components/dialog/__tests__/dialog.test.tsx
- should not close dialog when user cancelled — packages/components/dialog/__tests__/dialog.test.tsx
- should open and close with delay — packages/components/dialog/__tests__/dialog.test.tsx
- should destroy on close — packages/components/dialog/__tests__/dialog.test.tsx
- should emit close event — packages/components/dialog/__tests__/dialog.test.tsx
- closeIcon — packages/components/dialog/__tests__/dialog.test.tsx
- should render draggable prop — packages/components/dialog/__tests__/dialog.test.tsx
- accessibility — packages/components/dialog/__tests__/dialog.test.tsx
- title attribute should set aria-label — packages/components/dialog/__tests__/dialog.test.tsx
- missing title attribute should point to header slot content — packages/components/dialog/__tests__/dialog.test.tsx
- aria-describedby should point to modal body — packages/components/dialog/__tests__/dialog.test.tsx
- transition — packages/components/dialog/__tests__/dialog.test.tsx
- dialog supports transition as string — packages/components/dialog/__tests__/dialog.test.tsx
- dialog supports transition as object config — packages/components/dialog/__tests__/dialog.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
