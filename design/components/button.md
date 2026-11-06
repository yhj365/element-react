# Button 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/button.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 语义色、尺寸、plain/text/link/bg/round/circle/dashed。
- 禁用、loading 与自定义图标。
- 原生 submit/reset。
- 自定义标签/颜色。
- 双汉字间距。
- ButtonGroup 方向及继承。

## 2. 源文档场景清单

- [ ] Basic usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Disabled Button（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] Link Button（原文第28行）：建立React示例与对应行为/视觉断言。
- [ ] Text Button（原文第44行）：建立React示例与对应行为/视觉断言。
- [ ] Icon Button（原文第64行）：建立React示例与对应行为/视觉断言。
- [ ] Button Group（原文第74行）：建立React示例与对应行为/视觉断言。
- [ ] Loading Button（原文第86行）：建立React示例与对应行为/视觉断言。
- [ ] Sizes（原文第106行）：建立React示例与对应行为/视觉断言。
- [ ] Tag ^(2.3.4)（原文第116行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Color ^(beta)（原文第126行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

状态由实际disabled、loading、type和size共同派生。原生button状态同步到disabled和aria；自定义tag仍须由处理器阻止无效点击。loading插槽优先于loadingIcon；reset调用Form重置后发出click。按钮组和全局配置按原use-button规则逐项计算，不用统一浅合并替代。

## 3. React 19 结构与交互契约

- 主导出拟为 Button，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Button Attributes | prop | size | size | 146 |
| Button Attributes | prop | type | type | 147 |
| Button Attributes | prop | plain | plain | 148 |
| Button Attributes | prop | text | text | 149 |
| Button Attributes | prop | bg | bg | 150 |
| Button Attributes | prop | link | link | 151 |
| Button Attributes | prop | round | round | 152 |
| Button Attributes | prop | circle | circle | 153 |
| Button Attributes | prop | dashed | dashed | 154 |
| Button Attributes | prop | loading | loading | 155 |
| Button Attributes | prop | loading-icon | loadingIcon | 156 |
| Button Attributes | prop | disabled | disabled | 157 |
| Button Attributes | prop | icon | icon | 158 |
| Button Attributes | prop | autofocus | autofocus | 159 |
| Button Attributes | prop | native-type | nativeType | 160 |
| Button Attributes | prop | auto-insert-space | autoInsertSpace | 161 |
| Button Attributes | prop | color | color | 162 |
| Button Attributes | prop | dark | dark | 163 |
| Button Attributes | prop | tag | tag | 164 |
| Button Slots | slot | default | children | 170 |
| Button Slots | slot | loading | renderLoading | 171 |
| Button Slots | slot | icon | renderIcon | 172 |
| Button Exposes | ref | ref | ref.current.ref | 178 |
| Button Exposes | ref | size | ref.current.size | 179 |
| Button Exposes | ref | type | ref.current.type | 180 |
| Button Exposes | ref | disabled | ref.current.disabled | 181 |
| Button Exposes | ref | shouldAddSpace | ref.current.shouldAddSpace | 182 |
| ButtonGroup Attributes | prop | size | size | 190 |
| ButtonGroup Attributes | prop | type | type | 191 |
| ButtonGroup Attributes | prop | direction | direction | 192 |
| ButtonGroup Slots | slot | default | children | 198 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| button:146 | Button Attributes | size | button size | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:147 | Button Attributes | type | button type, when setting `color`, the latter prevails | ^[enum]`'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| '' \| 'text' (deprecated)` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:148 | Button Attributes | plain | determine whether it's a plain button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:149 | Button Attributes | text | determine whether it's a text button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:150 | Button Attributes | bg | determine whether the text button background color is always on | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:151 | Button Attributes | link | determine whether it's a link button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:152 | Button Attributes | round | determine whether it's a round button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:153 | Button Attributes | circle | determine whether it's a circle button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:154 | Button Attributes | dashed | determine whether it's a dashed button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:155 | Button Attributes | loading | determine whether it's loading | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:156 | Button Attributes | loading-icon | customize loading icon component | ^[string] / ^[Component] | Loading | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:157 | Button Attributes | disabled | disable the button | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:158 | Button Attributes | icon | icon component | ^[string] / ^[Component] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:159 | Button Attributes | autofocus | same as native button's `autofocus` | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:160 | Button Attributes | native-type | same as native button's `type` | ^[enum]`'button' \| 'submit' \| 'reset'` | button | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:161 | Button Attributes | auto-insert-space | automatically insert a space between two chinese characters(this will only take effect when the text length is 2 and all characters are in Chinese.) | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:162 | Button Attributes | color | custom button color, automatically calculate `hover` and `active` color. Works with `link`/`text` buttons since ^(2.13.7) | ^[string] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:163 | Button Attributes | dark | dark mode, which automatically converts `color` to dark mode colors | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:164 | Button Attributes | tag | custom element tag | ^[string] / ^[Component] | button | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:170 | Button Slots | default | customize default content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| button:171 | Button Slots | loading | customize loading component | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| button:172 | Button Slots | icon | customize icon component | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| button:178 | Button Exposes | ref | button html element | ^[object]`Ref<HTMLButtonElement>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| button:179 | Button Exposes | size | button size | ^[object]`ComputedRef<'' \| 'small' \| 'default' \| 'large'>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| button:180 | Button Exposes | type | button type | ^[object]`ComputedRef<'' \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'text'>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| button:181 | Button Exposes | disabled | button disabled | ^[object]`ComputedRef<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| button:182 | Button Exposes | shouldAddSpace | whether adding space | ^[object]`ComputedRef<boolean>` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| button:190 | ButtonGroup Attributes | size | control the size of buttons in this button-group | ^[enum]`'large' \| 'default' \| 'small'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:191 | ButtonGroup Attributes | type | control the type of buttons in this button-group | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:192 | ButtonGroup Attributes | direction | display direction | ^[enum]`'horizontal' \| 'vertical'` | horizontal | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| button:198 | ButtonGroup Slots | default | customize button group content | — | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |

## 5. 源码、样式和示例追踪

- [packages/components/button](../../reference/element-plus/packages/components/button/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- [packages/components/button-group](../source-components/button-group.md)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/button/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/disabled.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/link.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/text.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/icon.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/group.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/loading.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/size.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/tag.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/button/custom.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
