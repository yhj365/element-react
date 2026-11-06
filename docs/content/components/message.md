# Message 消息提示

类型、重复分组和Provider绑定。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 消息提示

类型、重复分组和Provider绑定。

```tsx
import { Button, Message, Space, useMessage } from 'element-react';
/** 静态服务与Provider绑定的消息服务均支持实例关闭。 */
export default function Example() {
  const message = useMessage();
  return (
    <Space>
      <Button onClick={() => message.success('保存成功')}>成功消息</Button>
      <Button onClick={() => message({ message: '可关闭提示', showClose: true, duration: 0 })}>
        持续消息
      </Button>
      <Button onClick={() => Message({ message: '重复消息', grouping: true })}>合并重复</Button>
      <Button onClick={() => Message.closeAll()}>关闭全部</Button>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Options | message | message | message text | string / VNode / Function() => VNode | '' |
| Options | type | type | message type | enum'primary' (2.9.11) \| 'success' \| 'warning' \| 'info' \| 'error' | info |
| Options | plain | plain | whether message is plain | boolean | false |
| Options | icon | icon | custom icon component, overrides `type` | string / Component | — |
| Options | dangerouslyUseHTMLString | dangerouslyUseHTMLString | whether `message` is treated as HTML string | boolean | false |
| Options | customClass | customClass | custom class name for Message | string | '' |
| Options | duration | duration | display duration, millisecond. If set to 0, it will not turn off automatically | number | 3000 |
| Options | showClose | showClose | whether to show a close button | boolean | false |
| Options | onClose | onClose | callback function when closed with the message instance as the parameter | Function() => void | — |
| Options | offset | offset | set the distance to the viewport edge (top when placement is 'top', bottom when placement is 'bottom') | number | 16 |
| Options | placement | placement | message placement position | enum'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right' | top |
| Options | appendTo | appendTo | set the root element for the message, default to `document.body` | CSSSelector / HTMLElement | — |
| Options | grouping | grouping | merge messages with the same content, type of VNode message is not supported | boolean | false |
| Options | repeatNum | repeatNum | The number of repetitions, similar to badge, is used as the initial number when used with `grouping` | number | 1 |
| Methods | close | ref.current.close | close the Message | Function() => void | — |

## 完成记录

- [x] message:125 message；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:126 type；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:127 plain；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:128 icon；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:129 dangerouslyUseHTMLString；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:130 customClass；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:131 duration；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:132 showClose；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:133 onClose；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:134 offset；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:135 placement；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:136 appendTo；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:137 grouping；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:138 repeatNum；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] message:146 ref.current.close；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
