import { useRef } from 'react';
import { Tree, Input } from 'element-react';
import type { TreeHandle } from 'element-react';
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      { id: 11, label: 'Level two 1-1' },
      { id: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { id: 2, label: 'Level one 2', children: [{ id: 21, label: 'Level two 2-1' }] },
];
/** 官方tree/filtering对应场景。 */
export default function Example() {
  const tree = useRef<TreeHandle>(null);
  return (
    <div className="w-full">
      <Input
        aria-label="Filter tree"
        placeholder="Filter keyword"
        onValueChange={(query) => tree.current?.filter(query)}
      />
      <Tree
        data={data}
        nodeKey="id"
        ref={tree}
        defaultExpandAll
        filterNodeMethod={(query, data) =>
          String(data.label).toLowerCase().includes(String(query).toLowerCase())
        }
      />
    </div>
  );
}
