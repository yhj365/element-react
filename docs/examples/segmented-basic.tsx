import { Segmented } from 'element-react';

/** 标量或对象选项，支持禁用、方向和自定义内容。 */
export default function Example() {
  return (
    <Segmented
      defaultValue="list"
      options={[
        { label: '列表', value: 'list' },
        { label: '卡片', value: 'card' },
        { label: '图表', value: 'chart', disabled: true },
      ]}
      ariaLabel="视图"
    />
  );
}
