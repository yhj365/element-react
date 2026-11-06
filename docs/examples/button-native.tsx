import { Button, Space } from 'element-react';

/** 提交、重置和自定义标签的禁用保护。 */
export default function Example() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Space>
        <Button nativeType="submit" type="primary">
          提交
        </Button>
        <Button nativeType="reset">重置</Button>
        <Button tag="a" disabled>
          禁用链接
        </Button>
      </Space>
    </form>
  );
}
