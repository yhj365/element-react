# Drawer 源码目录设计

- 来源：packages/components/drawer
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：四方向、尺寸、头尾内容；模态、Escape、关闭前回调；销毁策略、焦点、滚动锁、层级；方向对应动画。
- 家族设计：[drawer](../components/drawer.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/drawer/index.ts（SHA256 361a775430efbec91a17c7952da7d54aedc6c18dd2d766685bfc7bf918b0ea56）
- packages/components/drawer/src/composables/useResizable.ts（SHA256 33d63d2b043b43f8901104502c7455c65e0614120c0293b8de35447df8b20b2d）
- packages/components/drawer/src/drawer.ts（SHA256 821a0b1299c607922df8fd75005c9326d22f1fdece680643eb0ca69b0a2c72e8）
- packages/components/drawer/src/drawer.vue（SHA256 2177437190c102611693315e14faf201d2d36867985f34ae566ca9c7d3802b50）
- packages/components/drawer/style/css.ts（SHA256 539401d3fa1772a03e2b1d7d3e83c70ad68d9241c9fbfd78a0a09018f0aef704）
- packages/components/drawer/style/index.ts（SHA256 1fcf02456ec397496ca459ab1e7ef14ec50c48c8df1884e3d9997ae847c126b0）
- packages/components/drawer/__tests__/drawer.test.ts（SHA256 31faba65afe935aabf8811432b95d7e62c9178c5b1503b4b2ec717e3220df211）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Drawer — packages/components/drawer/__tests__/drawer.test.ts
- create — packages/components/drawer/__tests__/drawer.test.ts
- render correct content — packages/components/drawer/__tests__/drawer.test.ts
- should append to body, when append-to-body flag is true — packages/components/drawer/__tests__/drawer.test.ts
- should open and close drawer properly — packages/components/drawer/__tests__/drawer.test.ts
- should destroy every child after drawer was closed when destroy-on-close flag is true — packages/components/drawer/__tests__/drawer.test.ts
- should close dialog by clicking the close button — packages/components/drawer/__tests__/drawer.test.ts
- should invoke before-close — packages/components/drawer/__tests__/drawer.test.ts
- should not show close button when show-close flag is false — packages/components/drawer/__tests__/drawer.test.ts
- drawer header should have slot props — packages/components/drawer/__tests__/drawer.test.ts
- should render header-class, body-class and footer-class if setted — packages/components/drawer/__tests__/drawer.test.ts
- should not render header when withHeader attribute is false — packages/components/drawer/__tests__/drawer.test.ts
- directions — packages/components/drawer/__tests__/drawer.test.ts
- should render from left to right — packages/components/drawer/__tests__/drawer.test.ts
- should render from right to left — packages/components/drawer/__tests__/drawer.test.ts
- should render from top to bottom — packages/components/drawer/__tests__/drawer.test.ts
- should render from bottom to top — packages/components/drawer/__tests__/drawer.test.ts
- events — packages/components/drawer/__tests__/drawer.test.ts
- size — packages/components/drawer/__tests__/drawer.test.ts
- should effect height when drawer is vertical — packages/components/drawer/__tests__/drawer.test.ts
- should effect width when drawer is horizontal — packages/components/drawer/__tests__/drawer.test.ts
- mask related — packages/components/drawer/__tests__/drawer.test.ts
- should not render overlay when modal is false — packages/components/drawer/__tests__/drawer.test.ts
- should not close drawer when mask is penetrable — packages/components/drawer/__tests__/drawer.test.ts
- resizable — packages/components/drawer/__tests__/drawer.test.ts
- should be dragged horizontally — packages/components/drawer/__tests__/drawer.test.ts
- should be dragged vertically — packages/components/drawer/__tests__/drawer.test.ts
- should emit resize-start, resize and resize-end events — packages/components/drawer/__tests__/drawer.test.ts
- accessibility — packages/components/drawer/__tests__/drawer.test.ts
- title attribute should set aria-label — packages/components/drawer/__tests__/drawer.test.ts
- missing title attribute should point to header slot content — packages/components/drawer/__tests__/drawer.test.ts
- aria-describedby should point to modal body — packages/components/drawer/__tests__/drawer.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
