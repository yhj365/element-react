# Input 输入框

受控输入、原生属性与输入法处理。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础输入

受控输入、原生属性与输入法处理。

```tsx
import { useState } from 'react';
import { Input, Space, Text } from 'element-react';

/** 受控输入、原生属性与输入法处理。 */
export default function Example() {
  const [value, setValue] = useState('');
  return (
    <Space direction="vertical" fill>
      <Input value={value} onValueChange={setValue} placeholder="请输入内容" aria-label="基础输入" />
      <Text type="info">当前值：{value || '尚未输入'}</Text>
      <Input disabled placeholder="禁用输入" />
      <Input readOnly defaultValue="只读内容" />
    </Space>
  );
}
```

### 格式化与解析

绑定值与显示格式独立。

```tsx
import { useState } from 'react';
import { Input } from 'element-react';

/** 绑定值与显示格式独立。 */
export default function Example() {
  const [value, setValue] = useState('1234');
  return (
    <Input
      value={value}
      onValueChange={setValue}
      formatter={(text) => '$' + text}
      parser={(text) => text.replace(/\$/g, '')}
      aria-label="金额"
    />
  );
}
```

### 清空与实例方法

清空通知与逐字输入、提交事件分别处理。

```tsx
import { useRef } from 'react';
import { Input, Button, Space } from 'element-react';
import type { InputHandle } from 'element-react';

/** 清空通知与逐字输入、提交事件分别处理。 */
export default function Example() {
  const ref = useRef<InputHandle>(null);
  return (
    <Space>
      <Input ref={ref} defaultValue="可清空内容" clearable aria-label="可清空输入" />
      <Button onClick={() => ref.current?.focus()}>聚焦</Button>
      <Button onClick={() => ref.current?.clear()}>清空</Button>
    </Space>
  );
}
```

### 密码与字数

切换密码可见性，并显示输入字数。

```tsx
import { Input } from 'element-react';

/** 切换密码可见性，并显示输入字数。 */
export default function Example() {
  return (
    <Input
      defaultValue="secret"
      showPassword
      showWordLimit
      maxLength={20}
      wordLimitPosition="outside"
      aria-label="密码"
    />
  );
}
```

### 前后置内容

可组合前缀、后缀及输入框前后置区域。

```tsx
import { Input } from 'element-react';

/** 可组合前缀、后缀及输入框前后置区域。 */
export default function Example() {
  return (
    <Input
      renderPrepend="https://"
      renderAppend=".com"
      renderPrefix="地址"
      placeholder="example"
      aria-label="网站地址"
    />
  );
}
```

### 多行输入

支持行数和原生resize方向。

```tsx
import { Input } from 'element-react';

/** 支持行数和原生resize方向。 */
export default function Example() {
  return <Input type="textarea" rows={4} resize="vertical" placeholder="请输入说明" aria-label="说明" />;
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | type | type | type of input, see more in [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) | string'text' \| 'textarea' \| 'number' \| 'password' \| 'email' \| 'search' \| 'tel' \|  'url' | text |
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string / number | — |
| Attributes | maxlength | maxLength | same as `maxlength` in native input | string / number | — |
| Attributes | minlength | minLength | same as `minlength` in native input | string / number | — |
| Attributes | show-word-limit | showWordLimit | whether show word count, only works when `type` is 'text' or 'textarea' | boolean | false |
| Attributes | word-limit-position | wordLimitPosition | word count position, valid when `show-word-limit` is true | enum'inside' \| 'outside' | "inside" |
| Attributes | placeholder | placeholder | placeholder of Input | string | — |
| Attributes | clearable | clearable | whether to show clear button, only works when `type` is not 'textarea' | boolean | false |
| Attributes | clear-icon | clearIcon | custom clear icon component | string / objectComponent | CircleClose |
| Attributes | formatter | formatter | specifies the format of the value presented input.(only works when `type` is 'text') | Function(value: string \| number) => string | — |
| Attributes | parser | parser | specifies the value extracted from formatter input.(only works when `type` is 'text') | Function(value: string) => string | — |
| Attributes | show-password | showPassword | whether to show toggleable password input | boolean | false |
| Attributes | disabled | disabled | whether Input is disabled | boolean | false |
| Attributes | size | size | size of Input, works when `type` is not 'textarea' | enum'large' \| 'default' \| 'small' | — |
| Attributes | prefix-icon | prefixIcon | prefix icon component | string / Component | — |
| Attributes | suffix-icon | suffixIcon | suffix icon component | string / Component | — |
| Attributes | rows | rows | number of rows of textarea, only works when `type` is 'textarea' | number | 2 |
| Attributes | autocomplete | autoComplete | same as `autocomplete` in native input | string | off |
| Attributes | name | name | same as `name` in native input | string | — |
| Attributes | readonly | readOnly | same as `readonly` in native input | boolean | false |
| Attributes | resize | resize | control the resizability | enum'none' \| 'both' \| 'horizontal' \| 'vertical' | — |
| Attributes | autofocus | autoFocus | same as `autofocus` in native input | boolean | false |
| Attributes | form | form | same as `form` in native input | string | — |
| Attributes | aria-label | aria-label | same as `aria-label` in native input | string | — |
| Attributes | tabindex | tabIndex | input tabindex | string / number | — |
| Attributes | input-style | inputStyle | the style of the input element or textarea element | string / objectCSSProperties \| CSSProperties[] \| string[] | {} |
| Attributes | inputmode | inputMode | same as `inputmode` in native input | string | — |
| Events | blur | onBlur | triggers when Input blurs | Function(event: FocusEvent) => void | — |
| Events | focus | onFocus | triggers when Input focuses | Function(event: FocusEvent) => void | — |
| Events | change | onChange | triggers when the input box loses focus or the user presses Enter, only if the modelValue has changed | Function(value: string \| number, evt?: Event) => void | — |
| Events | input | onInput | triggers when the Input value change | Function(value: string \| number) => void | — |
| Events | clear | onClear | triggers when the Input is cleared by clicking the clear button | Function(evt?: MouseEvent) => void (After version 2.13.4, the evt parameter can be received) | — |
| Events | keydown | onKeydown | triggers when a key is pressed down | Function(event: KeyboardEvent \| Event) => void | — |
| Slots | prefix | renderPrefix | content as Input prefix, only works when `type` is not 'textarea' |  | — |
| Slots | suffix | renderSuffix | content as Input suffix, only works when `type` is not 'textarea' |  | — |
| Slots | prepend | renderPrepend | content to prepend before Input, only works when `type` is not 'textarea' |  | — |
| Slots | append | renderAppend | content to append after Input, only works when `type` is not 'textarea' |  | — |
| Slots | password-icon | renderPasswordIcon | content as Input password icon, only works when `show-password` is true. The scope variable is `{ visible: boolean }` |  | — |
| Exposes | blur | ref.current.blur | blur the input element | Function() => void | — |
| Exposes | clear | ref.current.clear | clear input value | Function() => void | — |
| Exposes | focus | ref.current.focus | focus the input element | Function() => void | — |
| Exposes | input | ref.current.input | HTML input element | objectRef<HTMLInputElement> | — |
| Exposes | ref | ref.current.ref | HTML element, input or textarea | objectRef<HTMLInputElement \| HTMLTextAreaElement> | — |
| Exposes | select | ref.current.select | select the text in input element | Function() => void | — |
| Exposes | textarea | ref.current.textarea | HTML textarea element | objectRef<HTMLTextAreaElement> | — |

## 完成记录

- [x] input:144 type；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:145 value / defaultValue / onValueChange；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:147 maxLength；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:148 minLength；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:149 showWordLimit；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:150 wordLimitPosition；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:151 placeholder；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:152 clearable；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:153 clearIcon；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:154 formatter；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:155 parser；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:156 showPassword；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:157 disabled；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:158 size；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:159 prefixIcon；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:160 suffixIcon；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:161 rows；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:163 autoComplete；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:164 name；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:165 readOnly；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:169 resize；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:170 autoFocus；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:171 form；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:172 aria-label；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:173 tabIndex；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:175 inputStyle；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:177 inputMode；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:184 onBlur；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:185 onFocus；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:186 onChange；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:187 onInput；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:188 onClear；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:189 onKeydown；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:200 renderPrefix；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:201 renderSuffix；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:202 renderPrepend；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:203 renderAppend；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:204 renderPasswordIcon；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:210 ref.current.blur；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:211 ref.current.clear；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:212 ref.current.focus；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:213 ref.current.input；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:214 ref.current.ref；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:216 ref.current.select；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
- [x] input:217 ref.current.textarea；实现：packages/components/input/index.tsx；测试：tests/input-choice.test.tsx
