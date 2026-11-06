import { createRef, StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CheckTag,
  ConfigProvider,
  Divider,
  Empty,
  Glyph,
  Icon,
  Link,
  Result,
  Tag,
  Text,
} from '../packages/element-react';
import type { ButtonHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

describe('Button', () => {
  apiTest('button', 'Button Attributes', ['type', 'size'], 'button-variants', '语义色和尺寸', () => {
    const { rerender } = render(
      <Button type="primary" size="small">
        保存
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('el-button--primary', 'el-button--small');
    rerender(
      <Button type="danger" size="large">
        保存
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('el-button--danger', 'el-button--large');
  });
  for (const [prop, cls] of Object.entries({
    plain: 'is-plain',
    text: 'is-text',
    bg: 'is-has-bg',
    link: 'is-link',
    round: 'is-round',
    circle: 'is-circle',
    dashed: 'is-dashed',
  }))
    apiTest('button', 'Button Attributes', [prop], 'button-variants', `${prop}外观`, () => {
      render(<Button {...{ [prop]: true }}>操作</Button>);
      expect(screen.getByRole('button')).toHaveClass(cls);
    });
  apiTest(
    'button',
    'Button Attributes',
    ['disabled', 'loading', 'loading-icon'],
    'button-loading',
    '禁用和加载阻止点击',
    () => {
      const click = vi.fn();
      const { rerender } = render(
        <Button disabled onClick={click}>
          保存
        </Button>,
      );
      fireEvent.click(screen.getByRole('button'));
      expect(click).not.toHaveBeenCalled();
      rerender(
        <Button loading loadingIcon={<span>转动</span>} onClick={click}>
          保存
        </Button>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByText('转动')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button'));
      expect(click).not.toHaveBeenCalled();
    },
  );
  apiTest('button', 'Button Attributes', ['icon'], 'button-loading', '普通图标', () => {
    render(<Button icon={<span data-testid="icon">+</span>}>新增</Button>);
    expect(screen.getByTestId('icon').parentElement).toHaveClass('el-icon');
  });
  apiTest('button', 'Button Attributes', ['native-type'], 'button-native', 'submit与reset属性', () => {
    const { rerender } = render(<Button nativeType="submit">提交</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    rerender(<Button nativeType="reset">重置</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });
  apiTest('button', 'Button Attributes', ['tag'], 'button-native', '自定义标签的禁用保护', () => {
    const click = vi.fn();
    render(
      <Button tag="a" disabled onClick={click}>
        链接按钮
      </Button>,
    );
    fireEvent.click(screen.getByText('链接按钮'));
    expect(click).not.toHaveBeenCalled();
    expect(screen.getByText('链接按钮').closest('a')).toHaveAttribute('aria-disabled', 'true');
  });
  apiTest('button', 'Button Attributes', ['autofocus'], 'button-native', '自动聚焦', () => {
    render(<Button autoFocus>聚焦</Button>);
    expect(screen.getByRole('button')).toHaveFocus();
  });
  apiTest('button', 'Button Attributes', ['auto-insert-space'], 'button-spacing', '只展开两个汉字', () => {
    const { rerender } = render(<Button autoInsertSpace>保存</Button>);
    expect(screen.getByText('保存')).toHaveClass('el-button__text--expand');
    rerender(<Button autoInsertSpace>保存内容</Button>);
    expect(screen.getByText('保存内容')).not.toHaveClass('el-button__text--expand');
  });
  apiTest(
    'button',
    'Button Slots',
    ['default', 'loading', 'icon'],
    'button-loading',
    '加载区域优先级及零值内容',
    () => {
      const { rerender } = render(
        <Button loading renderLoading={<span>自定义加载</span>} loadingIcon={<span>不显示</span>}>
          {0}
        </Button>,
      );
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('自定义加载')).toBeInTheDocument();
      expect(screen.queryByText('不显示')).not.toBeInTheDocument();
      rerender(<Button renderIcon={<span>插入图标</span>}>图标</Button>);
      expect(screen.getByText('插入图标')).toBeInTheDocument();
    },
  );
  apiTest(
    'button',
    'Button Exposes',
    ['ref', 'size', 'type', 'disabled', 'shouldAddSpace'],
    'button-spacing',
    '实例反映当前属性',
    () => {
      const ref = createRef<ButtonHandle>();
      const { rerender } = render(
        <Button ref={ref} size="large" type="success" autoInsertSpace>
          保存
        </Button>,
      );
      expect(ref.current).toMatchObject({
        size: 'large',
        type: 'success',
        disabled: false,
        shouldAddSpace: true,
      });
      expect(ref.current?.ref).toBe(screen.getByRole('button'));
      rerender(
        <Button ref={ref} disabled>
          保存
        </Button>,
      );
      expect(ref.current?.disabled).toBe(true);
    },
  );
  apiTest(
    'button',
    'ButtonGroup Attributes',
    ['size', 'type', 'direction'],
    'button-group',
    '组继承及局部覆盖',
    () => {
      render(
        <ButtonGroup size="small" type="primary" direction="vertical">
          <Button>继承</Button>
          <Button size="large" type="danger">
            覆盖
          </Button>
        </ButtonGroup>,
      );
      expect(screen.getByRole('group')).toHaveClass('el-button-group--vertical');
      expect(screen.getByText('继承').closest('button')).toHaveClass(
        'el-button--small',
        'el-button--primary',
      );
      expect(screen.getByText('覆盖').closest('button')).toHaveClass('el-button--large', 'el-button--danger');
    },
  );
  apiTest('button', 'ButtonGroup Slots', ['default'], 'button-group', '组内容', () => {
    render(
      <ButtonGroup>
        <Button>一</Button>
        <Button>二</Button>
      </ButtonGroup>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
  featureTest('button', 'disabled-custom-tag', 'button-native', '自定义标签和重复渲染无多发事件', () => {
    const click = vi.fn();
    const { rerender } = render(
      <StrictMode>
        <Button onClick={click}>操作</Button>
      </StrictMode>,
    );
    fireEvent.click(screen.getByRole('button'));
    rerender(
      <StrictMode>
        <Button onClick={click}>操作</Button>
      </StrictMode>,
    );
    expect(click).toHaveBeenCalledTimes(1);
  });
});

describe('展示组件', () => {
  apiTest('icon', 'Attributes', ['color', 'size'], 'icon-basic', '图标颜色和尺寸', () => {
    render(
      <Icon color="red" size={24}>
        <Glyph name="check" />
      </Icon>,
    );
    const icon = document.querySelector('.el-icon');
    expect(icon).toHaveStyle({ color: 'rgb(255, 0, 0)', 'font-size': '24px' });
    expect(icon?.querySelector('svg')).toHaveAttribute('viewBox', '0 0 1024 1024');
  });
  apiTest('icon', 'Slots', ['default'], 'icon-basic', '任意SVG内容', () => {
    render(
      <Icon>
        <svg data-testid="svg" />
      </Icon>,
    );
    expect(screen.getByTestId('svg').parentElement).toHaveClass('el-icon');
  });
  apiTest(
    'text',
    'Attributes',
    ['type', 'size', 'tag', 'truncated', 'line-clamp'],
    'text-basic',
    '文字语义和截断类',
    () => {
      render(
        <Text type="danger" size="small" tag="p" truncated lineClamp={2}>
          说明文字
        </Text>,
      );
      expect(screen.getByText('说明文字').tagName).toBe('P');
      expect(screen.getByText('说明文字')).toHaveClass(
        'el-text--danger',
        'el-text--small',
        'is-truncated',
        'is-line-clamp',
      );
      expect(screen.getByText('说明文字')).toHaveStyle({ WebkitLineClamp: 2 });
    },
  );
  apiTest('text', 'Slots', ['default'], 'text-basic', '文字内容', () => {
    render(<Text>{0}</Text>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  featureTest('text', 'overflow-title', 'text-basic', '实际溢出才显示自动title且卸载观察器', async () => {
    const { unmount } = render(<Text truncated>超长文字</Text>);
    const element = screen.getByText('超长文字');
    Object.defineProperty(element, 'scrollWidth', { value: 200 });
    Object.defineProperty(element, 'offsetWidth', { value: 100 });
    await act(async () => {
      element.firstChild!.textContent = '发生溢出';
    });
    expect(element).toHaveAttribute('title', '发生溢出');
    unmount();
  });
  apiTest(
    'link',
    'Attributes',
    ['type', 'underline', 'disabled', 'href', 'target', 'icon'],
    'link-basic',
    '链接与禁用导航',
    () => {
      const click = vi.fn();
      const { rerender } = render(
        <Link
          type="primary"
          underline="always"
          href="https://example.com"
          target="_blank"
          icon={<span>图标</span>}
        >
          文档
        </Link>,
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
      expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
      expect(screen.getByRole('link')).toHaveClass('el-link--primary', 'is-underline');
      expect(screen.getByText('图标')).toBeInTheDocument();
      rerender(
        <Link disabled href="https://example.com" onClick={click}>
          文档
        </Link>,
      );
      fireEvent.click(screen.getByText('文档'));
      expect(click).not.toHaveBeenCalled();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    },
  );
  apiTest('link', 'Slots', ['default', 'icon'], 'link-basic', '链接渲染区域', () => {
    render(<Link renderIcon={<span>标</span>}>内容</Link>);
    expect(screen.getByText('标')).toBeInTheDocument();
    expect(screen.getByText('内容')).toHaveClass('el-link__inner');
  });
  apiTest(
    'card',
    'Attributes',
    ['header', 'footer', 'body-style', 'header-class', 'body-class', 'footer-class', 'shadow'],
    'card-basic',
    '卡片区域样式',
    () => {
      render(
        <Card
          header="标题"
          footer="尾部"
          bodyStyle={{ padding: 12 }}
          headerClass="heading"
          bodyClass="body"
          footerClass="ending"
          shadow="hover"
        >
          正文
        </Card>,
      );
      expect(screen.getByText('标题')).toHaveClass('el-card__header', 'heading');
      expect(screen.getByText('正文')).toHaveStyle({ padding: '12px' });
      expect(screen.getByText('正文')).toHaveClass('body');
      expect(screen.getByText('尾部')).toHaveClass('ending');
      expect(document.querySelector('.el-card')).toHaveClass('is-hover-shadow');
    },
  );
  apiTest('card', 'Slots', ['default', 'header', 'footer'], 'card-basic', '具名区域覆盖普通属性', () => {
    render(
      <Card header="旧标题" footer="旧尾部" renderHeader={<b>新标题</b>} renderFooter={<i>新尾部</i>}>
        {0}
      </Card>,
    );
    expect(screen.queryByText('旧标题')).not.toBeInTheDocument();
    expect(screen.queryByText('旧尾部')).not.toBeInTheDocument();
    expect(screen.getByText('新标题').tagName).toBe('B');
    expect(screen.getByText('新尾部').tagName).toBe('I');
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  apiTest(
    'tag',
    'Tag Attributes',
    ['type', 'closable', 'hit', 'color', 'size', 'effect', 'round'],
    'tag-basic',
    '标签样式和关闭按钮',
    () => {
      render(
        <Tag type="success" closable hit color="red" size="large" effect="plain" round>
          标签
        </Tag>,
      );
      const tag = screen.getByText('标签').parentElement;
      expect(tag).toHaveClass(
        'el-tag--success',
        'el-tag--large',
        'el-tag--plain',
        'is-hit',
        'is-round',
        'is-closable',
      );
      expect(tag).toHaveStyle({ 'background-color': 'rgb(255, 0, 0)' });
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    },
  );
  apiTest('tag', 'Tag Events', ['click', 'close'], 'tag-basic', '关闭不冒泡且不自行删除', () => {
    const click = vi.fn(),
      close = vi.fn();
    render(
      <Tag closable onClick={click} onClose={close}>
        标签
      </Tag>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(close).toHaveBeenCalledTimes(1);
    expect(click).not.toHaveBeenCalled();
    expect(screen.getByText('标签')).toBeInTheDocument();
    fireEvent.click(screen.getByText('标签'));
    expect(click).toHaveBeenCalledTimes(1);
  });
  apiTest('tag', 'Tag Slots', ['default'], 'tag-basic', '标签内容', () => {
    render(
      <Tag>
        <b>内容</b>
      </Tag>,
    );
    expect(screen.getByText('内容').tagName).toBe('B');
  });
  apiTest(
    'tag',
    'CheckTag Attributes',
    ['checked', 'disabled', 'type'],
    'check-tag-basic',
    '受控标签和禁用',
    () => {
      const change = vi.fn();
      const { rerender } = render(
        <CheckTag checked type="success" onCheckedChange={change}>
          选择
        </CheckTag>,
      );
      const tag = screen.getByRole('checkbox');
      fireEvent.click(tag);
      expect(change).toHaveBeenCalledWith(false);
      expect(tag).toHaveAttribute('aria-checked', 'true');
      expect(tag).toHaveClass('el-check-tag--success');
      rerender(
        <CheckTag checked disabled onCheckedChange={change}>
          选择
        </CheckTag>,
      );
      fireEvent.click(tag);
      expect(change).toHaveBeenCalledTimes(1);
    },
  );
  apiTest('tag', 'CheckTag Events', ['change'], 'check-tag-basic', '键盘切换及通知顺序', () => {
    const calls: string[] = [];
    render(
      <CheckTag onCheckedChange={(v) => calls.push(`value:${v}`)} onChange={(v) => calls.push(`change:${v}`)}>
        选中
      </CheckTag>,
    );
    fireEvent.keyDown(screen.getByRole('checkbox'), { key: ' ' });
    expect(calls).toEqual(['value:true', 'change:true']);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
  apiTest('tag', 'CheckTag Slots', ['default'], 'check-tag-basic', '可勾选标签内容', () => {
    render(<CheckTag>默认内容</CheckTag>);
    expect(screen.getByText('默认内容')).toBeInTheDocument();
  });
  apiTest(
    'divider',
    'Attributes',
    ['direction', 'border-style', 'content-position'],
    'divider-basic',
    '分割方向边框和位置',
    () => {
      const { rerender } = render(
        <Divider borderStyle="dashed" contentPosition="left">
          说明
        </Divider>,
      );
      expect(screen.getByRole('separator')).toHaveClass('el-divider--horizontal');
      expect(screen.getByRole('separator')).toHaveStyle({ '--el-border-style': 'dashed' });
      expect(screen.getByText('说明')).toHaveClass('is-left');
      rerender(<Divider direction="vertical">不显示</Divider>);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
      expect(screen.queryByText('不显示')).not.toBeInTheDocument();
    },
  );
  apiTest('divider', 'Slots', ['default'], 'divider-basic', '水平内容', () => {
    render(<Divider>分隔文字</Divider>);
    expect(screen.getByText('分隔文字')).toHaveClass('el-divider__text');
  });
  apiTest(
    'badge',
    'Attributes',
    [
      'value',
      'max',
      'is-dot',
      'hidden',
      'type',
      'show-zero',
      'color',
      'offset',
      'badge-style',
      'badge-class',
    ],
    'badge-basic',
    '徽标值样式和显隐',
    () => {
      const { rerender } = render(
        <Badge
          value={120}
          max={99}
          type="success"
          color="red"
          offset={[4, 8]}
          badgeClass="counter"
          badgeStyle={{ fontSize: 10 }}
        >
          <Button>消息</Button>
        </Badge>,
      );
      expect(screen.getByText('99+')).toHaveClass('el-badge__content--success', 'counter', 'is-fixed');
      expect(screen.getByText('99+')).toHaveStyle({
        'margin-right': '-4px',
        'margin-top': '8px',
        'background-color': 'rgb(255, 0, 0)',
        'font-size': '10px',
      });
      rerender(<Badge value={0} showZero={false} />);
      expect(screen.getByText('0')).toHaveClass('is-hide-zero');
      rerender(<Badge isDot />);
      expect(document.querySelector('sup')).toHaveClass('is-dot');
      rerender(<Badge hidden value={1} />);
      expect(document.querySelector('sup')).toBeNull();
    },
  );
  apiTest('badge', 'Slots', ['default', 'content'], 'badge-basic', '徽标作用域内容', () => {
    render(
      <Badge value={120} renderContent={(content) => <b>{content}条</b>}>
        <span>入口</span>
      </Badge>,
    );
    expect(screen.getByText('99+条')).toBeInTheDocument();
    expect(screen.getByText('入口')).toBeInTheDocument();
  });
  apiTest(
    'alert',
    'Attributes',
    ['title', 'type', 'description', 'closable', 'center', 'close-text', 'show-icon', 'effect'],
    'alert-basic',
    '告警样式和关闭行为',
    () => {
      const { rerender } = render(
        <Alert
          title="提醒"
          type="warning"
          description="详情"
          closable
          center
          closeText="知道了"
          showIcon
          effect="dark"
        />,
      );
      expect(screen.getByRole('alert')).toHaveClass('el-alert--warning', 'is-center', 'is-dark');
      expect(screen.getByText('提醒')).toHaveClass('with-description');
      expect(screen.getByText('详情')).toHaveClass('el-alert__description');
      expect(screen.getByRole('button')).toHaveTextContent('知道了');
      expect(document.querySelector('.el-alert__icon svg')).not.toBeNull();
      rerender(<Alert title="提醒" closable={false} />);
      expect(screen.queryByRole('button')).toBeNull();
    },
  );
  apiTest('alert', 'Events', ['close'], 'alert-basic', '关闭通知和隐藏', () => {
    const close = vi.fn();
    render(<Alert title="提醒" onClose={close} />);
    fireEvent.click(screen.getByRole('button'));
    expect(close).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });
  apiTest('alert', 'Slots', ['default', 'title', 'icon'], 'alert-basic', '告警自定义区域', () => {
    render(
      <Alert showIcon renderTitle={<b>自定义标题</b>} renderIcon={<span>自定义图标</span>}>
        默认描述
      </Alert>,
    );
    expect(screen.getByText('自定义标题')).toBeInTheDocument();
    expect(screen.getByText('自定义图标')).toBeInTheDocument();
    expect(screen.getByText('默认描述')).toBeInTheDocument();
  });
  apiTest(
    'empty',
    'Attributes',
    ['image', 'image-size', 'description'],
    'empty-basic',
    '空状态图片和说明',
    () => {
      render(<Empty image="/empty.svg" imageSize={80} description="没有结果" />);
      expect(document.querySelector('img')).toHaveAttribute('src', '/empty.svg');
      expect(document.querySelector('.el-empty__image')).toHaveStyle({ width: '80px' });
      expect(screen.getByText('没有结果')).toBeInTheDocument();
    },
  );
  apiTest('empty', 'Slots', ['default', 'image', 'description'], 'empty-basic', '空状态自定义区域', () => {
    render(
      <Empty renderImage={<span>插图</span>} renderDescription={<b>描述</b>}>
        <Button>刷新</Button>
      </Empty>,
    );
    expect(screen.getByText('插图')).toBeInTheDocument();
    expect(screen.getByText('描述')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('刷新');
  });
  apiTest(
    'result',
    'Attributes',
    ['title', 'sub-title', 'icon'],
    'result-basic',
    '结果标题副标题和图标',
    () => {
      render(<Result title="完成" subTitle="已保存" icon="success" />);
      expect(screen.getByText('完成').parentElement).toHaveClass('el-result__title');
      expect(screen.getByText('已保存').parentElement).toHaveClass('el-result__subtitle');
      expect(document.querySelector('.icon-success')).not.toBeNull();
    },
  );
  apiTest(
    'result',
    'Slots',
    ['icon', 'title', 'sub-title', 'extra'],
    'result-basic',
    '结果自定义区域',
    () => {
      render(
        <Result
          renderIcon={<span>图标</span>}
          renderTitle="标题"
          renderSubTitle="副标题"
          renderExtra={<Button>返回</Button>}
        />,
      );
      expect(screen.getByText('图标')).toBeInTheDocument();
      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('副标题')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('返回');
    },
  );
  apiTest(
    'avatar',
    'Avatar Attributes',
    ['icon', 'size', 'shape', 'src', 'src-set', 'alt', 'fit'],
    'avatar-basic',
    '头像资源与回退',
    () => {
      render(
        <Avatar
          src="/person.png"
          srcSet="/person@2x.png 2x"
          alt="用户"
          size={48}
          shape="square"
          fit="contain"
          icon={<span>回退图标</span>}
        />,
      );
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/person.png');
      expect(img).toHaveAttribute('srcset', '/person@2x.png 2x');
      expect(img).toHaveAttribute('alt', '用户');
      expect(img).toHaveStyle({ 'object-fit': 'contain' });
      expect(img.parentElement).toHaveClass('el-avatar--square');
      expect(img.parentElement).toHaveStyle({ '--el-avatar-size': '48px' });
      fireEvent.error(img);
      expect(screen.getByText('回退图标')).toBeInTheDocument();
    },
  );
  apiTest('avatar', 'Avatar Events', ['error'], 'avatar-basic', '失败通知和换地址重试', () => {
    const error = vi.fn();
    const { rerender } = render(
      <Avatar src="/one.png" onError={error}>
        AB
      </Avatar>,
    );
    fireEvent.error(screen.getByRole('img'));
    expect(error).toHaveBeenCalledTimes(1);
    expect(screen.getByText('AB')).toBeInTheDocument();
    rerender(
      <Avatar src="/two.png" onError={error}>
        AB
      </Avatar>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', '/two.png');
  });
  apiTest('avatar', 'Avatar Slots', ['default'], 'avatar-basic', '文字头像', () => {
    render(<Avatar>AB</Avatar>);
    expect(screen.getByText('AB')).toHaveClass('el-avatar');
  });
  apiTest(
    'config-provider',
    'Config Provider Attributes',
    ['size', 'namespace', 'button', 'link'],
    'config-basic',
    '全局配置和显式false覆盖',
    () => {
      render(
        <ConfigProvider
          namespace="er"
          size="small"
          button={{ plain: true, type: 'success' }}
          link={{ type: 'danger' }}
        >
          <Button>继承</Button>
          <ConfigProvider button={{ plain: false }}>
            <Button>覆盖</Button>
          </ConfigProvider>
          <Link>链接</Link>
        </ConfigProvider>,
      );
      expect(screen.getByText('继承').closest('button')).toHaveClass(
        'er-button--small',
        'er-button--success',
        'is-plain',
      );
      expect(screen.getByText('覆盖').closest('button')).not.toHaveClass('is-plain');
      expect(screen.getByText('覆盖').closest('button')).toHaveClass('er-button--success');
      expect(screen.getByText('链接').closest('a')).toHaveClass('er-link--danger');
    },
  );
  apiTest(
    'config-provider',
    'Config Provider Slots',
    ['default'],
    'config-basic',
    'Provider不插入DOM',
    () => {
      const { container } = render(
        <ConfigProvider>
          <span>子节点</span>
        </ConfigProvider>,
      );
      expect(container.children).toHaveLength(1);
      expect(container.firstElementChild?.tagName).toBe('SPAN');
    },
  );
});
