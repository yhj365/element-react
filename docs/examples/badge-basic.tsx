import { Badge, Button, Space } from 'element-react';

/** 支持最大数字、小圆点和自定义内容。 */
export default function Example() {
  return (
    <Space size={28} wrap>
      <Badge value={12}>
        <Button>消息</Button>
      </Badge>
      <Badge value={120} max={99}>
        <Button>通知</Button>
      </Badge>
      <Badge isDot>
        <Button>更新</Button>
      </Badge>
      <Badge value={3} type="success" renderContent={(value) => value + '条'}>
        <Button>完成</Button>
      </Badge>
    </Space>
  );
}
