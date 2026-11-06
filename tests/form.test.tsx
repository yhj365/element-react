import { createRef, StrictMode, useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { Form, FormItem, Input, Button } from '../packages/element-react';
import type { FormHandle, FormItemHandle, FormRules } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

/** 构造真实受控模型，所有字段写入经过父级回写。 */
function ModelForm({
  formRef,
  rules,
  onValidate,
}: {
  formRef: React.Ref<FormHandle>;
  rules?: FormRules;
  onValidate?: (prop: string | string[], valid: boolean, message: string) => void;
}) {
  const [model, setModel] = useState<Record<string, unknown>>({ name: '', profile: { email: '' } });
  return (
    <Form ref={formRef} model={model} onModelChange={setModel} rules={rules} onValidate={onValidate}>
      <FormItem prop="name" label="姓名">
        {(field) => <Input value={String(field.value ?? '')} onValueChange={field.setValue} />}
      </FormItem>
      <FormItem prop={['profile', 'email']} label="邮箱">
        {(field) => <Input value={String(field.value ?? '')} onValueChange={field.setValue} />}
      </FormItem>
      <Button nativeType="reset">重置</Button>
    </Form>
  );
}

apiTest('form', 'Form Attributes', ['model', 'rules'], 'form-basic', '受控字段与规则校验', async () => {
  const ref = createRef<FormHandle>();
  render(<ModelForm formRef={ref} rules={{ name: { required: true, message: '姓名必填' } }} />);
  let result: unknown;
  await act(async () => {
    try {
      await ref.current!.validate();
    } catch (error) {
      result = error;
    }
  });
  expect(result).toHaveProperty('name');
  expect(screen.getByRole('alert')).toHaveTextContent('姓名必填');
  await userEvent.setup().type(screen.getByRole('textbox', { name: '姓名' }), 'Ada');
  await act(async () => {
    expect(await ref.current!.validate()).toBe(true);
  });
  expect(screen.queryByRole('alert')).toBeNull();
});
apiTest(
  'form',
  'Form Attributes',
  [
    'inline',
    'label-position',
    'label-suffix',
    'hide-required-asterisk',
    'require-asterisk-position',
    'show-message',
    'inline-message',
    'size',
    'disabled',
  ],
  'form-basic',
  '布局尺寸禁用及错误展示',
  async () => {
    const { rerender } = render(
      <Form
        inline
        labelPosition="top"
        labelSuffix="："
        hideRequiredAsterisk
        requireAsteriskPosition="right"
        showMessage
        inlineMessage
        size="small"
        disabled
      >
        <FormItem label="姓名" error="外部错误" required>
          <Input />
        </FormItem>
        <FormItem>
          <Input disabled={false} aria-label="独立启用" />
        </FormItem>
      </Form>,
    );
    expect(document.querySelector('.el-form')).toHaveClass(
      'el-form--inline',
      'el-form--label-top',
      'el-form--small',
    );
    expect(screen.getByText('姓名：').closest('.el-form-item')).toHaveClass(
      'is-no-asterisk',
      'asterisk-right',
    );
    expect(screen.getByRole('textbox', { name: '姓名：' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: '独立启用' })).not.toBeDisabled();
    expect(screen.getByRole('alert')).toHaveClass('el-form-item__error--inline');
    rerender(
      <Form showMessage={false}>
        <FormItem error="不显示">
          <Input />
        </FormItem>
      </Form>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
  },
);
apiTest(
  'form',
  'Form Attributes',
  ['validate-on-rule-change'],
  'form-rules',
  '规则变化按配置重新校验',
  async () => {
    const ref = createRef<FormHandle>();
    const { rerender } = render(
      <Form ref={ref} defaultModel={{ name: '' }} rules={{ name: { min: 0 } }}>
        <FormItem prop="name">
          <Input />
        </FormItem>
      </Form>,
    );
    rerender(
      <Form ref={ref} defaultModel={{ name: '' }} rules={{ name: { required: true, message: '新规则' } }}>
        <FormItem prop="name">
          <Input />
        </FormItem>
      </Form>,
    );
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('新规则'));
  },
);
apiTest('form', 'Form Events', ['validate'], 'form-basic', '逐字段校验通知', async () => {
  const ref = createRef<FormHandle>(),
    validate = vi.fn();
  render(
    <ModelForm formRef={ref} rules={{ name: { required: true, message: '必填' } }} onValidate={validate} />,
  );
  await act(async () => {
    await ref.current!.validate(() => undefined);
  });
  expect(validate).toHaveBeenCalledWith('name', false, '必填');
});
apiTest('form', 'Form Slots', ['default'], 'form-basic', '容纳字段及动作', () => {
  render(
    <Form>
      <FormItem label="字段">
        <Input />
      </FormItem>
      <Button>提交</Button>
    </Form>,
  );
  expect(screen.getByRole('button')).toHaveTextContent('提交');
});
apiTest(
  'form',
  'Form Exposes',
  ['validate', 'validateField', 'fields', 'getField', 'clearValidate'],
  'form-rules',
  '实例字段查询与单字段校验',
  async () => {
    const ref = createRef<FormHandle>();
    render(
      <ModelForm
        formRef={ref}
        rules={{
          name: { required: true, message: '必填' },
          'profile.email': { required: true, message: '邮箱必填' },
        }}
      />,
    );
    expect(ref.current?.fields).toHaveLength(2);
    expect(ref.current?.getField(['profile', 'email'])?.prop).toEqual(['profile', 'email']);
    await act(async () => {
      expect(await ref.current!.validateField('name', () => undefined)).toBe(false);
    });
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    act(() => ref.current?.clearValidate('name'));
    expect(screen.queryByRole('alert')).toBeNull();
  },
);
apiTest(
  'form',
  'Form Exposes',
  ['resetFields', 'setInitialValues'],
  'form-basic',
  '重置多个字段一次回写，更新初始值不改变当前模型',
  async () => {
    const ref = createRef<FormHandle>();
    render(<ModelForm formRef={ref} />);
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: '姓名' }), 'Ada');
    await user.type(screen.getByRole('textbox', { name: '邮箱' }), 'a@b.com');
    act(() => ref.current?.setInitialValues({ name: '初始姓名', profile: { email: 'initial@example.com' } }));
    expect(screen.getByRole('textbox', { name: '姓名' })).toHaveValue('Ada');
    fireEvent.click(screen.getByRole('button', { name: '重置' }));
    expect(screen.getByRole('textbox', { name: '姓名' })).toHaveValue('初始姓名');
    expect(screen.getByRole('textbox', { name: '邮箱' })).toHaveValue('initial@example.com');
  },
);
apiTest(
  'form',
  'FormItem Attributes',
  [
    'prop',
    'label',
    'required',
    'rules',
    'error',
    'show-message',
    'inline-message',
    'size',
    'for',
    'validate-status',
  ],
  'form-rules',
  '字段路径局部配置和外部错误',
  () => {
    render(
      <Form size="small">
        <FormItem
          prop={['a', 'b']}
          label="名称"
          required
          rules={{ required: true }}
          error="错误"
          showMessage
          inlineMessage
          size="large"
          for="custom"
          validateStatus="error"
        >
          <Input id="custom" />
        </FormItem>
      </Form>,
    );
    const field = document.querySelector('.el-form-item');
    expect(field).toHaveClass('is-required', 'is-error', 'el-form-item--large');
    expect(screen.getByRole('textbox', { name: '名称' })).toHaveAttribute('id', 'custom');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('错误');
  },
);
apiTest(
  'form',
  'FormItem Slots',
  ['default', 'label', 'error'],
  'form-rules',
  '字段自定义内容和错误作用域',
  () => {
    render(
      <Form>
        <FormItem
          renderLabel={<b>标签</b>}
          error="出错"
          renderError={({ error }) => <span>{error}详情</span>}
        >
          <Input />
        </FormItem>
      </Form>,
    );
    expect(screen.getByText('标签').tagName).toBe('B');
    expect(screen.getByText('出错详情')).toBeInTheDocument();
  },
);
apiTest(
  'form',
  'FormItem Exposes',
  ['size', 'validateMessage', 'validateState', 'validate', 'resetField', 'clearValidate', 'setInitialValue'],
  'form-rules',
  '字段实例校验清理和初始值',
  async () => {
    const ref = createRef<FormItemHandle>();
    render(
      <Form defaultModel={{ name: '' }} size="small">
        <FormItem ref={ref} prop="name" label="姓名" rules={{ required: true, message: '必填' }}>
          {(field) => <Input value={String(field.value ?? '')} onValueChange={field.setValue} />}
        </FormItem>
      </Form>,
    );
    await act(async () => {
      expect(await ref.current!.validate('', () => undefined)).toBe(false);
    });
    expect(ref.current?.validateState).toBe('error');
    expect(ref.current?.validateMessage).toBe('必填');
    expect(ref.current?.size).toBe('small');
    act(() => ref.current?.clearValidate());
    expect(ref.current?.validateState).toBe('');
    act(() => ref.current?.setInitialValue('新的初始值'));
    act(() => ref.current?.resetField());
    expect(screen.getByRole('textbox')).toHaveValue('新的初始值');
  },
);
featureTest(
  'form',
  'validation-trigger',
  'form-basic',
  'Input按blur/change触发规则且validateEvent可关闭',
  async () => {
    const ref = createRef<FormHandle>();
    render(
      <ModelForm formRef={ref} rules={{ name: { required: true, message: '失焦必填', trigger: 'blur' } }} />,
    );
    const input = screen.getByRole('textbox', { name: '姓名' });
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.blur(input);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('失焦必填'));
  },
);
featureTest('form', 'dynamic-registration', 'form-rules', 'StrictMode字段卸载正确注销且不重复注册', () => {
  const ref = createRef<FormHandle>();
  const { rerender } = render(
    <StrictMode>
      <Form ref={ref}>
        <FormItem prop="a">
          <Input />
        </FormItem>
      </Form>
    </StrictMode>,
  );
  expect(ref.current?.fields).toHaveLength(1);
  rerender(
    <StrictMode>
      <Form ref={ref} />
    </StrictMode>,
  );
  expect(ref.current?.fields).toHaveLength(0);
});
featureTest('form', 'multiple-labels', 'form-basic', '单输入关联label，多输入使用group语义', () => {
  render(
    <Form>
      <FormItem label="单个">
        <Input />
      </FormItem>
      <FormItem label="多个">
        <Input aria-label="起点" />
        <Input aria-label="终点" />
      </FormItem>
    </Form>,
  );
  expect(screen.getByRole('textbox', { name: '单个' })).toBeInTheDocument();
  expect(screen.getByRole('group', { name: '多个' })).toBeInTheDocument();
});
