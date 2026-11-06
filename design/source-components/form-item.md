# FormItem 源码目录设计

- 来源：packages/components/form-item
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：Form/FormItem；嵌套字段路径、同步异步规则；触发时机、全量/单字段校验；重置、清理、滚动到字段；动态字段注册、初始值、错误提示及尺寸/禁用继承。
- 家族设计：[form](../components/form.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/form-item/style/css.ts（SHA256 14e30a7385015e4eb760e225c3fe13edd98c3fbd6e3ed73c6b84a9f108703cdf）
- packages/components/form-item/style/index.ts（SHA256 449331b4e25b0a656bbae023fee69e5170db5c62eba674c7aa5bafbe2fd77e70）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
