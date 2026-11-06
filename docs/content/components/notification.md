# Notification 通知

独立位置堆叠和关闭控制。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 通知

独立位置堆叠和关闭控制。

```tsx
import { Button, Notification, Space } from 'element-react';
/** 不同方向的通知分别堆叠，duration为0时持续展示。 */
export default function Example() {
  return (
    <Space>
      <Button onClick={() => Notification.success({ title: '操作成功', message: '数据已保存。' })}>
        成功通知
      </Button>
      <Button
        onClick={() =>
          Notification({
            title: '持续通知',
            message: '可点击关闭按钮。',
            duration: 0,
            position: 'bottom-right',
          })
        }
      >
        右下角通知
      </Button>
      <Button onClick={() => Notification.closeAll()}>关闭全部</Button>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Options | title | title | title | string | '' |
| Options | message | message | description text | string / VNode / Function() => VNode | '' |
| Options | dangerouslyUseHTMLString | dangerouslyUseHTMLString | whether `message` is treated as HTML string | boolean | false |
| Options | type | type | notification type | enum'primary' (2.9.11) \| 'success' \| 'warning' \| 'info' \| 'error' \| '' | '' |
| Options | icon | icon | custom icon component. It will be overridden by `type` | string / Component | — |
| Options | customClass | customClass | custom class name for Notification | string | '' |
| Options | duration | duration | duration before close. It will not automatically close if set 0 | number | 4500 |
| Options | position | position | custom position | enum'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | top-right |
| Options | showClose | showClose | whether to show a close button | boolean | true |
| Options | onClose | onClose | callback function when closed | Function() => void | — |
| Options | onClick | onClick | callback function when notification clicked | Function() => void | — |
| Options | offset | offset | offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset | number | 0 |
| Options | appendTo | appendTo | set the root element for the notification, default to `document.body` | CSSSelector / HTMLElement | — |
| Options | zIndex | zIndex | initial zIndex | number | 0 |
| Options | closeIcon | closeIcon | custom close icon | string / Component | Close |
| Options | pauseOnHover | pauseOnHover | whether to pause the timer when hovering over the notification | boolean | true |
| Method | close | ref.current.close | close the Notification | Function() => void | — |

## 完成记录

- [x] notification:142 title；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:143 message；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:144 dangerouslyUseHTMLString；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:145 type；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:146 icon；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:147 customClass；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:148 duration；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:149 position；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:150 showClose；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:151 onClose；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:152 onClick；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:153 offset；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:154 appendTo；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:155 zIndex；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:156 closeIcon；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:158 pauseOnHover；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
- [x] notification:166 ref.current.close；实现：packages/components/services/message.tsx；测试：tests/services.test.tsx
