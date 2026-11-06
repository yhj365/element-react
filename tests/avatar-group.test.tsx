import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { Avatar, AvatarGroup, ConfigProvider } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

apiTest(
  'avatar',
  'AvatarGroup Attributes',
  ['size', 'shape'],
  'avatar-group',
  '组默认尺寸形状与单个头像覆盖',
  () => {
    render(
      <AvatarGroup size={48} shape="square">
        <Avatar>组头像</Avatar>
        <Avatar size="small" shape="circle">
          覆盖头像
        </Avatar>
      </AvatarGroup>,
    );
    expect(screen.getByText('组头像')).toHaveClass('el-avatar--square');
    expect(screen.getByText('组头像')).toHaveStyle({ '--el-avatar-size': '48px' });
    expect(screen.getByText('覆盖头像')).toHaveClass('el-avatar--small', 'el-avatar--circle');
  },
);
apiTest(
  'avatar',
  'AvatarGroup Attributes',
  ['collapse-avatars', 'max-collapse-avatars', 'collapse-class', 'collapse-style'],
  'avatar-group',
  '折叠数量、样式和Fragment顺序',
  () => {
    const view = render(
      <AvatarGroup
        collapseAvatars
        maxCollapseAvatars={2}
        collapseClass="collapsed-avatar"
        collapseStyle={{ color: 'red' }}
      >
        <>
          <Avatar>甲</Avatar>
          <Avatar>乙</Avatar>
          <Avatar>丙</Avatar>
          <Avatar>丁</Avatar>
        </>
      </AvatarGroup>,
    );
    expect(view.container.firstChild).toHaveClass('el-avatar-group');
    expect(screen.getByText('+ 2')).toHaveClass('collapsed-avatar');
    expect(screen.getByText('+ 2')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(screen.getByText('甲')).toBeInTheDocument();
    expect(screen.queryByText('丙')).toBeNull();
    view.rerender(
      <AvatarGroup collapseAvatars={false}>
        <Avatar>甲</Avatar>
        <Avatar>乙</Avatar>
        <Avatar>丙</Avatar>
      </AvatarGroup>,
    );
    expect(screen.getByText('丙')).toBeInTheDocument();
    expect(screen.queryByText('+ 2')).toBeNull();
  },
);
apiTest(
  'avatar',
  'AvatarGroup Attributes',
  ['collapse-avatars-tooltip', 'effect', 'placement', 'popper-class', 'popper-style'],
  'avatar-group',
  '折叠头像提示层继承字体尺寸和层样式',
  async () => {
    render(
      <AvatarGroup
        size="large"
        collapseAvatars
        collapseAvatarsTooltip
        placement="top-start"
        effect="dark"
        popperClass="avatars-tip"
        popperStyle={{ color: 'red' }}
      >
        <Avatar>甲</Avatar>
        <Avatar>乙</Avatar>
        <Avatar>丙</Avatar>
      </AvatarGroup>,
    );
    fireEvent.mouseEnter(document.querySelector('.el-tooltip__trigger')!);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());
    expect(screen.getByRole('tooltip')).toHaveClass('avatars-tip', 'is-dark');
    expect(screen.getByRole('tooltip')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-popper-placement');
    expect(screen.getByText('乙')).toHaveClass('el-avatar--large');
    expect(screen.getByText('乙').parentElement).toHaveClass('el-avatar-group__collapse-avatars');
  },
);
featureTest('avatar', 'retry-previous-source', 'avatar-group', '切换回曾失败图片时允许重新尝试', () => {
  const view = render(
    <Avatar src="first.png" alt="头像">
      后备
    </Avatar>,
  );
  fireEvent.error(screen.getByRole('img'));
  expect(screen.getByText('后备')).toBeInTheDocument();
  view.rerender(
    <Avatar src="second.png" alt="头像">
      后备
    </Avatar>,
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', 'second.png');
  view.rerender(
    <Avatar src="first.png" alt="头像">
      后备
    </Avatar>,
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', 'first.png');
});
featureTest('avatar', 'group-namespace', 'avatar-group', '自定义命名空间下数值尺寸变量保持一致', () => {
  render(
    <ConfigProvider namespace="custom">
      <AvatarGroup size={36}>
        <Avatar>头像</Avatar>
      </AvatarGroup>
    </ConfigProvider>,
  );
  expect(screen.getByText('头像')).toHaveStyle({ '--custom-avatar-size': '36px' });
  expect(screen.getByText('头像').parentElement).toHaveClass('custom-avatar-group');
});
