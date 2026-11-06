import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { useMemo } from 'react';

/** 对本地示例做 TSX 语法着色；Prism 会转义源码中的 HTML。 */
export function SourceCode({ code }: { code: string }) {
  const html = useMemo(() => Prism.highlight(code, Prism.languages.tsx, 'tsx'), [code]);
  return (
    <pre className="code-block language-tsx">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
