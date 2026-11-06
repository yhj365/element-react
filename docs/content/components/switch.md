# Switch 开关

原生switch语义、受控值、尺寸和加载状态。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 开关

原生switch语义、受控值、尺寸和加载状态。

```tsx
import { useState } from 'react';
import { Switch, Space } from 'element-react';
import type { ChoiceValue } from 'element-react';

/** 原生switch语义、受控值、尺寸和加载状态。 */
export default function Example() {
  const [value, setValue] = useState<ChoiceValue>(false);
  return (
    <Space>
      <Switch value={value} onValueChange={setValue} ariaLabel="启用通知" />
      <Switch defaultValue loading ariaLabel="加载中" />
      <Switch disabled ariaLabel="禁用开关" />
    </Space>
  );
}
```

### 文字与内联提示

开关两侧及内部提示可自定义。

```tsx
import { Switch, Space } from 'element-react';

/** 开关两侧及内部提示可自定义。 */
export default function Example() {
  return (
    <Space>
      <Switch activeText="开启" inactiveText="关闭" />
      <Switch inlinePrompt activeText="是" inactiveText="否" defaultValue />
      <Switch renderActive="已启用" renderInactive="已停用" renderActiveAction="✓" />
    </Space>
  );
}
```

### 异步切换拦截

异步确认通过后才更新开关，等待期间阻止重复操作。

```tsx
import { Switch } from 'element-react';

/** 异步确认通过后才更新开关，等待期间阻止重复操作。 */
export default function Example() {
  return (
    <Switch
      ariaLabel="异步开关"
      beforeChange={() => new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 500))}
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value, it should be equivalent to either `active-value` or `inactive-value`, by default it's `boolean` type | boolean / string / number | false |
| Attributes | disabled | disabled | whether Switch is disabled | boolean | false |
| Attributes | loading | loading | whether Switch is in loading state | boolean | false |
| Attributes | size | size | size of Switch | enum'' \| 'large' \| 'default' \| 'small' | '' |
| Attributes | width | width | width of Switch | number / string | '' |
| Attributes | inline-prompt | inlinePrompt | whether icon or text is displayed inside dot, only the first character will be rendered for text | boolean | false |
| Attributes | active-icon | activeIcon | component of the icon displayed when in `on` state, overrides `active-text` | string / Component | — |
| Attributes | inactive-icon | inactiveIcon | component of the icon displayed when in `off` state, overrides `inactive-text` | string / Component | — |
| Attributes | active-action-icon | activeActionIcon | component of the icon displayed in action when in `on` state | string / Component | — |
| Attributes | inactive-action-icon | inactiveActionIcon | component of the icon displayed in action when in `off` state | string / Component | — |
| Attributes | active-text | activeText | text displayed when in `on` state | string | '' |
| Attributes | inactive-text | inactiveText | text displayed when in `off` state | string | '' |
| Attributes | active-value | activeValue | switch value when in `on` state | boolean / string / number | true |
| Attributes | inactive-value | inactiveValue | switch value when in `off` state | boolean / string / number | false |
| Attributes | name | name | input name of Switch | string | '' |
| Attributes | before-change | beforeChange | before-change hook before the switch state changes. If `false` is returned or a `Promise` is returned and then is rejected, will stop switching | Function() => Promise<boolean> \| boolean | — |
| Attributes | aria-label | ariaLabel | same as `aria-label` in native input | string | — |
| Events | change | onChange | triggers when value changes | Function(val: boolean \| string \| number) => void | — |
| Switch Slots | active-action | renderActiveAction | customize active action |  | — |
| Switch Slots | inactive-action | renderInactiveAction | customize inactive action |  | — |
| Switch Slots | active | renderActive | customize active content |  | — |
| Switch Slots | inactive | renderInactive | customize inactive content |  | — |
| Exposes | focus | ref.current.focus | manual focus to the switch component | Function() => void | — |

## 完成记录

- [x] switch:104 value / defaultValue / onValueChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:105 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:106 loading；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:107 size；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:108 width；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:109 inlinePrompt；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:110 activeIcon；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:111 inactiveIcon；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:112 activeActionIcon；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:113 inactiveActionIcon；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:114 activeText；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:115 inactiveText；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:116 activeValue；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:117 inactiveValue；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:118 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:120 beforeChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:123 ariaLabel；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:133 onChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:139 renderActiveAction；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:140 renderInactiveAction；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:141 renderActive；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:142 renderInactive；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] switch:148 ref.current.focus；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
