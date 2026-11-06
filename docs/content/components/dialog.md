# Dialog 对话框

受控显隐、内容和底部操作。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基本对话框

受控显隐、内容和底部操作。

```tsx
import { useState } from 'react';
import { Button, Dialog, Input, Space } from 'element-react';

/** 展示受控显隐、内容区域和关闭通知。 */
export default function Example() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开对话框
      </Button>
      <Dialog
        value={visible}
        onValueChange={setVisible}
        title="编辑信息"
        width={500}
        appendToBody
        renderFooter={
          <Space>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => setVisible(false)}>
              保存
            </Button>
          </Space>
        }
      >
        <Input placeholder="请输入名称" aria-label="名称" />
      </Dialog>
    </>
  );
}
```

### 关闭拦截与生命周期

通过关闭前检查决定是否关闭。

```tsx
import { useState } from 'react';
import { Button, Dialog } from 'element-react';

/** 关闭前拦截；取消本次关闭不会改变受控值。 */
export default function Example() {
  const [visible, setVisible] = useState(false);
  const [allow, setAllow] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>带关闭检查</Button>
      <Dialog
        value={visible}
        onValueChange={setVisible}
        title="关闭前检查"
        beforeClose={(done) => done(!allow)}
        draggable
        destroyOnClose
        appendToBody
      >
        <p>先允许关闭，再点击关闭按钮或按 Escape。</p>
        <Button onClick={() => setAllow(true)}>{allow ? '已允许关闭' : '允许关闭'}</Button>
      </Dialog>
    </>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | visibility of Dialog | boolean | false |
| Attributes | title | title | title of Dialog. Can also be passed with a named slot (see the following table) | string | '' |
| Attributes | width | width | width of Dialog, default is 50% | string / number | '' |
| Attributes | fullscreen | fullscreen | whether the Dialog takes up full screen | boolean | false |
| Attributes | top | top | value for `margin-top` of Dialog CSS, default is 15vh | string | '' |
| Attributes | modal | modal | whether a mask is displayed | boolean | true |
| Attributes | modal-class | modalClass | custom class names for mask | string | — |
| Attributes | header-class | headerClass | custom class names for header wrapper | string | — |
| Attributes | body-class | bodyClass | custom class names for body wrapper | string | — |
| Attributes | footer-class | footerClass | custom class names for footer wrapper | string | — |
| Attributes | append-to-body | appendToBody | whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true` | boolean | false |
| Attributes | append-to | appendTo | which element the Dialog appends to. Will override `append-to-body` | CSSSelector / HTMLElement | body |
| Attributes | lock-scroll | lockScroll | whether scroll of body is disabled while Dialog is displayed | boolean | true |
| Attributes | open-delay | openDelay | the Time(milliseconds) before open | number | 0 |
| Attributes | close-delay | closeDelay | the Time(milliseconds) before close | number | 0 |
| Attributes | close-on-click-modal | closeOnClickModal | whether the Dialog can be closed by clicking the mask | boolean | true |
| Attributes | close-on-press-escape | closeOnPressEscape | whether the Dialog can be closed by pressing ESC | boolean | true |
| Attributes | show-close | showClose | whether to show a close button | boolean | true |
| Attributes | before-close | beforeClose | callback before Dialog closes, and it will prevent Dialog from closing, use done to close the dialog | Function(done: DoneFn) => void | — |
| Attributes | draggable | draggable | enable dragging feature for Dialog | boolean | false |
| Attributes | overflow | overflow | draggable Dialog can overflow the viewport | boolean | false |
| Attributes | center | center | whether to align the header and footer in center | boolean | false |
| Attributes | align-center | alignCenter | whether to align the dialog both horizontally and vertically | boolean | false |
| Attributes | destroy-on-close | destroyOnClose | destroy elements in Dialog when closed | boolean | false |
| Attributes | close-icon | closeIcon | custom close icon, default is Close | string / Component | — |
| Attributes | z-index | zIndex | same as z-index in native CSS, z-order of dialog | number | — |
| Attributes | header-aria-level | headerAriaLevel | header's `aria-level` attribute | string | 2 |
| Slots | default | children | default content of Dialog |  | — |
| Slots | header | renderHeader | content of the Dialog header; Replacing this removes the title, but does not remove the close button. |  | — |
| Slots | footer | renderFooter | content of the Dialog footer |  | — |
| Slots | title | renderTitle | works the same as the header slot. Use that instead. |  | — |
| Events | open | onOpen | triggers when the Dialog opens | Function() => void | — |
| Events | opened | onOpened | triggers when the Dialog opening animation ends | Function() => void | — |
| Events | close | onClose | triggers when the Dialog closes | Function() => void | — |
| Events | closed | onClosed | triggers when the Dialog closing animation ends | Function() => void | — |
| Events | open-auto-focus | onOpenAutoFocus | triggers after Dialog opens and content focused | Function() => void | — |
| Events | close-auto-focus | onCloseAutoFocus | triggers after Dialog closed and content focused | Function() => void | — |
| Exposes | resetPosition | ref.current.resetPosition | reset position | Function() => void | — |
| Exposes | handleClose | ref.current.handleClose | close dialog | Function() => void | — |

## 完成记录

- [x] dialog:172 value / defaultValue / onValueChange；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:173 title；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:174 width；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:175 fullscreen；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:176 top；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:177 modal；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:179 modalClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:180 headerClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:181 bodyClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:182 footerClass；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:183 appendToBody；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:184 appendTo；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:185 lockScroll；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:186 openDelay；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:187 closeDelay；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:188 closeOnClickModal；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:189 closeOnPressEscape；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:190 showClose；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:191 beforeClose；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:192 draggable；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:193 overflow；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:194 center；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:195 alignCenter；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:196 destroyOnClose；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:197 closeIcon；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:198 zIndex；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:199 headerAriaLevel；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:213 children；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:214 renderHeader；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:215 renderFooter；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:216 renderTitle；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:228 onOpen；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:229 onOpened；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:230 onClose；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:231 onClosed；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:232 onOpenAutoFocus；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:233 onCloseAutoFocus；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:239 ref.current.resetPosition；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
- [x] dialog:240 ref.current.handleClose；实现：packages/components/modal/index.tsx；测试：tests/modal.test.tsx
