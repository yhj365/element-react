# InfiniteScroll 无限滚动

滚动阈值、加载限制与自动补充。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 无限滚动

滚动阈值、加载限制与自动补充。

```tsx
import { useState } from 'react';
import { InfiniteScroll } from 'element-react';

/** 内容不足会继续补充，达到上限后由业务关闭加载。 */
export default function Example() {
  const [count, setCount] = useState(6);
  return (
    <InfiniteScroll
      onLoad={() => setCount((value) => Math.min(60, value + 6))}
      disabled={count >= 60}
      distance={12}
      className="h-56 overflow-auto"
    >
      <ul className="m-0 list-none space-y-2 p-2">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="bg-[var(--el-color-primary-light-9)] p-3 text-center">
            {index + 1}
          </li>
        ))}
      </ul>
      {count >= 60 && <p>已加载全部内容</p>}
    </InfiniteScroll>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Directives | v-infinite-scroll | onLoad / useInfiniteScroll | Load more data while reach bottom of the page | Function | — |
| Directives | infinite-scroll-disabled | disabled | is disabled | boolean | false |
| Directives | infinite-scroll-delay | delay | throttle delay (ms) | number | 200 |
| Directives | infinite-scroll-distance | distance | trigger distance (px) | number | 0 |
| Directives | infinite-scroll-immediate | immediate | Whether to execute the loading method immediately, in case the content cannot be filled up in the initial state. | boolean | true |

## 完成记录

- [x] infinite-scroll:38 onLoad / useInfiniteScroll；实现：packages/components/infinite-scroll/index.tsx；测试：tests/infinite-scroll.test.tsx
- [x] infinite-scroll:39 disabled；实现：packages/components/infinite-scroll/index.tsx；测试：tests/infinite-scroll.test.tsx
- [x] infinite-scroll:40 delay；实现：packages/components/infinite-scroll/index.tsx；测试：tests/infinite-scroll.test.tsx
- [x] infinite-scroll:41 distance；实现：packages/components/infinite-scroll/index.tsx；测试：tests/infinite-scroll.test.tsx
- [x] infinite-scroll:42 immediate；实现：packages/components/infinite-scroll/index.tsx；测试：tests/infinite-scroll.test.tsx
