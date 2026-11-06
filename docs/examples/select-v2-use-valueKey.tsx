import { SelectV2 } from 'element-react';
const options = [
  { value: { id: 1 }, label: 'React' },
  { value: { id: 2 }, label: 'TypeScript' },
];
/** 官方select-v2/use-valueKey对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" valueKey="id" />
    </div>
  );
}
