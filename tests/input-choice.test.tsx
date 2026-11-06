import { createRef, StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';
import {
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  ConfigProvider,
  Input,
  InputNumber,
  Radio,
  RadioButton,
  RadioGroup,
  Segmented,
  Switch,
} from '../packages/element-react';
import type { InputHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

describe('Input', () => {
  apiTest(
    'input',
    'Attributes',
    [
      'model-value',
      'type',
      'placeholder',
      'disabled',
      'size',
      'readonly',
      'maxlength',
      'minlength',
      'autocomplete',
      'name',
      'autofocus',
      'form',
      'aria-label',
      'tabindex',
      'inputmode',
    ],
    'input-basic',
    '原生属性和值模型',
    () => {
      const change = vi.fn();
      render(
        <Input
          value="当前值"
          type="email"
          placeholder="邮箱"
          size="small"
          readOnly
          maxLength={20}
          minLength={2}
          autoComplete="email"
          name="email"
          autoFocus
          form="account"
          aria-label="邮箱"
          tabIndex={3}
          inputMode="email"
          onValueChange={change}
        />,
      );
      const field = screen.getByRole('textbox');
      expect(field).toHaveValue('当前值');
      for (const [key, value] of Object.entries({
        type: 'email',
        placeholder: '邮箱',
        maxlength: '20',
        minlength: '2',
        autocomplete: 'email',
        name: 'email',
        form: 'account',
        'aria-label': '邮箱',
        tabindex: '3',
        inputmode: 'email',
      }))
        expect(field).toHaveAttribute(key, value);
      expect(field).toHaveAttribute('readonly');
      expect(field.closest('.el-input')).toHaveClass('el-input--small');
      expect(field).toHaveFocus();
    },
  );
  featureTest('input', 'controlled-uncontrolled', 'input-basic', '父级拒绝回写和非受控初始化', async () => {
    const user = userEvent.setup(),
      update = vi.fn();
    const { rerender } = render(<Input value="A" onValueChange={update} />);
    await user.type(screen.getByRole('textbox'), 'B');
    expect(update).toHaveBeenCalledWith('AB');
    expect(screen.getByRole('textbox')).toHaveValue('A');
    rerender(<Input key="uncontrolled" defaultValue="X" />);
    await user.type(screen.getByRole('textbox'), 'Y');
    expect(screen.getByRole('textbox')).toHaveValue('XY');
  });
  apiTest('input', 'Attributes', ['formatter', 'parser'], 'input-format', '展示格式与绑定值分离', () => {
    const update = vi.fn();
    render(
      <Input
        value="1234"
        formatter={(v) => `$${v}`}
        parser={(v) => v.replace(/\$/g, '')}
        onValueChange={update}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveValue('$1234');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '$5678' } });
    expect(update).toHaveBeenCalledWith('5678');
  });
  apiTest('input', 'Attributes', ['clearable', 'clear-icon'], 'input-clear', '清除按钮图标', () => {
    render(<Input defaultValue="内容" clearable clearIcon={<span>清空图标</span>} />);
    expect(screen.getByText('清空图标')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
  apiTest('input', 'Events', ['change', 'input', 'clear'], 'input-clear', '清空事件序列', () => {
    const calls: string[] = [];
    render(
      <Input
        defaultValue="内容"
        clearable
        onValueChange={(v) => calls.push(`value:${v}`)}
        onInput={(v) => calls.push(`input:${v}`)}
        onChange={(v) => calls.push(`change:${v}`)}
        onClear={() => calls.push('clear')}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(calls).toEqual(['value:', 'change:', 'clear', 'input:']);
  });
  apiTest('input', 'Events', ['focus', 'blur', 'keydown'], 'input-basic', '焦点和键盘事件', () => {
    const focus = vi.fn(),
      blur = vi.fn(),
      keydown = vi.fn();
    render(<Input onFocus={focus} onBlur={blur} onKeyDown={keydown} />);
    const field = screen.getByRole('textbox');
    fireEvent.focus(field);
    fireEvent.keyDown(field, { key: 'Enter' });
    fireEvent.blur(field);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);
    expect(keydown).toHaveBeenCalledTimes(1);
  });
  featureTest('input', 'ime', 'input-basic', '组合输入只在结束时提交', () => {
    const update = vi.fn();
    render(<Input onValueChange={update} />);
    const field = screen.getByRole('textbox');
    fireEvent.compositionStart(field);
    fireEvent.change(field, { target: { value: '拼' } });
    expect(update).not.toHaveBeenCalled();
    fireEvent.compositionEnd(field, { target: { value: '拼音' } });
    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith('拼音');
  });
  apiTest(
    'input',
    'Attributes',
    ['show-password', 'show-word-limit', 'word-limit-position'],
    'input-password',
    '密码显隐和字数统计',
    () => {
      render(
        <Input defaultValue="secret" showPassword showWordLimit maxLength={20} wordLimitPosition="outside" />,
      );
      const input = document.querySelector('input');
      expect(input).toHaveAttribute('type', 'password');
      fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByText('6 / 20').parentElement).toHaveClass('is-outside');
    },
  );
  apiTest(
    'input',
    'Attributes',
    ['prefix-icon', 'suffix-icon', 'input-style'],
    'input-slots',
    '输入图标和内部样式',
    () => {
      render(
        <Input
          prefixIcon={<span>前图标</span>}
          suffixIcon={<span>后图标</span>}
          inputStyle={{ color: 'red' }}
        />,
      );
      expect(screen.getByText('前图标').closest('.el-input__prefix')).not.toBeNull();
      expect(screen.getByText('后图标').closest('.el-input__suffix')).not.toBeNull();
      expect(screen.getByRole('textbox')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    },
  );
  apiTest(
    'input',
    'Slots',
    ['prefix', 'suffix', 'prepend', 'append', 'password-icon'],
    'input-slots',
    '具名内容与密码作用域',
    () => {
      render(
        <Input
          defaultValue="x"
          showPassword
          renderPrefix="前缀"
          renderSuffix="后缀"
          renderPrepend="https://"
          renderAppend=".com"
          renderPasswordIcon={(v) => <span>{v ? '隐藏' : '显示'}</span>}
        />,
      );
      for (const text of ['前缀', '后缀', 'https://', '.com', '显示'])
        expect(screen.getByText(text)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('隐藏')).toBeInTheDocument();
    },
  );
  apiTest('input', 'Attributes', ['rows', 'resize'], 'input-textarea', '多行文本行数和resize', () => {
    render(<Input type="textarea" rows={4} resize="vertical" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
    expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'vertical' });
  });
  apiTest(
    'input',
    'Exposes',
    ['input', 'textarea', 'ref', 'focus', 'blur', 'select', 'clear'],
    'input-clear',
    '输入实例方法',
    () => {
      const ref = createRef<InputHandle>();
      const { rerender } = render(<Input ref={ref} defaultValue="abc" />);
      expect(ref.current?.input).toBe(screen.getByRole('textbox'));
      expect(ref.current?.ref).toBe(screen.getByRole('textbox'));
      act(() => ref.current?.focus());
      expect(screen.getByRole('textbox')).toHaveFocus();
      act(() => ref.current?.select());
      expect(ref.current?.input?.selectionEnd).toBe(3);
      act(() => ref.current?.blur());
      expect(screen.getByRole('textbox')).not.toHaveFocus();
      act(() => ref.current?.clear());
      expect(screen.getByRole('textbox')).toHaveValue('');
      rerender(<Input ref={ref} type="textarea" />);
      expect(ref.current?.textarea).toBe(screen.getByRole('textbox'));
    },
  );
});

describe('InputNumber', () => {
  apiTest(
    'input-number',
    'Attributes',
    [
      'model-value',
      'min',
      'max',
      'step',
      'step-strictly',
      'precision',
      'controls',
      'controls-position',
      'size',
      'readonly',
      'disabled',
      'name',
      'placeholder',
    ],
    'input-number-basic',
    '数字边界步长和精度',
    () => {
      const change = vi.fn();
      render(
        <InputNumber
          defaultValue={2}
          min={0}
          max={4}
          step={0.5}
          stepStrictly
          precision={1}
          controlsPosition="right"
          size="small"
          name="count"
          placeholder="数量"
          onChange={change}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
      expect(screen.getByRole('spinbutton')).toHaveValue(2.5);
      expect(change).toHaveBeenCalledWith(2.5, 2);
      expect(document.querySelector('.el-input-number')).toHaveClass(
        'is-controls-right',
        'el-input-number--small',
      );
      expect(screen.getByRole('spinbutton')).toHaveAttribute('name', 'count');
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '100' } });
      expect(screen.getByRole('spinbutton')).toHaveValue(4);
    },
  );
  apiTest('input-number', 'Events', ['change'], 'input-number-basic', '空值和键盘更新', () => {
    const change = vi.fn();
    render(<InputNumber defaultValue={1} onChange={change} />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowDown' });
    expect(change).toHaveBeenCalledWith(0, 1);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(change).toHaveBeenLastCalledWith(null, 0);
  });
  featureTest(
    'input-number',
    'disabled-readonly-controls',
    'input-number-basic',
    '禁用只读和隐藏控制器',
    () => {
      const update = vi.fn();
      const { rerender } = render(<InputNumber disabled onValueChange={update} />);
      fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
      expect(update).not.toHaveBeenCalled();
      rerender(<InputNumber readOnly controls={false} />);
      expect(screen.queryByRole('button')).toBeNull();
      expect(screen.getByRole('spinbutton')).toHaveAttribute('readonly');
    },
  );
});

describe('选择控件', () => {
  apiTest(
    'checkbox',
    'Checkbox Attributes',
    [
      'checked',
      'disabled',
      'indeterminate',
      'border',
      'size',
      'name',
      'id',
      'label',
      'true-value',
      'false-value',
    ],
    'checkbox-basic',
    '复选框半选和自定义值',
    () => {
      const change = vi.fn();
      const { rerender } = render(
        <Checkbox
          defaultChecked
          indeterminate
          border
          size="large"
          name="accept"
          id="accept"
          label="同意"
          trueValue="yes"
          falseValue="no"
          onValueChange={change}
        />,
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(checkbox).toBePartiallyChecked();
      expect(checkbox).toHaveAttribute('name', 'accept');
      expect(checkbox).toHaveAttribute('id', 'accept');
      expect(screen.getByText('同意').closest('label')).toHaveClass('is-bordered', 'el-checkbox--large');
      fireEvent.click(checkbox);
      expect(change).toHaveBeenCalledWith('no');
      rerender(<Checkbox disabled label="同意" />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    },
  );
  apiTest('checkbox', 'Checkbox Events', ['change'], 'checkbox-basic', '独立复选事件', () => {
    const change = vi.fn();
    render(<Checkbox onChange={change}>同意</Checkbox>);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(change).toHaveBeenCalledWith(true);
  });
  apiTest('checkbox', 'Checkbox Slots', ['default'], 'checkbox-basic', '复选内容覆盖label', () => {
    render(<Checkbox label="属性标签">自定义标签</Checkbox>);
    expect(screen.queryByText('属性标签')).toBeNull();
    expect(screen.getByText('自定义标签')).toBeInTheDocument();
  });
  apiTest(
    'checkbox',
    'CheckboxGroup Attributes',
    ['model-value', 'min', 'max', 'size', 'disabled', 'aria-label'],
    'checkbox-group',
    '组数量限制和配置继承',
    () => {
      render(
        <CheckboxGroup defaultValue={['a']} min={1} max={2} size="small" ariaLabel="选择分组">
          <Checkbox value="a">A</Checkbox>
          <Checkbox value="b">B</Checkbox>
          <Checkbox value="c">C</Checkbox>
        </CheckboxGroup>,
      );
      const [a, b, c] = screen.getAllByRole('checkbox');
      expect(a).toBeDisabled();
      fireEvent.click(b);
      expect(b).toBeChecked();
      expect(c).toBeDisabled();
      expect(screen.getByRole('group')).toHaveAttribute('aria-label', '选择分组');
      expect(screen.getByText('B').closest('label')).toHaveClass('el-checkbox--small');
    },
  );
  apiTest('checkbox', 'CheckboxGroup Events', ['change'], 'checkbox-group', '组更新保持不可变', () => {
    const value = ['a'],
      change = vi.fn();
    render(
      <CheckboxGroup value={value} onChange={change}>
        <Checkbox value="b">B</Checkbox>
      </CheckboxGroup>,
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(change).toHaveBeenCalledWith(['a', 'b']);
    expect(value).toEqual(['a']);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
  apiTest('checkbox', 'CheckboxGroup Slots', ['default'], 'checkbox-group', '组可容纳按钮复选', () => {
    render(
      <CheckboxGroup>
        <CheckboxButton value="a">按钮</CheckboxButton>
      </CheckboxGroup>,
    );
    expect(screen.getByText('按钮')).toHaveClass('el-checkbox-button__inner');
  });
  apiTest(
    'checkbox',
    'CheckboxButton Attributes',
    ['value', 'label', 'disabled', 'name'],
    'checkbox-buttons',
    '按钮复选选项',
    () => {
      render(
        <CheckboxGroup>
          <CheckboxButton value="a" label="A" name="letters" disabled />
        </CheckboxGroup>,
      );
      expect(screen.getByRole('checkbox')).toBeDisabled();
      expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'letters');
      expect(screen.getByText('A')).toBeInTheDocument();
    },
  );
  apiTest('checkbox', 'CheckboxButton Slots', ['default'], 'checkbox-buttons', '按钮复选内容', () => {
    render(<CheckboxButton>自定义</CheckboxButton>);
    expect(screen.getByText('自定义')).toHaveClass('el-checkbox-button__inner');
  });
  apiTest(
    'radio',
    'RadioGroup Attributes',
    ['model-value', 'size', 'disabled', 'name', 'aria-label'],
    'radio-basic',
    '单选组值和配置',
    () => {
      const { rerender } = render(
        <RadioGroup defaultValue="a" size="small" name="letters" ariaLabel="字母">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>,
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', '字母');
      const [a, b] = screen.getAllByRole('radio');
      expect(a).toBeChecked();
      expect(b).toHaveAttribute('name', 'letters');
      fireEvent.click(b);
      expect(b).toBeChecked();
      expect(a).not.toBeChecked();
      expect(screen.getByText('B').closest('label')).toHaveClass('el-radio--small');
      rerender(
        <RadioGroup disabled>
          <Radio value="b" label="B" />
        </RadioGroup>,
      );
      expect(screen.getByRole('radio')).toBeDisabled();
    },
  );
  apiTest(
    'radio',
    'Radio Attributes',
    ['value', 'label', 'disabled', 'border', 'size', 'name'],
    'radio-basic',
    '单选项属性',
    () => {
      render(<Radio value={3} label="三" disabled border size="large" name="number" />);
      expect(screen.getByRole('radio')).toHaveAttribute('value', '3');
      expect(screen.getByRole('radio')).toHaveAttribute('name', 'number');
      expect(screen.getByRole('radio')).toBeDisabled();
      expect(screen.getByText('三').closest('label')).toHaveClass('is-bordered', 'el-radio--large');
    },
  );
  for (const section of ['RadioGroup Events', 'Radio Events'])
    apiTest('radio', section, ['change'], 'radio-basic', section, () => {
      const group = vi.fn(),
        single = vi.fn();
      render(
        <RadioGroup onChange={group}>
          <Radio value="b" onChange={single}>
            B
          </Radio>
        </RadioGroup>,
      );
      fireEvent.click(screen.getByRole('radio'));
      expect(group).toHaveBeenCalledWith('b');
      expect(single).toHaveBeenCalledWith('b');
    });
  for (const section of ['RadioGroup Slots', 'Radio Slots', 'RadioButton Slots'])
    apiTest('radio', section, ['default'], 'radio-buttons', section, () => {
      render(
        <RadioGroup>
          <RadioButton value="a">甲</RadioButton>
          <Radio value="b">乙</Radio>
        </RadioGroup>,
      );
      expect(screen.getByText('甲')).toHaveClass('el-radio-button__inner');
      expect(screen.getByText('乙')).toHaveClass('el-radio__label');
    });
  apiTest(
    'radio',
    'RadioButton Attributes',
    ['value', 'label', 'disabled', 'name'],
    'radio-buttons',
    '按钮单选属性',
    () => {
      render(
        <RadioGroup>
          <RadioButton value="a" label="甲" disabled name="button" />
        </RadioGroup>,
      );
      expect(screen.getByRole('radio')).toHaveAttribute('name', 'button');
      expect(screen.getByRole('radio')).toHaveAttribute('value', 'a');
      expect(screen.getByRole('radio')).toBeDisabled();
    },
  );
  apiTest(
    'switch',
    'Attributes',
    [
      'model-value',
      'active-value',
      'inactive-value',
      'disabled',
      'loading',
      'size',
      'width',
      'name',
      'aria-label',
    ],
    'switch-basic',
    '开关自定义值和禁用',
    () => {
      const update = vi.fn();
      const { rerender } = render(
        <Switch
          defaultValue="off"
          activeValue="on"
          inactiveValue="off"
          size="large"
          width={64}
          name="enabled"
          ariaLabel="启用"
          onValueChange={update}
        />,
      );
      expect(screen.getByRole('switch')).toHaveAttribute('name', 'enabled');
      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', '启用');
      expect(document.querySelector('.el-switch')).toHaveClass('el-switch--large');
      expect(document.querySelector('.el-switch__core')).toHaveStyle({ 'min-width': '64px' });
      fireEvent.click(screen.getByRole('switch'));
      expect(update).toHaveBeenCalledWith('on');
      rerender(<Switch loading />);
      expect(screen.getByRole('switch')).toBeDisabled();
      rerender(<Switch disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    },
  );
  apiTest(
    'switch',
    'Attributes',
    [
      'active-text',
      'inactive-text',
      'inline-prompt',
      'active-icon',
      'inactive-icon',
      'active-action-icon',
      'inactive-action-icon',
    ],
    'switch-labels',
    '开关文字图标和动作',
    () => {
      const { rerender } = render(<Switch activeText="开启" inactiveText="关闭" />);
      expect(screen.getByText('开启')).toBeInTheDocument();
      expect(screen.getByText('关闭')).toBeInTheDocument();
      rerender(
        <Switch
          value={true}
          inlinePrompt
          activeIcon={<span>开启图标</span>}
          inactiveIcon={<span>关闭图标</span>}
          activeActionIcon={<span>动作开</span>}
          inactiveActionIcon={<span>动作关</span>}
        />,
      );
      expect(screen.getByText('开启图标')).toBeInTheDocument();
      expect(screen.getByText('动作开')).toBeInTheDocument();
      rerender(<Switch value={false} inlinePrompt inactiveIcon="关闭图标" inactiveActionIcon="动作关" />);
      expect(screen.getByText('关闭图标')).toBeInTheDocument();
      expect(screen.getByText('动作关')).toBeInTheDocument();
    },
  );
  apiTest('switch', 'Attributes', ['before-change'], 'switch-async', '异步开关拦截与拒绝恢复', async () => {
    let resolve!: (value: boolean) => void;
    const change = vi.fn();
    const { rerender } = render(
      <Switch
        beforeChange={() =>
          new Promise<boolean>((r) => {
            resolve = r;
          })
        }
        onChange={change}
      />,
    );
    fireEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(change).not.toHaveBeenCalled();
    await act(async () => resolve(false));
    expect(screen.getByRole('switch')).not.toBeDisabled();
    expect(change).not.toHaveBeenCalled();
    rerender(<Switch beforeChange={() => Promise.reject(new Error('拒绝'))} onChange={change} />);
    await act(async () => fireEvent.click(screen.getByRole('switch')));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).not.toBeDisabled();
  });
  apiTest('switch', 'Events', ['change'], 'switch-basic', '开关通知序列', () => {
    const calls: string[] = [];
    render(
      <StrictMode>
        <Switch onValueChange={(v) => calls.push(`value:${v}`)} onChange={(v) => calls.push(`change:${v}`)} />
      </StrictMode>,
    );
    fireEvent.click(screen.getByRole('switch'));
    expect(calls).toEqual(['value:true', 'change:true']);
  });
  apiTest(
    'switch',
    'Switch Slots',
    ['active-action', 'inactive-action', 'active', 'inactive'],
    'switch-labels',
    '开关具名区域',
    () => {
      render(
        <Switch
          value={true}
          renderActive="开启内容"
          renderInactive="关闭内容"
          renderActiveAction="动作内容"
          renderInactiveAction="隐藏动作"
        />,
      );
      expect(screen.getByText('开启内容')).toBeInTheDocument();
      expect(screen.getByText('关闭内容')).toBeInTheDocument();
      expect(screen.getByText('动作内容')).toBeInTheDocument();
      expect(screen.queryByText('隐藏动作')).toBeNull();
    },
  );
  apiTest('switch', 'Exposes', ['focus'], 'switch-basic', '开关实例聚焦', () => {
    const ref = createRef<{ focus: () => void; checked: boolean }>();
    render(<Switch ref={ref} />);
    act(() => ref.current?.focus());
    expect(screen.getByRole('switch')).toHaveFocus();
  });
  apiTest(
    'segmented',
    'Attributes',
    ['model-value', 'options', 'size', 'block', 'disabled', 'name', 'aria-label', 'direction'],
    'segmented-basic',
    '分段选项和方向',
    () => {
      const change = vi.fn();
      render(
        <Segmented
          defaultValue="a"
          options={[
            { label: '甲', value: 'a' },
            { label: '乙', value: 'b', disabled: true },
          ]}
          size="small"
          block
          name="mode"
          ariaLabel="模式"
          direction="vertical"
          onValueChange={change}
        />,
      );
      expect(screen.getByRole('radiogroup')).toHaveClass('el-segmented--small', 'is-block');
      expect(document.querySelector('.el-segmented__group')).toHaveClass('el-segmented--vertical');
      expect(screen.getAllByRole('radio')[0]).toBeChecked();
      expect(screen.getAllByRole('radio')[1]).toBeDisabled();
      expect(screen.getAllByRole('radio')[0]).toHaveAttribute('name', 'mode');
      fireEvent.click(screen.getAllByRole('radio')[1]);
      expect(change).not.toHaveBeenCalled();
    },
  );
  apiTest('segmented', 'Events', ['change'], 'segmented-basic', '分段选择通知', () => {
    const change = vi.fn();
    render(<Segmented options={['a', 'b']} onChange={change} />);
    fireEvent.click(screen.getAllByRole('radio')[1]);
    expect(change).toHaveBeenCalledWith('b');
  });
  apiTest('segmented', 'Slots', ['default'], 'segmented-basic', '分段项渲染', () => {
    render(<Segmented options={['a']} renderDefault={(item) => <b>{String(item)}项</b>} />);
    expect(screen.getByText('a项').tagName).toBe('B');
  });
  featureTest('segmented', 'empty-options', 'segmented-basic', '空选项不渲染', () => {
    const { container } = render(<Segmented options={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  featureTest('config-provider', 'locale-isolation', 'config-basic', 'Provider文案隔离', () => {
    render(
      <>
        <ConfigProvider locale="zh-cn">
          <Input defaultValue="中文" clearable />
        </ConfigProvider>
        <ConfigProvider locale="en">
          <Input defaultValue="English" clearable />
        </ConfigProvider>
      </>,
    );
    expect(screen.getByRole('button', { name: '清空' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });
});
