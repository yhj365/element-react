# Col 源码目录设计

- 来源：packages/components/col
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Row/Col 的24栅格；gutter、span/offset/push/pull；xs/sm/md/lg/xl 响应式；flex 对齐与自定义标签。
- 家族设计：[layout](../components/layout.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/col/index.ts（SHA256 89117e7f4e8af63cca76eaecc143000bd554bf8d871ad98911ecfb96038a5578）
- packages/components/col/src/col.ts（SHA256 b79a2d5128ea5bc96154ea993432cf8430a5151abd002f9f1f72aaab726e8a7b）
- packages/components/col/src/col.vue（SHA256 07b944dd95ac5d565f087fb4a6ff8127331ef6b2889b2824aafbf221b560baae）
- packages/components/col/style/css.ts（SHA256 89f46dce25087aab1759e4342cb9aa6cc53b10cbcd3ff5d53930f733f3cf68c2）
- packages/components/col/style/index.ts（SHA256 34b79637a1c6527518caa1f52ba2c016ec498406ae20c4cbfb8e076c861da1fb）
- packages/components/col/__tests__/layout.test.tsx（SHA256 252bdbb8c0aa66b789d69d883f200d7790dd24fb38f3933150c8ac9989c1dff3）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Col — packages/components/col/__tests__/layout.test.tsx
- create — packages/components/col/__tests__/layout.test.tsx
- span — packages/components/col/__tests__/layout.test.tsx
- pull — packages/components/col/__tests__/layout.test.tsx
- push — packages/components/col/__tests__/layout.test.tsx
- gutter — packages/components/col/__tests__/layout.test.tsx
- change gutter value — packages/components/col/__tests__/layout.test.tsx
- responsive — packages/components/col/__tests__/layout.test.tsx
- Row — packages/components/col/__tests__/layout.test.tsx
- create — packages/components/col/__tests__/layout.test.tsx
- gutter — packages/components/col/__tests__/layout.test.tsx
- justify — packages/components/col/__tests__/layout.test.tsx
- align — packages/components/col/__tests__/layout.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
