# Popconfirm 源码目录设计

- 来源：packages/components/popconfirm
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：确认气泡；标题、描述/图标、按钮文案；确认/取消事件、actions 渲染；触发和浮层配置、隐藏策略、焦点处理。
- 家族设计：[popconfirm](../components/popconfirm.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/popconfirm/index.ts（SHA256 189fa30898b8612d376602992c959074e72e0393ce3ce359cfd66b0789b72ff5）
- packages/components/popconfirm/src/popconfirm.ts（SHA256 631ccf367399b3f25c5bbee1108d3c1e94ba1fc58364a755d8bf2713bd8c43ce）
- packages/components/popconfirm/src/popconfirm.vue（SHA256 f21dd129adcf36526531f8fb76c7bacbe31a9ac12da449ffc4b906f2a640c872）
- packages/components/popconfirm/style/css.ts（SHA256 c9ff7541848fdfb4d4471e62778d5da0c746a043673e4e7f41cba22937a5997e）
- packages/components/popconfirm/style/index.ts（SHA256 7fa840c509c89eee2d3c47e93d6d92df0e5b796f0c2b3269f754c7164eaf99f9）
- packages/components/popconfirm/__tests__/popconfirm.test.tsx（SHA256 4897d66574f9e5cc646e410ee274eae8dd640410ff4f71235febdddc0ec8bd9c）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Popconfirm.vue — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- render test — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- should close the Popconfirm when pressing Escape — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- should work with virtualTriggering and virtualRef — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- teleported API — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- should mount on popper container — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- should not mount on the popper container — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- actions slot — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- should override default buttons when given actions — packages/components/popconfirm/__tests__/popconfirm.test.tsx
- should pass handlers that can emit events — packages/components/popconfirm/__tests__/popconfirm.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
