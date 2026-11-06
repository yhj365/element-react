# Dropdown 下拉菜单

展开菜单，选择命令或使用键盘导航。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

展开菜单，选择命令或使用键盘导航。

```tsx
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
```

### 弹出位置

展开菜单，选择命令或使用键盘导航。

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/placements对应场景。 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
        placement="bottom-start"
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
```

### 分割按钮

展开菜单，选择命令或使用键盘导航。

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/triggering-element对应场景。 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
        splitButton
        type="primary"
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
```

### 触发方式

展开菜单，选择命令或使用键盘导航。

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/how-to-trigger对应场景。 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
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
```

### 菜单隐藏方式

展开菜单，选择命令或使用键盘导航。

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/menu-hiding-behavior对应场景。 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
        trigger="click"
        hideOnClick={false}
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
```

### 指令事件

展开菜单，选择命令或使用键盘导航。

```tsx
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
```

### 手动展开和关闭

展开菜单，选择命令或使用键盘导航。

```tsx
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
```

### 尺寸

展开菜单，选择命令或使用键盘导航。

```tsx
import { Dropdown, DropdownMenu, DropdownItem } from 'element-react';
/** 官方dropdown/sizes对应场景。 */
export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Dropdown
        size="large"
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
```

### 虚拟触发

展开菜单，选择命令或使用键盘导航。

```tsx
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
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Dropdown Attributes | type | type | menu button type, refer to `Button` Component, only works when `split-button` is true | enum'' \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'text' (deprecated) | '' |
| Dropdown Attributes | size | size | menu size, also works on the split button | enum'' \| 'large' \| 'default' \| 'small' | '' |
| Dropdown Attributes | button-props | buttonProps | props for the button component, refer to [Button Attributes](./button.html#button-attributes) | object | — |
| Dropdown Attributes | max-height | maxHeight | the max height of menu | string / number | '' |
| Dropdown Attributes | split-button | splitButton | whether a button group is displayed | boolean | false |
| Dropdown Attributes | disabled | disabled | whether to disable | boolean | false |
| Dropdown Attributes | placement | placement | placement of pop menu | enum'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' | bottom |
| Dropdown Attributes | effect | effect | Tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| Dropdown Attributes | trigger | trigger | how to trigger | enum'click' \| 'hover' \| 'contextmenu' / arrayArray<'click' \| 'hover' \| 'contextmenu'> | hover |
| Dropdown Attributes | trigger-keys | triggerKeys | specify which keys on the keyboard can trigger when pressed | arraystring[] | `['Enter', 'Space', 'ArrowDown', 'NumpadEnter']` |
| Dropdown Attributes | virtual-triggering | virtualTriggering | indicates whether virtual triggering is enabled | boolean | — |
| Dropdown Attributes | virtual-ref | virtualRef | indicates the reference element to which the dropdown is attached | HTMLElement | — |
| Dropdown Attributes | hide-on-click | hideOnClick | whether to hide menu after clicking menu-item | boolean | true |
| Dropdown Attributes | show-arrow | showArrow | whether the tooltip content has an arrow | boolean | true |
| Dropdown Attributes | show-timeout | showTimeout | delay time before show a dropdown (only works when trigger is `hover`) | number | 150 |
| Dropdown Attributes | hide-timeout | hideTimeout | delay time before hide a dropdown (only works when trigger is `hover`) | number | 150 |
| Dropdown Attributes | role | role | the ARIA role attribute for the dropdown menu. Depending on the use case, you may want to change this to 'navigation' | enum'dialog' \| 'grid' \| 'group' \| 'listbox' \| 'menu' \| 'navigation' \| 'tooltip' \| 'tree' | menu |
| Dropdown Attributes | tabindex | tabIndex | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Dropdown | number / string | 0 |
| Dropdown Attributes | popper-class | popperClass | custom class name for Dropdown's dropdown | string / object | '' |
| Dropdown Attributes | popper-style | popperStyle | custom style for Dropdown's dropdown | string / object | — |
| Dropdown Attributes | teleported | teleported | whether the dropdown popup is teleported to the body | boolean | true |
| Dropdown Attributes | append-to | appendTo | which element the dropdown CONTENT appends to | CSSSelector / HTMLElement | — |
| Dropdown Attributes | persistent | persistent | when dropdown inactive and `persistent` is `false` , dropdown menu will be destroyed | boolean | true |
| Dropdown Slots | default | children | content of Dropdown. Notice: Must be a valid html dom element (ex. `<span>, <button> etc.`) or `el-component`, to attach the trigger listener |  | — |
| Dropdown Slots | dropdown | renderDropdown | content of the Dropdown Menu, usually a `<el-dropdown-menu>` element |  | — |
| Dropdown Events | click | onClick | if `split-button` is `true`, triggers when left button is clicked | Function(e: MouseEvent) => void | — |
| Dropdown Events | command | onCommand | triggers when a dropdown item is clicked, the parameters is the command dispatched from the dropdown item | Function(...args: any[]) => void | — |
| Dropdown Events | visible-change | onVisibleChange | triggers when the dropdown appears/disappears, the param is true when it appears, and false otherwise | Function(val: boolean) => void | — |
| Dropdown Exposes | handleOpen | ref.current.handleOpen | open the dropdown menu | Function() => void | — |
| Dropdown Exposes | handleClose | ref.current.handleClose | close the dropdown menu | Function() => void | — |
| Dropdown-Menu Slots | default | children | content of Dropdown Menu |  | — |
| Dropdown-Item Attributes | command | command | a command to be dispatched to Dropdown's `command` callback | string / number / object | — |
| Dropdown-Item Attributes | disabled | disabled | whether the item is disabled | boolean | false |
| Dropdown-Item Attributes | divided | divided | whether a divider is displayed | boolean | false |
| Dropdown-Item Attributes | icon | icon | custom icon | string / Component | — |
| Dropdown-Item Slots | default | children | customize of Dropdown Item |  | — |
| Dropdown-Item Slots | icon | renderIcon | custom icon, it will override the icon prop |  | — |

## 完成记录

- [x] dropdown:106 type；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:107 size；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:108 buttonProps；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:109 maxHeight；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:110 splitButton；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:111 disabled；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:112 placement；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:113 effect；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:114 trigger；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:115 triggerKeys；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:116 virtualTriggering；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:117 virtualRef；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:118 hideOnClick；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:119 showArrow；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:120 showTimeout；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:121 hideTimeout；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:122 role；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:123 tabIndex；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:124 popperClass；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:125 popperStyle；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:127 teleported；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:128 appendTo；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:129 persistent；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:135 children；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:136 renderDropdown；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:142 onClick；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:143 onCommand；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:144 onVisibleChange；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:150 ref.current.handleOpen；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:151 ref.current.handleClose；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:159 children；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:167 command；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:168 disabled；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:169 divided；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:170 icon；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:176 children；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
- [x] dropdown:177 renderIcon；实现：packages/components/dropdown/index.tsx；测试：tests/dropdown.test.tsx
