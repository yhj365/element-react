# Upload 功能设计

> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD 77d5c32c4ebcfffde67e51f6325c6d350ca668a0；本页原文、API默认值与原始类型见[来源快照](../../reference/element-plus/docs/upload.md)。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。

## 1. 目标与功能点

- 文件选择/拖放、accept、多选和数量限制。
- 文件列表与卡片/图片。
- 自动/手动提交、beforeUpload/beforeRemove。
- 进度成功失败、取消重试、自定义请求、凭据/headers/data。
- 预览删除和实例方法。

## 2. 源文档场景清单

- [ ] Basic Usage（原文第10行）：建立React示例与对应行为/视觉断言。
- [ ] Cover Previous File（原文第18行）：建立React示例与对应行为/视觉断言。
- [ ] User Avatar（原文第26行）：建立React示例与对应行为/视觉断言。
- [ ] Photo Wall（原文第36行）：建立React示例与对应行为/视觉断言。
- [ ] Custom Thumbnail（原文第46行）：建立React示例与对应行为/视觉断言。
- [ ] File List with Thumbnail（原文第56行）：建立React示例与对应行为/视觉断言。
- [ ] File List Control（原文第64行）：建立React示例与对应行为/视觉断言。
- [ ] Drag to Upload（原文第74行）：建立React示例与对应行为/视觉断言。
- [ ] Upload Directory ^(2.13.1)（原文第84行）：建立React示例与对应行为/视觉断言。
- [ ] Manual Upload（原文第94行）：建立React示例与对应行为/视觉断言。

## 2.1 状态和实现方案

每文件有稳定uid和ready/uploading/success/fail等来源状态；校验、排队、上传、取消、删除分开。自定义请求返回能力按原契约支持abort；上传进度回写不可改父级受控fileList。beforeRemove拒绝恢复原列表；卸载取消网络和预览objectURL。

## 3. React 19 结构与交互契约

- 主导出拟为 Upload，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。
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
| Attributes | prop | action | action | 108 |
| Attributes | prop | headers | headers | 109 |
| Attributes | prop | method | method | 110 |
| Attributes | prop | multiple | multiple | 111 |
| Attributes | prop | data | data | 112 |
| Attributes | prop | name | name | 113 |
| Attributes | prop | with-credentials | withCredentials | 114 |
| Attributes | prop | show-file-list | showFileList | 115 |
| Attributes | prop | drag | drag | 116 |
| Attributes | prop | accept | accept | 117 |
| Attributes | prop | crossorigin | crossorigin | 118 |
| Attributes | prop | on-preview | onPreview | 119 |
| Attributes | prop | on-remove | onRemove | 120 |
| Attributes | prop | on-success | onSuccess | 121 |
| Attributes | prop | on-error | onError | 122 |
| Attributes | prop | on-progress | onProgress | 123 |
| Attributes | prop | on-change | onChange | 124 |
| Attributes | prop | on-exceed | onExceed | 125 |
| Attributes | prop | before-upload | beforeUpload | 126 |
| Attributes | prop | before-remove | beforeRemove | 127 |
| Attributes | prop | file-list / v-model:file-list | fileList / defaultFileList / onFileListChange | 128 |
| Attributes | prop | list-type | listType | 129 |
| Attributes | prop | auto-upload | autoUpload | 130 |
| Attributes | prop | http-request | httpRequest | 131 |
| Attributes | prop | disabled | disabled | 132 |
| Attributes | prop | limit | limit | 133 |
| Attributes | prop | directory | directory | 134 |
| Slots | slot | default | children | 140 |
| Slots | slot | trigger | renderTrigger | 141 |
| Slots | slot | tip | renderTip | 142 |
| Slots | slot | file | renderFile | 143 |
| Exposes | ref | abort | ref.current.abort | 149 |
| Exposes | ref | submit | ref.current.submit | 150 |
| Exposes | ref | clearFiles | ref.current.clearFiles | 151 |
| Exposes | ref | handleStart | ref.current.handleStart | 152 |
| Exposes | ref | handleRemove | ref.current.handleRemove | 153 |

### 原始契约与迁移约束

以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。

| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |
|---|---|---|---|---|---|---|
| upload:108 | Attributes | action | request URL. | ^[string] | # | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:109 | Attributes | headers | request headers. | ^[object]`Headers \| Record<string, any>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:110 | Attributes | method | set upload request method. | ^[string] | post | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:111 | Attributes | multiple | whether uploading multiple files is permitted. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:112 | Attributes | data | additions options of request. support `Awaitable` data and `Function` since v2.3.13. | ^[object]`Record<string, any> \| Awaitable<Record<string, any>>` / ^[Function]`(rawFile: UploadRawFile) => Awaitable<Record<string, any>>` | {} | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:113 | Attributes | name | key name for uploaded file. | ^[string] | file | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:114 | Attributes | with-credentials | whether cookies are sent. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:115 | Attributes | show-file-list | whether to show the uploaded file list. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:116 | Attributes | drag | whether to activate drag and drop mode. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:117 | Attributes | accept | accepted [file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept), will not work when `thumbnail-mode === true`. | ^[string] | '' | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:118 | Attributes | crossorigin | native attribute [crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). | ^[enum]`'' \| 'anonymous' \| 'use-credentials'` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:119 | Attributes | on-preview | hook function when clicking the uploaded files. | ^[Function]`(uploadFile: UploadFile) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:120 | Attributes | on-remove | hook function when files are removed. | ^[Function]`(uploadFile: UploadFile, uploadFiles: UploadFiles) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:121 | Attributes | on-success | hook function when uploaded successfully. | ^[Function]`(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:122 | Attributes | on-error | hook function when some errors occurs. | ^[Function]`(error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:123 | Attributes | on-progress | hook function when some progress occurs. | ^[Function]`(evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:124 | Attributes | on-change | hook function when select file or upload file success or upload file fail. | ^[Function]`(uploadFile: UploadFile, uploadFiles: UploadFiles) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:125 | Attributes | on-exceed | hook function when limit is exceeded. | ^[Function]`(files: File[], uploadFiles: UploadUserFile[]) => void` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:126 | Attributes | before-upload | hook function before uploading with the file to be uploaded as its parameter. If `false` is returned or a `Promise` is returned and then is rejected, uploading will be aborted. | ^[Function]`(rawFile: UploadRawFile) => Awaitable<void \| undefined \| null \| boolean \| File \| Blob>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:127 | Attributes | before-remove | hook function before removing a file with the file and file list as its parameters. If `false` is returned or a `Promise` is returned and then is rejected, removing will be aborted. | ^[Function]`(uploadFile: UploadFile, uploadFiles: UploadFiles) => Awaitable<boolean>` | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:128 | Attributes | file-list / v-model:file-list | default uploaded files. | ^[array]`UploadUserFile[]` | [] | 具名双向绑定独立受控通道；与源同名语义事件发生冲突时必须在类型审计裁决，不机械合并。 |
| upload:129 | Attributes | list-type | type of file list. | ^[enum]`'text' \| 'picture' \| 'picture-card'` | text | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:130 | Attributes | auto-upload | whether to auto upload file. | ^[boolean] | true | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:131 | Attributes | http-request | override default xhr behavior, allowing you to implement your own upload-file's request. | ^[Function]`(options: UploadRequestOptions) => XMLHttpRequest \| Promise<unknown>` | ajaxUpload [see](https://github.com/element-plus/element-plus/blob/dev/packages/components/upload/src/ajax.ts#L55) | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:132 | Attributes | disabled | whether to disable upload. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:133 | Attributes | limit | maximum number of uploads allowed. | ^[number] | — | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:134 | Attributes | directory | whether to support uploading directory. After enabling it, only folders can be selected, and after selecting a folder, the files within the folder will be flattened. | ^[boolean] | false | 保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。 |
| upload:140 | Slots | default | customize default content. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| upload:141 | Slots | trigger | content which triggers file dialog. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| upload:142 | Slots | tip | content of tips. | - | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| upload:143 | Slots | file | content of thumbnail template. | ^[object]`{ file: UploadFile, index: number }` | — | 默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。 |
| upload:149 | Exposes | abort | cancel upload request. When a `file` is specified, abort the corresponding pending upload; when no file is specified, abort all pending uploads. | ^[Function]`(file?: UploadFile) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| upload:150 | Exposes | submit | upload the file list manually. | ^[Function]`() => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| upload:151 | Exposes | clearFiles | clear the file list (this method is not supported in the `before-upload` hook). | ^[Function]`(status?: UploadStatus[]) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| upload:152 | Exposes | handleStart | select the file manually. | ^[Function]`(rawFile: UploadRawFile) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |
| upload:153 | Exposes | handleRemove | remove the file manually. `file` and `rawFile` has been merged. `rawFile` will be removed in `v2.2.0`. | ^[Function]`(file: UploadFile \| UploadRawFile, rawFile?: UploadRawFile) => void` | — | 方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。 |

## 5. 源码、样式和示例追踪

- [packages/components/upload](../../reference/element-plus/packages/components/upload/index.ts)；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。
- 示例：docs/examples/upload/basic.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/limit-cover.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/avatar.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/photo-wall.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/custom-thumbnail.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/file-list-with-thumbnail.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/file-list.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/drag-and-drop.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/directory.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。
- 示例：docs/examples/upload/manual.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。

## 6. 验收设计

- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。
- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。
- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。
- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。
- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。
- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。

## 7. 完成判定

当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。
