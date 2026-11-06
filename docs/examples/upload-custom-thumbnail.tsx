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
