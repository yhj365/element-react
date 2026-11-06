# Mention 源码目录设计

- 来源：packages/components/mention
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：触发前缀、分隔字符、光标定位；过滤/远程建议、加载；键盘选择、插入文本；自定义选项与标签；输入法和异步结果顺序。
- 家族设计：[mention](../components/mention.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/mention/index.ts（SHA256 ddf11e2090812f9169b1b49e84e14cdcbcca7ebfd3403067a390431cfdebf632）
- packages/components/mention/src/helper.ts（SHA256 0f4f46ec80bcc330d030f735fad2b2cf582ee9772153101d5b2ce3c908c27c2e）
- packages/components/mention/src/mention-dropdown.ts（SHA256 9522e098d3aba62c2b6949da3b2e806d0ef0a7506bc34eaf09909160f14fda9b）
- packages/components/mention/src/mention-dropdown.vue（SHA256 116b990d2fccd0d9a1159c499263e943bdf307220045ce894f9182dbd9ed21bb）
- packages/components/mention/src/mention.ts（SHA256 a1a52953a4fba61cdaf59f6a88500136a22511200305b84369746ceaa1a2e511）
- packages/components/mention/src/mention.vue（SHA256 cdabbffc344a6209fd30e882b31a3fa2c7129db26261f0cd0db8ff9b8e3fa720）
- packages/components/mention/src/types.ts（SHA256 0376e46c9f1ff30132dc46ff6f9a3cd192ac4ee7af871c7b943f55a68bcb7248）
- packages/components/mention/style/css.ts（SHA256 8626793f88e2b76d6f2c1ec6d86feaef479604f392a22af9fe02cbe62931a60b）
- packages/components/mention/style/index.ts（SHA256 e4d975e0a48789e4c7f3ada5783e8e90cd5ba0a4e0d948da5ac80a9fd0a51dd4）
- packages/components/mention/__tests__/mention.test.tsx（SHA256 aa98227b0c1f4ea5d8b472399660b58a87b1e6194719deba2f3e5d2ccbfde4ab）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Mention.vue — packages/components/mention/__tests__/mention.test.tsx
- It should generate accessible attributes — packages/components/mention/__tests__/mention.test.tsx
- should use props of form — packages/components/mention/__tests__/mention.test.tsx
- should ensure the cursor position is correct — packages/components/mention/__tests__/mention.test.tsx
- should select first non-disabled option when pressing enter — packages/components/mention/__tests__/mention.test.tsx
- should not select disabled option when pressing enter — packages/components/mention/__tests__/mention.test.tsx
- should remove whole mention with spaces when pressing backspace — packages/components/mention/__tests__/mention.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
