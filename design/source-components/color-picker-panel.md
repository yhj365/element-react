# ColorPickerPanel 源码目录设计

- 来源：packages/components/color-picker-panel
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：独立颜色面板；色相、饱和度、亮度、透明度；格式转换和预定义色；颜色拖动、输入和活动颜色事件。
- 家族设计：[color-picker-panel](../components/color-picker-panel.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/color-picker-panel/index.ts（SHA256 8c5d682776263ef98c354c006023244f47492866d6fc3da534caf7827d31b35b）
- packages/components/color-picker-panel/src/color-picker-panel.ts（SHA256 cf92180c441b2cca6c631f679a8359fb209be4a6b2901d3282850ef7bd64f283）
- packages/components/color-picker-panel/src/color-picker-panel.vue（SHA256 c6cd49ef781ab30f9ae4def4902f7e7ba2ebc133dce93a3be9fa06d03e3fefad）
- packages/components/color-picker-panel/src/components/alpha-slider.vue（SHA256 9b0915b0b12522afc67061d2db328f5ceec771876129395af8d6a7d08ed3e453）
- packages/components/color-picker-panel/src/components/hue-slider.vue（SHA256 9308bd481629f2c6f1ecb9a7fb707dac16252ff525fa52cdcd2cc8cd3acb7e33）
- packages/components/color-picker-panel/src/components/predefine.vue（SHA256 b6a27083990cb2ec7b99ca8699d432828855c18f09ae611ffbbb251b0ecbb3ef）
- packages/components/color-picker-panel/src/components/sv-panel.vue（SHA256 2d36c418943bc36edf735385e2c93fb219b0aeac5859c629027f926786d3c490）
- packages/components/color-picker-panel/src/composables/use-common-color.ts（SHA256 3e1a07579fb703057f338064c64e2b7f364cdc0fe4c2a9770bba02c9cdff925d）
- packages/components/color-picker-panel/src/composables/use-predefine.ts（SHA256 7d792db13682637227dca900d9c927ffb93a6da87f3047f8216a323b9cf1fdd6）
- packages/components/color-picker-panel/src/composables/use-slider.ts（SHA256 3f1a1e4cface6aa66d87713b8ad20dab6269e8ca566b178cf0a5451f065cc753）
- packages/components/color-picker-panel/src/composables/use-sv-panel.ts（SHA256 f9e9e17e10f931745a67a1c4e37555651ffcb266523bd3c4687d50e31735416d）
- packages/components/color-picker-panel/src/props/predefine.ts（SHA256 fbec5689020f2679afe821c61e62bc5a7be260e1ff422390239e18c1253f203d）
- packages/components/color-picker-panel/src/props/slider.ts（SHA256 480d0300aa06a206f7a99e21907002b03e27e897e151e6b647bdf8d8611a7101）
- packages/components/color-picker-panel/src/props/sv-panel.ts（SHA256 11126fabe0168b84012eb654428f17700219c0a7b1125b1ad46f6585fefe702a）
- packages/components/color-picker-panel/src/utils/color.ts（SHA256 fa38d1cb3cbbc60416c7b2680ff9f439b6f346e9a164e28ba9b80b428967b64f）
- packages/components/color-picker-panel/src/utils/draggable.ts（SHA256 15c4fc83025aa5a6db93eab504b6298a6c63a3ecfd2f68476fc455f71054164b）
- packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx（SHA256 674af168a0f1538fbce98079e2ea059b91f2799bd327cbde7309e23d7a4efb87）
- packages/components/color-picker-panel/style/css.ts（SHA256 18a9b01d4cfc17678efcd779a4ac44fd20c3f50142da11c9f4687ac27a89715e）
- packages/components/color-picker-panel/style/index.ts（SHA256 33314b692e3cdb0b872d2cda8cdb76dbb907a3dbcdc04291268a19446fa658fb）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Color-picker-panel — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- Mount Color-picker-panel — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- disabled — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- hue slider disabled — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- alpha slider disabled — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- predefine color disabled — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- sv panel disabled — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should show alpha slider when show-alpha=true — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should show correct rgb value — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should show correct hex value contains alpha — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- control alpha changes through keyboard — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should init the right color when open — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should change hue when clicking the hue bar — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should change hue when saturation is zero — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should change alpha when clicking the alpha bar — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should change saturation and value when clicking the sv-panel — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should change color to the selected color — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should change selected state of predefined color — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should update the colorFormat and selected color when the colorFormat prop changes — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should update the selected color when the showAlpha prop changes — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- should clear the color when color is empty — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- control hue changes through keyboard — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- control saturation and brightness changes through keyboard — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- predefine colors should show different color when showAlpha values are different — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- a11y label — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- default — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- with show-alpha — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- with predefine — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx
- passed class names and styles into hue-slider — packages/components/color-picker-panel/src/__tests__/color-picker-panel.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
