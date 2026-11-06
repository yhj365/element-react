import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { TimeSelect } from '../packages/element-react';
import type { TimeSelectHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

/** 等待复用的Select浮层定位完成。 */
async function open(): Promise<void> {
  fireEvent.click(screen.getByRole('combobox'));
  await waitFor(() => expect(document.querySelector('.el-select__popper')).toBeVisible());
}
apiTest(
  'time-select',
  'Attributes',
  ['model-value', 'start', 'end', 'step'],
  'time-select-basic',
  '受控值回显与固定时间间隔',
  async () => {
    const change = vi.fn(),
      view = render(
        <TimeSelect value="09:00" onValueChange={change} start="09:00" end="10:00" step="00:20" />,
      );
    await open();
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '09:00',
      '09:20',
      '09:40',
      '10:00',
    ]);
    fireEvent.click(screen.getByRole('option', { name: '09:40' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('09:40');
    expect(view.container.querySelector('.el-select__placeholder')).toHaveTextContent('09:00');
  },
);
apiTest(
  'time-select',
  'Attributes',
  ['include-end-time'],
  'time-select-basic',
  '不整除步长时可追加结束时间且不重复',
  async () => {
    const view = render(<TimeSelect start="09:00" end="10:00" step="00:40" includeEndTime />);
    await open();
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '09:00',
      '09:40',
      '10:00',
    ]);
    view.rerender(<TimeSelect start="09:00" end="10:00" step="00:30" includeEndTime />);
    expect(screen.getAllByRole('option', { name: '10:00' })).toHaveLength(1);
  },
);
apiTest(
  'time-select',
  'Attributes',
  ['min-time', 'max-time'],
  'time-select-basic',
  '边界时间本身也不可选',
  async () => {
    const change = vi.fn();
    render(
      <TimeSelect start="09:00" end="10:00" step="00:30" minTime="09:00" maxTime="10:00" onChange={change} />,
    );
    await open();
    expect(screen.getByRole('option', { name: '09:00' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: '10:00' })).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(screen.getByRole('option', { name: '09:00' }));
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('option', { name: '09:30' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('09:30');
  },
);
apiTest(
  'time-select',
  'Attributes',
  ['format'],
  'time-select-basic',
  '12小时输入和输出格式保留来源语义',
  async () => {
    render(<TimeSelect start="12:00 AM" end="01:00 AM" step="00:30" format="hh:mm A" />);
    await open();
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '12:00 AM',
      '12:30 AM',
      '01:00 AM',
    ]);
  },
);
apiTest(
  'time-select',
  'Attributes',
  ['disabled', 'editable', 'size', 'placeholder', 'name'],
  'time-select-basic',
  '输入编辑开关、禁用与原生名称',
  () => {
    const view = render(<TimeSelect disabled editable={false} size="large" placeholder="选择" name="time" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveAttribute('readonly');
    expect(screen.getByRole('combobox')).toHaveAttribute('name', 'time');
    expect(view.container.firstChild).toHaveClass('el-select--large');
    expect(screen.getByText('选择')).toBeInTheDocument();
  },
);
apiTest(
  'time-select',
  'Attributes',
  ['clearable', 'clear-icon', 'empty-values', 'value-on-clear'],
  'time-select-basic',
  '清空回调保留自定义空值',
  () => {
    const change = vi.fn();
    render(
      <TimeSelect
        defaultValue="09:00"
        clearable
        clearIcon={<b>自定义清空</b>}
        emptyValues={[null]}
        valueOnClear={() => null}
        onChange={change}
      />,
    );
    expect(screen.getByText('自定义清空')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(null);
    expect(screen.queryByRole('button', { name: 'Clear selection' })).toBeNull();
  },
);
apiTest(
  'time-select',
  'Attributes',
  ['effect', 'prefix-icon', 'popper-class', 'popper-style'],
  'time-select-basic',
  '图标和弹层外观传递给Select',
  async () => {
    render(
      <TimeSelect
        prefixIcon={<b>时间图标</b>}
        effect="dark"
        popperClass="time-popper"
        popperStyle={{ color: 'red' }}
      />,
    );
    expect(screen.getByText('时间图标')).toBeInTheDocument();
    await open();
    expect(document.querySelector('.time-popper')).toHaveClass('is-dark');
    expect(document.querySelector('.time-popper')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  },
);
apiTest(
  'time-select',
  'Events',
  ['change', 'focus', 'blur', 'clear'],
  'time-select-basic',
  '值提交、焦点和清空事件沿用单选语义',
  async () => {
    const change = vi.fn(),
      focus = vi.fn(),
      blur = vi.fn(),
      clear = vi.fn();
    render(<TimeSelect onChange={change} onFocus={focus} onBlur={blur} onClear={clear} />);
    const input = screen.getByRole('combobox');
    act(() => input.focus());
    expect(focus).toHaveBeenCalledOnce();
    await open();
    fireEvent.click(screen.getByRole('option', { name: '09:00' }));
    expect(change).toHaveBeenCalledExactlyOnceWith('09:00');
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(clear).toHaveBeenCalledOnce();
    act(() => input.blur());
    expect(blur).toHaveBeenCalledOnce();
  },
);
apiTest('time-select', 'Exposes', ['focus', 'blur'], 'time-select-basic', '公开引用委托输入焦点', () => {
  const ref = createRef<TimeSelectHandle>();
  render(<TimeSelect ref={ref} />);
  act(() => ref.current?.focus());
  expect(screen.getByRole('combobox')).toHaveFocus();
  act(() => ref.current?.blur());
  expect(screen.getByRole('combobox')).not.toHaveFocus();
});
featureTest(
  'time-select',
  'invalid-config',
  'time-select-basic',
  '非法起止和零步长回退默认值，不产生死循环',
  async () => {
    render(<TimeSelect start="invalid" end="invalid" step="00:00" />);
    await open();
    expect(screen.getAllByRole('option')).toHaveLength(19);
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('09:00');
    expect(screen.getAllByRole('option')[18]).toHaveTextContent('18:00');
  },
);
featureTest(
  'time-select',
  'reverse-range',
  'time-select-basic',
  '倒置区间默认无选项，includeEndTime可保留末尾',
  async () => {
    const view = render(<TimeSelect start="10:00" end="09:00" />);
    await open();
    expect(screen.queryByRole('option')).toBeNull();
    view.rerender(<TimeSelect start="10:00" end="09:00" includeEndTime />);
    expect(screen.getByRole('option', { name: '09:00' })).toBeInTheDocument();
  },
);
