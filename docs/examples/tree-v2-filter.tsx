import { useRef } from 'react';
import { TreeV2, Input } from 'element-react';
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
/** 官方tree-v2/filter对应场景。 */
export default function Example() {
  const tree = useRef<TreeHandle>(null);
  return (
    <div className="w-full">
      <Input aria-label="Filter virtual tree" onValueChange={(query) => tree.current?.filter(query)} />
      <TreeV2
        data={data}
        height={240}
        ref={tree}
        filterMethod={(query, data) => String(data.label).includes(String(query))}
      />
    </div>
  );
}
