# Slot 源码目录设计

- 来源：packages/components/slot
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：Vue Slot能力改为children/render props与受控属性合并；明确事件/样式/ref组合规则，不依赖Vue VNode。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：Vue Slot能力改为children/render props与受控属性合并；明确事件/样式/ref组合规则，不依赖Vue VNode。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/slot/index.ts（SHA256 5e8cbd00bc12eef84405ad1de80d61c6b1e8ae553ad824f707560f681037ac68）
- packages/components/slot/src/only-child.tsx（SHA256 55acb32221518acfc6b6e2dfef95df163b9cdf863a1f972c6e88bc0a3cb1223a）
- packages/components/slot/__tests__/only-child.test.tsx（SHA256 9455709b2289496c0bc6a2d3c8607b3d0c40c1e9becefdaa373c1efda5c8e91a）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- ElOnlyChild — packages/components/slot/__tests__/only-child.test.tsx
- should be able to render only one child — packages/components/slot/__tests__/only-child.test.tsx
- should be able to render string type and wrap it into span — packages/components/slot/__tests__/only-child.test.tsx
- should be able to unwrap fragmented children — packages/components/slot/__tests__/only-child.test.tsx
- should skip svg and child type is svg — packages/components/slot/__tests__/only-child.test.tsx
- should skip comment — packages/components/slot/__tests__/only-child.test.tsx
- should return nothing and warn when no valid children found — packages/components/slot/__tests__/only-child.test.tsx
- should render nothing when invalid node were found — packages/components/slot/__tests__/only-child.test.tsx
- should warns about having multiple children — packages/components/slot/__tests__/only-child.test.tsx
- should render nothing when no children provided — packages/components/slot/__tests__/only-child.test.tsx
- should warns about having multiple children — packages/components/slot/__tests__/only-child.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
