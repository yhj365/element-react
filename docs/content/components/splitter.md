# Splitter 分隔面板

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础用法

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

```tsx
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/basic 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel>
          <div className="p-8">Panel 1</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Panel 2</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
```

### 垂直布局

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

```tsx
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/vertical 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter layout="vertical">
        <SplitterPanel>
          <div className="p-6">Top</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-6">Bottom</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
```

### 可折叠

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

```tsx
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/collapsible 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel collapsible min="20%">
          <div className="p-8">Collapsible start</div>
        </SplitterPanel>
        <SplitterPanel collapsible>
          <div className="p-8">Collapsible end</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
```

### 禁止拖动

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

```tsx
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/disableDrag 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel resizable={false}>
          <div className="p-8">Fixed</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Resize disabled</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
```

### 面板尺寸

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

```tsx
import { useState } from 'react';
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/size 场景。 */
export default function Example() {
  const [size, setSize] = useState(200);
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel size={size} onSizeChange={setSize} min={100} max="70%">
          <div className="p-8">{Math.round(size)} px</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Auto</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
```

### 延迟更新

拖动分隔线调整面板尺寸，也可聚焦分隔线使用方向键。

```tsx
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/lazy 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter lazy>
        <SplitterPanel>
          <div className="p-8">Commit on release</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Preview while dragging</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Splitter Attributes | layout | layout | Layout direction of the splitter | enum'horizontal' \| 'vertical' | horizontal |
| Splitter Attributes | lazy | lazy | Whether to enable lazy mode | boolean | false |
| Splitter Events | resize-start | onResizeStart | Triggered when starting to resize a panel, `index` is the drag bar index |  | — |
| Splitter Events | resize | onResize | Triggered while resizing a panel, `index` is the drag bar index |  | — |
| Splitter Events | resize-end | onResizeEnd | Triggered when panel resizing ends, `index` is the drag bar index |  | — |
| Splitter Events | collapse | onCollapse | Triggered when a panel is collapsed, `index` is the drag bar index |  | — |
| SplitterPanel Attributes | size / v-model:size | size / defaultSize / onSizeChange | Size of the panel (in pixels or percentage) | string / number | - |
| SplitterPanel Attributes | min | min | Minimum size of the panel (in pixels or percentage) | string / number | - |
| SplitterPanel Attributes | max | max | Maximum size of the panel (in pixels or percentage) | string / number | - |
| SplitterPanel Attributes | resizable | resizable | Whether the panel can be resized | boolean | true |
| SplitterPanel Attributes | collapsible | collapsible | Whether the panel can be collapsed | boolean | false |
| SplitterPanel Events | update:size | onSizeChange | Triggered when panel size changes |  | — |
| SplitterPanel Slots | default | children | Default content of the panel |  | — |
| SplitterPanel Slots | start-collapsible | renderStartCollapsible | Custom content for the start collapsible button |  | — |
| SplitterPanel Slots | end-collapsible | renderEndCollapsible | Custom content for the end collapsible button |  | — |
| SplitterPanel Exposes | splitterPanelRef | ref.current.splitterPanelRef | SplitterPanel html element | objectRef<HTMLDivElement> | — |

## 完成记录

- [x] splitter:76 layout；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:77 lazy；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:83 onResizeStart；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:84 onResize；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:85 onResizeEnd；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:86 onCollapse；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:94 size / defaultSize / onSizeChange；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:95 min；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:96 max；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:97 resizable；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:98 collapsible；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:104 onSizeChange；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:110 children；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:111 renderStartCollapsible；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:112 renderEndCollapsible；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
- [x] splitter:118 ref.current.splitterPanelRef；实现：packages/components/splitter/index.tsx；测试：tests/splitter.test.tsx
