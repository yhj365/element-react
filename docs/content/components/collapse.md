# Collapse 折叠面板

支持多项展开和手风琴。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 折叠面板

支持多项展开和手风琴。

```tsx
import { Collapse, CollapseItem } from 'element-react';

/** 支持多项展开和手风琴。 */
export default function Example() {
  return (
    <Collapse defaultValue={['a']}>
      <CollapseItem name="a" title="组件设计">
        逻辑、样式和公开接口分别维护。
      </CollapseItem>
      <CollapseItem name="b" title="回归测试">
        每项完成能力都有测试证据。
      </CollapseItem>
    </Collapse>
  );
}
```

### 自定义标题和图标

标题和图标接收当前展开状态。

```tsx
import { Collapse, CollapseItem } from 'element-react';

/** 标题和图标接收当前展开状态。 */
export default function Example() {
  return (
    <Collapse accordion>
      <CollapseItem
        name="a"
        renderTitle={(active) => (active ? '收起详情' : '展开详情')}
        renderIcon={(active) => (active ? '−' : '+')}
      >
        这里是内容。
      </CollapseItem>
      <CollapseItem name="b" title="禁用面板" disabled>
        不可打开。
      </CollapseItem>
    </Collapse>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Collapse Attributes | model-value / v-model | value / defaultValue / onValueChange | currently active panel, the type is `string` in accordion mode, otherwise it is `array` | string / array | [] |
| Collapse Attributes | accordion | accordion | whether to activate accordion mode | boolean | false |
| Collapse Events | change | onChange | triggers when active panels change, the parameter type is `string` in accordion mode, otherwise it is `array` | Function(activeNames: array \| string) => void | — |
| Collapse Slots | default | children | customize default content |  | — |
| Collapse Item Attributes | name | name | unique identification of the panel | string / number | — |
| Collapse Item Attributes | title | title | title of the panel | string | '' |
| Collapse Item Attributes | icon | icon | icon of the collapse item | string / Component | ArrowRight |
| Collapse Item Attributes | disabled | disabled | disable the collapse item | boolean | false |
| Collapse Item Slot | default | children | content of Collapse Item | — | — |
| Collapse Item Slot | title | renderTitle | content of Collapse Item title | object{ isActive: boolean } | — |
| Collapse Item Slot | icon | renderIcon | content of Collapse Item icon | object{ isActive: boolean } | — |
| Collapse Item Exposes | isActive | ref.current.isActive | whether the current collapse item is active | objectComputedRef<boolean \| undefined> | — |

## 完成记录

- [x] collapse:82 value / defaultValue / onValueChange；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:83 accordion；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:91 onChange；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:97 children；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:112 name；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:113 title；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:114 icon；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:115 disabled；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:121 children；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:122 renderTitle；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:123 renderIcon；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
- [x] collapse:129 ref.current.isActive；实现：packages/components/navigation/index.tsx；测试：tests/navigation.test.tsx
