import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { InputTag } from '../packages/element-react';
import type { InputTagHandle } from '../packages/element-react';
import { FieldValidationContext } from '../packages/hooks';
import { apiTest, featureTest } from './contract';

apiTest(
  'input-tag',
  'Attributes',
  ['model-value', 'max', 'placeholder'],
  'input-tag-basic',
  '受控标签更新等待回写，数量达到上限不再添加',
  () => {
    const change = vi.fn();
    const view = render(<InputTag value={['A']} onValueChange={change} max={2} placeholder="提示" />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(change).toHaveBeenCalledExactlyOnceWith(['A', 'B']);
    expect(view.container.querySelectorAll('.el-tag')).toHaveLength(1);
    view.rerender(<InputTag value={['A', 'B']} max={2} onValueChange={change} />);
    fireEvent.change(input, { target: { value: 'C' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(change).toHaveBeenCalledOnce();
    expect(input).toHaveValue('');
    expect(input).not.toHaveAttribute('placeholder');
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['trigger', 'save-on-blur'],
  'input-tag-basic',
  '空格提交与失焦保存策略',
  () => {
    const change = vi.fn();
    const view = render(<InputTag trigger="Space" onChange={change} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' Alpha ' } });
    fireEvent.keyDown(input, { key: ' ', code: 'Space' });
    expect(change).toHaveBeenLastCalledWith(['Alpha']);
    fireEvent.change(input, { target: { value: 'Beta' } });
    fireEvent.blur(input);
    expect(change).toHaveBeenLastCalledWith(['Alpha', 'Beta']);
    view.rerender(<InputTag trigger="Space" saveOnBlur={false} onChange={change} />);
    fireEvent.change(input, { target: { value: '不保存' } });
    fireEvent.blur(input);
    expect(change).toHaveBeenCalledTimes(2);
    expect(input).toHaveValue('');
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['delimiter'],
  'input-tag-basic',
  '分隔字符与正则支持输入拆分和粘贴并遵循max',
  () => {
    const add = vi.fn();
    const view = render(<InputTag delimiter="," max={3} onAddTag={add} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'A, B,' } });
    expect(add).toHaveBeenLastCalledWith(['A', 'B']);
    fireEvent.paste(input, { clipboardData: { getData: () => 'C,D' } });
    expect(add).toHaveBeenLastCalledWith('C');
    expect(view.container.querySelectorAll('.el-tag')).toHaveLength(3);
    view.unmount();
    render(<InputTag delimiter={/[;\s]+/} onAddTag={add} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'X; Y Z' } });
    expect(add).toHaveBeenLastCalledWith(['X', 'Y', 'Z']);
  },
);
apiTest(
  'input-tag',
  'Events',
  ['change', 'input', 'add-tag', 'remove-tag'],
  'input-tag-basic',
  '输入、添加和删除事件相互独立且携带原始索引',
  () => {
    const change = vi.fn(),
      inputEvent = vi.fn(),
      add = vi.fn(),
      remove = vi.fn();
    render(<InputTag onChange={change} onInput={inputEvent} onAddTag={add} onRemoveTag={remove} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(inputEvent).toHaveBeenCalledExactlyOnceWith('A');
    expect(change).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(change).toHaveBeenLastCalledWith(['A']);
    expect(add).toHaveBeenCalledExactlyOnceWith('A');
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(remove).toHaveBeenCalledExactlyOnceWith('A', 0);
    expect(change).toHaveBeenLastCalledWith([]);
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['tag-type', 'tag-effect', 'size'],
  'input-tag-basic',
  '容器尺寸与标签语义色、效果',
  () => {
    const view = render(<InputTag defaultValue={['标签']} tagType="success" tagEffect="dark" size="small" />);
    expect(view.container.firstChild).toHaveClass('el-input-tag--small');
    expect(view.container.querySelector('.el-tag')).toHaveClass(
      'el-tag--success',
      'el-tag--dark',
      'el-tag--small',
    );
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['disabled', 'readonly'],
  'input-tag-basic',
  '禁用和只读阻止新增删除与清空',
  () => {
    const change = vi.fn();
    const view = render(<InputTag defaultValue={['A']} disabled clearable onChange={change} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    view.rerender(<InputTag defaultValue={['A']} readOnly clearable onChange={change} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(change).not.toHaveBeenCalled();
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['autofocus', 'id', 'tabindex', 'maxlength', 'minlength', 'autocomplete', 'aria-label'],
  'input-tag-basic',
  '原生输入属性与自动聚焦',
  () => {
    render(
      <InputTag
        autoFocus
        id="tags"
        tabIndex={2}
        maxLength={12}
        minLength={2}
        autoComplete="on"
        ariaLabel="标签输入"
      />,
    );
    const input = screen.getByRole('textbox', { name: '标签输入' });
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('id', 'tags');
    expect(input).toHaveAttribute('tabindex', '2');
    expect(input).toHaveAttribute('maxlength', '12');
    expect(input).toHaveAttribute('minlength', '2');
    expect(input).toHaveAttribute('autocomplete', 'on');
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['clearable', 'clear-icon'],
  'input-tag-basic',
  '聚焦或悬停才显示清空，清空模型返回undefined',
  () => {
    const change = vi.fn(),
      clear = vi.fn();
    render(
      <InputTag
        defaultValue={['A']}
        clearable
        clearIcon={<span>清空图标</span>}
        onChange={change}
        onClear={clear}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Clear tags' })).toBeNull();
    fireEvent.focus(screen.getByRole('textbox'));
    expect(screen.getByText('清空图标')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear tags' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(undefined);
    expect(clear).toHaveBeenCalledOnce();
  },
);
apiTest(
  'input-tag',
  'Events',
  ['clear', 'focus', 'blur'],
  'input-tag-basic',
  '聚焦、失焦和清空各发出一次',
  () => {
    const focus = vi.fn(),
      blur = vi.fn(),
      clear = vi.fn();
    render(<InputTag defaultValue={['A']} clearable onFocus={focus} onBlur={blur} onClear={clear} />);
    const input = screen.getByRole('textbox');
    act(() => input.focus());
    fireEvent.click(screen.getByRole('button', { name: 'Clear tags' }));
    act(() => input.blur());
    expect(focus).toHaveBeenCalledOnce();
    expect(blur).toHaveBeenCalledOnce();
    expect(clear).toHaveBeenCalledOnce();
  },
);
apiTest(
  'input-tag',
  'Attributes',
  ['collapse-tags', 'collapse-tags-tooltip', 'max-collapse-tags', 'effect'],
  'input-tag-collapse',
  '折叠数量和提示层关闭使用完整索引',
  async () => {
    const remove = vi.fn();
    const view = render(
      <InputTag
        defaultValue={['A', 'B', 'C', 'D']}
        collapseTags
        collapseTagsTooltip
        maxCollapseTags={2}
        effect="dark"
        onRemoveTag={remove}
      />,
    );
    expect(view.container.querySelectorAll('.el-tag')).toHaveLength(3);
    expect(screen.getByText('+ 2')).toBeInTheDocument();
    fireEvent.mouseEnter(document.querySelector('.el-tooltip__trigger')!);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    expect(screen.getByRole('tooltip')).toHaveClass('is-dark');
    const c = screen.getByText('C').closest('.el-tag')!;
    fireEvent.click(c.querySelector('button')!);
    expect(remove).toHaveBeenCalledExactlyOnceWith('C', 2);
  },
);
apiTest('input-tag', 'Slots', ['tag', 'prefix', 'suffix'], 'input-tag-basic', '标签与前后区域插槽', () => {
  render(
    <InputTag
      defaultValue={['A']}
      renderTag={({ value, index }) => (
        <b>
          {value}:{index}
        </b>
      )}
      renderPrefix={<strong>前缀</strong>}
      renderSuffix={<strong>后缀</strong>}
    />,
  );
  expect(screen.getByText('A:0').tagName).toBe('B');
  expect(screen.getByText('前缀').parentElement).toHaveClass('el-input-tag__prefix');
  expect(screen.getByText('后缀').parentElement).toHaveClass('el-input-tag__suffix');
});
apiTest('input-tag', 'Exposes', ['focus', 'blur'], 'input-tag-basic', '公开引用控制焦点', () => {
  const ref = createRef<InputTagHandle>();
  render(<InputTag ref={ref} />);
  act(() => ref.current?.focus());
  expect(screen.getByRole('textbox')).toHaveFocus();
  act(() => ref.current?.blur());
  expect(screen.getByRole('textbox')).not.toHaveFocus();
});
apiTest(
  'input-tag',
  'Attributes',
  ['validate-event'],
  'input-tag-basic',
  '变更和失焦触发表单校验且可关闭',
  () => {
    const field = { change: vi.fn(), blur: vi.fn(), invalid: false, errorId: 'tag-error' };
    const view = render(
      <FieldValidationContext value={field}>
        <InputTag />
      </FieldValidationContext>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.blur(input);
    expect(field.change).toHaveBeenCalledWith(['A']);
    expect(field.blur).toHaveBeenCalledOnce();
    view.rerender(
      <FieldValidationContext value={field}>
        <InputTag validateEvent={false} />
      </FieldValidationContext>,
    );
    field.change.mockClear();
    field.blur.mockClear();
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.blur(input);
    expect(field.change).not.toHaveBeenCalled();
    expect(field.blur).not.toHaveBeenCalled();
  },
);
apiTest('input-tag', 'Attributes', ['draggable'], 'input-tag-basic', '拖动标签提交新顺序并显示落点', () => {
  const change = vi.fn(),
    drag = vi.fn();
  const view = render(
    <InputTag defaultValue={['A', 'B', 'C']} draggable onChange={change} onDragTag={drag} />,
  );
  const tags = view.container.querySelectorAll('.el-tag');
  expect(tags[0]).toHaveAttribute('draggable', 'true');
  vi.spyOn(tags[2], 'getBoundingClientRect').mockReturnValue({
    left: 100,
    right: 200,
    top: 0,
    bottom: 30,
    width: 100,
    height: 30,
    x: 100,
    y: 0,
    toJSON: () => ({}),
  });
  const transfer = { effectAllowed: 'none', dropEffect: 'none' };
  fireEvent.dragStart(tags[0], { dataTransfer: transfer });
  fireEvent(tags[2], new MouseEvent('dragover', { clientX: 190, bubbles: true, cancelable: true }));
  expect(view.container.querySelector('.el-input-tag__drop-indicator')).toBeVisible();
  fireEvent.dragEnd(tags[0], { dataTransfer: transfer });
  expect(change).toHaveBeenLastCalledWith(['B', 'C', 'A']);
  expect(drag).toHaveBeenCalledExactlyOnceWith(0, 2, 'A');
});
apiTest(
  'input-tag',
  'Events',
  ['drag-tag'],
  'input-tag-basic',
  '拖动事件提供原位置、新位置与标签文本',
  () => {
    const drag = vi.fn();
    const view = render(<InputTag defaultValue={['A', 'B', 'C']} draggable onDragTag={drag} />);
    const tags = view.container.querySelectorAll('.el-tag');
    vi.spyOn(tags[0], 'getBoundingClientRect').mockReturnValue({
      left: 100,
      right: 200,
      top: 0,
      bottom: 30,
      width: 100,
      height: 30,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.dragStart(tags[2]);
    fireEvent(tags[0], new MouseEvent('dragover', { clientX: 110, bubbles: true, cancelable: true }));
    fireEvent.dragEnd(tags[2]);
    expect(drag).toHaveBeenCalledExactlyOnceWith(2, 0, 'C');
  },
);
featureTest('input-tag', 'composition', 'input-tag-basic', '中文组合期间不拆分不提交，组合结束再处理', () => {
  const add = vi.fn(),
    inputEvent = vi.fn();
  render(<InputTag delimiter="," onAddTag={add} onInput={inputEvent} />);
  const input = screen.getByRole('textbox');
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: '中文,' } });
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  expect(add).not.toHaveBeenCalled();
  expect(inputEvent).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input);
  expect(add).toHaveBeenCalledExactlyOnceWith('中文');
  expect(inputEvent).toHaveBeenCalledExactlyOnceWith('中文,');
});

featureTest('input-tag', 'android-space', 'input-tag-basic', 'Android空格keyup补偿只提交一次', () => {
  const agent = vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Android');
  try {
    const add = vi.fn();
    render(<InputTag trigger="Space" onAddTag={add} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '移动端' } });
    fireEvent.keyUp(input, { key: ' ', code: 'Space' });
    expect(add).toHaveBeenCalledExactlyOnceWith('移动端');
    fireEvent.keyUp(input, { key: ' ', code: 'Space' });
    expect(add).toHaveBeenCalledOnce();
  } finally {
    agent.mockRestore();
  }
});
