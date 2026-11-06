# Watermark 水印

多行文字、字体与区域平铺。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 文字水印

多行文字、字体与区域平铺。

```tsx
import { Watermark } from 'element-react';

/** 水印覆盖区域保持内容可选取与操作。 */
export default function Example() {
  return (
    <Watermark content={['Element React', 'React 19']} font={{ fontSize: 16, color: 'rgba(64,158,255,.22)' }}>
      <div className="min-h-64 p-8">
        <h3>内容区域</h3>
        <p>水印使用原组件的旋转裁剪与交错平铺算法。</p>
        <p>这里的文字仍然可以正常选择。</p>
      </div>
    </Watermark>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | width | width | The width of the watermark, the default value of `content` is its own width | number | 120 |
| Attributes | height | height | The height of the watermark, the default value of `content` is its own height | number | 64 |
| Attributes | rotate | rotate | When the watermark is drawn, the rotation Angle, unit `°` | number | -22 |
| Attributes | z-index | zIndex | The z-index of the appended watermark element | number | 9 |
| Attributes | image | image | Image source, it is recommended to export 2x or 3x image, high priority | string | — |
| Attributes | content | content | Watermark text content | string/arraystring[] | Element Plus |
| Attributes | font | font | Text style | [Font](#font) | [Font](#font) |
| Attributes | gap | gap | The spacing between watermarks | array[number, number] | \[100, 100\] |
| Attributes | offset | offset | The offset of the watermark from the upper left corner of the container. The default is `gap/2` | array[number, number] | \[gap\[0\]/2, gap\[1\]/2\] |
| Font | color | color | font color | string | rgba(0,0,0,.15) |
| Font | fontSize | fontSize | font size | number / string | 16 |
| Font | fontWeight | fontWeight | font weight | enum'normal' \| 'bold' \| 'lighter' \| 'bolder' \| number | normal |
| Font | fontFamily | fontFamily | font family | string | sans-serif |
| Font | fontGap | fontGap | font gap | number | 3 |
| Font | fontStyle | fontStyle | font style | enum'none' \| 'normal' \| 'italic' \| 'oblique' | normal |
| Font | textAlign | textAlign | text align | enum'left' \| 'right' \| 'center' \| 'start' \| 'end'  | center |
| Font | textBaseline | textBaseline | text baseline | enum'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom' | hanging |
| Slots | default | children | container for adding watermark |  | — |

## 完成记录

- [x] watermark:56 width；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:57 height；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:58 rotate；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:59 zIndex；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:60 image；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:61 content；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:62 font；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:63 gap；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:64 offset；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:70 color；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:71 fontSize；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:72 fontWeight；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:73 fontFamily；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:74 fontGap；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:75 fontStyle；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:76 textAlign；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:77 textBaseline；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
- [x] watermark:83 children；实现：packages/components/watermark/index.tsx；测试：tests/watermark.test.tsx
