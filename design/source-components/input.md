# Input 源码目录设计

- 来源：packages/components/input
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：input/textarea、密码显隐、字数限制；clearable、前后缀/前后置内容；autosize、格式化和解析；IME、光标保持、focus/blur/select/clear；原生属性透传。
- 家族设计：[input](../components/input.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/input/index.ts（SHA256 9009835408b597ac9425b31102bb71212ff52875d276b2d5e45a9b63cf853011）
- packages/components/input/src/input.ts（SHA256 1bc6889731574a9080e1b0493c39f279bcad812715dce267c52de31ece041113）
- packages/components/input/src/input.vue（SHA256 c87a7bae49465abf6b33f6302429fe35eee4dc05b5dbee1be54c6d05bd0ffc39）
- packages/components/input/src/instance.ts（SHA256 de67d40517214e297d57d673a71a8bf1ac34fde73d1ddb72a417bda8b320dcb0）
- packages/components/input/src/utils.ts（SHA256 4db52b831e5d02e26c03115e5751e93928508478935fa8f433d82654e7338b81）
- packages/components/input/style/css.ts（SHA256 98985beadb5c989a11fd511682d3ece552eaef725bfff0eff7e2cf97a815906c）
- packages/components/input/style/index.ts（SHA256 ae19c9079b796232ba96d09497a4e7be14e1de1edd0e69094a4e471288d3d8a5）
- packages/components/input/__tests__/input.test.tsx（SHA256 f62ddf9ee498fef7d757b08f001b78bd35ba4c569a7c08b2c7e2d74aaa86d164）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Input.vue — packages/components/input/__tests__/input.test.tsx
- create — packages/components/input/__tests__/input.test.tsx
- default to empty — packages/components/input/__tests__/input.test.tsx
- disabled — packages/components/input/__tests__/input.test.tsx
- test emoji — packages/components/input/__tests__/input.test.tsx
- el-input should minimize value between emoji length and maxLength — packages/components/input/__tests__/input.test.tsx
- el-input add count-graphemes — packages/components/input/__tests__/input.test.tsx
- textarea should minimize value between emoji length and maxLength — packages/components/input/__tests__/input.test.tsx
- textarea add count-graphemes — packages/components/input/__tests__/input.test.tsx
- el-input keep exceed state and block further typing with count-graphemes — packages/components/input/__tests__/input.test.tsx
- el-input do not show exceed at limit and block further typing with count-graphemes — packages/components/input/__tests__/input.test.tsx
- el-input should reset native value when blocked by count-graphemes — packages/components/input/__tests__/input.test.tsx
- el-input should block mid-string insertion at limit without replacing suffix — packages/components/input/__tests__/input.test.tsx
- el-input should keep caret position when blocked at limit — packages/components/input/__tests__/input.test.tsx
- suffixIcon — packages/components/input/__tests__/input.test.tsx
- prefixIcon — packages/components/input/__tests__/input.test.tsx
- size — packages/components/input/__tests__/input.test.tsx
- type — packages/components/input/__tests__/input.test.tsx
- rows — packages/components/input/__tests__/input.test.tsx
- resize — packages/components/input/__tests__/input.test.tsx
- inputmode — packages/components/input/__tests__/input.test.tsx
- sets value on textarea / input type change — packages/components/input/__tests__/input.test.tsx
- limit input and show word count — packages/components/input/__tests__/input.test.tsx
- word count is a live region — packages/components/input/__tests__/input.test.tsx
- use formatter and parser — packages/components/input/__tests__/input.test.tsx
- Input Methods — packages/components/input/__tests__/input.test.tsx
- method:select — packages/components/input/__tests__/input.test.tsx
- method:resizeTextarea — packages/components/input/__tests__/input.test.tsx
- Input Events — packages/components/input/__tests__/input.test.tsx
- event:focus — packages/components/input/__tests__/input.test.tsx
- event:blur — packages/components/input/__tests__/input.test.tsx
- textarea & event:focus — packages/components/input/__tests__/input.test.tsx
- textarea & event:blur — packages/components/input/__tests__/input.test.tsx
- event:change — packages/components/input/__tests__/input.test.tsx
- event:clear — packages/components/input/__tests__/input.test.tsx
- event:input — packages/components/input/__tests__/input.test.tsx
- non-emit event such as keyup should work — packages/components/input/__tests__/input.test.tsx
- input-style — packages/components/input/__tests__/input.test.tsx
- Textarea Events — packages/components/input/__tests__/input.test.tsx
- event:keydown — packages/components/input/__tests__/input.test.tsx
- show-password icon — packages/components/input/__tests__/input.test.tsx
- show / hide password — packages/components/input/__tests__/input.test.tsx
- show password emits change on blur when value changed — packages/components/input/__tests__/input.test.tsx
- show password does not emit change after value reverts — packages/components/input/__tests__/input.test.tsx
- show password emits change on blur with lazy modifier — packages/components/input/__tests__/input.test.tsx
- show password restores a rejected lazy value after blur — packages/components/input/__tests__/input.test.tsx
- show password does not emit change when focus stays in the wrapper — packages/components/input/__tests__/input.test.tsx
- show password emits change and model update before blur event with lazy modifier — packages/components/input/__tests__/input.test.tsx
- show password clear button does not emit duplicate change on blur — packages/components/input/__tests__/input.test.tsx
- passwordVisible expose — packages/components/input/__tests__/input.test.tsx
- password-icon slot — packages/components/input/__tests__/input.test.tsx
- form item accessibility integration — packages/components/input/__tests__/input.test.tsx
- automatic id attachment — packages/components/input/__tests__/input.test.tsx
- specified id attachment — packages/components/input/__tests__/input.test.tsx
- form item role is group when multiple inputs — packages/components/input/__tests__/input.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/input/__tests__/input.test.tsx
- input change event return Event parameter — packages/components/input/__tests__/input.test.tsx
- modelValue modifiers — packages/components/input/__tests__/input.test.tsx
- textarea-show-word-limit-outside-position — packages/components/input/__tests__/input.test.tsx
- input-show-word-limit-outside-position — packages/components/input/__tests__/input.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
