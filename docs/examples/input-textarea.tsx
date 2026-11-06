import { Input } from 'element-react';

/** 支持行数和原生resize方向。 */
export default function Example() {
  return <Input type="textarea" rows={4} resize="vertical" placeholder="请输入说明" aria-label="说明" />;
}
