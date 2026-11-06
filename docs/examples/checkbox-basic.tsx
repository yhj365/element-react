import { Checkbox, Space } from 'element-react';

/** 独立勾选、半选和禁用。 */
export default function Example() {
  return (
    <Space>
      <Checkbox defaultChecked>默认勾选</Checkbox>
      <Checkbox indeterminate>半选</Checkbox>
      <Checkbox disabled>禁用</Checkbox>
    </Space>
  );
}
