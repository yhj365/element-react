import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['reference/**', 'dist/**', 'dist-docs/**', 'docs/src/generated/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': hooks },
    languageOptions: { globals: { document: 'readonly', window: 'readonly', HTMLElement: 'readonly', requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly', ResizeObserver: 'readonly', getComputedStyle: 'readonly', navigator: 'readonly', HTMLInputElement: 'readonly', HTMLTextAreaElement: 'readonly', console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly', localStorage: 'readonly', URL: 'readonly', Event: 'readonly', KeyboardEvent: 'readonly', MouseEvent: 'readonly', FocusEvent: 'readonly', Node: 'readonly', Element: 'readonly', HTMLButtonElement: 'readonly', HTMLDivElement: 'readonly', HTMLFormElement: 'readonly', HTMLSpanElement: 'readonly', SVGSVGElement: 'readonly' } },
    rules: { ...hooks.configs.recommended.rules, '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] },
  },
);
