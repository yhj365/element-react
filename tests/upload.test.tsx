import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, vi } from 'vitest';
import { Upload, genFileId, ajaxUpload } from '../packages/element-react';
import type { UploadHandle, UploadRawFile, UploadRequestOptions } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

afterEach(() => vi.restoreAllMocks());
/** 选择原生文件，保持浏览器File接口。 */
function choose(container: HTMLElement, names = ['a.txt']): void {
  fireEvent.change(container.querySelector('input[type=file]')!, {
    target: { files: names.map((name) => new File(['content'], name, { type: 'text/plain' })) },
  });
}
/** 为手动选择入口创建带唯一标识的原生文件。 */
function rawFile(name = 'manual.txt'): UploadRawFile {
  return Object.assign(new File(['manual'], name), { uid: genFileId() });
}

apiTest(
  'upload',
  'Attributes',
  ['action', 'headers', 'method', 'data', 'name', 'with-credentials', 'http-request', 'auto-upload'],
  'upload-manual',
  '手动提交将异步请求配置和文件传递给上传适配器',
  async () => {
    const ref = createRef<UploadHandle>();
    const request = vi.fn(async () => ({ ok: true }));
    const view = render(
      <Upload
        ref={ref}
        autoUpload={false}
        action="/files"
        method="put"
        name="document"
        headers={{ Authorization: 'demo' }}
        withCredentials
        data={async (file) => ({ filename: file.name })}
        httpRequest={request}
      >
        Select
      </Upload>,
    );
    choose(view.container);
    expect(request).not.toHaveBeenCalled();
    act(() => ref.current?.submit());
    await waitFor(() => expect(request).toHaveBeenCalledOnce());
    expect(request.mock.calls[0]).toBeDefined();
    const options = (request.mock.calls as unknown as [UploadRequestOptions][])[0][0];
    expect(options).toMatchObject({
      action: '/files',
      method: 'put',
      filename: 'document',
      withCredentials: true,
      headers: { Authorization: 'demo' },
      data: { filename: 'a.txt' },
    });
    expect(options.file).toBeInstanceOf(File);
    await waitFor(() => expect(view.container.querySelector('.is-success')).toBeInTheDocument());
  },
);
apiTest(
  'upload',
  'Attributes',
  ['multiple', 'limit', 'on-exceed'],
  'upload-basic',
  '多选超出限制时整批拒绝且通知完整候选列表',
  () => {
    const exceed = vi.fn(),
      change = vi.fn();
    const view = render(<Upload multiple limit={1} autoUpload={false} onExceed={exceed} onChange={change} />);
    choose(view.container, ['a.txt', 'b.txt']);
    expect(exceed).toHaveBeenCalledWith(expect.any(Array), []);
    expect(exceed.mock.calls[0][0]).toHaveLength(2);
    expect(change).not.toHaveBeenCalled();
    expect(view.container.querySelectorAll('.el-upload-list__item')).toHaveLength(0);
  },
);
apiTest(
  'upload',
  'Attributes',
  ['before-upload'],
  'upload-avatar',
  '异步预检查可替换文件内容并拒绝非法文件',
  async () => {
    const request = vi.fn(async (_options: UploadRequestOptions) => ({}));
    const view = render(
      <Upload
        beforeUpload={async () => new Blob(['replacement'], { type: 'text/custom' })}
        httpRequest={request}
      />,
    );
    choose(view.container);
    await waitFor(() => expect(request).toHaveBeenCalledOnce());
    expect(request.mock.calls[0][0].file.type).toBe('text/custom');
    view.rerender(<Upload beforeUpload={async () => false} httpRequest={request} />);
    choose(view.container, ['rejected.txt']);
    await waitFor(() => expect(screen.queryByText('rejected.txt')).toBeNull());
    expect(request).toHaveBeenCalledTimes(1);
  },
);
apiTest(
  'upload',
  'Attributes',
  ['on-progress', 'on-success', 'on-error', 'on-change'],
  'upload-basic',
  '进度成功失败分别更新状态，回调接收最新文件列表',
  async () => {
    const requests: UploadRequestOptions[] = [];
    const progress = vi.fn(),
      success = vi.fn(),
      error = vi.fn(),
      change = vi.fn();
    const view = render(
      <Upload
        multiple
        httpRequest={(options) => {
          requests.push(options);
          return { abort: () => {} };
        }}
        onProgress={progress}
        onSuccess={success}
        onError={error}
        onChange={change}
      />,
    );
    choose(view.container, ['a.txt', 'b.txt']);
    await waitFor(() => expect(requests).toHaveLength(2));
    act(() => requests[0].onProgress({ loaded: 5, total: 10, percent: 50 }));
    expect(progress.mock.calls[0][1]).toMatchObject({ status: 'uploading', percentage: 50 });
    act(() => requests[0].onSuccess({ id: 1 }));
    expect(success.mock.calls[0][1]).toMatchObject({ status: 'success', response: { id: 1 } });
    act(() => requests[1].onError(new Error('Failed')));
    expect(error.mock.calls[0][1]).toMatchObject({ status: 'fail' });
    expect(change).toHaveBeenCalledTimes(4);
  },
);
apiTest(
  'upload',
  'Attributes',
  ['on-preview', 'on-remove', 'before-remove'],
  'upload-basic',
  '预览回调与异步移除拦截互不混用',
  async () => {
    const preview = vi.fn(),
      remove = vi.fn();
    const view = render(
      <Upload
        defaultFileList={[{ name: 'done.txt', uid: 1 }]}
        onPreview={preview}
        onRemove={remove}
        beforeRemove={async () => false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'done.txt' }));
    expect(preview.mock.calls[0][0]).toMatchObject({ uid: 1, status: 'success' });
    fireEvent.click(screen.getByRole('button', { name: 'Close done.txt' }));
    await act(async () => {});
    expect(remove).not.toHaveBeenCalled();
    view.rerender(<Upload defaultFileList={[]} onRemove={remove} beforeRemove={async () => true} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close done.txt' }));
    await waitFor(() => expect(remove).toHaveBeenCalledWith(expect.objectContaining({ uid: 1 }), []));
  },
);
apiTest(
  'upload',
  'Attributes',
  ['file-list', 'show-file-list', 'list-type'],
  'upload-file-list',
  '受控列表等待属性回写，隐藏列表不隐藏选择入口',
  async () => {
    const change = vi.fn();
    const view = render(
      <Upload
        fileList={[{ name: 'parent.txt', uid: 1 }]}
        autoUpload={false}
        onFileListChange={change}
        listType="picture"
      />,
    );
    choose(view.container);
    expect(change.mock.calls[0][0]).toHaveLength(2);
    expect(screen.queryByText('a.txt')).toBeNull();
    expect(view.container.querySelector('.el-upload-list')).toHaveClass('el-upload-list--picture');
    view.rerender(<Upload showFileList={false} />);
    expect(view.container.querySelector('.el-upload-list')).toBeNull();
    expect(screen.getByRole('button', { name: 'Select files' })).toBeInTheDocument();
  },
);
apiTest(
  'upload',
  'Attributes',
  ['drag', 'accept', 'disabled'],
  'upload-drag-and-drop',
  '拖入多个文件加入列表，禁用状态阻止选择和拖放',
  () => {
    const view = render(
      <Upload drag multiple accept="text/plain" autoUpload={false}>
        Drop here
      </Upload>,
    );
    const dragger = view.container.querySelector('.el-upload-dragger')!;
    fireEvent.dragOver(dragger);
    expect(dragger).toHaveClass('is-dragover');
    fireEvent.drop(dragger, {
      dataTransfer: { files: [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')] },
    });
    expect(view.container.querySelectorAll('.el-upload-list__item')).toHaveLength(2);
    expect(view.container.querySelector('input')).toHaveAttribute('accept', 'text/plain');
    view.rerender(
      <Upload drag multiple disabled autoUpload={false}>
        Drop here
      </Upload>,
    );
    fireEvent.drop(dragger, { dataTransfer: { files: [new File(['c'], 'c.txt')] } });
    expect(screen.queryByText('c.txt')).toBeNull();
  },
);
apiTest(
  'upload',
  'Attributes',
  ['directory'],
  'upload-directory',
  '文件夹选择保留全部扁平文件并提供原生目录属性',
  () => {
    const view = render(<Upload directory autoUpload={false} />);
    expect(view.container.querySelector('input')).toHaveAttribute('webkitdirectory');
    choose(view.container, ['folder-a.txt', 'folder-b.txt']);
    expect(view.container.querySelectorAll('.el-upload-list__item')).toHaveLength(2);
  },
);
apiTest(
  'upload',
  'Exposes',
  ['abort', 'submit', 'clearFiles', 'handleStart', 'handleRemove'],
  'upload-limit-cover',
  '实例可手动加入提交取消和按状态清空',
  async () => {
    const ref = createRef<UploadHandle>(),
      cancel = vi.fn();
    let pending: UploadRequestOptions | undefined;
    render(
      <Upload
        ref={ref}
        autoUpload={false}
        httpRequest={(options) => {
          pending = options;
          return { abort: cancel };
        }}
      />,
    );
    const raw = rawFile();
    act(() => ref.current?.handleStart(raw));
    act(() => ref.current?.submit());
    await waitFor(() => expect(pending).toBeDefined());
    act(() => ref.current?.abort());
    expect(cancel).toHaveBeenCalledOnce();
    act(() => pending?.onSuccess({ late: true }));
    expect(document.querySelector('.is-success')).toBeNull();
    act(() => ref.current?.clearFiles(['uploading']));
    expect(screen.queryByText('manual.txt')).toBeNull();
    act(() => ref.current?.handleStart(rawFile('next.txt')));
    const file = rawFile('remove.txt');
    act(() => ref.current?.handleStart(file));
    await act(async () => ref.current?.handleRemove(file));
    expect(screen.queryByText('remove.txt')).toBeNull();
    expect(screen.getByText('next.txt')).toBeInTheDocument();
  },
);
apiTest(
  'upload',
  'Attributes',
  ['crossorigin'],
  'upload-photo-wall',
  '图片列表传递跨域属性并释放本实例创建的缩略图',
  async () => {
    const create = vi.fn(() => 'blob:owned'),
      revoke = vi.fn();
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = create;
        static revokeObjectURL = revoke;
      },
    );
    const view = render(<Upload listType="picture-card" crossOrigin="anonymous" autoUpload={false} />);
    choose(view.container, ['image.png']);
    expect(screen.getByRole('img', { name: 'image.png' })).toHaveAttribute('crossorigin', 'anonymous');
    view.unmount();
    expect(revoke).toHaveBeenCalledWith('blob:owned');
    vi.unstubAllGlobals();
  },
);
apiTest('upload', 'Slots', ['file'], 'upload-custom-thumbnail', '自定义文件模板接收文件与索引', () => {
  render(
    <Upload
      defaultFileList={[{ name: 'a.txt' }]}
      renderFile={({ file, index }) => (
        <b>
          {index}: {file.name}
        </b>
      )}
    />,
  );
  expect(screen.getByText('0: a.txt').tagName).toBe('B');
});
apiTest(
  'upload',
  'Slots',
  ['default', 'trigger', 'tip'],
  'upload-file-list-with-thumbnail',
  '触发内容提示与默认内容分离',
  () => {
    render(
      <Upload renderTrigger={<b>Trigger</b>} renderTip={<small>Tip</small>}>
        Other content
      </Upload>,
    );
    expect(screen.getByText('Trigger').closest('[role=button]')).not.toBeNull();
    expect(screen.getByText('Tip').tagName).toBe('SMALL');
    expect(screen.getByText('Other content')).toBeInTheDocument();
  },
);
featureTest('upload', 'pending-unmount', 'upload-manual', '异步预检查在卸载后不能发起请求', async () => {
  let resolve: ((value: boolean) => void) | undefined;
  const request = vi.fn(async () => ({}));
  const view = render(
    <Upload
      beforeUpload={() =>
        new Promise<boolean>((done) => {
          resolve = done;
        })
      }
      httpRequest={request}
    />,
  );
  choose(view.container);
  view.unmount();
  await act(async () => resolve?.(true));
  expect(request).not.toHaveBeenCalled();
});

featureTest('upload', 'xhr-transport', 'upload-basic', '默认请求构建FormData、请求头并转换进度及响应', () => {
  class TestXHR {
    static latest: TestXHR;
    upload: { onprogress: ((event: { loaded: number; total: number }) => void) | null } = {
      onprogress: null,
    };
    withCredentials = false;
    status = 200;
    statusText = 'OK';
    responseText = '{"id":1}';
    onerror: (() => void) | null = null;
    onload: (() => void) | null = null;
    open = vi.fn();
    setRequestHeader = vi.fn();
    send = vi.fn();
    abort = vi.fn();
    /** 记录请求实例供回调断言使用。 */
    constructor() {
      TestXHR.latest = this;
    }
  }
  vi.stubGlobal('XMLHttpRequest', TestXHR);
  const success = vi.fn(),
    error = vi.fn(),
    progress = vi.fn();
  const file = rawFile();
  ajaxUpload({
    action: '/upload',
    method: 'post',
    file,
    filename: 'document',
    headers: { 'X-Demo': 1, Skip: undefined },
    data: { category: 'test', tags: ['a', 'b'] },
    withCredentials: true,
    onSuccess: success,
    onError: error,
    onProgress: progress,
  });
  const xhr = TestXHR.latest;
  expect(xhr.open).toHaveBeenCalledWith('post', '/upload', true);
  expect(xhr.withCredentials).toBe(true);
  expect(xhr.setRequestHeader).toHaveBeenCalledExactlyOnceWith('X-Demo', '1');
  const form = xhr.send.mock.calls[0][0] as FormData;
  expect(form.get('document')).toBeInstanceOf(File);
  expect(form.get('document')).toMatchObject({ name: file.name, size: file.size, type: file.type });
  expect(form.getAll('tags')).toEqual(['a', 'b']);
  xhr.upload.onprogress?.({ loaded: 2, total: 4 });
  expect(progress).toHaveBeenCalledWith({ loaded: 2, total: 4, percent: 50 });
  xhr.onload?.();
  expect(success).toHaveBeenCalledWith({ id: 1 });
  xhr.status = 500;
  xhr.onload?.();
  expect(error).toHaveBeenCalledWith(expect.any(Error));
  vi.unstubAllGlobals();
});
