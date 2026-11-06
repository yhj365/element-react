import { Result, Button } from 'element-react';

/** 展示操作结果并提供后续动作。 */
export default function Example() {
  return (
    <Result
      icon="success"
      title="提交成功"
      subTitle="你可以继续查看处理结果。"
      renderExtra={<Button type="primary">返回列表</Button>}
    />
  );
}
