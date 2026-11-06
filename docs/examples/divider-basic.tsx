import { Divider } from 'element-react';

/** 水平内容位置、边框样式与垂直分隔。 */
export default function Example() {
  return (
    <div>
      <p>上方内容</p>
      <Divider contentPosition="left" borderStyle="dashed">
        分隔文字
      </Divider>
      <p>下方内容</p>
      <span>
        首页
        <Divider direction="vertical" />
        文档
      </span>
    </div>
  );
}
