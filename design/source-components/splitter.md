# Splitter 源码目录设计

- 来源：packages/components/splitter
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：SplitterPanel；横向/纵向、受控尺寸、min/max、可折叠；实时/延迟拖拽按源API；拖拽事件、窗口重排和键盘分隔条。
- 家族设计：[splitter](../components/splitter.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/splitter/index.ts（SHA256 3de038328653db640d2cc8ea5c4f1ab89105954b7f8b37ea73a77022ef3928ee）
- packages/components/splitter/src/hooks/index.ts（SHA256 85aaffdbe6a5ce37593453e31e011a42d5c431f70de7b8d07a5f6a33ab7a0d30）
- packages/components/splitter/src/hooks/useContainer.ts（SHA256 a877b9d7bfab5e7e9a7904942564a8c1448b88107b33a317cdd9139e39c3d22c）
- packages/components/splitter/src/hooks/usePanel.ts（SHA256 59a51bdd0016cf608f35a845a77ac9afed7be478ab8ac1b0fcaef25ebad3a096）
- packages/components/splitter/src/hooks/useResize.ts（SHA256 644262e29224f428900e00c86f13cae3f85eb1f72db3b2642a415e13db64d84a）
- packages/components/splitter/src/hooks/useSize.ts（SHA256 1107b6c790a7dfe97a0a6b2ea95bbeac9556544f6f7dbea54d1953b05868c4ab）
- packages/components/splitter/src/split-bar.vue（SHA256 7bf526b26742879b153d0b1a4b289f10b018f55b1054d6b866ddc8bf4effd454）
- packages/components/splitter/src/split-panel.ts（SHA256 3200f7eb02ad7bd575b1f7aa405b1990df03233c42ce08f2ce64c11bd9c8751d）
- packages/components/splitter/src/split-panel.vue（SHA256 77f506297b54a2e0689a79d77036282dc29be01f31b9c78658488b062bdf73ee）
- packages/components/splitter/src/splitter.ts（SHA256 bedb96b26c2d3bdcfd806221572fd0db871666707f52b0d65cdadced9ca68d82）
- packages/components/splitter/src/splitter.vue（SHA256 c3015069bc024bfa7fff376258258e1edc2816dc9cbbd715ab946e7d90414f72）
- packages/components/splitter/src/type.ts（SHA256 a3dd5bb238c8e1e3a52fff272be99e92c697fb04dbee795b2a2ce108bf7009ba）
- packages/components/splitter/style/css.ts（SHA256 85e003aaebaff93858a9161a5c608800eb8a429368d9e306927380c84793fb90）
- packages/components/splitter/style/index.ts（SHA256 c9d6da0c3fd9f356ddc17d0c255f420aa293290231a5ef195a2b1de72a71f66c）
- packages/components/splitter/__tests__/splitter.test.tsx（SHA256 33b40f5d39d7c751554bec0289be026ae01ec173f75564c2141210326c19eb35）
- packages/components/splitter/__tests__/__mocks__/vueuse.ts（SHA256 a364cd502ed4b08021fe27c294173accf0d78a08e1d756e07c7c832b365433a8）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Splitter — packages/components/splitter/__tests__/splitter.test.tsx
- should render correctly — packages/components/splitter/__tests__/splitter.test.tsx
- should render with vertical layout — packages/components/splitter/__tests__/splitter.test.tsx
- should keep panels size consistent with props.size when containerSize is 0. — packages/components/splitter/__tests__/splitter.test.tsx
- should respect min and max size constraints — packages/components/splitter/__tests__/splitter.test.tsx
- should handle collapse — packages/components/splitter/__tests__/splitter.test.tsx
- should emit resize events — packages/components/splitter/__tests__/splitter.test.tsx
- should emit collapse event — packages/components/splitter/__tests__/splitter.test.tsx
- should collapse normally when size is two-way bound and min & max is set — packages/components/splitter/__tests__/splitter.test.tsx
- should expand a collapsible panel whose initial size is 0 to its min size — packages/components/splitter/__tests__/splitter.test.tsx
- should not update panel size until drag ends when lazy is true — packages/components/splitter/__tests__/splitter.test.tsx
- should update panel size immediately when lazy is false — packages/components/splitter/__tests__/splitter.test.tsx
- should emit resizeEnd with latest sizes data in lazy mode — packages/components/splitter/__tests__/splitter.test.tsx
- should not still display the mask after the panel updates — packages/components/splitter/__tests__/splitter.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
