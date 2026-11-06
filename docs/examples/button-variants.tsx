import { Button, Space } from 'element-react';

/** 语义色、尺寸以及朴素、文字、圆角和虚线按钮。 */
export default function Example() {
  return (
    <Space wrap>
      {(['primary', 'success', 'info', 'warning', 'danger'] as const).map((type) => (
        <Button key={type} type={type}>
          {type}
        </Button>
      ))}
      <Button plain>朴素</Button>
      <Button text bg>
        文字
      </Button>
      <Button link>链接</Button>
      <Button round>圆角</Button>
      <Button circle>+</Button>
      <Button dashed>虚线</Button>
      <Button size="small">小尺寸</Button>
      <Button size="large">大尺寸</Button>
    </Space>
  );
}
