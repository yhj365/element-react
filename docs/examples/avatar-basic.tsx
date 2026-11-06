import { Avatar, Glyph, Space } from 'element-react';

/** 文字、图标和图片加载失败回退。 */
export default function Example() {
  return (
    <Space>
      <Avatar size={48}>ER</Avatar>
      <Avatar shape="square" size="large" icon={<Glyph name="info" />} />
      <Avatar src="data:image/png;base64,invalid" alt="示例头像">
        回退
      </Avatar>
    </Space>
  );
}
