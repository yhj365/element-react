# Image 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/image.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 加载/失败/占位。
- fit、懒加载、滚动容器。
- 预览列表、初始索引、缩放旋转、切换、关闭。
- ImageViewer 焦点、传送和层级。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Placeholder（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Load Failed（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Lazy Load（原文第34行）：建立React示例与对应行为/视觉断言。
- [ ] Image Preview（原文第50行）：建立React示例与对应行为/视觉断言。
- [ ] Manually Open Preview ^(2.9.4)（原文第58行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Toolbar ^(2.9.4)（原文第66行）：建立React示例与对应行为/视觉断言。
- [ ] Custom progress ^(2.9.4)（原文第74行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。

## 3. React 19 结构与交互契约

- 主导出拟为 Image，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Image Attributes | prop | src | src | 88 |
| Image Attributes | prop | fit | fit | 89 |
| Image Attributes | prop | hide-on-click-modal | hideOnClickModal | 90 |
| Image Attributes | prop | loading | loading | 91 |
| Image Attributes | prop | lazy | lazy | 92 |
| Image Attributes | prop | scroll-container | scrollContainer | 93 |
| Image Attributes | prop | alt | alt | 94 |
| Image Attributes | prop | referrerpolicy | referrerpolicy | 95 |
| Image Attributes | prop | crossorigin | crossorigin | 96 |
| Image Attributes | prop | preview-src-list | previewSrcList | 97 |
| Image Attributes | prop | z-index | zIndex | 98 |
| Image Attributes | prop | initial-index | initialIndex | 99 |
| Image Attributes | prop | close-on-press-escape | closeOnPressEscape | 100 |
| Image Attributes | prop | preview-teleported | previewTeleported | 101 |
| Image Attributes | prop | infinite | infinite | 102 |
| Image Attributes | prop | zoom-rate | zoomRate | 103 |
| Image Attributes | prop | scale | scale | 104 |
| Image Attributes | prop | min-scale | minScale | 105 |
| Image Attributes | prop | max-scale | maxScale | 106 |
| Image Attributes | prop | show-progress | showProgress | 107 |
| Image Events | event | load | onLoad | 113 |
| Image Events | event | error | onError | 114 |
| Image Events | event | switch | onSwitch | 115 |
| Image Events | event | close | onClose | 116 |
| Image Events | event | show | onShow | 117 |
| Image Slots | slot | placeholder | renderPlaceholder | 123 |
| Image Slots | slot | error | renderError | 124 |
| Image Slots | slot | viewer | renderViewer | 125 |
| Image Slots | slot | [image viewer slots](#image-viewer-slots) | render[image viewer slots](#imageViewerSlots) | 126 |
| Image Exposes | ref | showPreview | ref.current.showPreview | 132 |
| Image Viewer Attributes | prop | url-list | urlList | 140 |
| Image Viewer Attributes | prop | z-index | zIndex | 141 |
| Image Viewer Attributes | prop | initial-index | initialIndex | 142 |
| Image Viewer Attributes | prop | infinite | infinite | 143 |
| Image Viewer Attributes | prop | hide-on-click-modal | hideOnClickModal | 144 |
| Image Viewer Attributes | prop | teleported | teleported | 145 |
| Image Viewer Attributes | prop | zoom-rate | zoomRate | 146 |
| Image Viewer Attributes | prop | scale | scale | 147 |
| Image Viewer Attributes | prop | min-scale | minScale | 148 |
| Image Viewer Attributes | prop | max-scale | maxScale | 149 |
| Image Viewer Attributes | prop | close-on-press-escape | closeOnPressEscape | 150 |
| Image Viewer Attributes | prop | show-progress | showProgress | 151 |
| Image Viewer Events | event | close | onClose | 157 |
| Image Viewer Events | event | error | onError | 158 |
| Image Viewer Events | event | switch | onSwitch | 159 |
| Image Viewer Events | event | rotate | onRotate | 160 |
| Image Viewer Slots | slot | default | children | 166 |
| Image Viewer Slots | slot | progress | renderProgress | 167 |
| Image Viewer Slots | slot | toolbar | renderToolbar | 168 |
| Image Viewer Slots | slot | viewer-error | renderViewerError | 169 |
| Image Viewer Exposes | ref | setActiveItem | ref.current.setActiveItem | 175 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| image:88 | Image Attributes | src | image source, same as native. | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:89 | Image Attributes | fit | indicate how the image should be resized to fit its container, same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit). | ^[enum]`'' \| 'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:90 | Image Attributes | hide-on-click-modal | when enabling preview, use this flag to control whether clicking on backdrop can exit preview mode. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:91 | Image Attributes | loading | Indicates how the browser should load the image, same as [native](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading). | ^[enum]`'eager' \| 'lazy'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:92 | Image Attributes | lazy | whether to use lazy load. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:93 | Image Attributes | scroll-container | the container to add scroll listener when using lazy load. By default, the container to add scroll listener when using lazy load. | ^[string] / ^[object]`HTMLElement` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:94 | Image Attributes | alt | native attribute `alt`. | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:95 | Image Attributes | referrerpolicy | native attribute [referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy). | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:96 | Image Attributes | crossorigin | native attribute [crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). | ^[enum]`'' \| 'anonymous' \| 'use-credentials'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:97 | Image Attributes | preview-src-list | allow big image preview. | ^[array]`string[]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:98 | Image Attributes | z-index | set image preview z-index. | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:99 | Image Attributes | initial-index | initial preview image index, less than the length of `url-list`. | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:100 | Image Attributes | close-on-press-escape | whether the image-viewer can be closed by pressing ESC. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:101 | Image Attributes | preview-teleported | whether to append image-viewer to body. A nested parent element attribute transform should have this attribute set to `true`. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:102 | Image Attributes | infinite | whether the viewer preview is infinite. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:103 | Image Attributes | zoom-rate | the zoom rate of the image viewer zoom event. | ^[number] | 1.2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:104 | Image Attributes | scale | the preview image scale. | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:105 | Image Attributes | min-scale | the min scale of the image viewer zoom event. | ^[number] | 0.2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:106 | Image Attributes | max-scale | the max scale of the image viewer zoom event. | ^[number] | 7 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:107 | Image Attributes | show-progress | whether to display the preview image progress content. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:113 | Image Events | load | same as native load. | ^[Function]`(e: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:114 | Image Events | error | same as native error. | ^[Function]`(e: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:115 | Image Events | switch | trigger when switching images. | ^[Function]`(index: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:116 | Image Events | close | trigger when clicking on close button or when `hide-on-click-modal` enabled clicking on backdrop. | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:117 | Image Events | show | trigger when the viewer displays | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:123 | Image Slots | placeholder | custom placeholder content when image hasn't loaded yet. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:124 | Image Slots | error | custom image load failed content. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:125 | Image Slots | viewer | custom content when image preview. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:126 | Image Slots | [image viewer slots](#image-viewer-slots) | when you allow big image preview, image viewer slots all can be used, except `default`. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:132 | Image Exposes | showPreview | manually open preview big image | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| image:140 | Image Viewer Attributes | url-list | preview link list. | ^[array]`string[]` | [] | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:141 | Image Viewer Attributes | z-index | preview backdrop z-index. | ^[number] / ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:142 | Image Viewer Attributes | initial-index | the initial preview image index, less than or equal to the length of `url-list`. | ^[number] | 0 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:143 | Image Viewer Attributes | infinite | whether preview is infinite. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:144 | Image Viewer Attributes | hide-on-click-modal | whether user can emit close event when clicking backdrop. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:145 | Image Viewer Attributes | teleported | whether to append image itself to body. A nested parent element attribute transform should have this attribute set to `true`. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:146 | Image Viewer Attributes | zoom-rate | the zoom rate of the image viewer zoom event. | ^[number] | 1.2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:147 | Image Viewer Attributes | scale | the preview image scale. | ^[number] | 1 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:148 | Image Viewer Attributes | min-scale | the min scale of the image viewer zoom event. | ^[number] | 0.2 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:149 | Image Viewer Attributes | max-scale | the max scale of the image viewer zoom event. | ^[number] | 7 | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:150 | Image Viewer Attributes | close-on-press-escape | whether the image-viewer can be closed by pressing ESC. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:151 | Image Viewer Attributes | show-progress | whether to display the preview image progress content | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| image:157 | Image Viewer Events | close | trigger when clicking on close button or when `hide-on-click-modal` enabled clicking on backdrop. | ^[Function]`() => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:158 | Image Viewer Events | error | same as native error. | ^[Function]`(e: Event) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:159 | Image Viewer Events | switch | trigger when switching images. | ^[Function]`(index: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:160 | Image Viewer Events | rotate | trigger when rotating images. | ^[Function]`(deg: number) => void` | — | 回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。 |
| image:166 | Image Viewer Slots | default | custom content | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:167 | Image Viewer Slots | progress | custom progress content (Priority is higher than `show-progress` prop) | ^[object]`{ activeIndex: number, total: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:168 | Image Viewer Slots | toolbar | custom toolbar content | ^[object]`{ actions: (action: ImageViewerAction, options?: ImageViewerActionOptions) => void, prev: () => void, next: () => void, reset: () => void, activeIndex: number, setActiveItem: (index: number) => void }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:169 | Image Viewer Slots | viewer-error | custom image load failed content. | ^[object]`{ activeIndex: number, src: string }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| image:175 | Image Viewer Exposes | setActiveItem | manually switch image | ^[Function]`(index: number) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/image](../../reference/element-plus/packages/components/image/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/image-viewer](../../reference/element-plus/packages/components/image-viewer/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/image/basic-usage.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/placeholder.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/load-failed.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/lazy-load.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/image-preview.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/manually-preview.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/custom-toolbar.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/image/custom-progress.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
