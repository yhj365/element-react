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
