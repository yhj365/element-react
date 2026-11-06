# Watermark 源码目录设计

- 来源：packages/components/watermark
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：文字/多行/图片水印；字体、间距、旋转、偏移、层级；高清canvas与异步图片；尺寸观察和卸载清理；抗篡改行为按源码核实，不承诺安全防伪。
- 家族设计：[watermark](../components/watermark.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/watermark/index.ts（SHA256 daa6cb07f9b081d116311f98266f409951fae5987acf53d010050a02e9ca6f88）
- packages/components/watermark/src/useClips.ts（SHA256 f2eb2af70c110acce00b5fd2ab6fada3349b2bab7ac3cb53d17b822c019eb954）
- packages/components/watermark/src/utils.ts（SHA256 a93f035117ee34577f47e7c576a57208e637ea18d467a5ef86c6abb492e38968）
- packages/components/watermark/src/watermark.ts（SHA256 274ebc6fad0e7d0ee72618475d64eabd3451294afa4b974dea4d4a7e5b74520d）
- packages/components/watermark/src/watermark.vue（SHA256 9527c53a21a1d61ed855eb6fa464953a8caffff8eb2927e08e78271e6c2ad731）
- packages/components/watermark/style/css.ts（SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855）
- packages/components/watermark/style/index.ts（SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855）
- packages/components/watermark/__tests__/watermark.test.tsx（SHA256 9a44ed6f4def6c0d4b95048675905dc4c7ca5ed05fc0e18e8c941f000eb01cb2）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Watermark.vue — packages/components/watermark/__tests__/watermark.test.tsx
- create — packages/components/watermark/__tests__/watermark.test.tsx
- slots — packages/components/watermark/__tests__/watermark.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
