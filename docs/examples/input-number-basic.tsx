import { useState } from 'react';
import { InputNumber } from 'element-react';

/** 支持步长、精度、边界与键盘增减。 */
export default function Example() {
  const [value, setValue] = useState<number | null>(2);
  return (
    <InputNumber
      value={value}
      onValueChange={setValue}
      min={0}
      max={10}
      step={0.5}
      precision={1}
      controlsPosition="right"
    />
  );
}
