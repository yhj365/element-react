import { Button, ButtonGroup, Space } from 'element-react';

/** 组级尺寸和类型由后代继承，单个按钮可覆盖。 */
export default function Example() {
  return (
    <Space>
      <ButtonGroup size="small" type="primary">
        <Button>上一页</Button>
        <Button>下一页</Button>
      </ButtonGroup>
      <ButtonGroup direction="vertical">
        <Button>上</Button>
        <Button>下</Button>
      </ButtonGroup>
    </Space>
  );
}
