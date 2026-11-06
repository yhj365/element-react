# Overlay 源码目录设计

- 来源：packages/components/overlay
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：遮罩、事件目标判断、层级、传送和模态背景；只响应有效遮罩点击，拖出弹窗不误关。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：遮罩、事件目标判断、层级、传送和模态背景；只响应有效遮罩点击，拖出弹窗不误关。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/overlay/index.ts（SHA256 97454137750bd7a8e9c40f06cfdade1942d1f08583ce2470271f5bcacc81787d）
- packages/components/overlay/src/overlay.ts（SHA256 500e3fd962bc440f899d37c94375b16040abc668145a838457701fb25fde122a）
- packages/components/overlay/style/css.ts（SHA256 418c854c28b6f405a13b820d39e8ec73f41080519f1f7bbfe1dbbc5c93e659cc）
- packages/components/overlay/style/index.ts（SHA256 26799013ed8835b241115e3a8f4d1ed3de08911925083140c49ab7df0e6c80ff）
- packages/components/overlay/__tests__/overlay.test.tsx（SHA256 5983193d9eb5b137094c04b9478eefae7cd35136a60ceb1533e50548764e9fec）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Overlay.vue — packages/components/overlay/__tests__/overlay.test.tsx
- render test — packages/components/overlay/__tests__/overlay.test.tsx
- should emit click event — packages/components/overlay/__tests__/overlay.test.tsx
- no mask — packages/components/overlay/__tests__/overlay.test.tsx
- global — packages/components/overlay/__tests__/overlay.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
