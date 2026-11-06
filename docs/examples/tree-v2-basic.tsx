import { TreeV2 } from 'element-react';
const data = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Node ${id}` }));
/** 官方tree-v2/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <TreeV2 data={data} height={240} />
    </div>
  );
}
