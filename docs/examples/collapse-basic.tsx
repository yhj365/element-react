import { Collapse, CollapseItem } from 'element-react';

/** 支持多项展开和手风琴。 */
export default function Example() {
  return (
    <Collapse defaultValue={['a']}>
      <CollapseItem name="a" title="组件设计">
        逻辑、样式和公开接口分别维护。
      </CollapseItem>
      <CollapseItem name="b" title="回归测试">
        每项完成能力都有测试证据。
      </CollapseItem>
    </Collapse>
  );
}
