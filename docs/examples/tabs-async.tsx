import { Tabs, TabPane } from 'element-react';

/** 较旧的异步结果不能覆盖新的切换请求。 */
export default function Example() {
  return (
    <Tabs defaultValue="a" beforeLeave={() => Promise.resolve(true)}>
      <TabPane name="a" label="页面一">
        页面一内容
      </TabPane>
      <TabPane name="b" label="页面二">
        页面二内容
      </TabPane>
    </Tabs>
  );
}
