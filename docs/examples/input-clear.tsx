import { useRef } from 'react';
import { Input, Button, Space } from 'element-react';
import type { InputHandle } from 'element-react';

/** 清空通知与逐字输入、提交事件分别处理。 */
export default function Example() {
  const ref = useRef<InputHandle>(null);
  return (
    <Space>
      <Input ref={ref} defaultValue="可清空内容" clearable aria-label="可清空输入" />
      <Button onClick={() => ref.current?.focus()}>聚焦</Button>
      <Button onClick={() => ref.current?.clear()}>清空</Button>
    </Space>
  );
}
