import { Empty, Button } from 'element-react';

/** 说明和底部动作可以自定义。 */
export default function Example() {
  return (
    <Empty description="暂无匹配数据">
      <Button type="primary">创建第一条数据</Button>
    </Empty>
  );
}
