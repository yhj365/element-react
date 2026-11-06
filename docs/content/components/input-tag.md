# InputTag 标签输入框

输入提交、分隔粘贴和标签管理。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 标签输入

输入提交、分隔粘贴和标签管理。

```tsx
import { useState } from 'react';
import { InputTag } from 'element-react';

/** 回车或逗号新增标签，支持拖动调整顺序。 */
export default function Example() {
  const [value, setValue] = useState<string[] | undefined>(['React', 'TypeScript']);
  return (
    <InputTag
      value={value}
      onValueChange={setValue}
      delimiter=","
      draggable
      clearable
      max={8}
      ariaLabel="项目标签"
      placeholder="输入标签后按回车"
    />
  );
}
```

### 折叠标签

输入提交、分隔粘贴和标签管理。

```tsx
import { InputTag } from 'element-react';

/** 折叠保留原始索引，提示层中仍可关闭标签。 */
export default function Example() {
  return (
    <InputTag
      defaultValue={['React', 'Vue', 'Angular', 'Svelte']}
      collapseTags
      collapseTagsTooltip
      maxCollapseTags={2}
      ariaLabel="折叠标签"
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | arraystring[] | — |
| Attributes | max | max | max number tags that can be enter | number | — |
| Attributes | tag-type | tagType | tag type | enum'' \| 'success' \| 'info' \| 'warning' \| 'danger' | info |
| Attributes | tag-effect | tagEffect | tag effect | enum'' \| 'light' \| 'dark' \| 'plain' | light |
| Attributes | effect | effect | tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| Attributes | trigger | trigger | the key to trigger input tag | enum'Enter' \| 'Space' | Enter |
| Attributes | draggable | draggable | whether tags can be dragged | boolean | false |
| Attributes | delimiter | delimiter | add a tag when a delimiter is matched | string / regex | — |
| Attributes | size | size | input box size | enum'large' \| 'default' \| 'small' | — |
| Attributes | collapse-tags | collapseTags | whether to collapse tags to a text when multiple selecting | boolean | false |
| Attributes | collapse-tags-tooltip | collapseTagsTooltip | whether show all selected tags when mouse hover text of collapse-tags. To use this, collapse-tags must be true | boolean | false |
| Attributes | save-on-blur | saveOnBlur | whether to save the input value when the input loses focus | boolean | true |
| Attributes | clearable | clearable | whether to show clear button | boolean | false |
| Attributes | clear-icon | clearIcon | custom clear icon component | string / objectComponent | CircleClose |
| Attributes | disabled | disabled | whether to disable input-tag | boolean | false |
| Attributes | validate-event | validateEvent | whether to trigger form validation | boolean | true |
| Attributes | readonly | readOnly | same as `readonly` in native input | boolean | false |
| Attributes | autofocus | autoFocus | same as `autofocus` in native input | boolean | false |
| Attributes | id | id | same as `id` in native input | string | — |
| Attributes | tabindex | tabIndex | same as `tabindex` in native input | string / number | — |
| Attributes | max-collapse-tags | maxCollapseTags | the max tags number to be shown. To use this, collapse-tags must be true | number | 1 |
| Attributes | maxlength | maxLength | same as `maxlength` in native input | string / number | — |
| Attributes | minlength | minLength | same as `minlength` in native input | string / number | — |
| Attributes | placeholder | placeholder | placeholder of input | string | — |
| Attributes | autocomplete | autoComplete | same as `autocomplete` in native input | string | off |
| Attributes | aria-label | ariaLabel | native `aria-label` attribute | string | — |
| Events | change | onChange | triggers when the modelValue change | Function(value: string[]) => void | — |
| Events | input | onInput | triggers when the input value change | Function(value: string) => void | — |
| Events | add-tag | onAddTag | triggers when a tag is added | Function(value: string \| string []) => void | — |
| Events | remove-tag | onRemoveTag | triggers when a tag is removed | Function(value: string, index: number) => void | — |
| Events | drag-tag | onDragTag | triggers when a tag is dragged | Function(oldIndex: number, newIndex: number, value: string) => void | — |
| Events | focus | onFocus | triggers when InputTag focuses | Function(event: FocusEvent) => void | — |
| Events | blur | onBlur | triggers when InputTag blurs | Function(event: FocusEvent) => void | — |
| Events | clear | onClear | triggers when the clear icon is clicked | Function() => void | — |
| Slots | tag | renderTag | content as tag | object{ value: string, index: number } | — |
| Slots | prefix | renderPrefix | content as InputTag prefix | — | — |
| Slots | suffix | renderSuffix | content as InputTag suffix | — | — |
| Exposes | focus | ref.current.focus | focus the input element | Function() => void | — |
| Exposes | blur | ref.current.blur | blur the input element | Function() => void | — |

## 完成记录

- [x] input-tag:136 value / defaultValue / onValueChange；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:137 max；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:138 tagType；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:139 tagEffect；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:140 effect；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:141 trigger；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:142 draggable；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:143 delimiter；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:144 size；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:145 collapseTags；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:146 collapseTagsTooltip；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:147 saveOnBlur；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:148 clearable；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:149 clearIcon；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:150 disabled；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:151 validateEvent；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:152 readOnly；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:153 autoFocus；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:154 id；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:155 tabIndex；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:156 maxCollapseTags；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:157 maxLength；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:158 minLength；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:159 placeholder；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:160 autoComplete；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:161 ariaLabel；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:167 onChange；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:168 onInput；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:169 onAddTag；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:170 onRemoveTag；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:171 onDragTag；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:172 onFocus；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:173 onBlur；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:174 onClear；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:180 renderTag；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:181 renderPrefix；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:182 renderSuffix；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:188 ref.current.focus；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
- [x] input-tag:189 ref.current.blur；实现：packages/components/input-tag/index.tsx；测试：tests/input-tag.test.tsx
