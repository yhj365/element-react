import { CheckboxButton, CheckboxGroup } from 'element-react';

/** 与复选组共享值模型。 */
export default function Example() {
  return (
    <CheckboxGroup defaultValue={['react']}>
      <CheckboxButton value="react">React</CheckboxButton>
      <CheckboxButton value="typescript">TypeScript</CheckboxButton>
      <CheckboxButton value="css" disabled>
        CSS
      </CheckboxButton>
    </CheckboxGroup>
  );
}
