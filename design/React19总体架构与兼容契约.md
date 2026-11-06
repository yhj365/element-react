# React 19 总体架构与兼容契约

## 1. 目标与基线

Element React 面向 React 19 应用开发者，复刻当前本地 Element Plus 的视觉、功能、交互、主题、国际化和公开能力。组件库不承担业务接口、数据库和路由框架实现。

基线日期为 2026-11-05；来源仓库 HEAD 为 `77d5c32c4ebcfffde67e51f6325c6d350ca668a0`。实际参考内容为生成时的本地工作树，文档和源码 SHA256 见 source-manifest.json，不宣称该提交是官方最新版本。未来更新来源必须记录差异，禁止静默跟随 latest。

“完美复刻”作为目标分解为四项：功能无遗漏、可观察行为等价、视觉等价、React生态正确。Vue专有语法不按字面复刻，迁移后应维持使用者能实现的结果。源码中的错误不自动成为产品规范；发现文档、测试、实现矛盾时登记并复现，不擅自省略功能或承诺完全兼容。

当前阶段只交付设计、追踪矩阵及参考快照，不创建可运行的组件实现。所有表格命名转换是拟定接口，尤其复杂回调类型仍须在具体组件实现前审计。

## 2. 建议目录结构

```text
element-react/
├─ packages/
│  ├─ components/        每组件src、style、测试、故事和类型
│  ├─ hooks/             React状态/生命周期与交互复用
│  ├─ utils/             无框架工具、DOM和类型工具
│  ├─ constants/         公共约定
│  ├─ locale/            语言资源及类型
│  ├─ theme-chalk/       来源SCSS、变量、暗色和主题构建
│  ├─ icons/             React SVG适配，保留名称和图形
│  ├─ test-utils/        受控驱动、事件轨迹、对照工具
│  └─ element-react/     公共导出、服务、类型、样式入口
├─ docs/                React使用文档、API、迁移说明
├─ play/                本地源码调试
├─ internal/            构建、元数据、检查
├─ tests/               SSR、浏览器、视觉、包消费验证
├─ design/              本次交付设计
└─ reference/           来源证据，不参与发布
```

运行时组件采用 TypeScript + React19 函数组件。样式保留SCSS/CSS变量体系，不为了技术偏好改写成另一套视觉系统。组合组件采用Context及显式注册，表格/树/虚拟化采用局部订阅的数据模型，避免一次高频更新重渲染整棵树。

包名称暂为本地设计名 `element-react`，发布前才核实 npm 名称可用性，不假定它可用。设计期不安装依赖、不发布包。构建工具优先验证来源Rolldown路线能否满足React导出和声明需求，再固定配置；此处不锁定未经验证的版本号。

## 3. React API 转换规则

| Vue概念 | React设计 | 不变约束 |
|---|---|---|
| kebab-case Props | camelCase | 原含义、范围、默认值和空值语义 |
| modelValue/update:modelValue | value/defaultValue/onValueChange | 不与源change事件混淆 |
| visible/activeName等具名模型 | 保留visible/activeName，增加defaultXxx和onXxxChange | 多模型独立；与已有同名语义事件冲突时逐项裁决 |
| current-page/page-size | 两套独立受控值与更新回调 | 页码调整、总数变化、事件顺序 |
| emits change、visible-change等 | onChange、onVisibleChange等 | 原业务参数和触发时机；类型冲突不得默默合并 |
| 默认插槽 | children | 原渲染位置和条件 |
| 具名静态插槽 | renderHeader等，接受ReactNode | 属性/内容优先级 |
| 作用域插槽 | renderCell等类型化函数 | 原作用域参数语义 |
| expose | ref handle/useImperativeHandle | 方法、返回值、Promise、只读状态 |
| provide/inject | Context/领域store | 嵌套覆盖、默认和隔离 |
| Teleport | createPortal | DOM位置、上下文、焦点与事件 |
| directive | 组件/Hook/服务适配 | loading/infinite-scroll/popover等原能力 |
| transition | 显式presence状态机与CSS过渡 | 开始/结束事件、销毁时机、快速反向切换 |
| app.use | 模块导入和Provider | 不保留虚假的React插件安装API |
| router-link/router对象 | as/tag及导航适配回调 | 不硬依赖Vue Router或特定React路由器 |
| Vue图标组件/VNode | React SVG组件/ReactNode | 图形、视框、尺寸和配色 |

`type`、`size`、`onChange`、`onSelect`、`onInput` 等可能与原生HTML类型冲突。组件Props必须通过Omit显式声明冲突字段；保留源语义如Button的type与nativeType；不能把业务value回调偷换成DOM事件。原生事件可按原API的事件暴露，额外原生透传入口需有命名和文档，不能临时创造多套行为。

Slots统一使用renderXxx避免同名内容属性和渲染器冲突，但最终每组件需核对优先级。例如Button原loading slot优先于loadingIcon；不得把ReactNode真假值判断误当“是否提供插槽”，数字0和空字符串要正确处理。

## 4. 受控与非受控状态

1. 以属性是否提供判定受控，不以truthy判定；0、false、空字符串和合法null不当缺省。
2. 受控组件展示由父级Props决定，用户操作只产生请求更新回调；父级拒绝更新时保持旧显示。
3. 非受控defaultXxx仅初始化一次；后续defaultXxx变化不重置用户输入。reset行为由表单契约单独定义。
4. 值更新通知与“用户提交/change”分离。拖动Slider、输入文本、键盘预览和确认的差异按来源保留。
5. 不在render或同步Props的Effect中回调用户；避免StrictMode重复通知。触发顺序由组件事件轨迹测试锁定。
6. 异步beforeChange/beforeClose/remote/lazyLoad/validator以递增请求标识或AbortSignal隔离过期结果；卸载后不提交状态，拒绝和异常要有恢复路径。
7. 不统一所有组件清空为空字符串；使用源空值策略和ConfigProvider emptyValues/valueOnClear。
8. 受控/非受控切换开发时告警，不偷偷改变状态所有权；数组、对象值不就地修改父级数据。

## 5. React19生命周期和SSR

- React19允许函数组件接收ref属性；实例方法用useImperativeHandle。引用合并必须支持回调ref清理。依据：[React19](https://react.dev/blog/2024/12/05/react-19)、[useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)。
- render保持纯函数，不注册全局监听、不创建服务实例、不测量DOM。挂载后完成测量，卸载释放observer、timer、raf、listener、request和浮层。
- StrictMode开发阶段额外执行渲染、Effect和ref检查，所有注册/注销幂等且成对，不能关闭StrictMode来掩盖问题。依据：[StrictMode](https://react.dev/reference/react/StrictMode)。
- SSR导入不访问window/document；服务端与首屏客户端HTML保持一致。useId用于可访问性关联，不作为数据列表key；多根prefix在宿主中配置。依据：[useId](https://react.dev/reference/react/useId)。
- Portal遵循React树的Context和事件冒泡，不能照搬仅检查DOM父链的点击外部算法；嵌套浮层使用统一栈与composedPath。依据：[createPortal](https://react.dev/reference/react-dom/createPortal)。
- 外部store用useSyncExternalStore提供稳定不可变snapshot，SSR提供一致getServerSnapshot；不在每次调用时新建等价对象。依据：[useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)。
- 交互组件在RSC宿主中属于客户端边界，只有需要的模块标记use client，主题CSS与纯工具分离；不承诺组件本身可作为异步Server Component运行。
- 不强行把每个输入动作改为React Actions；普通事件、异步校验和受控值保持确定性。

## 6. 基础设施

| 基础能力 | 设计责任 |
|---|---|
| Namespace/BEM | 保留el-*、is-*和--el-*；可配置时SCSS同步 |
| ConfigProvider | locale、size、namespace、zIndex、组件配置和空值策略；嵌套合并规则逐属性保留 |
| LayerManager | 模态/非模态栈、Escape仅顶层、按实例分配层级、关闭时释放 |
| FocusScope | 初始焦点、Tab循环、自动焦点取消、关闭后还原、触发器已卸载回退 |
| ScrollLock | 引用计数、多弹窗、滚动条补偿、滚动位置恢复，最后实例关闭才解锁 |
| Floating | 位置、偏移、箭头、flip/shift、容器裁剪、跟随滚动resize和虚拟参考元素 |
| Presence | entering/entered/leaving/exited；动画结束和取消；destroyOnClose与persistent分开 |
| Collection/RovingFocus | 有序注册、稳定标识、跳过禁用、Home/End、方向与循环 |
| Virtualizer | 固定/动态尺寸、缓存失效、滚动锚、overscan、滚动到项、焦点保活 |
| FormStore | 字段注册/注销、路径读写、错误/校验、初始值缓存、局部订阅与并发校验 |
| DateEngine | 日期/时间/周/范围模型、展示与绑定格式、locale、禁用规则和DST边界 |
| AsyncCoordinator | 搜索/懒加载/上传/校验的取消、过期结果、错误与重试 |
| ServiceHost | Message/Notification/MessageBox/Loading宿主、上下文捕获、容器和卸载 |
| Resize/Scroll | 去重监听、raf调度、observer断开和无DOM环境兜底 |

浮层底层引擎优先保持来源依赖与配置，以结果等价验证是否可复用；不同时引入另一套默认行为替代全部定位策略。

## 7. 服务与指令迁移

- ConfigProvider内提供App/ServiceProvider宿主与useMessage/useNotification/useMessageBox/useLoading，服务继承当前locale、namespace、zIndex和主题。
- 如保留静态message()/notification()兼容入口，它只使用显式配置的独立宿主，不假装能自动读取任意React树Context。提供绑定服务实例的接口。
- Message/Notification返回更新、关闭等源实例能力；MessageBox的Promise action/cancel/close和校验状态保持来源差异。
- v-loading → Loading包装/Hook/显式服务；区域、全屏、锁定和实例关闭语义一致。
- v-infinite-scroll → useInfiniteScroll或InfiniteScroll包装，保留阈值、禁用、节流和immediate。
- v-popover → Popover reference/renderReference/虚拟reference适配，不依赖Vue指令生命周期。

## 8. 视觉、主题、国际化和可访问性

默认保持来源视觉，避免换皮。迁移SCSS保留原MIT声明；React DOM结构应满足原选择器和动画需要。默认类名仍使用el，产品包名用element-react，两者不要求相同。Vue与React同页对照时使用隔离容器/iframe，避免样式串扰。

基础Token包括主题语义色及色阶、文字/背景/边框、字号/行高/字重、圆角/阴影、间距、尺寸和动画。基础文档color/border/typography属于范围，不能因没有运行时组件而漏掉。暗色模式保持来源dark变量及切换策略。

locale保留全部来源语言键及插值语义；React移植不得直接依赖Vue locale Hook。Dayjs插件、语言包、周起始日、时区与格式在基线环境固定。日期值类型与字符串格式转换需逐组件核对。

语义HTML、role、aria关联、键盘和焦点与来源共同验证。禁止仅以视觉模拟checkbox/switch等。若修正来源可访问性缺陷造成差异，应在台账列出理由、行为和测试，不能宣称像素/行为完全一致却隐去差异。

## 9. 工程与发布设计

- react/react-dom为peerDependencies且外部化；精确支持的19.x范围由实际最低版本验证后写入，不使用未经测试的上限承诺。
- 具备ESM、声明、全量/按需CSS和SCSS入口；是否同时发布CJS需包消费矩阵验证，保留来源多格式能力作为目标。
- sideEffects仅标记样式等必要模块；导入Button不能初始化全局服务或加载全量组件。
- 复杂组件泛型、联合类型、ref handle、render props必须通过真实消费项目验证。
- Story/文档示例与Vue来源逐项对应；构建产物、source snapshot和design不混入正式运行时发布。
- 原MIT许可、版权和衍生说明随包保留；来源图标另行核对许可证后复用React表示，不导入icons-vue。

## 10. 当前设计不能替代的工作

全量API表提取解决“范围可追踪”，没有完成所有watch分支、事件顺序、像素截图和动态测试审计。各组件进入实现前必须补齐来源实现与测试对应的状态机、完整React类型签名和具体验收数据。所有未核实项见待审计差异台账，验收通过之前不得标为完美复刻。
