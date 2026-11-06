import { useRef } from 'react';
import { Tree } from 'element-react';

/** 官方tree/multiple-times-load对应场景。 */
export default function Example() {
  const attempted = useRef(false);
  return (
    <div className="w-full">
      <Tree
        nodeKey="id"
        lazy
        load={(node, resolve, reject) => {
          if (node.level === 0) resolve([{ id: 1, label: 'Retry loading' }]);
          else if (!attempted.current) {
            attempted.current = true;
            reject();
          } else resolve([{ id: 11, label: 'Loaded after retry', isLeaf: true }]);
        }}
      />
    </div>
  );
}
