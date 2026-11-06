# InfiniteScroll 源码目录设计

- 来源：packages/components/infinite-scroll
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：触底距离、节流间隔、disabled/immediate；容器查找、未溢出时补载；监听/观察清理；React Hook 和包装组件承接指令能力。
- 家族设计：[infinite-scroll](../components/infinite-scroll.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/infinite-scroll/index.ts（SHA256 81ac4a5045d2fb0d5c5744cff2a5af2a4675e79f294d9b883c71577854fbe2ec）
- packages/components/infinite-scroll/src/index.ts（SHA256 fc5c5e208630bf8cca495d949e13ca7c069cd44db1edfaa2b761e9e5f79a285a）
- packages/components/infinite-scroll/style/css.ts（SHA256 d30e62a35c0a40796a527cad6c9aa355fd87b9b0d597b46f7f49e68a1f4b348e）
- packages/components/infinite-scroll/style/index.ts（SHA256 34c7ecbb71be4683df43b820ccdcaa9219dda307f2ee6ea90de0e43f06d408bc）
- packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts（SHA256 1efae797b00129db92726db2f4480f855396b1e511b72305e4e234b1f347c6bc）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- InfiniteScroll — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts
- scrollable container is the element to which the directive is bound — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts
- custom scroll delay — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts
- custom scroll distance — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts
- turn off immediate check — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts
- scrollable container is document.documentElement — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts
- callback will not be triggered infinitely — packages/components/infinite-scroll/__tests__/infinite-scroll.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
