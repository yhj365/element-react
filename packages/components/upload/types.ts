import type { ReactNode, Ref } from 'react';
import type { BaseProps } from '../../hooks';

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'fail';
export interface UploadRawFile extends File {
  uid: number;
  isDirectory?: boolean;
}
export interface UploadFile {
  name: string;
  uid: number;
  status: UploadStatus;
  size?: number;
  percentage?: number;
  raw?: UploadRawFile;
  url?: string;
  response?: unknown;
}
export type UploadUserFile = Omit<UploadFile, 'uid' | 'status'> & Partial<Pick<UploadFile, 'uid' | 'status'>>;
export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percent: number;
}
export type UploadData = Record<string, string | Blob | string[]>;
export interface UploadRequestOptions {
  action: string;
  method: string;
  filename: string;
  file: UploadRawFile;
  data: UploadData;
  headers: Headers | Record<string, string | number | null | undefined>;
  withCredentials: boolean;
  onSuccess: (response: unknown) => void;
  onError: (error: Error) => void;
  onProgress: (event: UploadProgressEvent) => void;
}
export interface UploadHandle {
  abort: (file?: UploadFile) => void;
  submit: () => void;
  clearFiles: (statuses?: UploadStatus[]) => void;
  handleStart: (file: UploadRawFile) => void;
  handleRemove: (file: UploadFile | UploadRawFile) => Promise<void>;
}
export interface UploadProps extends BaseProps {
  action?: string;
  headers?: UploadRequestOptions['headers'];
  method?: string;
  multiple?: boolean;
  data?: UploadData | Promise<UploadData> | ((file: UploadRawFile) => UploadData | Promise<UploadData>);
  name?: string;
  withCredentials?: boolean;
  showFileList?: boolean;
  drag?: boolean;
  accept?: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  fileList?: UploadUserFile[];
  defaultFileList?: UploadUserFile[];
  onFileListChange?: (files: UploadFile[]) => void;
  listType?: 'text' | 'picture' | 'picture-card';
  autoUpload?: boolean;
  httpRequest?: (options: UploadRequestOptions) => { abort: () => void } | Promise<unknown>;
  disabled?: boolean;
  limit?: number;
  directory?: boolean;
  beforeUpload?: (
    file: UploadRawFile,
  ) => void | null | boolean | Blob | Promise<void | null | boolean | Blob>;
  beforeRemove?: (file: UploadFile, files: UploadFile[]) => boolean | void | Promise<boolean | void>;
  onPreview?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile, files: UploadFile[]) => void;
  onSuccess?: (response: unknown, file: UploadFile, files: UploadFile[]) => void;
  onError?: (error: Error, file: UploadFile, files: UploadFile[]) => void;
  onProgress?: (event: UploadProgressEvent, file: UploadFile, files: UploadFile[]) => void;
  onChange?: (file: UploadFile, files: UploadFile[]) => void;
  onExceed?: (files: File[], filesInList: UploadFile[]) => void;
  renderTrigger?: ReactNode;
  renderTip?: ReactNode;
  renderFile?: (scope: { file: UploadFile; index: number }) => ReactNode;
  ref?: Ref<UploadHandle>;
}
