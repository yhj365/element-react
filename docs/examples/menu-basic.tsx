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
