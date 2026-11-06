import { Image, Space } from 'element-react';
const first =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23d9ecff"/%3E%3Ccircle cx="450" cy="110" r="45" fill="%23e6a23c"/%3E%3Cpath d="M0 400 200 130 400 400M200 400 450 180 600 400" fill="%2379bbff"/%3E%3C/svg%3E';
const second = first.replaceAll('%2379bbff', '%2395d475').replaceAll('%23d9ecff', '%23e1f3d8');
/** 点击图片预览，图片与资源在本地示例中保持确定。 */
export default function Example() {
  return (
    <Space>
      <Image
        src={first}
        alt="山景插图"
        fit="cover"
        style={{ width: 240, height: 160 }}
        previewSrcList={[first, second]}
        previewTeleported
        showProgress
      />
      <Image
        src="data:image/png;base64,invalid"
        style={{ width: 160, height: 160 }}
        renderError={<span>图片加载失败</span>}
      />
    </Space>
  );
}
