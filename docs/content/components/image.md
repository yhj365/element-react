# Image 图片

加载反馈和独立图片查看器。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 图片及预览

加载反馈和独立图片查看器。

```tsx
import { Image, Space } from 'element-react';
const first =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23d9ecff"/%3E%3Ccircle cx="450" cy="110" r="45" fill="%23e6a23c"/%3E%3Cpath d="M0 400 200 130 400 400M200 400 450 180 600 400" fill="%2379bbff"/%3E%3C/svg%3E';
const second = first.replaceAll('%2379bbff', '%2395d475').replaceAll('%23d9ecff', '%23e1f3d8');
/** 点击图片预览，图片与资源在本地示例中保持确定。 */
export default function Example() {
  return (
    <Space>
      <Image
        src={first}
        alt="山景插图"
        fit="cover"
        style={{ width: 240, height: 160 }}
        previewSrcList={[first, second]}
        previewTeleported
        showProgress
      />
      <Image
        src="data:image/png;base64,invalid"
        style={{ width: 160, height: 160 }}
        renderError={<span>图片加载失败</span>}
      />
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Image Attributes | src | src | image source, same as native. | string | '' |
| Image Attributes | fit | fit | indicate how the image should be resized to fit its container, same as [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit). | enum'' \| 'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down' | '' |
| Image Attributes | loading | loading | Indicates how the browser should load the image, same as [native](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading). | enum'eager' \| 'lazy' | — |
| Image Attributes | alt | alt | native attribute `alt`. | string | — |
| Image Attributes | referrerpolicy | referrerPolicy | native attribute [referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy). | string | — |
| Image Attributes | crossorigin | crossOrigin | native attribute [crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). | enum'' \| 'anonymous' \| 'use-credentials' | — |
| Image Attributes | preview-src-list | previewSrcList | allow big image preview. | arraystring[] | [] |
| Image Attributes | initial-index | initialIndex | initial preview image index, less than the length of `url-list`. | number | 0 |
| Image Attributes | preview-teleported | previewTeleported | whether to append image-viewer to body. A nested parent element attribute transform should have this attribute set to `true`. | boolean | false |
| Image Attributes | show-progress | showProgress | whether to display the preview image progress content. | boolean | false |
| Image Events | load | onLoad | same as native load. | Function(e: Event) => void | — |
| Image Events | error | onError | same as native error. | Function(e: Event) => void | — |
| Image Events | switch | onSwitch | trigger when switching images. | Function(index: number) => void | — |
| Image Events | close | onClose | trigger when clicking on close button or when `hide-on-click-modal` enabled clicking on backdrop. | Function() => void | — |
| Image Events | show | onShow | trigger when the viewer displays | Function() => void | — |
| Image Slots | placeholder | renderPlaceholder | custom placeholder content when image hasn't loaded yet. | - | — |
| Image Slots | error | renderError | custom image load failed content. | - | — |
| Image Exposes | showPreview | ref.current.showPreview | manually open preview big image | Function() => void | — |
| Image Viewer Attributes | url-list | urlList | preview link list. | arraystring[] | [] |
| Image Viewer Attributes | z-index | zIndex | preview backdrop z-index. | number / string | — |
| Image Viewer Attributes | initial-index | initialIndex | the initial preview image index, less than or equal to the length of `url-list`. | number | 0 |
| Image Viewer Attributes | infinite | infinite | whether preview is infinite. | boolean | true |
| Image Viewer Attributes | hide-on-click-modal | hideOnClickModal | whether user can emit close event when clicking backdrop. | boolean | false |
| Image Viewer Attributes | teleported | teleported | whether to append image itself to body. A nested parent element attribute transform should have this attribute set to `true`. | boolean | false |
| Image Viewer Attributes | zoom-rate | zoomRate | the zoom rate of the image viewer zoom event. | number | 1.2 |
| Image Viewer Attributes | scale | scale | the preview image scale. | number | 1 |
| Image Viewer Attributes | min-scale | minScale | the min scale of the image viewer zoom event. | number | 0.2 |
| Image Viewer Attributes | max-scale | maxScale | the max scale of the image viewer zoom event. | number | 7 |
| Image Viewer Attributes | close-on-press-escape | closeOnPressEscape | whether the image-viewer can be closed by pressing ESC. | boolean | true |
| Image Viewer Attributes | show-progress | showProgress | whether to display the preview image progress content | boolean | false |
| Image Viewer Events | close | onClose | trigger when clicking on close button or when `hide-on-click-modal` enabled clicking on backdrop. | Function() => void | — |
| Image Viewer Events | error | onError | same as native error. | Function(e: Event) => void | — |
| Image Viewer Events | switch | onSwitch | trigger when switching images. | Function(index: number) => void | — |
| Image Viewer Events | rotate | onRotate | trigger when rotating images. | Function(deg: number) => void | — |
| Image Viewer Slots | default | children | custom content | - | — |
| Image Viewer Slots | progress | renderProgress | custom progress content (Priority is higher than `show-progress` prop) | object{ activeIndex: number, total: number } | — |
| Image Viewer Slots | toolbar | renderToolbar | custom toolbar content | object{ actions: (action: ImageViewerAction, options?: ImageViewerActionOptions) => void, prev: () => void, next: () => void, reset: () => void, activeIndex: number, setActiveItem: (index: number) => void } | — |
| Image Viewer Slots | viewer-error | renderViewerError | custom image load failed content. | object{ activeIndex: number, src: string } | — |
| Image Viewer Exposes | setActiveItem | ref.current.setActiveItem | manually switch image | Function(index: number) => void | — |

## 完成记录

- [x] image:88 src；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:89 fit；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:91 loading；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:94 alt；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:95 referrerPolicy；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:96 crossOrigin；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:97 previewSrcList；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:99 initialIndex；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:101 previewTeleported；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:107 showProgress；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:113 onLoad；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:114 onError；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:115 onSwitch；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:116 onClose；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:117 onShow；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:123 renderPlaceholder；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:124 renderError；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:132 ref.current.showPreview；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:140 urlList；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:141 zIndex；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:142 initialIndex；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:143 infinite；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:144 hideOnClickModal；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:145 teleported；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:146 zoomRate；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:147 scale；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:148 minScale；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:149 maxScale；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:150 closeOnPressEscape；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:151 showProgress；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:157 onClose；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:158 onError；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:159 onSwitch；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:160 onRotate；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:166 children；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:167 renderProgress；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:168 renderToolbar；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:169 renderViewerError；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
- [x] image:175 ref.current.setActiveItem；实现：packages/components/image/index.tsx；测试：tests/scroll-image.test.tsx
