import { useState } from 'react';
import { Rate, Space } from 'element-react';

/** 鼠标预览、半星、清零和只读分数展示。 */
export default function Example() {
  const [value, setValue] = useState(3);
  return (
    <Space direction="vertical" alignment="start">
      <Rate value={value} onValueChange={setValue} allowHalf clearable showText ariaLabel="评价" />
      <Rate value={3.7} disabled showScore scoreTemplate="{value} 分" />
      <Rate defaultValue={2} colors={['#f56c6c', '#e6a23c', '#67c23a']} showText />
    </Space>
  );
}
