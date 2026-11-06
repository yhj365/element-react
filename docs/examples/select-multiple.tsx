import { useState } from 'react';
import { Select } from 'element-react';
import type { SelectModel } from 'element-react';

/** 多选限制、标签折叠和自建选项共用同一值模型。 */
export default function Example() {
  const [value, setValue] = useState<SelectModel<string>>(['Vue', 'React']);
  return (
    <Select<string>
      ariaLabel="技术栈"
      multiple
      filterable
      allowCreate
      defaultFirstOption
      collapseTags
      maxCollapseTags={2}
      multipleLimit={4}
      value={value}
      onValueChange={setValue}
      options={['Vue', 'React', 'Angular', 'Svelte'].map((value) => ({ value, label: value }))}
    />
  );
}
