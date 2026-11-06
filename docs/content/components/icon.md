# Icon 图标

SVG图形继承图标容器的尺寸与颜色。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 尺寸与颜色

SVG图形继承图标容器的尺寸与颜色。

```tsx
import { Icon, Glyph, Space } from 'element-react';

/** SVG图形继承图标容器的尺寸与颜色。 */
export default function Example() {
  return (
    <Space>
      <Icon size={24} color="#409eff">
        <Glyph name="check" />
      </Icon>
      <Icon size="32px" color="#67c23a">
        <Glyph name="info" />
      </Icon>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | color | color | SVG tag's fill attribute | string | inherit from color |
| Attributes | size | size | SVG icon size, size x size | number / string | inherit from font size |
| Slots | default | children | Customize default content |  | — |

## 完成记录

- [x] icon:228 color；实现：packages/components/icon/index.tsx；测试：tests/presentation.test.tsx
- [x] icon:229 size；实现：packages/components/icon/index.tsx；测试：tests/presentation.test.tsx
- [x] icon:235 children；实现：packages/components/icon/index.tsx；测试：tests/presentation.test.tsx
