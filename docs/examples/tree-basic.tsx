import { Tree } from 'element-react';
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
/** 官方tree/basic对应场景。 */
export default function Example() {
  return (
    <div className="w-full">
      <Tree data={data} nodeKey="id" />
    </div>
  );
}
