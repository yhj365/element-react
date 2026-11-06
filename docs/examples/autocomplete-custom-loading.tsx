import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/custom-loading 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Custom loading"
        fetchSuggestions={async () => {
          await new Promise((resolve) => setTimeout(resolve, 700));
          return data;
        }}
        renderLoading={<span>Loading suggestions…</span>}
      />
    </div>
  );
}
