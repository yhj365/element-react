# Upload 源码目录设计

- 来源：packages/components/upload
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：文件选择/拖放、accept、多选和数量限制；文件列表与卡片/图片；自动/手动提交、beforeUpload/beforeRemove；进度成功失败、取消重试、自定义请求、凭据/headers/data；预览删除和实例方法。
- 家族设计：[upload](../components/upload.md)
- React方案：通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/upload/index.ts（SHA256 031346d1d0785e992968f48eec1394b87e7d1c9fe698cc111823023a0e3d6e19）
- packages/components/upload/src/ajax.ts（SHA256 2dabe0cba4753d04e2c1acd9e5862162ed8d73083b2b9465675953bee6ea3ef4）
- packages/components/upload/src/constants.ts（SHA256 e1e62ebf059cabc1a98c6964e059d8c21f632a562f87f75e6a5b545d7e411ed6）
- packages/components/upload/src/upload-content.ts（SHA256 316aba0927dcd9f25823dc6a554fa11c9ad9fb029c7b24436093119aa969ea7d）
- packages/components/upload/src/upload-content.vue（SHA256 cc926d5ee08474c147cb82e8f5e92634f918cd20e27464215e05d49ad966c6e2）
- packages/components/upload/src/upload-dragger.ts（SHA256 a3d2657b6c3fca97f800e5b566f2a93a0aa348a552293f30b9dfd9992ecadc38）
- packages/components/upload/src/upload-dragger.vue（SHA256 9edf4209522bb6464b7469e04f2f48842a6731bd7d8f670cfe99ff361f1a19b5）
- packages/components/upload/src/upload-list.ts（SHA256 89f35884ec0d0410a2e38fe5cf4e2bafcf6571a779ee64801f1273b7d4df0e6a）
- packages/components/upload/src/upload-list.vue（SHA256 ad795c12b900171d42a70a46f6f1803e1a17de95f3c77ef67ec26a99594a747e）
- packages/components/upload/src/upload.ts（SHA256 cc8a88d1cf95f0aea3348370c30c954af742effb0f6180c1188b0126641e06bc）
- packages/components/upload/src/upload.vue（SHA256 b7e18d8a0de542b6b005a73610284ef574d72204bbfcca396cd451306097a2ef）
- packages/components/upload/src/use-handlers.ts（SHA256 ed3b04a13b08c951702ed1c591b381a70c8ab56c1d35cbdf52d13cb5195b9f24）
- packages/components/upload/style/css.ts（SHA256 319327509f0e3b63ee415a2a2ecae64e7e0215fa8e5038cc03d5e1dd3a3b6967）
- packages/components/upload/style/index.ts（SHA256 48e0f8bd5670f23ebdb164d3a5401b95f2ec1cf336608a073aeb54052db4e111）
- packages/components/upload/__tests__/upload-dragger.test.tsx（SHA256 1718a27bf15c52b16a17328d12726c1c3a493af89cb7c9a7161c47ef32cd7151）
- packages/components/upload/__tests__/upload-list.test.tsx（SHA256 b33125db8994367000214ebf087dd219a49f8c03377b23f6124cd7a80092db30）
- packages/components/upload/__tests__/upload.test.tsx（SHA256 29bf61508529be7c8f331c86c8a8d091b62fdbe845b9d7dd6a59e464eec5217b）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <upload-dragger /> — packages/components/upload/__tests__/upload-dragger.test.tsx
- render test — packages/components/upload/__tests__/upload-dragger.test.tsx
- should render correct — packages/components/upload/__tests__/upload-dragger.test.tsx
- functionality — packages/components/upload/__tests__/upload-dragger.test.tsx
- onDrag works — packages/components/upload/__tests__/upload-dragger.test.tsx
- ondrop works for any given video type — packages/components/upload/__tests__/upload-dragger.test.tsx
- <upload-list /> — packages/components/upload/__tests__/upload-list.test.tsx
- render test — packages/components/upload/__tests__/upload-list.test.tsx
- should render correct — packages/components/upload/__tests__/upload-list.test.tsx
- functionalities — packages/components/upload/__tests__/upload-list.test.tsx
- handle preview works — packages/components/upload/__tests__/upload-list.test.tsx
- handle delete works — packages/components/upload/__tests__/upload-list.test.tsx
- <upload /> — packages/components/upload/__tests__/upload.test.tsx
- render test — packages/components/upload/__tests__/upload.test.tsx
- basic rendering — packages/components/upload/__tests__/upload.test.tsx
- functionality — packages/components/upload/__tests__/upload.test.tsx
- works with keydown & click — packages/components/upload/__tests__/upload.test.tsx
- works when upload file exceeds the limit — packages/components/upload/__tests__/upload.test.tsx
- onStart works — packages/components/upload/__tests__/upload.test.tsx
- beforeUpload works for rejecting upload — packages/components/upload/__tests__/upload.test.tsx
- beforeUpload works for resolving upload — packages/components/upload/__tests__/upload.test.tsx
- in beforeUpload change data correctly to request — packages/components/upload/__tests__/upload.test.tsx
- in beforeUpload return promise change data correctly to request — packages/components/upload/__tests__/upload.test.tsx
- data support receive promise — packages/components/upload/__tests__/upload.test.tsx
- data support receive function — packages/components/upload/__tests__/upload.test.tsx
- data support receive async function — packages/components/upload/__tests__/upload.test.tsx
- upload files and save keyList — packages/components/upload/__tests__/upload.test.tsx
- onProgress should work — packages/components/upload/__tests__/upload.test.tsx
- onChange receives synced fileList with v-model — packages/components/upload/__tests__/upload.test.tsx

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
