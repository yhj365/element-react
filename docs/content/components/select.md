# Select 选择器

受控单选、分组、禁用和过滤。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础选择

受控单选、分组、禁用和过滤。

```tsx
import { useState } from 'react';
import { Select, Option, OptionGroup } from 'element-react';
import type { SelectModel } from 'element-react';

/** 受控单选保留声明式选项与禁用分组。 */
export default function Example() {
  const [value, setValue] = useState<SelectModel<string>>('Shanghai');
  return (
    <Select<string>
      value={value}
      onValueChange={setValue}
      clearable
      filterable
      ariaLabel="城市"
      placeholder="选择城市"
    >
      <OptionGroup label="城市">
        <Option value="Shanghai" label="上海" />
        <Option value="Beijing" label="北京" />
        <Option value="Shenzhen" label="深圳" disabled />
      </OptionGroup>
    </Select>
  );
}
```

### 多选与创建

多选限制、折叠标签和创建选项。

```tsx
import { useState } from 'react';
import { Select } from 'element-react';
import type { SelectModel } from 'element-react';

/** 多选限制、标签折叠和自建选项共用同一值模型。 */
export default function Example() {
  const [value, setValue] = useState<SelectModel<string>>(['Vue', 'React']);
  return (
    <Select<string>
      ariaLabel="技术栈"
      multiple
      filterable
      allowCreate
      defaultFirstOption
      collapseTags
      maxCollapseTags={2}
      multipleLimit={4}
      value={value}
      onValueChange={setValue}
      options={['Vue', 'React', 'Angular', 'Svelte'].map((value) => ({ value, label: value }))}
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Select Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string / number / boolean / object / array | — |
| Select Attributes | multiple | multiple | whether multiple-select is activated | boolean | false |
| Select Attributes | options | options | data of the options, the key of `value` and `label` and `disabled` can be customize by `props` | arrayArray<{[key: string]: any}> | — |
| Select Attributes | [props](#props) | props | configuration options | object | — |
| Select Attributes | disabled | disabled | whether Select is disabled | boolean | false |
| Select Attributes | value-key | valueKey | unique identity key name for value, required when value is an object | string | value |
| Select Attributes | size | size | size of Input | enum'' \| 'large' \| 'default' \| 'small' | — |
| Select Attributes | clearable | clearable | whether select can be cleared | boolean | false |
| Select Attributes | collapse-tags | collapseTags | whether to collapse tags to a text when multiple selecting | boolean | false |
| Select Attributes | multiple-limit | multipleLimit | maximum number of options user can select when `multiple` is `true`. No limit when set to 0 | number | 0 |
| Select Attributes | id | id | native input id input | string | — |
| Select Attributes | name | name | the name attribute of select input | string | — |
| Select Attributes | effect | effect | tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| Select Attributes | autocomplete | autoComplete | the autocomplete attribute of select input | string | off |
| Select Attributes | placeholder | placeholder | placeholder, default is 'Select' | string | — |
| Select Attributes | filterable | filterable | whether Select is filterable | boolean | false |
| Select Attributes | allow-create | allowCreate | whether creating new items is allowed. To use this, `filterable` must be true | boolean | false |
| Select Attributes | remote | remote | whether options are loaded from server | boolean | false |
| Select Attributes | debounce | debounce | debounce delay during remote search, in milliseconds | number | 300 |
| Select Attributes | remote-method | remoteMethod | function that gets called when the input value changes. Its parameter is the current input value. To use this, `filterable` must be true | Function(query: string) => void | — |
| Select Attributes | loading | loading | whether Select is loading data from server | boolean | false |
| Select Attributes | loading-text | loadingText | displayed text while loading data from server, default is 'Loading' | string | — |
| Select Attributes | no-match-text | noMatchText | displayed text when no data matches the filtering query, you can also use slot `empty`, default is 'No matching data' | string | — |
| Select Attributes | no-data-text | noDataText | displayed text when there is no options, you can also use slot `empty`, default is 'No data' | string | — |
| Select Attributes | popper-class | popperClass | custom class name for Select's dropdown and tags' tooltip | string | '' |
| Select Attributes | popper-style | popperStyle | custom style for Select's dropdown and tags' tooltip | string / object | — |
| Select Attributes | reserve-keyword | reserveKeyword | when `multiple` and `filterable` is true, whether to reserve current keyword after selecting an option | boolean | true |
| Select Attributes | default-first-option | defaultFirstOption | select first matching option on enter key. Use with `filterable` or `remote` | boolean | false |
| Select Attributes | teleported | teleported | whether select dropdown is teleported, if `true` it will be teleported to where `append-to` sets | boolean | true |
| Select Attributes | append-to | appendTo | which element the select dropdown appends to | CSSSelector / HTMLElement | — |
| Select Attributes | persistent | persistent | when select dropdown is inactive and `persistent` is `false`, select dropdown will be destroyed | boolean | true |
| Select Attributes | automatic-dropdown | automaticDropdown | for non-filterable Select, this prop decides if the option menu pops up when the input is focused | boolean | false |
| Select Attributes | clear-icon | clearIcon | custom clear icon component | string / objectComponent | CircleClose |
| Select Attributes | tag-type | tagType | tag type | enum'' \| 'success' \| 'info' \| 'warning' \| 'danger' | info |
| Select Attributes | tag-effect | tagEffect | tag effect | enum'' \| 'light' \| 'dark' \| 'plain' | light |
| Select Attributes | validate-event | validateEvent | whether to trigger form validation | boolean | true |
| Select Attributes | show-arrow | showArrow | whether the dropdown has an arrow | boolean | true |
| Select Attributes | max-collapse-tags | maxCollapseTags | the max tags number to be shown. To use this, `collapse-tags` must be true | number | 1 |
| Select Attributes | aria-label | ariaLabel | same as `aria-label` in native input | string | — |
| Select Attributes | empty-values | emptyValues | empty values of component, [see config-provider](./config-provider.md#empty-values-configurations) | array | — |
| Select Attributes | value-on-clear | valueOnClear | clear return value, [see config-provider](./config-provider.md#empty-values-configurations) | string / number / boolean / Function | — |
| Select Attributes | tabindex | tabIndex | tabindex for input | string / number | — |
| Select Events | change | onChange | triggers when the selected value changes | Function(value: any) => void | — |
| Select Events | visible-change | onVisibleChange | triggers when the dropdown appears/disappears | Function(visible: boolean) => void | — |
| Select Events | remove-tag | onRemoveTag | triggers when a tag is removed in multiple mode | Function(tagValue: any) => void | — |
| Select Events | clear | onClear | triggers when the clear icon is clicked in a clearable Select | Function() => void | — |
| Select Events | blur | onBlur | triggers when Input blurs | Function(event: FocusEvent) => void | — |
| Select Events | focus | onFocus | triggers when Input focuses | Function(event: FocusEvent) => void | — |
| Select Slots | default | children | option component list |  | — |
| Select Slots | header | renderHeader | content at the top of the dropdown |  | — |
| Select Slots | footer | renderFooter | content at the bottom of the dropdown |  | — |
| Select Slots | prefix | renderPrefix | content as Select prefix |  | — |
| Select Slots | empty | renderEmpty | content when there is no options |  | — |
| Select Slots | loading | renderLoading | content as Select loading |  | — |
| Select Slots | label | renderLabel | content as Select label. `index` introduced in ^(2.11.2) |  | — |
| Select Exposes | focus | ref.current.focus | focus the Input component | Function() => void | — |
| Select Exposes | blur | ref.current.blur | blur the Input component, and hide the dropdown | Function() => void | — |
| Select Exposes | selectedLabel | ref.current.selectedLabel | get the currently selected label | objectComputedRef<string \| string[]> | — |
| Option Group Attributes | label | label | name of the group | string | — |
| Option Group Attributes | disabled | disabled | whether to disable all options in this group | boolean | false |
| Option Attributes | value | value | value of option | string / number / boolean / object | — |
| Option Attributes | label | label | label of option, same as `value` if omitted | string / number | — |
| Option Attributes | disabled | disabled | whether option is disabled | boolean | false |
| Option Slots | default | children | customize default content |  | — |

## 完成记录

- [x] select:206 value / defaultValue / onValueChange；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:207 multiple；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:208 options；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:209 props；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:210 disabled；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:211 valueKey；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:212 size；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:213 clearable；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:214 collapseTags；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:217 multipleLimit；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:218 id；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:219 name；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:220 effect；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:221 autoComplete；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:222 placeholder；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:223 filterable；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:224 allowCreate；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:226 remote；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:227 debounce；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:228 remoteMethod；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:230 loading；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:231 loadingText；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:232 noMatchText；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:233 noDataText；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:234 popperClass；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:235 popperStyle；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:236 reserveKeyword；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:237 defaultFirstOption；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:238 teleported；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:239 appendTo；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:240 persistent；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:241 automaticDropdown；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:242 clearIcon；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:245 tagType；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:246 tagEffect；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:247 validateEvent；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:249 showArrow；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:252 maxCollapseTags；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:254 ariaLabel；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:255 emptyValues；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:256 valueOnClear；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:258 tabIndex；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:314 onChange；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:315 onVisibleChange；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:316 onRemoveTag；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:317 onClear；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:318 onBlur；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:319 onFocus；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:327 children；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:328 renderHeader；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:329 renderFooter；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:330 renderPrefix；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:331 renderEmpty；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:333 renderLoading；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:334 renderLabel；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:340 ref.current.focus；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:341 ref.current.blur；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:342 ref.current.selectedLabel；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:350 label；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:351 disabled；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:365 value；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:366 label；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:367 disabled；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
- [x] select:373 children；实现：packages/components/select/index.tsx；测试：tests/select.test.tsx
