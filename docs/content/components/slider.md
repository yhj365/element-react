# Slider 滑块

拖动滑块或使用方向键调整数值。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/basic-usage 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider aria-label="Default value" />
      <Slider defaultValue={50} aria-label="Customized initial value" />
      <Slider defaultValue={30} showTooltip={false} />
      <Slider defaultValue={40} formatTooltip={(value) => value / 100} />
      <Slider defaultValue={50} disabled />
    </div>
  );
}
```

### 离散值

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/discrete-values 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider defaultValue={20} step={10} />
      <Slider defaultValue={40} step={10} showStops />
    </div>
  );
}
```

### 带有输入框

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/slider-with-input-box 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider defaultValue={30} showInput />
    </div>
  );
}
```

### 尺寸

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/sizes 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider defaultValue={30} size="large" />
      <Slider defaultValue={40} />
      <Slider defaultValue={50} size="small" />
    </div>
  );
}
```

### 范围选择

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/range-selection 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider range defaultValue={[30, 60]} rangeStartLabel="Minimum" rangeEndLabel="Maximum" />
    </div>
  );
}
```

### 竖向模式

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/vertical-mode 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider vertical height="200px" defaultValue={30} />
      <Slider vertical height="200px" range defaultValue={[20, 70]} />
    </div>
  );
}
```

### 展示标记

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/show-marks 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider
        range
        defaultValue={[30, 60]}
        marks={{ 0: '0°C', 8: '8°C', 37: '37°C', 50: { label: '50%', style: { color: '#1989fa' } } }}
      />
    </div>
  );
}
```

### 限制取值

拖动滑块或使用方向键调整数值。

```tsx
import { Slider } from 'element-react';
/** 对照 Element Plus slider/restrict-value 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider
        defaultValue={37}
        step="mark"
        marks={{ 0: '0°C', 8: '8°C', 37: '37°C', 50: '50°C', 100: '100°C' }}
      />
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | number / arraynumber[] | 0 |
| Attributes | min | min | minimum value | number | 0 |
| Attributes | max | max | maximum value | number | 100 |
| Attributes | disabled | disabled | whether Slider is disabled | boolean | false |
| Attributes | step | step | step size, can be a number or `'mark'` ^(2.13.6) to restrict values to marks. When set to `'mark'`, the `marks` attribute must be set | number / string'mark' | 1 |
| Attributes | show-input | showInput | whether to display an input box, works when `range` is false and `step` is not `'mark'` | boolean | false |
| Attributes | size | size | size of the slider wrapper, will not work in vertical mode | enum'' \| 'large' \| 'default' \| 'small' | default |
| Attributes | show-stops | showStops | whether to display breakpoints | boolean | false |
| Attributes | show-tooltip | showTooltip | whether to display tooltip value | boolean | true |
| Attributes | format-tooltip | formatTooltip | format to display tooltip value | Function(value: number) => number \| string | — |
| Attributes | range | range | whether to select a range | boolean | false |
| Attributes | vertical | vertical | vertical mode | boolean | false |
| Attributes | height | height | slider height, required in vertical mode | string | — |
| Attributes | range-start-label | rangeStartLabel | when `range` is true, screen reader label for the start of the range | string | — |
| Attributes | range-end-label | rangeEndLabel | when `range` is true, screen reader label for the end of the range | string | — |
| Attributes | marks | marks | marks, type of key must be `number` and must in closed interval `[min, max]`, each mark can custom style | objectSliderMarks | — |
| Events | change | onChange | triggers when the value changes (if the mouse is being dragged, this event only fires when the mouse is released) | Function(value: Arrayable<number>) => void | — |
| Events | input | onInput | triggers when the data changes (It'll be emitted in real time during sliding) | Function(value: Arrayable<number>) => void | — |

## 完成记录

- [x] slider:98 value / defaultValue / onValueChange；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:99 min；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:100 max；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:101 disabled；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:102 step；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:103 showInput；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:105 size；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:107 showStops；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:108 showTooltip；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:109 formatTooltip；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:110 range；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:111 vertical；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:112 height；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:114 rangeStartLabel；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:115 rangeEndLabel；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:119 marks；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:128 onChange；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
- [x] slider:129 onInput；实现：packages/components/slider/index.tsx；测试：tests/slider.test.tsx
