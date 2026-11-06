import { Collapse, CollapseItem } from 'element-react';

/** 标题和图标接收当前展开状态。 */
export default function Example() {
  return (
    <Collapse accordion>
      <CollapseItem
        name="a"
        renderTitle={(active) => (active ? '收起详情' : '展开详情')}
        renderIcon={(active) => (active ? '−' : '+')}
      >
        这里是内容。
      </CollapseItem>
      <CollapseItem name="b" title="禁用面板" disabled>
        不可打开。
      </CollapseItem>
    </Collapse>
  );
}
