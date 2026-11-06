import { useState } from 'react';
import { Button, useMessageBox } from 'element-react';

/** Promise结果显式区分确认和取消，业务决定结果的展示方式。 */
export default function Example() {
  const box = useMessageBox();
  const [result, setResult] = useState('等待操作');
  return (
    <div>
      <Button
        onClick={() => {
          void box
            .confirm('确定继续此操作吗？', '确认操作', { type: 'warning' })
            .then(() => setResult('已确认'))
            .catch(() => setResult('已取消'));
        }}
      >
        确认操作
      </Button>
      <Button
        onClick={() => {
          void box
            .prompt('请输入项目名称', '项目名称', {
              inputPlaceholder: '项目名称',
              inputPattern: /\S+/,
              inputErrorMessage: '名称不能为空',
            })
            .then((value) => setResult(typeof value === 'object' ? value.value : value))
            .catch(() => setResult('已取消'));
        }}
      >
        输入内容
      </Button>
      <p aria-live="polite">{result}</p>
    </div>
  );
}
