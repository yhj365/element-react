# Alert 提示

不同语义、图标、描述和关闭通知。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 提示信息

不同语义、图标、描述和关闭通知。

```tsx
import { Alert, Space } from 'element-react';

/** 不同语义、图标、描述和关闭通知。 */
export default function Example() {
  return (
    <Space direction="vertical" fill>
      <Alert title="操作成功" type="success" showIcon description="数据已经保存。" />
      <Alert title="请注意" type="warning" showIcon closeText="知道了">
        继续前请检查输入内容。
      </Alert>
      <Alert title="提示" effect="dark" closable={false} />
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | title | title | alert title. | string | — |
| Attributes | type | type | alert type. | enum'primary' (2.9.11) \| 'success' \| 'warning' \| 'info' \| 'error' | info |
| Attributes | description | description | descriptive text. | string | — |
| Attributes | closable | closable | whether alert can be dismissed. | boolean | true |
| Attributes | center | center | whether content is placed in the center. | boolean | false |
| Attributes | close-text | closeText | customized close button text. | string | — |
| Attributes | show-icon | showIcon | whether a type icon is displayed. | boolean | false |
| Attributes | effect | effect | theme style. | enum'light' \| 'dark' | light |
| Events | close | onClose | trigger when alert is closed. | Function(event: MouseEvent) => void | — |
| Slots | default | children | content of the alert description. |  | — |
| Slots | title | renderTitle | content of the alert title. |  | — |
| Slots | icon | renderIcon | content of the alert icon. |  | — |

## 完成记录

- [x] alert:84 title；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:85 type；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:86 description；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:87 closable；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:88 center；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:89 closeText；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:90 showIcon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:91 effect；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:97 onClose；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:103 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:104 renderTitle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] alert:105 renderIcon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
