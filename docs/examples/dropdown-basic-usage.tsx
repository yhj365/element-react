import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/basic-usage对应场景。 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
        renderDropdown={
          <DropdownMenu>
            <DropdownItem command="edit">Edit</DropdownItem>
            <DropdownItem command="copy" icon={<span>⧉</span>}>
              Copy
            </DropdownItem>
            <DropdownItem disabled>Unavailable</DropdownItem>
            <DropdownItem divided command="archive">
              Archive
            </DropdownItem>
          </DropdownMenu>
        }
      >
        Actions ⌄
      </Dropdown>
    </div>
  );
}
