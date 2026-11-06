import { TreeSelect } from 'element-react';

/** 官方tree-select/lazy对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect
        ariaLabel="Tree selection"
        lazy
        load={(node, resolve) =>
          resolve(
            node.level === 0
              ? [{ value: 1, label: 'Lazy root' }]
              : [{ value: 11, label: 'Lazy leaf', isLeaf: true }],
          )
        }
        cacheData={[{ value: 11, currentLabel: 'Lazy leaf' }]}
        defaultValue={11}
      />
    </div>
  );
}
