# Popconfirm 气泡确认

独立的确认取消动作与内容定制。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 气泡确认

独立的确认取消动作与内容定制。

```tsx
import { useState } from 'react';
import { Button, Popconfirm, Text, Space } from 'element-react';
/** 确认和取消分别通知，业务操作由调用方执行。 */
export default function Example() {
  const [message, setMessage] = useState('');
  return (
    <Space>
      <Popconfirm
        title="确定删除这条记录吗？"
        confirmButtonText="确定"
        cancelButtonText="取消"
        onConfirm={() => setMessage('已确认')}
        onCancel={() => setMessage('已取消')}
        renderReference={
          <Button type="danger" plain>
            删除记录
          </Button>
        }
      />
      <Text>{message}</Text>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | title | title | Title | string | — |
| Attributes | effect | effect | Tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| Attributes | confirm-button-text | confirmButtonText | Confirm button text | string | — |
| Attributes | cancel-button-text | cancelButtonText | Cancel button text | string | — |
| Attributes | confirm-button-type | confirmButtonType | Confirm button type | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' | primary |
| Attributes | cancel-button-type | cancelButtonType | Cancel button type | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' | text |
| Attributes | icon | icon | Icon Component | string / Component | QuestionFilled |
| Attributes | icon-color | iconColor | Icon color | string | #f90 |
| Attributes | hide-icon | hideIcon | is hide Icon | boolean | false |
| Attributes | hide-after | hideAfter | delay of disappear, in millisecond | number | 200 |
| Attributes | teleported | teleported | whether popconfirm is teleported to the body | boolean | true |
| Attributes | persistent | persistent | when popconfirm inactive and `persistent` is `false` , popconfirm will be destroyed | boolean | false |
| Attributes | width | width | popconfirm width, min width 150px | string / number | 150 |
| Events | confirm | onConfirm | triggers when click confirm button | Function(e: MouseEvent) => void | — |
| Events | cancel | onCancel | triggers when click cancel button | Function(e: MouseEvent) => void | — |
| Slots | reference | renderReference | HTML element that triggers Popconfirm | — | — |
| Slots | actions | renderActions | content of the Popconfirm footer | object{ confirm: (e: MouseEvent) => void, cancel: (e: MouseEvent) => void } | — |

## 完成记录

- [x] popconfirm:56 title；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:57 effect；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:58 confirmButtonText；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:59 cancelButtonText；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:60 confirmButtonType；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:61 cancelButtonType；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:62 icon；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:63 iconColor；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:64 hideIcon；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:65 hideAfter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:66 teleported；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:67 persistent；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:68 width；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:75 onConfirm；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:76 onCancel；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:82 renderReference；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popconfirm:83 renderActions；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
