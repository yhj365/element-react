# Badge 徽标

支持最大数字、小圆点和自定义内容。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 徽标

支持最大数字、小圆点和自定义内容。

```tsx
import { Badge, Button, Space } from 'element-react';

/** 支持最大数字、小圆点和自定义内容。 */
export default function Example() {
  return (
    <Space size={28} wrap>
      <Badge value={12}>
        <Button>消息</Button>
      </Badge>
      <Badge value={120} max={99}>
        <Button>通知</Button>
      </Badge>
      <Badge isDot>
        <Button>更新</Button>
      </Badge>
      <Badge value={3} type="success" renderContent={(value) => value + '条'}>
        <Button>完成</Button>
      </Badge>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | value | value | display value. | string / number | '' |
| Attributes | max | max | maximum value, shows `{max}+` when exceeded. Only works if value is a number. | number | 99 |
| Attributes | is-dot | isDot | if a little dot is displayed. | boolean | false |
| Attributes | hidden | hidden | hidden badge. | boolean | false |
| Attributes | type | type | badge type. | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | danger |
| Attributes | show-zero | showZero | Whether to show badge when value is zero. | boolean | true |
| Attributes | color | color | background color of the dot | string |  |
| Attributes | offset | offset | offset of badge | array[number, number] | [0, 0] |
| Attributes | badge-style | badgeStyle | custom style of badge | objectCSSProperties | — |
| Attributes | badge-class | badgeClass | custom class of badge | string | — |
| Slots | default | children | customize default content | - | — |
| Slots | content | renderContent | customize badge content | object{ value: string } | — |

## 完成记录

- [x] badge:64 value；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:65 max；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:66 isDot；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:67 hidden；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:68 type；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:69 showZero；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:70 color；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:71 offset；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:72 badgeStyle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:73 badgeClass；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:79 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] badge:80 renderContent；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
