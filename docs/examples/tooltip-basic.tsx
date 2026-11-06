import { Button, Tooltip, Space } from 'element-react';
/** 可选择位置、主题和触发方式的文本提示。 */
export default function Example() {
  return (
    <Space>
      <Tooltip content="提示内容" placement="top">
        <Button>悬停查看</Button>
      </Tooltip>
      <Tooltip content="浅色提示" effect="light" trigger="click">
        <Button>点击提示</Button>
      </Tooltip>
      <Tooltip
        renderContent={
          <span>
            自定义 <b>内容</b>
          </span>
        }
        trigger="focus"
      >
        <Button>聚焦提示</Button>
      </Tooltip>
    </Space>
  );
}
