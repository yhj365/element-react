import { Link, Glyph, Space } from 'element-react';

/** 普通链接保留浏览器行为，禁用状态不触发导航。 */
export default function Example() {
  return (
    <Space>
      <Link type="primary" href="https://element-plus.org" target="_blank" rel="noreferrer">
        来源文档
      </Link>
      <Link underline="always" renderIcon={<Glyph name="arrow" />}>
        带图标
      </Link>
      <Link disabled href="#">
        禁用链接
      </Link>
    </Space>
  );
}
