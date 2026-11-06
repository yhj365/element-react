# Carousel 源码目录设计

- 来源：packages/components/carousel
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：自动播放、间隔、暂停、循环、初始索引；水平/垂直、卡片模式；指示器、箭头和切换触发；CarouselItem；尺寸变化和定时器清理。
- 家族设计：[carousel](../components/carousel.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/carousel/index.ts（SHA256 bc0d0e47fbc94d04ca24d1cda0f9461cbc970532a883e3ced3865ca189aa1199）
- packages/components/carousel/src/carousel-item.ts（SHA256 7a04087944130501c0dcc9778934af8a7dec7e2b3d60515f748d7748f36264c6）
- packages/components/carousel/src/carousel-item.vue（SHA256 2914824b57f43a595bcdccae4183b9605f2d9e6dc4d57fdb78e29ff224dfc182）
- packages/components/carousel/src/carousel.ts（SHA256 244f1945abe461f116338a67530ee7cf43d925268e8d29d0a22887b301be84b0）
- packages/components/carousel/src/carousel.vue（SHA256 d85dea683b2f29755df1abb2c260fd044bef89ca0a82dd39e18dd6b2720a96bd）
- packages/components/carousel/src/constants.ts（SHA256 56f122b65c6c3ef95dbd8c820ec3a0620cab15b5eaea9ff6a7e5616abd3d84ab）
- packages/components/carousel/src/instance.ts（SHA256 a8eee5fda378efc88907d9c09c83c0efd6f636e7c7c3148963b702ca6282e4f0）
- packages/components/carousel/src/use-carousel-item.ts（SHA256 74ddaf659c3ce8a5b685752089418e5aba34610e189bf7a696ba896b329daa5e）
- packages/components/carousel/src/use-carousel.ts（SHA256 a965e0249802423d10517e8e4d7509384dc8561503183c04ed9ee6ff45ad7892）
- packages/components/carousel/style/css.ts（SHA256 011d939632761376fbed5cf8b7e6709cb585d067a192f11a4413cb5b21f9d1be）
- packages/components/carousel/style/index.ts（SHA256 9cb4be4c31ad7924ab573f2d908c8c307b3791d1380589f2ab7c083a28784aab）
- packages/components/carousel/__tests__/carousel.test.tsx（SHA256 095bbcb8bcbf0ad364041fb1c060ae27972717ed5964db02ab9467da57d54a51）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Carousel — packages/components/carousel/__tests__/carousel.test.tsx
- create — packages/components/carousel/__tests__/carousel.test.tsx
- auto play — packages/components/carousel/__tests__/carousel.test.tsx
- initial index — packages/components/carousel/__tests__/carousel.test.tsx
- reset timer — packages/components/carousel/__tests__/carousel.test.tsx
- change — packages/components/carousel/__tests__/carousel.test.tsx
- label — packages/components/carousel/__tests__/carousel.test.tsx
- manual control — packages/components/carousel/__tests__/carousel.test.tsx
- hover — packages/components/carousel/__tests__/carousel.test.tsx
- card — packages/components/carousel/__tests__/carousel.test.tsx
- vertical direction — packages/components/carousel/__tests__/carousel.test.tsx
- pause auto play on hover — packages/components/carousel/__tests__/carousel.test.tsx
- motion blur — packages/components/carousel/__tests__/carousel.test.tsx
- should guarantee order of indicators — packages/components/carousel/__tests__/carousel.test.tsx
- height is set to auto — packages/components/carousel/__tests__/carousel.test.tsx
- set to automatic when item is of different height — packages/components/carousel/__tests__/carousel.test.tsx
- exposes — packages/components/carousel/__tests__/carousel.test.tsx
- two item, activeIndex is not a supplementary item — packages/components/carousel/__tests__/carousel.test.tsx
- should continue auto play after adding new items dynamically — packages/components/carousel/__tests__/carousel.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
