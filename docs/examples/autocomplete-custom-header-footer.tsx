import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/custom-header-footer 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Header and footer"
        fetchSuggestions={data}
        renderHeader={<p className="px-4 py-2 font-semibold">Technologies</p>}
        renderFooter={<p className="px-4 py-2 text-gray-500">Use ↑ ↓ and Enter to select</p>}
      />
    </div>
  );
}
