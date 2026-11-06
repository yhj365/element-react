# Avatar 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/avatar.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 图像、图标、文字。
- 形状和尺寸、object-fit。
- 加载失败与回退。
- AvatarGroup 的数量限制、溢出展示和组内布局。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Types（原文第20行）：建立React示例与对应行为/视觉断言。
- [ ] Fallback（原文第30行）：建立React示例与对应行为/视觉断言。
- [ ] Fit Container（原文第40行）：建立React示例与对应行为/视觉断言。
- [ ] Avatar Group ^(2.13.1)（原文第50行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Avatar，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
- 属性采用camelCase；modelValue映射value/defaultValue/onValueChange；源change映射onChange并保留原语义。涉及visible、checked、active等状态时，按照源API单独建受控通道，不强行改名为open。
- 静态内容使用ReactNode；默认区域children；具名区域renderXxx；带参数的区域使用类型化render函数。原函数不得接收或返回Vue VNode。
- ref作为React19属性；仅暴露来源已公开的实例能力，底层DOM与组件handle区分；state不可通过修改ref绕过受控模型。
- 事件由用户交互或明确实例调用触发；父级回写Props不得重复触发change。IME、disabled、readonly、loading只在来源支持时适用；不得凭通用模板扩展未有API。
- 外观复用源SCSS、变量、状态类、尺寸和动画基线；默认保留el命名空间以降低样式偏差，自定义namespace同步编译主题，禁止直接换为其他库外观。
- 所有时序、优先级、异步取消与事件顺序以源实现/测试确认；未审计项登记，不用推测填成已兼容。

## 4. 逐项 API 对照

下表覆盖源文档所有表格行，包括复合子组件；section列区分所属API。原类型/参数/默认值完整保存在来源快照及api-matrix.json，不把机械命名转换视为最终TypeScript签名。特别是布尔双向绑定、Date/Dayjs、DOM事件、VNode回调、路由和Promise均需逐项完成类型审计。

| 来源章节 | 类别 | 来源名称 | React拟定接口 | 来源行 |
|---|---|---|---|---|
| Avatar Attributes | prop | icon | icon | 66 |
| Avatar Attributes | prop | size | size | 67 |
| Avatar Attributes | prop | shape | shape | 68 |
| Avatar Attributes | prop | src | src | 69 |
| Avatar Attributes | prop | src-set | srcSet | 70 |
| Avatar Attributes | prop | alt | alt | 71 |
| Avatar Attributes | prop | fit | fit | 72 |
| Avatar Events | event | error | onError | 78 |
| Avatar Slots | slot | default | children | 84 |
| AvatarGroup Attributes | prop | size | size | 92 |
| AvatarGroup Attributes | prop | shape | shape | 93 |
| AvatarGroup Attributes | prop | collapse-avatars | collapseAvatars | 94 |
| AvatarGroup Attributes | prop | collapse-avatars-tooltip | collapseAvatarsTooltip | 95 |
| AvatarGroup Attributes | prop | max-collapse-avatars | maxCollapseAvatars | 96 |
| AvatarGroup Attributes | prop | effect | effect | 97 |
| AvatarGroup Attributes | prop | placement | placement | 98 |
| AvatarGroup Attributes | prop | popper-class | popperClass | 99 |
| AvatarGroup Attributes | prop | popper-style | popperStyle | 100 |
| AvatarGroup Attributes | prop | collapse-class | collapseClass | 101 |
| AvatarGroup Attributes | prop | collapse-style | collapseStyle | 102 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| avatar:66 | Avatar Attributes | icon | representation type to icon, more info on icon component. | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:67 | Avatar Attributes | size | avatar size. | ^[number] / ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:68 | Avatar Attributes | shape | avatar shape. | ^[enum]`'circle' \| 'square'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:69 | Avatar Attributes | src | the source of the image for an image avatar. | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:70 | Avatar Attributes | src-set | native attribute `srcset` of image avatar. | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:71 | Avatar Attributes | alt | native attribute `alt` of image avatar. | `string` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:72 | Avatar Attributes | fit | set how the image fit its container for an image avatar. | ^[enum]`'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | cover | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:78 | Avatar Events | error | trigger when image load error. | ^[Function]`(e: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| avatar:84 | Avatar Slots | default | customize avatar content. | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| avatar:92 | AvatarGroup Attributes | size | control the size of avatars in this avatar-group | ^[number] / ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:93 | AvatarGroup Attributes | shape | control the shape of avatars in this avatar-group | ^[enum]`'circle' \| 'square'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:94 | AvatarGroup Attributes | collapse-avatars | whether to collapse avatars | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:95 | AvatarGroup Attributes | collapse-avatars-tooltip | whether show all collapsed avatars when mouse hover text of the collapse-avatar. To use this, `collapse-avatars` must be true | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:96 | AvatarGroup Attributes | max-collapse-avatars | the max avatars number to be shown. To use this, `collapse-avatars` must be true | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:97 | AvatarGroup Attributes | effect | tooltip theme, built-in theme: `dark` / `light` | ^[enum]`'dark' \| 'light'` / ^[string] | light | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:98 | AvatarGroup Attributes | placement | placement of tooltip | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | top | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:99 | AvatarGroup Attributes | popper-class | custom class name for tooltip | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:100 | AvatarGroup Attributes | popper-style | custom style for tooltip | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:101 | AvatarGroup Attributes | collapse-class | custom class name for the collapse-avatar | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| avatar:102 | AvatarGroup Attributes | collapse-style | custom style for the collapse-avatar | ^[string] / ^[object] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |

## 5. 源码、样式和示例追踪

- [packages/components/avatar](../../reference/element-plus/packages/components/avatar/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/avatar-group](../source-components/avatar-group.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/avatar/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/avatar/types.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/avatar/fallback.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/avatar/fit.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/avatar/group.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
