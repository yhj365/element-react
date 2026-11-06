import { useState } from 'react';
import { Select, Option, OptionGroup } from 'element-react';
import type { SelectModel } from 'element-react';

/** 受控单选保留声明式选项与禁用分组。 */
export default function Example() {
  const [value, setValue] = useState<SelectModel<string>>('Shanghai');
  return (
    <Select<string>
      value={value}
      onValueChange={setValue}
      clearable
      filterable
      ariaLabel="城市"
      placeholder="选择城市"
    >
      <OptionGroup label="城市">
        <Option value="Shanghai" label="上海" />
        <Option value="Beijing" label="北京" />
        <Option value="Shenzhen" label="深圳" disabled />
      </OptionGroup>
    </Select>
  );
}
