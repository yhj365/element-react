import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, vi } from 'vitest';
import { Autocomplete } from '../packages/element-react';
import type { AutocompleteHandle, AutocompleteSuggestion } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

const items = [
  { value: 'React', url: 'react.dev' },
  { value: 'Vite', url: 'vite.dev' },
];
afterEach(() => vi.useRealTimers());

/** 聚焦输入并等待建议完成异步定位。 */
async function open(): Promise<HTMLInputElement> {
  const input = screen.getByRole<HTMLInputElement>('combobox');
  fireEvent.focus(input);
  await screen.findByRole('option', { name: /React/ });
  return input;
}

apiTest(
  'autocomplete',
  'Attributes',
  ['model-value', 'fetch-suggestions', 'placeholder', 'clearable', 'disabled'],
  'autocomplete-autocomplete',
  '受控回填等待父级更新，清空与禁用继承Input行为',
  async () => {
    const update = vi.fn(),
      select = vi.fn(),
      clear = vi.fn();
    const view = render(
      <Autocomplete
        value="R"
        placeholder="Search"
        fetchSuggestions={items}
        debounce={0}
        clearable
        onValueChange={update}
        onSelect={select}
        onClear={clear}
      />,
    );
    const input = await open();
    expect(input).toHaveAttribute('placeholder', 'Search');
    fireEvent.click(screen.getByRole('option', { name: 'React' }));
    expect(update).toHaveBeenCalledWith('React');
    expect(select).toHaveBeenCalledWith(items[0]);
    expect(input).toHaveValue('R');
    fireEvent.mouseEnter(view.container.querySelector('.el-input')!);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(clear).toHaveBeenCalledOnce();
    view.rerender(<Autocomplete disabled fetchSuggestions={items} debounce={0} />);
    expect(input).toBeDisabled();
    expect(screen.queryByRole('option')).toBeNull();
  },
);
apiTest(
  'autocomplete',
  'Attributes',
  ['value-key', 'trigger-on-focus', 'select-when-unmatched', 'highlight-first-item', 'loop-navigation'],
  'autocomplete-autocomplete',
  '自定义值字段与输入触发，边界键盘选择及自由文本提交',
  async () => {
    const select = vi.fn();
    render(
      <Autocomplete
        valueKey="label"
        fetchSuggestions={[{ label: 'React' }, { label: 'Vite' }]}
        triggerOnFocus={false}
        selectWhenUnmatched
        highlightFirstItem
        loopNavigation={false}
        debounce={0}
        onSelect={select}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.queryByRole('option')).toBeNull();
    fireEvent.change(input, { target: { value: 'R' } });
    await screen.findByRole('option', { name: 'React' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Vite' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(select).toHaveBeenLastCalledWith({ label: 'Vite' });
    fireEvent.change(input, { target: { value: 'Other' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(select).toHaveBeenLastCalledWith({ label: 'Other' });
  },
);
apiTest(
  'autocomplete',
  'Attributes',
  ['debounce'],
  'autocomplete-remote-search',
  '查询防抖合并快速输入',
  async () => {
    vi.useFakeTimers();
    const fetch = vi.fn((_query: string, callback: (data: AutocompleteSuggestion[]) => void) =>
      callback(items),
    );
    render(<Autocomplete fetchSuggestions={fetch} debounce={300} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'R' } });
    await act(async () => vi.advanceTimersByTime(200));
    fireEvent.change(input, { target: { value: 'Re' } });
    await act(async () => vi.advanceTimersByTime(299));
    expect(fetch).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('Re');
  },
);
featureTest(
  'autocomplete',
  'request-race',
  'autocomplete-remote-search',
  '旧回调及卸载后响应不能覆盖最新建议',
  async () => {
    const pending = new Map<string, (data: AutocompleteSuggestion[]) => void>();
    const view = render(
      <Autocomplete
        debounce={0}
        fetchSuggestions={(query, callback) => {
          pending.set(query, callback);
        }}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'old' } });
    await waitFor(() => expect(pending.has('old')).toBe(true));
    fireEvent.change(input, { target: { value: 'new' } });
    await waitFor(() => expect(pending.has('new')).toBe(true));
    act(() => pending.get('new')!([{ value: 'Latest' }]));
    act(() => pending.get('old')!([{ value: 'Stale' }]));
    expect(await screen.findByRole('option', { name: 'Latest' })).toBeInTheDocument();
    expect(screen.queryByText('Stale')).toBeNull();
    view.unmount();
    act(() => pending.get('new')!([{ value: 'After unmount' }]));
    expect(screen.queryByText('After unmount')).toBeNull();
  },
);
apiTest(
  'autocomplete',
  'Slots',
  ['default', 'prefix', 'suffix', 'prepend', 'append'],
  'autocomplete-autocomplete-template',
  '自定义建议及Input具名内容',
  async () => {
    render(
      <Autocomplete
        fetchSuggestions={items}
        debounce={0}
        renderSuggestion={(item) => <b>{String(item.value)} address</b>}
        renderPrefix="Prefix"
        renderSuffix="Suffix"
        renderPrepend="Before"
        renderAppend="After"
      />,
    );
    await open();
    expect(screen.getByRole('option', { name: 'React address' }).querySelector('b')).toBeInTheDocument();
    for (const label of ['Prefix', 'Suffix', 'Before', 'After'])
      expect(screen.getByText(label)).toBeInTheDocument();
  },
);
apiTest(
  'autocomplete',
  'Slots',
  ['header', 'footer'],
  'autocomplete-custom-header-footer',
  '建议浮层顶部与底部插槽',
  async () => {
    render(
      <Autocomplete fetchSuggestions={items} debounce={0} renderHeader="Header" renderFooter="Footer" />,
    );
    await open();
    expect(screen.getByText('Header')).toBeVisible();
    expect(screen.getByText('Footer')).toBeVisible();
  },
);
apiTest(
  'autocomplete',
  'Slots',
  ['loading'],
  'autocomplete-custom-loading',
  '远程加载内容可替换',
  async () => {
    render(<Autocomplete debounce={0} fetchSuggestions={() => {}} renderLoading="Finding suggestions" />);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(await screen.findByText('Finding suggestions')).toBeInTheDocument();
  },
);
apiTest(
  'autocomplete',
  'Attributes',
  [
    'hide-loading',
    'placement',
    'popper-class',
    'popper-style',
    'show-arrow',
    'teleported',
    'append-to',
    'fit-input-width',
    'name',
  ],
  'autocomplete-custom-loading',
  '浮层外观挂载目标和加载隐藏',
  async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const view = render(
      <Autocomplete
        fetchSuggestions={items}
        debounce={0}
        appendTo={target}
        placement="top-start"
        popperClass="custom-popper"
        popperStyle={{ color: 'red' }}
        showArrow={false}
        fitInputWidth
        name="technology"
      />,
    );
    await open();
    expect(screen.getByRole('combobox')).toHaveAttribute('name', 'technology');
    expect(target.querySelector('.custom-popper')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(target.querySelector('.el-popper__arrow')).toBeNull();
    view.rerender(<Autocomplete fetchSuggestions={() => {}} debounce={0} teleported={false} hideLoading />);
    fireEvent.blur(screen.getByRole('combobox'));
    fireEvent.focus(screen.getByRole('combobox'));
    await waitFor(() => expect(view.container.querySelector('[aria-busy="true"]')).toBeInTheDocument());
    expect(screen.queryByText('Loading')).toBeNull();
    view.unmount();
    target.remove();
  },
);
apiTest(
  'autocomplete',
  'Events',
  ['focus', 'blur', 'input', 'change', 'clear', 'select'],
  'autocomplete-autocomplete',
  '输入提交和选择通知彼此独立',
  async () => {
    const focus = vi.fn(),
      blur = vi.fn(),
      inputEvent = vi.fn(),
      change = vi.fn(),
      select = vi.fn();
    render(
      <Autocomplete
        fetchSuggestions={items}
        debounce={0}
        onFocus={focus}
        onBlur={blur}
        onInput={inputEvent}
        onChange={change}
        onSelect={select}
      />,
    );
    const input = await open();
    fireEvent.change(input, { target: { value: 'typed' } });
    expect(inputEvent).toHaveBeenCalledWith('typed');
    fireEvent.blur(input);
    expect(focus).toHaveBeenCalledTimes(1);
    expect(blur).toHaveBeenCalledTimes(1);
    expect(select).not.toHaveBeenCalled();
    expect(change).toHaveBeenCalledWith('typed');
  },
);
apiTest(
  'autocomplete',
  'Exposes',
  [
    'activated',
    'blur',
    'close',
    'focus',
    'handleSelect',
    'handleKeyEnter',
    'highlightedIndex',
    'highlight',
    'inputRef',
    'loading',
    'popperRef',
    'suggestions',
    'getData',
  ],
  'autocomplete-autocomplete',
  '公开实例读取实时状态并操作选择与关闭',
  async () => {
    const ref = createRef<AutocompleteHandle>();
    render(<Autocomplete ref={ref} fetchSuggestions={items} debounce={0} />);
    act(() => ref.current?.focus());
    await screen.findByRole('option', { name: 'React' });
    expect(ref.current?.activated).toBe(true);
    expect(ref.current?.loading).toBe(false);
    expect(ref.current?.suggestions).toEqual(items);
    expect(ref.current?.inputRef?.input).toBe(screen.getByRole('combobox'));
    expect(ref.current?.popperRef).toBeInTheDocument();
    act(() => ref.current?.highlight(1));
    expect(ref.current?.highlightedIndex).toBe(1);
    act(() => ref.current?.handleKeyEnter());
    expect(screen.getByRole('combobox')).toHaveValue('Vite');
    act(() => ref.current?.handleSelect(items[0]));
    expect(screen.getByRole('combobox')).toHaveValue('React');
    act(() => ref.current?.getData('R'));
    expect(ref.current?.suggestions).toEqual(items);
    act(() => ref.current?.close());
    expect(ref.current?.activated).toBe(false);
    act(() => ref.current?.blur());
    expect(screen.getByRole('combobox')).not.toHaveFocus();
  },
);
