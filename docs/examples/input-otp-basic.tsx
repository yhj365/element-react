import { useState } from 'react';
import { InputOtp } from 'element-react';

/** 完成输入后展示提交值；数字校验保留前导零。 */
export default function Example() {
  const [value, setValue] = useState('');
  const [finished, setFinished] = useState('');
  return (
    <div>
      <InputOtp
        ariaLabel="验证码"
        value={value}
        onValueChange={setValue}
        onFinish={setFinished}
        validator={(char) => /^\d?$/.test(char)}
        inputMode="numeric"
        separator={(index) => (index === 2 ? '-' : null)}
      />
      <p aria-live="polite">完成输入：{finished || '等待输入'}</p>
    </div>
  );
}
