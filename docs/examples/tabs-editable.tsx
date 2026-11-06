import { useRef, useState } from 'react';
import { Tabs, TabPane } from 'element-react';

/** 调用方通过事件更新实际面板列表。 */
export default function Example() {
  const [items, setItems] = useState(['1', '2']);
  const count = useRef(2);
  return (
    <Tabs
      editable
      closable
      defaultValue="1"
      onTabAdd={() => setItems([...items, String(++count.current)])}
      onTabRemove={(name) => setItems(items.filter((item) => item !== name))}
    >
      {items.map((item) => (
        <TabPane key={item} name={item} label={'标签 ' + item}>
          内容 {item}
        </TabPane>
      ))}
    </Tabs>
  );
}
