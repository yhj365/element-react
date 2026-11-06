import { Button, Popover } from 'element-react';
/** reference与弹出内容分离，面板可以容纳交互内容。 */
export default function Example() {
  return (
    <Popover
      trigger="click"
      title="项目说明"
      width={260}
      renderReference={<Button type="primary">打开弹出框</Button>}
    >
      <p>这里是更丰富的内容区域。</p>
      <Button size="small">操作</Button>
    </Popover>
  );
}
