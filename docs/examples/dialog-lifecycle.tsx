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
