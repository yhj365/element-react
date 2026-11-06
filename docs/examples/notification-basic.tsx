import { Button, Notification, Space } from 'element-react';
/** 不同方向的通知分别堆叠，duration为0时持续展示。 */
export default function Example() {
  return (
    <Space>
      <Button onClick={() => Notification.success({ title: '操作成功', message: '数据已保存。' })}>
        成功通知
      </Button>
      <Button
        onClick={() =>
          Notification({
            title: '持续通知',
            message: '可点击关闭按钮。',
            duration: 0,
            position: 'bottom-right',
          })
        }
      >
        右下角通知
      </Button>
      <Button onClick={() => Notification.closeAll()}>关闭全部</Button>
    </Space>
  );
}
