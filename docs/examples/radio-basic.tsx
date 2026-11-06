import { Radio, RadioGroup } from 'element-react';

/** 选中值、尺寸与禁用由组统一管理。 */
export default function Example() {
  return (
    <RadioGroup defaultValue="a" ariaLabel="展示方式">
      <Radio value="a">列表</Radio>
      <Radio value="b">卡片</Radio>
      <Radio value="c" disabled>
        禁用项
      </Radio>
    </RadioGroup>
  );
}
