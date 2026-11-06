import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import {
  Button,
  Tag,
  Alert,
  Text,
  Divider,
  Badge,
  Checkbox,
  Radio,
  TimelineItem,
} from '../packages/element-react';
import { useNamespace } from '../packages/hooks';

/** 区分未传第二参数和显式传undefined，匹配源namespace的参数个数语义。 */
function NamespaceProbe() {
  const ns = useNamespace('probe');
  return (
    <div
      data-testid="probe"
      data-implicit={ns.is('active')}
      data-undefined={ns.is('active', undefined)}
      data-false={ns.is('active', false)}
      data-true={ns.is('active', true)}
    />
  );
}

test('namespace显式undefined不启用状态，省略条件才默认启用', () => {
  render(<NamespaceProbe />);
  const node = screen.getByTestId('probe');
  expect(node).toHaveAttribute('data-implicit', 'is-active');
  expect(node).toHaveAttribute('data-undefined', '');
  expect(node).toHaveAttribute('data-false', '');
  expect(node).toHaveAttribute('data-true', 'is-active');
});
test('所有可选布尔属性默认关闭，默认Button保留完整外观', () => {
  render(
    <>
      <Button>按钮</Button>
      <Tag>标签</Tag>
      <Alert title="提示" />
      <Text>文字</Text>
      <Divider />
      <Badge value={1} />
      <Checkbox>复选</Checkbox>
      <Radio>单选</Radio>
      <TimelineItem>节点</TimelineItem>
    </>,
  );
  expect(screen.getByRole('button', { name: '按钮' })).not.toHaveClass(
    'is-link',
    'is-circle',
    'is-has-bg',
    'is-loading',
    'is-disabled',
    'is-round',
    'is-dashed',
    'is-plain',
    'is-text',
  );
  expect(screen.getByText('标签').parentElement).not.toHaveClass('is-round', 'is-hit', 'is-closable');
  expect(screen.getByRole('alert')).not.toHaveClass('is-center');
  expect(screen.getByText('文字')).not.toHaveClass('is-truncated');
  expect(screen.getByRole('checkbox')).not.toBeDisabled();
  expect(screen.getByRole('radio')).not.toBeDisabled();
});
