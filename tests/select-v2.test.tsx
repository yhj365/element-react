import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, vi } from 'vitest';
import { ConfigProvider, SelectV2 } from '../packages/element-react';
import type { SelectHandle, SelectOption } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
import { FieldValidationContext } from '../packages/hooks';

const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
/** 展开并等待虚拟选项完成浮层定位。 */
async function open(): Promise<HTMLElement> {
  const input = screen.getByRole('combobox');
  fireEvent.click(input);
  await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
  return input;
}

apiTest(
  'select-v2',
  'Attributes',
  ['model-value', 'options', 'height', 'item-height', 'scrollbar-always-on', 'fit-input-width'],
  'select-v2-basic-usage',
  '万选项仅渲染窗口且受控值等待父级回写',
  async () => {
    const change = vi.fn();
    render(
      <SelectV2
        options={options}
        value={0}
        onValueChange={change}
        height={200}
        itemHeight={20}
        scrollbarAlwaysOn
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    await screen.findByRole('option', { name: 'Option 0' });
    expect(screen.getAllByRole('option').length).toBeLessThanOrEqual(14);
    const viewport = document.querySelector('.el-select-v2__virtual-list')!;
    expect(viewport).toHaveStyle({ height: '200px', overflowY: 'scroll' });
    fireEvent.scroll(viewport, { target: { scrollTop: 10000 } });
    fireEvent.click(await screen.findByRole('option', { name: 'Option 500' }));
    expect(change).toHaveBeenCalledWith(500);
    expect(document.querySelector('.el-select__placeholder')).toHaveTextContent('Option 0');
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['multiple', 'multiple-limit', 'collapse-tags', 'collapse-tags-tooltip', 'max-collapse-tags'],
  'select-v2-hide-extra-tags',
  '多选数量限制与标签折叠沿用Select行为',
  async () => {
    const ref = createRef<SelectHandle>();
    render(
      <SelectV2
        ref={ref}
        options={options.slice(0, 10)}
        multiple
        multipleLimit={3}
        defaultValue={[0, 1]}
        collapseTags
        collapseTagsTooltip
        maxCollapseTags={1}
      />,
    );
    await open();
    fireEvent.click(screen.getByRole('option', { name: 'Option 2' }));
    fireEvent.click(screen.getByRole('option', { name: 'Option 3' }));
    expect(ref.current?.selectedLabel).toEqual(['Option 0', 'Option 1', 'Option 2']);
    expect(screen.getByText('+ 2')).toBeInTheDocument();
  },
);
featureTest(
  'select-v2',
  'multi-toggle',
  'select-v2-multiple',
  '虚拟列表已选项再次点击可以取消选择',
  async () => {
    const change = vi.fn();
    render(<SelectV2 options={options.slice(0, 5)} multiple defaultValue={[1]} onChange={change} />);
    await open();
    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(change).toHaveBeenCalledWith([]);
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['size', 'id', 'name', 'autocomplete', 'placeholder', 'effect', 'aria-label', 'tabindex'],
  'select-v2-size',
  '尺寸原生输入属性和主题传递到选择器',
  async () => {
    render(
      <SelectV2
        options={options.slice(0, 3)}
        size="large"
        id="virtual-input"
        name="language"
        autoComplete="on"
        placeholder="Choose"
        effect="dark"
        ariaLabel="Virtual choices"
        tabIndex={2}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Virtual choices' });
    expect(input).toHaveAttribute('id', 'virtual-input');
    expect(input).toHaveAttribute('name', 'language');
    expect(input).toHaveAttribute('autocomplete', 'on');
    expect(input).toHaveAttribute('tabindex', '2');
    expect(document.querySelector('.el-select')).toHaveClass('el-select--large');
    expect(screen.getByText('Choose')).toBeInTheDocument();
    await open();
    expect(document.querySelector('.el-select__popper')).toHaveClass('is-dark');
  },
);
apiTest('select-v2', 'Attributes', ['disabled'], 'select-v2-disabled', '禁用选择器不展开选项', () => {
  render(<SelectV2 options={options} disabled />);
  expect(screen.getByRole('combobox')).toBeDisabled();
  fireEvent.click(screen.getByRole('combobox'));
  expect(screen.queryByRole('option')).toBeNull();
});
apiTest(
  'select-v2',
  'Attributes',
  ['clearable', 'clear-icon', 'empty-values', 'value-on-clear'],
  'select-v2-empty-values',
  '空字符串可作为有效值，自定义清空值和图标',
  () => {
    const change = vi.fn();
    const view = render(
      <SelectV2
        options={[{ value: '', label: 'Empty' }]}
        defaultValue=""
        clearable
        clearIcon={<b>Clear icon</b>}
        emptyValues={[null, undefined]}
        valueOnClear={null}
        onChange={change}
      />,
    );
    expect(document.querySelector('.el-select__placeholder')).toHaveTextContent('Empty');
    fireEvent.mouseEnter(view.container.querySelector('.el-select__wrapper')!);
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(change).toHaveBeenCalledWith(null);
  },
);
featureTest('select-v2', 'clear-number', 'select-v2-clearable', '数字0可正确回显并清空', () => {
  const change = vi.fn();
  const view = render(
    <SelectV2 options={options.slice(0, 3)} defaultValue={0} clearable onChange={change} />,
  );
  expect(document.querySelector('.el-select__placeholder')).toHaveTextContent('Option 0');
  fireEvent.mouseEnter(view.container.querySelector('.el-select__wrapper')!);
  fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(change).toHaveBeenCalledWith(undefined);
});
apiTest(
  'select-v2',
  'Attributes',
  ['filterable', 'filter-method', 'no-match-text', 'no-data-text'],
  'select-v2-filterable',
  '过滤后重置窗口并显示无匹配提示',
  async () => {
    const view = render(
      <SelectV2 options={options} filterable noMatchText="Nothing matched" noDataText="No entries" />,
    );
    const input = await open();
    fireEvent.change(input, { target: { value: 'Option 9999' } });
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));
    expect(screen.getByRole('option', { name: 'Option 9999' })).toBeVisible();
    fireEvent.change(input, { target: { value: 'missing' } });
    expect(await screen.findByText('Nothing matched')).toBeInTheDocument();
    const filter = vi.fn();
    view.rerender(<SelectV2 options={[]} filterable filterMethod={filter} noDataText="No entries" />);
    fireEvent.change(input, { target: { value: '' } });
    expect(await screen.findByText('No entries')).toBeInTheDocument();
    await waitFor(() => expect(filter).toHaveBeenCalledWith(''));
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['allow-create', 'default-first-option', 'reserve-keyword'],
  'select-v2-allow-create',
  '创建未匹配选项后清理查询文本',
  async () => {
    const change = vi.fn();
    render(
      <SelectV2
        options={[]}
        multiple
        filterable
        allowCreate
        defaultFirstOption
        reserveKeyword={false}
        onChange={change}
      />,
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Created' } });
    await screen.findByRole('option', { name: 'Created' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(change).toHaveBeenCalledWith(['Created']);
    expect(input).toHaveValue('');
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['value-key'],
  'select-v2-use-valueKey',
  '对象值使用valueKey保持跨实例回显',
  () => {
    const ref = createRef<SelectHandle>();
    render(
      <SelectV2
        ref={ref}
        value={{ id: 1 }}
        valueKey="id"
        options={[{ value: { id: 1 }, label: 'Object label' }]}
      />,
    );
    expect(ref.current?.selectedLabel).toBe('Object label');
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['[props](#props)'],
  'select-v2-props',
  '字段别名用于虚拟选项显示',
  async () => {
    render(
      <SelectV2
        options={[{ key: 0, title: 'Mapped', blocked: true }]}
        props={{ value: 'key', label: 'title', disabled: 'blocked' }}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'Mapped' })).toHaveAttribute('aria-disabled', 'true');
  },
);
apiTest(
  'select-v2',
  'props',
  ['value', 'label', 'options', 'disabled'],
  'select-v2-grouping',
  '分组标题和禁用组选项保留在虚拟行模型中',
  async () => {
    render(
      <SelectV2
        options={[
          {
            title: 'Group',
            entries: [
              { key: 1, title: 'One' },
              { key: 2, title: 'Two', blocked: true },
            ],
          },
        ]}
        props={{ value: 'key', label: 'title', options: 'entries', disabled: 'blocked' }}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    await screen.findByRole('option', { name: 'One' });
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Two' })).toHaveAttribute('aria-disabled', 'true');
  },
);
apiTest(
  'select-v2',
  'Slots',
  ['default'],
  'select-v2-customized-option',
  '自定义选项接收保留额外字段的原始对象',
  async () => {
    render(
      <SelectV2
        options={[{ value: 1, label: 'One', detail: 'Extra detail' }]}
        renderOption={({ item }) => <b>{String(item.detail)}</b>}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'Extra detail' })).toBeInTheDocument();
  },
);
apiTest(
  'select-v2',
  'Slots',
  ['header'],
  'select-v2-custom-header',
  '自定义头部保留在虚拟窗口之外',
  async () => {
    render(<SelectV2 options={options.slice(0, 3)} renderHeader={<b>Header</b>} />);
    await open();
    expect(screen.getByText('Header').tagName).toBe('B');
  },
);
apiTest(
  'select-v2',
  'Slots',
  ['footer'],
  'select-v2-custom-footer',
  '自定义底部保留在虚拟窗口之外',
  async () => {
    render(<SelectV2 options={options.slice(0, 3)} renderFooter={<b>Footer</b>} />);
    await open();
    expect(screen.getByText('Footer').tagName).toBe('B');
  },
);
apiTest(
  'select-v2',
  'Slots',
  ['tag', 'prefix', 'empty'],
  'select-v2-custom-tag',
  '标签前缀和空状态插槽可独立覆盖',
  async () => {
    const view = render(
      <SelectV2
        options={options.slice(0, 3)}
        multiple
        defaultValue={[0]}
        renderTag={({ data }) => <b>Tags: {data[0].label}</b>}
        renderPrefix={<i>Prefix</i>}
      />,
    );
    expect(screen.getByText('Tags: Option 0').tagName).toBe('B');
    expect(screen.getByText('Prefix').tagName).toBe('I');
    view.rerender(<SelectV2 options={[]} renderEmpty={<b>Empty</b>} />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => expect(screen.getByText('Empty')).toBeVisible());
  },
);
apiTest('select-v2', 'Slots', ['label'], 'select-v2-custom-label', '选中标签内容可定制', () => {
  render(
    <SelectV2
      options={options.slice(0, 3)}
      defaultValue={0}
      renderLabel={({ label }) => <b>Chosen {label}</b>}
    />,
  );
  expect(screen.getByText('Chosen Option 0').tagName).toBe('B');
});
apiTest(
  'select-v2',
  'Attributes',
  ['loading', 'loading-text', 'remote-show-suffix'],
  'select-v2-custom-loading',
  '加载状态优先于虚拟选项并显示加载提示',
  async () => {
    render(<SelectV2 options={options} loading loadingText="Fetching" remote remoteShowSuffix />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => expect(screen.getByText('Fetching')).toBeVisible());
    expect(screen.queryByRole('option')).toBeNull();
  },
);
apiTest(
  'select-v2',
  'Slots',
  ['loading'],
  'select-v2-custom-loading',
  '加载插槽覆盖默认加载提示',
  async () => {
    render(<SelectV2 loading renderLoading={<b>Custom loading</b>} />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => expect(screen.getByText('Custom loading')).toBeVisible());
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['remote', 'remote-method', 'debounce'],
  'select-v2-remote-search',
  '远程结果异步进入同一虚拟窗口',
  async () => {
    const remote = vi.fn(async (query: string): Promise<SelectOption[]> => [
      { value: query, label: `Found ${query}` },
    ]);
    render(<SelectV2 filterable remote debounce={0} remoteMethod={remote} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'React' } });
    expect(await screen.findByRole('option', { name: 'Found React' })).toBeVisible();
    expect(remote).toHaveBeenLastCalledWith('React');
  },
);
apiTest(
  'select-v2',
  'Attributes',
  [
    'popper-class',
    'popper-style',
    'teleported',
    'append-to',
    'persistent',
    'offset',
    'show-arrow',
    'placement',
    'fallback-placements',
  ],
  'select-v2-custom-width',
  '自定义浮层宽度位置挂载及销毁',
  async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const view = render(
      <SelectV2
        options={options.slice(0, 3)}
        popperClass="virtual-popup"
        popperStyle={{ width: 320 }}
        appendTo={target}
        persistent={false}
        offset={20}
        showArrow={false}
        placement="top-start"
        fallbackPlacements={['bottom-start']}
      />,
    );
    await open();
    expect(target.querySelector('.virtual-popup')).toHaveStyle({ width: '320px' });
    expect(target.querySelector('.el-popper__arrow')).toBeNull();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    await waitFor(() => expect(target.querySelector('.virtual-popup')).toBeNull());
    view.rerender(<SelectV2 options={options.slice(0, 3)} teleported={false} />);
    await open();
    expect(view.container.querySelector('.el-select__popper')).not.toBeNull();
    view.unmount();
    target.remove();
  },
);
apiTest(
  'select-v2',
  'Exposes',
  ['focus', 'blur', 'selectedLabel'],
  'select-v2-basic-usage',
  '公开实例沿用Select聚焦与当前标签',
  () => {
    const ref = createRef<SelectHandle>();
    render(<SelectV2 ref={ref} options={options.slice(0, 3)} defaultValue={1} />);
    expect(ref.current?.selectedLabel).toBe('Option 1');
    act(() => ref.current?.focus());
    expect(screen.getByRole('combobox')).toHaveFocus();
    act(() => ref.current?.blur());
    expect(screen.getByRole('combobox')).not.toHaveFocus();
  },
);
apiTest(
  'select-v2',
  'Events',
  ['change', 'visible-change', 'remove-tag', 'clear', 'blur', 'focus', 'end-reached'],
  'select-v2-multiple',
  '窗口边界和选择器交互分别发出回调',
  async () => {
    const change = vi.fn(),
      visible = vi.fn(),
      remove = vi.fn(),
      clear = vi.fn(),
      blur = vi.fn(),
      focus = vi.fn(),
      end = vi.fn();
    const view = render(
      <SelectV2
        options={options.slice(0, 50)}
        multiple
        defaultValue={[0, 1]}
        clearable
        onChange={change}
        onVisibleChange={visible}
        onRemoveTag={remove}
        onClear={clear}
        onBlur={blur}
        onFocus={focus}
        onEndReached={end}
      />,
    );
    const input = await open();
    fireEvent.focus(input);
    expect(focus).toHaveBeenCalled();
    expect(visible).toHaveBeenCalledWith(true);
    fireEvent.scroll(document.querySelector('.el-select-v2__virtual-list')!, { target: { scrollTop: 2000 } });
    expect(end).toHaveBeenCalledWith('forward');
    fireEvent.click(view.container.querySelector('.el-tag__close')!);
    expect(remove).toHaveBeenCalledWith(0);
    expect(change).toHaveBeenCalledWith([1]);
    fireEvent.mouseEnter(view.container.querySelector('.el-select__wrapper')!);
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(clear).toHaveBeenCalledOnce();
    fireEvent.blur(input);
    expect(blur).toHaveBeenCalled();
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['estimated-option-height'],
  'select-v2-customized-option',
  '动态高度测量更新后续行的位置',
  async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return new DOMRect(
        0,
        0,
        200,
        this.getAttribute('role') === 'option' && this.textContent === 'Tall' ? 80 : 20,
      );
    });
    render(
      <SelectV2
        options={[
          { value: 1, label: 'Tall' },
          { value: 2, label: 'Short' },
        ]}
        estimatedOptionHeight={34}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    const short = await screen.findByRole('option', { name: 'Short' });
    await waitFor(() => expect(short).toHaveStyle({ top: '80px' }));
  },
);
featureTest(
  'select-v2',
  'keyboard-window',
  'select-v2-basic-usage',
  '方向键定位未挂载末项并可按Enter提交',
  async () => {
    const change = vi.fn();
    render(<SelectV2 options={options} onChange={change} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(await screen.findByRole('option', { name: 'Option 9999' })).toBeVisible();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(change).toHaveBeenCalledWith(9999);
  },
);
featureTest(
  'select-v2',
  'locale-empty',
  'select-v2-basic-usage',
  '虚拟选择器空状态继承全局语言',
  async () => {
    render(
      <ConfigProvider locale="zh-cn">
        <SelectV2 options={[]} />
      </ConfigProvider>,
    );
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => expect(screen.getByText('暂无数据')).toBeVisible());
  },
);

apiTest(
  'select-v2',
  'Attributes',
  ['automatic-dropdown', 'suffix-icon'],
  'select-v2-basic-usage',
  '自动聚焦展开和自定义后缀图标',
  async () => {
    render(<SelectV2 options={options.slice(0, 3)} automaticDropdown suffixIcon={<b>Suffix</b>} />);
    fireEvent.focus(screen.getByRole('combobox'));
    await screen.findByRole('option', { name: 'Option 0' });
    expect(screen.getByText('Suffix').tagName).toBe('B');
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['validate-event'],
  'select-v2-basic-usage',
  '关闭校验通知后选择不触发表单change',
  async () => {
    const change = vi.fn(),
      blur = vi.fn();
    const view = render(
      <FieldValidationContext.Provider value={{ change, blur, errorId: 'error', invalid: false }}>
        <SelectV2 options={options.slice(0, 3)} validateEvent={false} />
      </FieldValidationContext.Provider>,
    );
    const input = await open();
    fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    fireEvent.blur(input);
    expect(change).not.toHaveBeenCalled();
    expect(blur).not.toHaveBeenCalled();
    view.rerender(
      <FieldValidationContext.Provider value={{ change, blur, errorId: 'error', invalid: false }}>
        <SelectV2 options={options.slice(0, 3)} />
      </FieldValidationContext.Provider>,
    );
    await open();
    fireEvent.click(screen.getByRole('option', { name: 'Option 2' }));
    expect(change).toHaveBeenCalledWith(2);
  },
);
apiTest(
  'select-v2',
  'Attributes',
  ['[tag-tooltip](#tag-tooltip)', 'tag-type', 'tag-effect'],
  'select-v2-hide-extra-tags',
  '折叠标签提示配置传递至共享Tooltip',
  async () => {
    render(
      <SelectV2
        options={options.slice(0, 5)}
        multiple
        defaultValue={[0, 1]}
        collapseTags
        collapseTagsTooltip
        tagType="success"
        tagEffect="dark"
        tagTooltip={{
          popperClass: 'tag-popup',
          effect: 'light',
          showAfter: 0,
          hideAfter: 0,
          offset: 20,
          placement: 'top',
          teleported: false,
        }}
      />,
    );
    expect(document.querySelector('.el-tag')).toHaveClass('el-tag--success', 'el-tag--dark');
    fireEvent.mouseEnter(screen.getByText('+ 1').closest('.el-tooltip__trigger')!);
    await screen.findByRole('tooltip');
    expect(document.querySelector('.tag-popup')).toHaveClass('is-light');
  },
);
