import { useState } from 'react';
import { Tag, Space } from 'element-react';

/** 点击关闭由调用方更新列表，组件不自行删除。 */
export default function Example() {
  const [items, setItems] = useState(['进行中', '已完成', '待确认']);
  return (
    <Space wrap>
      {items.map((item, index) => (
        <Tag
          key={item}
          closable
          type={(['primary', 'success', 'warning'] as const)[index]}
          effect="light"
          onClose={() => setItems(items.filter((value) => value !== item))}
        >
          {item}
        </Tag>
      ))}
      <Tag round effect="plain">
        圆角标签
      </Tag>
    </Space>
  );
}
