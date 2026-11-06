import { Tree } from 'element-react';

/** 官方tree/custom-leaf对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree
        nodeKey="id"
        lazy
        load={(node, resolve) =>
          resolve(
            node.level === 0
              ? [{ id: 1, label: 'Lazy root' }]
              : [{ id: 11, label: 'Lazy leaf', isLeaf: true }],
          )
        }
      />
    </div>
  );
}
