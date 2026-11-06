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
