# Form 源码目录设计

- 来源：packages/components/form
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：Form/FormItem；嵌套字段路径、同步异步规则；触发时机、全量/单字段校验；重置、清理、滚动到字段；动态字段注册、初始值、错误提示及尺寸/禁用继承。
- 家族设计：[form](../components/form.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/form/index.ts（SHA256 e96c9b130a8858b64a6bd0f7ed56388a4b435cff3479059455029a14f019cf08）
- packages/components/form/src/constants.ts（SHA256 18135f88adfe9216474793623c70016c690b016a97ee0ae0b55269bc3e1ef042）
- packages/components/form/src/form-item.ts（SHA256 5a09b42ea3f5a3139e23148b9f9806399cdfdf71cb8666a74e17161afabc8da3）
- packages/components/form/src/form-item.vue（SHA256 55b5b07e9436830ef5d8b108f17d979742ad44db6dfc87946edd387b1b320931）
- packages/components/form/src/form-label-wrap.tsx（SHA256 164a88fd132f01cee53819d3ad967205cf69e7ffea18f52f3e9891460e687279）
- packages/components/form/src/form.ts（SHA256 4746477915a69506add3672f214f5ad2be5c10724a57cefa845ea63ce143ac56）
- packages/components/form/src/form.vue（SHA256 73d3e2bfe9049c750239e8a04e3837b42718d7bb52593b8587975637782869c4）
- packages/components/form/src/hooks/index.ts（SHA256 da21029e74b26f54f177602420fc96658d7250dcff89ef5ef227d09d5140bf20）
- packages/components/form/src/hooks/use-form-common-props.ts（SHA256 682d64385b7a94d3517c9e113042270e1f90ae93f9059e6e168935c953fc4ffb）
- packages/components/form/src/hooks/use-form-item.ts（SHA256 d3cfe3fbe305861af0c6b265f80776f47b7dbd16798ce5eb114021fd30c47c27）
- packages/components/form/src/types.ts（SHA256 eaefb4ddb63e50242bdc4d4017f1b57dbe50655f2e90e007217fb96c735502c4）
- packages/components/form/src/utils.ts（SHA256 163a005ccc83a70e1ef2b644011377e7ded97b2128dcbfbbc5ca2470f038cfab）
- packages/components/form/style/css.ts（SHA256 78fd2b8dd6b05a30b1e5cd1c071b8dfe502c1be988856392f2d76e516411dbf0）
- packages/components/form/style/index.ts（SHA256 816144ab4b26996b4194e616938a439f14d3b301d6d44b803ffa22e59263f9c1）
- packages/components/form/__tests__/form-item.test.tsx（SHA256 7a188eeec3c53eaf21d41d4160e0b6f618dc71bd69da64981f4c412c8f6df1f0）
- packages/components/form/__tests__/form.test.tsx（SHA256 4fd4a44ac09a2cb501b0b6094e28a4986aae190c46a6ba5a4ce339814c17e0b8）
- packages/components/form/__tests__/mock-data.tsx（SHA256 ec16d53f6881282a10f2f68ae7c99f494c2283291091126b80b46a28419196b7）
- packages/components/form/__tests__/use-form-item.test.tsx（SHA256 9300f851d1cec4c671e87170b36bd29fa2976f4f685b49d1cebc8eac2fee7b0a）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- ElFormItem — packages/components/form/__tests__/form-item.test.tsx
- when validation dispatches — packages/components/form/__tests__/form-item.test.tsx
- it successes — packages/components/form/__tests__/form-item.test.tsx
- should be able to validate successfully without callback — packages/components/form/__tests__/form-item.test.tsx
- should be able to validate successfully with callback — packages/components/form/__tests__/form-item.test.tsx
- should emit validate event — packages/components/form/__tests__/form-item.test.tsx
- it fails — packages/components/form/__tests__/form-item.test.tsx
- should be able to validate without callback — packages/components/form/__tests__/form-item.test.tsx
- should be able to validate with callback without throwing rejection — packages/components/form/__tests__/form-item.test.tsx
- should emit validate event — packages/components/form/__tests__/form-item.test.tsx
- form-item label for — packages/components/form/__tests__/form-item.test.tsx
- form-item label position — packages/components/form/__tests__/form-item.test.tsx
- should successfully toggle the label slot dynamically — packages/components/form/__tests__/form-item.test.tsx
- setInitialValue — packages/components/form/__tests__/form-item.test.tsx
- should allow setting custom initial value for reset — packages/components/form/__tests__/form-item.test.tsx
- should handle undefined initial values — packages/components/form/__tests__/form-item.test.tsx
- should not warn when form-item without label is unmounted — packages/components/form/__tests__/form-item.test.tsx
- Form — packages/components/form/__tests__/form.test.tsx
- label width — packages/components/form/__tests__/form.test.tsx
- auto label width — packages/components/form/__tests__/form.test.tsx
- form-item auto label width — packages/components/form/__tests__/form.test.tsx
- inline form — packages/components/form/__tests__/form.test.tsx
- label position — packages/components/form/__tests__/form.test.tsx
- label size — packages/components/form/__tests__/form.test.tsx
- show message — packages/components/form/__tests__/form.test.tsx
- reset field — packages/components/form/__tests__/form.test.tsx
- reset dynamic fields after prop switch — packages/components/form/__tests__/form.test.tsx
- clear validate — packages/components/form/__tests__/form.test.tsx
- scroll to field — packages/components/form/__tests__/form.test.tsx
- get form all fields — packages/components/form/__tests__/form.test.tsx
- validate return parameters — packages/components/form/__tests__/form.test.tsx
- scroll to the exact form option location — packages/components/form/__tests__/form.test.tsx
- validate status — packages/components/form/__tests__/form.test.tsx
- validate promise callback — packages/components/form/__tests__/form.test.tsx
- validate on rule change — packages/components/form/__tests__/form.test.tsx
- should use form disabled input not trigger @blur — packages/components/form/__tests__/form.test.tsx
- validate abnormal callback — packages/components/form/__tests__/form.test.tsx
- prop is array — packages/components/form/__tests__/form.test.tsx
- should preserve form input after submit — packages/components/form/__tests__/form.test.tsx
- FormItem — packages/components/form/__tests__/form.test.tsx
- should register form item — packages/components/form/__tests__/form.test.tsx
- should dynamically register form with items — packages/components/form/__tests__/form.test.tsx
- should not throw error when callback passed in — packages/components/form/__tests__/form.test.tsx
- setInitialValues — packages/components/form/__tests__/form.test.tsx
- should update initial values for all fields — packages/components/form/__tests__/form.test.tsx
- should work with partial field updates — packages/components/form/__tests__/form.test.tsx
- setInitialValue (FormItem) — packages/components/form/__tests__/form.test.tsx
- should update initial value for single field — packages/components/form/__tests__/form.test.tsx
- use-form-item — packages/components/form/__tests__/use-form-item.test.tsx
- should return local value — packages/components/form/__tests__/use-form-item.test.tsx
- should return props.size instead of injected.size — packages/components/form/__tests__/use-form-item.test.tsx
- should return fallback.size instead inject.size — packages/components/form/__tests__/use-form-item.test.tsx
- should return formItem.size instead form.size — packages/components/form/__tests__/use-form-item.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
