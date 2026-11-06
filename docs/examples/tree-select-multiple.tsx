import { TreeSelect } from 'element-react';
const data = [
  {
    value: 1,
    label: 'Level one 1',
    children: [
      { value: 11, label: 'Level two 1-1' },
      { value: 12, label: 'Level two 1-2', disabled: true },
    ],
  },
  { value: 2, label: 'Level one 2', children: [{ value: 21, label: 'Level two 2-1' }] },
];
/** 官方tree-select/multiple对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <TreeSelect data={data} ariaLabel="Tree selection" multiple showCheckbox clearable />
    </div>
  );
}
