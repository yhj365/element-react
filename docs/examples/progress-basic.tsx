import { Progress, Space } from 'element-react';

/** 线形与圆环进度、自定义文字和动画。 */
export default function Example() {
  return (
    <Space direction="vertical" fill>
      <Progress percentage={35} />
      <Progress percentage={70} color="#67c23a" striped stripedFlow />
      <Progress percentage={60} textInside strokeWidth={20} format={(value) => value + '%'} />
      <Space>
        <Progress type="circle" percentage={75} />
        <Progress type="dashboard" percentage={50} />
      </Space>
    </Space>
  );
}
