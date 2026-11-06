# Backtop 回到顶部

达到阈值后显示回顶操作。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 容器回顶

达到阈值后显示回顶操作。

```tsx
import { useId } from 'react';
import { Backtop } from 'element-react';
/** 指定容器滚动超过阈值后出现回顶按钮。 */
export default function Example() {
  const id = 'backtop-' + useId().replace(/[^a-z0-9_-]/gi, '');
  return (
    <>
      <div
        id={id}
        style={{ height: 180, overflow: 'auto', border: '1px solid var(--el-border-color)', padding: 16 }}
      >
        <p>向下滚动这个容器查看回到顶部按钮。</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>内容区域 {i + 1}</p>
        ))}
      </div>
      <Backtop target={'#' + id} visibilityHeight={100} right={48} bottom={48} />
    </>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | target | target | the target to trigger scroll. | string | — |
| Attributes | visibility-height | visibilityHeight | the button will not show until the scroll height reaches this value. | number | 200 |
| Attributes | right | right | right distance. | number | 40 |
| Attributes | bottom | bottom | bottom distance. | number | 40 |
| Events | click | onClick | triggers when click. |  | — |
| Slots | default | children | customize default content. |  | — |

## 完成记录

- [x] backtop:36 target；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] backtop:37 visibilityHeight；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] backtop:38 right；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] backtop:39 bottom；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] backtop:45 onClick；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
- [x] backtop:51 children；实现：packages/components/scroll-tools/index.tsx；测试：tests/scroll-image.test.tsx
