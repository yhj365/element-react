import { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import { Button, Tooltip, Popover, Popconfirm } from '../packages/element-react';
import type { TooltipHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

afterEach(() => vi.useRealTimers());
/** 冒泡事件交由trigger容器统一处理。 */
function trigger(): HTMLElement {
  return document.querySelector('.el-tooltip__trigger')!;
}

apiTest(
  'tooltip',
  'Attributes',
  ['content', 'effect', 'placement', 'offset', 'show-arrow', 'popper-class', 'popper-style', 'aria-label'],
  'tooltip-basic',
  '提示内容主题定位与样式',
  async () => {
    render(
      <Tooltip
        content="提示内容"
        effect="light"
        placement="top-start"
        offset={8}
        showArrow
        popperClass="custom-popup"
        popperStyle={{ color: 'red' }}
        ariaLabel="提示名称"
      >
        <Button>目标</Button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(trigger());
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveClass('el-popper', 'is-light', 'custom-popup');
    expect(tip).toHaveAttribute('data-popper-placement');
    expect(tip).toHaveAttribute('aria-label', '提示名称');
    expect(tip).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(tip.querySelector('.el-popper__arrow')).not.toBeNull();
    expect(tip).toHaveTextContent('提示内容');
  },
);
apiTest(
  'tooltip',
  'Attributes',
  ['visible', 'disabled', 'trigger'],
  'tooltip-basic',
  '受控显隐与禁用',
  async () => {
    const { rerender } = render(
      <Tooltip visible={false} trigger="click" content="内容">
        <Button>目标</Button>
      </Tooltip>,
    );
    fireEvent.click(trigger());
    expect(screen.queryByRole('tooltip')).toBeNull();
    rerender(
      <Tooltip visible content="内容">
        <Button>目标</Button>
      </Tooltip>,
    );
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    rerender(
      <Tooltip visible disabled content="内容">
        <Button>目标</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
  },
);
apiTest('tooltip', 'Attributes', ['raw-content'], 'tooltip-basic', '显式HTML内容模式', async () => {
  render(
    <Tooltip visible rawContent content="<b>HTML内容</b>">
      <Button>目标</Button>
    </Tooltip>,
  );
  await waitFor(() => expect(screen.getByText('HTML内容')).toBeVisible());
  expect(screen.getByText('HTML内容').tagName).toBe('B');
});
apiTest(
  'tooltip',
  'Attributes',
  ['show-after', 'hide-after', 'enterable', 'persistent'],
  'tooltip-basic',
  '出现隐藏延迟与可进入面板',
  async () => {
    render(
      <Tooltip content="延迟内容" showAfter={30} hideAfter={40} enterable persistent>
        <Button>目标</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.mouseEnter(trigger());
    expect(screen.queryByRole('tooltip')).toBeNull();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    fireEvent.mouseLeave(trigger());
    fireEvent.mouseEnter(screen.getByRole('tooltip'));
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(screen.getByRole('tooltip')).toBeVisible();
    fireEvent.mouseLeave(screen.getByRole('tooltip'));
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
  },
);
apiTest('tooltip', 'Attributes', ['auto-close'], 'tooltip-basic', '到时自动关闭', async () => {
  render(
    <Tooltip content="自动关闭" trigger="click" autoClose={80}>
      <Button>目标</Button>
    </Tooltip>,
  );
  fireEvent.click(trigger());
  await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
  await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
});
apiTest(
  'tooltip',
  'Attributes',
  ['teleported', 'append-to'],
  'tooltip-basic',
  '内容传送目标与内联模式',
  async () => {
    const target = document.createElement('div');
    target.id = 'tooltip-host';
    document.body.appendChild(target);
    const { rerender, unmount } = render(<Tooltip visible content="内容" appendTo="#tooltip-host" />);
    await waitFor(() => expect(target.querySelector('[role="tooltip"]')).not.toBeNull());
    rerender(<Tooltip visible content="内容" teleported={false} />);
    await waitFor(() => expect(target.querySelector('[role="tooltip"]')).toBeNull());
    unmount();
    target.remove();
  },
);
apiTest(
  'tooltip',
  'Attributes',
  ['trigger-keys', 'focus-on-target'],
  'tooltip-basic',
  '触发器键盘与聚焦',
  async () => {
    render(
      <Tooltip content="键盘提示" trigger="click" triggerKeys={['Enter']} focusOnTarget>
        <Button>目标</Button>
      </Tooltip>,
    );
    fireEvent.keyDown(trigger(), { key: 'Enter' });
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    expect(trigger()).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  },
);
apiTest(
  'tooltip',
  'Attributes',
  ['virtual-triggering', 'virtual-ref', 'fallback-placements'],
  'tooltip-basic',
  '虚拟目标定位',
  async () => {
    const reference = document.createElement('div');
    document.body.appendChild(reference);
    render(
      <Tooltip
        visible
        content="虚拟提示"
        virtualTriggering
        virtualRef={reference}
        fallbackPlacements={['right', 'left']}
      />,
    );
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    expect(trigger()).toHaveStyle({ display: 'none' });
    reference.remove();
  },
);
apiTest(
  'tooltip',
  'Events',
  ['before-show', 'show', 'before-hide', 'hide'],
  'tooltip-basic',
  '显示隐藏生命周期',
  async () => {
    const events: string[] = [];
    render(
      <Tooltip
        trigger="click"
        hideAfter={0}
        content="内容"
        onBeforeShow={() => events.push('before-show')}
        onShow={() => events.push('show')}
        onBeforeHide={() => events.push('before-hide')}
        onHide={() => events.push('hide')}
      >
        <Button>目标</Button>
      </Tooltip>,
    );
    fireEvent.click(trigger());
    await waitFor(() => expect(events).toContain('show'));
    fireEvent.click(trigger());
    await waitFor(() => expect(events).toContain('hide'));
    expect(events).toEqual(['before-show', 'show', 'before-hide', 'hide']);
  },
);
apiTest('tooltip', 'Slots', ['default', 'content'], 'tooltip-basic', '自定义内容区域优先', async () => {
  render(
    <Tooltip visible content="被覆盖" renderContent={<b>自定义内容</b>}>
      <Button>默认触发器</Button>
    </Tooltip>,
  );
  await waitFor(() => expect(screen.getByText('自定义内容')).toBeVisible());
  expect(screen.queryByText('被覆盖')).toBeNull();
  expect(screen.getByRole('button')).toHaveTextContent('默认触发器');
});
apiTest(
  'tooltip',
  'Exposes',
  ['popperRef', 'contentRef', 'isFocusInsideContent', 'updatePopper', 'onOpen', 'onClose', 'hide'],
  'tooltip-basic',
  '浮层实例能力',
  async () => {
    const ref = createRef<TooltipHandle>();
    render(
      <Tooltip ref={ref} content="内容" hideAfter={0} renderContent={<Button>面板动作</Button>}>
        <Button>触发器</Button>
      </Tooltip>,
    );
    act(() => ref.current?.onOpen());
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    expect(ref.current?.popperRef).toBe(screen.getByRole('tooltip'));
    expect(ref.current?.contentRef).toBe(screen.getByRole('tooltip'));
    screen.getByRole('button', { name: '面板动作' }).focus();
    expect(ref.current?.isFocusInsideContent()).toBe(true);
    act(() => ref.current?.updatePopper());
    act(() => ref.current?.onClose());
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    act(() => ref.current?.onOpen());
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    act(() => ref.current?.hide());
    expect(screen.queryByRole('tooltip')).toBeNull();
  },
);
featureTest('tooltip', 'timer-cleanup', 'tooltip-basic', '未显示时卸载会释放延迟任务', () => {
  vi.useFakeTimers();
  const { unmount } = render(
    <Tooltip content="内容" showAfter={500}>
      <Button>触发器</Button>
    </Tooltip>,
  );
  fireEvent.mouseEnter(trigger());
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
apiTest(
  'popover',
  'Attributes',
  [
    'trigger',
    'title',
    'effect',
    'content',
    'width',
    'placement',
    'disabled',
    'visible',
    'show-arrow',
    'popper-class',
    'popper-style',
    'show-after',
    'hide-after',
    'auto-close',
    'teleported',
    'append-to',
    'persistent',
  ],
  'popover-basic',
  '弹出框独立默认值和内容',
  async () => {
    const { rerender } = render(
      <Popover
        visible
        title="弹出标题"
        content="正文"
        width={240}
        effect="light"
        placement="right"
        popperClass="custom-popover"
        popperStyle={{ padding: 16 }}
        showArrow
        persistent
        renderReference={<Button>引用</Button>}
      />,
    );
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
    expect(screen.getByRole('dialog')).toHaveClass('el-popover', 'is-light', 'custom-popover');
    expect(screen.getByRole('dialog')).toHaveStyle({ width: '240px', padding: '16px' });
    expect(screen.getByText('弹出标题')).toHaveClass('el-popover__title');
    expect(screen.getByText('正文')).toBeInTheDocument();
    rerender(<Popover visible disabled title="弹出标题" />);
    expect(screen.queryByRole('dialog')).toBeNull();
  },
);
apiTest(
  'popover',
  'Slots',
  ['default', 'reference'],
  'popover-basic',
  '弹出框引用与面板区域分离',
  async () => {
    render(
      <Popover visible renderReference={<Button>引用区域</Button>}>
        <b>面板内容</b>
      </Popover>,
    );
    await waitFor(() => expect(screen.getByText('面板内容')).toBeVisible());
    expect(trigger()).toContainElement(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toContainElement(screen.getByText('面板内容'));
  },
);
apiTest(
  'popover',
  'Events',
  ['show', 'before-enter', 'after-enter', 'hide', 'before-leave', 'after-leave'],
  'popover-basic',
  '弹出框过渡通知',
  async () => {
    const events: string[] = [];
    render(
      <Popover
        trigger="click"
        hideAfter={0}
        renderReference={<Button>引用</Button>}
        onShow={() => events.push('show')}
        onBeforeEnter={() => events.push('before-enter')}
        onAfterEnter={() => events.push('after-enter')}
        onHide={() => events.push('hide')}
        onBeforeLeave={() => events.push('before-leave')}
        onAfterLeave={() => events.push('after-leave')}
      >
        内容
      </Popover>,
    );
    fireEvent.click(trigger());
    await waitFor(() => expect(events).toContain('after-enter'));
    fireEvent.click(trigger());
    await waitFor(() => expect(events).toContain('after-leave'));
    expect(events).toEqual(['before-enter', 'show', 'after-enter', 'before-leave', 'hide', 'after-leave']);
  },
);
apiTest('popover', 'Exposes', ['hide'], 'popover-basic', '弹出框关闭实例', async () => {
  const ref = createRef<TooltipHandle>();
  render(
    <Popover ref={ref} defaultVisible renderReference={<Button>引用</Button>}>
      内容
    </Popover>,
  );
  await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
  act(() => ref.current?.hide());
  expect(screen.queryByRole('dialog')).toBeNull();
});
apiTest(
  'popconfirm',
  'Attributes',
  [
    'title',
    'effect',
    'confirm-button-text',
    'cancel-button-text',
    'confirm-button-type',
    'cancel-button-type',
    'icon',
    'icon-color',
    'hide-icon',
    'hide-after',
    'teleported',
    'persistent',
    'width',
  ],
  'popconfirm-basic',
  '确认气泡内容和动作配置',
  async () => {
    render(
      <Popconfirm
        title="删除记录？"
        effect="light"
        confirmButtonText="确认删除"
        cancelButtonText="保留"
        confirmButtonType="danger"
        cancelButtonType="primary"
        icon={<span>提示图标</span>}
        iconColor="red"
        hideAfter={0}
        width={220}
        persistent
        renderReference={<Button>删除</Button>}
      />,
    );
    fireEvent.click(trigger());
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
    expect(screen.getByRole('dialog')).toHaveStyle({ width: '220px' });
    expect(screen.getByRole('button', { name: '确认删除' })).toHaveClass('el-button--danger');
    expect(screen.getByRole('button', { name: '保留' })).toHaveClass('el-button--primary');
    expect(screen.getByText('提示图标').closest('.el-icon')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(screen.getByText('删除记录？')).toBeInTheDocument();
  },
);
apiTest(
  'popconfirm',
  'Events',
  ['confirm', 'cancel'],
  'popconfirm-basic',
  '确认取消分别通知并关闭',
  async () => {
    const confirm = vi.fn(),
      cancel = vi.fn();
    render(
      <Popconfirm
        title="确认？"
        confirmButtonText="确认"
        cancelButtonText="取消"
        hideAfter={0}
        onConfirm={confirm}
        onCancel={cancel}
        renderReference={<Button>打开</Button>}
      />,
    );
    fireEvent.click(trigger());
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '确认' }));
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(cancel).not.toHaveBeenCalled();
    fireEvent.click(trigger());
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(cancel).toHaveBeenCalledTimes(1);
  },
);
apiTest('popconfirm', 'Slots', ['reference', 'actions'], 'popconfirm-basic', '自定义动作作用域', async () => {
  const confirm = vi.fn();
  render(
    <Popconfirm
      title="确认？"
      onConfirm={confirm}
      renderReference={<Button>引用</Button>}
      renderActions={(actions) => <Button onClick={actions.confirm}>自定义确认</Button>}
    />,
  );
  fireEvent.click(trigger());
  await waitFor(() => expect(screen.getByRole('button', { name: '自定义确认' })).toBeVisible());
  fireEvent.click(screen.getByRole('button', { name: '自定义确认' }));
  expect(confirm).toHaveBeenCalledTimes(1);
});
