import { Tabs, TabPane } from 'element-react';

/** 支持激活值、不同位置和自定义页签内容。 */
export default function Example() {
  return (
    <Tabs defaultValue="first">
      <TabPane name="first" label="组件说明">
        这是组件的说明内容。
      </TabPane>
      <TabPane name="second" label="示例">
        这是可运行示例。
      </TabPane>
      <TabPane name="disabled" label="禁用" disabled>
        禁用页签。
      </TabPane>
    </Tabs>
  );
}
