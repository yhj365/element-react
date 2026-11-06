import { useState } from 'react';
import { InfiniteScroll } from 'element-react';

/** 内容不足会继续补充，达到上限后由业务关闭加载。 */
export default function Example() {
  const [count, setCount] = useState(6);
  return (
    <InfiniteScroll
      onLoad={() => setCount((value) => Math.min(60, value + 6))}
      disabled={count >= 60}
      distance={12}
      className="h-56 overflow-auto"
    >
      <ul className="m-0 list-none space-y-2 p-2">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="bg-[var(--el-color-primary-light-9)] p-3 text-center">
            {index + 1}
          </li>
        ))}
      </ul>
      {count >= 60 && <p>已加载全部内容</p>}
    </InfiniteScroll>
  );
}
