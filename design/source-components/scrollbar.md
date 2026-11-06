# Scrollbar 源码目录设计

- 来源：packages/components/scrollbar
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：自定义水平/垂直滚动条；高度、最大高度、native、always；拖拽和轨道点击；scrollTo/setScrollTop/setScrollLeft/update；滚动/边界事件和 ResizeObserver 清理。
- 家族设计：[scrollbar](../components/scrollbar.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/scrollbar/index.ts（SHA256 18bb7b75fae380ffcf4d32e5276a5f161981fad50e1f76825ecc99bef85bb2ef）
- packages/components/scrollbar/src/bar.ts（SHA256 fe8cc6abad9f8bb10a594928de64da1e078df573c0149c2263dfd1c77b0f8ad2）
- packages/components/scrollbar/src/bar.vue（SHA256 f95a0b31ee838ca9a47a29c0a3adcb3d81bb1f3b5f2be08848b3e302a0c5ab78）
- packages/components/scrollbar/src/constants.ts（SHA256 08460a9ecfe7bfcdee7540b7e762a8c97a5e9ae0832281815b57b2eb06c52814）
- packages/components/scrollbar/src/scrollbar.ts（SHA256 bbec9886e3f92a26447ea596437790d6d7d1b64752506b6adab1d5137304ea2d）
- packages/components/scrollbar/src/scrollbar.vue（SHA256 4c6b70499e270497ccc0235d8a268dd6093aff62ded1cc3e18cf7f3cf9f4548d）
- packages/components/scrollbar/src/thumb.ts（SHA256 f7662b5e99968d4b2873aac251a07515df0ccbc9fe9a2d54b694423a8e6bb2e9）
- packages/components/scrollbar/src/thumb.vue（SHA256 524679220cdb77a705d975e35a44c292586d8625ead4bc275d76c8ca21525063）
- packages/components/scrollbar/src/util.ts（SHA256 467697eb20e2621a4da70e252784c09763fc59a3c7c5468fcf115de6d8846124）
- packages/components/scrollbar/style/css.ts（SHA256 b16a04bd148894853c4928c3a51559bbc2c33ffc7c63d94f2d1c9f132e8876d4）
- packages/components/scrollbar/style/index.ts（SHA256 6d139b2abedbf85ec3760a2065d325373aefe5268e38ecbc26579fc6d0ee68d8）
- packages/components/scrollbar/__tests__/scrollbar.test.tsx（SHA256 21bc73449accfedf39825549675faa0b767cca5c6569d5689979bd47fbe9adb4）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- ScrollBar — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- vertical — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- horizontal — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- both vertical and horizontal — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render height props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render max-height props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render always props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- set scrollTop & scrollLeft — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render min-size props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render tag props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render wrap-style props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render wrap-class props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render view-style props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should render view-class props — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should not bubble up click event on click scrollbar — packages/components/scrollbar/__tests__/scrollbar.test.tsx
- should emit end-reached event foreach direction — packages/components/scrollbar/__tests__/scrollbar.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
