# Breadcrumb 面包屑

支持字符串/图标分隔符和链接。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 面包屑

支持字符串/图标分隔符和链接。

```tsx
import { Breadcrumb, BreadcrumbItem } from 'element-react';

/** 支持字符串/图标分隔符和链接。 */
export default function Example() {
  return (
    <Breadcrumb separator="/">
      <BreadcrumbItem to="#/components/button">首页</BreadcrumbItem>
      <BreadcrumbItem>组件</BreadcrumbItem>
      <BreadcrumbItem>文档</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Breadcrumb Attributes | separator | separator | separator character | string | / |
| Breadcrumb Attributes | separator-icon | separatorIcon | icon component of icon separator | string / Component | — |
| Breadcrumb Slots | default | children | customize default content |  | — |
| BreadcrumbItem Attributes | to | to | target route of the link, same as `to` of `vue-router` | string / objectRouteLocationRaw | '' |
| BreadcrumbItem Attributes | replace | replace | if `true`, the navigation will not leave a history record | boolean | false |
| BreadcrumbItem Slots | default | children | customize default content |  | — |

## 完成记录

- [x] breadcrumb:32 separator；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] breadcrumb:33 separatorIcon；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] breadcrumb:39 children；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] breadcrumb:47 to；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] breadcrumb:48 replace；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
- [x] breadcrumb:54 children；实现：packages/components/navigation/index.tsx；测试：tests/layout-display.test.tsx
