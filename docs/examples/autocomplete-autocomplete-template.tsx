import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/autocomplete-template 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Custom suggestions"
        fetchSuggestions={data}
        renderSuggestion={(item) => (
          <div>
            <strong>{String(item.value)}</strong>
            <small className="ml-4 text-gray-500">{String(item.url)}</small>
          </div>
        )}
        renderPrefix={<span>⌕</span>}
      />
    </div>
  );
}
