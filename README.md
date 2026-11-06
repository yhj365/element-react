# Element React

React 19 + TypeScript 组件库，依据固定版本的 Element Plus 实现交互、主题与公开能力。组件、可运行文档、测试及任务追踪均已建立。

**当前仍在移植，尚未完成整个 Element Plus 的功能和视觉等价验收。** 不使用空壳组件补齐数量，不把未实现能力展示为已支持。

## 启动文档

需要Node.js >=20.19，使用npm及锁定依赖。

```powershell
cd D:\code-html\element-react
npm ci
npm test
npm run docs:dev
```

打开终端输出的本地地址，默认 `http://127.0.0.1:3100`。源码或示例更新后须重新运行测试，否则旧报告不能继续生成文档。页面包含组件说明、可操作React示例、源码、已验证API，以及完成记录和来源对照。

## 测试与构建

```powershell
npm run check
npx playwright install chromium
npm run test:browser
npm run format:check
```

`check`执行类型、规范、单元、任务门禁、组件包及文档构建。浏览器截图在 `output/playwright/`，报告在 `reports/` 和 `playwright-report/`。浏览器文档回归通过不等于与Vue来源像素等价。

组件包输出 `dist/`，文档输出 `dist-docs/`。包包含ESM、CommonJS、类型声明及浅深主题CSS；React外部化。`element-react-local`仅为本地包名，未发布npm。

## 任务与核查

- [完整任务清单](./TASKS.md)：所有来源API、场景、示例和目录；完成细项自动勾选。
- [机器可读任务](./progress/tasks.json)：来源、实现、状态和测试证据。
- [验证摘要](./progress/verification.json)：当前指纹、数量和等价验收状态。
- [开发与门禁说明](./CONTRIBUTING.md)
- [生成的组件Markdown文档示例](./docs/content/components/button.md)

实现组件 → 添加运行示例 → 使用apiTest关联来源测试 → 运行 `npm run check`。生成器只将通过当前源码测试、有实现和示例的细项写入使用文档。完整待办保留在任务清单中。禁止手工勾选绕过证据。

单属性验证不代表整组件完全复刻；整组件还要验收原场景、原示例和视觉/行为对照。

## 文档入口

1. [Element Plus项目结构导读](./element-plus项目结构导读.md)
2. [全组件功能设计索引](./design/组件功能设计索引.md)：每个文档主题的功能点、场景与API映射。
3. [React19总体架构与兼容契约](./design/React19总体架构与兼容契约.md)：状态、事件、插槽、ref、SSR、主题和服务设计。
4. [源码目录覆盖](./design/源码目录覆盖.md)：子组件、别名和内部基础设施。
5. [复刻验收与实施路线](./design/复刻验收与实施路线.md)
6. [待审计差异台账](./design/待审计差异台账.md)

机器可读数据：design/api-matrix.json、design/source-manifest.json、design/coverage.json。

reference/element-plus 保存固定来源证据，仅主题SCSS在构建时编译进入样式，不把Vue实现打入React运行时。原MIT版权声明随衍生代码和产物保留，见 [LICENSE](./LICENSE)。

生成脚本 `node scripts/generate-design.cjs` 会读取固定本地路径并重建逐组件文档和快照。它会覆盖自动生成文件；手工裁决写在总体契约或差异台账，正式修改自动文档前应先调整生成器。总体契约、导读和验收路线不由脚本覆盖。后续来源变更须显式更新基线，不能用重新生成代替差异审查。

## 2026-11-06 续开发

- 工具链：Vite 8.3.6、@vitejs/plugin-react 6.2.1、TypeScript 6.0.3。TypeScript 7 超出当前 typescript-eslint 声明的兼容范围，暂不采用。
- 文档示例：TSX 语法高亮、顶部展开/收起、底部收起、复制；浅色与深色分别配色。
- 文档语言：右上角切换简体中文 / English，记忆选择并保留当前路由，传递至 ConfigProvider。旧示例内部业务文案、完整 API 双语释义及功能记录翻译尚未全部补齐。
- 新增 Slider：单值/范围、数值步长/标记吸附、输入框、尺寸、停顿点、竖向、标记、自定义提示与无障碍文本、键盘操作、实时输入与提交事件。8 个示例关联官方 slider 示例路径。
- Slider 仍待：完整 Tooltip placement/persistent/tooltipClass、输入框控制按钮/inputSize、表单校验通知等；全库对齐状态以 TASKS.md 为准。不能将本轮新增主题视作所有组件已完成。
- 机器负载高时可使用 `npm test -- --maxWorkers=2` 降低并发，随后执行 `npm run audit:tasks`、`npm run build`、`npm run docs:build`、`npm run test:browser`。
