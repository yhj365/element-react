开始工程化实施，保持来源快照和设计，不修改原element-plus仓库。
依赖安装成功；首次typecheck发现类型约束问题已修复处理中。Vitest3依赖存在严重公告，升级至4.1.12修复，其他依赖审计后续核对。
阶段1工程/门禁已完成；阶段2首批基础/输入/导航实现，尚未覆盖全库；阶段3可运行文档和逐行核查已完成；阶段4单元144项/SSR/typecheck/lint/build/docsbuild通过，真实浏览器验证处理中。源对照修复Link类名、Space间距、Skeleton leading/trailing，Empty插图迁移原路径。
最新状态：现有144测试基础上扩展至172项，171通过，唯一失败是modal.test透明色CSS规范化（expected transparent, actual rgba(0,0,0,0)），需修正断言后重跑。Modal/Forms/extra导航测试文件均已生成；extra新测试尚未运行。typecheck当前通过。README/CONTRIBUTING已更新。新增Form已接Input的FieldValidationContext；Form label-width(auto)、status-icon、scroll等仍待完善，不标记对应API。
2026-11-06续作：Select/MessageBox/InputOtp/Anchor新增55项定向测试通过；Watermark/InfiniteScroll新增13项通过；Transfer14项通过。新增7主题，API任务证据和示例已接入生成器。整体仍未全部完成，正在执行全量门禁和浏览器验证。
最新全量391项单元测试通过；58公开主题、1082/2394来源API、85运行示例。格式和源设计静态核查通过；完整门禁正在完成最后文档构建，随后重跑最新浏览器和包产物检查。全部复刻尚未完成，未完成任务没有勾选。
收尾确认：npm run check、npm run format:check、node scripts/verify-design.cjs、npx playwright test全部通过；391单元+4浏览器；npm pack --dry-run通过，包91项ESM/CJS导出及SSR冒烟通过。最新截图已生成。未进行全部原场景/599示例及Vue像素等价验收，原项目pnpm-lock.yaml既有变更保持未动。

截图复查：修正docs通用focus-visible侵入示例输入的问题；新增浏览器CSS断言，轮播截图等待最终位移。修正后391项单元/类型/lint/构建/格式再次通过，包91项ESM/CJS导出与SSR通过；正在完成最后4项浏览器回归。

最终浏览器4/4通过；截图复查焦点与轮播稳定态正确。最终证据汇总reports/validation-summary.json，当前指纹与包验证一致。完整复刻任务仍未完成。
