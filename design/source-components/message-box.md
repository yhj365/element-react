# MessageBox 源码目录设计

- 来源：packages/components/message-box
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：alert/confirm/prompt；按钮文本与类型、输入校验；Promise resolve/reject 与 action 回调；关闭/取消区分；异步确认、loading、焦点和滚动锁。
- 家族设计：[message-box](../components/message-box.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/message-box/index.ts（SHA256 9af0d408cd30ac771510fd392ad47f5ebbb75264038ef8bba22568c955e0c9b2）
- packages/components/message-box/src/index.vue（SHA256 78d20f6516b11dac6d8e816bc7a99e29a9cb5baa56a2e003909b2b3ab738a18b）
- packages/components/message-box/src/message-box.type.ts（SHA256 a84c94b4f9a91a29f8d6c5cbc3270411f32b6ed703bb84206320bc6551fc0eb3）
- packages/components/message-box/src/messageBox.ts（SHA256 7bf6f1d6c2e34b8fb9fd133b9a7e6148cf89f3c36aaec2031833cfe416384dc6）
- packages/components/message-box/style/css.ts（SHA256 b836d7c1c7d087086a635cc5335b7bd160f5a374761f1e89bacb4f105068e3ea）
- packages/components/message-box/style/index.ts（SHA256 5dcea8c8e821d56a4e86ee07ba5dd8be6b0fa2d5b2f4729658dbdb029edad503）
- packages/components/message-box/__tests__/message-box.test.ts（SHA256 65b74026b84f063768115d53099ad46b42e8be935a6431097b3a49fff8a9c04a）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- MessageBox — packages/components/message-box/__tests__/message-box.test.ts
- create and close — packages/components/message-box/__tests__/message-box.test.ts
- invoke with strings — packages/components/message-box/__tests__/message-box.test.ts
- custom icon — packages/components/message-box/__tests__/message-box.test.ts
- html string — packages/components/message-box/__tests__/message-box.test.ts
- distinguish cancel and close — packages/components/message-box/__tests__/message-box.test.ts
- alert — packages/components/message-box/__tests__/message-box.test.ts
- confirm — packages/components/message-box/__tests__/message-box.test.ts
- autofocus — packages/components/message-box/__tests__/message-box.test.ts
- prompt — packages/components/message-box/__tests__/message-box.test.ts
- prompt: focus on textarea — packages/components/message-box/__tests__/message-box.test.ts
- callback — packages/components/message-box/__tests__/message-box.test.ts
- prompt: should not confirm when pressing Enter during IME composition — packages/components/message-box/__tests__/message-box.test.ts
- beforeClose — packages/components/message-box/__tests__/message-box.test.ts
- promise — packages/components/message-box/__tests__/message-box.test.ts
- resolve — packages/components/message-box/__tests__/message-box.test.ts
- resolve prompt value — packages/components/message-box/__tests__/message-box.test.ts
- reject — packages/components/message-box/__tests__/message-box.test.ts
- calling action handlers should settle the promise correctly — packages/components/message-box/__tests__/message-box.test.ts
- context inheritance — packages/components/message-box/__tests__/message-box.test.ts
- should globally inherit context correctly — packages/components/message-box/__tests__/message-box.test.ts
- append to — packages/components/message-box/__tests__/message-box.test.ts
- should append to body if parameter is not provided — packages/components/message-box/__tests__/message-box.test.ts
- should append to body if element does not exist — packages/components/message-box/__tests__/message-box.test.ts
- should append to HtmlElement provided — packages/components/message-box/__tests__/message-box.test.ts
- should append to selector provided — packages/components/message-box/__tests__/message-box.test.ts
- accessibility — packages/components/message-box/__tests__/message-box.test.ts
- title attribute should set aria-label — packages/components/message-box/__tests__/message-box.test.ts
- aria-describedby should point to modal body when not prompt — packages/components/message-box/__tests__/message-box.test.ts
- aria-describedby should not be used when prompt; label attached to input — packages/components/message-box/__tests__/message-box.test.ts
- prompt inputValidator error message — packages/components/message-box/__tests__/message-box.test.ts
- should hide btns container when both buttons are hidden — packages/components/message-box/__tests__/message-box.test.ts
- should work with confirmButtonType and cancelButtonType props — packages/components/message-box/__tests__/message-box.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
