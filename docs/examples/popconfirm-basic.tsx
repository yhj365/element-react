import { useState } from 'react';
import { Button, Popconfirm, Text, Space } from 'element-react';
/** 确认和取消分别通知，业务操作由调用方执行。 */
export default function Example() {
  const [message, setMessage] = useState('');
  return (
    <Space>
      <Popconfirm
        title="确定删除这条记录吗？"
        confirmButtonText="确定"
        cancelButtonText="取消"
        onConfirm={() => setMessage('已确认')}
        onCancel={() => setMessage('已取消')}
        renderReference={
          <Button type="danger" plain>
            删除记录
          </Button>
        }
      />
      <Text>{message}</Text>
    </Space>
  );
}
