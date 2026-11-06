# FocusTrap 源码目录设计

- 来源：packages/components/focus-trap
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：焦点进入、Tab/Shift+Tab循环、Escape栈顶处理、返回触发器；嵌套、不可见/禁用元素和卸载恢复。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：焦点进入、Tab/Shift+Tab循环、Escape栈顶处理、返回触发器；嵌套、不可见/禁用元素和卸载恢复。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/focus-trap/index.ts（SHA256 7ecf5ca9f1055f357e59c122b61b6c6f1072bea7ae4d21259b0f9a4397a81341）
- packages/components/focus-trap/src/focus-trap.vue（SHA256 1ceb5ea458f246ae3e961699bd4480a1581f0e547a8280bf5c901f68c416399b）
- packages/components/focus-trap/src/tokens.ts（SHA256 2d7be247215de8c5139a00294b3094d350e447f21aec39b52716abc1f067ab32）
- packages/components/focus-trap/src/utils.ts（SHA256 1d585bbbd15df899533c0b629fa7c6358c1fe11a74100cb4bb1291d2522e5b73）
- packages/components/focus-trap/__tests__/focus-trap.test.ts（SHA256 d2ce9974ea707578a9fcacfea88b0e622426732642116544d0b659147485c50a）
- packages/components/focus-trap/__tests__/utils.test.ts（SHA256 fd37246686af34d29843ca7a83caba174810540e2705f2d3e6c4309cc6b30dd4）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <ElFocusTrap — packages/components/focus-trap/__tests__/focus-trap.test.ts
- render — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should render correctly — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should be able to focus on the first descendant item — packages/components/focus-trap/__tests__/focus-trap.test.ts
- events — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should be able to dispatch focus on mount event — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should be able to dispatch focus on unmount — packages/components/focus-trap/__tests__/focus-trap.test.ts
- features — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should be able to navigate via keyboard — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should not be able to navigate when no focusable element contained — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should be able to navigate outside by keyboard when not trapped — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should not be able to navigate if the current layer is paused — packages/components/focus-trap/__tests__/focus-trap.test.ts
- should steal focus when trapped — packages/components/focus-trap/__tests__/focus-trap.test.ts
- focus-trap utils — packages/components/focus-trap/__tests__/utils.test.ts
- should be able to focus — packages/components/focus-trap/__tests__/utils.test.ts
- should be able to get focusable edge — packages/components/focus-trap/__tests__/utils.test.ts
- should be able to focus on the first descendant — packages/components/focus-trap/__tests__/utils.test.ts
- tryFocus — packages/components/focus-trap/__tests__/utils.test.ts
- should be focus the input element — packages/components/focus-trap/__tests__/utils.test.ts
- should be focus the span element — packages/components/focus-trap/__tests__/utils.test.ts
- should be focus the disabled input element — packages/components/focus-trap/__tests__/utils.test.ts
- should be focus the document body — packages/components/focus-trap/__tests__/utils.test.ts
- should be focus the null element — packages/components/focus-trap/__tests__/utils.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
