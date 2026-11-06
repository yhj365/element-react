# CheckTag 源码目录设计

- 来源：packages/components/check-tag
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：类型、尺寸、effect、round；可关闭、关闭图标和过渡；点击/关闭事件；标签内容与主题。
- 家族设计：[tag](../components/tag.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/check-tag/index.ts（SHA256 a1fb9e92bb6a9cb52f5b6a81c314c6e8a95bee8816b925870ac2c71b8757e734）
- packages/components/check-tag/src/check-tag.ts（SHA256 642377f69508213c7bbb4abc0faa71c206a888d8f1f0a894573bb3bc8bf9e235）
- packages/components/check-tag/src/check-tag.vue（SHA256 c51a50f718d3f5103732f3b84bec4195a14f81f92870092f486131022f75ff33）
- packages/components/check-tag/style/css.ts（SHA256 3e62c9178ec4f9468d5e6e6f12f9a41b61e6b4ab6d3817f493c4f1e703aa095e）
- packages/components/check-tag/style/index.ts（SHA256 c79b8d71bb12bde6ea134e1cbb6539de01adb53cf09ce7c10d99a01295faab05）
- packages/components/check-tag/__tests__/check-tag.test.tsx（SHA256 170446cc4c963c612caebc21150bf7d01e1dde8f081081a11a578c0db4d1f708）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- CheckTag.vue — packages/components/check-tag/__tests__/check-tag.test.tsx
- render test — packages/components/check-tag/__tests__/check-tag.test.tsx
- functionality — packages/components/check-tag/__tests__/check-tag.test.tsx
- disabled — packages/components/check-tag/__tests__/check-tag.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
