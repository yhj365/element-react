import { Switch, Space } from 'element-react';

/** 开关两侧及内部提示可自定义。 */
export default function Example() {
  return (
    <Space>
      <Switch activeText="开启" inactiveText="关闭" />
      <Switch inlinePrompt activeText="是" inactiveText="否" defaultValue />
      <Switch renderActive="已启用" renderInactive="已停用" renderActiveAction="✓" />
    </Space>
  );
}
