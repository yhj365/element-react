# Segmented 分段选择

标量或对象选项，支持禁用、方向和自定义内容。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 分段选择

标量或对象选项，支持禁用、方向和自定义内容。

```tsx
import { Segmented } from 'element-react';

/** 标量或对象选项，支持禁用、方向和自定义内容。 */
export default function Example() {
  return (
    <Segmented
      defaultValue="list"
      options={[
        { label: '列表', value: 'list' },
        { label: '卡片', value: 'card' },
        { label: '图表', value: 'chart', disabled: true },
      ]}
      ariaLabel="视图"
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string / number / boolean | — |
| Attributes | options | options | data of the options | arrayOption[] | [] |
| Attributes | size | size | size of component | enum'' \| 'large' \| 'default' \| 'small' | '' |
| Attributes | block | block | fit width of parent content | boolean | false |
| Attributes | disabled | disabled | whether segmented is disabled | boolean | false |
| Attributes | name | name | native `name` attribute | string | — |
| Attributes | aria-label | ariaLabel | native `aria-label` attribute | string | — |
| Attributes | direction | direction | display direction | enum'horizontal' \| 'vertical' | horizontal |
| Events | change | onChange | triggers when the selected value changes, the param is current selected value | Function(val: any) => void | — |
| Slots | default | children | option renderer | object{ item: Option } | — |

## 完成记录

- [x] segmented:86 value / defaultValue / onValueChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:87 options；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:89 size；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:90 block；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:91 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:93 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:95 ariaLabel；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:96 direction；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:110 onChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] segmented:116 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
