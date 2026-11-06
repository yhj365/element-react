目标：完成Element Plus固定基线的完整React19移植。当前整体未完成，不得宣称完全复刻。

已建立：React19工程、组件源码、源SCSS构建、类型声明、测试驱动文档与逐行任务总账。
最新全量门禁：391项单元测试通过，58公开文档主题，1082/2394来源API有测试证据，85运行示例；类型、lint、构建、格式、来源静态核查均通过。
本轮新增：Select、MessageBox、InputOtp、Anchor、InfiniteScroll、Watermark、Transfer、Carousel、AvatarGroup、InputTag、TimeSelect，并修复共享namespace、头像重试、异步卸载和文档路由状态等问题。
已验证：最新4项浏览器回归和ESM/CJS/SSR包产物检查均通过。待办：继续Autocomplete、Menu/Dropdown、Slider/Splitter、Tree系列、Table系列、Cascader、Date/Time/ColorPicker及面板、Upload、Tour、Mention等。所有来源场景与599原示例尚须逐项迁移验证，视觉/行为对照未完成。
具体细项以TASKS.md和progress/tasks.json为准；docs仅收录通过当前指纹测试的接口。
