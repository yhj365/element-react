# Empty 源码目录设计

- 来源：packages/components/empty
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：默认插图、自定义图片尺寸；描述和底部动作；图片/描述插槽；暗色和紧凑布局。
- 家族设计：[empty](../components/empty.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/empty/index.ts（SHA256 dff8daeef2205bd9e4fa94c8315676bbc0aa604896d59263afba9a8610dd92a6）
- packages/components/empty/src/empty.ts（SHA256 0b15d81ce9e4f8ec81a5cf9ea00a2540bb96ad83e91da14c0743eaebf73ba7a6）
- packages/components/empty/src/empty.vue（SHA256 93d58ac5514716f2897fa7a3cb8858d4916191dd2f05ab3d219877cb8a4a83fc）
- packages/components/empty/src/img-empty.vue（SHA256 fa7c72c7b97a98d7b65d300f4fecd153ef3b62b03b1439ae7c6a553ff400f42a）
- packages/components/empty/src/instance.ts（SHA256 c238619cbedda69a8d63418729afbe2a5c65f2d7e181fea665643744aa74b566）
- packages/components/empty/style/css.ts（SHA256 6378b0152c0cd34593980bd717606d023675853c412b53c6c1da3ca739bf9c80）
- packages/components/empty/style/index.ts（SHA256 d46d42ce293a2273fecfb70a85626a21e9c4a0bb1ca28a4ce7c4e9c860b316b9）
- packages/components/empty/__tests__/empty.test.tsx（SHA256 e95b2068a9f49c1ceb24fc82731060709f1deebf22d5269391a882a9bbe41028）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Empty.vue — packages/components/empty/__tests__/empty.test.tsx
- render test — packages/components/empty/__tests__/empty.test.tsx
- should render image props — packages/components/empty/__tests__/empty.test.tsx
- should render imageSize props — packages/components/empty/__tests__/empty.test.tsx
- should render description props — packages/components/empty/__tests__/empty.test.tsx
- should render image slots — packages/components/empty/__tests__/empty.test.tsx
- should render description slots — packages/components/empty/__tests__/empty.test.tsx
- should render default slots — packages/components/empty/__tests__/empty.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
