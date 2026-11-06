import { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/virtual-trigger对应场景。 */
export default function Example() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div ref={setTarget} className="w-full border border-dashed border-gray-300 p-8">
        Right-click here
      </div>
      <Dropdown
        virtualTriggering
        virtualRef={target ?? undefined}
        trigger="contextmenu"
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
