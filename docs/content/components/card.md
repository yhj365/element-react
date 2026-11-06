# Card 卡片

头部、正文和底部支持独立内容和样式。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 卡片区域

头部、正文和底部支持独立内容和样式。

```tsx
import { Card, Button } from 'element-react';

/** 头部、正文和底部支持独立内容和样式。 */
export default function Example() {
  return (
    <Card
      header="项目进度"
      footer="最近更新：今天"
      shadow="hover"
      bodyStyle={{ padding: 20 }}
      renderHeader={
        <span>
          项目进度{' '}
          <Button text size="small">
            查看详情
          </Button>
        </span>
      }
    >
      <p>组件与主题分别维护，文档展示已验证的接口。</p>
    </Card>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | header | header | title of the card. Also accepts a DOM passed by `slot#header` | string | — |
| Attributes | footer | footer | footer of the card. Also accepts a DOM passed by `slot#footer` | string | — |
| Attributes | body-style | bodyStyle | CSS style of card body | objectCSSProperties | — |
| Attributes | header-class | headerClass | custom class name of card header | string | — |
| Attributes | body-class | bodyClass | custom class name of card body | string | — |
| Attributes | footer-class | footerClass | custom class name of card footer | string | — |
| Attributes | shadow | shadow | when to show card shadows | enumalways \| never \| hover | always |
| Slots | default | children | customize default content |  | — |
| Slots | header | renderHeader | content of the Card header |  | — |
| Slots | footer | renderFooter | content of the Card footer |  | — |

## 完成记录

- [x] card:56 header；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:57 footer；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:58 bodyStyle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:59 headerClass；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:60 bodyClass；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:61 footerClass；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:62 shadow；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:68 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:69 renderHeader；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] card:70 renderFooter；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
