# Affix 固钉

保留占位与容器边界约束。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 固定定位

保留占位与容器边界约束。

```tsx
import { Affix, Button } from 'element-react';
/** 固定元素保留原占位，并受目标容器边界约束。 */
export default function Example() {
  return (
    <div>
      <Affix offset={80}>
        <Button type="primary">距离顶部 80px 固定</Button>
      </Affix>
      <p>滚动页面时查看固定效果。</p>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | offset | offset | offset distance | number | 0 |
| Attributes | position | position | position of affix | enum'top' \| 'bottom' | top |
| Attributes | target | target | target container (CSS selector) | string | — |
| Attributes | z-index | zIndex | `z-index` of affix | number | 100 |
| Slots | default | children | customize default content |  | — |
| Exposes | update | ref.current.update | update affix state manually | Function() => void | — |
| Exposes | updateRoot | ref.current.updateRoot | update rootRect info | Function() => void | — |

## 完成记录

- [x] affix:46 offset；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] affix:47 position；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] affix:48 target；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] affix:49 zIndex；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] affix:64 children；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] affix:70 ref.current.update；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] affix:71 ref.current.updateRoot；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
