import { SelectV2 } from 'element-react';
const options = [
  { key: 0, title: 'React' },
  { key: 1, title: 'TypeScript' },
];
/** 官方select-v2/props对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        props={{ value: 'key', label: 'title' }}
      />
    </div>
  );
}
