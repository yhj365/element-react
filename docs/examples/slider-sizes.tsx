import { Slider } from 'element-react';
/** 对照 Element Plus slider/sizes 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider defaultValue={30} size="large" />
      <Slider defaultValue={40} />
      <Slider defaultValue={50} size="small" />
    </div>
  );
}
