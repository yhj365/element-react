import { useRef } from 'react';
import { Anchor, AnchorLink } from 'element-react';

/** 目录滚动限定到示例容器，不改变文档站当前路由。 */
export default function Example() {
  const container = useRef<HTMLDivElement>(null);
  return (
    <div className="flex gap-6">
      <Anchor
        container={() => container.current}
        offset={8}
        selectScrollTop
        onClick={(event) => event.preventDefault()}
      >
        <AnchorLink href="#anchor-demo-one" title="第一节" />
        <AnchorLink href="#anchor-demo-two" title="第二节" />
        <AnchorLink href="#anchor-demo-three" title="第三节" />
      </Anchor>
      <div ref={container} className="h-60 flex-1 overflow-auto border border-[var(--el-border-color)] px-4">
        <section id="anchor-demo-one" className="h-48">
          <h3>第一节</h3>
        </section>
        <section id="anchor-demo-two" className="h-48">
          <h3>第二节</h3>
        </section>
        <section id="anchor-demo-three" className="h-60">
          <h3>第三节</h3>
        </section>
      </div>
    </div>
  );
}
