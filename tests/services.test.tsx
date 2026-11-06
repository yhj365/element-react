import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import {
  ConfigProvider,
  Dialog,
  Loading,
  Message,
  Notification,
  useMessage,
} from '../packages/element-react';
import type { LoadingInstance, MessageInstance } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
afterEach(() => {
  act(() => {
    Message.closeAll();
    Notification.closeAll();
  });
  vi.useRealTimers();
});

apiTest(
  'message',
  'Options',
  [
    'message',
    'type',
    'plain',
    'icon',
    'dangerouslyUseHTMLString',
    'customClass',
    'showClose',
    'offset',
    'placement',
  ],
  'message-basic',
  '消息内容类型样式与位置',
  () => {
    act(() => {
      Message({
        message: '<b>消息正文</b>',
        type: 'success',
        plain: true,
        icon: <span>图标</span>,
        dangerouslyUseHTMLString: true,
        customClass: 'custom-message',
        showClose: true,
        duration: 0,
        offset: 32,
        placement: 'bottom-left',
      });
    });
    const message = screen.getByRole('alert');
    expect(message).toHaveClass('el-message', 'el-message--success', 'is-plain', 'custom-message');
    expect(message).toHaveStyle({ bottom: '32px', left: '16px' });
    expect(screen.getByText('消息正文').tagName).toBe('B');
    expect(screen.getByText('图标')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument();
  },
);
apiTest('message', 'Options', ['duration', 'onClose'], 'message-basic', '消息到时关闭且仅通知一次', () => {
  vi.useFakeTimers();
  const close = vi.fn();
  let instance!: MessageInstance;
  act(() => {
    instance = Message({ message: '消息', duration: 100, onClose: close });
  });
  act(() => vi.advanceTimersByTime(100));
  expect(screen.queryByRole('alert')).toBeNull();
  act(() => instance.close());
  expect(close).toHaveBeenCalledTimes(1);
});
apiTest(
  'message',
  'Options',
  ['grouping', 'repeatNum'],
  'message-basic',
  '相同内容分组合并和重复计数',
  () => {
    let first!: MessageInstance, second!: MessageInstance;
    act(() => {
      first = Message({ message: '重复', grouping: true, repeatNum: 2, duration: 0 });
    });
    act(() => {
      second = Message({ message: '重复', grouping: true, duration: 0 });
    });
    expect(first).toBe(second);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByText('3')).toBeInTheDocument();
  },
);
apiTest('message', 'Options', ['appendTo'], 'message-basic', '消息指定挂载容器', () => {
  const target = document.createElement('div');
  target.id = 'message-host';
  document.body.appendChild(target);
  act(() => {
    Message({ message: <span>容器消息</span>, appendTo: '#message-host', duration: 0 });
  });
  expect(target).toContainElement(screen.getByText('容器消息'));
  act(() => Message.closeAll());
  target.remove();
});
apiTest('message', 'Methods', ['close'], 'message-basic', '消息实例关闭', () => {
  let instance!: MessageInstance;
  act(() => {
    instance = Message('消息');
  });
  act(() => instance.close());
  expect(screen.queryByRole('alert')).toBeNull();
});
featureTest(
  'message',
  'context-bound',
  'message-basic',
  '绑定当前Provider命名空间而非读取其他React树',
  () => {
    let message!: ReturnType<typeof useMessage>;
    /** 取得当前Provider绑定的服务。 */ function Bound() {
      message = useMessage();
      return null;
    }
    render(
      <ConfigProvider namespace="custom">
        <Bound />
      </ConfigProvider>,
    );
    act(() => {
      message.success('绑定消息');
    });
    expect(screen.getByRole('alert')).toHaveClass('custom-message', 'custom-message--success');
  },
);
featureTest('message', 'hover-pause', 'message-basic', '悬停暂停剩余时长', () => {
  vi.useFakeTimers();
  act(() => {
    Message({ message: '暂停消息', duration: 100 });
  });
  act(() => vi.advanceTimersByTime(40));
  fireEvent.mouseEnter(screen.getByRole('alert'));
  act(() => vi.advanceTimersByTime(200));
  expect(screen.getByRole('alert')).toBeInTheDocument();
  fireEvent.mouseLeave(screen.getByRole('alert'));
  act(() => vi.advanceTimersByTime(59));
  expect(screen.getByRole('alert')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.queryByRole('alert')).toBeNull();
});
apiTest(
  'notification',
  'Options',
  [
    'title',
    'message',
    'dangerouslyUseHTMLString',
    'type',
    'icon',
    'customClass',
    'position',
    'showClose',
    'offset',
    'zIndex',
    'closeIcon',
  ],
  'notification-basic',
  '通知标题内容方向与关闭图标',
  () => {
    act(() => {
      Notification({
        title: '通知标题',
        message: '<b>通知正文</b>',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        icon: <span>提示图标</span>,
        customClass: 'custom-notification',
        position: 'bottom-right',
        showClose: true,
        offset: 20,
        zIndex: 5000,
        closeIcon: <span>自定义关闭</span>,
        duration: 0,
      });
    });
    expect(screen.getByRole('alert')).toHaveClass('el-notification', 'custom-notification', 'right');
    expect(screen.getByRole('alert')).toHaveStyle({ 'z-index': 5000, bottom: '36px', right: '16px' });
    expect(screen.getByText('通知标题')).toHaveClass('el-notification__title');
    expect(screen.getByText('通知正文').tagName).toBe('B');
    expect(screen.getByText('自定义关闭')).toBeInTheDocument();
  },
);
apiTest(
  'notification',
  'Options',
  ['duration', 'onClose', 'onClick', 'pauseOnHover'],
  'notification-basic',
  '通知点击关闭与计时',
  () => {
    vi.useFakeTimers();
    const close = vi.fn(),
      click = vi.fn();
    act(() => {
      Notification({
        title: '通知',
        message: () => <span>函数内容</span>,
        duration: 100,
        onClose: close,
        onClick: click,
        pauseOnHover: false,
      });
    });
    fireEvent.click(screen.getByText('函数内容'));
    expect(click).toHaveBeenCalledTimes(1);
    fireEvent.mouseEnter(screen.getByRole('alert'));
    act(() => vi.advanceTimersByTime(100));
    expect(close).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  },
);
apiTest('notification', 'Options', ['appendTo'], 'notification-basic', '通知挂载容器', () => {
  const target = document.createElement('div');
  document.body.appendChild(target);
  act(() => {
    Notification({ title: '通知', message: '容器内', appendTo: target, duration: 0 });
  });
  expect(target).toContainElement(screen.getByRole('alert'));
  act(() => Notification.closeAll());
  target.remove();
});
apiTest('notification', 'Method', ['close'], 'notification-basic', '通知实例关闭', () => {
  let instance!: MessageInstance;
  act(() => {
    instance = Notification({ title: '通知', duration: 0 });
  });
  act(() => instance.close());
  expect(screen.queryByRole('alert')).toBeNull();
});
apiTest(
  'loading',
  'Options',
  ['text', 'spinner', 'background', 'customClass', 'svg', 'svgViewBox'],
  'loading-basic',
  '加载文案图标和样式',
  () => {
    const { rerender } = render(
      <Loading
        text="加载文案"
        spinner="custom-spinner"
        background="rgba(0, 0, 0, 0.5)"
        customClass="custom-loading"
      >
        <p>实际内容</p>
      </Loading>,
    );
    expect(screen.getByRole('status')).toHaveClass('el-loading-mask', 'custom-loading');
    expect(screen.getByRole('status')).toHaveStyle({ 'background-color': 'rgba(0, 0, 0, 0.5)' });
    expect(screen.getByText('加载文案')).toHaveClass('el-loading-text');
    expect(document.querySelector('.custom-spinner')).not.toBeNull();
    rerender(<Loading svg="<path d='M0 0 L10 10' />" svgViewBox="0 0 10 10" />);
    expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 10 10');
    expect(document.querySelector('svg path')).not.toBeNull();
  },
);
apiTest('loading', 'Options', ['fullscreen', 'lock'], 'loading-basic', '全屏加载和模态共用滚动锁', () => {
  const { rerender, unmount } = render(
    <>
      <Dialog value title="弹窗" />
      <Loading fullscreen lock />
    </>,
  );
  expect(document.body.style.overflow).toBe('hidden');
  expect(screen.getByRole('status')).toHaveClass('is-fullscreen');
  rerender(
    <>
      <Dialog value title="弹窗" />
      <Loading loading={false} fullscreen lock />
    </>,
  );
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).not.toBe('hidden');
});
apiTest(
  'loading',
  'Options',
  ['target', 'body', 'beforeClose', 'closed'],
  'loading-basic',
  '加载服务挂载和关闭前拦截',
  () => {
    vi.useFakeTimers();
    const target = document.createElement('div');
    target.id = 'loading-host';
    document.body.appendChild(target);
    let allowed = false;
    const closed = vi.fn();
    let instance!: LoadingInstance;
    act(() => {
      instance = Loading.service({
        target: '#loading-host',
        fullscreen: false,
        text: '服务加载',
        beforeClose: () => allowed,
        closed,
      });
    });
    expect(target).toContainElement(screen.getByRole('status'));
    act(() => instance.setText('新文案'));
    expect(screen.getByText('新文案')).toBeInTheDocument();
    act(() => instance.close());
    act(() => vi.advanceTimersByTime(300));
    expect(closed).not.toHaveBeenCalled();
    allowed = true;
    act(() => instance.close());
    act(() => vi.advanceTimersByTime(300));
    expect(closed).toHaveBeenCalledTimes(1);
    expect(target).toBeEmptyDOMElement();
    target.remove();
  },
);
