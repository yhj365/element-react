import { Descriptions, DescriptionsItem, Tag } from 'element-react';
/** 边框、跨列和区域样式由父级表格统一布局。 */
export default function Example() {
  return (
    <Descriptions title="用户信息" border column={2}>
      <DescriptionsItem label="姓名">Ada</DescriptionsItem>
      <DescriptionsItem label="角色">
        <Tag>管理员</Tag>
      </DescriptionsItem>
      <DescriptionsItem label="地址" span={2}>
        上海市
      </DescriptionsItem>
      <DescriptionsItem label="备注" labelWidth={90}>
        内容区域支持React节点。
      </DescriptionsItem>
    </Descriptions>
  );
}
