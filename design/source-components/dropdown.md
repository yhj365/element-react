# Dropdown 源码目录设计

- 来源：packages/components/dropdown
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：hover/click/contextmenu 等源触发；延迟、定位、拆分按钮；DropdownMenu/DropdownItem 命令、禁用、分隔；键盘游走和命令回调。
- 家族设计：[dropdown](../components/dropdown.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/dropdown/index.ts（SHA256 50724302393a0ef19b362a7fa67d748d88ca2bed0e9547b91b995fba8263d707）
- packages/components/dropdown/src/dropdown-item-impl.vue（SHA256 8169adf5ed16facca7ce1c1c52774f554c1e880aa4d3a77226ee42fb3983c325）
- packages/components/dropdown/src/dropdown-item.vue（SHA256 9b30893eb06c787b2450e6330f2baef7c4323d754b3b71cd7aceaf1eab52e893）
- packages/components/dropdown/src/dropdown-menu.vue（SHA256 1f7ef3cb522652b316f544a72d2adecd41489e6f6e9054f4b7eebdda0a26b2f5）
- packages/components/dropdown/src/dropdown.ts（SHA256 b67781f761ee1cb65b05d3c0b1a0898eb2405e32e8888108a0e9fc92457cd5a7）
- packages/components/dropdown/src/dropdown.vue（SHA256 30a831a528f384cf38747d90a747467adf8ebaacd0452bafe8670df001e767ee）
- packages/components/dropdown/src/instance.ts（SHA256 5e395738556ce3b327ff1b9df388b96a00e7cadac51aff181763683d582349e2）
- packages/components/dropdown/src/tokens.ts（SHA256 29fecbb7f3da1ce94c1caaec13a51d0b9ceca3bff8856cc85455266108152a20）
- packages/components/dropdown/src/useDropdown.ts（SHA256 ed29ef3311b692abcbcf02f17bba5195a52c568209522665f018c4c7c9f7846c）
- packages/components/dropdown/style/css.ts（SHA256 9c80f98cfe184e40e86696b7b198f2eaa46ecf5c585b6578e579b4ec78455e74）
- packages/components/dropdown/style/index.ts（SHA256 3522b68108374b33a3190c0a842d04a3de9a667a69ed5286edbc345c884b63f2）
- packages/components/dropdown/__tests__/dropdown.test.ts（SHA256 5eca51bde29f0eaea98408071c42e4cb9c76290ffa74284b86e1675c2da86508）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Dropdown — packages/components/dropdown/__tests__/dropdown.test.ts
- create — packages/components/dropdown/__tests__/dropdown.test.ts
- menu click — packages/components/dropdown/__tests__/dropdown.test.ts
- trigger — packages/components/dropdown/__tests__/dropdown.test.ts
- trigger contextmenu — packages/components/dropdown/__tests__/dropdown.test.ts
- virtual ref — packages/components/dropdown/__tests__/dropdown.test.ts
- handleOpen and handleClose — packages/components/dropdown/__tests__/dropdown.test.ts
- split button — packages/components/dropdown/__tests__/dropdown.test.ts
- hide on click — packages/components/dropdown/__tests__/dropdown.test.ts
- triggerElm keydown — packages/components/dropdown/__tests__/dropdown.test.ts
- max height — packages/components/dropdown/__tests__/dropdown.test.ts
- tooltip debounce — packages/components/dropdown/__tests__/dropdown.test.ts
- popperClass — packages/components/dropdown/__tests__/dropdown.test.ts
- custom attributes for dropdown items — packages/components/dropdown/__tests__/dropdown.test.ts
- disable normal dropdown — packages/components/dropdown/__tests__/dropdown.test.ts
- disable dropdown with split button — packages/components/dropdown/__tests__/dropdown.test.ts
- set show-timeout/hide-timeout when trigger is hover — packages/components/dropdown/__tests__/dropdown.test.ts
- ignore show-timeout/hide-timeout when trigger is not hover — packages/components/dropdown/__tests__/dropdown.test.ts
- accessibility — packages/components/dropdown/__tests__/dropdown.test.ts
- Custom span trigger has proper attributes — packages/components/dropdown/__tests__/dropdown.test.ts
- ElButton trigger has proper attributes — packages/components/dropdown/__tests__/dropdown.test.ts
- Split button trigger has proper attributes — packages/components/dropdown/__tests__/dropdown.test.ts
- Trigger dropdown via hover — packages/components/dropdown/__tests__/dropdown.test.ts
- Trigger dropdown via click — packages/components/dropdown/__tests__/dropdown.test.ts
- Trigger dropdown via focus — packages/components/dropdown/__tests__/dropdown.test.ts
- teleported API — packages/components/dropdown/__tests__/dropdown.test.ts
- should mount on popper container — packages/components/dropdown/__tests__/dropdown.test.ts
- should not mount on the popper container — packages/components/dropdown/__tests__/dropdown.test.ts
- should mount the dropdown popper under append-to — packages/components/dropdown/__tests__/dropdown.test.ts
- hover trigger: click dropdown-item should close immediately — packages/components/dropdown/__tests__/dropdown.test.ts
- render icon slot content — packages/components/dropdown/__tests__/dropdown.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
