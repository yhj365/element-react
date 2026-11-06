# Button 按钮

语义色、尺寸以及朴素、文字、圆角和虚线按钮。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法与样式

语义色、尺寸以及朴素、文字、圆角和虚线按钮。

```tsx
import { Button, Space } from 'element-react';

/** 语义色、尺寸以及朴素、文字、圆角和虚线按钮。 */
export default function Example() {
  return (
    <Space wrap>
      {(['primary', 'success', 'info', 'warning', 'danger'] as const).map((type) => (
        <Button key={type} type={type}>
          {type}
        </Button>
      ))}
      <Button plain>朴素</Button>
      <Button text bg>
        文字
      </Button>
      <Button link>链接</Button>
      <Button round>圆角</Button>
      <Button circle>+</Button>
      <Button dashed>虚线</Button>
      <Button size="small">小尺寸</Button>
      <Button size="large">大尺寸</Button>
    </Space>
  );
}
```

### 图标与加载

加载状态阻止重复操作，可替换加载内容。

```tsx
import { Button, Glyph, Space } from 'element-react';

/** 加载状态阻止重复操作，可替换加载内容。 */
export default function Example() {
  return (
    <Space wrap>
      <Button icon={<Glyph name="check" />}>保存</Button>
      <Button loading>提交中</Button>
      <Button disabled>禁用</Button>
      <Button loading renderLoading={<span>处理中…</span>}>
        任务
      </Button>
      <Button renderIcon={<Glyph name="arrow" />}>下一步</Button>
    </Space>
  );
}
```

### 原生类型与自定义标签

提交、重置和自定义标签的禁用保护。

```tsx
import { Button, Space } from 'element-react';

/** 提交、重置和自定义标签的禁用保护。 */
export default function Example() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Space>
        <Button nativeType="submit" type="primary">
          提交
        </Button>
        <Button nativeType="reset">重置</Button>
        <Button tag="a" disabled>
          禁用链接
        </Button>
      </Space>
    </form>
  );
}
```

### 汉字间距与实例

两个汉字可自动展开间距，实例状态随属性更新。

```tsx
import { Button, Space } from 'element-react';

/** 两个汉字可自动展开间距，实例状态随属性更新。 */
export default function Example() {
  return (
    <Space>
      <Button autoInsertSpace>保存</Button>
      <Button>保存</Button>
    </Space>
  );
}
```

### 按钮组

组级尺寸和类型由后代继承，单个按钮可覆盖。

```tsx
import { Button, ButtonGroup, Space } from 'element-react';

/** 组级尺寸和类型由后代继承，单个按钮可覆盖。 */
export default function Example() {
  return (
    <Space>
      <ButtonGroup size="small" type="primary">
        <Button>上一页</Button>
        <Button>下一页</Button>
      </ButtonGroup>
      <ButtonGroup direction="vertical">
        <Button>上</Button>
        <Button>下</Button>
      </ButtonGroup>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Button Attributes | size | size | button size | enum'large' \| 'default' \| 'small' | — |
| Button Attributes | type | type | button type, when setting `color`, the latter prevails | enum'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| '' \| 'text' (deprecated) | — |
| Button Attributes | plain | plain | determine whether it's a plain button | boolean | false |
| Button Attributes | text | text | determine whether it's a text button | boolean | false |
| Button Attributes | bg | bg | determine whether the text button background color is always on | boolean | false |
| Button Attributes | link | link | determine whether it's a link button | boolean | false |
| Button Attributes | round | round | determine whether it's a round button | boolean | false |
| Button Attributes | circle | circle | determine whether it's a circle button | boolean | false |
| Button Attributes | dashed | dashed | determine whether it's a dashed button | boolean | false |
| Button Attributes | loading | loading | determine whether it's loading | boolean | false |
| Button Attributes | loading-icon | loadingIcon | customize loading icon component | string / Component | Loading |
| Button Attributes | disabled | disabled | disable the button | boolean | false |
| Button Attributes | icon | icon | icon component | string / Component | — |
| Button Attributes | autofocus | autoFocus | same as native button's `autofocus` | boolean | false |
| Button Attributes | native-type | nativeType | same as native button's `type` | enum'button' \| 'submit' \| 'reset' | button |
| Button Attributes | auto-insert-space | autoInsertSpace | automatically insert a space between two chinese characters(this will only take effect when the text length is 2 and all characters are in Chinese.) | boolean | false |
| Button Attributes | tag | tag | custom element tag | string / Component | button |
| Button Slots | default | children | customize default content |  | — |
| Button Slots | loading | renderLoading | customize loading component |  | — |
| Button Slots | icon | renderIcon | customize icon component |  | — |
| Button Exposes | ref | ref.current.ref | button html element | objectRef<HTMLButtonElement> | — |
| Button Exposes | size | ref.current.size | button size | objectComputedRef<'' \| 'small' \| 'default' \| 'large'> | — |
| Button Exposes | type | ref.current.type | button type | objectComputedRef<'' \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'text'> | — |
| Button Exposes | disabled | ref.current.disabled | button disabled | objectComputedRef<boolean> | — |
| Button Exposes | shouldAddSpace | ref.current.shouldAddSpace | whether adding space | objectComputedRef<boolean> | — |
| ButtonGroup Attributes | size | size | control the size of buttons in this button-group | enum'large' \| 'default' \| 'small' | — |
| ButtonGroup Attributes | type | type | control the type of buttons in this button-group | enum'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | — |
| ButtonGroup Attributes | direction | direction | display direction | enum'horizontal' \| 'vertical' | horizontal |
| ButtonGroup Slots | default | children | customize button group content |  | — |

## 完成记录

- [x] button:146 size；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:147 type；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:148 plain；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:149 text；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:150 bg；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:151 link；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:152 round；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:153 circle；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:154 dashed；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:155 loading；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:156 loadingIcon；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:157 disabled；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:158 icon；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:159 autoFocus；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:160 nativeType；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:161 autoInsertSpace；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:164 tag；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:170 children；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:171 renderLoading；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:172 renderIcon；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:178 ref.current.ref；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:179 ref.current.size；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:180 ref.current.type；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:181 ref.current.disabled；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:182 ref.current.shouldAddSpace；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:190 size；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:191 type；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:192 direction；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
- [x] button:198 children；实现：packages/components/button/index.tsx；测试：tests/presentation.test.tsx
