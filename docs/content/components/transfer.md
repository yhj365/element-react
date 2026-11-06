# Transfer 穿梭框

双列表选择、过滤和移动。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 穿梭框

双列表选择、过滤和移动。

```tsx
import { useState } from 'react';
import { Transfer } from 'element-react';

const data = Array.from({ length: 12 }, (_, index) => ({
  key: index,
  label: `选项 ${index + 1}`,
  disabled: index === 3,
}));
/** 已选模型由调用方维护，左右勾选只决定下一次移动的内容。 */
export default function Example() {
  const [value, setValue] = useState<Array<string | number>>([1, 4]);
  return (
    <Transfer
      data={data}
      value={value}
      onValueChange={setValue}
      filterable
      titles={['可选项目', '已选项目']}
      buttonTexts={['移除', '添加']}
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Transfer Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | arrayArray<string \| number> | [] |
| Transfer Attributes | data | data | data source | arrayRecord<string, any>[] | [] |
| Transfer Attributes | filterable | filterable | whether Transfer is filterable | boolean | false |
| Transfer Attributes | filter-placeholder | filterPlaceholder | placeholder for the filter input | string | — |
| Transfer Attributes | filter-method | filterMethod | custom filter method | Function(query: string, item: Record<string, any>) => boolean | — |
| Transfer Attributes | target-order | targetOrder | order strategy for elements in the target list. If set to `original`, the elements will keep the same order as the data source. If set to `push`, the newly added elements will be pushed to the bottom. If set to `unshift`, the newly added elements will be inserted on the top | enum'original' \| 'push' \| 'unshift' | original |
| Transfer Attributes | titles | titles | custom list titles | array[string, string] | [] |
| Transfer Attributes | button-texts | buttonTexts | custom button texts | array[string, string] | [] |
| Transfer Attributes | render-content | renderContent | custom render function for data items | objectrenderContent | — |
| Transfer Attributes | format | format | texts for checking status in list header | objectTransferFormat | {} |
| Transfer Attributes | [props](#type-declarations) | props | prop aliases for data source | objectTransferPropsAlias | — |
| Transfer Attributes | left-default-checked | leftDefaultChecked | key array of initially checked data items of the left list | arrayArray<string \| number> | [] |
| Transfer Attributes | right-default-checked | rightDefaultChecked | key array of initially checked data items of the right list | arrayArray<string \| number> | [] |
| Transfer Attributes | validate-event | validateEvent | whether to trigger form validation | boolean | true |
| Transfer Attributes | virtual-scroll | virtualScroll | whether to enable virtual scrolling | boolean | false |
| Transfer Attributes | item-size | itemSize | item height for virtual scrolling | number | 30 |
| Transfer Events | change | onChange | triggers when data items change in the right list | Function(value: TransferKey[], direction: TransferDirection, movedKeys: TransferKey[]) => void | — |
| Transfer Events | left-check-change | onLeftCheckChange | triggers when end user changes the checked state of any data item in the left list | Function(value: TransferKey[], movedKeys?: TransferKey[]) => void | — |
| Transfer Events | right-check-change | onRightCheckChange | triggers when end user changes the checked state of any data item in the right list | Function(value: TransferKey[], movedKeys?: TransferKey[]) => void | — |
| Transfer Slots | default | children | Custom content for data items. | object{ option: TransferDataItem } | — |
| Transfer Slots | left-footer | renderLeftFooter | content of left list footer | — | — |
| Transfer Slots | right-footer | renderRightFooter | content of right list footer | — | — |
| Transfer Slots | left-empty | renderLeftEmpty | content when left panel is empty or when no data matches the filter | — | — |
| Transfer Slots | right-empty | renderRightEmpty | content when right panel is empty or when no data matches the filter | — | — |
| Transfer Exposes | clearQuery | ref.current.clearQuery | clear the filter keyword of a certain panel | Function(which: TransferDirection) => void | — |
| Transfer Exposes | leftPanel | ref.current.leftPanel | left panel ref | objectRef<TransferPanelInstance> | — |
| Transfer Exposes | rightPanel | ref.current.rightPanel | right panel ref | objectRef<TransferPanelInstance> | — |
| Transfer Panel Exposes | query | ref.current.query | filter keyword | string | — |

## 完成记录

- [x] transfer:72 value / defaultValue / onValueChange；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:73 data；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:74 filterable；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:75 filterPlaceholder；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:76 filterMethod；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:77 targetOrder；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:78 titles；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:79 buttonTexts；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:80 renderContent；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:81 format；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:82 props；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:83 leftDefaultChecked；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:84 rightDefaultChecked；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:85 validateEvent；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:86 virtualScroll；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:87 itemSize；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:93 onChange；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:94 onLeftCheckChange；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:95 onRightCheckChange；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:101 children；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:102 renderLeftFooter；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:103 renderRightFooter；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:104 renderLeftEmpty；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:105 renderRightEmpty；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:111 ref.current.clearQuery；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:112 ref.current.leftPanel；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:113 ref.current.rightPanel；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
- [x] transfer:121 ref.current.query；实现：packages/components/transfer/index.tsx；测试：tests/transfer.test.tsx
