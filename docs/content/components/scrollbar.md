# Scrollbar 滚动条

原生滚动与可拖动滑块。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 自定义滚动条

原生滚动与可拖动滑块。

```tsx
import { Scrollbar } from 'element-react';
/** 原生滚动容器配合可拖动滚动条。 */
export default function Example() {
  return (
    <Scrollbar height={200} always>
      {Array.from({ length: 20 }, (_, i) => (
        <p
          key={i}
          style={{
            height: 36,
            background: 'var(--el-fill-color-light)',
            borderRadius: 4,
            textAlign: 'center',
            lineHeight: '36px',
          }}
        >
          {i + 1}
        </p>
      ))}
    </Scrollbar>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | height | height | height of scrollbar | string / number | — |
| Attributes | max-height | maxHeight | max height of scrollbar | string / number | — |
| Attributes | native | native | whether to use the native scrollbar style | boolean | false |
| Attributes | wrap-style | wrapStyle | style of wrap container | string / objectCSSProperties \| CSSProperties[] \| string[] | — |
| Attributes | wrap-class | wrapClass | class of wrap container | string | — |
| Attributes | view-style | viewStyle | style of view | string / objectCSSProperties \| CSSProperties[] \| string[] | — |
| Attributes | view-class | viewClass | class of view | string | — |
| Attributes | noresize | noresize | do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance | boolean | false |
| Attributes | tag | tag | element tag of the view | string | div |
| Attributes | always | always | always show scrollbar | boolean | false |
| Attributes | min-size | minSize | minimum size of scrollbar | number | 20 |
| Attributes | id | id | id of view | string | — |
| Attributes | role | role | role of view | string | — |
| Attributes | aria-label | ariaLabel | aria-label of view | string | — |
| Attributes | aria-orientation | ariaOrientation | aria-orientation of view | enum'horizontal' \| 'vertical' | — |
| Attributes | tabindex | tabIndex | tabindex of wrap container | number / string | — |
| Attributes | distance | distance | trigger end-reached event distance(px) | number | 0 |
| Events | scroll | onScroll | triggers when scrolling, return distance of scrolling | Function({ scrollLeft: number, scrollTop: number }) => void | — |
| Events | end-reached | onEndReached | triggers when the end of a scroll is triggered | Function(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void | — |
| Slots | default | children | customize default content |  | — |
| Exposes | handleScroll | ref.current.handleScroll | handle scroll event | Function() => void | — |
| Exposes | scrollTo | ref.current.scrollTo | scrolls to a particular set of coordinates | Function(options: ScrollToOptions \| number, yCoord?: number) => void | — |
| Exposes | setScrollTop | ref.current.setScrollTop | Set distance to scroll top | Function(scrollTop: number) => void | — |
| Exposes | setScrollLeft | ref.current.setScrollLeft | Set distance to scroll left | Function(scrollLeft: number) => void | — |
| Exposes | update | ref.current.update | update scrollbar state manually | Function() => void | — |
| Exposes | wrapRef | ref.current.wrapRef | scrollbar wrap ref | objectRef<HTMLDivElement> | — |

## 完成记录

- [x] scrollbar:56 height；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:57 maxHeight；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:58 native；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:59 wrapStyle；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:60 wrapClass；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:61 viewStyle；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:62 viewClass；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:63 noresize；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:64 tag；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:65 always；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:66 minSize；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:67 id；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:68 role；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:69 ariaLabel；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:70 ariaOrientation；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:71 tabIndex；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:72 distance；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:78 onScroll；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:79 onEndReached；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:85 children；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:91 ref.current.handleScroll；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:92 ref.current.scrollTo；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:93 ref.current.setScrollTop；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:94 ref.current.setScrollLeft；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:95 ref.current.update；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
- [x] scrollbar:96 ref.current.wrapRef；实现：packages/components/scrollbar/index.tsx；测试：tests/scroll-image.test.tsx
