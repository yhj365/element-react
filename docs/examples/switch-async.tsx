import { Switch } from 'element-react';

/** 异步确认通过后才更新开关，等待期间阻止重复操作。 */
export default function Example() {
  return (
    <Switch
      ariaLabel="异步开关"
      beforeChange={() => new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 500))}
    />
  );
}
