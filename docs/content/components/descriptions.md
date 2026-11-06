# Descriptions 描述列表

表格布局、跨行跨列和区域定制。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 描述列表

表格布局、跨行跨列和区域定制。

```tsx
import { Descriptions, DescriptionsItem, Tag } from 'element-react';
/** 边框、跨列和区域样式由父级表格统一布局。 */
export default function Example() {
  return (
    <Descriptions title="用户信息" border column={2}>
      <DescriptionsItem label="姓名">Ada</DescriptionsItem>
      <DescriptionsItem label="角色">
        <Tag>管理员</Tag>
      </DescriptionsItem>
      <DescriptionsItem label="地址" span={2}>
        上海市
      </DescriptionsItem>
      <DescriptionsItem label="备注" labelWidth={90}>
        内容区域支持React节点。
      </DescriptionsItem>
    </Descriptions>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Descriptions Attributes | border | border | with or without border | boolean | false |
| Descriptions Attributes | column | column | numbers of `Descriptions Item` in one line | number | 3 |
| Descriptions Attributes | direction | direction | direction of list | enum'vertical' \| 'horizontal' | horizontal |
| Descriptions Attributes | size | size | size of list | enum'' \| 'large' \| 'default' \| 'small' | — |
| Descriptions Attributes | title | title | title text, display on the top left | string | '' |
| Descriptions Attributes | extra | extra | extra text, display on the top right | string | '' |
| Descriptions Attributes | label-width | labelWidth | label width of every column | string / number | — |
| Descriptions Slots | default | children | customize default content |  | — |
| Descriptions Slots | title | renderTitle | custom title, display on the top left |  | — |
| Descriptions Slots | extra | renderExtra | custom extra area, display on the top right |  | — |
| DescriptionsItem Attributes | label | label | label text | string | '' |
| DescriptionsItem Attributes | span | span | colspan of column | number | 1 |
| DescriptionsItem Attributes | rowspan | rowspan | the number of rows a cell should span | number | 1 |
| DescriptionsItem Attributes | width | width | column width, the width of the same column in different rows is set by the max value (If no `border`, width contains label and content) | string / number | '' |
| DescriptionsItem Attributes | min-width | minWidth | column minimum width, columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion (If no`border`, width contains label and content) | string / number | '' |
| DescriptionsItem Attributes | label-width | labelWidth | column label width, if not set, it will be the same as the width of the column. Higher priority than the `label-width` of `Descriptions` | string / number | — |
| DescriptionsItem Attributes | align | align | column content alignment (If no `border`, effective for both label and content) | enum'left' \| 'center' \| 'right' | left |
| DescriptionsItem Attributes | label-align | labelAlign | column label alignment, if omitted, the value of the above `align` attribute will be applied (If no `border`, please use `align` attribute) | enum'left' \| 'center' \| 'right' | — |
| DescriptionsItem Attributes | class-name | className | column content custom class name | string | '' |
| DescriptionsItem Attributes | label-class-name | labelClassName | column label custom class name | string | '' |
| DescriptionsItem Slots | default | children | customize default content |  | — |
| DescriptionsItem Slots | label | renderLabel | custom label |  | — |

## 完成记录

- [x] descriptions:56 border；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:57 column；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:58 direction；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:59 size；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:60 title；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:61 extra；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:62 labelWidth；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:68 children；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:69 renderTitle；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:70 renderExtra；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:78 label；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:79 span；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:80 rowspan；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:81 width；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:82 minWidth；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:83 labelWidth；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:84 align；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:85 labelAlign；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:86 className；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:87 labelClassName；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:93 children；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] descriptions:94 renderLabel；实现：packages/components/descriptions/index.tsx；测试：tests/descriptions-calendar.test.tsx
