// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  CollapseItem,
  ConfigProvider,
  Input,
  Main,
  Progress,
  Row,
  Segmented,
  Switch,
  Tabs,
  TabPane,
  Select,
  InputOtp,
  InputTag,
  Transfer,
  Anchor,
  AnchorLink,
  Watermark,
  AvatarGroup,
  Avatar,
  Carousel,
  CarouselItem,
  InfiniteScroll,
} from '../packages/element-react';

describe('SSR', () => {
  test('没有window/document也能导入并渲染基础和交互组件', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(
      <ConfigProvider>
        <Main>
          <Row>
            <Col>
              <Card header="SSR">
                <Button type="primary">按钮</Button>
                <Input value="服务端" />
                <Checkbox checked>已选</Checkbox>
                <Switch value={true} />
                <Segmented options={['a', 'b']} value="a" />
                <Progress percentage={50} />
                <Collapse defaultValue={['a']}>
                  <CollapseItem name="a" title="标题">
                    内容
                  </CollapseItem>
                </Collapse>
                <Tabs value="a">
                  <TabPane name="a" label="标签">
                    内容
                  </TabPane>
                </Tabs>
                <Select options={[{ value: 'a', label: '选项' }]} value="a" />
                <InputOtp value="012345" />
                <InputTag value={['标签']} />
                <Transfer data={[{ key: 1, label: '项目' }]} />
                <Anchor>
                  <AnchorLink href="#ssr" title="章节" />
                </Anchor>
                <Watermark>
                  <span>水印内容</span>
                </Watermark>
                <AvatarGroup>
                  <Avatar>A</Avatar>
                </AvatarGroup>
                <Carousel autoplay={false}>
                  <CarouselItem>轮播内容</CarouselItem>
                </Carousel>
                <InfiniteScroll onLoad={() => undefined}>滚动内容</InfiniteScroll>
              </Card>
            </Col>
          </Row>
        </Main>
      </ConfigProvider>,
    );
    expect(html).toContain('el-button--primary');
    expect(html).toContain('value="服务端"');
    expect(html).toContain('aria-checked="true"');
    expect(html).not.toContain('[object Object]');
  });
});
