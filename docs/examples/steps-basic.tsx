import { useState } from 'react';
import { Button, Step, Steps } from 'element-react';

/** 步骤状态由active驱动，调用方控制实际流程推进。 */
export default function Example() {
  const [active, setActive] = useState(1);
  return (
    <>
      <Steps active={active} finishStatus="success" alignCenter>
        <Step title="填写信息" description="输入基本信息" />
        <Step title="确认内容" description="核对后提交" />
        <Step title="完成" description="查看结果" />
      </Steps>
      <Button onClick={() => setActive((active + 1) % 4)}>下一步</Button>
    </>
  );
}
