# CarouselItem 源码目录设计

- 来源：packages/components/carousel-item
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：自动播放、间隔、暂停、循环、初始索引；水平/垂直、卡片模式；指示器、箭头和切换触发；CarouselItem；尺寸变化和定时器清理。
- 家族设计：[carousel](../components/carousel.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/carousel-item/style/css.ts（SHA256 38468dc6d47ccbbb842523ed7379d545c7013226040118602828c0f5d4e041fb）
- packages/components/carousel-item/style/index.ts（SHA256 130b594cb57a542c7e6caeba86060b24f6d33d466601be2c2cf74561e5657deb）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- 没有静态提取到测试标题；需要检查家族测试和共享测试。

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
