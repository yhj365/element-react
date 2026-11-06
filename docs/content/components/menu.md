# Menu 菜单

选择菜单项，展开嵌套菜单，禁用项目不能激活。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 顶栏

选择菜单项，展开嵌套菜单，禁用项目不能激活。

```tsx
import { Menu, SubMenu, MenuItem, MenuItemGroup } from 'element-react';
/** 官方menu/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Menu mode="horizontal" defaultActive="home">
        <MenuItem index="home">Home</MenuItem>
        <SubMenu index="workspace" renderTitle="Workspace">
          <MenuItemGroup title="Projects">
            <MenuItem index="project">Project</MenuItem>
            <MenuItem index="disabled" disabled>
              Disabled
            </MenuItem>
          </MenuItemGroup>
          <SubMenu index="tools" renderTitle="Tools">
            <MenuItem index="settings">Settings</MenuItem>
          </SubMenu>
        </SubMenu>
        <MenuItem index="help">Help</MenuItem>
      </Menu>
    </div>
  );
}
```

### 左右布局

选择菜单项，展开嵌套菜单，禁用项目不能激活。

```tsx
import { Menu, SubMenu, MenuItem, MenuItemGroup } from 'element-react';
/** 官方menu/left-and-right对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Menu mode="horizontal" defaultActive="home">
        <MenuItem index="home">Home</MenuItem>
        <SubMenu index="workspace" renderTitle="Workspace">
          <MenuItemGroup title="Projects">
            <MenuItem index="project">Project</MenuItem>
            <MenuItem index="disabled" disabled>
              Disabled
            </MenuItem>
          </MenuItemGroup>
          <SubMenu index="tools" renderTitle="Tools">
            <MenuItem index="settings">Settings</MenuItem>
          </SubMenu>
        </SubMenu>
        <MenuItem index="help" style={{ marginLeft: 'auto' }}>
          Help
        </MenuItem>
      </Menu>
    </div>
  );
}
```

### 侧栏

选择菜单项，展开嵌套菜单，禁用项目不能激活。

```tsx
import { Menu, SubMenu, MenuItem, MenuItemGroup } from 'element-react';
/** 官方menu/vertical对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Menu uniqueOpened defaultActive="home">
        <MenuItem index="home">Home</MenuItem>
        <SubMenu index="workspace" renderTitle="Workspace">
          <MenuItemGroup title="Projects">
            <MenuItem index="project">Project</MenuItem>
            <MenuItem index="disabled" disabled>
              Disabled
            </MenuItem>
          </MenuItemGroup>
          <SubMenu index="tools" renderTitle="Tools">
            <MenuItem index="settings">Settings</MenuItem>
          </SubMenu>
        </SubMenu>
        <MenuItem index="help">Help</MenuItem>
      </Menu>
    </div>
  );
}
```

### 折叠菜单

选择菜单项，展开嵌套菜单，禁用项目不能激活。

```tsx
import { useState } from 'react';
import { Menu, SubMenu, MenuItem, MenuItemGroup, Switch } from 'element-react';
/** 官方menu/collapse对应场景。 */
export default function Example() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="w-full">
      <Switch
        value={collapsed}
        onValueChange={(value) => setCollapsed(value === true)}
        aria-label="Collapse menu"
      />
      <Menu collapse={collapsed} defaultActive="home">
        <MenuItem index="home">Home</MenuItem>
        <SubMenu index="workspace" renderTitle="Workspace">
          <MenuItemGroup title="Projects">
            <MenuItem index="project">Project</MenuItem>
            <MenuItem index="disabled" disabled>
              Disabled
            </MenuItem>
          </MenuItemGroup>
          <SubMenu index="tools" renderTitle="Tools">
            <MenuItem index="settings">Settings</MenuItem>
          </SubMenu>
        </SubMenu>
        <MenuItem index="help">Help</MenuItem>
      </Menu>
    </div>
  );
}
```

### 浮层偏移

选择菜单项，展开嵌套菜单，禁用项目不能激活。

```tsx
import { Menu, SubMenu, MenuItem, MenuItemGroup } from 'element-react';
/** 官方menu/popper-offset对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Menu mode="horizontal" popperOffset={16} defaultActive="home">
        <MenuItem index="home">Home</MenuItem>
        <SubMenu index="workspace" renderTitle="Workspace">
          <MenuItemGroup title="Projects">
            <MenuItem index="project">Project</MenuItem>
            <MenuItem index="disabled" disabled>
              Disabled
            </MenuItem>
          </MenuItemGroup>
          <SubMenu index="tools" renderTitle="Tools">
            <MenuItem index="settings">Settings</MenuItem>
          </SubMenu>
        </SubMenu>
        <MenuItem index="help">Help</MenuItem>
      </Menu>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Menu Attributes | mode | mode | menu display mode | enum'horizontal' \| 'vertical' | vertical |
| Menu Attributes | collapse | collapse | whether the menu is collapsed (available only in vertical mode) | boolean | false |
| Menu Attributes | popper-offset | popperOffset | offset of the popper (effective for all submenus) | number | 6 |
| Menu Attributes | default-active | defaultActive | index of active menu on page load | string | '' |
| Menu Attributes | default-openeds | defaultOpeneds | array that contains indexes of currently active sub-menus | arraystring[] | [] |
| Menu Attributes | unique-opened | uniqueOpened | whether only one sub-menu can be active | boolean | false |
| Menu Attributes | menu-trigger | menuTrigger | how sub-menus are triggered, only works when `mode` is 'horizontal' | enum'hover' \| 'click' | hover |
| Menu Attributes | router | router | whether `vue-router` mode is activated. If true, index will be used as 'path' to activate the route action. Use with `default-active` to set the active item on load. | boolean | false |
| Menu Attributes | collapse-transition | collapseTransition | whether to enable the collapse transition | boolean | true |
| Menu Attributes | popper-effect | popperEffect | Tooltip theme, built-in theme: `dark` / `light` when menu is collapsed | enum'dark' \| 'light' / string | dark |
| Menu Attributes | close-on-click-outside | closeOnClickOutside | optional, whether menu is collapsed when clicking outside | boolean | false |
| Menu Attributes | popper-class | popperClass | custom class name for all popup menus and titles' tooltips | string | — |
| Menu Attributes | popper-style | popperStyle | custom style for all popup menus and titles' tooltips | string / object | — |
| Menu Attributes | show-timeout | showTimeout | control timeout for all menus before showing | number | 300 |
| Menu Attributes | hide-timeout | hideTimeout | control timeout for all menus before hiding | number | 300 |
| Menu Attributes | background-color | backgroundColor | background color of Menu (hex format) (use `--el-menu-bg-color` in a style class instead) | string | #ffffff |
| Menu Attributes | text-color | textColor | text color of Menu (hex format) ( use `--el-menu-text-color` in a style class instead) | string | #303133 |
| Menu Attributes | active-text-color | activeTextColor | text color of currently active menu item (hex format) ( use `--el-menu-active-color` in a style class instead) | string | #409eff |
| Menu Attributes | persistent | persistent | when menu inactive and `persistent` is `false` , dropdown menu will be destroyed | boolean | true |
| Menu Events | select | onSelect | callback function when menu is activated | FunctionMenuSelectEvent | — |
| Menu Events | open | onOpen | callback function when sub-menu expands | FunctionMenuOpenEvent | — |
| Menu Events | close | onClose | callback function when sub-menu collapses | FunctionMenuCloseEvent | — |
| Menu Slots | default | children | customize default content |  | — |
| Menu Exposes | open | ref.current.open | open a specific sub-menu, the param is index of the sub-menu to open | Function(index: string) => void | — |
| Menu Exposes | close | ref.current.close | close a specific sub-menu, the param is index of the sub-menu to close | Function(index: string) => void | — |
| Menu Exposes | handleResize | ref.current.handleResize | manually trigger menu width recalculation | Function() => void | — |
| Menu Exposes | updateActiveIndex | ref.current.updateActiveIndex | set index of active menu | Function(index: string) => void | — |
| SubMenu Attributes | index | index | unique identification | string | — |
| SubMenu Attributes | popper-class | popperClass | custom class name for the popup menu | string | — |
| SubMenu Attributes | popper-style | popperStyle | custom style for the popup menu | string / object | — |
| SubMenu Attributes | show-timeout | showTimeout | timeout before showing a sub-menu(inherit `show-timeout` of the menu by default.) | number | — |
| SubMenu Attributes | hide-timeout | hideTimeout | timeout before hiding a sub-menu(inherit `hide-timeout` of the menu by default.) | number | — |
| SubMenu Attributes | disabled | disabled | whether the sub-menu is disabled | boolean | false |
| SubMenu Attributes | teleported | teleported | whether popup menu is teleported to the body, the default is true for the level one SubMenu, false for other SubMenus | boolean | undefined |
| SubMenu Attributes | popper-offset | popperOffset | offset of the popper (overrides the `popper` of menu) | number | — |
| SubMenu Attributes | expand-close-icon | expandCloseIcon | Icon when menu are expanded and submenu are closed, `expand-close-icon` and `expand-open-icon` need to be passed together to take effect | string / Component | — |
| SubMenu Attributes | expand-open-icon | expandOpenIcon | Icon when menu are expanded and submenu are opened, `expand-open-icon` and `expand-close-icon` need to be passed together to take effect | string / Component | — |
| SubMenu Attributes | collapse-close-icon | collapseCloseIcon | Icon when menu are collapsed and submenu are closed, `collapse-close-icon` and `collapse-open-icon` need to be passed together to take effect | string / Component | — |
| SubMenu Attributes | collapse-open-icon | collapseOpenIcon | Icon when menu are collapsed and submenu are opened, `collapse-open-icon` and `collapse-close-icon` need to be passed together to take effect | string / Component | — |
| SubMenu Slots | default | children | customize default content |  | — |
| SubMenu Slots | title | renderTitle | customize title content |  | — |
| Menu-Item Attributes | index | index | unique identification | string | — |
| Menu-Item Attributes | route | route | Vue Router Route Location Parameters | string / object | — |
| Menu-Item Attributes | disabled | disabled | whether disabled | boolean | false |
| Menu-Item Events | click | onClick | callback function when menu-item is clicked, the param is menu-item instance | Function(item: MenuItemRegistered) => void | — |
| Menu-Item Slots | default | children | customize default content |  | — |
| Menu-Item Slots | title | renderTitle | customize title content |  | — |
| Menu-Item-Group Attributes | title | title | group title | string | — |
| Menu-Item-Group Slots | default | children | customize default content |  | — |
| Menu-Item-Group Slots | title | renderTitle | customize group title |  | — |

## 完成记录

- [x] menu:76 mode；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:77 collapse；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:80 popperOffset；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:81 defaultActive；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:82 defaultOpeneds；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:83 uniqueOpened；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:84 menuTrigger；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:85 router；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:86 collapseTransition；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:87 popperEffect；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:88 closeOnClickOutside；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:89 popperClass；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:90 popperStyle；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:91 showTimeout；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:92 hideTimeout；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:93 backgroundColor；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:94 textColor；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:95 activeTextColor；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:96 persistent；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:102 onSelect；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:103 onOpen；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:104 onClose；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:110 children；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:116 ref.current.open；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:117 ref.current.close；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:118 ref.current.handleResize；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:119 ref.current.updateActiveIndex；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:127 index；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:128 popperClass；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:129 popperStyle；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:130 showTimeout；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:131 hideTimeout；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:132 disabled；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:133 teleported；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:134 popperOffset；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:135 expandCloseIcon；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:136 expandOpenIcon；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:137 collapseCloseIcon；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:138 collapseOpenIcon；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:144 children；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:145 renderTitle；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:153 index；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:154 route；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:155 disabled；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:161 onClick；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:167 children；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:168 renderTitle；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:176 title；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:182 children；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
- [x] menu:183 renderTitle；实现：packages/components/menu/index.tsx；测试：tests/menu.test.tsx
