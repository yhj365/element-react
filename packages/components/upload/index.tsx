'use client';

import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cx, useControllable, useDisabled, useNamespace, useText } from '../../hooks';
import { ajaxUpload } from './request';
import type {
  UploadFile,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
  UploadStatus,
  UploadUserFile,
} from './types';
export * from './types';
export { ajaxUpload } from './request';

let seed = 0;
/** 为原生文件生成稳定且单调递增的上传标识。 */
export function genFileId(): number {
  return Date.now() + seed++;
}

/** 归一化展示文件，已上传文件默认标记成功，保留调用方提供的uid。 */
function normalize(files: UploadUserFile[]): UploadFile[] {
  return files.map((file) => ({ ...file, uid: file.uid ?? genFileId(), status: file.status ?? 'success' }));
}

/** 上传文件列表与请求生命周期统一管理，移除、取消或卸载后的回调不得再次写入列表。 */
export function Upload(props: UploadProps) {
  const {
    action = '#',
    headers = {},
    method = 'post',
    multiple = false,
    data = {},
    name = 'file',
    withCredentials = false,
    showFileList = true,
    drag = false,
    accept = '',
    fileList,
    defaultFileList = [],
    onFileListChange,
    listType = 'text',
    autoUpload = true,
    httpRequest = ajaxUpload,
    limit,
    directory = false,
    beforeUpload,
    beforeRemove,
    onPreview,
    onRemove,
    onSuccess,
    onError,
    onProgress,
    onChange,
    onExceed,
    renderTrigger,
    renderTip,
    renderFile,
    ref,
    children,
    className,
    style,
    id,
  } = props;
  const ns = useNamespace('upload');
  const listNs = useNamespace('upload-list');
  const disabled = useDisabled(props.disabled);
  const text = useText();
  const initialized = useRef(normalize(defaultFileList));
  const controlledIds = useRef(new WeakMap<UploadUserFile, number>());
  const controlled = fileList?.map((file) => {
    let uid = file.uid ?? controlledIds.current.get(file);
    if (uid === undefined) {
      uid = genFileId();
      controlledIds.current.set(file, uid);
    }
    return { ...file, uid, status: file.status ?? 'success' } satisfies UploadFile;
  });
  const [files, setFiles] = useControllable(controlled, initialized.current, onFileListChange);
  const current = useRef(files);
  current.current = files;
  const input = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);
  const pending = useRef(new Map<number, { abort?: () => void; token: symbol }>());
  const urls = useRef(new Set<string>());
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const requests = pending.current,
      ownedUrls = urls.current;
    return () => {
      mounted.current = false;
      requests.forEach((request) => request.abort?.());
      requests.clear();
      ownedUrls.forEach((url) => URL.revokeObjectURL(url));
      ownedUrls.clear();
    };
  }, []);

  /** 内部列表同步到ref，使同一个事件内选择多个文件时不丢失前一项。 */
  function publish(next: UploadFile[]): void {
    if (!mounted.current) return;
    current.current = next;
    setFiles(next);
  }
  /** 释放由本实例创建的缩略图地址。 */
  function release(file: UploadFile): void {
    if (file.url && urls.current.delete(file.url)) URL.revokeObjectURL(file.url);
  }
  /** 中止指定或全部请求，先删除token防止abort回调再次提交。 */
  function abort(file?: UploadFile): void {
    for (const [uid, request] of pending.current)
      if (!file || uid === file.uid) {
        pending.current.delete(uid);
        request.abort?.();
      }
  }
  /** 合并文件状态，并回传本次完整列表。 */
  function patch(uid: number, change: Partial<UploadFile>): UploadFile | undefined {
    const found = current.current.find((file) => file.uid === uid);
    if (!found) return;
    const next = { ...found, ...change };
    publish(current.current.map((file) => (file.uid === uid ? next : file)));
    return next;
  }
  /** 请求前可异步替换文件内容或拒绝上传；数据准备阶段也可被取消。 */
  async function upload(file: UploadFile): Promise<void> {
    if (disabled || !file.raw || pending.current.has(file.uid)) return;
    const token = Symbol('upload');
    pending.current.set(file.uid, { token });
    /** 回调只可写入仍属于当前请求和当前组件的文件。 */
    function valid(): boolean {
      return (
        mounted.current &&
        pending.current.get(file.uid)?.token === token &&
        current.current.some((item) => item.uid === file.uid)
      );
    }
    try {
      const prepared = await beforeUpload?.(file.raw);
      if (!valid()) return;
      if (prepared === false) {
        pending.current.delete(file.uid);
        publish(current.current.filter((item) => item.uid !== file.uid));
        release(file);
        return;
      }
      const body =
        prepared instanceof Blob
          ? Object.assign(new File([prepared], file.raw.name, { type: prepared.type }), { uid: file.uid })
          : file.raw;
      const extra = await (typeof data === 'function' ? data(body) : data);
      if (!valid()) return;
      patch(file.uid, { status: 'uploading', percentage: 0 });
      const options: UploadRequestOptions = {
        action,
        headers,
        method,
        data: extra,
        filename: name,
        file: body,
        withCredentials,
        onProgress: (event) => {
          if (!valid()) return;
          const updated = patch(file.uid, {
            status: 'uploading',
            percentage: Math.max(0, Math.min(100, event.percent)),
          });
          if (updated) onProgress?.(event, updated, current.current);
        },
        onSuccess: (response) => {
          if (!valid()) return;
          pending.current.delete(file.uid);
          const updated = patch(file.uid, { status: 'success', percentage: 100, response });
          if (updated) {
            onSuccess?.(response, updated, current.current);
            onChange?.(updated, current.current);
          }
        },
        onError: (error) => {
          if (!valid()) return;
          pending.current.delete(file.uid);
          const updated = patch(file.uid, { status: 'fail' });
          if (updated) {
            onError?.(error, updated, current.current);
            onChange?.(updated, current.current);
          }
        },
      };
      const request = httpRequest(options);
      if (pending.current.get(file.uid)?.token === token && 'abort' in request)
        pending.current.set(file.uid, { token, abort: () => request.abort() });
      if (request instanceof Promise)
        void request.then(options.onSuccess, (error: unknown) =>
          options.onError(error instanceof Error ? error : new Error(String(error))),
        );
    } catch (error) {
      if (!valid()) return;
      pending.current.delete(file.uid);
      // before-upload拒绝与准备数据失败不发起网络请求，并清除本次待上传项。
      publish(current.current.filter((item) => item.uid !== file.uid));
      release(file);
      if (error instanceof Error) onError?.(error, file, current.current);
    }
  }
  /** 将手动选择的文件加入ready列表，请求由选择入口或submit启动。 */
  function handleStart(raw: UploadRawFile): void {
    if (disabled) return;
    if (raw.uid === undefined) raw.uid = genFileId();
    if (current.current.some((file) => file.uid === raw.uid)) return;
    let url: string | undefined;
    if (listType !== 'text' && typeof URL.createObjectURL === 'function') {
      url = URL.createObjectURL(raw);
      urls.current.add(url);
    }
    const file: UploadFile = {
      name: raw.name,
      size: raw.size,
      uid: raw.uid,
      status: 'ready',
      percentage: 0,
      raw,
      url,
    };
    const next = [...current.current, file];
    publish(next);
    onChange?.(file, next);
  }
  /** 批量选择先验证数量上限，防止部分文件被静默接收。 */
  function acceptFiles(selected: File[]): void {
    if (disabled) return;
    const candidates = multiple || directory ? selected : selected.slice(0, 1);
    if (limit !== undefined && current.current.length + candidates.length > limit) {
      onExceed?.(selected, current.current);
      return;
    }
    candidates.forEach((file) => {
      const raw = Object.assign(file, { uid: genFileId() });
      handleStart(raw);
      const added = current.current.find((item) => item.uid === raw.uid);
      if (autoUpload && added) void upload(added);
    });
  }
  /** 移除支持异步拦截，期间文件若已被清理或组件卸载则不继续操作。 */
  async function handleRemove(target: UploadFile | UploadRawFile): Promise<void> {
    const file = current.current.find((item) => item.uid === target.uid);
    if (!file || disabled) return;
    try {
      if ((await beforeRemove?.(file, current.current)) === false) return;
    } catch {
      return;
    }
    if (!mounted.current || !current.current.some((item) => item.uid === file.uid)) return;
    abort(file);
    const next = current.current.filter((item) => item.uid !== file.uid);
    publish(next);
    release(file);
    onRemove?.(file, next);
  }
  /** 手动提交只启动ready文件，重复提交不会创建第二个请求。 */
  function submit(): void {
    current.current
      .filter((file) => file.status === 'ready')
      .forEach((file) => {
        void upload(file);
      });
  }
  /** 按状态清理文件并取消其请求，释放本实例拥有的缩略图。 */
  function clearFiles(statuses?: UploadStatus[]): void {
    const removed = current.current.filter((file) => !statuses || statuses.includes(file.status));
    removed.forEach((file) => {
      abort(file);
      release(file);
    });
    publish(current.current.filter((file) => !removed.includes(file)));
  }
  useImperativeHandle(ref, () => ({ abort, submit, clearFiles, handleStart, handleRemove }));
  const fileInput = (
    <input
      ref={input}
      type="file"
      className={ns.e('input')}
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      {...(directory ? { webkitdirectory: '' } : {})}
      onChange={(event) => {
        acceptFiles(Array.from(event.target.files ?? []));
        event.target.value = '';
      }}
    />
  );
  const trigger = (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={text.selectFiles}
      aria-disabled={disabled}
      className={cx(ns.b, ns.m(listType), disabled && 'is-disabled')}
      onClick={() => {
        if (!disabled) input.current?.click();
      }}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && ['Enter', ' '].includes(event.key)) {
          event.preventDefault();
          if (!disabled) input.current?.click();
        }
      }}
    >
      {fileInput}
      {drag ? (
        <div
          className={cx(
            `${ns.namespace}-upload-dragger`,
            dragover && 'is-dragover',
            disabled && 'is-disabled',
          )}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragover(true);
          }}
          onDragLeave={() => setDragover(false)}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setDragover(false);
            acceptFiles(Array.from(event.dataTransfer.files));
          }}
        >
          {renderTrigger ?? children}
        </div>
      ) : (
        (renderTrigger ?? children)
      )}
    </div>
  );
  return (
    <div id={id} className={className} style={style}>
      {listType !== 'picture-card' && trigger}
      {showFileList && (
        <ul className={cx(listNs.b, listNs.m(listType), disabled && 'is-disabled')}>
          {files.map((file, index) => (
            <li key={file.uid} className={cx(listNs.e('item'), `is-${file.status}`)}>
              {renderFile ? (
                renderFile({ file, index })
              ) : (
                <>
                  {listType !== 'text' && file.url && (
                    <img
                      className={listNs.e('item-thumbnail')}
                      src={file.url}
                      alt={file.name}
                      crossOrigin={props.crossOrigin || undefined}
                    />
                  )}
                  <div className={listNs.e('item-info')}>
                    <button type="button" className={listNs.e('item-name')} onClick={() => onPreview?.(file)}>
                      {file.name}
                    </button>
                    {file.status === 'uploading' && (
                      <progress
                        max={100}
                        value={file.percentage ?? 0}
                        aria-label={`${text.uploading} ${file.name}`}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`${text.close} ${file.name}`}
                    className={listNs.e('item-delete')}
                    onClick={() => {
                      void handleRemove(file);
                    }}
                  >
                    ×
                  </button>
                </>
              )}
            </li>
          ))}
          {listType === 'picture-card' && <li>{trigger}</li>}
        </ul>
      )}
      {listType === 'picture-card' && !showFileList && trigger}
      {renderTrigger && children}
      <div className={ns.e('tip')}>{renderTip}</div>
    </div>
  );
}
