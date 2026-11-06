# Divider 分割线

水平内容位置、边框样式与垂直分隔。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 分割线

水平内容位置、边框样式与垂直分隔。

```tsx
import { Divider } from 'element-react';

/** 水平内容位置、边框样式与垂直分隔。 */
export default function Example() {
  return (
    <div>
      <p>上方内容</p>
      <Divider contentPosition="left" borderStyle="dashed">
        分隔文字
      </Divider>
      <p>下方内容</p>
      <span>
        首页
        <Divider direction="vertical" />
        文档
      </span>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | direction | direction | Set divider's direction | enum'horizontal' \| 'vertical' | horizontal |
| Attributes | border-style | borderStyle | Set the style of divider | enum'none' \| 'solid' \| 'hidden' \| 'dashed' \| ... [css/border-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-style) | solid |
| Attributes | content-position | contentPosition | The position of the customized content on the divider line | enum'left' \| 'right' \| 'center' | center |
| Slots | default | children | Customized content on the divider line |  | — |

## 完成记录

- [x] divider:54 direction；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] divider:55 borderStyle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] divider:56 contentPosition；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] divider:62 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
