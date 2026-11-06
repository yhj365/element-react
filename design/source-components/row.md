# Row 源码目录设计

- 来源：packages/components/row
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Row/Col 的24栅格；gutter、span/offset/push/pull；xs/sm/md/lg/xl 响应式；flex 对齐与自定义标签。
- 家族设计：[layout](../components/layout.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/row/index.ts（SHA256 132215a8af4ba07c1cf100ba0f9f59cc7ea534f3a1c550ee51582d29b09265cd）
- packages/components/row/src/constants.ts（SHA256 6b1c5afc5f86c5fe778466740964c3dfe1ef578cf8c887dbf51194f00ce923f6）
- packages/components/row/src/row.ts（SHA256 70648e6276d372bc656539e63fb1592cce261e2f19bc2784eb8b54fbdfad2a8d）
- packages/components/row/src/row.vue（SHA256 97945aa88359e6da6493a7cce6519fd1747bfc7d83b785cc5326ea47db671185）
- packages/components/row/style/css.ts（SHA256 c91bd1e56a6c2742ef64a54ad73d74cbc10d6ee5ac5cde67327c60451679c920）
- packages/components/row/style/index.ts（SHA256 f63f8b9f78222aaf49ee5a0d323d82fd0ef4b963047a2532a0d93d44d041e2b5）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
