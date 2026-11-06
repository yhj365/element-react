# InputOtp 验证码输入

逐位输入、粘贴与位置校验。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 验证码输入

逐位输入、粘贴与位置校验。

```tsx
import { useState } from 'react';
import { InputOtp } from 'element-react';

/** 完成输入后展示提交值；数字校验保留前导零。 */
export default function Example() {
  const [value, setValue] = useState('');
  const [finished, setFinished] = useState('');
  return (
    <div>
      <InputOtp
        ariaLabel="验证码"
        value={value}
        onValueChange={setValue}
        onFinish={setFinished}
        validator={(char) => /^\d?$/.test(char)}
        inputMode="numeric"
        separator={(index) => (index === 2 ? '-' : null)}
      />
      <p aria-live="polite">完成输入：{finished || '等待输入'}</p>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | The value of the OTP fields. Since numbers must not have leading zeros, `modelValue` is allowed to be a number only during initialization. | string / number | undefined |
| Attributes | length | length | The OTP fields length | number | 6 |
| Attributes | validator | validator | Custom validator function | Function(char: string, index: number) => boolean | () => true |
| Attributes | inputmode | inputMode | Native `inputmode` attribute | string | — |
| Attributes | type | type | The type of the OTP fields | enum'outlined' \| 'filled' \| 'underlined' | 'outlined' |
| Attributes | size | size | The size of the OTP fields | enum'large' \| 'default' \| 'small' | — |
| Attributes | mask | mask | Whether to enable password mode | boolean | — |
| Attributes | disabled | disabled | Whether the OTP fields are disabled | boolean | undefined |
| Attributes | separator | separator | The separator between OTP fields | string / VNode / Function() => string \| VNode | — |
| Attributes | validate-event | validateEvent | Whether to trigger form validation | boolean | true |
| Attributes | readonly | readOnly | Same as `readonly` in native input | boolean | false |
| Attributes | id | id | Native `id` attribute | string | — |
| Attributes | aria-label | ariaLabel | Native `aria-label` attribute | string | — |
| Events | update:modelValue | onModelValueChange | Triggers when value updates | Function(value: string) => void | — |
| Events | change | onChange | Triggers when the value changes after input blur | Function(value: string) => void | — |
| Events | finish | onFinish | Fires when all fields have been filled | Function(value: string) => void | — |
| Events | focus | onFocus | Triggers when input is focused | Function(event: FocusEvent) => void | — |
| Events | blur | onBlur | Triggers when input is blurred | Function(event: FocusEvent) => void | — |
| Slots | separator | renderSeparator | The separator between OTP fields | object{ index: number } | — |
| Exposes | inputRefs | ref.current.inputRefs | HTML input elements array | objectRef<(HTMLInputElement \| undefined)[]> | — |
| Exposes | focus | ref.current.focus | Focus an OTP input field | Function(index?: number) => void | — |
| Exposes | blur | ref.current.blur | Blur the focused OTP input field | Function() => void | — |

## 完成记录

- [x] input-otp:94 value / defaultValue / onValueChange；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:95 length；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:96 validator；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:97 inputMode；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:98 type；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:99 size；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:100 mask；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:101 disabled；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:102 separator；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:103 validateEvent；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:104 readOnly；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:105 id；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:106 ariaLabel；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:112 onModelValueChange；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:113 onChange；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:114 onFinish；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:115 onFocus；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:116 onBlur；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:122 renderSeparator；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:128 ref.current.inputRefs；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:129 ref.current.focus；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
- [x] input-otp:130 ref.current.blur；实现：packages/components/input-otp/index.tsx；测试：tests/input-otp.test.tsx
