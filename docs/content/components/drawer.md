# Drawer 抽屉

四方向、尺寸和可定制的内容区域。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础抽屉

四方向、尺寸和可定制的内容区域。

```tsx
import { useState } from 'react';
import { Button, Drawer } from 'element-react';

/** 抽屉从指定方向进入，可独立配置内容与底部动作。 */
export default function Example() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开抽屉
      </Button>
      <Drawer
        value={visible}
        onValueChange={setVisible}
        title="详细信息"
        size={360}
        direction="rtl"
        appendToBody
        renderFooter={<Button onClick={() => setVisible(false)}>关闭</Button>}
      >
        <p>抽屉内容区域。</p>
      </Drawer>
    </>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | Should Drawer be displayed | boolean | false |
| Attributes | direction | direction | Drawer's opening direction | enum'rtl' \| 'ltr' \| 'ttb' \| 'btt' | rtl |
| Attributes | show-close | showClose | Should show close button at the top right of Drawer | boolean | true |
| Attributes | size | size | Drawer's size, if Drawer is horizontal mode, it effects the width property, otherwise it effects the height property, when size is `number` type, it describes the size by unit of pixels; when size is `string` type, it should be used with `x%` notation, other wise it will be interpreted to pixel unit | number / string | 30% |
| Attributes | title | title | Drawer's title, can also be set by named slot, detailed descriptions can be found in the slot form | string | — |
| Attributes | with-header | withHeader | Flag that controls the header section's existence, default to true, when withHeader set to false, both `title attribute` and `title slot` won't work | boolean | true |
| Attributes | header-class | headerClass | custom class names for header wrapper | string | — |
| Attributes | body-class | bodyClass | custom class names for body wrapper | string | — |
| Attributes | footer-class | footerClass | custom class names for footer wrapper | string | — |
| Slots | default | children | Drawer's Content |  | — |
| Slots | header | renderHeader | Drawer header section; Replacing this removes the title, but does not remove the close button. |  | — |
| Slots | footer | renderFooter | Drawer footer Section |  | — |
| Slots | title | renderTitle | Works the same as the header slot. Use that instead. |  | — |

## 完成记录

- [x] drawer:106 value / defaultValue / onValueChange；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:118 direction；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:120 showClose；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:121 size；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:122 title；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:123 withHeader；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:125 headerClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:126 bodyClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:127 footerClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:156 children；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:157 renderHeader；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:158 renderFooter；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] drawer:159 renderTitle；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
