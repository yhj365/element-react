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
