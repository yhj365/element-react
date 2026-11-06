# Base 源码目录设计

- 来源：packages/components/base
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：基础样式入口、全局变量、reset与过渡；区分全量及按需引入，避免重复注入。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：基础样式入口、全局变量、reset与过渡；区分全量及按需引入，避免重复注入。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/base/style/css.ts（SHA256 405b6f64c80fd33814b2aa1c54a85029cde2d8e1ef39ed95aca49cddb801d931）
- packages/components/base/style/index.ts（SHA256 e15dd309c7832aab6d9c502ca9dbc0a1c72645a3e58388d4c0385a1845d76a69）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
