import { useState } from 'react';
import { Input } from 'element-react';

/** 绑定值与显示格式独立。 */
export default function Example() {
  const [value, setValue] = useState('1234');
  return (
    <Input
      value={value}
      onValueChange={setValue}
      formatter={(text) => '$' + text}
      parser={(text) => text.replace(/\$/g, '')}
      aria-label="金额"
    />
  );
}
