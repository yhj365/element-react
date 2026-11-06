import { Slider } from 'element-react';
/** 对照 Element Plus slider/show-marks 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider
        range
        defaultValue={[30, 60]}
        marks={{ 0: '0°C', 8: '8°C', 37: '37°C', 50: { label: '50%', style: { color: '#1989fa' } } }}
      />
    </div>
  );
}
