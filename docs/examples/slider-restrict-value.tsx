import { Slider } from 'element-react';
/** 对照 Element Plus slider/restrict-value 场景。 */
export default function Example() {
  return (
    <div className="flex w-full flex-col gap-8 p-4">
      <Slider
        defaultValue={37}
        step="mark"
        marks={{ 0: '0°C', 8: '8°C', 37: '37°C', 50: '50°C', 100: '100°C' }}
      />
    </div>
  );
}
