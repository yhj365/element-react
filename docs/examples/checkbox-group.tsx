import { useState } from 'react';
import { Checkbox, CheckboxGroup } from 'element-react';
import type { ChoiceValue } from 'element-react';

/** 组值保持不可变，最少和最多选择数量可配置。 */
export default function Example() {
  const [value, setValue] = useState<ChoiceValue[]>(['a']);
  return (
    <CheckboxGroup value={value} onValueChange={setValue} min={1} max={2} ariaLabel="功能选择">
      <Checkbox value="a">组件</Checkbox>
      <Checkbox value="b">主题</Checkbox>
      <Checkbox value="c">文档</Checkbox>
    </CheckboxGroup>
  );
}
