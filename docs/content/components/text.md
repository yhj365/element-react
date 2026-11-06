# Text 文字

文字语义、尺寸及单行、多行截断。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 文字层级与截断

文字语义、尺寸及单行、多行截断。

```tsx
import { Text, Space } from 'element-react';

/** 文字语义、尺寸及单行、多行截断。 */
export default function Example() {
  return (
    <Space direction="vertical" alignment="start">
      <Text>默认文字</Text>
      <Text type="primary">主要文字</Text>
      <Text size="small" type="info">
        辅助说明
      </Text>
      <Text truncated style={{ width: 180 }}>
        这是一段超出容器宽度后会截断的文字内容
      </Text>
      <Text lineClamp={2} style={{ width: 180 }}>
        多行文字超过两行时会省略。内容可以继续增长，但布局保持稳定，悬停可查看完整标题。
      </Text>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | type | type | text type | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | — |
| Attributes | size | size | text size | enum'large' \| 'default' \| 'small' | default |
| Attributes | truncated | truncated | render ellipsis | boolean | false |
| Attributes | line-clamp | lineClamp | maximum lines | string / number | — |
| Attributes | tag | tag | custom element tag | string | span |
| Slots | default | children | default content |  | — |

## 完成记录

- [x] text:56 type；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] text:57 size；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] text:58 truncated；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] text:59 lineClamp；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] text:60 tag；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] text:66 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
