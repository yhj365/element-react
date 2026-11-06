# Tag 标签

点击关闭由调用方更新列表，组件不自行删除。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 标签与关闭事件

点击关闭由调用方更新列表，组件不自行删除。

```tsx
import { useState } from 'react';
import { Tag, Space } from 'element-react';

/** 点击关闭由调用方更新列表，组件不自行删除。 */
export default function Example() {
  const [items, setItems] = useState(['进行中', '已完成', '待确认']);
  return (
    <Space wrap>
      {items.map((item, index) => (
        <Tag
          key={item}
          closable
          type={(['primary', 'success', 'warning'] as const)[index]}
          effect="light"
          onClose={() => setItems(items.filter((value) => value !== item))}
        >
          {item}
        </Tag>
      ))}
      <Tag round effect="plain">
        圆角标签
      </Tag>
    </Space>
  );
}
```

### 可勾选标签

支持受控勾选和键盘操作。

```tsx
import { useState } from 'react';
import { CheckTag, Space } from 'element-react';

/** 支持受控勾选和键盘操作。 */
export default function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Space>
      <CheckTag checked={checked} onCheckedChange={setChecked}>
        React
      </CheckTag>
      <CheckTag defaultChecked type="success">
        TypeScript
      </CheckTag>
      <CheckTag disabled>禁用</CheckTag>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Tag Attributes | type | type | type of Tag | enum'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' | primary |
| Tag Attributes | closable | closable | whether Tag can be removed | boolean | false |
| Tag Attributes | hit | hit | whether Tag has a highlighted border | boolean | false |
| Tag Attributes | color | color | background color of the Tag | string | — |
| Tag Attributes | size | size | size of Tag | enum'large' \| 'default' \| 'small' | — |
| Tag Attributes | effect | effect | theme of Tag | enum'dark' \| 'light' \| 'plain' | light |
| Tag Attributes | round | round | whether Tag is rounded | boolean | false |
| Tag Events | click | onClick | triggers when Tag is clicked | Function(evt: MouseEvent) => void | — |
| Tag Events | close | onClose | triggers when Tag is removed | Function(evt: MouseEvent) => void | — |
| Tag Slots | default | children | customize default content |  | — |
| CheckTag Attributes | checked / v-model:checked | checked / defaultChecked / onCheckedChange | is checked | boolean | false |
| CheckTag Attributes | disabled | disabled | whether the check-tag is disabled | boolean | false |
| CheckTag Attributes | type | type | type of CheckTag | enum'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' | primary |
| CheckTag Events | change | onChange | triggers when Check Tag is clicked | Function(value: boolean) => void | — |
| CheckTag Slots | default | children | customize default content |  | — |

## 完成记录

- [x] tag:82 type；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:83 closable；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:85 hit；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:86 color；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:87 size；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:88 effect；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:89 round；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:95 onClick；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:96 onClose；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:102 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:110 checked / defaultChecked / onCheckedChange；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:111 disabled；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:112 type；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:118 onChange；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] tag:124 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
