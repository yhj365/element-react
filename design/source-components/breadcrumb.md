# Breadcrumb 源码目录设计

- 来源：packages/components/breadcrumb
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：层级分隔符和分隔图标；BreadcrumbItem 链接、路由适配；末项状态和导航语义。
- 家族设计：[breadcrumb](../components/breadcrumb.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/breadcrumb/index.ts（SHA256 ccfa4bbdaccbeb024220396bbf2cb0240a272e3ce5af65a8ce1aa6398b5a4483）
- packages/components/breadcrumb/src/breadcrumb-item.ts（SHA256 18d36109a1e1d3b4fba83d863d903fef97351569735907a20ab3014ad12ec264）
- packages/components/breadcrumb/src/breadcrumb-item.vue（SHA256 0458374f7c01d9748d8e9698d09778005542f3f99abe928e68fba3d8e65a0c8c）
- packages/components/breadcrumb/src/breadcrumb.ts（SHA256 0b970cd1db5b23e5c22b604e0accf417fb6035057d52932d65e02a66aa18abf0）
- packages/components/breadcrumb/src/breadcrumb.vue（SHA256 ea373348ed69259169222a39500966b74aca5cb0a18c2b85a0745d4e462f3d6f）
- packages/components/breadcrumb/src/constants.ts（SHA256 301136345a7d4ee6f66a3b8f324493e030c99fb817481d9f3b95fc41004aa908）
- packages/components/breadcrumb/src/instances.ts（SHA256 41fc81f20b719bf82cb0137a23caf2572d7c15d80f9c194cb8a16e3cfff4c4e4）
- packages/components/breadcrumb/style/css.ts（SHA256 c95ed8be5ac3ff5845989d3aef98d7f9d0f0889d9a1fdfa460b8df5172798dcd）
- packages/components/breadcrumb/style/index.ts（SHA256 6a873cdce2c8ddb9dad27e8551e1dfec74798d6a0a03a748b4f56b85ae351dbd）
- packages/components/breadcrumb/__tests__/breadcrumb.test.tsx（SHA256 6182881c7a813c20fe7c710b91d2b52ff3834782c18d33c7e6a0fbaa5b175ae0）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Breadcrumb.vue — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- separator — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- separatorIcon — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- to — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- single — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- BreadcrumbItem — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- should set the last item as current page — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx
- click event — packages/components/breadcrumb/__tests__/breadcrumb.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
