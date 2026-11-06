import { SelectV2 } from 'element-react';
const options = [
  { value: '', label: 'Empty string is a value' },
  { value: 0, label: 'Zero' },
];
/** 官方select-v2/empty-values对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2<string | number>
        options={options}
        ariaLabel="Virtualized selection"
        clearable
        defaultValue={''}
        emptyValues={[null, undefined]}
        valueOnClear={null}
      />
    </div>
  );
}
