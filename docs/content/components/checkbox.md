# Checkbox 复选框

独立勾选、半选和禁用。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 复选框

独立勾选、半选和禁用。

```tsx
import { Checkbox, Space } from 'element-react';

/** 独立勾选、半选和禁用。 */
export default function Example() {
  return (
    <Space>
      <Checkbox defaultChecked>默认勾选</Checkbox>
      <Checkbox indeterminate>半选</Checkbox>
      <Checkbox disabled>禁用</Checkbox>
    </Space>
  );
}
```

### 复选组与数量限制

组值保持不可变，最少和最多选择数量可配置。

```tsx
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from 'element-react';
import type { ChoiceValue } from 'element-react';

/** 组值保持不可变，最少和最多选择数量可配置。 */
export default function Example() {
  const [value, setValue] = useState<ChoiceValue[]>(['a']);
  return (
    <CheckboxGroup value={value} onValueChange={setValue} min={1} max={2} ariaLabel="功能选择">
      <Checkbox value="a">组件</Checkbox>
      <Checkbox value="b">主题</Checkbox>
      <Checkbox value="c">文档</Checkbox>
    </CheckboxGroup>
  );
}
```

### 按钮式复选

与复选组共享值模型。

```tsx
import { CheckboxButton, CheckboxGroup } from 'element-react';

/** 与复选组共享值模型。 */
export default function Example() {
  return (
    <CheckboxGroup defaultValue={['react']}>
      <CheckboxButton value="react">React</CheckboxButton>
      <CheckboxButton value="typescript">TypeScript</CheckboxButton>
      <CheckboxButton value="css" disabled>
        CSS
      </CheckboxButton>
    </CheckboxGroup>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Checkbox Attributes | label | label | label of the Checkbox when used inside a `checkbox-group`. If there's no value, `label` will act as `value` | string / number / boolean / object | — |
| Checkbox Attributes | true-value | trueValue | value of the Checkbox if it's checked | string / number | — |
| Checkbox Attributes | false-value | falseValue | value of the Checkbox if it's not checked | string / number | — |
| Checkbox Attributes | disabled | disabled | whether the Checkbox is disabled | boolean | false |
| Checkbox Attributes | border | border | whether to add a border around Checkbox | boolean | false |
| Checkbox Attributes | size | size | size of the Checkbox | enum'large' \| 'default' \| 'small' | — |
| Checkbox Attributes | name | name | native 'name' attribute | string | — |
| Checkbox Attributes | checked | checked / defaultChecked / onValueChange | if the Checkbox is checked | boolean | false |
| Checkbox Attributes | indeterminate | indeterminate | Set indeterminate state, only responsible for style control | boolean | false |
| Checkbox Attributes | id | id | input id | string | — |
| Checkbox Events | change | onChange | triggers when the binding value changes | Function(value: string \| number \| boolean) => void | — |
| Checkbox Slots | default | children | customize default content |  | — |
| CheckboxGroup Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | arraystring[] \| number[] | [] |
| CheckboxGroup Attributes | size | size | size of checkbox | enum'large' \| 'default' \| 'small' | — |
| CheckboxGroup Attributes | disabled | disabled | whether the nesting checkboxes are disabled | boolean | false |
| CheckboxGroup Attributes | min | min | minimum number of checkbox checked | number | — |
| CheckboxGroup Attributes | max | max | maximum number of checkbox checked | number | — |
| CheckboxGroup Attributes | aria-label | ariaLabel | native `aria-label` attribute | string | — |
| CheckboxGroup Events | change | onChange | triggers when the binding value changes | Function(value: string[] \| number[]) => void | — |
| CheckboxGroup Slots | default | children | customize default content |  | — |
| CheckboxButton Attributes | value | value | value of the checkbox when used inside a `checkbox-group` | string / number / boolean / object | — |
| CheckboxButton Attributes | label | label | label of the checkbox when used inside a `checkbox-group`. If there's no value, `label` will act as `value` | string / number / boolean / object | — |
| CheckboxButton Attributes | disabled | disabled | whether the checkbox is disabled | boolean | false |
| CheckboxButton Attributes | name | name | native 'name' attribute | string | — |
| CheckboxButton Slots | default | children | customize default content |  | — |

## 完成记录

- [x] checkbox:118 label；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:119 trueValue；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:120 falseValue；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:121 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:122 border；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:123 size；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:124 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:125 checked / defaultChecked / onValueChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:126 indeterminate；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:129 id；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:140 onChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:146 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:154 value / defaultValue / onValueChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:155 size；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:156 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:157 min；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:158 max；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:159 ariaLabel；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:173 onChange；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:179 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:187 value；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:188 label；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:191 disabled；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:192 name；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
- [x] checkbox:201 children；实现：packages/components/choice/index.tsx；测试：tests/input-choice.test.tsx
