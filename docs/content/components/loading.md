# Loading 加载

区域加载与全屏显式服务。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 加载反馈

区域加载与全屏显式服务。

```tsx
import { useState } from 'react';
import { Button, Loading, Space } from 'element-react';
/** 区域加载保留内容，全屏服务通过实例显式关闭。 */
export default function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" fill>
      <Space>
        <Button onClick={() => setLoading(!loading)}>切换区域加载</Button>
        <Button
          onClick={() => {
            const instance = Loading.service({ fullscreen: true, lock: true, text: '加载中' });
            setTimeout(() => instance.close(), 1000);
          }}
        >
          全屏加载一秒
        </Button>
      </Space>
      <Loading loading={loading} text="正在读取" style={{ minHeight: 120 }}>
        <p>这里是实际内容区域。</p>
      </Loading>
    </Space>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Options | target | target | the DOM node Loading needs to cover. Accepts a DOM object or a string. If it's a string, it will be passed to `document.querySelector` to get the corresponding DOM node | string / HTMLElement | document.body |
| Options | body | body | same as the `body` modifier of `v-loading` | boolean | false |
| Options | fullscreen | fullscreen | same as the `fullscreen` modifier of `v-loading` | boolean | true |
| Options | lock | lock | same as the `lock` modifier of `v-loading` | boolean | false |
| Options | text | text | loading text that displays under the spinner | string / VNode / arrayVNode[] | — |
| Options | spinner | spinner | class name of the custom spinner | string | — |
| Options | background | background | background color of the mask | string | — |
| Options | customClass | customClass | custom class name for loading | string | — |
| Options | svg | svg | custom SVG element to override the default loading spinner | string | — |
| Options | svgViewBox | svgViewBox | sets the viewBox attribute for loading svg element | string | — |
| Options | beforeClose | beforeClose | Function executed before loading attempts to close. If this function returns false, the closing process will be aborted. Otherwise, the loading will close. | Function() => boolean | — |
| Options | closed | closed | Function triggered after loading has completely closed | Function() => void | — |

## 完成记录

- [x] loading:109 target；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:110 body；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:111 fullscreen；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:112 lock；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:113 text；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:114 spinner；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:115 background；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:116 customClass；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:117 svg；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:118 svgViewBox；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:119 beforeClose；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
- [x] loading:120 closed；实现：packages/components/services/loading.tsx；测试：tests/services.test.tsx
