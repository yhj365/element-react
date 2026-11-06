# TimeSelect 时间选择

时间区间、间隔和可选范围限制。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 固定间隔时间选择

时间区间、间隔和可选范围限制。

```tsx
import { useState } from 'react';
import { TimeSelect } from 'element-react';
import type { TimeSelectValue } from 'element-react';

/** 固定间隔选项包含末尾时间，并禁用指定边界之外的选项。 */
export default function Example() {
  const [value, setValue] = useState<TimeSelectValue>();
  return (
    <TimeSelect
      value={value}
      onValueChange={setValue}
      start="08:30"
      end="18:00"
      step="00:15"
      minTime="09:00"
      maxTime="17:30"
      placeholder="选择时间"
      ariaLabel="会议时间"
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string | — |
| Attributes | disabled | disabled | whether TimeSelect is disabled | boolean | false |
| Attributes | editable | editable | whether the input is editable | boolean | true |
| Attributes | clearable | clearable | whether to show clear button | boolean | true |
| Attributes | include-end-time | includeEndTime | whether `end` is included in options | boolean | false |
| Attributes | size | size | size of Input | enum'large' \| 'default' \| 'small' | default |
| Attributes | placeholder | placeholder | placeholder in non-range mode | string | — |
| Attributes | name | name | same as `name` in native input | string | — |
| Attributes | effect | effect | Tooltip theme, built-in theme: `dark` / `light` | string / enum'dark' \| 'light' | light |
| Attributes | prefix-icon | prefixIcon | custom prefix icon component | string / Component | Clock |
| Attributes | clear-icon | clearIcon | custom clear icon component | string / Component | CircleClose |
| Attributes | start | start | start time | string | 09:00 |
| Attributes | end | end | end time | string | 18:00 |
| Attributes | step | step | time step | string | 00:30 |
| Attributes | min-time | minTime | minimum time, any time before this time will be disabled | string | — |
| Attributes | max-time | maxTime | maximum time, any time after this time will be disabled | string | — |
| Attributes | format | format | set format of time | string see [formats](https://day.js.org/docs/en/display/format#list-of-all-available-formats) | HH:mm |
| Attributes | empty-values | emptyValues | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | array | — |
| Attributes | value-on-clear | valueOnClear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | string / number / boolean / Function | — |
| Attributes | popper-class | popperClass | custom class name for TimeSelect's dropdown | string | '' |
| Attributes | popper-style | popperStyle | custom style for TimeSelect's dropdown | string / object | — |
| Events | change | onChange | triggers when user confirms the value | Function(value: string) => void | — |
| Events | blur | onBlur | triggers when Input blurs | Function(event: FocusEvent) => void | — |
| Events | focus | onFocus | triggers when Input focuses | Function(event: FocusEvent) => void | — |
| Events | clear | onClear | triggers when the clear icon is clicked in a clearable TimeSelect | Function() => void | — |
| Exposes | focus | ref.current.focus | focus the Input component | Function() => void | — |
| Exposes | blur | ref.current.blur | blur the Input component | Function() => void | — |

## 完成记录

- [x] time-select:56 value / defaultValue / onValueChange；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:57 disabled；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:58 editable；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:59 clearable；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:60 includeEndTime；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:61 size；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:62 placeholder；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:63 name；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:64 effect；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:65 prefixIcon；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:66 clearIcon；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:67 start；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:68 end；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:69 step；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:70 minTime；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:71 maxTime；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:72 format；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:73 emptyValues；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:74 valueOnClear；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:75 popperClass；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:76 popperStyle；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:82 onChange；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:83 onBlur；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:84 onFocus；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:85 onClear；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:91 ref.current.focus；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
- [x] time-select:92 ref.current.blur；实现：packages/components/time-select/index.tsx；测试：tests/time-select.test.tsx
