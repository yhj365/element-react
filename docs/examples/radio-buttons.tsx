import { RadioButton, RadioGroup } from 'element-react';

/** 切换选项时只保留一个选中值。 */
export default function Example() {
  return (
    <RadioGroup defaultValue="day">
      <RadioButton value="day">日</RadioButton>
      <RadioButton value="week">周</RadioButton>
      <RadioButton value="month">月</RadioButton>
    </RadioGroup>
  );
}
