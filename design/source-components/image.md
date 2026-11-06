# Image 源码目录设计

- 来源：packages/components/image
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：加载/失败/占位；fit、懒加载、滚动容器；预览列表、初始索引、缩放旋转、切换、关闭；ImageViewer 焦点、传送和层级。
- 家族设计：[image](../components/image.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/image/index.ts（SHA256 66755282bd1d8f6420416ab880a965804eb124475460bed288bfb3855cae2442）
- packages/components/image/src/image.ts（SHA256 1a323650f6e1688a11ba1b84446cedf7a92e0b3989d7873011f7e56114bcf03a）
- packages/components/image/src/image.vue（SHA256 a8758bf822f2e27b6b960e4b4e56fecde60253e45a4fbf4b5f56ba4362cde680）
- packages/components/image/style/css.ts（SHA256 d97b990b9dd9071bbf332651403052bacc1493a13d6e89d8a3b1fb1a93879d2c）
- packages/components/image/style/index.ts（SHA256 05e4d9629a64844899e08182bd8886e316f56eb1a9729415f293d27e7d28cf61）
- packages/components/image/__tests__/image.test.tsx（SHA256 3b2ddf38817933ef8269add4d365bad86bd5f3763afdde8d2769285fd4a865ab）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Image.vue — packages/components/image/__tests__/image.test.tsx
- render test — packages/components/image/__tests__/image.test.tsx
- imageStyle fit test — packages/components/image/__tests__/image.test.tsx
- preview classname test — packages/components/image/__tests__/image.test.tsx
- preview initial index test — packages/components/image/__tests__/image.test.tsx
- native loading attributes — packages/components/image/__tests__/image.test.tsx
- $attrs — packages/components/image/__tests__/image.test.tsx
- pass event listeners — packages/components/image/__tests__/image.test.tsx
- image preview close-on-press-escape — packages/components/image/__tests__/image.test.tsx
- manually open preview — packages/components/image/__tests__/image.test.tsx
- lazy image loads when entering viewport — packages/components/image/__tests__/image.test.tsx
- progress slot — packages/components/image/__tests__/image.test.tsx
- custom viewer load failed slot — packages/components/image/__tests__/image.test.tsx
- load — packages/components/image/__tests__/image.test.tsx
- image load success test — packages/components/image/__tests__/image.test.tsx
- image load error test — packages/components/image/__tests__/image.test.tsx
- image load sequence success test — packages/components/image/__tests__/image.test.tsx
- emit load event — packages/components/image/__tests__/image.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
