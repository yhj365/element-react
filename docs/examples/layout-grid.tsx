import { Row, Col, Card } from 'element-react';

/** 行间距、列占比和对齐。 */
export default function Example() {
  return (
    <Row gutter={16} justify="space-between" align="middle">
      <Col span={8}>
        <Card shadow="never">8 / 24</Card>
      </Col>
      <Col span={8}>
        <Card shadow="never">8 / 24</Card>
      </Col>
      <Col span={8}>
        <Card shadow="never">8 / 24</Card>
      </Col>
    </Row>
  );
}
