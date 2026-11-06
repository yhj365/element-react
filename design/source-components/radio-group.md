# RadioGroup 源码目录设计

- 来源：packages/components/radio-group
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：Radio/RadioGroup/RadioButton；值类型、禁用、尺寸和边框；组内选中、键盘和 label/value 兼容；表单联动。
- 家族设计：[radio](../components/radio.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/radio-group/style/css.ts（SHA256 62b42c49adee0deaf1e8e3aa3112b974c834c89a124a65d0754faaedeb136a77）
- packages/components/radio-group/style/index.ts（SHA256 8a4ec9df952ab4fac4b625633d41347f46e3e156b0f25b1fdb05ca7cfe68acbb）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
