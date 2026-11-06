# Anchor 锚点

局部滚动、章节定位与目录联动。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 锚点目录

局部滚动、章节定位与目录联动。

```tsx
import { useRef } from 'react';
import { Anchor, AnchorLink } from 'element-react';

/** 目录滚动限定到示例容器，不改变文档站当前路由。 */
export default function Example() {
  const container = useRef<HTMLDivElement>(null);
  return (
    <div className="flex gap-6">
      <Anchor
        container={() => container.current}
        offset={8}
        selectScrollTop
        onClick={(event) => event.preventDefault()}
      >
        <AnchorLink href="#anchor-demo-one" title="第一节" />
        <AnchorLink href="#anchor-demo-two" title="第二节" />
        <AnchorLink href="#anchor-demo-three" title="第三节" />
      </Anchor>
      <div ref={container} className="h-60 flex-1 overflow-auto border border-[var(--el-border-color)] px-4">
        <section id="anchor-demo-one" className="h-48">
          <h3>第一节</h3>
        </section>
        <section id="anchor-demo-two" className="h-48">
          <h3>第二节</h3>
        </section>
        <section id="anchor-demo-three" className="h-60">
          <h3>第三节</h3>
        </section>
      </div>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Anchor Attributes | container | container | Scroll container. | string \| HTMLElement \| Window | — |
| Anchor Attributes | offset | offset | Set the offset of the anchor scroll. | number | 0 |
| Anchor Attributes | bound | bound | The offset of the element starting to trigger the anchor. | number | 15 |
| Anchor Attributes | duration | duration | Set the scroll duration of the container, in milliseconds. | number | 300 |
| Anchor Attributes | marker | marker | Whether to show the marker. | boolean | true |
| Anchor Attributes | type | type | Set Anchor type. | enum'default' \| 'underline' | `default` |
| Anchor Attributes | direction | direction | Set Anchor direction. | enum'vertical' \| 'horizontal' | `vertical` |
| Anchor Attributes | select-scroll-top | selectScrollTop | Scroll whether link is selected at the top | boolean | false |
| Anchor Events | change | onChange | Callback when the step changes | Function(href: string) => void | — |
| Anchor Events | click | onClick | Triggered when the user clicks on the link | Function(e: MouseEvent, href?: string) => void | — |
| Anchor Exposes | scrollTo | ref.current.scrollTo | Manually scroll to the specific position. | Function(href: string) => void | — |
| Anchor Slots | default | children | AnchorLink component list |  | — |
| AnchorLink Attributes | title | title | The text content of the anchor link. | string | — |
| AnchorLink Attributes | href | href | The address of the anchor link. | string | — |
| AnchorLink Slots | default | children | The content of the anchor link. |  | — |
| AnchorLink Slots | sub-link | renderSubLink | Slots for child links. |  | — |

## 完成记录

- [x] anchor:82 container；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:83 offset；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:84 bound；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:85 duration；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:86 marker；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:87 type；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:88 direction；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:89 selectScrollTop；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:95 onChange；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:96 onClick；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:102 ref.current.scrollTo；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:108 children；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:114 title；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:115 href；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:121 children；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
- [x] anchor:122 renderSubLink；实现：packages/components/anchor/index.tsx；测试：tests/anchor.test.tsx
