# Empty 空状态

说明和底部动作可以自定义。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 空状态

说明和底部动作可以自定义。

```tsx
import { Empty, Button } from 'element-react';

/** 说明和底部动作可以自定义。 */
export default function Example() {
  return (
    <Empty description="暂无匹配数据">
      <Button type="primary">创建第一条数据</Button>
    </Empty>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | image | image | image URL of empty | string | '' |
| Attributes | image-size | imageSize | image size (width) of empty | number | — |
| Attributes | description | description | description of empty | string | '' |
| Slots | default | children | content as bottom content |  | — |
| Slots | image | renderImage | content as image |  | — |
| Slots | description | renderDescription | content as description |  | — |

## 完成记录

- [x] empty:75 image；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] empty:76 imageSize；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] empty:77 description；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] empty:83 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] empty:84 renderImage；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] empty:85 renderDescription；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
