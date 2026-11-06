import { Text, Space } from 'element-react';

/** 文字语义、尺寸及单行、多行截断。 */
export default function Example() {
  return (
    <Space direction="vertical" alignment="start">
      <Text>默认文字</Text>
      <Text type="primary">主要文字</Text>
      <Text size="small" type="info">
        辅助说明
      </Text>
      <Text truncated style={{ width: 180 }}>
        这是一段超出容器宽度后会截断的文字内容
      </Text>
      <Text lineClamp={2} style={{ width: 180 }}>
        多行文字超过两行时会省略。内容可以继续增长，但布局保持稳定，悬停可查看完整标题。
      </Text>
    </Space>
  );
}
