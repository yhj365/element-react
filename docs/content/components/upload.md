# Upload 上传

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        multiple
        limit={3}
        beforeRemove={async () => true}
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
    </div>
  );
}
```

### 覆盖上一个文件

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { useRef } from 'react';
import { Upload, Button, genFileId } from 'element-react';
import type { UploadHandle, UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/limit-cover对应场景。 */
export default function Example() {
  const upload = useRef<UploadHandle>(null);
  return (
    <div className="w-full">
      <Upload
        ref={upload}
        limit={1}
        autoUpload={false}
        onExceed={(files) => {
          upload.current?.clearFiles();
          const file = files[0];
          if (file) upload.current?.handleStart(Object.assign(file, { uid: genFileId() }));
        }}
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
      <Button className="mt-4" type="success" onClick={() => upload.current?.submit()}>
        Upload selected files
      </Button>
    </div>
  );
}
```

### 头像上传

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/avatar对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        showFileList={false}
        accept="image/*"
        beforeUpload={(file) => file.type.startsWith('image/') && file.size < 2 * 1024 * 1024}
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
    </div>
  );
}
```

### 照片墙

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/photo-wall对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        listType="picture-card"
        multiple
        accept="image/*"
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
    </div>
  );
}
```

### 自定义缩略图

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/custom-thumbnail对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        listType="picture-card"
        renderFile={({ file, index }) => (
          <span className="p-3">
            {index + 1}. {file.name}
          </span>
        )}
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
    </div>
  );
}
```

### 缩略图列表

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/file-list-with-thumbnail对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        listType="picture"
        multiple
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
    </div>
  );
}
```

### 文件列表控制

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { useState } from 'react';
import { Upload, Button } from 'element-react';
import type { UploadFile, UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/file-list对应场景。 */
export default function Example() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  return (
    <div className="w-full">
      <Upload
        fileList={files}
        onFileListChange={setFiles}
        multiple
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
    </div>
  );
}
```

### 拖拽上传

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/drag-and-drop对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        drag
        multiple
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Drop files here or click to select</Button>
      </Upload>
    </div>
  );
}
```

### 文件夹上传

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { Upload, Button } from 'element-react';
import type { UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/directory对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Upload
        directory
        multiple
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select folder</Button>
      </Upload>
    </div>
  );
}
```

### 手动上传

选择文件后查看列表和上传状态，示例在浏览器本地完成请求。

```tsx
import { useRef } from 'react';
import { Upload, Button } from 'element-react';
import type { UploadHandle, UploadRequestOptions } from 'element-react';
/** 示例请求在本地完成，不向外部服务器发送文件。 */
async function demoRequest(options: UploadRequestOptions): Promise<unknown> {
  options.onProgress({ loaded: 1, total: 1, percent: 100 });
  return { name: options.file.name, success: true };
}
/** 官方upload/manual对应场景。 */
export default function Example() {
  const upload = useRef<UploadHandle>(null);
  return (
    <div className="w-full">
      <Upload
        ref={upload}
        autoUpload={false}
        multiple
        httpRequest={demoRequest}
        renderTip={<span>Demo uploads stay in this browser.</span>}
      >
        <Button type="primary">Select files</Button>
      </Upload>
      <Button className="mt-4" type="success" onClick={() => upload.current?.submit()}>
        Upload selected files
      </Button>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | action | action | request URL. | string | # |
| Attributes | headers | headers | request headers. | objectHeaders \| Record<string, any> | — |
| Attributes | method | method | set upload request method. | string | post |
| Attributes | multiple | multiple | whether uploading multiple files is permitted. | boolean | false |
| Attributes | data | data | additions options of request. support `Awaitable` data and `Function` since v2.3.13. | objectRecord<string, any> \| Awaitable<Record<string, any>> / Function(rawFile: UploadRawFile) => Awaitable<Record<string, any>> | {} |
| Attributes | name | name | key name for uploaded file. | string | file |
| Attributes | with-credentials | withCredentials | whether cookies are sent. | boolean | false |
| Attributes | show-file-list | showFileList | whether to show the uploaded file list. | boolean | true |
| Attributes | drag | drag | whether to activate drag and drop mode. | boolean | false |
| Attributes | accept | accept | accepted [file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept), will not work when `thumbnail-mode === true`. | string | '' |
| Attributes | crossorigin | crossOrigin | native attribute [crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). | enum'' \| 'anonymous' \| 'use-credentials' | — |
| Attributes | on-preview | onPreview | hook function when clicking the uploaded files. | Function(uploadFile: UploadFile) => void | — |
| Attributes | on-remove | onRemove | hook function when files are removed. | Function(uploadFile: UploadFile, uploadFiles: UploadFiles) => void | — |
| Attributes | on-success | onSuccess | hook function when uploaded successfully. | Function(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void | — |
| Attributes | on-error | onError | hook function when some errors occurs. | Function(error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void | — |
| Attributes | on-progress | onProgress | hook function when some progress occurs. | Function(evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => void | — |
| Attributes | on-change | onChange | hook function when select file or upload file success or upload file fail. | Function(uploadFile: UploadFile, uploadFiles: UploadFiles) => void | — |
| Attributes | on-exceed | onExceed | hook function when limit is exceeded. | Function(files: File[], uploadFiles: UploadUserFile[]) => void | — |
| Attributes | before-upload | beforeUpload | hook function before uploading with the file to be uploaded as its parameter. If `false` is returned or a `Promise` is returned and then is rejected, uploading will be aborted. | Function(rawFile: UploadRawFile) => Awaitable<void \| undefined \| null \| boolean \| File \| Blob> | — |
| Attributes | before-remove | beforeRemove | hook function before removing a file with the file and file list as its parameters. If `false` is returned or a `Promise` is returned and then is rejected, removing will be aborted. | Function(uploadFile: UploadFile, uploadFiles: UploadFiles) => Awaitable<boolean> | — |
| Attributes | file-list / v-model:file-list | fileList / onFileListChange | default uploaded files. | arrayUploadUserFile[] | [] |
| Attributes | list-type | listType | type of file list. | enum'text' \| 'picture' \| 'picture-card' | text |
| Attributes | auto-upload | autoUpload | whether to auto upload file. | boolean | true |
| Attributes | http-request | httpRequest | override default xhr behavior, allowing you to implement your own upload-file's request. | Function(options: UploadRequestOptions) => XMLHttpRequest \| Promise<unknown> | ajaxUpload [see](https://github.com/element-plus/element-plus/blob/dev/packages/components/upload/src/ajax.ts#L55) |
| Attributes | disabled | disabled | whether to disable upload. | boolean | false |
| Attributes | limit | limit | maximum number of uploads allowed. | number | — |
| Attributes | directory | directory | whether to support uploading directory. After enabling it, only folders can be selected, and after selecting a folder, the files within the folder will be flattened. | boolean | false |
| Slots | default | children | customize default content. | - | — |
| Slots | trigger | renderTrigger | content which triggers file dialog. | - | — |
| Slots | tip | renderTip | content of tips. | - | — |
| Slots | file | renderFile | content of thumbnail template. | object{ file: UploadFile, index: number } | — |
| Exposes | abort | ref.current.abort | cancel upload request. When a `file` is specified, abort the corresponding pending upload; when no file is specified, abort all pending uploads. | Function(file?: UploadFile) => void | — |
| Exposes | submit | ref.current.submit | upload the file list manually. | Function() => void | — |
| Exposes | clearFiles | ref.current.clearFiles | clear the file list (this method is not supported in the `before-upload` hook). | Function(status?: UploadStatus[]) => void | — |
| Exposes | handleStart | ref.current.handleStart | select the file manually. | Function(rawFile: UploadRawFile) => void | — |
| Exposes | handleRemove | ref.current.handleRemove | remove the file manually. `file` and `rawFile` has been merged. `rawFile` will be removed in `v2.2.0`. | Function(file: UploadFile \| UploadRawFile, rawFile?: UploadRawFile) => void | — |

## 完成记录

- [x] upload:108 action；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:109 headers；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:110 method；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:111 multiple；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:112 data；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:113 name；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:114 withCredentials；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:115 showFileList；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:116 drag；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:117 accept；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:118 crossOrigin；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:119 onPreview；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:120 onRemove；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:121 onSuccess；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:122 onError；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:123 onProgress；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:124 onChange；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:125 onExceed；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:126 beforeUpload；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:127 beforeRemove；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:128 fileList / onFileListChange；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:129 listType；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:130 autoUpload；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:131 httpRequest；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:132 disabled；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:133 limit；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:134 directory；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:140 children；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:141 renderTrigger；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:142 renderTip；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:143 renderFile；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:149 ref.current.abort；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:150 ref.current.submit；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:151 ref.current.clearFiles；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:152 ref.current.handleStart；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
- [x] upload:153 ref.current.handleRemove；实现：packages/components/upload/index.tsx；测试：tests/upload.test.tsx
