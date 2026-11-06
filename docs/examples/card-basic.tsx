import { Card, Button } from 'element-react';

/** 头部、正文和底部支持独立内容和样式。 */
export default function Example() {
  return (
    <Card
      header="项目进度"
      footer="最近更新：今天"
      shadow="hover"
      bodyStyle={{ padding: 20 }}
      renderHeader={
        <span>
          项目进度{' '}
          <Button text size="small">
            查看详情
          </Button>
        </span>
      }
    >
      <p>组件与主题分别维护，文档展示已验证的接口。</p>
    </Card>
  );
}
