import { useRef } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, Button } from 'element-react';
import type { DropdownHandle } from 'element-react';
/** 官方dropdown/dropdown-methods对应场景。 */
export default function Example() {
  const dropdown = useRef<DropdownHandle>(null);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button onClick={() => dropdown.current?.handleOpen()}>Open</Button>
      <Button onClick={() => dropdown.current?.handleClose()}>Close</Button>
      <Dropdown
        ref={dropdown}
        trigger="click"
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
