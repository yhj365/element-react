# Icon 源码目录设计

- 来源：packages/components/icon
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：尺寸、颜色和 SVG 容器；继承样式、装饰图标与有意义图标的无障碍区分；图标资源不依赖 Vue。
- 家族设计：[icon](../components/icon.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/icon/index.ts（SHA256 b90956c1c3ad7905fd83a4a9d2886fd9e676e7b66b3a130104b067388bb71337）
- packages/components/icon/src/icon.ts（SHA256 9e6e87b50ea7a929349c6830e729e712c55f6c69f23e518f68ea5d267f40f191）
- packages/components/icon/src/icon.vue（SHA256 8de555158d555432a1df8b3770a6fc0124d911703d9f26733543f6e940e49adf）
- packages/components/icon/style/css.ts（SHA256 b10a8b064e100efc3c78eaaa75d252962ff9f8602847264ea750e2cbdd162547）
- packages/components/icon/style/index.ts（SHA256 8923002e90ef9524f972974451fd3bde0955269201fb4284105adc768d0ad119）
- packages/components/icon/__tests__/icon.test.tsx（SHA256 66793c156530c1a175e0ee685f5fd718c25f9225b4ab0a34e892f8c9ac872b16）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Icon.vue — packages/components/icon/__tests__/icon.test.tsx
- render — packages/components/icon/__tests__/icon.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
