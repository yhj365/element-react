import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import { Button, ConfigProvider, MessageBox, useMessageBox } from '../packages/element-react';
import type { MessageBoxResult, MessageBoxState } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
afterEach(() => {
  act(() => MessageBox.close());
});

apiTest(
  'message-box',
  'Options',
  [
    'title',
    'message',
    'type',
    'customClass',
    'customStyle',
    'modalClass',
    'showClose',
    'closeIcon',
    'icon',
    'center',
  ],
  'message-box-basic',
  '消息内容、类型图标和容器样式',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox({
        title: '自定义标题',
        message: <strong>自定义消息</strong>,
        type: 'success',
        customClass: 'custom-box',
        customStyle: { width: '480px' },
        modalClass: 'custom-mask',
        closeIcon: <span>关闭图标</span>,
        icon: <b>类型图标</b>,
        center: true,
      });
    });
    const box = screen.getByRole('dialog', { name: '自定义标题' });
    expect(box).toHaveClass('custom-box', 'is-center');
    expect(box).toHaveStyle({ width: '480px' });
    expect(screen.getByText('自定义消息').tagName).toBe('STRONG');
    expect(screen.getByText('类型图标')).toBeInTheDocument();
    expect(screen.getByText('关闭图标')).toBeInTheDocument();
    expect(box.closest('.custom-mask')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await expect(result).resolves.toBe('confirm');
  },
);
apiTest(
  'message-box',
  'Options',
  ['dangerouslyUseHTMLString'],
  'message-box-basic',
  'HTML内容由显式开关控制',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.alert('<b>HTML正文</b>', { dangerouslyUseHTMLString: true });
    });
    expect(screen.getByText('HTML正文').tagName).toBe('B');
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await result;
  },
);
apiTest(
  'message-box',
  'Options',
  [
    'showCancelButton',
    'showConfirmButton',
    'cancelButtonText',
    'confirmButtonText',
    'cancelButtonType',
    'confirmButtonType',
    'cancelButtonClass',
    'confirmButtonClass',
    'buttonSize',
    'roundButton',
  ],
  'message-box-basic',
  '确认和取消按钮的内容与样式',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.confirm('继续？', {
        cancelButtonText: '返回',
        confirmButtonText: '执行',
        cancelButtonType: 'danger',
        confirmButtonType: 'success',
        cancelButtonClass: 'cancel-custom',
        confirmButtonClass: 'confirm-custom',
        buttonSize: 'small',
        roundButton: true,
      });
    });
    expect(screen.getByRole('button', { name: '返回' })).toHaveClass(
      'cancel-custom',
      'el-button--danger',
      'el-button--small',
      'is-round',
    );
    expect(screen.getByRole('button', { name: '执行' })).toHaveClass('confirm-custom', 'el-button--success');
    fireEvent.click(screen.getByRole('button', { name: '执行' }));
    await result;
  },
);
apiTest(
  'message-box',
  'Options',
  ['callback', 'distinguishCancelAndClose'],
  'message-box-basic',
  '关闭与取消可区分且回调和Promise一致',
  async () => {
    const callback = vi.fn();
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.confirm('消息', { distinguishCancelAndClose: true, callback });
    });
    const observed = result.catch((action) => action);
    fireEvent.click(screen.getByRole('button', { name: 'Close message box' }));
    expect(await observed).toBe('close');
    expect(callback).toHaveBeenCalledExactlyOnceWith('close');
    act(() => {
      result = MessageBox.confirm('消息', { distinguishCancelAndClose: true });
    });
    const cancelled = result.catch((action) => action);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await cancelled).toBe('cancel');
  },
);
apiTest(
  'message-box',
  'Options',
  ['showInput', 'inputPlaceholder', 'inputType', 'inputValue', 'inputPattern', 'inputErrorMessage'],
  'message-box-basic',
  '输入默认值、类型、模式校验和确认结果',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.prompt('名称', {
        inputPlaceholder: '输入名称',
        inputType: 'email',
        inputValue: 'invalid',
        inputPattern: /@/,
        inputErrorMessage: '需要邮箱',
      });
    });
    const input = screen.getByRole('textbox', { name: '输入名称' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveValue('invalid');
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByRole('alert')).toHaveTextContent('需要邮箱');
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: 'a@example.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await expect(result).resolves.toEqual({ value: 'a@example.com', action: 'confirm' });
  },
);
apiTest(
  'message-box',
  'Options',
  ['inputValidator'],
  'message-box-basic',
  '自定义输入校验消息与false结果',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.prompt('名称', {
        inputValidator: (value) => (value.length < 3 ? '至少三字' : value === 'bad' ? false : true),
        inputErrorMessage: '不允许',
      });
    });
    const input = screen.getByRole('textbox');
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByRole('alert')).toHaveTextContent('至少三字');
    fireEvent.change(input, { target: { value: 'bad' } });
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByRole('alert')).toHaveTextContent('不允许');
    fireEvent.change(input, { target: { value: 'valid' } });
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await result;
  },
);
apiTest(
  'message-box',
  'Options',
  ['beforeClose', 'confirmButtonLoadingIcon'],
  'message-box-basic',
  '异步关闭拦截可更新按钮实例且done只生效一次',
  async () => {
    let result!: Promise<MessageBoxResult>, finish!: () => void, state!: MessageBoxState;
    const callback = vi.fn();
    act(() => {
      result = MessageBox({
        message: '异步',
        confirmButtonLoadingIcon: <span>加载图标</span>,
        callback,
        beforeClose: (action, instance, done) => {
          expect(action).toBe('confirm');
          state = instance;
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '处理中';
          finish = done;
        },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByRole('button', { name: /处理中/ })).toBeDisabled();
    expect(screen.getByText('加载图标')).toBeInTheDocument();
    act(() => {
      state.confirmButtonLoading = false;
      finish();
      finish();
    });
    await expect(result).resolves.toBe('confirm');
    expect(callback).toHaveBeenCalledOnce();
  },
);
apiTest(
  'message-box',
  'Options',
  ['cancelButtonLoadingIcon'],
  'message-box-basic',
  '取消拦截可以单独控制加载图标',
  async () => {
    let result!: Promise<MessageBoxResult>, finish!: () => void;
    act(() => {
      result = MessageBox.confirm('异步取消', {
        cancelButtonLoadingIcon: <span>取消加载</span>,
        beforeClose: (_action, instance, done) => {
          instance.cancelButtonLoading = true;
          finish = done;
        },
      });
    });
    const observed = result.catch((action) => action);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeDisabled();
    expect(screen.getByText('取消加载')).toBeInTheDocument();
    act(() => finish());
    expect(await observed).toBe('cancel');
  },
);
apiTest(
  'message-box',
  'Options',
  ['closeOnClickModal', 'closeOnPressEscape', 'lockScroll'],
  'message-box-basic',
  '遮罩与Escape关闭及滚动锁释放',
  async () => {
    const previous = document.body.style.overflow;
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.confirm('消息', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        lockScroll: true,
      });
    });
    const observed = result.catch((action) => action);
    expect(document.body.style.overflow).toBe('hidden');
    const mask = document.querySelector('.el-overlay-message-box')!;
    fireEvent.mouseDown(mask);
    fireEvent.click(mask);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await observed;
    expect(document.body.style.overflow).toBe(previous);
    act(() => {
      result = MessageBox.confirm('消息');
    });
    const escaped = result.catch((action) => action);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(await escaped).toBe('cancel');
  },
);
apiTest(
  'message-box',
  'Options',
  ['closeOnHashChange'],
  'message-box-basic',
  '路由hash变化可关闭提示框',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.confirm('消息');
    });
    const observed = result.catch((action) => action);
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(await observed).toBe('cancel');
  },
);
apiTest(
  'message-box',
  'Options',
  ['modal', 'appendTo'],
  'message-box-basic',
  '无模态背景和指定容器挂载',
  async () => {
    const target = document.createElement('div');
    document.body.append(target);
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox({ message: '挂载', modal: false, appendTo: target, lockScroll: false });
    });
    const box = screen.getByRole('dialog');
    expect(target).toContainElement(box);
    expect(box).toHaveAttribute('aria-modal', 'false');
    expect(target.querySelector('.el-overlay')).toHaveStyle({ 'background-color': 'rgba(0, 0, 0, 0)' });
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await result;
    expect(target).toBeEmptyDOMElement();
    target.remove();
  },
);
apiTest(
  'message-box',
  'Options',
  ['autofocus'],
  'message-box-basic',
  '自动聚焦可以关闭且自定义命名空间仍正确',
  async () => {
    /** Hook服务继承当前全局命名空间。 */
    function Example() {
      const box = useMessageBox();
      return (
        <Button
          onClick={() => {
            void box.confirm('消息').catch(() => {});
          }}
        >
          打开
        </Button>
      );
    }
    render(
      <ConfigProvider namespace="custom">
        <Example />
      </ConfigProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '打开' }));
    expect(document.querySelector('.custom-message-box__btns button:last-child')).toHaveFocus();
    act(() => MessageBox.close());
    let result!: Promise<MessageBoxResult>;
    const opener = screen.getByRole('button', { name: '打开' });
    opener.focus();
    act(() => {
      result = MessageBox({ message: '无自动焦点', autoFocus: false });
    });
    expect(opener).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await result;
  },
);
apiTest(
  'message-box',
  'Options',
  ['draggable', 'overflow'],
  'message-box-basic',
  '标题拖动可越界且卸载释放监听',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox({ title: '拖动', message: '内容', draggable: true, overflow: true });
    });
    const box = screen.getByRole('dialog');
    fireEvent.mouseDown(box.querySelector('.el-message-box__header')!, { clientX: 10, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 70 });
    expect(box).toHaveStyle({ transform: 'translate(30px,50px)' });
    fireEvent.mouseUp(document);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await result;
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    expect(screen.queryByRole('dialog')).toBeNull();
  },
);
featureTest(
  'message-box',
  'same-mask-target',
  'message-box-basic',
  '内容按下后释放在遮罩不触发关闭',
  async () => {
    let result!: Promise<MessageBoxResult>;
    act(() => {
      result = MessageBox.confirm('消息');
    });
    fireEvent.mouseDown(screen.getByRole('dialog'));
    fireEvent.click(document.querySelector('.el-overlay-message-box')!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    await result;
  },
);
