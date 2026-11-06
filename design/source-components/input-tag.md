# InputTag 源码目录设计

- 来源：packages/components/input-tag
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：标签新增/删除/拖动按原API；触发键、最大数量、清空；折叠与溢出提示；自定义标签、IME及表单交互。
- 家族设计：[input-tag](../components/input-tag.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/input-tag/index.ts（SHA256 aae9658581161b9a0b822bde7f24de19117eed8a3c2ebc008e2d6a3d6d0c8b49）
- packages/components/input-tag/src/composables/index.ts（SHA256 8c995b2136b3456dbaa2f02ddd93c1dd3a14cb85673c7539545aa2be76432ebe）
- packages/components/input-tag/src/composables/use-drag-tag.ts（SHA256 a8fee2343876a61d7b4597ac61cbd67db350a72665e3f8755cec3027175c7586）
- packages/components/input-tag/src/composables/use-hovering.ts（SHA256 983bc705704e2dfd4e49748da4143f86d6c39b809ed8ebf11b1ef56cde1e8b19）
- packages/components/input-tag/src/composables/use-input-tag-dom.ts（SHA256 d069bdd18e06afda7c9e55b31b25d2083afc1627ffe15f2f317bdca3c211315a）
- packages/components/input-tag/src/composables/use-input-tag.ts（SHA256 ea20912057332ecff60320cc63e5ed6832e2ed150f7d673e313a8d225aa43469）
- packages/components/input-tag/src/input-tag.ts（SHA256 4280861290c6e24b3e4dfeb3c8b8f2598230055de02e0e0c7f0205d456bd9308）
- packages/components/input-tag/src/input-tag.vue（SHA256 0c0abc554c103537c13308c272b71ac5fcf7453cf3b984b8bd1dea0322107d56）
- packages/components/input-tag/src/instance.ts（SHA256 9fc9e9b2e754c15a953c2195f9daef8ded730e64f7cced9433acd65ce195142d）
- packages/components/input-tag/style/css.ts（SHA256 d4c15053d5b43fa45c510e2359e15d60b53c2c4460b103f011bb2e2b530b7916）
- packages/components/input-tag/style/index.ts（SHA256 004d3cbedeb4ff11142597a2ae6b395d4c1a1b6e8aafe925457ad2f180c0a5df）
- packages/components/input-tag/__tests__/input-tag.test.tsx（SHA256 3e9d4cc761e145d603b01ceeb0d7dad5554918b9b1ca079c049125686878ea41）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- InputTag.vue — packages/components/input-tag/__tests__/input-tag.test.tsx
- create — packages/components/input-tag/__tests__/input-tag.test.tsx
- modelValue — packages/components/input-tag/__tests__/input-tag.test.tsx
- v-model — packages/components/input-tag/__tests__/input-tag.test.tsx
- trigger — packages/components/input-tag/__tests__/input-tag.test.tsx
- max — packages/components/input-tag/__tests__/input-tag.test.tsx
- id — packages/components/input-tag/__tests__/input-tag.test.tsx
- size — packages/components/input-tag/__tests__/input-tag.test.tsx
- disabled — packages/components/input-tag/__tests__/input-tag.test.tsx
- placeholder — packages/components/input-tag/__tests__/input-tag.test.tsx
- readonly — packages/components/input-tag/__tests__/input-tag.test.tsx
- clearable — packages/components/input-tag/__tests__/input-tag.test.tsx
- tabindex — packages/components/input-tag/__tests__/input-tag.test.tsx
- autofocus — packages/components/input-tag/__tests__/input-tag.test.tsx
- tagType — packages/components/input-tag/__tests__/input-tag.test.tsx
- tagEffect — packages/components/input-tag/__tests__/input-tag.test.tsx
- $attrs — packages/components/input-tag/__tests__/input-tag.test.tsx
- delimiter — packages/components/input-tag/__tests__/input-tag.test.tsx
- with string — packages/components/input-tag/__tests__/input-tag.test.tsx
- with RegExp — packages/components/input-tag/__tests__/input-tag.test.tsx
- paste multiple delimiter — packages/components/input-tag/__tests__/input-tag.test.tsx
- paste multiple /\r?\n/ delimiter — packages/components/input-tag/__tests__/input-tag.test.tsx
- events — packages/components/input-tag/__tests__/input-tag.test.tsx
- focus — packages/components/input-tag/__tests__/input-tag.test.tsx
- blur — packages/components/input-tag/__tests__/input-tag.test.tsx
- update:modelValue — packages/components/input-tag/__tests__/input-tag.test.tsx
- change — packages/components/input-tag/__tests__/input-tag.test.tsx
- input — packages/components/input-tag/__tests__/input-tag.test.tsx
- add-tag — packages/components/input-tag/__tests__/input-tag.test.tsx
- remove-tag — packages/components/input-tag/__tests__/input-tag.test.tsx
- clear — packages/components/input-tag/__tests__/input-tag.test.tsx
- slots — packages/components/input-tag/__tests__/input-tag.test.tsx
- prefix — packages/components/input-tag/__tests__/input-tag.test.tsx
- suffix — packages/components/input-tag/__tests__/input-tag.test.tsx
- tag — packages/components/input-tag/__tests__/input-tag.test.tsx
- methods — packages/components/input-tag/__tests__/input-tag.test.tsx
- focus & blur — packages/components/input-tag/__tests__/input-tag.test.tsx
- use with form — packages/components/input-tag/__tests__/input-tag.test.tsx
- automatic id attachment — packages/components/input-tag/__tests__/input-tag.test.tsx
- specified id attachment — packages/components/input-tag/__tests__/input-tag.test.tsx
- collapseTags — packages/components/input-tag/__tests__/input-tag.test.tsx
- collapseTagsTooltip — packages/components/input-tag/__tests__/input-tag.test.tsx
- maxCollapseTags — packages/components/input-tag/__tests__/input-tag.test.tsx
- collapseTags should prevent line break when content exceeds — packages/components/input-tag/__tests__/input-tag.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
