# Avatar 源码目录设计

- 来源：packages/components/avatar
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：图像、图标、文字；形状和尺寸、object-fit；加载失败与回退；AvatarGroup 的数量限制、溢出展示和组内布局。
- 家族设计：[avatar](../components/avatar.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/avatar/index.ts（SHA256 b49e84fa73144d23f614e7b11bd9af0a3c7d6c742bf2a18d1704ab827e1e6cbb）
- packages/components/avatar/src/avatar-group-props.ts（SHA256 8e5e1ba7ede25c047618473b61df4b587891bee629cd2bd8094022be12744b17）
- packages/components/avatar/src/avatar-group.tsx（SHA256 dc32d5243c69800db6f8e8673211d4dea706e9b6736bf7d2f55f00d32bd261b1）
- packages/components/avatar/src/avatar.ts（SHA256 aaf74b05847d6c0e70e5d35f4e4dba3cb7058a7ca43a35a35f66e616c7f0006c）
- packages/components/avatar/src/avatar.vue（SHA256 fb253e2f9e8ff0e33e0d7c33ea7e97c1135d246c16e30229fb5d821398a39b91）
- packages/components/avatar/src/constants.ts（SHA256 8295e81894b6f5b6af87d3278e488c8dc82a68924ef4c9e394ec082094f1a226）
- packages/components/avatar/src/instance.ts（SHA256 de603f69889909ffd7b770ad88306737d120e8fcec76e96d80499595d47f5d16）
- packages/components/avatar/style/css.ts（SHA256 fc526d40cc76e3998539257e2509eee8821e389cd76427a24708f1497e337549）
- packages/components/avatar/style/index.ts（SHA256 42de499adab54edfe9ad2fada9f9d84200c59128749f7ea85866a534e4617940）
- packages/components/avatar/__tests__/avatar.test.tsx（SHA256 76705b665f604ee388acae0b6450564838f39f23c734e6cbeea0d843873d16ae）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Avatar.vue — packages/components/avatar/__tests__/avatar.test.tsx
- render test — packages/components/avatar/__tests__/avatar.test.tsx
- size is number — packages/components/avatar/__tests__/avatar.test.tsx
- size is string — packages/components/avatar/__tests__/avatar.test.tsx
- shape — packages/components/avatar/__tests__/avatar.test.tsx
- icon avatar — packages/components/avatar/__tests__/avatar.test.tsx
- image avatar — packages/components/avatar/__tests__/avatar.test.tsx
- image fallback — packages/components/avatar/__tests__/avatar.test.tsx
- image fit — packages/components/avatar/__tests__/avatar.test.tsx
- image source changed — packages/components/avatar/__tests__/avatar.test.tsx
- Avatar Group — packages/components/avatar/__tests__/avatar.test.tsx
- render test — packages/components/avatar/__tests__/avatar.test.tsx
- collapse-class & collapse-style — packages/components/avatar/__tests__/avatar.test.tsx
- collapse-avatars-tooltip — packages/components/avatar/__tests__/avatar.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
