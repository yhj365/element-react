# Steps 步骤条

由active控制的步骤进度和展示状态。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 步骤状态

由active控制的步骤进度和展示状态。

```tsx
import { useState } from 'react';
import { Button, Step, Steps } from 'element-react';

/** 步骤状态由active驱动，调用方控制实际流程推进。 */
export default function Example() {
  const [active, setActive] = useState(1);
  return (
    <>
      <Steps active={active} finishStatus="success" alignCenter>
        <Step title="填写信息" description="输入基本信息" />
        <Step title="确认内容" description="核对后提交" />
        <Step title="完成" description="查看结果" />
      </Steps>
      <Button onClick={() => setActive((active + 1) % 4)}>下一步</Button>
    </>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Steps Attributes | space | space | the spacing of each step, will be responsive if omitted. Supports percentage. | number / string | '' |
| Steps Attributes | direction | direction | display direction | enum'vertical' \| 'horizontal' | horizontal |
| Steps Attributes | active | active | current activation step | number | 0 |
| Steps Attributes | process-status | processStatus | status of current step | enum'wait' \| 'process' \| 'finish' \| 'error' \| 'success' | process |
| Steps Attributes | finish-status | finishStatus | status of end step | enum'wait' \| 'process' \| 'finish' \| 'error' \| 'success' | finish |
| Steps Attributes | align-center | alignCenter | center title and description | boolean | — |
| Steps Attributes | simple | simple | whether to apply simple theme | boolean | — |
| Steps Events | change | onChange | triggers when the active step changes |  | — |
| Steps Slots | default | children | customize default content |  | — |
| Step Attributes | title | title | step title | string | '' |
| Step Attributes | description | description | step description | string | '' |
| Step Attributes | icon | icon | step custom icon. Icons can be passed via named slot as well | string / Component | — |
| Step Attributes | status | status | current status. It will be automatically set by Steps if not configured. | enum'' \| 'wait' \| 'process' \| 'finish' \| 'error' \| 'success' | '' |
| Step Slots | icon | renderIcon | custom icon |  | — |
| Step Slots | title | renderTitle | step title |  | — |
| Step Slots | description | renderDescription | step description |  | — |

## 完成记录

- [x] steps:86 space；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:87 direction；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:88 active；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:89 processStatus；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:90 finishStatus；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:91 alignCenter；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:92 simple；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:98 onChange；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:104 children；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:112 title；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:113 description；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:114 icon；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:115 status；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:121 renderIcon；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:122 renderTitle；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] steps:123 renderDescription；实现：packages/components/steps/index.tsx；测试：tests/navigation-extra.test.tsx
