# Container 容器

组合顶部、侧栏、主内容和底部。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 页面容器

组合顶部、侧栏、主内容和底部。

```tsx
import { Container, Header, Aside, Main, Footer } from 'element-react';

/** 组合顶部、侧栏、主内容和底部。 */
export default function Example() {
  return (
    <Container style={{ border: '1px solid var(--el-border-color)', minHeight: 200 }}>
      <Header height="48px" style={{ background: 'var(--el-fill-color)' }}>
        Header
      </Header>
      <Container>
        <Aside width="120px" style={{ background: 'var(--el-fill-color-light)' }}>
          Aside
        </Aside>
        <Main>Main</Main>
      </Container>
      <Footer height="40px">Footer</Footer>
    </Container>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Container Attributes | direction | direction | layout direction for child elements | enum'horizontal' \| 'vertical' | vertical when nested with `el-header` or `el-footer`; horizontal otherwise |
| Container Slots | default | children | customize default content |  | — |
| Header Attributes | height | height | height of the header | string | 60px |
| Header Slots | default | children | customize default content |  | — |
| Aside Attributes | width | width | width of the side section | string | 300px |
| Aside Slots | default | children | customize default content |  | — |
| Main Slots | default | children | customize default content |  | — |
| Footer Attributes | height | height | height of the footer | string | 60px |
| Footer Slots | default | children | customize default content |  | — |

## 完成记录

- [x] container:88 direction；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:94 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:102 height；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:108 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:116 width；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:122 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:130 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:138 height；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
- [x] container:144 children；实现：packages/components/layout/index.tsx；测试：tests/layout-display.test.tsx
