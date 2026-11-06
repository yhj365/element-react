import { useState } from 'react';
import { InputTag } from 'element-react';

/** 回车或逗号新增标签，支持拖动调整顺序。 */
export default function Example() {
  const [value, setValue] = useState<string[] | undefined>(['React', 'TypeScript']);
  return (
    <InputTag
      value={value}
      onValueChange={setValue}
      delimiter=","
      draggable
      clearable
      max={8}
      ariaLabel="项目标签"
      placeholder="输入标签后按回车"
    />
  );
}
