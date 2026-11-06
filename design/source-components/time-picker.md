# TimePicker 源码目录设计

- 来源：packages/components/time-picker
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：单时间/范围；展示/值格式、默认时间；小时/分钟/秒禁用函数；箭头/滚轮选择、确认清空；键盘与表单。
- 家族设计：[time-picker](../components/time-picker.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/time-picker/index.ts（SHA256 edeb483268b50c0ad52af11e96fab6c4f15f8bd46808cf60b5dea6de98a394a6）
- packages/components/time-picker/src/common/picker-range-trigger.vue（SHA256 57260f060195e815dc50b837ae673a978c9e0afd80b1f6bddf40cd41c0fc430f）
- packages/components/time-picker/src/common/picker.vue（SHA256 024a2442847f356f2507ad7a1b7fc1ea718f31630b2176e91cc2243e6f00b978）
- packages/components/time-picker/src/common/props.ts（SHA256 3c19ed819b79835110a818fcbed0e47219900bca435c79320ce1dea65b6cb6b6）
- packages/components/time-picker/src/composables/use-common-picker.ts（SHA256 7e8debab02569576363b46925da2486698d2bee9ef3129b401b06fbaa5686351）
- packages/components/time-picker/src/composables/use-time-panel.ts（SHA256 2675d03250b632a2e6ab3bbed19595d759aeb2733f69f1f154ac2833e4636b5e）
- packages/components/time-picker/src/composables/use-time-picker.ts（SHA256 80e076b60215bb7f2b9daaab488c763e707f8d4d402a702894c3f5226854d6a9）
- packages/components/time-picker/src/constants.ts（SHA256 968f05ea290778c578568dcb40062a6666311322fbf47ab757b7a14592dd1cf0）
- packages/components/time-picker/src/props/basic-time-spinner.ts（SHA256 3c5eaf069adf24a62102ffc8ad1659567f49f78e5016013cc74347f45e632695）
- packages/components/time-picker/src/props/panel-time-picker.ts（SHA256 c2d1848e680cc8067bbaf184e7f9210a387ae53ba25edaacf703704164bc91ff）
- packages/components/time-picker/src/props/panel-time-range.ts（SHA256 f064a8586e3732a9e9a7d700da2f27c1f31a9c4bc9a5656b5d693a3df200e542）
- packages/components/time-picker/src/props/shared.ts（SHA256 c294441bdf6f73e22514758e530904ca6b7d9eec7878b1dc9d915ab1c0cd88b8）
- packages/components/time-picker/src/time-picker-com/basic-time-spinner.vue（SHA256 36f7c3801e3fa8ad7b859f4d4e7ab61c86c6e067981cb7ab724a5a0b80239f21）
- packages/components/time-picker/src/time-picker-com/panel-time-pick.vue（SHA256 ac2f2c8e5be6ba127ee5a601fe3ddc7289b4c3b452a0f9ca5d22c11cf3d7ecbf）
- packages/components/time-picker/src/time-picker-com/panel-time-range.vue（SHA256 f4508c0235eb49b6d11cc6db57bea7130cd637da01fcacf7b534732267651e71）
- packages/components/time-picker/src/time-picker.tsx（SHA256 fcbb12b680356126d36c56cb7376e37d0ec59b60ca60c8174227280b5509cb16）
- packages/components/time-picker/src/utils.ts（SHA256 5d5d897e0de1fa6ab8cc1c32b70192124db3b9a05edc54bb4b6bee2dbb83860a）
- packages/components/time-picker/style/css.ts（SHA256 c2f9708ea539eeae651c36efd7814c4688c44d7965d561c0ea5f950c25634c8f）
- packages/components/time-picker/style/index.ts（SHA256 f6b237d9584a0595019670d0dae21ba8eadc713f4c5179b5e97d3cc63aef8a67）
- packages/components/time-picker/__tests__/time-picker.test.tsx（SHA256 950e646ce46ea09067a18338c9ffb3e9d08a0117e36da411f8f509f4bf4778c7）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- TimePicker — packages/components/time-picker/__tests__/time-picker.test.tsx
- create & custom class & style — packages/components/time-picker/__tests__/time-picker.test.tsx
- should show clear btn on focus — packages/components/time-picker/__tests__/time-picker.test.tsx
- set format && default value && set AM/PM spinner && no $attr to panel — packages/components/time-picker/__tests__/time-picker.test.tsx
- select time — packages/components/time-picker/__tests__/time-picker.test.tsx
- click confirm / cancel button — packages/components/time-picker/__tests__/time-picker.test.tsx
- should correctly cancel value after opened twice — packages/components/time-picker/__tests__/time-picker.test.tsx
- should update oldValue when visible change — packages/components/time-picker/__tests__/time-picker.test.tsx
- set format — packages/components/time-picker/__tests__/time-picker.test.tsx
- event change, focus, blur, keydown — packages/components/time-picker/__tests__/time-picker.test.tsx
- trigger on enter visible change — packages/components/time-picker/__tests__/time-picker.test.tsx
- should cancel correctly the right value after manual input — packages/components/time-picker/__tests__/time-picker.test.tsx
- selectableRange  — packages/components/time-picker/__tests__/time-picker.test.tsx
- exposed focus & blur — packages/components/time-picker/__tests__/time-picker.test.tsx
- ref handleOpen — packages/components/time-picker/__tests__/time-picker.test.tsx
- ref handleClose — packages/components/time-picker/__tests__/time-picker.test.tsx
- model value should sync when disabled-hours was updated — packages/components/time-picker/__tests__/time-picker.test.tsx
- when a time is input, the type of modelValue should be Date by default — packages/components/time-picker/__tests__/time-picker.test.tsx
- when a time is input, the type of modelValue should be Date by default (is-range) — packages/components/time-picker/__tests__/time-picker.test.tsx
- picker-panel should not pop up when readonly — packages/components/time-picker/__tests__/time-picker.test.tsx
- picker-panel should not pop up when disabled — packages/components/time-picker/__tests__/time-picker.test.tsx
- can auto skip when disabled — packages/components/time-picker/__tests__/time-picker.test.tsx
- clear with externally normalized empty value (#24826) — packages/components/time-picker/__tests__/time-picker.test.tsx
- does not open the panel when the clear icon is clicked while unfocused — packages/components/time-picker/__tests__/time-picker.test.tsx
- emits change only once when clearing while the panel is open — packages/components/time-picker/__tests__/time-picker.test.tsx
- still opens the panel on focus after a canceled clear gesture — packages/components/time-picker/__tests__/time-picker.test.tsx
- TimePicker(range) — packages/components/time-picker/__tests__/time-picker.test.tsx
- create — packages/components/time-picker/__tests__/time-picker.test.tsx
- default value — packages/components/time-picker/__tests__/time-picker.test.tsx
- cancel button — packages/components/time-picker/__tests__/time-picker.test.tsx
- clear button — packages/components/time-picker/__tests__/time-picker.test.tsx
- should close pick when click the clear button on pick opened — packages/components/time-picker/__tests__/time-picker.test.tsx
- clearing only one side of timerange should not clear the whole model — packages/components/time-picker/__tests__/time-picker.test.tsx
- manually clear timerange via keyboard — packages/components/time-picker/__tests__/time-picker.test.tsx
- selectableRange  — packages/components/time-picker/__tests__/time-picker.test.tsx
- arrow key — packages/components/time-picker/__tests__/time-picker.test.tsx
- should be able to inherit options from parent injection — packages/components/time-picker/__tests__/time-picker.test.tsx
- am/pm mode avoid render redundant content — packages/components/time-picker/__tests__/time-picker.test.tsx
- form item accessibility integration — packages/components/time-picker/__tests__/time-picker.test.tsx
- automatic id attachment — packages/components/time-picker/__tests__/time-picker.test.tsx
- specified id attachment — packages/components/time-picker/__tests__/time-picker.test.tsx
- form item role is group when multiple inputs — packages/components/time-picker/__tests__/time-picker.test.tsx
- dismiss events restore picker — packages/components/time-picker/__tests__/time-picker.test.tsx
- should be able to focus back and callout picker after clear — packages/components/time-picker/__tests__/time-picker.test.tsx
- should be able to focus back and callout picker after pick — packages/components/time-picker/__tests__/time-picker.test.tsx
- display value — packages/components/time-picker/__tests__/time-picker.test.tsx
- should keep empty input on focus when saveOnBlur is false — packages/components/time-picker/__tests__/time-picker.test.tsx
- should keep range inputs empty on focus when saveOnBlur is false — packages/components/time-picker/__tests__/time-picker.test.tsx
- should keep clear state and restore confirmed value on cancel when saveOnBlur is false — packages/components/time-picker/__tests__/time-picker.test.tsx
- avoid update initial value when using disabledHours — packages/components/time-picker/__tests__/time-picker.test.tsx
- can clear when using disabledHours — packages/components/time-picker/__tests__/time-picker.test.tsx
- It should generate accessible attributes — packages/components/time-picker/__tests__/time-picker.test.tsx
- should generate aria attributes — packages/components/time-picker/__tests__/time-picker.test.tsx
- should generate aria attributes for range — packages/components/time-picker/__tests__/time-picker.test.tsx
- should show default value when persistent is false — packages/components/time-picker/__tests__/time-picker.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
