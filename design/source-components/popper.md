# Popper 源码目录设计

- 来源：packages/components/popper
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：触发器与浮层关系、定位、箭头、事件和容器；禁止在render访问document。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：触发器与浮层关系、定位、箭头、事件和容器；禁止在render访问document。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/popper/index.ts（SHA256 d5fee06db949604f32c92c7e2796b165aad801b560e6166bc19cc8478f0c8c63）
- packages/components/popper/src/arrow.ts（SHA256 47df5b9f20bec5b56ed3bdfec9e646ce6ccddce17a33e5181a4c74a92f9f80df）
- packages/components/popper/src/arrow.vue（SHA256 1a43dcb751c3462ecb9a3f276303cc0f5056a3a30dbe626709fa54894407802d）
- packages/components/popper/src/composables/index.ts（SHA256 09178d87886a201becfceb4d09c74f1e9a134aa1bb4a5defa964c433b41b795c）
- packages/components/popper/src/composables/use-content-dom.ts（SHA256 3e11e96ef00c75c033c9261710419ecd7cc3bd1d1cb7cb86d3b7ccd9bbf4d39d）
- packages/components/popper/src/composables/use-content.ts（SHA256 b8504c5f27140719d711b92b19aed08748fddbaa799d50bb199dc44daac65788）
- packages/components/popper/src/composables/use-focus-trap.ts（SHA256 0a85409bcea5f855afa8bfd77a1069c37c0d872573389273122b322dcdd52fa1）
- packages/components/popper/src/constants.ts（SHA256 d8a7155ed135523610fe2ad67b0286715a3ea6d8a3163c36e2642ad8ac6666b3）
- packages/components/popper/src/content.ts（SHA256 72b053f7cbd2f813df9e89f9a3a85fdaf238f845422e46dfc8e28f2b98272a30）
- packages/components/popper/src/content.vue（SHA256 341bfe46659780118df15ba752581fd41ffaafc572044264b8d21e5d6eba2bf7）
- packages/components/popper/src/popper.ts（SHA256 85562b69039b2f4825fe90edb68942dc85641cf950dbc1bb9a9ac90636799fac）
- packages/components/popper/src/popper.vue（SHA256 e820826b5221b36f8cee8c6edfaa525a50bc83869272e2649f289ee2a89dbcf0）
- packages/components/popper/src/trigger.ts（SHA256 b9fc46effcae4fc371a19c09bccbd686c2bff93d8782832b7ed592b6ef34ba95）
- packages/components/popper/src/trigger.vue（SHA256 6c0629b0c3dae3cf38fa9bbbfbd09ad2b36bf68c852ffe887e04065eb7402ee5）
- packages/components/popper/src/utils.ts（SHA256 b3ed741fcb9ff7dc83184990a28ae4543dc59c3f09de8a9c468b04621ccd9bea）
- packages/components/popper/style/css.ts（SHA256 42e5cbb6fe7d17bee2d0045baf1fc8a378b73e8b6081cfcba28df6bae3b74fe4）
- packages/components/popper/style/index.ts（SHA256 25ca559cd4fcee38d372ff86fcc4890ec35a002715baa5aa1d9ffef87de80cb2）
- packages/components/popper/__tests__/arrow.test.tsx（SHA256 bf1d40b4e16c24e3113919755a14b361c88af6b7e6b39058c234edfe57339fb5）
- packages/components/popper/__tests__/content.test.tsx（SHA256 a93b071e106c43eebe71d849be2d246bbc2f8de185afa182ca7875a10a15a451）
- packages/components/popper/__tests__/popper.test.tsx（SHA256 6137a8d387c68635e9cba5fd121dad7dd571f317361b01210197d185cb9610a9）
- packages/components/popper/__tests__/trigger.test.tsx（SHA256 3a63ec68cec3f1b239cdf242fb69f46801936b02bf277c917a42d46be8a7cee5）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <ElPopperArrow /> — packages/components/popper/__tests__/arrow.test.tsx
- should set the arrowRef after mounted — packages/components/popper/__tests__/arrow.test.tsx
- should unset arrowRef before unmount — packages/components/popper/__tests__/arrow.test.tsx
- <ElPopperContent /> — packages/components/popper/__tests__/content.test.tsx
- with triggerRef provided — packages/components/popper/__tests__/content.test.tsx
- should mount the component correctly and set popperInstance correctly — packages/components/popper/__tests__/content.test.tsx
- should be able to be pure and themed — packages/components/popper/__tests__/content.test.tsx
- should be able to set customized styles — packages/components/popper/__tests__/content.test.tsx
- should be able to emit events — packages/components/popper/__tests__/content.test.tsx
- instantiate popper instance — packages/components/popper/__tests__/content.test.tsx
- should be able to update the current instance — packages/components/popper/__tests__/content.test.tsx
- should be able to update the reference node — packages/components/popper/__tests__/content.test.tsx
- <ElPopper /> — packages/components/popper/__tests__/popper.test.tsx
- should be able to provide instance to its children — packages/components/popper/__tests__/popper.test.tsx
- <ElPopperTrigger /> — packages/components/popper/__tests__/trigger.test.tsx
- rendering — packages/components/popper/__tests__/trigger.test.tsx
- should be able to render with children — packages/components/popper/__tests__/trigger.test.tsx
- should be able to render for virtual ref — packages/components/popper/__tests__/trigger.test.tsx
- can attach handlers — packages/components/popper/__tests__/trigger.test.tsx
- should be able to attach handlers to the trigger — packages/components/popper/__tests__/trigger.test.tsx
- should cleanup listeners when triggerRef changes — packages/components/popper/__tests__/trigger.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
