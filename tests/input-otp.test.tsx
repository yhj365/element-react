import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { ConfigProvider, InputOtp } from '../packages/element-react';
import type { InputOtpHandle } from '../packages/element-react';
import { FieldValidationContext } from '../packages/hooks';
import { apiTest, featureTest } from './contract';

apiTest(
  'input-otp',
  'Attributes',
  ['model-value', 'length'],
  'input-otp-basic',
  '受控值同步且长度变化截断不触发完成',
  () => {
    const change = vi.fn(),
      finish = vi.fn();
    const view = render(<InputOtp value="012345" onValueChange={change} onFinish={finish} />);
    expect(screen.getAllByRole('textbox').map((input) => (input as HTMLInputElement).value)).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
    view.rerender(<InputOtp value="987654" length={4} onValueChange={change} onFinish={finish} />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    expect(change).toHaveBeenCalledExactlyOnceWith('9876');
    expect(finish).not.toHaveBeenCalled();
  },
);
apiTest(
  'input-otp',
  'Attributes',
  ['validator', 'inputmode', 'id', 'aria-label'],
  'input-otp-basic',
  '按字符和目标位置校验自动填充并保留前导零',
  () => {
    const validator = vi.fn((char: string) => /^\d$/.test(char)),
      change = vi.fn();
    render(
      <InputOtp
        validator={validator}
        onValueChange={change}
        inputMode="numeric"
        id="otp"
        ariaLabel="验证码"
      />,
    );
    const group = screen.getByRole('group', { name: '验证码' });
    expect(group).toHaveAttribute('id', 'otp');
    const input = screen.getAllByRole('textbox')[0];
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    fireEvent.change(input, { target: { value: 'a01b234567' } });
    expect(change).toHaveBeenLastCalledWith('012345');
    expect(validator).toHaveBeenCalledWith('0', 0);
    expect(screen.getAllByRole('textbox')[5]).toHaveFocus();
  },
);
apiTest(
  'input-otp',
  'Events',
  ['update:modelValue', 'finish'],
  'input-otp-basic',
  '用户补满只发出一次完成而外部赋值不触发',
  () => {
    const change = vi.fn(),
      finish = vi.fn();
    render(<InputOtp length={3} onValueChange={change} onFinish={finish} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '0' } });
    fireEvent.change(inputs[1], { target: { value: '1' } });
    fireEvent.change(inputs[2], { target: { value: '2' } });
    expect(change.mock.calls.map((call) => call[0])).toEqual(['0', '01', '012']);
    expect(finish).toHaveBeenCalledExactlyOnceWith('012');
    fireEvent.change(inputs[2], { target: { value: '2' } });
    expect(finish).toHaveBeenCalledOnce();
  },
);
apiTest(
  'input-otp',
  'Attributes',
  ['type', 'size', 'mask', 'disabled', 'readonly'],
  'input-otp-basic',
  '外观类型、密码掩码、全局尺寸和禁用只读',
  () => {
    const change = vi.fn();
    const view = render(
      <ConfigProvider size="large">
        <InputOtp type="filled" mask disabled onValueChange={change} />
      </ConfigProvider>,
    );
    expect(screen.getByRole('group')).toHaveClass(
      'el-input-otp--filled',
      'el-input-otp--large',
      'is-disabled',
    );
    expect(view.container.querySelector('input')).toHaveAttribute('type', 'password');
    expect(view.container.querySelector('input')).toBeDisabled();
    view.rerender(<InputOtp type="underlined" defaultValue="12" readOnly onValueChange={change} />);
    const input = screen.getAllByRole('textbox')[0];
    expect(input).toHaveAttribute('readonly');
    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.keyDown(input, { key: 'Delete' });
    expect(change).not.toHaveBeenCalled();
    expect(input).toHaveValue('1');
  },
);
apiTest(
  'input-otp',
  'Attributes',
  ['separator'],
  'input-otp-basic',
  '静态和函数分隔符仅渲染在相邻输入之间',
  () => {
    const view = render(<InputOtp length={4} separator="-" />);
    expect(screen.getByRole('group').textContent).toBe('---');
    view.rerender(<InputOtp length={4} separator={(index) => <b>{index}</b>} />);
    expect(view.container.querySelectorAll('b')).toHaveLength(3);
    expect(view.container.querySelector('b')).toHaveTextContent('0');
  },
);
apiTest('input-otp', 'Slots', ['separator'], 'input-otp-basic', '分隔符插槽优先于普通分隔符', () => {
  render(<InputOtp length={3} separator="-" renderSeparator={({ index }) => <span>分隔{index}</span>} />);
  expect(screen.getByText('分隔0')).toBeInTheDocument();
  expect(screen.getByText('分隔1')).toBeInTheDocument();
  expect(screen.queryByText('-')).toBeNull();
});
apiTest(
  'input-otp',
  'Events',
  ['focus', 'blur', 'change'],
  'input-otp-basic',
  '组内焦点移动不重复触发事件且离组后提交change',
  () => {
    const focus = vi.fn(),
      blur = vi.fn(),
      change = vi.fn();
    render(
      <>
        <InputOtp length={3} onFocus={focus} onBlur={blur} onChange={change} />
        <button>外部</button>
      </>,
    );
    const inputs = screen.getAllByRole('textbox');
    act(() => inputs[0].focus());
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[1]).toHaveFocus();
    expect(focus).toHaveBeenCalledOnce();
    expect(blur).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
    act(() => screen.getByRole('button').focus());
    expect(blur).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledExactlyOnceWith('1');
    act(() => inputs[0].focus());
    act(() => screen.getByRole('button').focus());
    expect(change).toHaveBeenCalledOnce();
  },
);
apiTest(
  'input-otp',
  'Exposes',
  ['inputRefs', 'focus', 'blur'],
  'input-otp-basic',
  '公开DOM引用及焦点方法使用有效边界',
  () => {
    const ref = createRef<InputOtpHandle>();
    render(<InputOtp ref={ref} length={3} />);
    expect(ref.current?.inputRefs).toHaveLength(3);
    act(() => ref.current?.focus(99));
    expect(screen.getAllByRole('textbox')[2]).toHaveFocus();
    act(() => ref.current?.focus(-1));
    expect(screen.getAllByRole('textbox')[0]).toHaveFocus();
    act(() => ref.current?.blur());
    expect(screen.getAllByRole('textbox')[0]).not.toHaveFocus();
  },
);
apiTest('input-otp', 'Attributes', ['validate-event'], 'input-otp-basic', '变更和失焦校验可同时关闭', () => {
  const context = { change: vi.fn(), blur: vi.fn(), invalid: false, errorId: 'otp-error' };
  const view = render(
    <FieldValidationContext value={context}>
      <InputOtp length={2} />
    </FieldValidationContext>,
  );
  fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '1' } });
  fireEvent.blur(screen.getAllByRole('textbox')[1]);
  expect(context.change).toHaveBeenCalledWith('1');
  expect(context.blur).toHaveBeenCalledOnce();
  context.change.mockClear();
  context.blur.mockClear();
  view.rerender(
    <FieldValidationContext value={context}>
      <InputOtp length={2} validateEvent={false} />
    </FieldValidationContext>,
  );
  fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '2' } });
  fireEvent.blur(screen.getAllByRole('textbox')[1]);
  expect(context.change).not.toHaveBeenCalled();
  expect(context.blur).not.toHaveBeenCalled();
});
featureTest(
  'input-otp',
  'keyboard-delete',
  'input-otp-basic',
  '方向键和删除保持格位、填补优先前方空格',
  () => {
    const change = vi.fn();
    render(<InputOtp length={4} defaultValue="1234" onValueChange={change} />);
    const inputs = screen.getAllByRole('textbox');
    act(() => inputs[2].focus());
    fireEvent.keyDown(inputs[2], { key: 'Backspace' });
    expect(inputs[1]).toHaveFocus();
    expect(inputs[2]).toHaveValue('');
    expect(inputs[3]).toHaveValue('4');
    fireEvent.keyDown(inputs[1], { key: 'ArrowRight' });
    expect(inputs[2]).toHaveFocus();
    fireEvent.change(inputs[3], { target: { value: '9' } });
    expect(inputs[2]).toHaveValue('9');
    expect(inputs[3]).toHaveValue('4');
    expect(change).toHaveBeenLastCalledWith('1294');
    fireEvent.keyDown(inputs[0], { key: 'Delete' });
    expect(inputs[0]).toHaveFocus();
    expect(inputs[0]).toHaveValue('');
  },
);
