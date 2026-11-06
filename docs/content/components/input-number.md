# InputNumber 数字输入

支持步长、精度、边界与键盘增减。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 数字输入

支持步长、精度、边界与键盘增减。

```tsx
import { useState } from 'react';
import { InputNumber } from 'element-react';

/** 支持步长、精度、边界与键盘增减。 */
export default function Example() {
  const [value, setValue] = useState<number | null>(2);
  return (
    <InputNumber
      value={value}
      onValueChange={setValue}
      min={0}
      max={10}
      step={0.5}
      precision={1}
      controlsPosition="right"
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | number / null | — |
| Attributes | min | min | the minimum allowed value | number | Number.MIN_SAFE_INTEGER |
| Attributes | max | max | the maximum allowed value | number | Number.MAX_SAFE_INTEGER |
| Attributes | step | step | incremental step | number | 1 |
| Attributes | step-strictly | stepStrictly | whether input value can only be multiple of step | boolean | false |
| Attributes | precision | precision | precision of input value | number | — |
| Attributes | size | size | size of the component | enum'large' \| 'default' \| 'small' | default |
| Attributes | readonly | readOnly | same as `readonly` in native input | boolean | false |
| Attributes | disabled | disabled | whether the component is disabled | boolean | false |
| Attributes | controls | controls | whether to enable the control buttons | boolean | true |
| Attributes | controls-position | controlsPosition | position of the control buttons | enum'' \| 'right' | — |
| Attributes | name | name | same as `name` in native input | string | — |
| Attributes | placeholder | placeholder | same as `placeholder` in native input | string | — |
| Events | change | onChange | triggers when the value changes | Function(currentValue: number \| undefined, oldValue: number \| undefined) => void | — |

## 完成记录

- [x] input-number:122 value / defaultValue / onValueChange；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:123 min；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:124 max；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:125 step；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:126 stepStrictly；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:127 precision；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:128 size；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:129 readOnly；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:130 disabled；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:131 controls；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:132 controlsPosition；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:133 name；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:135 placeholder；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
- [x] input-number:160 onChange；实现：packages/components/input-number/index.tsx；测试：tests/input-choice.test.tsx
