# Tooltip 源码目录设计

- 来源：packages/components/tooltip
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：hover/focus/click/contextmenu 等源触发；受控显隐、延迟；位置、碰撞、箭头、主题、HTML和内容；virtualTrigger、teleport、persistent；Escape与可交互浮层。
- 家族设计：[tooltip](../components/tooltip.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/tooltip/index.ts（SHA256 33af158c8b383e50655dfa80e35136847aa7085238034624d5ea35ea1f55d67c）
- packages/components/tooltip/src/constants.ts（SHA256 6a83707399dd75318dbb833377ff077a202b1aa3fbb49e52335f7fbb7cde8ef1）
- packages/components/tooltip/src/content.ts（SHA256 39bec09d76546e7a6e38eac546f6e13dd4a05372ba8dd6fcfcd0162fe0dc23ef）
- packages/components/tooltip/src/content.vue（SHA256 3fa4a3183962263fac37367e8e9ad45ea682ebcb79316fb43a19b8ec4df1b10d）
- packages/components/tooltip/src/tooltip.ts（SHA256 7a2f6648ca563d4fea186233ebcc11decc4ea18918f8639e1af8273138753c8d）
- packages/components/tooltip/src/tooltip.vue（SHA256 222e52270c36ee6d26b68bb340327d44430b0036829ac7e02c5bb774dd1e2afd）
- packages/components/tooltip/src/trigger.ts（SHA256 95b94bab28ff6bab9442716a1a707305343ba14d8ea024d5e9ee51f9f3687e13）
- packages/components/tooltip/src/trigger.vue（SHA256 8b8ba6e75b9fa5b17f1e7cc19bbc383d32da728a6f82a1d8bd8f2c2124bec9a8）
- packages/components/tooltip/src/utils.ts（SHA256 119cf5502cde315af567cad67fa0b6c2c91c868a2571a83b5ecc3ccaa2af7909）
- packages/components/tooltip/style/css.ts（SHA256 9a599e4306fb7a71023b3493c2b4434cf25792805bcbadda92ff1a46d3aef489）
- packages/components/tooltip/style/index.ts（SHA256 dd913a6fc5f5230671697a05f24f105f0ced4421e895400854983e13dc01a252）
- packages/components/tooltip/test-helper/provides.ts（SHA256 01ea6c6136b572d183043b62a3cb3f63b534da3511edb8b5b7a4185230cdaa3d）
- packages/components/tooltip/__tests__/content.test.tsx（SHA256 dd2ba21137d41c019f857ff0eeda00265dd8c76ff1d1ad236fd9bd0badf88ca3）
- packages/components/tooltip/__tests__/tooltip.test.tsx（SHA256 cac31fd03c35b7a63b8bbec25ce8dc4c55283700808d433a8ea44ff1f56d8969）
- packages/components/tooltip/__tests__/trigger.test.tsx（SHA256 a0e666bb44c94593d673c440a777f22641352379396d1752d9b22f5b73b38488）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <ElTooltipContent /> — packages/components/tooltip/__tests__/content.test.tsx
- rendering — packages/components/tooltip/__tests__/content.test.tsx
- should render nothing initially when not controlled — packages/components/tooltip/__tests__/content.test.tsx
- persistent content — packages/components/tooltip/__tests__/content.test.tsx
- should be able to inherit style — packages/components/tooltip/__tests__/content.test.tsx
- content rendering — packages/components/tooltip/__tests__/content.test.tsx
- should not show the content when disabled — packages/components/tooltip/__tests__/content.test.tsx
- events — packages/components/tooltip/__tests__/content.test.tsx
- should be able to enter trigger — packages/components/tooltip/__tests__/content.test.tsx
- should not trigger close event when the trigger is not hover — packages/components/tooltip/__tests__/content.test.tsx
- should be able to stop triggering when controlled — packages/components/tooltip/__tests__/content.test.tsx
- onCloseOutside — packages/components/tooltip/__tests__/content.test.tsx
- should not close the content after click outside when trigger is hover — packages/components/tooltip/__tests__/content.test.tsx
- should not close the content after click outside when controlled — packages/components/tooltip/__tests__/content.test.tsx
- should close component after click outside — packages/components/tooltip/__tests__/content.test.tsx
- should append to — packages/components/tooltip/__tests__/content.test.tsx
- <ElTooltip /> — packages/components/tooltip/__tests__/tooltip.test.tsx
- rendering — packages/components/tooltip/__tests__/tooltip.test.tsx
- should render correctly — packages/components/tooltip/__tests__/tooltip.test.tsx
- content should teleport according appendTo — packages/components/tooltip/__tests__/tooltip.test.tsx
- functionality — packages/components/tooltip/__tests__/tooltip.test.tsx
- should be able to update popper content manually — packages/components/tooltip/__tests__/tooltip.test.tsx
- should be able to open & close tooltip content — packages/components/tooltip/__tests__/tooltip.test.tsx
- should respond to focus trigger correctly — packages/components/tooltip/__tests__/tooltip.test.tsx
- should be able to toggle visibility of tooltip content — packages/components/tooltip/__tests__/tooltip.test.tsx
- should focus on trigger element when trigger contains hover and focusOnTarget is true — packages/components/tooltip/__tests__/tooltip.test.tsx
- should not focus on trigger element when trigger contains hover and focusOnTarget is false — packages/components/tooltip/__tests__/tooltip.test.tsx
- should resync visibility when disabled toggles in controlled mode — packages/components/tooltip/__tests__/tooltip.test.tsx
- <ElTooltipTrigger /> — packages/components/tooltip/__tests__/trigger.test.tsx
- rendering — packages/components/tooltip/__tests__/trigger.test.tsx
- should render correctly — packages/components/tooltip/__tests__/trigger.test.tsx
- trigger event — packages/components/tooltip/__tests__/trigger.test.tsx
- controlled — packages/components/tooltip/__tests__/trigger.test.tsx
- should not trigger anything when tooltip is controlled — packages/components/tooltip/__tests__/trigger.test.tsx
- uncontrolled — packages/components/tooltip/__tests__/trigger.test.tsx
- should be able to dispatch event when uncontrolled — packages/components/tooltip/__tests__/trigger.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
