# Timeline 时间轴

时间戳、节点类型及自定义图形。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 时间轴

时间戳、节点类型及自定义图形。

```tsx
import { Timeline, TimelineItem } from 'element-react';

/** 时间戳、节点类型及自定义图形。 */
export default function Example() {
  return (
    <Timeline>
      <TimelineItem timestamp="2026-11-05 09:00" type="primary" placement="top">
        开始实施
      </TimelineItem>
      <TimelineItem timestamp="2026-11-05 10:00" type="success" hollow>
        通过测试
      </TimelineItem>
      <TimelineItem timestamp="2026-11-05 11:00" renderDot="✓">
        生成文档
      </TimelineItem>
    </Timeline>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Timeline Attributes | reverse | reverse | whether reverse order | boolean | false |
| Timeline Slots | default | children | customize default content for timeline |  | — |
| Timeline-Item Attributes | timestamp | timestamp | timestamp content | string | '' |
| Timeline-Item Attributes | hide-timestamp | hideTimestamp | whether to show timestamp | boolean | false |
| Timeline-Item Attributes | center | center | whether vertically centered | boolean | false |
| Timeline-Item Attributes | placement | placement | position of timestamp | enum'top' \| 'bottom' | bottom |
| Timeline-Item Attributes | type | type | node type | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | '' |
| Timeline-Item Attributes | color | color | background color of node | string | '' |
| Timeline-Item Attributes | size | size | node size | enum'normal' \| 'large' | normal |
| Timeline-Item Attributes | icon | icon | icon component | string / Component | — |
| Timeline-Item Attributes | hollow | hollow | icon is hollow | boolean | false |
| Timeline-Item Slots | default | children | customize default content for timeline item |  | — |
| Timeline-Item Slots | dot | renderDot | customize defined node for timeline item |  | — |

## 完成记录

- [x] timeline:82 reverse；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:89 children；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:97 timestamp；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:98 hideTimestamp；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:99 center；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:100 placement；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:101 type；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:102 color；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:103 size；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:104 icon；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:105 hollow；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:111 children；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] timeline:112 renderDot；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
