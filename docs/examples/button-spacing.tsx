import { Button, Space } from 'element-react';

/** 两个汉字可自动展开间距，实例状态随属性更新。 */
export default function Example() {
  return (
    <Space>
      <Button autoInsertSpace>保存</Button>
      <Button>保存</Button>
    </Space>
  );
}
