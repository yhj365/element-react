# Autocomplete 自动补全

输入文本查看建议，使用方向键高亮并回车选择。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

输入文本查看建议，使用方向键高亮并回车选择。

```tsx
import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/autocomplete 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Search technology"
        clearable
        fetchSuggestions={(query, callback) =>
          callback(data.filter((item) => item.value.toLowerCase().includes(query.toLowerCase())))
        }
      />
      <Autocomplete aria-label="Search on input" triggerOnFocus={false} fetchSuggestions={data} />
    </div>
  );
}
```

### 自定义模板

输入文本查看建议，使用方向键高亮并回车选择。

```tsx
import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/autocomplete-template 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Custom suggestions"
        fetchSuggestions={data}
        renderSuggestion={(item) => (
          <div>
            <strong>{String(item.value)}</strong>
            <small className="ml-4 text-gray-500">{String(item.url)}</small>
          </div>
        )}
        renderPrefix={<span>⌕</span>}
      />
    </div>
  );
}
```

### 远程搜索

输入文本查看建议，使用方向键高亮并回车选择。

```tsx
import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/remote-search 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Remote search"
        debounce={300}
        highlightFirstItem
        fetchSuggestions={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return data.filter((item) => item.value.toLowerCase().includes(query.toLowerCase()));
        }}
      />
    </div>
  );
}
```

### 自定义加载

输入文本查看建议，使用方向键高亮并回车选择。

```tsx
import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/custom-loading 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Custom loading"
        fetchSuggestions={async () => {
          await new Promise((resolve) => setTimeout(resolve, 700));
          return data;
        }}
        renderLoading={<span>Loading suggestions…</span>}
      />
    </div>
  );
}
```

### 自定义头部和底部

输入文本查看建议，使用方向键高亮并回车选择。

```tsx
import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/custom-header-footer 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Header and footer"
        fetchSuggestions={data}
        renderHeader={<p className="px-4 py-2 font-semibold">Technologies</p>}
        renderFooter={<p className="px-4 py-2 text-gray-500">Use ↑ ↓ and Enter to select</p>}
      />
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | string | — |
| Attributes | placeholder | placeholder | the placeholder of Autocomplete | string | — |
| Attributes | clearable | clearable | whether to show clear button | boolean | false |
| Attributes | disabled | disabled | whether Autocomplete is disabled | boolean | false |
| Attributes | value-key | valueKey | key name of the input suggestion object for display | string | value |
| Attributes | debounce | debounce | debounce delay when typing, in milliseconds | number | 300 |
| Attributes | placement | placement | placement of the popup menu | enum'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' | bottom-start |
| Attributes | fetch-suggestions | fetchSuggestions | a method to fetch input suggestions. When suggestions are ready, invoke `callback(data:[])` to return them to Autocomplete | array / Function(queryString: string, callback: callbackfn) => void | — |
| Attributes | trigger-on-focus | triggerOnFocus | whether show suggestions when input focus | boolean | true |
| Attributes | select-when-unmatched | selectWhenUnmatched | whether to emit a `select` event on enter when there is no autocomplete match | boolean | false |
| Attributes | name | name | same as `name` in native input | string | — |
| Attributes | hide-loading | hideLoading | whether to hide the loading icon in remote search | boolean | false |
| Attributes | popper-class | popperClass | custom class name for autocomplete's dropdown | string / object | '' |
| Attributes | popper-style | popperStyle | custom style for autocomplete's dropdown | string / object | — |
| Attributes | show-arrow | showArrow | whether the dropdown has an arrow | boolean | true |
| Attributes | teleported | teleported | whether select dropdown is teleported to the body | boolean | true |
| Attributes | append-to | appendTo | which select dropdown appends to | CSSSelector / HTMLElement | — |
| Attributes | highlight-first-item | highlightFirstItem | whether to highlight first item in remote search suggestions by default | boolean | false |
| Attributes | fit-input-width | fitInputWidth | whether the width of the dropdown is the same as the input | boolean | false |
| Attributes | loop-navigation | loopNavigation | whether keyboard navigation loops from end to start | boolean | true |
| Events | blur | onBlur | triggers when Input blurs | Function(event: FocusEvent) => void | — |
| Events | focus | onFocus | triggers when Input focuses | Function(event: FocusEvent) => void | — |
| Events | input | onInput | triggers when the Input value change | Function(value: string \| number) => void | — |
| Events | clear | onClear | triggers when the Input is cleared by clicking the clear button | Function() => void | — |
| Events | select | onSelect | triggers when a suggestion is clicked | Function(item: Record<string, any>) => void | — |
| Events | change | onChange | triggers when the icon inside Input value change | Function(value: string \| number) => void | — |
| Slots | default | renderSuggestion | custom content for input suggestions | object{ item: Record<string, any> } | — |
| Slots | header | renderHeader | content at the top of the dropdown | - | — |
| Slots | footer | renderFooter | content at the bottom of the dropdown | - | — |
| Slots | prefix | renderPrefix | content as Input prefix | - | — |
| Slots | suffix | renderSuffix | content as Input suffix | - | — |
| Slots | prepend | renderPrepend | content to prepend before Input | - | — |
| Slots | append | renderAppend | content to append after Input | - | — |
| Slots | loading | renderLoading | override loading content | - | — |
| Exposes | activated | ref.current.activated | if autocomplete activated | objectRef<boolean> | — |
| Exposes | blur | ref.current.blur | blur the input element | Function() => void | — |
| Exposes | close | ref.current.close | collapse suggestion list | Function() => void | — |
| Exposes | focus | ref.current.focus | focus the input element | Function() => void | — |
| Exposes | handleSelect | ref.current.handleSelect | triggers when a suggestion is clicked | Function(item: any) => Promise<void> | — |
| Exposes | handleKeyEnter | ref.current.handleKeyEnter | handle keyboard enter event | Function() => Promise<void> | — |
| Exposes | highlightedIndex | ref.current.highlightedIndex | the index of the currently highlighted item | objectRef<number> | — |
| Exposes | highlight | ref.current.highlight | highlight an item in a suggestion | Function(itemIndex: number) => void | — |
| Exposes | inputRef | ref.current.inputRef | el-input component instance | objectRef<ElInputInstance> | — |
| Exposes | loading | ref.current.loading | remote search loading indicator | objectRef<boolean> | — |
| Exposes | popperRef | ref.current.popperRef | el-tooltip component instance | objectRef<ElTooltipInstance> | — |
| Exposes | suggestions | ref.current.suggestions | fetch suggestions result | objectRef<record<string, any>[]> | — |
| Exposes | getData | ref.current.getData | loading suggestion list | Function(queryString: string) => Promise<void> | — |

## 完成记录

- [x] autocomplete:66 value / defaultValue / onValueChange；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:67 placeholder；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:68 clearable；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:69 disabled；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:70 valueKey；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:71 debounce；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:72 placement；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:73 fetchSuggestions；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:74 triggerOnFocus；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:75 selectWhenUnmatched；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:76 name；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:78 hideLoading；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:79 popperClass；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:80 popperStyle；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:82 showArrow；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:83 teleported；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:84 appendTo；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:85 highlightFirstItem；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:86 fitInputWidth；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:88 loopNavigation；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:95 onBlur；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:96 onFocus；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:97 onInput；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:98 onClear；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:99 onSelect；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:100 onChange；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:106 renderSuggestion；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:107 renderHeader；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:108 renderFooter；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:109 renderPrefix；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:110 renderSuffix；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:111 renderPrepend；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:112 renderAppend；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:113 renderLoading；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:119 ref.current.activated；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:120 ref.current.blur；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:121 ref.current.close；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:122 ref.current.focus；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:123 ref.current.handleSelect；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:124 ref.current.handleKeyEnter；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:125 ref.current.highlightedIndex；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:126 ref.current.highlight；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:127 ref.current.inputRef；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:128 ref.current.loading；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:129 ref.current.popperRef；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:130 ref.current.suggestions；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
- [x] autocomplete:131 ref.current.getData；实现：packages/components/autocomplete/index.tsx；测试：tests/autocomplete.test.tsx
