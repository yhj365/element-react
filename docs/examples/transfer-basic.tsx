import { useState } from 'react';
import { Transfer } from 'element-react';

const data = Array.from({ length: 12 }, (_, index) => ({
  key: index,
  label: `选项 ${index + 1}`,
  disabled: index === 3,
}));
/** 已选模型由调用方维护，左右勾选只决定下一次移动的内容。 */
export default function Example() {
  const [value, setValue] = useState<Array<string | number>>([1, 4]);
  return (
    <Transfer
      data={data}
      value={value}
      onValueChange={setValue}
      filterable
      titles={['可选项目', '已选项目']}
      buttonTexts={['移除', '添加']}
    />
  );
}
