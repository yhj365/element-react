import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import { Dialog, Drawer, Button } from '../packages/element-react';
import type { ModalHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

afterEach(() => vi.useRealTimers());
/** 激活显隐调度，不跳过300ms关闭/打开过渡。 */
function openTimers(): void {
  act(() => {
    vi.advanceTimersByTime(0);
  });
}

apiTest(
  'dialog',
  'Attributes',
  ['draggable', 'overflow'],
  'dialog-lifecycle',
  '头部拖动、越界和resetPosition',
  () => {
    vi.useFakeTimers();
    const ref = createRef<ModalHandle>();
    const view = render(<Dialog ref={ref} defaultValue title="可拖动" draggable overflow />);
    openTimers();
    const dialog = screen.getByRole('dialog'),
      header = dialog.querySelector('header')!;
    fireEvent.mouseDown(header, { clientX: 10, clientY: 20 });
    fireEvent.mouseMove(window, { clientX: 50, clientY: 80 });
    expect(dialog).toHaveStyle({ transform: 'translate(40px,60px)' });
    fireEvent.mouseUp(window);
    act(() => ref.current?.resetPosition());
    expect(dialog.style.transform).toBe('');
    view.unmount();
    fireEvent.mouseMove(window, { clientX: 100, clientY: 120 });
    expect(screen.queryByRole('dialog')).toBeNull();
  },
);
featureTest(
  'dialog',
  'close-after-unmount',
  'dialog-lifecycle',
  '关闭拦截的过期done在卸载后不提交模型',
  () => {
    vi.useFakeTimers();
    const change = vi.fn();
    let done!: (cancel?: boolean) => void;
    const view = render(
      <Dialog
        defaultValue
        onValueChange={change}
        beforeClose={(next) => {
          done = next;
        }}
      />,
    );
    openTimers();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    view.unmount();
    act(() => done());
    expect(change).not.toHaveBeenCalled();
  },
);

apiTest(
  'dialog',
  'Attributes',
  ['model-value', 'title', 'width', 'top', 'header-class', 'body-class', 'footer-class'],
  'dialog-basic',
  '对话框值和区域布局',
  () => {
    vi.useFakeTimers();
    render(
      <Dialog
        defaultValue
        title="编辑"
        width={420}
        top="10vh"
        headerClass="header-custom"
        bodyClass="body-custom"
        footerClass="footer-custom"
        renderFooter="底部"
      >
        正文
      </Dialog>,
    );
    openTimers();
    expect(screen.getByRole('dialog')).toHaveAccessibleName('编辑');
    expect(screen.getByRole('dialog')).toHaveStyle({
      '--el-dialog-width': '420px',
      '--el-dialog-margin-top': '10vh',
    });
    expect(screen.getByText('编辑').closest('header')).toHaveClass('header-custom');
    expect(screen.getByText('正文')).toHaveClass('body-custom');
    expect(screen.getByText('底部')).toHaveClass('footer-custom');
  },
);
apiTest(
  'dialog',
  'Attributes',
  ['fullscreen', 'center', 'align-center', 'modal', 'modal-class', 'z-index', 'header-aria-level'],
  'dialog-basic',
  '模态和对齐配置',
  () => {
    vi.useFakeTimers();
    render(
      <Dialog
        defaultValue
        title="提示"
        fullscreen
        center
        alignCenter
        modal={false}
        modalClass="custom-mask"
        zIndex={3000}
        headerAriaLevel="3"
      >
        正文
      </Dialog>,
    );
    openTimers();
    expect(screen.getByRole('dialog')).toHaveClass('is-fullscreen', 'is-align-center', 'el-dialog--center');
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'false');
    expect(document.querySelector('.custom-mask')).toHaveStyle({
      'z-index': 3000,
      'background-color': 'rgba(0, 0, 0, 0)',
    });
    expect(screen.getByRole('heading')).toHaveAttribute('aria-level', '3');
  },
);
apiTest(
  'dialog',
  'Attributes',
  ['show-close', 'close-icon', 'close-on-press-escape', 'close-on-click-modal'],
  'dialog-basic',
  '关闭按钮遮罩和Escape',
  () => {
    vi.useFakeTimers();
    const close = vi.fn();
    const { rerender } = render(
      <Dialog
        defaultValue
        title="提示"
        closeIcon={<span>关闭图标</span>}
        closeOnPressEscape={false}
        closeOnClickModal={false}
        onValueChange={close}
      />,
    );
    openTimers();
    expect(screen.getByText('关闭图标')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(close).not.toHaveBeenCalled();
    const mask = document.querySelector('.el-overlay-dialog')!;
    fireEvent.mouseDown(mask);
    fireEvent.click(mask);
    expect(close).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(close).toHaveBeenCalledWith(false);
    rerender(<Dialog value title="提示" showClose={false} />);
    openTimers();
    expect(screen.queryByRole('button')).toBeNull();
  },
);
apiTest(
  'dialog',
  'Attributes',
  ['append-to-body', 'append-to', 'lock-scroll'],
  'dialog-basic',
  'Portal目标与滚动锁恢复',
  () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'auto';
    const target = document.createElement('div');
    target.id = 'modal-host';
    document.body.appendChild(target);
    const { unmount } = render(
      <Dialog defaultValue title="传送" appendTo="#modal-host" appendToBody lockScroll />,
    );
    openTimers();
    expect(target).toContainElement(screen.getByRole('dialog'));
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('auto');
    target.remove();
    document.body.style.overflow = '';
  },
);
apiTest(
  'dialog',
  'Attributes',
  ['open-delay', 'close-delay', 'destroy-on-close'],
  'dialog-lifecycle',
  '延迟和关闭后销毁',
  () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Dialog value title="延迟" openDelay={100} closeDelay={200} destroyOnClose>
        <span>销毁内容</span>
      </Dialog>,
    );
    act(() => vi.advanceTimersByTime(99));
    expect(screen.queryByRole('dialog')).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('销毁内容')).toBeInTheDocument();
    rerender(
      <Dialog value={false} title="延迟" openDelay={100} closeDelay={200} destroyOnClose>
        <span>销毁内容</span>
      </Dialog>,
    );
    act(() => vi.advanceTimersByTime(199));
    expect(screen.getByText('销毁内容')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByText('销毁内容')).toBeNull();
  },
);
apiTest('dialog', 'Attributes', ['before-close'], 'dialog-lifecycle', 'done取消和防止重复关闭', () => {
  vi.useFakeTimers();
  const change = vi.fn();
  const { rerender } = render(
    <Dialog value title="拦截" onValueChange={change} beforeClose={(done) => done(true)} />,
  );
  openTimers();
  fireEvent.click(screen.getByRole('button'));
  expect(change).not.toHaveBeenCalled();
  rerender(
    <Dialog
      value
      title="拦截"
      onValueChange={change}
      beforeClose={(done) => {
        done();
        done();
      }}
    />,
  );
  fireEvent.click(screen.getByRole('button'));
  expect(change).toHaveBeenCalledTimes(1);
});
apiTest(
  'dialog',
  'Events',
  ['open', 'opened', 'close', 'closed', 'open-auto-focus', 'close-auto-focus'],
  'dialog-lifecycle',
  '生命周期与焦点恢复',
  () => {
    vi.useFakeTimers();
    const events: string[] = [];
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const { rerender, unmount } = render(
      <Dialog
        value
        title="生命周期"
        onOpen={() => events.push('open')}
        onOpened={() => events.push('opened')}
        onClose={() => events.push('close')}
        onClosed={() => events.push('closed')}
        onOpenAutoFocus={() => events.push('focus-open')}
        onCloseAutoFocus={() => events.push('focus-close')}
      />,
    );
    openTimers();
    expect(screen.getByRole('dialog')).toHaveFocus();
    act(() => vi.advanceTimersByTime(300));
    expect(events).toContain('opened');
    rerender(
      <Dialog
        value={false}
        title="生命周期"
        onClose={() => events.push('close')}
        onClosed={() => events.push('closed')}
        onCloseAutoFocus={() => events.push('focus-close')}
      />,
    );
    openTimers();
    act(() => vi.advanceTimersByTime(300));
    expect(events).toContain('close');
    expect(events).toContain('closed');
    expect(events).toContain('focus-close');
    expect(trigger).toHaveFocus();
    unmount();
    trigger.remove();
  },
);
apiTest(
  'dialog',
  'Slots',
  ['default', 'header', 'footer', 'title'],
  'dialog-basic',
  '头部作用域和兼容标题',
  () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Dialog
        defaultValue
        renderHeader={({ titleId, titleClass }) => (
          <b id={titleId} className={titleClass}>
            自定义标题
          </b>
        )}
        renderFooter={<Button>底部动作</Button>}
      >
        内容
      </Dialog>,
    );
    openTimers();
    expect(screen.getByText('自定义标题')).toHaveClass('el-dialog__title');
    expect(screen.getByText('底部动作')).toBeInTheDocument();
    expect(screen.getByText('内容')).toBeInTheDocument();
    rerender(<Dialog value renderTitle="兼容标题" />);
    expect(screen.getByText('兼容标题')).toBeInTheDocument();
  },
);
apiTest('dialog', 'Exposes', ['handleClose', 'resetPosition'], 'dialog-lifecycle', '关闭与复位实例', () => {
  vi.useFakeTimers();
  const ref = createRef<ModalHandle>(),
    change = vi.fn();
  render(<Dialog value ref={ref} title="实例" onValueChange={change} />);
  openTimers();
  act(() => ref.current?.resetPosition());
  act(() => ref.current?.handleClose());
  expect(change).toHaveBeenCalledWith(false);
});
featureTest('dialog', 'nested-layer-focus', 'dialog-basic', '嵌套模态只有顶层响应Escape并按计数解锁', () => {
  vi.useFakeTimers();
  const first = vi.fn(),
    second = vi.fn();
  const { unmount } = render(
    <>
      <Dialog value title="外层" onValueChange={first} />
      <Dialog value title="内层" onValueChange={second} />
    </>,
  );
  openTimers();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(second).toHaveBeenCalledWith(false);
  expect(first).not.toHaveBeenCalled();
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).not.toBe('hidden');
});
featureTest('dialog', 'focus-loop', 'dialog-basic', 'Tab循环与关闭焦点事件取消', () => {
  vi.useFakeTimers();
  render(
    <Dialog value title="焦点">
      <Button>第一项</Button>
      <Button>最后一项</Button>
    </Dialog>,
  );
  openTimers();
  const last = screen.getByRole('button', { name: '最后一项' });
  last.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
});
apiTest(
  'drawer',
  'Attributes',
  [
    'model-value',
    'direction',
    'size',
    'title',
    'with-header',
    'show-close',
    'header-class',
    'body-class',
    'footer-class',
  ],
  'drawer-basic',
  '抽屉方向与尺寸',
  () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Drawer
        defaultValue
        title="详情"
        direction="ttb"
        size={240}
        headerClass="drawer-head"
        bodyClass="drawer-body"
        footerClass="drawer-foot"
        renderFooter="底部"
      >
        正文
      </Drawer>,
    );
    openTimers();
    expect(screen.getByRole('dialog')).toHaveClass('el-drawer', 'ttb');
    expect(screen.getByRole('dialog')).toHaveStyle({ height: '240px' });
    expect(screen.getByText('详情').closest('header')).toHaveClass('drawer-head');
    expect(screen.getByText('正文')).toHaveClass('drawer-body');
    expect(screen.getByText('底部')).toHaveClass('drawer-foot');
    rerender(
      <Drawer value withHeader={false} showClose={false}>
        无头部
      </Drawer>,
    );
    openTimers();
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  },
);
apiTest('drawer', 'Slots', ['default', 'header', 'footer', 'title'], 'drawer-basic', '抽屉渲染区域', () => {
  vi.useFakeTimers();
  render(
    <Drawer value renderTitle="自定义标题" renderFooter="底部动作">
      抽屉内容
    </Drawer>,
  );
  openTimers();
  expect(screen.getByText('自定义标题')).toBeInTheDocument();
  expect(screen.getByText('底部动作')).toBeInTheDocument();
  expect(screen.getByText('抽屉内容')).toBeInTheDocument();
});
