import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { Dropdown, DropdownItem, DropdownMenu } from '../packages/element-react';
import type { DropdownHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

const choices = (
  <DropdownMenu>
    <DropdownItem command="edit">Edit</DropdownItem>
    <DropdownItem command="skip" disabled>
      Disabled
    </DropdownItem>
    <DropdownItem command={{ action: 'copy' }} divided icon={<b>Copy icon</b>}>
      Copy
    </DropdownItem>
  </DropdownMenu>
);

/** 单击普通触发器并等待浮层定位。 */
async function open(): Promise<void> {
  fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
  await screen.findByRole('menuitem', { name: 'Edit' });
}

apiTest(
  'dropdown',
  'Dropdown Attributes',
  ['trigger', 'disabled', 'hide-on-click'],
  'dropdown-menu-hiding-behavior',
  '点击触发及选择后保留菜单，禁用状态不打开',
  async () => {
    const command = vi.fn();
    const view = render(
      <Dropdown trigger="click" hideOnClick={false} onCommand={command} renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    await open();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(command).toHaveBeenCalledWith('edit');
    expect(screen.getByRole('menu')).toBeVisible();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Disabled' }));
    expect(command).toHaveBeenCalledTimes(1);
    view.rerender(
      <Dropdown disabled trigger="click" renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('menu')).toBeNull();
  },
);
apiTest(
  'dropdown',
  'Dropdown Events',
  ['command', 'visible-change'],
  'dropdown-command-event',
  '命令事件保留对象身份并在点击后关闭',
  async () => {
    const command = vi.fn(),
      visible = vi.fn();
    render(
      <Dropdown trigger="click" onCommand={command} onVisibleChange={visible} renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    await open();
    expect(visible).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy icon Copy' }));
    expect(command).toHaveBeenCalledWith({ action: 'copy' });
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(visible).toHaveBeenLastCalledWith(false);
  },
);
apiTest(
  'dropdown',
  'Dropdown Attributes',
  ['type', 'size', 'button-props', 'split-button'],
  'dropdown-triggering-element',
  '分割按钮左侧独立点击，右侧展开命令菜单',
  async () => {
    const click = vi.fn();
    render(
      <Dropdown
        splitButton
        trigger="click"
        type="primary"
        size="large"
        buttonProps={{ round: true }}
        onClick={click}
        renderDropdown={choices}
      >
        Actions
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'el-button--primary',
      'el-button--large',
      'is-round',
    );
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open dropdown' }));
    await screen.findByRole('menuitem', { name: 'Edit' });
  },
);
apiTest(
  'dropdown',
  'Dropdown Events',
  ['click'],
  'dropdown-triggering-element',
  '分割按钮点击回调传递鼠标事件',
  () => {
    const click = vi.fn();
    render(
      <Dropdown splitButton onClick={click}>
        Actions
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(click.mock.calls[0][0].type).toBe('click');
  },
);
apiTest(
  'dropdown',
  'Dropdown Attributes',
  [
    'placement',
    'effect',
    'max-height',
    'show-arrow',
    'popper-class',
    'popper-style',
    'teleported',
    'append-to',
    'persistent',
  ],
  'dropdown-placements',
  '菜单外观滚动高度挂载和关闭销毁',
  async () => {
    const target = document.createElement('div');
    document.body.append(target);
    const view = render(
      <Dropdown
        trigger="click"
        placement="top-start"
        effect="dark"
        maxHeight={100}
        showArrow={false}
        popperClass="custom-dropdown"
        popperStyle={{ color: 'red' }}
        appendTo={target}
        persistent={false}
        renderDropdown={choices}
      >
        Actions
      </Dropdown>,
    );
    await open();
    expect(target.querySelector('.custom-dropdown')).toHaveClass('is-dark');
    expect(target.querySelector('.custom-dropdown')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(screen.getByRole('menu')).toHaveStyle({ maxHeight: '100px', overflowY: 'auto' });
    expect(target.querySelector('.el-popper__arrow')).toBeNull();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    await waitFor(() => expect(target.querySelector('.custom-dropdown')).toBeNull());
    view.rerender(
      <Dropdown trigger="click" teleported={false} renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    await open();
    expect(view.container.querySelector('.el-dropdown__popper')).not.toBeNull();
    view.unmount();
    target.remove();
  },
);
apiTest(
  'dropdown',
  'Dropdown Attributes',
  ['show-timeout', 'hide-timeout'],
  'dropdown-basic-usage',
  '悬停显示隐藏延时在卸载时释放',
  async () => {
    vi.useFakeTimers();
    const visible = vi.fn();
    const view = render(
      <Dropdown showTimeout={100} hideTimeout={200} onVisibleChange={visible} renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    const trigger = view.container.querySelector('.el-tooltip__trigger')!;
    fireEvent.mouseEnter(trigger);
    await act(async () => vi.advanceTimersByTime(99));
    expect(visible).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(visible).toHaveBeenCalledWith(true);
    fireEvent.mouseLeave(trigger);
    await act(async () => vi.advanceTimersByTime(199));
    expect(visible).toHaveBeenLastCalledWith(true);
    view.unmount();
    await act(async () => vi.advanceTimersByTime(1000));
    expect(visible).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  },
);
apiTest(
  'dropdown',
  'Dropdown Attributes',
  ['trigger-keys', 'tabindex', 'role'],
  'dropdown-how-to-trigger',
  '自定义键盘触发与菜单角色',
  async () => {
    render(
      <Dropdown trigger="click" triggerKeys={['F4']} tabIndex={2} role="navigation" renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('tabindex', '2');
    fireEvent.keyDown(trigger, { key: 'F4' });
    expect(await screen.findByRole('navigation')).toBeInTheDocument();
  },
);
apiTest(
  'dropdown',
  'Dropdown Exposes',
  ['handleOpen', 'handleClose'],
  'dropdown-dropdown-methods',
  '实例方法控制下拉展开关闭',
  async () => {
    const ref = createRef<DropdownHandle>();
    render(
      <Dropdown ref={ref} trigger="click" renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    act(() => ref.current?.handleOpen());
    await screen.findByRole('menuitem', { name: 'Edit' });
    act(() => ref.current?.handleClose());
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
);
apiTest(
  'dropdown',
  'Dropdown Attributes',
  ['virtual-triggering', 'virtual-ref'],
  'dropdown-virtual-trigger',
  '外部虚拟节点右键展开菜单且卸载解除监听',
  async () => {
    const target = document.createElement('button');
    document.body.append(target);
    const view = render(
      <Dropdown virtualTriggering virtualRef={target} trigger="contextmenu" renderDropdown={choices} />,
    );
    fireEvent.contextMenu(target);
    await screen.findByRole('menuitem', { name: 'Edit' });
    view.unmount();
    fireEvent.contextMenu(target);
    expect(screen.queryByRole('menu')).toBeNull();
    target.remove();
  },
);
apiTest(
  'dropdown',
  'Dropdown-Item Attributes',
  ['command', 'disabled', 'divided', 'icon'],
  'dropdown-basic-usage',
  '菜单项分隔图标和禁用样式',
  async () => {
    render(
      <Dropdown trigger="click" renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    await open();
    expect(screen.getByRole('menuitem', { name: 'Copy icon Copy' })).toHaveClass(
      'el-dropdown-menu__item--divided',
    );
    expect(screen.getByRole('menuitem', { name: 'Disabled' })).toHaveClass('is-disabled');
  },
);
featureTest(
  'dropdown',
  'keyboard-focus',
  'dropdown-how-to-trigger',
  '键盘打开聚焦首项、方向键跳过禁用项目、Escape恢复触发焦点',
  async () => {
    render(
      <Dropdown trigger="click" renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Edit' }), { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: 'Copy icon Copy' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Copy icon Copy' }), { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
);

apiTest(
  'dropdown',
  'Dropdown Slots',
  ['default', 'dropdown'],
  'dropdown-sizes',
  '菜单尺寸传递到浮层菜单',
  async () => {
    render(
      <Dropdown
        trigger="click"
        size="small"
        renderDropdown={
          <DropdownMenu>
            <DropdownItem>Item</DropdownItem>
          </DropdownMenu>
        }
      >
        Actions
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('menu')).toHaveClass('el-dropdown-menu--small');
  },
);
apiTest(
  'dropdown',
  'Dropdown-Menu Slots',
  ['default'],
  'dropdown-basic-usage',
  '默认菜单内容保留多个命令项',
  async () => {
    render(
      <Dropdown trigger="click" renderDropdown={choices}>
        Actions
      </Dropdown>,
    );
    await open();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  },
);
apiTest(
  'dropdown',
  'Dropdown-Item Slots',
  ['default', 'icon'],
  'dropdown-basic-usage',
  '菜单项图标插槽覆盖图标属性',
  async () => {
    render(
      <Dropdown
        trigger="click"
        renderDropdown={
          <DropdownMenu>
            <DropdownItem icon="Original" renderIcon={<b>Override</b>}>
              Item
            </DropdownItem>
          </DropdownMenu>
        }
      >
        Actions
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menuitem');
    expect(screen.getByText('Override').tagName).toBe('B');
    expect(screen.queryByText('Original')).toBeNull();
  },
);
