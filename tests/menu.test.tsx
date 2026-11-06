import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { expect, vi } from 'vitest';
import { Menu, MenuItem, MenuItemGroup, SubMenu } from '../packages/element-react';
import type { MenuHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

apiTest(
  'menu',
  'Menu Attributes',
  ['mode', 'default-active', 'default-openeds', 'unique-opened'],
  'menu-vertical',
  '默认激活与展开路径，单分支展开关闭另一分支',
  () => {
    render(
      <Menu defaultActive="b" defaultOpeneds={['first']} uniqueOpened>
        <SubMenu index="first" renderTitle="First">
          <MenuItem index="b">B</MenuItem>
        </SubMenu>
        <SubMenu index="second" renderTitle="Second">
          <MenuItem index="c">C</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(screen.getByRole('menuitem', { name: 'B' })).toHaveClass('is-active');
    expect(screen.getByRole('menuitem', { name: /First/ }).closest('li')).toHaveClass('is-active');
    fireEvent.click(screen.getByRole('menuitem', { name: /Second/ }));
    expect(screen.queryByRole('menuitem', { name: 'B' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'C' })).toBeInTheDocument();
  },
);
apiTest(
  'menu',
  'Menu Events',
  ['select', 'open', 'close'],
  'menu-vertical',
  '选择和展开关闭事件包含完整索引路径',
  () => {
    const select = vi.fn(),
      open = vi.fn(),
      close = vi.fn();
    render(
      <Menu onSelect={select} onOpen={open} onClose={close}>
        <SubMenu index="parent" renderTitle="Parent">
          <SubMenu index="nested" renderTitle="Nested">
            <MenuItem index="leaf">Leaf</MenuItem>
          </SubMenu>
        </SubMenu>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: /Parent/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: /Nested/ }));
    expect(open).toHaveBeenLastCalledWith('nested', ['parent', 'nested']);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Leaf' }));
    expect(select).toHaveBeenCalledWith(
      'leaf',
      ['parent', 'nested', 'leaf'],
      expect.objectContaining({ index: 'leaf' }),
      undefined,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: /Parent/ }));
    expect(close).toHaveBeenCalledWith('parent', ['parent']);
    expect(screen.queryByText('Leaf')).toBeNull();
  },
);
apiTest(
  'menu',
  'Menu Attributes',
  ['collapse', 'collapse-transition', 'background-color', 'text-color', 'active-text-color'],
  'menu-collapse',
  '折叠及颜色使用来源类名和命名空间变量',
  () => {
    const view = render(
      <Menu
        collapse
        collapseTransition={false}
        backgroundColor="#111"
        textColor="#eee"
        activeTextColor="#ff0000"
      >
        <MenuItem index="x">X</MenuItem>
      </Menu>,
    );
    expect(view.container.firstChild).toHaveClass('el-menu--collapse');
    expect(view.container.firstChild).not.toHaveClass('el-menu--collapse-transition');
    expect(view.container.firstChild).toHaveStyle('--el-menu-bg-color: #111');
    expect(view.container.firstChild).toHaveStyle('--el-menu-text-color: #eee');
  },
);
apiTest(
  'menu',
  'Menu Attributes',
  [
    'menu-trigger',
    'popper-offset',
    'popper-effect',
    'popper-class',
    'popper-style',
    'show-timeout',
    'hide-timeout',
    'persistent',
  ],
  'menu-popper-offset',
  '横向点击子菜单浮层支持定制外观和销毁',
  async () => {
    render(
      <Menu
        mode="horizontal"
        menuTrigger="click"
        popperOffset={20}
        popperEffect="light"
        popperClass="menu-popup"
        popperStyle={{ color: 'red' }}
        showTimeout={0}
        hideTimeout={0}
        persistent={false}
      >
        <SubMenu index="parent" renderTitle="Parent">
          <MenuItem index="x">X</MenuItem>
        </SubMenu>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: /Parent/ }));
    expect(await screen.findByRole('menuitem', { name: 'X' })).toBeInTheDocument();
    expect(document.querySelector('.menu-popup')).toHaveClass('is-light');
    expect(document.querySelector('.menu-popup')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    fireEvent.click(screen.getByRole('menuitem', { name: /Parent/ }));
    await waitFor(() => expect(document.querySelector('.menu-popup')).toBeNull());
  },
);
apiTest(
  'menu',
  'Menu Attributes',
  ['close-on-click-outside'],
  'menu-basic',
  '点击菜单外区域关闭内联子菜单',
  () => {
    render(
      <>
        <button>Outside</button>
        <Menu defaultOpeneds={['parent']} closeOnClickOutside>
          <SubMenu index="parent" renderTitle="Parent">
            <MenuItem index="x">X</MenuItem>
          </SubMenu>
        </Menu>
      </>,
    );
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menuitem', { name: 'X' })).toBeNull();
  },
);
apiTest(
  'menu',
  'Menu Attributes',
  ['router'],
  'menu-basic',
  'React宿主路由适配器接收路由目标且结果随选择事件回传',
  () => {
    const navigate = vi.fn(() => 'navigated'),
      select = vi.fn();
    render(
      <Menu router navigate={navigate} onSelect={select}>
        <MenuItem index="settings" route="/settings">
          Settings
        </MenuItem>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(navigate).toHaveBeenCalledWith('/settings');
    expect(select).toHaveBeenCalledWith(
      'settings',
      ['settings'],
      expect.objectContaining({ route: '/settings' }),
      'navigated',
    );
  },
);
apiTest(
  'menu',
  'Menu Exposes',
  ['open', 'close', 'handleResize', 'updateActiveIndex'],
  'menu-vertical',
  '实例方法展开指定路径并更新当前活动项',
  () => {
    const ref = createRef<MenuHandle>();
    render(
      <Menu ref={ref}>
        <SubMenu index="parent" renderTitle="Parent">
          <MenuItem index="leaf">Leaf</MenuItem>
        </SubMenu>
      </Menu>,
    );
    act(() => ref.current?.open('parent'));
    expect(screen.getByRole('menuitem', { name: 'Leaf' })).toBeInTheDocument();
    act(() => ref.current?.updateActiveIndex('leaf'));
    expect(screen.getByRole('menuitem', { name: 'Leaf' })).toHaveClass('is-active');
    act(() => ref.current?.handleResize());
    act(() => ref.current?.close('parent'));
    expect(screen.queryByRole('menuitem', { name: 'Leaf' })).toBeNull();
  },
);
apiTest(
  'menu',
  'Menu-Item Attributes',
  ['index', 'route', 'disabled'],
  'menu-basic',
  '禁用项不触发选择或点击通知',
  () => {
    const select = vi.fn(),
      click = vi.fn();
    render(
      <Menu onSelect={select}>
        <MenuItem index="disabled" disabled onClick={click}>
          Disabled
        </MenuItem>
      </Menu>,
    );
    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(select).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
  },
);
apiTest('menu', 'Menu-Item Events', ['click'], 'menu-basic', '菜单项点击事件携带活动状态和索引', () => {
  const click = vi.fn();
  render(
    <Menu>
      <MenuItem index="x" onClick={click}>
        X
      </MenuItem>
    </Menu>,
  );
  fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'Enter' });
  expect(click).toHaveBeenCalledWith(
    expect.objectContaining({ index: 'x', indexPath: ['x'], active: false }),
  );
});
apiTest(
  'menu',
  'SubMenu Attributes',
  [
    'index',
    'disabled',
    'teleported',
    'popper-class',
    'popper-style',
    'popper-offset',
    'show-timeout',
    'hide-timeout',
  ],
  'menu-popper-offset',
  '子菜单可覆盖浮层设置，禁用子菜单不展开',
  async () => {
    render(
      <Menu mode="horizontal" menuTrigger="click">
        <SubMenu
          index="x"
          renderTitle="Popup"
          teleported={false}
          popperClass="local-popup"
          popperStyle={{ color: 'blue' }}
          popperOffset={30}
          showTimeout={0}
          hideTimeout={0}
        >
          <MenuItem index="leaf">Leaf</MenuItem>
        </SubMenu>
        <SubMenu index="disabled" renderTitle="Disabled" disabled>
          <MenuItem index="never">Never</MenuItem>
        </SubMenu>
      </Menu>,
    );
    fireEvent.click(screen.getByRole('menuitem', { name: /Popup/ }));
    await screen.findByRole('menuitem', { name: 'Leaf' });
    expect(document.querySelector('.local-popup')?.closest('.el-sub-menu')).not.toBeNull();
    fireEvent.click(screen.getByRole('menuitem', { name: /Disabled/ }));
    expect(screen.queryByRole('menuitem', { name: 'Never' })).toBeNull();
  },
);
apiTest(
  'menu',
  'SubMenu Attributes',
  ['expand-close-icon', 'expand-open-icon', 'collapse-close-icon', 'collapse-open-icon'],
  'menu-collapse',
  '展开折叠状态使用完整自定义图标对',
  () => {
    const view = render(
      <Menu>
        <SubMenu index="x" renderTitle="X" expandCloseIcon="Closed" expandOpenIcon="Opened">
          <MenuItem index="leaf">Leaf</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(screen.getByText('Closed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: /X/ }));
    expect(screen.getByText('Opened')).toBeInTheDocument();
    view.rerender(
      <Menu collapse>
        <SubMenu
          index="x"
          renderTitle="X"
          collapseCloseIcon="Collapsed closed"
          collapseOpenIcon="Collapsed opened"
        >
          <MenuItem index="leaf">Leaf</MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(screen.getByText('Collapsed opened')).toBeInTheDocument();
  },
);
apiTest(
  'menu',
  'Menu-Item-Group Attributes',
  ['title'],
  'menu-vertical',
  '组标题提供语义分组并支持覆盖内容',
  () => {
    render(
      <Menu>
        <MenuItemGroup title="Default" renderTitle={<b>Custom title</b>}>
          <MenuItem index="a">A</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    expect(screen.getByText('Custom title').tagName).toBe('B');
    expect(screen.queryByText('Default')).toBeNull();
  },
);
featureTest(
  'menu',
  'keyboard-navigation',
  'menu-vertical',
  '方向键循环跳过禁用项目，子菜单键盘展开聚焦后代',
  () => {
    render(
      <Menu>
        <MenuItem index="a">A</MenuItem>
        <MenuItem index="b" disabled>
          B
        </MenuItem>
        <SubMenu index="parent" renderTitle="Parent">
          <MenuItem index="leaf">Leaf</MenuItem>
        </SubMenu>
      </Menu>,
    );
    screen.getByRole('menuitem', { name: 'A' }).focus();
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'A' }), { key: 'ArrowDown' });
    const parent = screen.getByRole('menuitem', { name: /Parent/ });
    expect(parent).toHaveFocus();
    fireEvent.keyDown(parent, { key: 'ArrowRight' });
    expect(screen.getByRole('menuitem', { name: 'Leaf' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Leaf' }), { key: 'Escape' });
    expect(parent).toHaveFocus();
  },
);

apiTest('menu', 'Menu Slots', ['default'], 'menu-left-and-right', '顶栏后侧项目支持由调用方布局对齐', () => {
  render(
    <Menu mode="horizontal">
      <MenuItem index="left">Left</MenuItem>
      <MenuItem index="right" style={{ marginLeft: 'auto' }}>
        Right
      </MenuItem>
    </Menu>,
  );
  expect(screen.getByRole('menuitem', { name: 'Right' })).toHaveStyle({ marginLeft: 'auto' });
});
apiTest('menu', 'SubMenu Slots', ['default', 'title'], 'menu-basic', '子菜单保留标题与默认内容', () => {
  render(
    <Menu defaultOpeneds={['parent']}>
      <SubMenu index="parent" renderTitle={<b>Custom parent</b>}>
        <MenuItem index="leaf">Leaf</MenuItem>
      </SubMenu>
    </Menu>,
  );
  expect(screen.getByText('Custom parent').tagName).toBe('B');
  expect(screen.getByRole('menuitem', { name: 'Leaf' })).toBeInTheDocument();
});
apiTest(
  'menu',
  'Menu-Item Slots',
  ['default', 'title'],
  'menu-basic',
  '菜单项标题插槽可与图标内容组合',
  () => {
    render(
      <Menu>
        <MenuItem index="x" renderTitle={<b>Title</b>}>
          <i>Icon</i>
        </MenuItem>
      </Menu>,
    );
    expect(screen.getByText('Title').tagName).toBe('B');
    expect(screen.getByText('Icon').tagName).toBe('I');
  },
);
apiTest(
  'menu',
  'Menu-Item-Group Slots',
  ['default', 'title'],
  'menu-vertical',
  '分组内容与标题插槽独立',
  () => {
    render(
      <Menu>
        <MenuItemGroup renderTitle={<b>Group</b>}>
          <MenuItem index="x">X</MenuItem>
        </MenuItemGroup>
      </Menu>,
    );
    expect(screen.getByText('Group').tagName).toBe('B');
    expect(screen.getByRole('menuitem', { name: 'X' })).toBeInTheDocument();
  },
);
