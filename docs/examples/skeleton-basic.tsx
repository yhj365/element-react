import { useState } from 'react';
import { Skeleton, SkeletonItem, Button, Space } from 'element-react';

/** 可切换加载与实际内容，支持定制模板。 */
export default function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" fill>
      <Button onClick={() => setLoading(!loading)}>切换加载状态</Button>
      <Skeleton
        loading={loading}
        animated
        rows={3}
        renderTemplate={
          <Space>
            <SkeletonItem variant="circle" style={{ width: 48, height: 48 }} />
            <div style={{ width: 220 }}>
              <SkeletonItem />
              <SkeletonItem />
            </div>
          </Space>
        }
      >
        <p>加载完成的实际内容。</p>
      </Skeleton>
    </Space>
  );
}
