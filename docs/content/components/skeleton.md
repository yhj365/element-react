# Skeleton 骨架屏

可切换加载与实际内容，支持定制模板。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 骨架占位

可切换加载与实际内容，支持定制模板。

```tsx
import { useState } from 'react';
import { Skeleton, SkeletonItem, Button, Space } from 'element-react';

/** 可切换加载与实际内容，支持定制模板。 */
export default function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" fill>
      <Button onClick={() => setLoading(!loading)}>切换加载状态</Button>
      <Skeleton
        loading={loading}
        animated
        rows={3}
        renderTemplate={
          <Space>
            <SkeletonItem variant="circle" style={{ width: 48, height: 48 }} />
            <div style={{ width: 220 }}>
              <SkeletonItem />
              <SkeletonItem />
            </div>
          </Space>
        }
      >
        <p>加载完成的实际内容。</p>
      </Skeleton>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Skeleton Attributes | animated | animated | whether showing the animation | boolean | false |
| Skeleton Attributes | count | count | how many fake items to render to the DOM | number | 1 |
| Skeleton Attributes | loading | loading | whether showing the real DOM | boolean | false |
| Skeleton Attributes | rows | rows | numbers of the row, only useful when no template slot were given | number | 3 |
| Skeleton Attributes | throttle | throttle | rendering delay in milliseconds. Numbers represent delayed display, and can also be set to delay hide, for example `{ leading: 500, trailing: 500 }`. When needing to control the initial value of loading, you can set `{ initVal: true }` | number / object{ leading?: number, trailing?: number, initVal?: boolean } | 0 |
| Skeleton Slots | default | children | real rendering DOM | object$attrs | — |
| Skeleton Slots | template | renderTemplate | content as rendering skeleton template | object{ key: number } | — |
| SkeletonItem Attributes | variant | variant | the current rendering skeleton type | enum'p' \| 'text' \| 'h1' \| 'h3' \| 'caption' \| 'button' \| 'image' \| 'circle' \| 'rect' | text |

## 完成记录

- [x] skeleton:128 animated；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:129 count；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:130 loading；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:131 rows；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:132 throttle；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:138 children；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:139 renderTemplate；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] skeleton:147 variant；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
