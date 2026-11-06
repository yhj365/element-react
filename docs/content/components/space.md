# Space 间距

支持方向、换行、数组间距和分隔内容。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 间距与分隔

支持方向、换行、数组间距和分隔内容。

```tsx
import { Space, Button } from 'element-react';

/** 支持方向、换行、数组间距和分隔内容。 */
export default function Example() {
  return (
    <Space size={[16, 12]} wrap spacer="/">
      <Button>首页</Button>
      <Button>文档</Button>
      <Button>示例</Button>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | alignment | alignment | Controls the alignment of items | enum'center' \| 'normal' \| 'stretch' \| ... [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) | center |
| Attributes | class | className | className | string / object / array | — |
| Attributes | direction | direction | Placement direction | enum'vertical' \| 'horizontal' | horizontal |
| Attributes | style | style | Extra style rules | string / objectCSSProperties \| CSSProperties[] \| string[] | — |
| Attributes | spacer | spacer | Spacer | string / number / VNode | — |
| Attributes | size | size | Spacing size | enum'default' \| 'small' \| 'large' / number / array[number, number] | small |
| Attributes | wrap | wrap | Auto wrapping | boolean | false |
| Attributes | fill | fill | Whether to fill the container | boolean | false |
| Attributes | fill-ratio | fillRatio | Ratio of fill | number | 100 |
| Slots | default | children | 详见来源契约 |  | — |

## 完成记录

- [x] space:128 alignment；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:129 className；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:130 direction；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:132 style；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:133 spacer；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:134 size；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:135 wrap；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:136 fill；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:137 fillRatio；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] space:143 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
