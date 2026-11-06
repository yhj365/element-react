import { ConfigProvider, Button, Input, Space } from 'element-react';

/** 局部配置覆盖上级，未指定的字段继续继承。 */
export default function Example() {
  return (
    <ConfigProvider size="small" button={{ type: 'primary', plain: true }} locale="zh-cn">
      <Space>
        <Button>继承配置</Button>
        <ConfigProvider button={{ plain: false }}>
          <Button>局部覆盖</Button>
        </ConfigProvider>
        <Input defaultValue="中文清空按钮" clearable />
      </Space>
    </ConfigProvider>
  );
}
