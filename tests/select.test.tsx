import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, vi } from 'vitest';
import { Select, Option, OptionGroup, ConfigProvider, Form, FormItem } from '../packages/element-react';
import type { SelectHandle, SelectOption } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
afterEach(() => vi.useRealTimers());
/** 等待浮动定位完成后再断言可交互的选项。 */
async function openSelect(): Promise<void> {
  fireEvent.click(screen.getByRole('combobox'));
  await waitFor(() => expect(document.querySelector('.el-select__popper')).toBeVisible());
}
const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta', disabled: true },
  { value: 'c', label: 'Charlie' },
];

apiTest(
  'select',
  'Select Attributes',
  ['model-value', 'options', 'placeholder'],
  'select-basic',
  '受控选择发出请求并等待父组件更新',
  async () => {
    const change = vi.fn();
    const view = render(
      <Select<string> value="a" onValueChange={change} options={options} placeholder="选择" />,
    );
    await openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Charlie' }));
    expect(change).toHaveBeenCalledWith('c');
    expect(view.container.querySelector('.el-select__placeholder')).toHaveTextContent('Alpha');
    view.rerender(<Select<string> value="c" onValueChange={change} options={options} />);
    expect(view.container.querySelector('.el-select__placeholder')).toHaveTextContent('Charlie');
  },
);
apiTest(
  'select',
  'Select Events',
  ['change', 'visible-change'],
  'select-basic',
  '选择和弹层可见性事件各自分发',
  async () => {
    const change = vi.fn(),
      visible = vi.fn();
    render(<Select options={options} onChange={change} onVisibleChange={visible} />);
    await openSelect();
    expect(visible).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
    expect(change).toHaveBeenCalledWith('a');
    expect(visible).toHaveBeenLastCalledWith(false);
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['disabled', 'size', 'id', 'name', 'autocomplete', 'aria-label', 'tabindex'],
  'select-basic',
  '原生字段与禁用尺寸同步',
  async () => {
    const view = render(
      <Select
        disabled
        size="large"
        id="city"
        name="city-name"
        autoComplete="on"
        ariaLabel="城市"
        tabIndex={3}
        options={options}
      />,
    );
    const input = screen.getByRole('combobox', { name: '城市' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('id', 'city');
    expect(input).toHaveAttribute('name', 'city-name');
    expect(input).toHaveAttribute('autocomplete', 'on');
    expect(input).toHaveAttribute('tabindex', '3');
    fireEvent.click(input);
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(view.container.firstChild).toHaveClass('el-select--large');
  },
);
apiTest(
  'select',
  'Option Attributes',
  ['value', 'label', 'disabled'],
  'select-basic',
  '声明式选项禁用并显示定制内容',
  async () => {
    const change = vi.fn();
    render(
      <Select onChange={change}>
        <Option value={0} label="Zero">
          自定义零
        </Option>
        <Option value={false} label="False" disabled />
      </Select>,
    );
    await openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'False' }));
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('option', { name: '自定义零' }));
    expect(change).toHaveBeenCalledWith(0);
    expect(screen.queryByRole('listbox')).toBeNull();
  },
);
apiTest('select', 'Option Slots', ['default'], 'select-basic', '选项内容保留React节点', async () => {
  render(
    <Select>
      <Option value="a">
        <strong>自定义</strong>
      </Option>
    </Select>,
  );
  await openSelect();
  expect(screen.getByText('自定义').tagName).toBe('STRONG');
});
apiTest(
  'select',
  'Option Group Attributes',
  ['label', 'disabled'],
  'select-basic',
  '组级禁用向下传播',
  async () => {
    const change = vi.fn();
    render(
      <Select onChange={change}>
        <OptionGroup label="禁用组" disabled>
          <Option value="a" label="Alpha" />
        </OptionGroup>
      </Select>,
    );
    await openSelect();
    expect(screen.getByText('禁用组')).toBeInTheDocument();
    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(screen.getByRole('option'));
    expect(change).not.toHaveBeenCalled();
  },
);
apiTest(
  'select',
  'Select Slots',
  ['default', 'header', 'footer', 'prefix', 'label'],
  'select-basic',
  '容器区域与已选标签渲染',
  async () => {
    render(
      <Select
        defaultValue="a"
        renderHeader={<b>顶部</b>}
        renderFooter={<b>底部</b>}
        renderPrefix="前缀"
        renderLabel={({ label }) => <em>{label}!</em>}
      >
        <Option value="a" label="Alpha" />
      </Select>,
    );
    expect(screen.getByText('Alpha!').tagName).toBe('EM');
    expect(screen.getByText('前缀')).toBeInTheDocument();
    await openSelect();
    expect(screen.getByText('顶部')).toBeVisible();
    expect(screen.getByText('底部')).toBeVisible();
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['multiple', 'multiple-limit', 'collapse-tags', 'max-collapse-tags', 'tag-type', 'tag-effect'],
  'select-multiple',
  '多选限制及标签折叠',
  async () => {
    const view = render(
      <Select
        multiple
        multipleLimit={2}
        collapseTags
        maxCollapseTags={1}
        tagType="success"
        tagEffect="dark"
        options={options}
      />,
    );
    await openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
    fireEvent.click(screen.getByRole('option', { name: 'Charlie' }));
    expect(view.container.querySelectorAll('.el-select__selected-item .el-tag')).toHaveLength(1);
    expect(screen.getByText('+ 1')).toBeInTheDocument();
    expect(view.container.querySelector('.el-tag')).toHaveClass('el-tag--success', 'el-tag--dark');
  },
);
apiTest(
  'select',
  'Select Events',
  ['remove-tag', 'clear'],
  'select-multiple',
  '移除标签与清空事件不混用',
  async () => {
    const remove = vi.fn(),
      clear = vi.fn(),
      change = vi.fn();
    render(
      <Select
        multiple
        defaultValue={['a', 'c']}
        options={options}
        clearable
        onRemoveTag={remove}
        onClear={clear}
        onChange={change}
      />,
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[0]);
    expect(remove).toHaveBeenCalledWith('a');
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(clear).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
    expect(change).toHaveBeenLastCalledWith([]);
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['clearable', 'clear-icon', 'empty-values', 'value-on-clear'],
  'select-basic',
  '清空值函数与空值集合',
  async () => {
    const change = vi.fn();
    const view = render(
      <Select
        defaultValue="a"
        options={options}
        clearable
        clearIcon={<span>清除图标</span>}
        emptyValues={[null]}
        valueOnClear={() => null}
        onChange={change}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(change).toHaveBeenCalledWith(null);
    expect(view.container.querySelector('.el-select__placeholder')).toHaveTextContent('Select');
    expect(screen.queryByText('清除图标')).toBeNull();
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['filterable', 'allow-create', 'default-first-option', 'reserve-keyword'],
  'select-multiple',
  '过滤自建、键盘确认及查询清理',
  async () => {
    const change = vi.fn();
    render(
      <Select
        multiple
        filterable
        allowCreate
        defaultFirstOption
        reserveKeyword={false}
        options={options}
        onChange={change}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'New' } });
    expect(await screen.findByRole('option', { name: 'New' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(change).toHaveBeenCalledWith(['New']);
    expect(input).toHaveValue('');
  },
);
featureTest('select', 'keyboard-loop', 'select-basic', '方向键跳过禁用项并从末尾循环', async () => {
  const change = vi.fn();
  render(<Select options={options} onChange={change} />);
  const input = screen.getByRole('combobox');
  fireEvent.keyDown(input, { key: 'ArrowUp' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(change).toHaveBeenLastCalledWith('c');
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(change).toHaveBeenLastCalledWith('c');
});
apiTest(
  'select',
  'Select Attributes',
  ['remote', 'remote-method', 'debounce'],
  'select-basic',
  '远程查询防抖且旧响应不能覆盖新结果',
  async () => {
    vi.useFakeTimers();
    let resolveOld!: (options: SelectOption<string>[]) => void,
      resolveNew!: (options: SelectOption<string>[]) => void;
    const method = vi.fn(
      (query: string) =>
        new Promise<SelectOption<string>[]>((resolve) => {
          if (query === 'old') resolveOld = resolve;
          else resolveNew = resolve;
        }),
    );
    render(<Select<string> remote filterable remoteMethod={method} debounce={20} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'old' } });
    act(() => vi.advanceTimersByTime(20));
    fireEvent.change(input, { target: { value: 'new' } });
    act(() => vi.advanceTimersByTime(20));
    await act(async () => {
      resolveNew([{ value: 'new', label: '最新' }]);
    });
    await act(async () => {
      resolveOld([{ value: 'old', label: '旧数据' }]);
    });
    expect(screen.getByRole('option', { name: '最新' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '旧数据' })).toBeNull();
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['value-key'],
  'select-basic',
  '对象键回显独立于对象身份',
  async () => {
    render(<Select value={{ id: 1 }} valueKey="id" options={[{ value: { id: 1 }, label: '对象一' }]} />);
    expect(screen.getAllByText('对象一')).toHaveLength(2);
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['[props](#props)'],
  'select-basic',
  '选项字段映射包含嵌套分组',
  async () => {
    render(
      <Select
        props={{ label: 'title', value: 'key', options: 'items', disabled: 'blocked' }}
        options={[{ title: '分组', items: [{ key: 'a', title: '映射项', blocked: true }] }]}
      />,
    );
    await openSelect();
    expect(screen.getByText('分组')).toBeVisible();
    expect(screen.getByRole('option', { name: '映射项' })).toHaveAttribute('aria-disabled', 'true');
  },
);
apiTest(
  'select',
  'Select Attributes',
  ['loading', 'loading-text', 'no-data-text', 'no-match-text'],
  'select-basic',
  '加载、空数据与无匹配提示',
  async () => {
    const view = render(<Select loading loadingText="加载提示" />);
    await openSelect();
    expect(screen.getByText('加载提示')).toBeVisible();
    view.rerender(<Select noDataText="空提示" />);
    expect(screen.getByText('空提示')).toBeVisible();
    view.rerender(<Select filterable noMatchText="无匹配" options={options} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('无匹配')).toBeVisible();
  },
);
apiTest('select', 'Select Slots', ['empty', 'loading'], 'select-basic', '加载和空内容插槽', async () => {
  const view = render(<Select renderEmpty={<b>空区域</b>} />);
  await openSelect();
  expect(screen.getByText('空区域')).toBeVisible();
  view.rerender(<Select loading renderLoading={<b>加载区域</b>} />);
  expect(screen.getByText('加载区域')).toBeVisible();
});
apiTest(
  'select',
  'Select Attributes',
  ['teleported', 'append-to', 'persistent', 'popper-class', 'popper-style', 'effect', 'show-arrow'],
  'select-basic',
  '弹层挂载持久性和样式',
  async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const view = render(
      <Select
        appendTo={target}
        persistent={false}
        popperClass="custom-select"
        popperStyle={{ color: 'red' }}
        effect="dark"
        showArrow={false}
        options={options}
      />,
    );
    expect(target).toBeEmptyDOMElement();
    await openSelect();
    expect(target.querySelector('.custom-select')).toHaveClass('is-dark');
    expect(target.querySelector('.custom-select')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(target.querySelector('[data-popper-arrow]')).toBeNull();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(target).toBeEmptyDOMElement();
    view.rerender(<Select teleported={false} options={options} />);
    await openSelect();
    expect(view.container.querySelector('[role="listbox"]')).toBeInTheDocument();
    view.unmount();
    target.remove();
  },
);
apiTest(
  'select',
  'Select Exposes',
  ['focus', 'blur', 'selectedLabel'],
  'select-basic',
  '暴露聚焦、失焦和当前显示标签',
  async () => {
    const ref = createRef<SelectHandle>();
    render(<Select ref={ref} defaultValue="a" options={options} />);
    act(() => ref.current?.focus());
    expect(screen.getByRole('combobox')).toHaveFocus();
    expect(ref.current?.selectedLabel).toBe('Alpha');
    act(() => ref.current?.blur());
    expect(screen.getByRole('combobox')).not.toHaveFocus();
  },
);
apiTest('select', 'Select Events', ['focus', 'blur'], 'select-basic', '原生聚焦失焦事件', async () => {
  const focus = vi.fn(),
    blur = vi.fn();
  render(<Select onFocus={focus} onBlur={blur} />);
  fireEvent.focus(screen.getByRole('combobox'));
  fireEvent.blur(screen.getByRole('combobox'));
  expect(focus).toHaveBeenCalledOnce();
  expect(blur).toHaveBeenCalledOnce();
});
apiTest('select', 'Select Attributes', ['automatic-dropdown'], 'select-basic', '聚焦自动打开', async () => {
  render(<Select automaticDropdown options={options} />);
  fireEvent.focus(screen.getByRole('combobox'));
  expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
});
apiTest(
  'select',
  'Select Attributes',
  ['validate-event'],
  'select-basic',
  '表单变更触发器可关闭',
  async () => {
    /** 表单持有字段值以验证组件校验请求。 */
    function Example() {
      const [model, setModel] = useState<Record<string, unknown>>({ city: '' });
      return (
        <Form
          model={model}
          onModelChange={setModel}
          rules={{
            city: [{ asyncValidator: () => Promise.reject(new Error('校验错误')), trigger: 'change' }],
          }}
        >
          <FormItem prop="city">
            {({ value, setValue }) => (
              <Select<string>
                value={value as string}
                onValueChange={setValue}
                options={options}
                validateEvent={false}
              />
            )}
          </FormItem>
        </Form>
      );
    }
    render(
      <ConfigProvider>
        <Example />
      </ConfigProvider>,
    );
    await openSelect();
    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
    await waitFor(() => expect(screen.queryByText('校验错误')).toBeNull());
  },
);
