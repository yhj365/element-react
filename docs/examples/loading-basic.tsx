import { useState } from 'react';
import { Button, Loading, Space } from 'element-react';
/** 区域加载保留内容，全屏服务通过实例显式关闭。 */
export default function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" fill>
      <Space>
        <Button onClick={() => setLoading(!loading)}>切换区域加载</Button>
        <Button
          onClick={() => {
            const instance = Loading.service({ fullscreen: true, lock: true, text: '加载中' });
            setTimeout(() => instance.close(), 1000);
          }}
        >
          全屏加载一秒
        </Button>
      </Space>
      <Loading loading={loading} text="正在读取" style={{ minHeight: 120 }}>
        <p>这里是实际内容区域。</p>
      </Loading>
    </Space>
  );
}
