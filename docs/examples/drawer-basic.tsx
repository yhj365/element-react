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
