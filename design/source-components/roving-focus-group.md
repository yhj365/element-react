# RovingFocusGroup 源码目录设计

- 来源：packages/components/roving-focus-group
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：单一Tab入口、方向键/Home/End游走、循环/方向设置；动态增删与禁用项跳过。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：单一Tab入口、方向键/Home/End游走、循环/方向设置；动态增删与禁用项跳过。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/roving-focus-group/index.ts（SHA256 f8e008418230e7ccd298ec2f3812d1119eae0de3feec7445dd935ee0a7224ce8）
- packages/components/roving-focus-group/src/roving-focus-group-impl.vue（SHA256 c655a4b2865cf66cdfb1be1e391accf8e48547702b30ba04b2cd3246fba368f2）
- packages/components/roving-focus-group/src/roving-focus-group.ts（SHA256 e728f4d3b5c98ae687fd36a1f0e7a63536eee79865ce04fa2f543f619edde068）
- packages/components/roving-focus-group/src/roving-focus-group.vue（SHA256 d5a35b0094158b3e5bc3741d53d5938d04fb782152e7553dfb2904cae3718735）
- packages/components/roving-focus-group/src/roving-focus-item.vue（SHA256 5015bd78bea82b44d808f6fff3fb93d735b4deb728909c73b01edc5a54073262）
- packages/components/roving-focus-group/src/tokens.ts（SHA256 d99380254f789a6b303cba65f2ad7b857dc13956fab5b77a4f0d9cf18b89b0c9）
- packages/components/roving-focus-group/src/utils.ts（SHA256 202523847531ccee609bdd7f878adebb5dcb7dab08510225c2e46fb471b3b2e0）
- packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts（SHA256 d59c66c049027dec65a8c7a7026b95696652c7403643627e9fe33afc40f60a6d）
- packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts（SHA256 749ef2656ffe94548d7fd70fbaef881f337e351da7dd9d6c60529edc7e8219c7）
- packages/components/roving-focus-group/__tests__/util.test.ts（SHA256 95b84dfbaa1f2db562fe30adebedd43bcf83c452c6d8e9f59b12c79ecf52a6d8）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <ElRovingFocusGroup /> — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- should be able to render — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- should be able to control current tab — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- should be able to combine style — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- provides — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- should provide onFocus and onBlur event for children — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- should provide onMousedown event for children — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- should be able to provide item tabbing handlers — packages/components/roving-focus-group/__tests__/roving-focus-group.test.ts
- <ElRovingFocusItem /> — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- rendering test — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- should be able to render content — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- roving focus — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- should be able to handle mousedown event — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- should be able to handle focus event — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- should be able to handle keyboard navigation — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- with <ElRovingFocusGroupImpl /> — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- should be able to handle keyboard navigation — packages/components/roving-focus-group/__tests__/roving-focus-item.test.ts
- util — packages/components/roving-focus-group/__tests__/util.test.ts
- should be able to fetch focusIntent — packages/components/roving-focus-group/__tests__/util.test.ts
- should reorder array at index X — packages/components/roving-focus-group/__tests__/util.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
