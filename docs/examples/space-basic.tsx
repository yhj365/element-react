import { Space, Button } from 'element-react';

/** 支持方向、换行、数组间距和分隔内容。 */
export default function Example() {
  return (
    <Space size={[16, 12]} wrap spacer="/">
      <Button>首页</Button>
      <Button>文档</Button>
      <Button>示例</Button>
    </Space>
  );
}
