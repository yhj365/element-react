import { Avatar, AvatarGroup } from 'element-react';

/** 组设置默认尺寸，折叠头像在悬停时展示。 */
export default function Example() {
  return (
    <AvatarGroup size={40} collapseAvatars collapseAvatarsTooltip maxCollapseAvatars={3}>
      <Avatar>A</Avatar>
      <Avatar>B</Avatar>
      <Avatar>C</Avatar>
      <Avatar>D</Avatar>
      <Avatar>E</Avatar>
    </AvatarGroup>
  );
}
