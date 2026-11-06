import { useId } from 'react';
import { Backtop } from 'element-react';
/** 指定容器滚动超过阈值后出现回顶按钮。 */
export default function Example() {
  const id = 'backtop-' + useId().replace(/[^a-z0-9_-]/gi, '');
  return (
    <>
      <div
        id={id}
        style={{ height: 180, overflow: 'auto', border: '1px solid var(--el-border-color)', padding: 16 }}
      >
        <p>向下滚动这个容器查看回到顶部按钮。</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>内容区域 {i + 1}</p>
        ))}
      </div>
      <Backtop target={'#' + id} visibilityHeight={100} right={48} bottom={48} />
    </>
  );
}
