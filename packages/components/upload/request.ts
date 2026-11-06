import type { UploadRequestOptions } from './types';

/** 通过 XMLHttpRequest 上传 FormData，保留进度回调和可取消句柄。 */
export function ajaxUpload(options: UploadRequestOptions): XMLHttpRequest {
  const xhr = new XMLHttpRequest();
  xhr.open(options.method, options.action, true);
  xhr.withCredentials = options.withCredentials;
  if (options.headers instanceof Headers)
    options.headers.forEach((value, key) => xhr.setRequestHeader(key, value));
  else
    for (const [key, value] of Object.entries(options.headers))
      if (value != null) xhr.setRequestHeader(key, String(value));
  xhr.upload.onprogress = (event) =>
    options.onProgress({
      loaded: event.loaded,
      total: event.total,
      percent: event.total > 0 ? (event.loaded / event.total) * 100 : 0,
    });
  xhr.onerror = () => options.onError(new Error(`Upload failed: ${xhr.status}`));
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      options.onError(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      return;
    }
    let response: unknown = xhr.responseText;
    try {
      response = JSON.parse(xhr.responseText);
    } catch {
      /* 非 JSON 响应保留文本。 */
    }
    options.onSuccess(response);
  };
  const data = new FormData();
  for (const [key, value] of Object.entries(options.data)) {
    if (Array.isArray(value)) {
      for (const item of value) data.append(key, item);
    } else data.append(key, value);
  }
  data.append(options.filename, options.file, options.file.name);
  xhr.send(data);
  return xhr;
}
