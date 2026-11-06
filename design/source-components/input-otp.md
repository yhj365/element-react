# InputOtp 源码目录设计

- 来源：packages/components/input-otp
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：长度、密码模式、分隔符和尺寸；自动前进、退格、方向键、粘贴与输入过滤；完整输入通知、受控值和禁用状态。
- 家族设计：[input-otp](../components/input-otp.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/input-otp/index.ts（SHA256 198bb4ff15f630abf2f6a2a4c4f57da487494e38d9ad4bc48f49cee11c4eed61）
- packages/components/input-otp/src/input-otp.ts（SHA256 72879f4f23d9b1f855013a979081ef56429a26bbd31fdf67204a72b645398567）
- packages/components/input-otp/src/input-otp.vue（SHA256 290898fb59303ff08fa25957ec0a33e2edb94502e0c534af7c1814f2ccdf5d06）
- packages/components/input-otp/src/instance.ts（SHA256 92ed7bcaaf1f63cca53f4e7667aeb07ecd330b0cdd37fe031facff4f147fa4ad）
- packages/components/input-otp/style/css.ts（SHA256 aad3872efbb1717869a5d45eb1d5a452d81b864f495a4d4df6f86800245b23b3）
- packages/components/input-otp/style/index.ts（SHA256 16d461b7dc3bd51f0206602ca373de1543eb134a28b23f695fd5c9e54944a62b）
- packages/components/input-otp/__tests__/input-otp.test.tsx（SHA256 d6dccdf70dceef3baae441e3ec3b9e88a1060ad38f05ce23c964608462007be6）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- InputOtp.vue — packages/components/input-otp/__tests__/input-otp.test.tsx
- render with default props — packages/components/input-otp/__tests__/input-otp.test.tsx
- render with custom length — packages/components/input-otp/__tests__/input-otp.test.tsx
- should update when length changes — packages/components/input-otp/__tests__/input-otp.test.tsx
- type — packages/components/input-otp/__tests__/input-otp.test.tsx
- mask — packages/components/input-otp/__tests__/input-otp.test.tsx
- render with custom size — packages/components/input-otp/__tests__/input-otp.test.tsx
- should work with disabled prop — packages/components/input-otp/__tests__/input-otp.test.tsx
- should work with readonly prop — packages/components/input-otp/__tests__/input-otp.test.tsx
- v-model initial value — packages/components/input-otp/__tests__/input-otp.test.tsx
- v-model update — packages/components/input-otp/__tests__/input-otp.test.tsx
- validator — packages/components/input-otp/__tests__/input-otp.test.tsx
- navigation with arrow keys — packages/components/input-otp/__tests__/input-otp.test.tsx
- handle backspace — packages/components/input-otp/__tests__/input-otp.test.tsx
- handle delete — packages/components/input-otp/__tests__/input-otp.test.tsx
- should auto focus next input — packages/components/input-otp/__tests__/input-otp.test.tsx
- should fill from the first empty index — packages/components/input-otp/__tests__/input-otp.test.tsx
- should ensure contiguous filling — packages/components/input-otp/__tests__/input-otp.test.tsx
- event — packages/components/input-otp/__tests__/input-otp.test.tsx
- should emit change event — packages/components/input-otp/__tests__/input-otp.test.tsx
- should emit focus and blur event — packages/components/input-otp/__tests__/input-otp.test.tsx
- should emit finish event — packages/components/input-otp/__tests__/input-otp.test.tsx
- paste — packages/components/input-otp/__tests__/input-otp.test.tsx
- should support pasting content — packages/components/input-otp/__tests__/input-otp.test.tsx
- should ignore non-digits when type is number on paste — packages/components/input-otp/__tests__/input-otp.test.tsx
- should fill from the first empty index and focus next empty index on paste — packages/components/input-otp/__tests__/input-otp.test.tsx
- should overwrite from current index if current input has value — packages/components/input-otp/__tests__/input-otp.test.tsx
- should apply validator when distributing multi-character input — packages/components/input-otp/__tests__/input-otp.test.tsx
- should avoid innerValue mismatch with the input value after pasting when the character does not change — packages/components/input-otp/__tests__/input-otp.test.tsx
- separator — packages/components/input-otp/__tests__/input-otp.test.tsx
- render with separator prop — packages/components/input-otp/__tests__/input-otp.test.tsx
- render with separator function — packages/components/input-otp/__tests__/input-otp.test.tsx
- render with separator slot — packages/components/input-otp/__tests__/input-otp.test.tsx
- exposed methods — packages/components/input-otp/__tests__/input-otp.test.tsx
- focus — packages/components/input-otp/__tests__/input-otp.test.tsx
- blur — packages/components/input-otp/__tests__/input-otp.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
