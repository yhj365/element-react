import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/remote-search 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Remote search"
        debounce={300}
        highlightFirstItem
        fetchSuggestions={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return data.filter((item) => item.value.toLowerCase().includes(query.toLowerCase()));
        }}
      />
    </div>
  );
}
