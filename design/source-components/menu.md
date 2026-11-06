# Menu 源码目录设计

- 来源：packages/components/menu
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：横向/纵向、展开/折叠、唯一展开；MenuItem/SubMenu/MenuItemGroup；激活路径、禁用、路由适配；溢出、弹出层、键盘与选择/打开/关闭事件。
- 家族设计：[menu](../components/menu.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/menu/index.ts（SHA256 a98d49f3e58a19412df837ec97e1674aa069488ee53ab126cad59667828b48d4）
- packages/components/menu/src/instance.ts（SHA256 a7b0d2f5478a338eb8eae87435e47ecb41ae08054c6a817fc65c308211c45acc）
- packages/components/menu/src/menu-collapse-transition.vue（SHA256 f3a89557b2a5674719bbc257d79b47e1c1d8cd799ce1e157ceaccd6654458ec3）
- packages/components/menu/src/menu-item-group.ts（SHA256 1e7ed48123cf663a1768a5639517cbf438216477c5fc517302d5fa4ebec4e671）
- packages/components/menu/src/menu-item-group.vue（SHA256 9316553218fe4df9c63e34f2a648028ba143e4c6477f25033c8bfca519b1cdaf）
- packages/components/menu/src/menu-item.ts（SHA256 d5129a8adb52fb1012aa5153e3a58a492425cd4b36306e6750450cb426917cab）
- packages/components/menu/src/menu-item.vue（SHA256 bba368b88410fb770eb26b119959e572d58b87c2d826c52f4003a4bf0b34af06）
- packages/components/menu/src/menu.ts（SHA256 28bb8e1c57d8c392eb1c0b63065b9473345b4aca63c57e2bcdc3a406808b5626）
- packages/components/menu/src/sub-menu.ts（SHA256 7d20b707dc459f70e0fb9a0c0ac252bbd3b3aa9f0f2cb40a097bc6005ca9227d）
- packages/components/menu/src/tokens.ts（SHA256 6cdeedebc70d386fade8c5e3a10fbfe9550233f72025cb3eaa57696f95d5001e）
- packages/components/menu/src/types.ts（SHA256 7c14344245b5f45705301eeaf42e222e0cc922635141fa9df475072b0a26b46d）
- packages/components/menu/src/use-menu-color.ts（SHA256 b1b23c792e5ff31c0e9d5f761eff5b4b3de437c78919aaf9ed6dfd98f381792b）
- packages/components/menu/src/use-menu-css-var.ts（SHA256 647bd5b18614241f4638dc10aaa425daaeef07ea482252c446362dedecf52cfc）
- packages/components/menu/src/use-menu.ts（SHA256 06c04d01bcd7a1eba8532aa26b50df81be421899c46ac31510d1362f3cd3f7e7）
- packages/components/menu/src/utils/menu-bar.ts（SHA256 ab04f1431cbdbab738435b04730743493f74ed2d14ca6aac144e50de383e0574）
- packages/components/menu/src/utils/menu-item.ts（SHA256 f8efd92b927bf0a105a0fea46cdb35c5b3c012816cee1ebc62e8b1f063aaf237）
- packages/components/menu/src/utils/submenu.ts（SHA256 c9b1b5b8b5d30751d5be7f025f89a13fc11d75fd65af5b4be30342de4fb8ec34）
- packages/components/menu/style/css.ts（SHA256 1b84832348640e4085be1f166fee3524411c1b35aba973573025e20982bb3ecb）
- packages/components/menu/style/index.ts（SHA256 6ed02395943fb96d58dad80ec4f95b4f27a16a8b289a014a1ad6f5c7d3e22830）
- packages/components/menu/__tests__/menu.test.ts（SHA256 0102b21276cc90ff017472ca4de18dc2a215bbf9a9cb6fd11a09ea40e7e50ddf）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- menu — packages/components/menu/__tests__/menu.test.ts
- create — packages/components/menu/__tests__/menu.test.ts
- background-color — packages/components/menu/__tests__/menu.test.ts
- menu-item click — packages/components/menu/__tests__/menu.test.ts
- menu-item disabled — packages/components/menu/__tests__/menu.test.ts
- open method — packages/components/menu/__tests__/menu.test.ts
- hover-bg-color — packages/components/menu/__tests__/menu.test.ts
- menu-overflow — packages/components/menu/__tests__/menu.test.ts
- default active — packages/components/menu/__tests__/menu.test.ts
- normal active — packages/components/menu/__tests__/menu.test.ts
- dynamic active — packages/components/menu/__tests__/menu.test.ts
- vertical submenu item active — packages/components/menu/__tests__/menu.test.ts
- horizontal submenu item active — packages/components/menu/__tests__/menu.test.ts
- submenu — packages/components/menu/__tests__/menu.test.ts
- toggle — packages/components/menu/__tests__/menu.test.ts
- default opened — packages/components/menu/__tests__/menu.test.ts
- disabled — packages/components/menu/__tests__/menu.test.ts
- other — packages/components/menu/__tests__/menu.test.ts
- disabled — packages/components/menu/__tests__/menu.test.ts
- horizontal mode — packages/components/menu/__tests__/menu.test.ts
- menu group — packages/components/menu/__tests__/menu.test.ts
- dynamic menus, issue 9092 — packages/components/menu/__tests__/menu.test.ts
- should not generate nodes from comments, issue 21750 — packages/components/menu/__tests__/menu.test.ts
- should not generate more when width is sufficient, issue 15868 — packages/components/menu/__tests__/menu.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
