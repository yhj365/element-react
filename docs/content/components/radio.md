# Radio 单选框

选中值、尺寸与禁用由组统一管理。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 单选组

选中值、尺寸与禁用由组统一管理。

```tsx
import { Radio, RadioGroup } from 'element-react';

/** 选中值、尺寸与禁用由组统一管理。 */
export default function Example() {
  return (
    <RadioGroup defaultValue="a" ariaLabel="展示方式">
      <Radio value="a">列表</Radio>
      <Radio value="b">卡片</Radio>
      <Radio value="c" disabled>
        禁用项
      </Radio>
    </RadioGroup>
  );
}
```

### 按钮式单选

切换选项时只保留一个选中值。

```tsx
import { RadioButton, RadioGroup } from 'element-react';

/** 切换选项时只保留一个选中值。 */
export default function Example() {
  return (
    <RadioGroup defaultValue="day">
      <RadioButton value="day">日</RadioButton>
      <RadioButton value="week">周</RadioButton>
      <RadioButton value="month">月</RadioButton>
    </RadioGroup>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Radio Attributes | value | value | the value of Radio | string / number / boolean | — |
| Radio Attributes | label | label | the label of Radio. If there's no `value`, `label` will act as `value` | string / number / boolean | — |
| Radio Attributes | disabled | disabled | whether Radio is disabled | boolean | false |
| Radio Attributes | border | border | whether to add a border around Radio | boolean | false |
| Radio Attributes | size | size | size of the Radio | enum'large' \| 'default' \| 'small' | — |
| Radio Attributes | name | name | native `name` attribute | string | — |
| Radio Events | change | onChange | triggers when the bound value changes | Function(value: string \| number \| boolean) => void | — |
| Radio Slots | default | children | customize default content |  | — |
| RadioGroup Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string / number / boolean | — |
| RadioGroup Attributes | size | size | the size of radio buttons or bordered radios | string | default |
| RadioGroup Attributes | disabled | disabled | whether the nesting radios are disabled | boolean | false |
| RadioGroup Attributes | aria-label | ariaLabel | same as `aria-label` in RadioGroup | string | — |
| RadioGroup Attributes | name | name | native `name` attribute | string | — |
| RadioGroup Events | change | onChange | triggers when the bound value changes | Function(value: string \| number \| boolean) => void | — |
| RadioGroup Slots | default | children | customize default content |  | — |
| RadioButton Attributes | value | value | the value of Radio | string / number / boolean | — |
| RadioButton Attributes | label | label | the label of Radio. If there's no `value`, `label` will act as `value` | string / number / boolean | — |
| RadioButton Attributes | disabled | disabled | whether Radio is disabled | boolean | false |
| RadioButton Attributes | name | name | native 'name' attribute | string | — |
| RadioButton Slots | default | children | customize default content |  | — |

## 完成记录

- [x] radio:97 value；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:98 label；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:99 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:100 border；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:101 size；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:102 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:108 onChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:114 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:122 value / defaultValue / onValueChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:123 size；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:124 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:128 ariaLabel；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:129 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:140 onChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:146 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:154 value；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:155 label；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:156 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:157 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] radio:163 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
