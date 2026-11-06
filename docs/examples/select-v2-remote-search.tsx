import { SelectV2 } from 'element-react';
const options: { value: string; label: string }[] = [];
/** 官方select-v2/remote-search对应场景。 */
export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <SelectV2
        options={options}
        ariaLabel="Virtualized selection"
        filterable
        remote
        remoteMethod={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return [{ value: query, label: `Result: ${query}` }];
        }}
      />
    </div>
  );
}
