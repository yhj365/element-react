# Result 结果

展示操作结果并提供后续动作。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 结果反馈

展示操作结果并提供后续动作。

```tsx
import { Result, Button } from 'element-react';

/** 展示操作结果并提供后续动作。 */
export default function Example() {
  return (
    <Result
      icon="success"
      title="提交成功"
      subTitle="你可以继续查看处理结果。"
      renderExtra={<Button type="primary">返回列表</Button>}
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | title | title | title of result | string | '' |
| Attributes | sub-title | subTitle | sub title of result | string | '' |
| Attributes | icon | icon | icon type of result | enum'primary' (2.9.11) \| 'success' \| 'warning' \| 'info' \| 'error' | info |
| Slots | icon | renderIcon | content as result icon |  | — |
| Slots | title | renderTitle | content as result title |  | — |
| Slots | sub-title | renderSubTitle | content as result sub title |  | — |
| Slots | extra | renderExtra | content as result extra area |  | — |

## 完成记录

- [x] result:32 title；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] result:33 subTitle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] result:34 icon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] result:40 renderIcon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] result:41 renderTitle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] result:42 renderSubTitle；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] result:43 renderExtra；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
