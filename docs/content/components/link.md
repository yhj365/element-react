# Link 链接

普通链接保留浏览器行为，禁用状态不触发导航。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 链接

普通链接保留浏览器行为，禁用状态不触发导航。

```tsx
import { Link, Glyph, Space } from 'element-react';

/** 普通链接保留浏览器行为，禁用状态不触发导航。 */
export default function Example() {
  return (
    <Space>
      <Link type="primary" href="https://element-plus.org" target="_blank" rel="noreferrer">
        来源文档
      </Link>
      <Link underline="always" renderIcon={<Glyph name="arrow" />}>
        带图标
      </Link>
      <Link disabled href="#">
        禁用链接
      </Link>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | type | type | type | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default' | default |
| Attributes | underline | underline | when underlines should appear | enum'always' \| 'hover' \| 'never' \| boolean | hover |
| Attributes | disabled | disabled | whether the component is disabled | boolean | false |
| Attributes | href | href | same as native hyperlink's `href` | string | — |
| Attributes | target | target | same as native hyperlink's `target` | enum'_blank' \| '_parent' \| '_self' \| '_top' | \_self |
| Attributes | icon | icon | icon component | string / Component | — |
| Slots | default | children | customize default content |  | — |
| Slots | icon | renderIcon | customize icon component |  | — |

## 完成记录

- [x] link:107 type；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:108 underline；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:109 disabled；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:110 href；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:111 target；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:112 icon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:118 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] link:119 renderIcon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
