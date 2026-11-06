import { useState } from 'react';
import { Input, Space, Text } from 'element-react';

/** 受控输入、原生属性与输入法处理。 */
export default function Example() {
  const [value, setValue] = useState('');
  return (
    <Space direction="vertical" fill>
      <Input value={value} onValueChange={setValue} placeholder="请输入内容" aria-label="基础输入" />
      <Text type="info">当前值：{value || '尚未输入'}</Text>
      <Input disabled placeholder="禁用输入" />
      <Input readOnly defaultValue="只读内容" />
    </Space>
  );
}
