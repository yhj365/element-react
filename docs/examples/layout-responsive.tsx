import { Row, Col, Card } from 'element-react';

/** 在窄容器中按断点切换列宽。 */
export default function Example() {
  return (
    <Row gutter={16}>
      {[1, 2, 3].map((item) => (
        <Col key={item} xs={24} sm={12} md={8}>
          <Card shadow="never">区域 {item}</Card>
        </Col>
      ))}
    </Row>
  );
}
