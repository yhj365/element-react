import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { Splitter, SplitterPanel } from '../packages/element-react';
import type { SplitterPanelHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

beforeEach(() =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 600, 400)),
);
afterEach(() => vi.restoreAllMocks());

/** 在 jsdom 中派发包含坐标的指针事件，不依赖缺失的 PointerEvent 构造器。 */
function pointer(target: Element | Window, type: string, x: number, y = 0): void {
  fireEvent(target, new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 }));
}

apiTest(
  'splitter',
  'Splitter Attributes',
  ['layout'],
  'splitter-vertical',
  '水平和垂直布局使用相应方向和实际容器尺寸',
  () => {
    const view = render(
      <Splitter layout="vertical">
        <SplitterPanel>Top</SplitterPanel>
        <SplitterPanel>Bottom</SplitterPanel>
      </Splitter>,
    );
    expect(view.container.firstChild).toHaveClass('el-splitter__vertical');
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    expect(screen.getByText('Top')).toHaveStyle({ flexBasis: '200px' });
    pointer(screen.getByRole('separator'), 'pointerdown', 0, 200);
    pointer(window, 'pointermove', 0, 230);
    pointer(window, 'pointerup', 0, 230);
    expect(screen.getByText('Top')).toHaveStyle({ flexBasis: '230px' });
  },
);
apiTest(
  'splitter',
  'Splitter Events',
  ['resize-start', 'resize', 'resize-end'],
  'splitter-basic',
  '拖动调整相邻面板并依次回传生命周期',
  () => {
    const start = vi.fn(),
      resize = vi.fn(),
      end = vi.fn();
    render(
      <Splitter onResizeStart={start} onResize={resize} onResizeEnd={end}>
        <SplitterPanel>A</SplitterPanel>
        <SplitterPanel>B</SplitterPanel>
        <SplitterPanel>C</SplitterPanel>
      </Splitter>,
    );
    pointer(screen.getAllByRole('separator')[0], 'pointerdown', 200);
    expect(start).toHaveBeenCalledWith(0, [200, 200, 200]);
    pointer(window, 'pointermove', 250);
    expect(resize).toHaveBeenCalledWith(0, [250, 150, 200]);
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '250px' });
    pointer(window, 'pointerup', 250);
    expect(end).toHaveBeenCalledWith(0, [250, 150, 200]);
    pointer(window, 'pointermove', 300);
    expect(resize).toHaveBeenCalledTimes(1);
  },
);
apiTest('splitter', 'Splitter Attributes', ['lazy'], 'splitter-lazy', '惰性拖动仅在释放时提交尺寸', () => {
  render(
    <Splitter lazy>
      <SplitterPanel>A</SplitterPanel>
      <SplitterPanel>B</SplitterPanel>
    </Splitter>,
  );
  pointer(screen.getByRole('separator'), 'pointerdown', 300);
  pointer(window, 'pointermove', 340);
  expect(screen.getByText('A')).toHaveStyle({ flexBasis: '300px' });
  pointer(window, 'pointerup', 340);
  expect(screen.getByText('A')).toHaveStyle({ flexBasis: '340px' });
});
apiTest(
  'splitter',
  'SplitterPanel Attributes',
  ['size', 'min', 'max'],
  'splitter-size',
  '面板尺寸支持像素百分比并将拖动限制在相邻约束交集',
  () => {
    const update = vi.fn();
    render(
      <Splitter>
        <SplitterPanel defaultSize="40%" min={100} max="50%" onSizeChange={update}>
          A
        </SplitterPanel>
        <SplitterPanel min={250}>B</SplitterPanel>
      </Splitter>,
    );
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '240px' });
    pointer(screen.getByRole('separator'), 'pointerdown', 240);
    pointer(window, 'pointermove', 600);
    pointer(window, 'pointerup', 600);
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '300px' });
    expect(update).toHaveBeenCalledWith(300);
  },
);
apiTest(
  'splitter',
  'SplitterPanel Events',
  ['update:size'],
  'splitter-size',
  '受控size保持父级数值直到属性回写',
  () => {
    const update = vi.fn();
    const view = render(
      <Splitter>
        <SplitterPanel size={200} onSizeChange={update}>
          A
        </SplitterPanel>
        <SplitterPanel>B</SplitterPanel>
      </Splitter>,
    );
    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
    expect(update).toHaveBeenCalledWith(210);
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '200px' });
    view.rerender(
      <Splitter>
        <SplitterPanel size={210} onSizeChange={update}>
          A
        </SplitterPanel>
        <SplitterPanel>B</SplitterPanel>
      </Splitter>,
    );
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '210px' });
  },
);
apiTest(
  'splitter',
  'SplitterPanel Attributes',
  ['resizable'],
  'splitter-disableDrag',
  '任一相邻面板禁用调整时指针和键盘均不能改变尺寸',
  () => {
    const resize = vi.fn();
    render(
      <Splitter onResize={resize}>
        <SplitterPanel>A</SplitterPanel>
        <SplitterPanel resizable={false}>B</SplitterPanel>
      </Splitter>,
    );
    const bar = screen.getByRole('separator');
    expect(bar).toHaveAttribute('aria-disabled', 'true');
    pointer(bar, 'pointerdown', 300);
    pointer(window, 'pointermove', 500);
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(resize).not.toHaveBeenCalled();
  },
);
apiTest(
  'splitter',
  'SplitterPanel Attributes',
  ['collapsible'],
  'splitter-collapsible',
  '折叠后再次操作恢复原尺寸',
  () => {
    const collapse = vi.fn();
    render(
      <Splitter onCollapse={collapse}>
        <SplitterPanel collapsible min={100}>
          A
        </SplitterPanel>
        <SplitterPanel>B</SplitterPanel>
      </Splitter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Collapse or restore panel 1' }));
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '0px' });
    expect(collapse).toHaveBeenCalledWith(0, 'start', [0, 600]);
    fireEvent.click(screen.getByRole('button', { name: 'Collapse or restore panel 1' }));
    expect(screen.getByText('A')).toHaveStyle({ flexBasis: '300px' });
  },
);
apiTest(
  'splitter',
  'Splitter Events',
  ['collapse'],
  'splitter-collapsible',
  '右侧折叠事件提供分隔线索引和目标方向',
  () => {
    const collapse = vi.fn();
    render(
      <Splitter onCollapse={collapse}>
        <SplitterPanel>A</SplitterPanel>
        <SplitterPanel collapsible>B</SplitterPanel>
      </Splitter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Collapse or restore panel 2' }));
    expect(collapse).toHaveBeenCalledWith(0, 'end', [600, 0]);
  },
);
apiTest(
  'splitter',
  'SplitterPanel Slots',
  ['default', 'start-collapsible', 'end-collapsible'],
  'splitter-collapsible',
  '面板内容与两端折叠按钮可自定义',
  () => {
    render(
      <Splitter>
        <SplitterPanel collapsible renderStartCollapsible={<b>Start icon</b>}>
          Content
        </SplitterPanel>
        <SplitterPanel collapsible renderEndCollapsible={<b>End icon</b>}>
          Other
        </SplitterPanel>
      </Splitter>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Start icon')).toBeInTheDocument();
    expect(screen.getByText('End icon')).toBeInTheDocument();
  },
);
apiTest(
  'splitter',
  'SplitterPanel Exposes',
  ['splitterPanelRef'],
  'splitter-basic',
  '公开面板DOM引用',
  () => {
    const ref = createRef<SplitterPanelHandle>();
    render(
      <Splitter>
        <SplitterPanel ref={ref}>Content</SplitterPanel>
        <SplitterPanel>Other</SplitterPanel>
      </Splitter>,
    );
    expect(ref.current?.splitterPanelRef).toBe(screen.getByText('Content'));
  },
);
featureTest('splitter', 'cancel-and-unmount', 'splitter-basic', '指针取消恢复尺寸且卸载解除拖动监听', () => {
  const resize = vi.fn();
  const view = render(
    <Splitter onResize={resize}>
      <SplitterPanel>A</SplitterPanel>
      <SplitterPanel>B</SplitterPanel>
    </Splitter>,
  );
  pointer(screen.getByRole('separator'), 'pointerdown', 300);
  pointer(window, 'pointermove', 350);
  pointer(window, 'pointercancel', 350);
  expect(screen.getByText('A')).toHaveStyle({ flexBasis: '300px' });
  pointer(screen.getByRole('separator'), 'pointerdown', 300);
  view.unmount();
  pointer(window, 'pointermove', 400);
  expect(resize).toHaveBeenCalledTimes(1);
});
