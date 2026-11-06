import { Autocomplete } from 'element-react';
const data = [
  { value: 'React', url: 'https://react.dev' },
  { value: 'TypeScript', url: 'https://typescriptlang.org' },
  { value: 'Vite', url: 'https://vite.dev' },
];
/** 官方 autocomplete/autocomplete 对应的 React 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <Autocomplete
        aria-label="Search technology"
        clearable
        fetchSuggestions={(query, callback) =>
          callback(data.filter((item) => item.value.toLowerCase().includes(query.toLowerCase())))
        }
      />
      <Autocomplete aria-label="Search on input" triggerOnFocus={false} fetchSuggestions={data} />
    </div>
  );
}
