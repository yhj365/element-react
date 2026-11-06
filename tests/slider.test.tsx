import { fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { Slider } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

apiTest(
  'slider',
  'Attributes',
  ['model-value', 'min', 'max', 'step'],
  'slider-basic-usage',
  '受控滑块回传吸附值且等待父级更新',
  () => {
    const update = vi.fn();
    render(<Slider value={20} min={10} max={90} step={5} onValueChange={update} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '33' } });
    expect(update).toHaveBeenCalledWith(35);
    expect(screen.getByRole('slider')).toHaveValue('20');
  },
);
apiTest(
  'slider',
  'Attributes',
  ['disabled', 'show-tooltip', 'format-tooltip'],
  'slider-basic-usage',
  '禁用滑块拒绝更新并可格式化或隐藏提示',
  () => {
    const update = vi.fn();
    const view = render(
      <Slider defaultValue={50} disabled onValueChange={update} formatTooltip={(value) => `${value}%`} />,
    );
    expect(screen.getByRole('slider')).toBeDisabled();
    expect(screen.getByText('50%')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
    expect(update).not.toHaveBeenCalled();
    view.rerender(<Slider defaultValue={50} showTooltip={false} />);
    expect(view.container.querySelector('.react-slider-tooltip')).toBeNull();
  },
);
apiTest('slider', 'Attributes', ['show-stops'], 'slider-discrete-values', '离散步长绘制内部停顿点', () => {
  const view = render(<Slider step={20} showStops />);
  expect(view.container.querySelectorAll('.el-slider__stop')).toHaveLength(4);
});
apiTest(
  'slider',
  'Attributes',
  ['show-input'],
  'slider-slider-with-input-box',
  '输入框与滑块共享数值且限制上下界',
  () => {
    render(<Slider defaultValue={30} showInput />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '150' } });
    expect(screen.getByRole('slider')).toHaveValue('100');
  },
);
apiTest('slider', 'Attributes', ['size'], 'slider-sizes', '尺寸使用来源主题修饰符', () => {
  const view = render(<Slider size="large" />);
  expect(view.container.firstChild).toHaveClass('el-slider--large');
});
apiTest(
  'slider',
  'Attributes',
  ['range', 'range-start-label', 'range-end-label'],
  'slider-range-selection',
  '双端滑块不能越过另一端并暴露独立无障碍标签',
  () => {
    render(<Slider range defaultValue={[30, 60]} rangeStartLabel="Minimum" rangeEndLabel="Maximum" />);
    fireEvent.change(screen.getByRole('slider', { name: 'Minimum' }), { target: { value: '90' } });
    expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveValue('60');
    expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveValue('60');
  },
);
apiTest(
  'slider',
  'Attributes',
  ['vertical', 'height'],
  'slider-vertical-mode',
  '竖向滑块公开方向和高度',
  () => {
    const view = render(<Slider vertical height="240px" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
    expect(view.container.querySelector('.el-slider__runway')).toHaveStyle({ height: '240px' });
  },
);
apiTest('slider', 'Attributes', ['marks'], 'slider-show-marks', '标记支持自定义样式并过滤区间外标记', () => {
  render(<Slider marks={{ 20: { label: 'Warm', style: { color: 'red' } }, 150: 'Outside' }} />);
  expect(screen.getByText('Warm')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  expect(screen.queryByText('Outside')).toBeNull();
});
featureTest('slider', 'restrict-value', 'slider-restrict-value', '标记模式吸附到最近标记', () => {
  render(<Slider step="mark" marks={{ 0: 'Zero', 37: 'Warm', 100: 'Hot' }} />);
  fireEvent.change(screen.getByRole('slider'), { target: { value: '40' } });
  expect(screen.getByRole('slider')).toHaveValue('37');
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
  expect(screen.getByRole('slider')).toHaveValue('100');
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' });
  expect(screen.getByRole('slider')).toHaveValue('0');
});
apiTest(
  'slider',
  'Events',
  ['input', 'change'],
  'slider-basic-usage',
  '实时输入与提交分离且模糊失焦不重复提交',
  () => {
    const input = vi.fn(),
      change = vi.fn();
    render(<Slider onInput={input} onChange={change} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '40' } });
    fireEvent.change(slider, { target: { value: '50' } });
    expect(input).toHaveBeenCalledTimes(2);
    expect(change).not.toHaveBeenCalled();
    fireEvent.pointerUp(slider);
    expect(change).toHaveBeenCalledExactlyOnceWith(50);
    fireEvent.blur(slider);
    expect(change).toHaveBeenCalledTimes(1);
  },
);
