import { useState } from 'react';
import { Switch, Space } from 'element-react';
import type { ChoiceValue } from 'element-react';

/** 原生switch语义、受控值、尺寸和加载状态。 */
export default function Example() {
  const [value, setValue] = useState<ChoiceValue>(false);
  return (
    <Space>
      <Switch value={value} onValueChange={setValue} ariaLabel="启用通知" />
      <Switch defaultValue loading ariaLabel="加载中" />
      <Switch disabled ariaLabel="禁用开关" />
    </Space>
  );
}
