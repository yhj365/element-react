import { SelectV2 } from 'element-react';
const options = [
  {
    label: 'Frontend',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vite', label: 'Vite' },
    ],
  },
  { label: 'Backend', options: [{ value: 'node', label: 'Node.js' }] },
];
/** 官方select-v2/grouping对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" />
    </div>
  );
}
