import { Button, Glyph, Space } from 'element-react';

/** 加载状态阻止重复操作，可替换加载内容。 */
export default function Example() {
  return (
    <Space wrap>
      <Button icon={<Glyph name="check" />}>保存</Button>
      <Button loading>提交中</Button>
      <Button disabled>禁用</Button>
      <Button loading renderLoading={<span>处理中…</span>}>
        任务
      </Button>
      <Button renderIcon={<Glyph name="arrow" />}>下一步</Button>
    </Space>
  );
}
