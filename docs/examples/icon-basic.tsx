import { Icon, Glyph, Space } from 'element-react';

/** SVG图形继承图标容器的尺寸与颜色。 */
export default function Example() {
  return (
    <Space>
      <Icon size={24} color="#409eff">
        <Glyph name="check" />
      </Icon>
      <Icon size="32px" color="#67c23a">
        <Glyph name="info" />
      </Icon>
    </Space>
  );
}
