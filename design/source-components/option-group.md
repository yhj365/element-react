# OptionGroup 源码目录设计

- 来源：packages/components/option-group
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：Option/OptionGroup；单选/多选、过滤/远程、创建；对象值键、禁用、清空、标签折叠；头尾/空/加载/标签/选中项定制；键盘高亮、面板滚动和表单。
- 家族设计：[select](../components/select.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/option-group/style/css.ts（SHA256 9256800fb90d543df9f9eb2de811166f7cdb6eef84ed433d4213adbb82f71ea6）
- packages/components/option-group/style/index.ts（SHA256 6b8c17576fbea1c40abcf38826c6fd6e21f3ebcf8709aae18c5096198440ec99）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
