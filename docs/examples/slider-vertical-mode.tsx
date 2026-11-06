import { Slider } from 'element-react';
/** 对照 Element Plus slider/vertical-mode 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider vertical height="200px" defaultValue={30} />
      <Slider vertical height="200px" range defaultValue={[20, 70]} />
    </div>
  );
}
