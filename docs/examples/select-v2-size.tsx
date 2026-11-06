import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/size对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2 options={options} ariaLabel="Virtualized selection" size="large" />
    </div>
  );
}
