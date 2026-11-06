总体目标：完成全部Element Plus固定基线组件、官方场景和599原始示例的React迁移，完成双语文档。持续执行，未完成。

最新有效checkpoint（2026-11-06）：68组件主题、176可运行示例、1503/2394已验证API；546项全量单测、5项浏览器测试、typecheck、lint、format、组件库ES/CJS/声明/主题构建和文档生产构建全部通过。文档预览已重新启动于3100；自动浏览器测试独立使用4173。当前源码和发布目录证据一致。

本轮完成的新增组：Slider、Autocomplete、Splitter、Menu/SubMenu/MenuItem/MenuItemGroup、Dropdown系列、Upload、Tree、TreeV2、TreeSelect、SelectV2。重要：这些组的已验证API和官方场景已发布，整体视觉与所有API等价仍未完成，不能视为全库已完成。TSX高亮/折叠/复制和导航语言切换已完成，完整内容翻译仍待补齐。

接下来按顺序：Table/TableV2；Cascader；ColorPicker/ColorPickerPanel；DatePicker/DatePickerPanel/DateTimePicker/TimePicker；Tour；Mention。之后补已有组件欠缺API（Menu ellipsis、原Popper选项适配、Slider余项等）、说明主题border/color/typography/overview、全量599原示例、完整双语和视觉对照。用户明确期望全部完成，不能自行将本轮增量当作最终收尾。
每个组用当前指纹全量单测报告生成公共目录及TASKS.md；定向测试仅用于快速开发，不代替发布证据。Table源API和25官方示例清单已读，TableV2源码清单已开始读。尚未创建Table代码。正在用Playwright CLI复查TreeSelect/虚拟列表浏览器视觉。
