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
