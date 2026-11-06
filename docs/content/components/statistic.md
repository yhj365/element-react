# Statistic 统计

支持精度、分隔符、前后缀和自定义格式化。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 数字统计

支持精度、分隔符、前后缀和自定义格式化。

```tsx
import { Statistic, Space } from 'element-react';

/** 支持精度、分隔符、前后缀和自定义格式化。 */
export default function Example() {
  return (
    <Space size={48} wrap>
      <Statistic title="总访问量" value={123456} />
      <Statistic title="账户余额" value={12345.678} precision={2} prefix="￥" />
      <Statistic title="完成情况" value={80} suffix="%" />
    </Space>
  );
}
```

### 倒计时

按照绝对截止时间更新，完成通知只触发一次。

```tsx
import { useState } from 'react';
import { Countdown } from 'element-react';

/** 按照绝对截止时间更新，完成通知只触发一次。 */
export default function Example() {
  const [deadline] = useState(() => Date.now() + 3600000);
  return <Countdown title="距离开始" value={deadline} format="HH:mm:ss" />;
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Statistic Attributes | value | value | Numerical content | number | 0 |
| Statistic Attributes | decimal-separator | decimalSeparator | Setting the decimal point | string | . |
| Statistic Attributes | formatter | formatter | Custom numerical presentation | Function(value: number) => string \| number | — |
| Statistic Attributes | group-separator | groupSeparator | Sets the thousandth identifier | string | , |
| Statistic Attributes | precision | precision | numerical precision | number | 0 |
| Statistic Attributes | prefix | prefix | Sets the prefix of a number | string | — |
| Statistic Attributes | suffix | suffix | Sets the suffix of a number | string | — |
| Statistic Attributes | title | title | Numeric titles | string | — |
| Statistic Attributes | value-style | valueStyle | Styles numeric values | string / objectCSSProperties \| CSSProperties[] \| string[] | — |
| Statistic Slots | prefix | renderPrefix | Numeric prefix |  | — |
| Statistic Slots | suffix | renderSuffix | Suffixes for numeric values |  | — |
| Statistic Slots | title | renderTitle | Numeric titles |  | — |
| Countdown Attributes | value | value | target time | number / Dayjs | — |
| Countdown Attributes | format | format | Formatting the countdown display | string | HH:mm:ss |
| Countdown Events | change | onChange | Time difference change event | Function(value: number) => void | — |
| Countdown Events | finish | onFinish | countdown end event | Function() => void | — |

## 完成记录

- [x] statistic:44 value；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:45 decimalSeparator；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:46 formatter；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:47 groupSeparator；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:48 precision；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:49 prefix；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:50 suffix；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:51 title；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:52 valueStyle；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:58 renderPrefix；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:59 renderSuffix；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:60 renderTitle；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:74 value；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:75 format；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:85 onChange；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
- [x] statistic:86 onFinish；实现：packages/components/display/index.tsx；测试：tests/layout-display.test.tsx
