import { SelectV2 } from 'element-react';
const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Option ${value}` }));
/** 官方select-v2/custom-tag对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        multiple
        defaultValue={[0, 1]}
        renderTag={({ data }) => <strong>Selected: {data.map((item) => item.label).join(', ')}</strong>}
      />
    </div>
  );
}
