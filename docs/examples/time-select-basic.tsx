import { useState } from 'react';
import { TimeSelect } from 'element-react';
import type { TimeSelectValue } from 'element-react';

/** 固定间隔选项包含末尾时间，并禁用指定边界之外的选项。 */
export default function Example() {
  const [value, setValue] = useState<TimeSelectValue>();
  return (
    <TimeSelect
      value={value}
      onValueChange={setValue}
      start="08:30"
      end="18:00"
      step="00:15"
      minTime="09:00"
      maxTime="17:30"
      placeholder="选择时间"
      ariaLabel="会议时间"
    />
  );
}
