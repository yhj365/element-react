import { useState } from 'react';
import { Countdown } from 'element-react';

/** 按照绝对截止时间更新，完成通知只触发一次。 */
export default function Example() {
  const [deadline] = useState(() => Date.now() + 3600000);
  return <Countdown title="距离开始" value={deadline} format="HH:mm:ss" />;
}
