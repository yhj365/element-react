# Rate 评分

评分预览、半星、清零及禁用展示。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 评分交互

评分预览、半星、清零及禁用展示。

```tsx
import { useState } from 'react';
import { Rate, Space } from 'element-react';

/** 鼠标预览、半星、清零和只读分数展示。 */
export default function Example() {
  const [value, setValue] = useState(3);
  return (
    <Space direction="vertical" alignment="start">
      <Rate value={value} onValueChange={setValue} allowHalf clearable showText ariaLabel="评价" />
      <Rate value={3.7} disabled showScore scoreTemplate="{value} 分" />
      <Rate defaultValue={2} colors={['#f56c6c', '#e6a23c', '#67c23a']} showText />
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | number | 0 |
| Attributes | max | max | max rating score | number | 5 |
| Attributes | size | size | size of Rate | enum'large' \| 'default' \| 'small' | — |
| Attributes | disabled | disabled | whether Rate is read-only | boolean | false |
| Attributes | allow-half | allowHalf | whether picking half start is allowed | boolean | false |
| Attributes | low-threshold | lowThreshold | threshold value between low and medium level. The value itself will be included in low level | number | 2 |
| Attributes | high-threshold | highThreshold | threshold value between medium and high level. The value itself will be included in high level | number | 4 |
| Attributes | colors | colors | colors for icons. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding color | arraystring[] / objectRecord<number, string> | ['#f7ba2a', '#f7ba2a', '#f7ba2a'] |
| Attributes | void-color | voidColor | color of unselected icons | string | #c6d1de |
| Attributes | disabled-void-color | disabledVoidColor | color of unselected read-only icons | string | #eff2f7 |
| Attributes | icons | icons | icon components. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding icon component | arraystring[] \| Component[] / objectRecord<number, string \| Component> | [StarFilled, StarFilled, StarFilled] |
| Attributes | void-icon | voidIcon | component of unselected icons | string / Component | Star |
| Attributes | disabled-void-icon | disabledVoidIcon | component of unselected read-only icons | string / Component | StarFilled |
| Attributes | show-text | showText | whether to display texts | boolean | false |
| Attributes | show-score | showScore | whether to display current score. show-score and show-text cannot be true at the same time | boolean | false |
| Attributes | text-color | textColor | color of texts | string | '' |
| Attributes | texts | texts | text array | arraystring[] | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] |
| Attributes | score-template | scoreTemplate | score template | string | {value} |
| Attributes | clearable | clearable | whether value can be reset to `0` | boolean | false |
| Attributes | id | id | native `id` attribute | string | — |
| Attributes | aria-label | ariaLabel | same as `aria-label` in Rate | string | — |
| Events | change | onChange | Triggers when rate value is changed | Function(value: number) => void | — |
| Exposes | setCurrentValue | ref.current.setCurrentValue | set current value | Function(value: number) => void | — |
| Exposes | resetCurrentValue | ref.current.resetCurrentValue | reset current value | Function() => void | — |

## 完成记录

- [x] rate:92 value / defaultValue / onValueChange；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:93 max；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:94 size；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:95 disabled；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:96 allowHalf；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:97 lowThreshold；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:98 highThreshold；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:99 colors；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:100 voidColor；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:101 disabledVoidColor；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:102 icons；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:103 voidIcon；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:104 disabledVoidIcon；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:105 showText；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:106 showScore；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:107 textColor；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:108 texts；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:109 scoreTemplate；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:110 clearable；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:111 id；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:112 ariaLabel；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:119 onChange；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:125 ref.current.setCurrentValue；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] rate:126 ref.current.resetCurrentValue；实现：packages/components/rate/index.tsx；测试：tests/navigation-extra.test.tsx
