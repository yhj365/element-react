# SelectV2 虚拟化选择器

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/basic-usage对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" />
    </div>
  );
}
```

### 多选

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/multiple对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" multiple />
    </div>
  );
}
```

### 尺寸

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/size对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" size="large" />
    </div>
  );
}
```

### 折叠标签

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/hide-extra-tags对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        multiple
        collapseTags
        collapseTagsTooltip
        maxCollapseTags={2}
        defaultValue={[0, 1, 2, 3]}
      />
    </div>
  );
}
```

### 可搜索

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/filterable对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" filterable />
    </div>
  );
}
```

### 禁用

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/disabled对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" disabled />
    </div>
  );
}
```

### 选项分组

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = [
  {
    label: 'Frontend',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vite', label: 'Vite' },
    ],
  },
  { label: 'Backend', options: [{ value: 'node', label: 'Node.js' }] },
];
/** 官方select-v2/grouping对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" />
    </div>
  );
}
```

### 可清空

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/clearable对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" clearable defaultValue={0} />
    </div>
  );
}
```

### 自定义选项

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/customized-option对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        renderOption={({ item, index }) => (
          <span>
            <b>{String(item.label)}</b> <small>#{index}</small>
          </span>
        )}
      />
    </div>
  );
}
```

### 自定义头部

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-header对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        renderHeader={<p className="p-2 font-semibold">Choose a technology</p>}
      />
    </div>
  );
}
```

### 自定义底部

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-footer对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        renderFooter={<p className="p-2 text-gray-500">Scroll for more options</p>}
      />
    </div>
  );
}
```

### 创建选项

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/allow-create对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        filterable
        allowCreate
        defaultFirstOption
      />
    </div>
  );
}
```

### 远程搜索

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options: { value: string; label: string }[] = [];
/** 官方select-v2/remote-search对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        filterable
        remote
        remoteMethod={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return [{ value: query, label: `Result: ${query}` }];
        }}
      />
    </div>
  );
}
```

### 对象值

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = [
  { value: { id: 1 }, label: 'React' },
  { value: { id: 2 }, label: 'TypeScript' },
];
/** 官方select-v2/use-valueKey对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" valueKey="id" />
    </div>
  );
}
```

### 字段映射

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = [
  { key: 0, title: 'React' },
  { key: 1, title: 'TypeScript' },
];
/** 官方select-v2/props对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        props={{ value: 'key', label: 'title' }}
      />
    </div>
  );
}
```

### 自定义标签

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-tag对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        multiple
        defaultValue={[0, 1]}
        renderTag={({ data }) => <strong>Selected: {data.map((item) => item.label).join(', ')}</strong>}
      />
    </div>
  );
}
```

### 自定义加载

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-loading对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        loading
        renderLoading={<span className="p-4">Loading choices…</span>}
      />
    </div>
  );
}
```

### 空值处理

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = [
  { value: '', label: 'Empty string is a value' },
  { value: 0, label: 'Zero' },
];
/** 官方select-v2/empty-values对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2<string | number>
        options={options}
        ariaLabel="Virtualized selection"
        clearable
        defaultValue={''}
        emptyValues={[null, undefined]}
        valueOnClear={null}
      />
    </div>
  );
}
```

### 自定义选中标签

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-label对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        defaultValue={0}
        renderLabel={({ label }) => <b>Selected {label}</b>}
      />
    </div>
  );
}
```

### 自定义宽度

滚动虚拟列表选择选项，按场景使用筛选、多选或自定义内容。

```tsx
import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-width对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        fitInputWidth={false}
        popperStyle={{ width: 320 }}
      />
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string / number / boolean / object / array | — |
| Attributes | options | options | data of the options, the key of `value` and `label` can be customize by `props` | array | — |
| Attributes | [props](#props) | props | configuration options, see the following table | object | — |
| Attributes | multiple | multiple | is multiple | boolean | false |
| Attributes | disabled | disabled | is disabled | boolean | false |
| Attributes | value-key | valueKey | unique identity key name for value, required when value is an object | string | value |
| Attributes | size | size | size of component | enum'' \| 'large' \| 'default' \| 'small' | '' |
| Attributes | clearable | clearable | whether select can be cleared | boolean | false |
| Attributes | clear-icon | clearIcon | custom clear icon | string / objectComponent | CircleClose |
| Attributes | collapse-tags | collapseTags | whether to collapse tags to a text when multiple selecting | boolean | false |
| Attributes | multiple-limit | multipleLimit | maximum number of options user can select when multiple is true. No limit when set to 0 | number | 0 |
| Attributes | id | id | native input id input | string | — |
| Attributes | name | name | the name attribute of select input | string | — |
| Attributes | effect | effect | tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| Attributes | autocomplete | autoComplete | autocomplete of select input | string | off |
| Attributes | placeholder | placeholder | placeholder | string | Please select |
| Attributes | filterable | filterable | whether Select is filterable | boolean | false |
| Attributes | allow-create | allowCreate | whether creating new items is allowed. To use this, `filterable` must be true | boolean | false |
| Attributes | filter-method | filterMethod | custom filter method, the first parameter is the current input value. To use this, `filterable` must be true method | Function(query: string) => void | — |
| Attributes | loading | loading | whether Select is loading data from server | boolean | false |
| Attributes | loading-text | loadingText | displayed text while loading data from server, default is 'Loading' | string | — |
| Attributes | reserve-keyword | reserveKeyword | whether reserve the keyword after select filtered option. | boolean | true |
| Attributes | default-first-option | defaultFirstOption | select first matching option on enter key. Use with `filterable` or `remote` | boolean | false |
| Attributes | no-match-text | noMatchText | displayed text when no data matches the filtering query, you can also use slot `empty`, default is 'No matching data' | string | — |
| Attributes | no-data-text | noDataText | displayed text when there is no options, you can also use slot empty | string | No Data |
| Attributes | popper-class | popperClass | custom class name for Select's dropdown and tags' tooltip | string / object | '' |
| Attributes | popper-style | popperStyle | custom style for Select's dropdown and tags' tooltip | string / object | — |
| Attributes | teleported | teleported | whether select dropdown is teleported, if `true` it will be teleported to where `append-to` sets | boolean | true |
| Attributes | append-to | appendTo | which element the select dropdown appends to | CSSSelector / HTMLElement | — |
| Attributes | persistent | persistent | when select dropdown is inactive and `persistent` is `false`, select dropdown will be destroyed | boolean | true |
| Attributes | automatic-dropdown | automaticDropdown | for non-filterable Select, this prop decides if the option menu pops up when the input is focused | boolean | false |
| Attributes | fit-input-width | fitInputWidth | whether the width of the dropdown is the same as the input, if the value is `number`, then the width is fixed | boolean / number | true |
| Attributes | suffix-icon | suffixIcon | custom suffix icon component | string / objectComponent | ArrowDown |
| Attributes | height | height | The height of the dropdown panel, 34px for each item | number | 274 |
| Attributes | item-height | itemHeight | The height of the dropdown item | number | 34 |
| Attributes | estimated-option-height | estimatedOptionHeight | Controls virtual-list sizing mode: if undefined, the list uses fixed item height from `item-height`; if provided, the list uses dynamic item sizing and this value as the estimated item height. | number | — |
| Attributes | scrollbar-always-on | scrollbarAlwaysOn | Controls whether the scrollbar is always displayed | boolean | false |
| Attributes | remote | remote | whether search data from server | boolean | false |
| Attributes | debounce | debounce | debounce delay during remote search, in milliseconds | number | 300 |
| Attributes | remote-method | remoteMethod | function that gets called when the input value changes. Its parameter is the current input value. To use this, `filterable` must be true | Function(query: string) => void | — |
| Attributes | remote-show-suffix | remoteShowSuffix | in remote search method show suffix icon | boolean | false |
| Attributes | validate-event | validateEvent | whether to trigger form validation | boolean | true |
| Attributes | offset | offset | offset of the dropdown | number | 12 |
| Attributes | show-arrow | showArrow | whether the dropdown has an arrow | boolean | true |
| Attributes | placement | placement | position of dropdown | enum'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end' | bottom-start |
| Attributes | fallback-placements | fallbackPlacements | list of possible positions for dropdown [popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | arrayPlacement[] | ['bottom-start', 'top-start', 'right', 'left'] |
| Attributes | collapse-tags-tooltip | collapseTagsTooltip | whether show all selected tags when mouse hover text of collapse-tags. To use this, `collapse-tags` must be true | boolean | false |
| Attributes | [tag-tooltip](#tag-tooltip) | tagTooltip | configuration object for the collapse-tags tooltip. To use this, `collapse-tags` and `collapse-tags-tooltip` must be true | objectTagTooltipProps | {} |
| Attributes | max-collapse-tags | maxCollapseTags | The max tags number to be shown. To use this, `collapse-tags` must be true | number | 1 |
| Attributes | tag-type | tagType | tag type | enum'' \| 'success' \| 'info' \| 'warning' \| 'danger' | info |
| Attributes | tag-effect | tagEffect | tag effect | enum'' \| 'light' \| 'dark' \| 'plain' | light |
| Attributes | aria-label | ariaLabel | same as `aria-label` in native input | string | — |
| Attributes | empty-values | emptyValues | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | array | — |
| Attributes | value-on-clear | valueOnClear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | string / number / boolean / Function | — |
| Attributes | tabindex | tabIndex | tabindex for input | string / number | — |
| props | value | value | specify which key of node object is used as the node's value | string | value |
| props | label | label | specify which key of node object is used as the node's label | string | label |
| props | options | options | specify which key of node object is used as the node's children | string | options |
| props | disabled | disabled | specify which key of node object is used as the node's disabled | string | disabled |
| Events | change | onChange | triggers when the selected value changes, the param is current selected value | Function(val: any) => void | — |
| Events | visible-change | onVisibleChange | triggers when the dropdown appears/disappears, the param will be true when it appears, and false otherwise | Function(visible: boolean) => void | — |
| Events | remove-tag | onRemoveTag | triggers when a tag is removed in multiple mode, the param is removed tag value | Function(tagValue: any) => void | — |
| Events | clear | onClear | triggers when the clear icon is clicked in a clearable Select | Function() => void | — |
| Events | blur | onBlur | triggers when Input blurs | Function(event: FocusEvent) => void | — |
| Events | focus | onFocus | triggers when Input focuses | Function(event: FocusEvent) => void | — |
| Events | end-reached | onEndReached | triggers when dropdown scroll reaches an end | Function(direction: 'top' \| 'bottom' \| 'left' \| 'right') => void | — |
| Slots | default | renderOption | Option renderer | — | — |
| Slots | header | renderHeader | content at the top of the dropdown | — | — |
| Slots | footer | renderFooter | content at the bottom of the dropdown | — | — |
| Slots | empty | renderEmpty | content when options is empty | — | — |
| Slots | prefix | renderPrefix | prefix content of input | — | — |
| Slots | tag | renderTag | content as Select tag, subTags `data`, `selectDisabled` and `deleteTag` introduced in ^(2.10.3) | object{ data: Option[], selectDisabled: boolean, deleteTag: (event: MouseEvent, option: Option) => void } | — |
| Slots | loading | renderLoading | content as Select loading | — | — |
| Slots | label | renderLabel | content as Select label. `index` introduced in ^(2.11.2) | object{ index: number, label: string \| any, value: string \| any } | — |
| Exposes | focus | ref.current.focus | focus the Input component | Function() => void | — |
| Exposes | blur | ref.current.blur | blur the Input component, and hide the dropdown | Function() => void | — |
| Exposes | selectedLabel | ref.current.selectedLabel | get the currently selected label | objectComputedRef<string \| string[]> | — |

## 完成记录

- [x] select-v2:240 value / defaultValue / onValueChange；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:241 options；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:242 props；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:243 multiple；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:244 disabled；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:245 valueKey；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:246 size；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:247 clearable；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:248 clearIcon；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:249 collapseTags；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:250 multipleLimit；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:251 id；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:252 name；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:253 effect；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:254 autoComplete；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:255 placeholder；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:256 filterable；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:257 allowCreate；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:258 filterMethod；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:259 loading；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:260 loadingText；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:261 reserveKeyword；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:262 defaultFirstOption；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:263 noMatchText；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:264 noDataText；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:265 popperClass；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:266 popperStyle；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:267 teleported；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:268 appendTo；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:269 persistent；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:271 automaticDropdown；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:272 fitInputWidth；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:273 suffixIcon；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:274 height；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:275 itemHeight；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:276 estimatedOptionHeight；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:277 scrollbarAlwaysOn；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:278 remote；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:279 debounce；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:280 remoteMethod；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:281 remoteShowSuffix；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:282 validateEvent；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:283 offset；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:284 showArrow；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:285 placement；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:286 fallbackPlacements；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:287 collapseTagsTooltip；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:288 tagTooltip；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:289 maxCollapseTags；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:290 tagType；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:291 tagEffect；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:292 ariaLabel；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:293 emptyValues；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:294 valueOnClear；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:296 tabIndex；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:302 value；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:303 label；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:304 options；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:305 disabled；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:346 onChange；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:347 onVisibleChange；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:348 onRemoveTag；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:349 onClear；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:350 onBlur；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:351 onFocus；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:352 onEndReached；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:358 renderOption；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:359 renderHeader；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:360 renderFooter；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:361 renderEmpty；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:362 renderPrefix；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:363 renderTag；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:364 renderLoading；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:365 renderLabel；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:371 ref.current.focus；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:372 ref.current.blur；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
- [x] select-v2:373 ref.current.selectedLabel；实现：packages/components/select-v2/index.tsx；测试：tests/select-v2.test.tsx
