# PageHeader 页头

返回动作、面包屑及额外操作。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 页头与路径

返回动作、面包屑及额外操作。

```tsx
import { PageHeader, Button, Breadcrumb, BreadcrumbItem } from 'element-react';

/** 组合路径、返回动作与额外操作。 */
export default function Example() {
  return (
    <PageHeader
      title="返回"
      content="编辑项目"
      renderExtra={<Button type="primary">保存</Button>}
      renderBreadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>项目</BreadcrumbItem>
          <BreadcrumbItem>详情</BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <p>当前项目的说明内容。</p>
    </PageHeader>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | icon | icon | icon component of page header | string / Component | Back |
| Attributes | title | title | main title of page header, default is Back that built-in a11y | string | '' |
| Attributes | content | content | content of page header | string | '' |
| Events | back | onBack | triggers when right side is clicked | Function() => void | — |
| Slots | icon | renderIcon | content as icon |  | — |
| Slots | title | renderTitle | content as title |  | — |
| Slots | content | renderContent | content |  | — |
| Slots | extra | renderExtra | extra |  | — |
| Slots | breadcrumb | renderBreadcrumb | content as breadcrumb |  | — |
| Slots | default | children | main content |  | — |

## 完成记录

- [x] page-header:107 icon；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:108 title；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:109 content；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:115 onBack；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:121 renderIcon；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:122 renderTitle；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:123 renderContent；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:124 renderExtra；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:125 renderBreadcrumb；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] page-header:126 children；实现：packages/components/page-header/index.tsx；测试：tests/navigation-extra.test.tsx
