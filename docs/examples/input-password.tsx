import { Input } from 'element-react';

/** 切换密码可见性，并显示输入字数。 */
export default function Example() {
  return (
    <Input
      defaultValue="secret"
      showPassword
      showWordLimit
      maxLength={20}
      wordLimitPosition="outside"
      aria-label="密码"
    />
  );
}
