# Form 表单

受控模型、字段规则、错误提示和重置。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 表单校验与重置

受控模型、字段规则、错误提示和重置。

```tsx
import { useRef, useState } from 'react';
import { Button, Form, FormItem, Input, Space } from 'element-react';
import type { FormHandle, FormRules } from 'element-react';

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确邮箱', trigger: 'change' }],
};
/** 表单模型通过onModelChange回写，字段提供类型安全的绑定入口。 */
export default function Example() {
  const [model, setModel] = useState<Record<string, unknown>>({ name: '', email: '' });
  const ref = useRef<FormHandle>(null);
  const [message, setMessage] = useState('');
  return (
    <Form
      ref={ref}
      model={model}
      onModelChange={setModel}
      rules={rules}
      labelPosition="top"
      onSubmit={(event) => event.preventDefault()}
    >
      <FormItem prop="name" label="姓名">
        {(field) => (
          <Input value={String(field.value ?? '')} onValueChange={field.setValue} placeholder="请输入姓名" />
        )}
      </FormItem>
      <FormItem prop="email" label="邮箱">
        {(field) => (
          <Input
            value={String(field.value ?? '')}
            onValueChange={field.setValue}
            placeholder="name@example.com"
          />
        )}
      </FormItem>
      <FormItem>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              void ref.current
                ?.validate()
                .then(() => setMessage('校验通过'))
                .catch(() => setMessage('请检查字段'));
            }}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              ref.current?.resetFields();
              setMessage('');
            }}
          >
            重置
          </Button>
        </Space>
      </FormItem>
      <p role="status">{message}</p>
    </Form>
  );
}
```

### 嵌套路径与字段实例

按字段校验、清除错误和自定义错误展示。

```tsx
import { useRef } from 'react';
import { Button, Form, FormItem, Input } from 'element-react';
import type { FormHandle } from 'element-react';

/** 单字段校验、嵌套路径与外部错误内容。 */
export default function Example() {
  const ref = useRef<FormHandle>(null);
  return (
    <Form ref={ref} defaultModel={{ profile: { name: '' } }} labelPosition="top">
      <FormItem
        prop={['profile', 'name']}
        label="用户姓名"
        rules={{ required: true, message: '姓名不能为空' }}
        renderError={({ error }) => <span>请修正：{error}</span>}
      >
        {(field) => <Input value={String(field.value ?? '')} onValueChange={field.setValue} />}
      </FormItem>
      <Button
        onClick={() => {
          void ref.current?.validateField('profile.name', () => undefined);
        }}
      >
        校验字段
      </Button>
      <Button onClick={() => ref.current?.clearValidate()}>清除提示</Button>
    </Form>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Form Attributes | model | model | Data of form component. | objectRecord<string, any> | — |
| Form Attributes | rules | rules | Validation rules of form. | objectFormRules | — |
| Form Attributes | inline | inline | Whether the form is inline. | boolean | false |
| Form Attributes | label-position | labelPosition | Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required. | enum'left' \| 'right' \| 'top' | right |
| Form Attributes | label-suffix | labelSuffix | Suffix of the label. | string | '' |
| Form Attributes | hide-required-asterisk | hideRequiredAsterisk | Whether to hide required fields should have a red asterisk (star) beside their labels. | boolean | false |
| Form Attributes | require-asterisk-position | requireAsteriskPosition | Position of asterisk. | enum'left' \| 'right' | left |
| Form Attributes | show-message | showMessage | Whether to show the error message. | boolean | true |
| Form Attributes | inline-message | inlineMessage | Whether to display the error message inline with the form item. | boolean | false |
| Form Attributes | validate-on-rule-change | validateOnRuleChange | Whether to trigger validation when the `rules` prop is changed. | boolean | true |
| Form Attributes | size | size | Control the size of components in this form. | enum'' \| 'large' \| 'default' \| 'small' | — |
| Form Attributes | disabled | disabled | Whether to disable all components in this form. Before ^(2.12.0), if set to `true`, it will override the `disabled` prop of the inner component. After ^(2.12.0), the configuration of the internal components takes precedence. | boolean | false |
| Form Events | validate | onValidate | triggers after a form item is validated | Function(prop: FormItemProp, isValid: boolean, message: string) => void | — |
| Form Slots | default | children | customize default content |  | — |
| Form Exposes | validate | ref.current.validate | Validate the whole form. Receives a callback or returns `Promise`. | Function(callback?: FormValidateCallback) => Promise<void> | — |
| Form Exposes | validateField | ref.current.validateField | Validate specified fields. | Function(props?: Arrayable<FormItemProp> \| undefined, callback?: FormValidateCallback \| undefined) => FormValidationResult | — |
| Form Exposes | resetFields | ref.current.resetFields | Reset specified fields and remove validation result. | Function(props?: Arrayable<FormItemProp> \| undefined) => void | — |
| Form Exposes | clearValidate | ref.current.clearValidate | Clear validation messages for all or specified fields. | Function(props?: Arrayable<FormItemProp> \| undefined) => void | — |
| Form Exposes | fields | ref.current.fields | Get all fields context. | arrayFormItemContext[] | — |
| Form Exposes | getField | ref.current.getField | Get a field context. | Function(prop: FormItemProp) => FormItemContext \| undefined | — |
| Form Exposes | setInitialValues | ref.current.setInitialValues | Set initial values for form fields. When `resetFields` is called, fields will reset to these values. | Function(initModel: Record<string, any>) => void | — |
| FormItem Attributes | prop | prop | A key of `model`. It could be a path of the property (e.g `a.b.0` or `['a', 'b', '0']`). In the use of `validate` and `resetFields` method, the attribute is required. | string / string&#91;&#93; | — |
| FormItem Attributes | label | label | Label text. | string | — |
| FormItem Attributes | required | required | Whether the field is required or not, will be determined by validation rules if omitted. | boolean | — |
| FormItem Attributes | rules | rules | Validation rules of form, see the [following table](#formitemrule), more advanced usage at [async-validator](https://github.com/yiminghe/async-validator). | objectArrayable<FormItemRule> | — |
| FormItem Attributes | error | error | Field error message, set its value and the field will validate error and show this message immediately. | string | — |
| FormItem Attributes | show-message | showMessage | Whether to show the error message. | boolean | true |
| FormItem Attributes | inline-message | inlineMessage | Inline style validate message. | boolean | false |
| FormItem Attributes | size | size | Control the size of components in this form-item. | enum'' \| 'large' \| 'default' \| 'small' | — |
| FormItem Attributes | for | for | Same as for in native label. | string | — |
| FormItem Attributes | validate-status | validateStatus | Validation state of formItem. | enum'' \| 'error' \| 'validating' \| 'success' | — |
| FormItem Slots | default | children | Content of Form Item. | — | — |
| FormItem Slots | label | renderLabel | Custom content to display on label. | object{ label: string } | — |
| FormItem Slots | error | renderError | Custom content to display validation message. | object{ error: string } | — |
| FormItem Exposes | size | ref.current.size | Form item size. | objectComputedRef<'' \| 'large' \| 'default' \| 'small'> | — |
| FormItem Exposes | validateMessage | ref.current.validateMessage | Validation message. | objectRef<string> | — |
| FormItem Exposes | validateState | ref.current.validateState | Validation state. | objectRef<'' \| 'error' \| 'validating' \| 'success'> | — |
| FormItem Exposes | validate | ref.current.validate | Validate form item. | Function(trigger: string, callback?: FormValidateCallback \| undefined) => FormValidationResult | — |
| FormItem Exposes | resetField | ref.current.resetField | Reset current field and remove validation result. | Function() => void | — |
| FormItem Exposes | clearValidate | ref.current.clearValidate | Remove validation status of the field. | Function() => void | — |
| FormItem Exposes | setInitialValue | ref.current.setInitialValue | Set initial value for this field. When `resetField` is called, the field will reset to this value. | Function(value: any) => void | — |

## 完成记录

- [x] form:132 model；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:133 rules；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:134 inline；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:135 labelPosition；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:137 labelSuffix；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:138 hideRequiredAsterisk；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:139 requireAsteriskPosition；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:140 showMessage；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:141 inlineMessage；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:143 validateOnRuleChange；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:144 size；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:145 disabled；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:153 onValidate；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:159 children；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:165 ref.current.validate；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:166 ref.current.validateField；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:167 ref.current.resetFields；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:169 ref.current.clearValidate；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:170 ref.current.fields；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:171 ref.current.getField；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:172 ref.current.setInitialValues；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:180 prop；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:181 label；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:184 required；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:185 rules；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:186 error；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:187 showMessage；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:188 inlineMessage；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:189 size；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:190 for；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:191 validateStatus；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:209 children；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:210 renderLabel；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:211 renderError；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:217 ref.current.size；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:218 ref.current.validateMessage；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:219 ref.current.validateState；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:220 ref.current.validate；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:221 ref.current.resetField；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:222 ref.current.clearValidate；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
- [x] form:223 ref.current.setInitialValue；实现：packages/components/form/index.tsx；测试：tests/form.test.tsx
