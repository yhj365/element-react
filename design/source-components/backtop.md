# Backtop 源码目录设计

- 来源：packages/components/backtop
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：指定滚动容器；显隐阈值；平滑回顶；位置和自定义内容；滚动监听释放。
- 家族设计：[backtop](../components/backtop.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/backtop/index.ts（SHA256 c583c4f0f0ca79010876128e92dcc1b042a2599e5c477d905d2bee08d33154e0）
- packages/components/backtop/src/backtop.ts（SHA256 1480667df76acf1a2125c3bb05623ff191ec09d8b81fb328a8ec5849cbdadcfe）
- packages/components/backtop/src/backtop.vue（SHA256 95f7f1f5927d7af5c1cefaf621da27d10bcfcc2f50be749a59d0e326c5c1079f）
- packages/components/backtop/src/instance.ts（SHA256 c1aafccb60c9701bd01a07064f234e285ccd3d843729628482f6d68a733bfce6）
- packages/components/backtop/src/use-backtop.ts（SHA256 773896a2060cece56a9a87a84368359147cc640cac6325275207164113e5f2b4）
- packages/components/backtop/style/css.ts（SHA256 c7b59fdaa9a9ace88d8f86803fa0b6151cad6ac94d374801a96f44646c2e63d7）
- packages/components/backtop/style/index.ts（SHA256 c68a207eaba461ceae093e1ea5f8311cb6de22228db9560d13a90bfdd5f0f80d）
- packages/components/backtop/__tests__/backtop.test.tsx（SHA256 e37dfddaa38b0f09eafd10a51fb31145107ad67836efd58561844e70a98afee1）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Backtop.vue — packages/components/backtop/__tests__/backtop.test.tsx
- render — packages/components/backtop/__tests__/backtop.test.tsx
- render when visibilityHeight is zero — packages/components/backtop/__tests__/backtop.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
