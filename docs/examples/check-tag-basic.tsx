import { useState } from 'react';
import { CheckTag, Space } from 'element-react';

/** 支持受控勾选和键盘操作。 */
export default function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Space>
      <CheckTag checked={checked} onCheckedChange={setChecked}>
        React
      </CheckTag>
      <CheckTag defaultChecked type="success">
        TypeScript
      </CheckTag>
      <CheckTag disabled>禁用</CheckTag>
    </Space>
  );
}
