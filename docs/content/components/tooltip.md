# Tooltip 文字提示

位置、主题和多种触发方式。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 文字提示

位置、主题和多种触发方式。

```tsx
import { Button, Tooltip, Space } from 'element-react';
/** 可选择位置、主题和触发方式的文本提示。 */
export default function Example() {
  return (
    <Space>
      <Tooltip content="提示内容" placement="top">
        <Button>悬停查看</Button>
      </Tooltip>
      <Tooltip content="浅色提示" effect="light" trigger="click">
        <Button>点击提示</Button>
      </Tooltip>
      <Tooltip
        renderContent={
          <span>
            自定义 <b>内容</b>
          </span>
        }
        trigger="focus"
      >
        <Button>聚焦提示</Button>
      </Tooltip>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | append-to | appendTo | Which element the tooltip CONTENT appends to | CSSSelector / HTMLElement | — |
| Attributes | effect | effect | Tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' | dark |
| Attributes | content | content | Display content, can be overridden by `slot#content` | string | '' |
| Attributes | raw-content | rawContent | Whether `content` is treated as HTML string | boolean | false |
| Attributes | placement | placement | Position of Tooltip | enum'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end' | bottom |
| Attributes | fallback-placements | fallbackPlacements | List of possible positions for Tooltip [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | arrayPlacement[] | — |
| Attributes | visible / v-model:visible | visible / defaultVisible / onVisibleChange | Visibility of Tooltip | boolean | — |
| Attributes | disabled | disabled | Whether Tooltip is disabled | boolean | — |
| Attributes | offset | offset | Offset of the Tooltip | number | 12 |
| Attributes | show-after | showAfter | Delay of appearance, in millisecond, not valid in controlled mode | number | 0 |
| Attributes | show-arrow | showArrow | Whether the tooltip content has an arrow | boolean | true |
| Attributes | hide-after | hideAfter | Delay of disappear, in millisecond, not valid in controlled mode | number | 200 |
| Attributes | auto-close | autoClose | Timeout in milliseconds to hide tooltip, not valid in controlled mode | number | 0 |
| Attributes | popper-class | popperClass | Custom class name for Tooltip's popper | string | — |
| Attributes | popper-style | popperStyle | Custom style for Tooltip's popper | string / object | — |
| Attributes | enterable | enterable | Whether the mouse can enter the tooltip | boolean | true |
| Attributes | teleported | teleported | Whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets | boolean | true |
| Attributes | trigger | trigger | How should the tooltip be triggered (to show), not valid in controlled mode | enum'hover' \| 'click' \| 'focus' \| 'contextmenu' / arrayArray<'click' \| 'focus' \| 'hover' \| 'contextmenu'> | hover |
| Attributes | virtual-triggering | virtualTriggering | Indicates whether virtual triggering is enabled | boolean | — |
| Attributes | virtual-ref | virtualRef | Indicates the reference element to which the tooltip is attached | HTMLElement | — |
| Attributes | trigger-keys | triggerKeys | When you click the mouse to focus on the trigger element, you can define a set of keyboard codes to control the display of tooltip through the keyboard, not valid in controlled mode | Array | ['Enter','Space'] |
| Attributes | persistent | persistent | When tooltip inactive and `persistent` is `false` , tooltip will be destroyed | boolean | — |
| Attributes | aria-label | ariaLabel | Same as `aria-label` | string | — |
| Attributes | focus-on-target | focusOnTarget | When triggering tooltips through hover, whether to focus the trigger element, which improves accessibility | boolean | false |
| Events | before-show | onBeforeShow | Triggers before tooltip is shown. Passes trigger reason as argument. | Function(event?: Event) => void | — |
| Events | show | onShow | Triggers when tooltip is shown. Passes trigger reason as argument. | Function(event?: Event) => void | — |
| Events | before-hide | onBeforeHide | Triggers before tooltip is hidden. Passes trigger reason as argument. | Function(event?: Event) => void | — |
| Events | hide | onHide | Triggers when tooltip is hidden. Passes trigger reason as argument. | Function(event?: Event) => void | — |
| Slots | default | children | Tooltip triggering & reference element, only a single root element is accepted |  | — |
| Slots | content | renderContent | Customize content |  | — |
| Exposes | popperRef | ref.current.popperRef | el-popper component instance | objectRef<PopperInstance \| undefined> | — |
| Exposes | contentRef | ref.current.contentRef | el-tooltip-content component instance | objectRef<TooltipContentInstance \| undefined> | — |
| Exposes | isFocusInsideContent | ref.current.isFocusInsideContent | Validate current focus event is trigger inside el-tooltip-content | Function() => boolean \| undefined | — |
| Exposes | updatePopper | ref.current.updatePopper | Update el-popper component instance | Function() => void | — |
| Exposes | onOpen | ref.current.onOpen | Expose onOpen function to manage el-tooltip open state | Function(event?: Event \| undefined) => void | — |
| Exposes | onClose | ref.current.onClose | Expose onClose function to manage el-tooltip open state | Function(event?: Event \| undefined) => void | — |
| Exposes | hide | ref.current.hide | Expose hide function | Function(event?: Event \| undefined) => void | — |

## 完成记录

- [x] tooltip:165 appendTo；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:166 effect；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:167 content；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:168 rawContent；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:169 placement；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:170 fallbackPlacements；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:171 visible / defaultVisible / onVisibleChange；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:172 disabled；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:173 offset；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:177 showAfter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:178 showArrow；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:179 hideAfter；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:180 autoClose；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:181 popperClass；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:182 popperStyle；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:183 enterable；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:184 teleported；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:185 trigger；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:186 virtualTriggering；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:187 virtualRef；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:188 triggerKeys；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:189 persistent；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:190 ariaLabel；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:191 focusOnTarget；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:197 onBeforeShow；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:198 onShow；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:199 onBeforeHide；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:200 onHide；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:206 children；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:207 renderContent；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:213 ref.current.popperRef；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:214 ref.current.contentRef；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:215 ref.current.isFocusInsideContent；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:216 ref.current.updatePopper；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:217 ref.current.onOpen；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:218 ref.current.onClose；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
- [x] tooltip:219 ref.current.hide；实现：packages/components/tooltip/index.tsx；测试：tests/tooltip.test.tsx
