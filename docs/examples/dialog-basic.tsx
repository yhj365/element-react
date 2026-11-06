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
