# Avatar 头像

文字、图标和图片加载失败回退。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 头像与回退

文字、图标和图片加载失败回退。

```tsx
import { Avatar, Glyph, Space } from 'element-react';

/** 文字、图标和图片加载失败回退。 */
export default function Example() {
  return (
    <Space>
      <Avatar size={48}>ER</Avatar>
      <Avatar shape="square" size="large" icon={<Glyph name="info" />} />
      <Avatar src="data:image/png;base64,invalid" alt="示例头像">
        回退
      </Avatar>
    </Space>
  );
}
```

### 头像组

尺寸继承、折叠和提示层。

```tsx
import { Avatar, AvatarGroup } from 'element-react';

/** 组设置默认尺寸，折叠头像在悬停时展示。 */
export default function Example() {
  return (
    <AvatarGroup size={40} collapseAvatars collapseAvatarsTooltip maxCollapseAvatars={3}>
      <Avatar>A</Avatar>
      <Avatar>B</Avatar>
      <Avatar>C</Avatar>
      <Avatar>D</Avatar>
      <Avatar>E</Avatar>
    </AvatarGroup>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Avatar Attributes | icon | icon | representation type to icon, more info on icon component. | string / Component | — |
| Avatar Attributes | size | size | avatar size. | number / enum'large' \| 'default' \| 'small' | — |
| Avatar Attributes | shape | shape | avatar shape. | enum'circle' \| 'square' | — |
| Avatar Attributes | src | src | the source of the image for an image avatar. | string | — |
| Avatar Attributes | src-set | srcSet | native attribute `srcset` of image avatar. | string | — |
| Avatar Attributes | alt | alt | native attribute `alt` of image avatar. | string | — |
| Avatar Attributes | fit | fit | set how the image fit its container for an image avatar. | enum'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down' | cover |
| Avatar Events | error | onError | trigger when image load error. | Function(e: Event) => void | — |
| Avatar Slots | default | children | customize avatar content. |  | — |
| AvatarGroup Attributes | size | size | control the size of avatars in this avatar-group | number / enum'large' \| 'default' \| 'small' | — |
| AvatarGroup Attributes | shape | shape | control the shape of avatars in this avatar-group | enum'circle' \| 'square' | — |
| AvatarGroup Attributes | collapse-avatars | collapseAvatars | whether to collapse avatars | boolean | false |
| AvatarGroup Attributes | collapse-avatars-tooltip | collapseAvatarsTooltip | whether show all collapsed avatars when mouse hover text of the collapse-avatar. To use this, `collapse-avatars` must be true | boolean | false |
| AvatarGroup Attributes | max-collapse-avatars | maxCollapseAvatars | the max avatars number to be shown. To use this, `collapse-avatars` must be true | number | 1 |
| AvatarGroup Attributes | effect | effect | tooltip theme, built-in theme: `dark` / `light` | enum'dark' \| 'light' / string | light |
| AvatarGroup Attributes | placement | placement | placement of tooltip | enum'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end' | top |
| AvatarGroup Attributes | popper-class | popperClass | custom class name for tooltip | string | '' |
| AvatarGroup Attributes | popper-style | popperStyle | custom style for tooltip | string / object | — |
| AvatarGroup Attributes | collapse-class | collapseClass | custom class name for the collapse-avatar | string | '' |
| AvatarGroup Attributes | collapse-style | collapseStyle | custom style for the collapse-avatar | string / object | — |

## 完成记录

- [x] avatar:66 icon；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:67 size；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:68 shape；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:69 src；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:70 srcSet；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:71 alt；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:72 fit；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:78 onError；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:84 children；实现：packages/components/presentation/index.tsx；测试：tests/presentation.test.tsx
- [x] avatar:92 size；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:93 shape；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:94 collapseAvatars；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:95 collapseAvatarsTooltip；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:96 maxCollapseAvatars；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:97 effect；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:98 placement；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:99 popperClass；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:100 popperStyle；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:101 collapseClass；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
- [x] avatar:102 collapseStyle；实现：packages/components/presentation/index.tsx；测试：tests/avatar-group.test.tsx
