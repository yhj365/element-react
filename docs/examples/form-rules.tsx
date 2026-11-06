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
