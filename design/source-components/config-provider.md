# ConfigProvider 源码目录设计

- 来源：packages/components/config-provider
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：语言、尺寸、namespace、zIndex；键盘和无障碍开关；空值/清空值策略；Button/Card/Dialog/Link/Message/Table 默认配置；嵌套与服务上下文。
- 家族设计：[config-provider](../components/config-provider.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/config-provider/index.ts（SHA256 a15291f7042990c0deef7ba852ba832846e688e0098c28d93f2f639ecee3df50）
- packages/components/config-provider/src/config-provider-props.ts（SHA256 9829519b9251f55e7a394a47c204e678c0b43a17d34f5844048b7a7f532cae01）
- packages/components/config-provider/src/config-provider.ts（SHA256 7e3e28f959aa6982e692c9a64797cd48ee4a2c60ea0517c48ed77e68b5351349）
- packages/components/config-provider/src/constants.ts（SHA256 e961e79fb38c7e2b7700c459b6c57509dd8091cdd81ef84be49f8efe6b2d7d1f）
- packages/components/config-provider/src/hooks/use-global-config.ts（SHA256 537d2bbe1a4019858ccc40588862f86757b9f6f7306064bfe7f8e109d855754f）
- packages/components/config-provider/style/css.ts（SHA256 9371d07a2f0b5e3f55bfde7a6e5adea50e5b1078f6df77f319c4d88523ee0049）
- packages/components/config-provider/style/index.ts（SHA256 a4057d6900b05dfefed9fe689caa6f81288767cbf5c9e41aee717ee64b2b850d）
- packages/components/config-provider/__tests__/config-loading.test.tsx（SHA256 397f0e60744f7af68f470e31dadb476932b29a1ad98052b2967e8c727544572f）
- packages/components/config-provider/__tests__/config-provider.test.tsx（SHA256 f64544b13ba64f637cc8717558b970f21394b5cc61c3af530d98bad35c2e4294）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- loading config — packages/components/config-provider/__tests__/config-loading.test.tsx
- should render loading component — packages/components/config-provider/__tests__/config-loading.test.tsx
- config-provider — packages/components/config-provider/__tests__/config-provider.test.tsx
- locale-provider — packages/components/config-provider/__tests__/config-provider.test.tsx
- should provide locale properly — packages/components/config-provider/__tests__/config-provider.test.tsx
- should reactively update the text on page — packages/components/config-provider/__tests__/config-provider.test.tsx
- button-config — packages/components/config-provider/__tests__/config-provider.test.tsx
- autoInsertSpace — packages/components/config-provider/__tests__/config-provider.test.tsx
- fully configured — packages/components/config-provider/__tests__/config-provider.test.tsx
- card-config — packages/components/config-provider/__tests__/config-provider.test.tsx
- link-config — packages/components/config-provider/__tests__/config-provider.test.tsx
- dialog-config — packages/components/config-provider/__tests__/config-provider.test.tsx
- should align overlay dialog center — packages/components/config-provider/__tests__/config-provider.test.tsx
- should enable draggable — packages/components/config-provider/__tests__/config-provider.test.tsx
- should use transition from global config (hooks merged and called) — packages/components/config-provider/__tests__/config-provider.test.tsx
- namespace-config — packages/components/config-provider/__tests__/config-provider.test.tsx
- reactive namespace — packages/components/config-provider/__tests__/config-provider.test.tsx
- message-config — packages/components/config-provider/__tests__/config-provider.test.tsx
- limit the number of messages displayed at the same time — packages/components/config-provider/__tests__/config-provider.test.tsx
- new config parameters effective — packages/components/config-provider/__tests__/config-provider.test.tsx
- provide global config — packages/components/config-provider/__tests__/config-provider.test.tsx
- multiple config-provider config override — packages/components/config-provider/__tests__/config-provider.test.tsx
- feature checking — packages/components/config-provider/__tests__/config-provider.test.tsx
- global component configs — packages/components/config-provider/__tests__/config-provider.test.tsx
- should use global configured settings — packages/components/config-provider/__tests__/config-provider.test.tsx
- should respect zero as global configured zIndex — packages/components/config-provider/__tests__/config-provider.test.tsx
- should fall back to default zIndex for NaN global configuration — packages/components/config-provider/__tests__/config-provider.test.tsx
- dynamically modify global size configuration — packages/components/config-provider/__tests__/config-provider.test.tsx
- use-namespace — packages/components/config-provider/__tests__/config-provider.test.tsx
- should provide bem correctly — packages/components/config-provider/__tests__/config-provider.test.tsx
- use-locale — packages/components/config-provider/__tests__/config-provider.test.tsx
- should provide locale correctly — packages/components/config-provider/__tests__/config-provider.test.tsx
- should update the text reactively — packages/components/config-provider/__tests__/config-provider.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
