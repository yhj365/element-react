# Layout 布局

行间距、列占比和对齐。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 24栅格

行间距、列占比和对齐。

```tsx
import { Row, Col, Card } from 'element-react';

/** 行间距、列占比和对齐。 */
export default function Example() {
  return (
    <Row gutter={16} justify="space-between" align="middle">
      <Col span={8}>
        <Card shadow="never">8 / 24</Card>
      </Col>
      <Col span={8}>
        <Card shadow="never">8 / 24</Card>
      </Col>
      <Col span={8}>
        <Card shadow="never">8 / 24</Card>
      </Col>
    </Row>
  );
}
```

### 响应式列

在窄容器中按断点切换列宽。

```tsx
import { Row, Col, Card } from 'element-react';

/** 在窄容器中按断点切换列宽。 */
export default function Example() {
  return (
    <Row gutter={16}>
      {[1, 2, 3].map((item) => (
        <Col key={item} xs={24} sm={12} md={8}>
          <Card shadow="never">区域 {item}</Card>
        </Col>
      ))}
    </Row>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Row Attributes | gutter | gutter | grid spacing | number | 0 |
| Row Attributes | justify | justify | horizontal alignment of flex layout | enum'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly' | start |
| Row Attributes | align | align | vertical alignment of flex layout | enum'top' \| 'middle' \| 'bottom' | — |
| Row Attributes | tag | tag | custom element tag | string | div |
| Row Slots | default | children | customize default content |  | — |
| Col Attributes | span | span | number of column the grid spans | number | 24 |
| Col Attributes | offset | offset | number of spacing on the left side of the grid | number | 0 |
| Col Attributes | push | push | number of columns that grid moves to the right | number | 0 |
| Col Attributes | pull | pull | number of columns that grid moves to the left | number | 0 |
| Col Attributes | xs | xs | `<768px` Responsive columns or column props object | number / object{span?: number, offset?: number, pull?: number, push?: number} | — |
| Col Attributes | sm | sm | `≥768px` Responsive columns or column props object | number / object{span?: number, offset?: number, pull?: number, push?: number} | — |
| Col Attributes | md | md | `≥992px` Responsive columns or column props object | number / object{span?: number, offset?: number, pull?: number, push?: number} | — |
| Col Attributes | lg | lg | `≥1200px` Responsive columns or column props object | number / object{span?: number, offset?: number, pull?: number, push?: number} | — |
| Col Attributes | xl | xl | `≥1920px` Responsive columns or column props object | number / object{span?: number, offset?: number, pull?: number, push?: number} | — |
| Col Attributes | tag | tag | custom element tag | string | div |
| Col Slots | default | children | customize default content |  | — |

## 完成记录

- [x] layout:112 gutter；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:113 justify；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:114 align；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:115 tag；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:121 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:129 span；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:130 offset；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:131 push；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:132 pull；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:133 xs；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:134 sm；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:135 md；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:136 lg；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:137 xl；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:138 tag；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] layout:144 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
