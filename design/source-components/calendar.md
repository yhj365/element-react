# Calendar 源码目录设计

- 来源：packages/components/calendar
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：月历与日期值；日期范围；自定义日期单元格和头部；上一月/下一月/今天切换；日期选择事件和实例导航。
- 家族设计：[calendar](../components/calendar.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/calendar/index.ts（SHA256 0b813ea4af53f5307748b9f878455738ee957046e86ef5434ab27a3f1b0ca2b7）
- packages/components/calendar/src/calendar.ts（SHA256 4d3bcd69ed88401b6dc7c5023b62fc0b2e12fdb06cea96c211b118b18c9d28f8）
- packages/components/calendar/src/calendar.vue（SHA256 76f3675fa0a9c07dff9c93cd85bd8bee632944e1477b58b8ee951d8a5ebc564f）
- packages/components/calendar/src/date-table.ts（SHA256 e895535081dd50d705bf54af8acda3e476ab419edcaeb04873b3c035d8fb0447）
- packages/components/calendar/src/date-table.vue（SHA256 947ccaafdc60bc3957851f314f992c352c3dd9686cd86e7e196a974d831ff971）
- packages/components/calendar/src/instance.ts（SHA256 23b921f9807e0537023752ee420317e838cae025a8a43b7bf5e3d66d174b0ec7）
- packages/components/calendar/src/select-controller.ts（SHA256 c1cc8c2cb2a8615f5891458290ef64fba0b3c4c94639e92ed4f9c2a48d9f739e）
- packages/components/calendar/src/select-controller.vue（SHA256 35a2c07d4c243b5725a475ebbb0fd6694bd99ff36723ce2f8e77c27bf7dcc116）
- packages/components/calendar/src/use-calendar.ts（SHA256 a526d70a86299fa4a2b47de051925de1247bc6e6dfab0654d65c4d3e600e476a）
- packages/components/calendar/src/use-date-table.ts（SHA256 2b409dabe3b3c551608752f4c33d54173871253293bb249849d3e2e93e67b8d1）
- packages/components/calendar/style/css.ts（SHA256 85ed2c2a97442c1fbb9a33d3478dd02a5340b7269189572b2f5699838f911cae）
- packages/components/calendar/style/index.ts（SHA256 b8856c860ebbe7f432c52c3ddd1bad7d09303fa1432fc53c71dbba7774177f49）
- packages/components/calendar/__tests__/calendar.test.tsx（SHA256 ad9e9ec82d66112ce5acebd91ad65bae0330cf74ed14f0b7364d82011e03eaa9）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Calendar.vue — packages/components/calendar/__tests__/calendar.test.tsx
- create — packages/components/calendar/__tests__/calendar.test.tsx
- range — packages/components/calendar/__tests__/calendar.test.tsx
- range when the start date will be calculated to last month — packages/components/calendar/__tests__/calendar.test.tsx
- range tow monthes — packages/components/calendar/__tests__/calendar.test.tsx
- falls back to normal calendar when range crosses years by more than two months — packages/components/calendar/__tests__/calendar.test.tsx
- range tow monthes when the start date will be calculated to last month — packages/components/calendar/__tests__/calendar.test.tsx
- firstDayOfWeek — packages/components/calendar/__tests__/calendar.test.tsx
- firstDayOfWeek when set 1 — packages/components/calendar/__tests__/calendar.test.tsx
- firstDayOfWeek in range mode — packages/components/calendar/__tests__/calendar.test.tsx
- click previous month or next month — packages/components/calendar/__tests__/calendar.test.tsx
- range two years — packages/components/calendar/__tests__/calendar.test.tsx
- range two years — packages/components/calendar/__tests__/calendar.test.tsx
- slots — packages/components/calendar/__tests__/calendar.test.tsx
- should work when controller-type is select — packages/components/calendar/__tests__/calendar.test.tsx
- should work with formatter prop — packages/components/calendar/__tests__/calendar.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
