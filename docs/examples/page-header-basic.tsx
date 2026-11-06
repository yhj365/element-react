import { PageHeader, Button, Breadcrumb, BreadcrumbItem } from 'element-react';

/** 组合路径、返回动作与额外操作。 */
export default function Example() {
  return (
    <PageHeader
      title="返回"
      content="编辑项目"
      renderExtra={<Button type="primary">保存</Button>}
      renderBreadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>项目</BreadcrumbItem>
          <BreadcrumbItem>详情</BreadcrumbItem>
        </Breadcrumb>
      }
    >
      <p>当前项目的说明内容。</p>
    </PageHeader>
  );
}
