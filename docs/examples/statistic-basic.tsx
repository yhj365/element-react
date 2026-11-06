import { Statistic, Space } from 'element-react';

/** 支持精度、分隔符、前后缀和自定义格式化。 */
export default function Example() {
  return (
    <Space size={48} wrap>
      <Statistic title="总访问量" value={123456} />
      <Statistic title="账户余额" value={12345.678} precision={2} prefix="￥" />
      <Statistic title="完成情况" value={80} suffix="%" />
    </Space>
  );
}
