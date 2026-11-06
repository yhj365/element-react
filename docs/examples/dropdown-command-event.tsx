import { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/command-event对应场景。 */
export default function Example() {
  const [result, setResult] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
        trigger="click"
        onCommand={(command) => setResult(String(command))}
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
      <p role="status">Selected: {result}</p>
    </div>
  );
}
