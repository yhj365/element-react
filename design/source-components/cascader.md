# Cascader 源码目录设计

- 来源：packages/components/cascader
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：单选/多选、严格选择、路径值；hover/click 展开；可搜索、懒加载、禁用节点；标签折叠、清空、面包路径；CascaderPanel 和节点渲染。
- 家族设计：[cascader](../components/cascader.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/cascader/index.ts（SHA256 9cda1f019f496d300be103900b2d881f770ce8e0311390dc2f0d30e6d3180979）
- packages/components/cascader/src/cascader.ts（SHA256 2de923d59cc89fa67d607684e1dae1207e3e7907b4fbf3393c5b5d44b2fc8e45）
- packages/components/cascader/src/cascader.vue（SHA256 11864b2388d321fa1d451c037d976ca2c5372ca0cc834a3aacf9a0d7cb69beb2）
- packages/components/cascader/src/instances.ts（SHA256 95e73b75c5d8a71d6c66d2114b20ff00643912f74423c42050b5bc7fe45eebe7）
- packages/components/cascader/style/css.ts（SHA256 2022e6728bd027abf3a04ff93ce226e76ddee5986d61ee710e6968ce8adbdaca）
- packages/components/cascader/style/index.ts（SHA256 556dd1d7a2d32450e700a5d35b8f0cb7ca27bad5968998b8b7859830addb2dad）
- packages/components/cascader/__tests__/cascader.test.tsx（SHA256 61dbfb9a8ff7be9629d6cf3e4c004b4c9229ffaf24b77704068f4dc6bdfbbcbb）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- Cascader.vue — packages/components/cascader/__tests__/cascader.test.tsx
- toggle popper visible — packages/components/cascader/__tests__/cascader.test.tsx
- expand and check — packages/components/cascader/__tests__/cascader.test.tsx
- with default value — packages/components/cascader/__tests__/cascader.test.tsx
- options change — packages/components/cascader/__tests__/cascader.test.tsx
- disabled — packages/components/cascader/__tests__/cascader.test.tsx
- custom placeholder — packages/components/cascader/__tests__/cascader.test.tsx
- custom placeholder with empty string — packages/components/cascader/__tests__/cascader.test.tsx
- clearable — packages/components/cascader/__tests__/cascader.test.tsx
- should support object as value — packages/components/cascader/__tests__/cascader.test.tsx
- should show clear btn on focus — packages/components/cascader/__tests__/cascader.test.tsx
- show last level label — packages/components/cascader/__tests__/cascader.test.tsx
- multiple mode — packages/components/cascader/__tests__/cascader.test.tsx
- collapse tags — packages/components/cascader/__tests__/cascader.test.tsx
- collapse tags tooltip — packages/components/cascader/__tests__/cascader.test.tsx
- dynamic max collapse tags — packages/components/cascader/__tests__/cascader.test.tsx
- max collapse tags — packages/components/cascader/__tests__/cascader.test.tsx
- max collapse tags tooltip height — packages/components/cascader/__tests__/cascader.test.tsx
- tag type — packages/components/cascader/__tests__/cascader.test.tsx
- tag effect — packages/components/cascader/__tests__/cascader.test.tsx
- should expose delete-tag through slot & be able to delete a value — packages/components/cascader/__tests__/cascader.test.tsx
- filterable — packages/components/cascader/__tests__/cascader.test.tsx
- fitInputWidth — packages/components/cascader/__tests__/cascader.test.tsx
- filterable in multiple mode — packages/components/cascader/__tests__/cascader.test.tsx
- before-filter should be called when search keyword is cleared — packages/components/cascader/__tests__/cascader.test.tsx
- filter method — packages/components/cascader/__tests__/cascader.test.tsx
- filterable keyboard selection — packages/components/cascader/__tests__/cascader.test.tsx
- filterable keyboard navigation in virtual scroll mode — packages/components/cascader/__tests__/cascader.test.tsx
- virtual scroll should apply inner width with suggestion-item slot — packages/components/cascader/__tests__/cascader.test.tsx
- teleported API — packages/components/cascader/__tests__/cascader.test.tsx
- should mount on popper container — packages/components/cascader/__tests__/cascader.test.tsx
- should not mount on the popper container — packages/components/cascader/__tests__/cascader.test.tsx
- placeholder disappear when resetForm — packages/components/cascader/__tests__/cascader.test.tsx
- The disabled state of a component has higher priority than that of a form — packages/components/cascader/__tests__/cascader.test.tsx
- should be able to trigger togglePopperVisible outside the component — packages/components/cascader/__tests__/cascader.test.tsx
- height should be changed by size when multiple — packages/components/cascader/__tests__/cascader.test.tsx
- event:focus — packages/components/cascader/__tests__/cascader.test.tsx
- event:blur — packages/components/cascader/__tests__/cascader.test.tsx
- event:focus & blur for clearable — packages/components/cascader/__tests__/cascader.test.tsx
- event:focus & blur for multiple & filterable select — packages/components/cascader/__tests__/cascader.test.tsx
- event:focus & blur for multiple tag close — packages/components/cascader/__tests__/cascader.test.tsx
- should be target blur event when click outside — packages/components/cascader/__tests__/cascader.test.tsx
- render empty slot — packages/components/cascader/__tests__/cascader.test.tsx
- correct render panel empty slot — packages/components/cascader/__tests__/cascader.test.tsx
- correct render menu list empty slot — packages/components/cascader/__tests__/cascader.test.tsx
- render default slot — packages/components/cascader/__tests__/cascader.test.tsx
- should render default slot correctly — packages/components/cascader/__tests__/cascader.test.tsx
- should fallback to option label when it has v-if comment — packages/components/cascader/__tests__/cascader.test.tsx
- should fallback to option label when default has a single comment — packages/components/cascader/__tests__/cascader.test.tsx
- render prefix slot — packages/components/cascader/__tests__/cascader.test.tsx
- correct render prefix slot — packages/components/cascader/__tests__/cascader.test.tsx
- Cascader - tag slot displays top-level labels — packages/components/cascader/__tests__/cascader.test.tsx
- should render tags with only top-level labels — packages/components/cascader/__tests__/cascader.test.tsx
- dynamic options & filterable — packages/components/cascader/__tests__/cascader.test.tsx
- should render dynamic options correctly — packages/components/cascader/__tests__/cascader.test.tsx
- Cascader - click to select node — packages/components/cascader/__tests__/cascader.test.tsx
- selects parent node directly on click — packages/components/cascader/__tests__/cascader.test.tsx
- hides radio but still selects node on click when showPrefix is false — packages/components/cascader/__tests__/cascader.test.tsx
- should select leaf node when checkOnClickLeaf is enabled — packages/components/cascader/__tests__/cascader.test.tsx
- should keep panel active when checkOnClickNode=true with checkStrictly=false — packages/components/cascader/__tests__/cascader.test.tsx
- should fully expand the panel after filter when checkStrictly=true — packages/components/cascader/__tests__/cascader.test.tsx
- should not select the first node when it is a leaf node — packages/components/cascader/__tests__/cascader.test.tsx
- should not reload lazy root nodes while initial load is pending — packages/components/cascader/__tests__/cascader.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
