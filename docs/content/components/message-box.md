# MessageBox 消息弹框

确认结果、取消和输入校验。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 消息确认与输入

确认结果、取消和输入校验。

```tsx
import { useState } from 'react';
import { Button, useMessageBox } from 'element-react';

/** Promise结果显式区分确认和取消，业务决定结果的展示方式。 */
export default function Example() {
  const box = useMessageBox();
  const [result, setResult] = useState('等待操作');
  return (
    <div>
      <Button
        onClick={() => {
          void box
            .confirm('确定继续此操作吗？', '确认操作', { type: 'warning' })
            .then(() => setResult('已确认'))
            .catch(() => setResult('已取消'));
        }}
      >
        确认操作
      </Button>
      <Button
        onClick={() => {
          void box
            .prompt('请输入项目名称', '项目名称', {
              inputPlaceholder: '项目名称',
              inputPattern: /\S+/,
              inputErrorMessage: '名称不能为空',
            })
            .then((value) => setResult(typeof value === 'object' ? value.value : value))
            .catch(() => setResult('已取消'));
        }}
      >
        输入内容
      </Button>
      <p aria-live="polite">{result}</p>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Options | autofocus | autoFocus | auto focus when open MessageBox | boolean | true |
| Options | title | title | title of the MessageBox | string | '' |
| Options | message | message | content of the MessageBox | string / VNode / Function() => VNode ^(2.2.17) / Function({ confirm, cancel, close }) => VNode ^(2.14.0) | — |
| Options | dangerouslyUseHTMLString | dangerouslyUseHTMLString | whether `message` is treated as HTML string | boolean | false |
| Options | type | type | message type, used for icon display | enum'primary' (2.9.11) \| 'success' \| 'info' \| 'warning' \| 'error' | '' |
| Options | icon | icon | custom icon component, overrides `type` | string / Component | '' |
| Options | closeIcon | closeIcon | custom close icon component, default is Close | string / Component | '' |
| Options | customClass | customClass | custom class name for MessageBox | string | '' |
| Options | customStyle | customStyle | custom inline style for MessageBox | CSSProperties | {} |
| Options | modal | modal | whether a mask is displayed | boolean | true |
| Options | modalClass | modalClass | custom class names for mask | string | — |
| Options | callback | callback | MessageBox closing callback if you don't prefer Promise | Function(value: string, action: Action) => any \| (action: Action) => any | null |
| Options | showClose | showClose | whether to show close icon of MessageBox | boolean | true |
| Options | beforeClose | beforeClose | callback before MessageBox closes, and it will prevent MessageBox from closing | Function(action: Action, instance: MessageBoxState, done: () => void) => void | null |
| Options | distinguishCancelAndClose | distinguishCancelAndClose | whether to distinguish canceling and closing the MessageBox | boolean | false |
| Options | lockScroll | lockScroll | whether to lock body scroll when MessageBox prompts | boolean | true |
| Options | showCancelButton | showCancelButton | whether to show a cancel button | boolean | false (true when called with confirm and prompt) |
| Options | showConfirmButton | showConfirmButton | whether to show a confirm button | boolean | true |
| Options | cancelButtonText | cancelButtonText | text content of cancel button | string | Cancel |
| Options | confirmButtonText | confirmButtonText | text content of confirm button | string | OK |
| Options | cancelButtonType | cancelButtonType | type of cancel button | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' (deprecated) | — |
| Options | confirmButtonType | confirmButtonType | type of confirm button | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' (deprecated) | primary |
| Options | cancelButtonLoadingIcon | cancelButtonLoadingIcon | loading icon content of cancel button | string / Component | Loading |
| Options | confirmButtonLoadingIcon | confirmButtonLoadingIcon | loading icon content of confirm button | string / Component | Loading |
| Options | cancelButtonClass | cancelButtonClass | custom class name of cancel button | string | '' |
| Options | confirmButtonClass | confirmButtonClass | custom class name of confirm button | string | '' |
| Options | closeOnClickModal | closeOnClickModal | whether MessageBox can be closed by clicking the mask | boolean | true (false when called with alert) |
| Options | closeOnPressEscape | closeOnPressEscape | whether MessageBox can be closed by pressing the ESC | boolean | true (false when called with alert) |
| Options | closeOnHashChange | closeOnHashChange | whether to close MessageBox when hash changes | boolean | true |
| Options | showInput | showInput | whether to show an input | boolean | false (true when called with prompt) |
| Options | inputPlaceholder | inputPlaceholder | placeholder of input | string | '' |
| Options | inputType | inputType | type of input, see more in [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) | string'text' \| 'textarea' \| 'number' \| 'password' \| 'email' \| 'search' \| 'tel' \|  'url' | text |
| Options | inputValue | inputValue | initial value of input | string | '' |
| Options | inputPattern | inputPattern | regexp for the input | regexp | null |
| Options | inputValidator | inputValidator | validation function for the input. Should returns a boolean or string. If a string is returned, it will be assigned to inputErrorMessage | Function(value: string) => boolean \| string/ undefined | undefined |
| Options | inputErrorMessage | inputErrorMessage | error message when validation fails | string | Illegal input |
| Options | center | center | whether to align the content in center | boolean | false |
| Options | draggable | draggable | whether MessageBox is draggable | boolean | false |
| Options | overflow | overflow | draggable MessageBox can overflow the viewport | boolean | false |
| Options | roundButton | roundButton | whether to use round button | boolean | false |
| Options | buttonSize | buttonSize | custom size of confirm and cancel buttons | string'small' \| 'default' \| 'large' | default |
| Options | appendTo | appendTo | set the root element for the message box | CSSSelector / HTMLElement | — |

## 完成记录

- [x] message-box:173 autoFocus；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:174 title；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:175 message；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:176 dangerouslyUseHTMLString；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:177 type；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:178 icon；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:179 closeIcon；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:180 customClass；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:181 customStyle；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:182 modal；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:183 modalClass；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:184 callback；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:185 showClose；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:186 beforeClose；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:187 distinguishCancelAndClose；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:188 lockScroll；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:189 showCancelButton；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:190 showConfirmButton；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:191 cancelButtonText；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:192 confirmButtonText；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:193 cancelButtonType；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:194 confirmButtonType；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:195 cancelButtonLoadingIcon；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:196 confirmButtonLoadingIcon；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:197 cancelButtonClass；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:198 confirmButtonClass；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:199 closeOnClickModal；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:200 closeOnPressEscape；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:201 closeOnHashChange；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:202 showInput；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:203 inputPlaceholder；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:204 inputType；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:205 inputValue；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:206 inputPattern；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:207 inputValidator；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:208 inputErrorMessage；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:209 center；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:210 draggable；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:211 overflow；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:212 roundButton；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:213 buttonSize；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
- [x] message-box:214 appendTo；实现：packages/components/services/message-box.tsx；测试：tests/message-box.test.tsx
