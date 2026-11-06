# DatePickerPanel 源码目录设计

- 来源：packages/components/date-picker-panel
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：独立日期面板；日期/周/月/年及范围模式以源码支持为准；快捷项、禁用日期、联动与非联动面板；日期单元格定制。
- 家族设计：[date-picker-panel](../components/date-picker-panel.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/date-picker-panel/index.ts（SHA256 fa74544d86b9b2f47731a792b7a1c6e593fa41973a20f189147a9057389a2d8f）
- packages/components/date-picker-panel/src/composables/use-basic-date-table.ts（SHA256 b238da47c9426af638fc9fa48cbac20292487b45db49ecbc28bcfa3c95f9e765）
- packages/components/date-picker-panel/src/composables/use-month-range-header.ts（SHA256 d4f0b94149bd9e46a5f8663b0f040f5d29109669e471a77c937233c9dbe12cff）
- packages/components/date-picker-panel/src/composables/use-panel-date-range.ts（SHA256 f65311dbb46a92df6fa443649c9f642b080d7b3a01791d42136431fe8f59641b）
- packages/components/date-picker-panel/src/composables/use-range-picker.ts（SHA256 af334dd5f500c4c5179b8c348af72b5c1ef5fd499dd01249f8c5909c02fa7b29）
- packages/components/date-picker-panel/src/composables/use-shortcut.ts（SHA256 a424d611b61a2801d1ed03cafc848563c4d24b4e22cb311016e1d330b5b1fec4）
- packages/components/date-picker-panel/src/composables/use-year-range-header.ts（SHA256 0cf2abbd2173bf47ed104ced43a50e1b104979559b2b836247e5b6d3e3425242）
- packages/components/date-picker-panel/src/constants.ts（SHA256 76f28a3cdf2370d9b9baf78d76499f9b44c866bdd9357431bb423014ae48d047）
- packages/components/date-picker-panel/src/date-picker-com/basic-cell-render.tsx（SHA256 8ddf7bd50e626c6b8ac55e879b7b390ed4e6a7b33d8171c4fe9cdda1facb2376）
- packages/components/date-picker-panel/src/date-picker-com/basic-date-table.vue（SHA256 774af1f6e58607fc52cbbd5f4a38b4639002033e07d414324df4513adf1619fc）
- packages/components/date-picker-panel/src/date-picker-com/basic-month-table.vue（SHA256 fd7fed2ad78ec6b61fea74137f5e1a99f982d6c6cf39894c57516c0e45eba903）
- packages/components/date-picker-panel/src/date-picker-com/basic-quarter-table.vue（SHA256 316e328bf36c65dfe1fcb0f305512eae937173cb939e99e667b5d34b8a536112）
- packages/components/date-picker-panel/src/date-picker-com/basic-year-table.vue（SHA256 94e94ea114a7f127f580e3d38493f7ce71fbbf0f1af3e7bd53439fc484579beb）
- packages/components/date-picker-panel/src/date-picker-com/panel-date-pick.vue（SHA256 47ba90aead5b69e6ef1daa48f5206357fa441c24014150dde9676364d08659cc）
- packages/components/date-picker-panel/src/date-picker-com/panel-date-range.vue（SHA256 099592f469b7ae525e68779aece096ecd048cde71eb7db9f43bdcfb8e8ab98e8）
- packages/components/date-picker-panel/src/date-picker-com/panel-month-range.vue（SHA256 d3adacc949c62c1f70f2a7699b49d125e59421a491af2a744853008024579c62）
- packages/components/date-picker-panel/src/date-picker-com/panel-quarter-range.vue（SHA256 65351d9545a326174c47f1f3778a7a512c531518cb702569bd01e8bfb26e81d5）
- packages/components/date-picker-panel/src/date-picker-com/panel-year-range.vue（SHA256 9db61be448b7e277b77ae733ad8765ed1d13284d709840242995e3b2f7af5624）
- packages/components/date-picker-panel/src/date-picker-panel.tsx（SHA256 35868e5895eacc9f4667e67d1057bd6529157875164e6d18dca0ceae6ea06c69）
- packages/components/date-picker-panel/src/instance.ts（SHA256 f6fc2f5510fe22397377d8de1784462be2ce67b27d7881e6e47c43a0bdecd9e2）
- packages/components/date-picker-panel/src/panel-utils.ts（SHA256 334005ff90a12ed7ca65c90b12691d90afaab6177cacb0f09d2f47c6e87b9e1e）
- packages/components/date-picker-panel/src/props/basic-cell.ts（SHA256 aa31083da25839b8a9faf4e1a77325bb183523eacaef6e67618359e0fac481ef）
- packages/components/date-picker-panel/src/props/basic-date-table.ts（SHA256 0deeb0112121c5fe89d32733f92fb58e78bc6e702b94fe049e33f00588615a46）
- packages/components/date-picker-panel/src/props/basic-month-table.ts（SHA256 353fedec04a86b03a7b54812093fe54fce34a1863e660817dfde12e4769d5148）
- packages/components/date-picker-panel/src/props/basic-quarter-table.ts（SHA256 8f6dbe13e8e2cf21515cd38f6ebc749e58660b9187bfb652db81620ca2a16fd4）
- packages/components/date-picker-panel/src/props/basic-year-table.ts（SHA256 e1e501aeec378c9a40aa96d458e63f0013b91815fe21518598706f004e907ada）
- packages/components/date-picker-panel/src/props/date-picker-panel.ts（SHA256 545999b3a4ba7dc3fdf130c28e8a4f4d5be79dc4b79beb022be41bf316b45664）
- packages/components/date-picker-panel/src/props/panel-date-pick.ts（SHA256 96f2a8f8af41c25a8cc4d3a0d1c34341ad727261361b908c353338c5641fdce2）
- packages/components/date-picker-panel/src/props/panel-date-range.ts（SHA256 220aa023d7ad04fa6082e7088d2927cce61aeda03f2c45bf8a8ece724c692e16）
- packages/components/date-picker-panel/src/props/panel-month-range.ts（SHA256 9d22ab905bfee097531ee7df17cee6dbedb2a5d5483662f30868d75a0beae8cf）
- packages/components/date-picker-panel/src/props/panel-quarter-range.ts（SHA256 48c104ec867ea66d9324341effdeed87a8ea3c3d0b3c5dcb8db06b00fb227289）
- packages/components/date-picker-panel/src/props/panel-year-range.ts（SHA256 ad4521af0ed9ccdbc54dfee0b93f4f12556f2cb5fa75f4f3451962a196e21717）
- packages/components/date-picker-panel/src/props/shared.ts（SHA256 5caa2ba8750b904df7ffa0b08736550d21f2bb216ff5d11715b8bb3f7087ade4）
- packages/components/date-picker-panel/src/types.ts（SHA256 f61f787322fe0f76c225f862a337573fff8bf277498fdc7aac277cd0519a816f）
- packages/components/date-picker-panel/src/utils.ts（SHA256 1390519d1525063be57ccac93ffc90aa2fecd0289429711e5466b1cdd0a48be1）
- packages/components/date-picker-panel/style/css.ts（SHA256 bafa0b0d9b9f2ccb0c7756af5a391419640d40da034ed4ee9ed65af4d9ca81d1）
- packages/components/date-picker-panel/style/index.ts（SHA256 a8a19337c01bf7579fe682692281b091e9773ebdb1afd9085daea2f22102989a）
- packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx（SHA256 a682e35d071917b1d625936d2df341bfa9f4ea6dfd4488660bff4cfe68d8de7b）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- DatePickerPanel — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should have border — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- common disabled actions — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- disabledDate should be reactive — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should correctly select a date when weekStart change — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- dateFormat & timeFormat — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- both picker show correct value — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- click now button — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- time-picker select && input time && input date — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- now button: can not choose disabled date — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- now button: should be disabled when current date is disabled — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- confirm button honors picked date — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- selectableRange — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- defaultTime takes effect when the type is datetime — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- defaultTime only takes effect when time is not selected — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- inherit time across different picker view — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- first click accuracy — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- shows weekNumber — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should handle array value without errors — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should append set dates when model value change on daterange — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should append set dates when model value change on monthrange — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should append set dates when model value change on yearrange — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- select daterange and default Time and input format — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should get the display date in disabled-hours callback — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- input date — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- select time — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- clear button should empty the input value — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- confirm honors disabledDate — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- selectableRange — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- select same date, different time — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- prop defaultTime should not confilt with prop shortcuts — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- shows weekNumber — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should not duplicate panels on update inner input nor change panels — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should not corrupt start date when typing intermediate end date values — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should not duplicate panels after confirm left time input — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should not duplicate panels after confirm right time input — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- should render buttons with correct disabled status when unlinkPanels is true — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- auto-adjusted maxDate should not be a disabled date when input start date — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- auto-adjusted minDate should not be a disabled date when input end date — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx
- auto-adjusted maxDate should converge to minDate when all dates in between are disabled — packages/components/date-picker-panel/__tests__/date-picker-panel.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
