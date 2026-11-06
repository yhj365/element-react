import { Affix, Button } from 'element-react';
/** 固定元素保留原占位，并受目标容器边界约束。 */
export default function Example() {
  return (
    <div>
      <Affix offset={80}>
        <Button type="primary">距离顶部 80px 固定</Button>
      </Affix>
      <p>滚动页面时查看固定效果。</p>
    </div>
  );
}
