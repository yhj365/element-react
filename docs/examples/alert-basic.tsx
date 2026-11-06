import { Alert, Space } from 'element-react';

/** 不同语义、图标、描述和关闭通知。 */
export default function Example() {
  return (
    <Space direction="vertical" fill>
      <Alert title="操作成功" type="success" showIcon description="数据已经保存。" />
      <Alert title="请注意" type="warning" showIcon closeText="知道了">
        继续前请检查输入内容。
      </Alert>
      <Alert title="提示" effect="dark" closable={false} />
    </Space>
  );
}
