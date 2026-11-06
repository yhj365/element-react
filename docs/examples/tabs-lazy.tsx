import { Tabs, TabPane, Input } from 'element-react';

/** 第一次激活后保留挂载，切换回来仍保留输入内容。 */
export default function Example() {
  return (
    <Tabs defaultValue="a">
      <TabPane name="a" label="首页">
        先点击表单标签。
      </TabPane>
      <TabPane name="b" label="表单" lazy>
        <Input placeholder="切换后输入仍保留" />
      </TabPane>
    </Tabs>
  );
}
