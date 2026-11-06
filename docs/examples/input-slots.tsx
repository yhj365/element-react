import { Input } from 'element-react';

/** 可组合前缀、后缀及输入框前后置区域。 */
export default function Example() {
  return (
    <Input
      renderPrepend="https://"
      renderAppend=".com"
      renderPrefix="地址"
      placeholder="example"
      aria-label="网站地址"
    />
  );
}
