# Checkbox 源码目录设计

- 来源：packages/components/checkbox
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：独立值与 CheckboxGroup 数组；true/false 自定义值；半选、禁用、尺寸、边框；CheckboxButton；组数量限制与表单校验。
- 家族设计：[checkbox](../components/checkbox.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/checkbox/index.ts（SHA256 b4b30a15ec8aa3d65de46dd842540647122180dca42187468ef5e6acf229bd98）
- packages/components/checkbox/src/checkbox-button.vue（SHA256 afd6c6f786fb45f76e191b4448922686b65324307d6c81a03c4bf4c9eee36b74）
- packages/components/checkbox/src/checkbox-group.ts（SHA256 b0143317147b320ccdc4602809adeb47d224c81bd9a91731116185b2813c1df5）
- packages/components/checkbox/src/checkbox-group.vue（SHA256 c36cd6a4147470fdb7f1950b1e0e9cfc40917f34207b0bc28e9ebd332d2ae584）
- packages/components/checkbox/src/checkbox.ts（SHA256 a34873956bb4bb3789e063018d2d0278ecd2e5f4f2eb176b42fd2709707008c4）
- packages/components/checkbox/src/checkbox.vue（SHA256 e617e45d9be2b07b891f9aa7a2adf6d5199b7ea18cbfd57ec1a5dcf9b752b84f）
- packages/components/checkbox/src/composables/index.ts（SHA256 685b4660cd6534331a6d9573e03821c93581f88c6386ebcec86872d5a8065973）
- packages/components/checkbox/src/composables/use-checkbox-disabled.ts（SHA256 edc0c70d4756bf56da2e0fad46e96d0dc9067a489fdc81de333524fec2476a81）
- packages/components/checkbox/src/composables/use-checkbox-event.ts（SHA256 f76133592eab5abce003ddf459d586868e2255a49eb59f2d8dba3804706da566）
- packages/components/checkbox/src/composables/use-checkbox-model.ts（SHA256 9ce6e5055028406a10150915270bc92f4085610fc05f889c9fe1622a428c7a97）
- packages/components/checkbox/src/composables/use-checkbox-status.ts（SHA256 d7f5b560120328d62bbad34657e3b2a65eb57751726af10c497c4c6d921939ee）
- packages/components/checkbox/src/composables/use-checkbox.ts（SHA256 fdcd1b2bdf8a97f353a55b8edaa7df26f43dd8ae99073030188330611ce26c8b）
- packages/components/checkbox/src/constants.ts（SHA256 72e83fbceb6f4e650a92f593ea5d5d07040c5132b63e1b8bbcf0dfadb2032332）
- packages/components/checkbox/style/css.ts（SHA256 91e8bdce89180e3bd5c38684e9140251047f5bcbcebeeb784a7ab313b0d23404）
- packages/components/checkbox/style/index.ts（SHA256 913cc4dd10eeaadda3cffbf75cfef40797d5f2451b883db98feeeb5dd57830f7）
- packages/components/checkbox/__tests__/checkbox.test.tsx（SHA256 d4c132ce9887f13e383c36f0550e38c331096be5ff04e3b8169de1f19439a0a9）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Checkbox — packages/components/checkbox/__tests__/checkbox.test.tsx
- create — packages/components/checkbox/__tests__/checkbox.test.tsx
- label set to number 0 — packages/components/checkbox/__tests__/checkbox.test.tsx
- no v-model — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox without label — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox with label attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- disabled — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox without label — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox with label attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/checkbox/__tests__/checkbox.test.tsx
- change event — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox without label — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox with label attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox with label as slot content — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox is wrapped in label — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox group — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox group renders from options — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox group renders from options with checkbox-button — packages/components/checkbox/__tests__/checkbox.test.tsx
- should avoid passing alias fields to el-checkbox — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox group with dynamic modelValue — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox group without modelValue — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox group change — packages/components/checkbox/__tests__/checkbox.test.tsx
- nested group — packages/components/checkbox/__tests__/checkbox.test.tsx
- true false label — packages/components/checkbox/__tests__/checkbox.test.tsx
- without label — packages/components/checkbox/__tests__/checkbox.test.tsx
- with label attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- with label as slot content — packages/components/checkbox/__tests__/checkbox.test.tsx
- true/false-value  — packages/components/checkbox/__tests__/checkbox.test.tsx
- without true/false-value attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- without true-value attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- without false-value attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- with true/false-value attribute — packages/components/checkbox/__tests__/checkbox.test.tsx
- check — packages/components/checkbox/__tests__/checkbox.test.tsx
- label — packages/components/checkbox/__tests__/checkbox.test.tsx
- value is object — packages/components/checkbox/__tests__/checkbox.test.tsx
- value is object with initial values — packages/components/checkbox/__tests__/checkbox.test.tsx
- should clear checked status when v-model is set to null — packages/components/checkbox/__tests__/checkbox.test.tsx
- should clear checked status when v-model is set to undefined — packages/components/checkbox/__tests__/checkbox.test.tsx
- check-button — packages/components/checkbox/__tests__/checkbox.test.tsx
- create — packages/components/checkbox/__tests__/checkbox.test.tsx
- disabled — packages/components/checkbox/__tests__/checkbox.test.tsx
- change event — packages/components/checkbox/__tests__/checkbox.test.tsx
- button group change — packages/components/checkbox/__tests__/checkbox.test.tsx
- button group props — packages/components/checkbox/__tests__/checkbox.test.tsx
- button group tag — packages/components/checkbox/__tests__/checkbox.test.tsx
- button group min and max — packages/components/checkbox/__tests__/checkbox.test.tsx
- button group exceed max — packages/components/checkbox/__tests__/checkbox.test.tsx
- nested group — packages/components/checkbox/__tests__/checkbox.test.tsx
- checked prop — packages/components/checkbox/__tests__/checkbox.test.tsx
- check — packages/components/checkbox/__tests__/checkbox.test.tsx
- checked — packages/components/checkbox/__tests__/checkbox.test.tsx
- form item accessibility integration — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox, no label, automatic label attachment — packages/components/checkbox/__tests__/checkbox.test.tsx
- checkbox with label, form item is group — packages/components/checkbox/__tests__/checkbox.test.tsx
- single checkbox group in form item — packages/components/checkbox/__tests__/checkbox.test.tsx
- single checkbox group in form item, override label — packages/components/checkbox/__tests__/checkbox.test.tsx
- multiple checkbox groups in form item — packages/components/checkbox/__tests__/checkbox.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
