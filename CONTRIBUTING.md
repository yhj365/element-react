# 实现、任务与文档约束

## 事实来源

`design/api-matrix.json` 是固定来源文档的逐表格行清单，不直接代表React类型。`design/source-manifest.json` 记录源码目录、文档标题、示例和哈希。设计草案涉及默认值、优先级和时序时仍须核查真实实现。

`progress/tasks.json` 和 `TASKS.md` 由 `scripts/build-docs.mjs` 生成。未覆盖项保持pending，设计和空壳不计完成。源码和测试变化后旧报告失效。

## 添加可展示API

1. 在packages/components实现组件，保留来源DOM、主题变量、状态和交互；公开Props使用React类型。
2. 在docs/examples添加实际可运行TSX，并登记manifest。该文件也是页面显示和复制的源码。
3. 使用tests/contract.ts的apiTest关联来源组件、章节、属性名称和示例，断言其实际行为。来源ID缺失时测试直接失败。
4. 独立功能点使用featureTest关联；覆盖正常、边界、拒绝、卸载及适用的键盘操作。
5. 在生成器登记实现文件、中文名称及必要的React接口转换。
6. 运行npm run check和适用的浏览器/来源对照。通过证据的细项才进入公开文档。

一个简单用例不能证明复杂属性全部支持范围。部分类型或分支未实现时，应保留待办，不把整个属性标为完成。featureTest不自动勾选来源文档场景或原示例迁移。

## 完成门禁

prepare-test.mjs先移除自己拥有的旧单元报告，再写输入指纹。指纹包含组件、Hooks、测试、示例、文档、脚本、主题、API矩阵和配置。

文档生成器检查报告成功、指纹与当前代码一致、来源ID存在、实现存在、示例属于同一组件。失败则停止生成。使用文档只收录完成项，完整任务清单仍保留未完成范围。

这些证据证明相应断言运行通过，不自动证明断言足够全面。整组件只有在来源API、场景、示例和视觉/行为对照验收后才能判定完整复刻。

## 文件与发布边界

- dist、dist-docs、docs/src/generated、docs/content、TASKS.md和progress由构建生成，修改对应生成源。
- reference保留原貌，不能改参考实现让测试通过；基线更新须记录差异。
- 不写入原element-plus仓库，不使用Vue桥接、iframe或其他组件库换皮替代React实现。
- 本次没有执行Git提交、推送、npm发布或外部部署。
