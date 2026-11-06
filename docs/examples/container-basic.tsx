import { Container, Header, Aside, Main, Footer } from 'element-react';

/** 组合顶部、侧栏、主内容和底部。 */
export default function Example() {
  return (
    <Container style={{ border: '1px solid var(--el-border-color)', minHeight: 200 }}>
      <Header height="48px" style={{ background: 'var(--el-fill-color)' }}>
        Header
      </Header>
      <Container>
        <Aside width="120px" style={{ background: 'var(--el-fill-color-light)' }}>
          Aside
        </Aside>
        <Main>Main</Main>
      </Container>
      <Footer height="40px">Footer</Footer>
    </Container>
  );
}
