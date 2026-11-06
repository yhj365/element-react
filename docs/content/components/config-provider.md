# ConfigProvider 全局配置

局部配置覆盖上级，未指定的字段继续继承。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 配置继承与覆盖

局部配置覆盖上级，未指定的字段继续继承。

```tsx
import { ConfigProvider, Button, Input, Space } from 'element-react';

/** 局部配置覆盖上级，未指定的字段继续继承。 */
export default function Example() {
  return (
    <ConfigProvider size="small" button={{ type: 'primary', plain: true }} locale="zh-cn">
      <Space>
        <Button>继承配置</Button>
        <ConfigProvider button={{ plain: false }}>
          <Button>局部覆盖</Button>
        </ConfigProvider>
        <Input defaultValue="中文清空按钮" clearable />
      </Space>
    </ConfigProvider>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Config Provider Attributes | size | size | global component size | enum'large' \| 'default' \| 'small' | default |
| Config Provider Attributes | namespace | namespace | global component className prefix (cooperated with [$namespace](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/mixins/config.scss#L1)) | string | el |
| Config Provider Attributes | button | button | button related configuration, [see the following table](#button-attribute) | object{autoInsertSpace?: boolean, type?: string, plain?: boolean, text?: boolean, round?: boolean, dashed?: boolean} | see the following table |
| Config Provider Attributes | link | link | link related configuration, [see the following table](#link-attribute) | object{type?: string, underline?: boolean \| string} | see the following table |
| Config Provider Slots | default | children | customize default content | config: provided global config (inherited from the top) | — |

## 完成记录

- [x] config-provider:107 size；实现：packages/components/config-provider/index.tsx；测试：tests/presentation.test.tsx
- [x] config-provider:109 namespace；实现：packages/components/config-provider/index.tsx；测试：tests/presentation.test.tsx
- [x] config-provider:110 button；实现：packages/components/config-provider/index.tsx；测试：tests/presentation.test.tsx
- [x] config-provider:111 link；实现：packages/components/config-provider/index.tsx；测试：tests/presentation.test.tsx
- [x] config-provider:177 children；实现：packages/components/config-provider/index.tsx；测试：tests/presentation.test.tsx
