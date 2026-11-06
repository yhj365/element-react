import { Timeline, TimelineItem } from 'element-react';

/** 时间戳、节点类型及自定义图形。 */
export default function Example() {
  return (
    <Timeline>
      <TimelineItem timestamp="2026-11-05 09:00" type="primary" placement="top">
        开始实施
      </TimelineItem>
      <TimelineItem timestamp="2026-11-05 10:00" type="success" hollow>
        通过测试
      </TimelineItem>
      <TimelineItem timestamp="2026-11-05 11:00" renderDot="✓">
        生成文档
      </TimelineItem>
    </Timeline>
  );
}
