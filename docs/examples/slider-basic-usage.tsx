import { Slider } from 'element-react';
/** 对照 Element Plus slider/basic-usage 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider aria-label="Default value" />
      <Slider defaultValue={50} aria-label="Customized initial value" />
      <Slider defaultValue={30} showTooltip={false} />
      <Slider defaultValue={40} formatTooltip={(value) => value / 100} />
      <Slider defaultValue={50} disabled />
    </div>
  );
}
