基线：58文档主题、85示例、1082/2394 API，391单测。无Git元数据。源码已支持展开但无高亮。
工具链：Vite 8.3.6、React插件6.2.1、TS6.0.3；TS7超出当前typescript-eslint的peer范围。原Vite manualChunks对象需迁移至Rolldown codeSplitting。Slider新增8官方场景，但placement示例及若干API仍未实现。
公开目录使用显式DocCatalog接口，避免生成JSON差异字段造成大联合类型推导。Slider需在runway节点设置is-disabled，已按来源主题修正。
缺失主题按基线目录：autocomplete、cascader、color-picker(-panel)、date-picker(-panel)/datetime-picker、dropdown、mention、menu、select-v2、splitter、table(-v2)、time-picker、tour、tree(-select/-v2)、upload。border/color/typography/overview为说明主题需补文档，不应伪造组件。599原示例尚未全迁移。
源码真实待办保留：Menu水平ellipsis尚未实现，Dropdown/Autocomplete的原Popper特定options未适配。Upload目前目录选择支持native webkitdirectory；拖拽目录递归与完整accept过滤尚需补验收。全库完成和599官方示例对齐仍未完成，禁止声称已全完成。

Tree 系列实现设计（下一阶段）：共享类型、归一化节点模型、勾选状态、树渲染。节点键与数据字段可配置；父子引用、层级、叶节点、懒加载状态明确。选择支持级联/严格、禁用、半选、默认选中和命令式方法。展开支持默认全部/指定、自动祖先、手风琴。异步加载以请求token防止重复、过期和卸载回写；失败可retry。过滤保留匹配节点祖先。普通Tree递归DOM，TreeV2仅挂载可视扁平窗口。TreeSelect复用同一模型与现有Select/Tooltip。需覆盖键盘、ARIA、拖放限制、防止将父节点拖入自己的后代，以及append/remove/insert/updateKeyChildren不可变数据操作。不要将原始节点数或prop数量当作完成证据。
