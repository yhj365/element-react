# Popover 弹出框

引用内容与丰富面板内容分离。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 弹出框

引用内容与丰富面板内容分离。

```tsx
import { Button, Popover } from 'element-react';
/** reference与弹出内容分离，面板可以容纳交互内容。 */
export default function Example() {
  return (
    <Popover
      trigger="click"
      title="项目说明"
      width={260}
      renderReference={<Button type="primary">打开弹出框</Button>}
    >
      <p>这里是更丰富的内容区域。</p>
      <Button size="small">操作</Button>
    </Popover>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | trigger | trigger | how the popover is triggered, not valid in controlled mode | enum'click' \| 'focus' \| 'hover' \| 'contextmenu' / arrayArray<'click' \| 'focus' \| 'hover' \| 'contextmenu'> | hover |
| Attributes | title | title | popover title | string | — |
| Attributes | effect | effect | Tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| Attributes | content | content | popover content, can be replaced with a default `slot` | string | '' |
| Attributes | width | width | popover width | string / number | 150 |
| Attributes | placement | placement | popover placement | enum'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end' | bottom |
| Attributes | disabled | disabled | whether Popover is disabled | boolean | false |
| Attributes | visible / v-model:visible | visible / defaultVisible / onVisibleChange | whether popover is visible | boolean / null | null |
| Attributes | show-arrow | showArrow | whether a tooltip arrow is displayed or not. For more info, please refer to [ElPopper](https://github.com/element-plus/element-plus/tree/dev/packages/components/popper) | boolean | true |
| Attributes | popper-class | popperClass | custom class name for popover | string | — |
| Attributes | popper-style | popperStyle | custom style for popover | string / object | — |
| Attributes | show-after | showAfter | delay of appearance, in millisecond, not valid in controlled mode | number | 0 |
| Attributes | hide-after | hideAfter | delay of disappear, in millisecond, not valid in controlled mode | number | 200 |
| Attributes | auto-close | autoClose | timeout in milliseconds to hide tooltip, not valid in controlled mode | number | 0 |
| Attributes | teleported | teleported | whether popover dropdown is teleported to the body | boolean | true |
| Attributes | append-to | appendTo | which element the popover CONTENT appends to | CSSSelector / HTMLElement | body |
| Attributes | persistent | persistent | when popover inactive and `persistent` is `false` , popover will be destroyed | boolean | true |
| Slots | default | children | content of popover, version ^(2.13.4) and later can receive the hide parameter. | object{hide: () => void} | — |
| Slots | reference | renderReference | HTML element that triggers popover, only a single root element is accepted | - | — |
| Events | show | onShow | triggers when popover shows | Function() => void | — |
| Events | before-enter | onBeforeEnter | triggers when the entering transition before | Function() => void | — |
| Events | after-enter | onAfterEnter | triggers when the entering transition ends | Function() => void | — |
| Events | hide | onHide | triggers when popover hides | Function() => void | — |
| Events | before-leave | onBeforeLeave | triggers when the leaving transition before | Function() => void | — |
| Events | after-leave | onAfterLeave | triggers when the leaving transition ends | Function() => void | — |
| Exposes | hide | ref.current.hide | hide popover | Function() => void | — |

## 完成记录

- [x] popover:81 trigger；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:83 title；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:84 effect；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:85 content；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:86 width；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:87 placement；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:88 disabled；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:89 visible / defaultVisible / onVisibleChange；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:92 showArrow；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:94 popperClass；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:95 popperStyle；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:96 showAfter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:97 hideAfter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:98 autoClose；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:100 teleported；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:101 appendTo；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:102 persistent；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:111 children；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:112 renderReference；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:118 onShow；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:119 onBeforeEnter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:120 onAfterEnter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:121 onHide；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:122 onBeforeLeave；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:123 onAfterLeave；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] popover:129 ref.current.hide；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
