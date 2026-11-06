import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-width对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        fitInputWidth={false}
        popperStyle={{ width: 320 }}
      />
    </div>
  );
}
