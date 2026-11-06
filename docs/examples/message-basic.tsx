import { Button, Message, Space, useMessage } from 'element-react';
/** 静态服务与Provider绑定的消息服务均支持实例关闭。 */
export default function Example() {
  const message = useMessage();
  return (
    <Space>
      <Button onClick={() => message.success('保存成功')}>成功消息</Button>
      <Button onClick={() => message({ message: '可关闭提示', showClose: true, duration: 0 })}>
        持续消息
      </Button>
      <Button onClick={() => Message({ message: '重复消息', grouping: true })}>合并重复</Button>
      <Button onClick={() => Message.closeAll()}>关闭全部</Button>
    </Space>
  );
}
