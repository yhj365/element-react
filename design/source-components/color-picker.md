# ColorPicker 源码目录设计

- 来源：packages/components/color-picker
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：触发器与颜色浮层；透明度、颜色格式、预定义色；确认、清空和取消；禁用、尺寸及表单联动；面板组合与定位。
- 家族设计：[color-picker](../components/color-picker.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/color-picker/index.ts（SHA256 e39fb18ce9794617e46d0559d2ec398c3d485b72efd870e98981e6ef0524780a）
- packages/components/color-picker/src/color-picker.ts（SHA256 cdce43285a51eabe3b5ad0c0b076de4c1c0471474961da7f1a00f76e881d3e8c）
- packages/components/color-picker/src/color-picker.vue（SHA256 3274486bee82cbe2f313f88f2f134e1200fc8966681ba87a1e1eaa35dd3571b9）
- packages/components/color-picker/style/css.ts（SHA256 792c9c842bdd5a372e518eea4d932f767951a4e682c408ea535bd4d1bcaaf6e4）
- packages/components/color-picker/style/index.ts（SHA256 605190b8ee9e748a1fd7cc69e441290a0c6140f492f27a7cb91262bf4a3fae24）
- packages/components/color-picker/__tests__/color-picker.test.tsx（SHA256 955d44cff95f5345727b523786fe63ce5382306e535727f3726a352b89d1bd42）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Color-picker — packages/components/color-picker/__tests__/color-picker.test.tsx
- Mount Color-picker — packages/components/color-picker/__tests__/color-picker.test.tsx
- should show alpha slider when show-alpha=true — packages/components/color-picker/__tests__/color-picker.test.tsx
- should show correct rgb value — packages/components/color-picker/__tests__/color-picker.test.tsx
- should show correct hex value contains alpha — packages/components/color-picker/__tests__/color-picker.test.tsx
- control alpha changes through keyboard — packages/components/color-picker/__tests__/color-picker.test.tsx
- should init the right color when open — packages/components/color-picker/__tests__/color-picker.test.tsx
- should show color picker when click trigger — packages/components/color-picker/__tests__/color-picker.test.tsx
- should clear a color when clear button click — packages/components/color-picker/__tests__/color-picker.test.tsx
- should not display the clear button when clearable is false — packages/components/color-picker/__tests__/color-picker.test.tsx
- should change hue when clicking the hue bar — packages/components/color-picker/__tests__/color-picker.test.tsx
- should change hue when saturation is zero — packages/components/color-picker/__tests__/color-picker.test.tsx
- should change alpha when clicking the alpha bar — packages/components/color-picker/__tests__/color-picker.test.tsx
- should change saturation and value when clicking the sv-panel — packages/components/color-picker/__tests__/color-picker.test.tsx
- should change color to the selected color — packages/components/color-picker/__tests__/color-picker.test.tsx
- should change selected state of predefined color — packages/components/color-picker/__tests__/color-picker.test.tsx
- should not execute activeChange event — packages/components/color-picker/__tests__/color-picker.test.tsx
- should update the colorFormat and selected color when the colorFormat prop changes — packages/components/color-picker/__tests__/color-picker.test.tsx
- should update the selected color when the showAlpha prop changes — packages/components/color-picker/__tests__/color-picker.test.tsx
- form item accessibility integration — packages/components/color-picker/__tests__/color-picker.test.tsx
- automatic id attachment — packages/components/color-picker/__tests__/color-picker.test.tsx
- specified id attachment — packages/components/color-picker/__tests__/color-picker.test.tsx
- form item role is group when multiple inputs — packages/components/color-picker/__tests__/color-picker.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/color-picker/__tests__/color-picker.test.tsx
- it will target the focus & blur — packages/components/color-picker/__tests__/color-picker.test.tsx
- a11y — packages/components/color-picker/__tests__/color-picker.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
