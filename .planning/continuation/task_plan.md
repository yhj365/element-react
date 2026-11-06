总体目标：全部Element Plus固定基线组件、官方场景及599原始示例迁移为React，并完成双语文档。仍在执行，不能宣称全部完成。

已完成并验证：工具链Vite8.3.6/React插件6.2.1/TS6.0.3；TSX高亮、两处收起、复制；中英文文档导航及语言记忆（全文翻译未完成）；Slider、Autocomplete、Splitter、Menu家族、Dropdown家族、Upload。
当前验证范围：64组件主题、128可运行示例、1286/2394来源API；467项全量单测通过；生产库已构建。文档Sass样式同名模块冲突已修复，正在重跑测试及文档构建。浏览器上一checkpoint 5项测试通过，使用独立4173端口。

接下来：Tree/TreeV2/TreeSelect共享模型与交互；Table/TableV2；Cascader；Date/Time/ColorPicker及面板；Tour；Mention；SelectV2；剩余已有组件未实现API（如Menu水平ellipsis、原Popper参数适配、Slider剩余接口）。说明主题border/color/typography/overview单独补文档。所有组件完成后仍需599示例逐项对齐、完整双语与视觉行为对照，不用粗略覆盖率代替验收。
每轮以当前源码指纹的全量单测报告生成公共目录及TASKS.md，定向测试可快速排错但不能代替发布证据。
