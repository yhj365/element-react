# Loading 源码目录设计

- 来源：packages/components/loading
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：区域及全屏遮罩；锁定、文字、图标/SVG、背景；延迟关闭与实例更新；Loading 包装组件、Hook 和服务三种适配；多实例与焦点影响。
- 家族设计：[loading](../components/loading.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/loading/index.ts（SHA256 fc816ce804534ed4768ea4ab477ef334b945aadb46d2794a9976e6454862de25）
- packages/components/loading/src/directive.ts（SHA256 a892dbe25d41f87b67f8be70223ff9cc4ca3b4ffbbc82e5c5d2fdb0bbfc30558）
- packages/components/loading/src/loading.ts（SHA256 a36ce775e686af66ecbe966745e0595196d6cc81ff986f30a66c9d415d29a58e）
- packages/components/loading/src/service.ts（SHA256 1f7b946228b1bc61b40af2ce5393c3da03459d1498240ad2ae0f41dd653390d8）
- packages/components/loading/src/types.ts（SHA256 e2d2f632ad0138523b64d7adeae545484cb8546de682e33560c0d3a59c12fda9）
- packages/components/loading/style/css.ts（SHA256 62eb6d5793a10da03f2c94bf680bd6c461da212515460e9edb1ae2782aaad7e1）
- packages/components/loading/style/index.ts（SHA256 df7363196349c7f79466c7d5f8f1d323f09cc9a6977f07d6cca9a150a4bc1b4b）
- packages/components/loading/__tests__/loading.test.tsx（SHA256 8e401a6b0596c108d4e63a8b102808cfdf6425438b2e444dd6d3850c93e8dc24）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Loading — packages/components/loading/__tests__/loading.test.tsx
- create directive — packages/components/loading/__tests__/loading.test.tsx
- unmounted directive — packages/components/loading/__tests__/loading.test.tsx
- body directive — packages/components/loading/__tests__/loading.test.tsx
- fullscreen directive — packages/components/loading/__tests__/loading.test.tsx
- lock directive — packages/components/loading/__tests__/loading.test.tsx
- text directive — packages/components/loading/__tests__/loading.test.tsx
- customClass directive — packages/components/loading/__tests__/loading.test.tsx
- customSvg directive — packages/components/loading/__tests__/loading.test.tsx
- switch between default and custom spinner — packages/components/loading/__tests__/loading.test.tsx
- create service — packages/components/loading/__tests__/loading.test.tsx
- accept VNode as text — packages/components/loading/__tests__/loading.test.tsx
- close service — packages/components/loading/__tests__/loading.test.tsx
- close service should release detached dom — packages/components/loading/__tests__/loading.test.tsx
- target service — packages/components/loading/__tests__/loading.test.tsx
- body service — packages/components/loading/__tests__/loading.test.tsx
- fullscreen service — packages/components/loading/__tests__/loading.test.tsx
- fullscreen singleton service — packages/components/loading/__tests__/loading.test.tsx
- lock service — packages/components/loading/__tests__/loading.test.tsx
- text service — packages/components/loading/__tests__/loading.test.tsx
- customClass service — packages/components/loading/__tests__/loading.test.tsx
- the reactivity of element-loading-* attributes — packages/components/loading/__tests__/loading.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
