# Tabs 标签页

支持激活值、不同位置和自定义页签内容。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 标签页

支持激活值、不同位置和自定义页签内容。

```tsx
import { Tabs, TabPane } from 'element-react';

/** 支持激活值、不同位置和自定义页签内容。 */
export default function Example() {
  return (
    <Tabs defaultValue="first">
      <TabPane name="first" label="组件说明">
        这是组件的说明内容。
      </TabPane>
      <TabPane name="second" label="示例">
        这是可运行示例。
      </TabPane>
      <TabPane name="disabled" label="禁用" disabled>
        禁用页签。
      </TabPane>
    </Tabs>
  );
}
```

### 切换前拦截

较旧的异步结果不能覆盖新的切换请求。

```tsx
import { Tabs, TabPane } from 'element-react';

/** 较旧的异步结果不能覆盖新的切换请求。 */
export default function Example() {
  return (
    <Tabs defaultValue="a" beforeLeave={() => Promise.resolve(true)}>
      <TabPane name="a" label="页面一">
        页面一内容
      </TabPane>
      <TabPane name="b" label="页面二">
        页面二内容
      </TabPane>
    </Tabs>
  );
}
```

### 可增删标签页

调用方通过事件更新实际面板列表。

```tsx
import { useRef, useState } from 'react';
import { Tabs, TabPane } from 'element-react';

/** 调用方通过事件更新实际面板列表。 */
export default function Example() {
  const [items, setItems] = useState(['1', '2']);
  const count = useRef(2);
  return (
    <Tabs
      editable
      closable
      defaultValue="1"
      onTabAdd={() => setItems([...items, String(++count.current)])}
      onTabRemove={(name) => setItems(items.filter((item) => item !== name))}
    >
      {items.map((item) => (
        <TabPane key={item} name={item} label={'标签 ' + item}>
          内容 {item}
        </TabPane>
      ))}
    </Tabs>
  );
}
```

### 面板懒加载

第一次激活后保留挂载，切换回来仍保留输入内容。

```tsx
import { Tabs, TabPane, Input } from 'element-react';

/** 第一次激活后保留挂载，切换回来仍保留输入内容。 */
export default function Example() {
  return (
    <Tabs defaultValue="a">
      <TabPane name="a" label="首页">
        先点击表单标签。
      </TabPane>
      <TabPane name="b" label="表单" lazy>
        <Input placeholder="切换后输入仍保留" />
      </TabPane>
    </Tabs>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Tabs Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value, name of the selected tab, the default value is the name of first tab | string / number | — |
| Tabs Attributes | default-value | defaultValue | The value of the tab that should be active when initially rendered. (avoid initial transition) | string / number | — |
| Tabs Attributes | type | type | type of Tab | enum'' \| 'card' \| 'border-card' | '' |
| Tabs Attributes | closable | closable | whether Tab is closable | boolean | false |
| Tabs Attributes | addable | addable | whether Tab is addable | boolean | false |
| Tabs Attributes | editable | editable | whether Tab is addable and closable | boolean | false |
| Tabs Attributes | tab-position | tabPosition | position of tabs | enum'top' \| 'right' \| 'bottom' \| 'left' | top |
| Tabs Attributes | stretch | stretch | whether width of tab automatically fits its container | boolean | false |
| Tabs Attributes | before-leave | beforeLeave | hook function before switching tab. If `false` is returned or a `Promise` is returned and then is rejected, switching will be prevented | Function(activeName: TabPaneName, oldActiveName: TabPaneName) => Awaitable<void \| boolean> | () => true |
| Tabs Events | tab-click | onTabClick | triggers when a tab is clicked |  | — |
| Tabs Events | tab-change | onTabChange | triggers when `activeName` is changed |  | — |
| Tabs Events | tab-remove | onTabRemove | triggers when tab-remove button is clicked |  | — |
| Tabs Events | tab-add | onTabAdd | triggers when tab-add button is clicked |  | — |
| Tabs Events | edit | onEdit | triggers when tab-add button or tab-remove is clicked |  | — |
| Tabs Slots | default | children | customize default content |  | — |
| Tab-pane Attributes | label | label | title of the tab | string | '' |
| Tab-pane Attributes | disabled | disabled | whether Tab is disabled | boolean | false |
| Tab-pane Attributes | name | name | identifier corresponding to the name of Tabs, representing the alias of the tab-pane, the default is ordinal number of the tab-pane in the sequence, e.g. the first tab-pane is '0' | string / number | — |
| Tab-pane Attributes | closable | closable | whether Tab is closable | boolean | false |
| Tab-pane Attributes | lazy | lazy | whether Tab is lazily rendered | boolean | false |
| Tab-pane Slots | default | children | Tab-pane's content |  | — |
| Tab-pane Slots | label | renderLabel | Tab-pane's label |  | — |

## 完成记录

- [x] tabs:100 value / defaultValue / onValueChange；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:101 defaultValue；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:102 type；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:103 closable；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:104 addable；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:105 editable；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:106 tabPosition；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:107 stretch；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:108 beforeLeave；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:115 onTabClick；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:116 onTabChange；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:117 onTabRemove；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:118 onTabAdd；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:119 onEdit；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:125 children；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:162 label；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:163 disabled；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:164 name；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:165 closable；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:166 lazy；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:172 children；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] tabs:173 renderLabel；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
