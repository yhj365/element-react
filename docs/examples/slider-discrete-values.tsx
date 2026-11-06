import { Slider } from 'element-react';
/** 对照 Element Plus slider/discrete-values 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider defaultValue={20} step={10} />
      <Slider defaultValue={40} step={10} showStops />
    </div>
  );
}
