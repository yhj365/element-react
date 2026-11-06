import { Watermark } from 'element-react';

/** 水印覆盖区域保持内容可选取与操作。 */
export default function Example() {
  return (
    <Watermark content={['Element React', 'React 19']} font={{ fontSize: 16, color: 'rgba(64,158,255,.22)' }}>
      <div className="min-h-64 p-8">
        <h3>内容区域</h3>
        <p>水印使用原组件的旋转裁剪与交错平铺算法。</p>
        <p>这里的文字仍然可以正常选择。</p>
      </div>
    </Watermark>
  );
}
