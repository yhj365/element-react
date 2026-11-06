# Progress 进度

线形与圆环进度、自定义文字和动画。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 进度展示

线形与圆环进度、自定义文字和动画。

```tsx
import { Progress, Space } from 'element-react';

/** 线形与圆环进度、自定义文字和动画。 */
export default function Example() {
  return (
    <Space direction="vertical" fill>
      <Progress percentage={35} />
      <Progress percentage={70} color="#67c23a" striped stripedFlow />
      <Progress percentage={60} textInside strokeWidth={20} format={(value) => value + '%'} />
      <Space>
        <Progress type="circle" percentage={75} />
        <Progress type="dashboard" percentage={50} />
      </Space>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | percentage | percentage | percentage | number(0-100) | 0 |
| Attributes | type | type | the type of progress bar | enum'line' \| 'circle' \| 'dashboard' | line |
| Attributes | stroke-width | strokeWidth | the width of progress bar | number | 6 |
| Attributes | text-inside | textInside | whether to place the percentage inside progress bar, only works when `type` is 'line' | boolean | false |
| Attributes | indeterminate | indeterminate | set indeterminate progress | boolean | false |
| Attributes | duration | duration | control the animation duration of indeterminate progress or striped flow progress | number | 3 |
| Attributes | color | color | background color of progress bar. Overrides `status` prop | string / function(percentage: number) => string / Array{ color: string; percentage: number }[] | '' |
| Attributes | width | width | the canvas width of circle progress bar | number | 126 |
| Attributes | show-text | showText | whether to show percentage | boolean | true |
| Attributes | stroke-linecap | strokeLinecap | circle/dashboard type shape at the end path | enum'butt' \| 'round' \| 'square' | round |
| Attributes | format | format | custom text format | Function(percentage: number) => string | — |
| Attributes | striped | striped | stripe over the progress bar's color | boolean | false |
| Attributes | striped-flow | stripedFlow | get the stripes to flow | boolean | false |
| Slots | default | children | Customized content | object{ percentage: number } | — |

## 完成记录

- [x] progress:86 percentage；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:87 type；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:88 strokeWidth；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:89 textInside；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:91 indeterminate；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:92 duration；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:93 color；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:94 width；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:95 showText；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:96 strokeLinecap；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:97 format；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:98 striped；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:99 stripedFlow；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] progress:105 children；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
