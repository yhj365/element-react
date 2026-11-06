import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { Watermark } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

let contexts: Array<Partial<CanvasRenderingContext2D>> = [];
let fill: Mock<CanvasRenderingContext2D['fillText']>,
  rotate: Mock<CanvasRenderingContext2D['rotate']>,
  draw: Mock<(image: CanvasImageSource, ...coordinates: number[]) => void>;
beforeEach(() => {
  contexts = [];
  fill = vi.fn();
  rotate = vi.fn();
  draw = vi.fn();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((() => {
    const context: Partial<CanvasRenderingContext2D> = {
      save: vi.fn(),
      translate: vi.fn(),
      rotate,
      drawImage: draw,
      fillText: fill,
      measureText: vi.fn(
        (text: string) =>
          ({
            width: text.length * 10,
            actualBoundingBoxAscent: 12,
            actualBoundingBoxDescent: 4,
            fontBoundingBoxAscent: 12,
            fontBoundingBoxDescent: 4,
          }) as TextMetrics,
      ),
    };
    contexts.push(context);
    return context;
    // jsdom不含画布实现；此测试只替换组件实际使用的2d方法。
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext);
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,d2F0ZXJtYXJr');
});
afterEach(() => vi.restoreAllMocks());

apiTest(
  'watermark',
  'Attributes',
  ['content', 'width', 'height', 'rotate', 'z-index', 'gap', 'offset'],
  'watermark-basic',
  '画布旋转、交错平铺、偏移和层级',
  () => {
    const view = render(
      <Watermark
        content={['第一行', '第二行']}
        width={120}
        height={64}
        rotate={30}
        zIndex={15}
        gap={[80, 60]}
        offset={[60, 10]}
      >
        <p>业务内容</p>
      </Watermark>,
    );
    const mark = view.container.querySelector('[aria-hidden="true"]');
    expect(mark).toHaveStyle({
      'z-index': '15',
      left: '20px',
      top: '0px',
      width: 'calc(100% - 20px)',
      'background-position': '0px -20px',
      'pointer-events': 'none',
      'background-repeat': 'repeat',
    });
    expect(mark).toHaveStyle({ 'background-image': 'url("data:image/png;base64,d2F0ZXJtYXJr")' });
    expect(rotate).toHaveBeenCalledWith(Math.PI / 6);
    expect(fill.mock.calls.map((call) => call[0])).toEqual(['第一行', '第二行']);
    expect(draw).toHaveBeenCalledTimes(4);
    expect(mark?.getAttribute('style')).toContain('background-size');
  },
);
apiTest('watermark', 'Attributes', ['font'], 'watermark-basic', '字体对象传入绘制配置', () => {
  render(
    <Watermark
      content="文字"
      font={{
        fontSize: 20,
        color: 'red',
        fontFamily: 'serif',
        fontWeight: 700,
        fontStyle: 'italic',
        fontGap: 8,
        textAlign: 'left',
        textBaseline: 'top',
      }}
    />,
  );
  expect(contexts[1]).toMatchObject({
    font: expect.stringContaining('italic normal 700 20px/'),
    fillStyle: 'red',
    textAlign: 'left',
    textBaseline: 'top',
  });
  expect(fill).toHaveBeenCalledWith('文字', expect.any(Number), 0);
});
apiTest(
  'watermark',
  'Font',
  ['color', 'fontSize', 'fontWeight', 'fontFamily', 'fontGap', 'fontStyle', 'textAlign', 'textBaseline'],
  'watermark-basic',
  '字体各字段改变实际绘制位置与样式',
  () => {
    render(
      <Watermark
        content={['甲', '乙']}
        rotate={0}
        font={{
          fontSize: 18,
          fontGap: 6,
          color: 'blue',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontStyle: 'oblique',
          textAlign: 'right',
          textBaseline: 'alphabetic',
        }}
      />,
    );
    expect(contexts[1]).toMatchObject({
      font: expect.stringContaining('oblique normal bold 18px/'),
      fillStyle: 'blue',
      textAlign: 'right',
    });
    expect(fill.mock.calls[1][2]).toBe(24);
    expect(contexts[1].measureText as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('甲');
  },
);
apiTest('watermark', 'Attributes', ['image'], 'watermark-basic', '图片优先并在失败时回退到文字', () => {
  const pictures: HTMLImageElement[] = [];
  vi.spyOn(window, 'Image').mockImplementation(function () {
    const image = document.createElement('img');
    pictures.push(image);
    return image;
  });
  const view = render(<Watermark image="watermark.png" content="后备文字" />);
  expect(pictures[0]).toHaveAttribute('crossorigin', 'anonymous');
  expect(pictures[0].referrerPolicy).toBe('no-referrer');
  act(() => pictures[0].dispatchEvent(new Event('load')));
  expect(fill).not.toHaveBeenCalled();
  expect(draw.mock.calls[0][0]).toBe(pictures[0]);
  view.rerender(<Watermark image="broken.png" content="后备文字" />);
  act(() => pictures[1].dispatchEvent(new Event('error')));
  expect(fill).toHaveBeenCalledWith('后备文字', expect.any(Number), expect.any(Number));
});
apiTest(
  'watermark',
  'Slots',
  ['default'],
  'watermark-basic',
  '内容保留在相对定位容器中且水印不拦截指针',
  () => {
    const view = render(
      <Watermark>
        <button>业务按钮</button>
      </Watermark>,
    );
    expect(view.container.firstChild).toHaveStyle({ position: 'relative' });
    expect(screen.getByRole('button', { name: '业务按钮' })).toBeInTheDocument();
    expect(view.container.querySelector('[aria-hidden="true"]')).toHaveStyle({ 'pointer-events': 'none' });
  },
);
featureTest(
  'watermark',
  'mutation-restore',
  'watermark-basic',
  '水印移除和样式修改后恢复，不干扰业务内容',
  async () => {
    const view = render(
      <Watermark content="水印">
        <p>内容</p>
      </Watermark>,
    );
    const mark = view.container.querySelector('[aria-hidden="true"]') as HTMLElement;
    mark.remove();
    await waitFor(() => expect(mark).toBeInTheDocument());
    mark.style.display = 'none';
    await waitFor(() => expect(mark.style.display).toBe(''));
    expect(screen.getByText('内容')).toBeInTheDocument();
    view.unmount();
    await act(async () => {
      await Promise.resolve();
    });
    expect(mark).not.toBeInTheDocument();
  },
);
featureTest('watermark', 'image-race', 'watermark-basic', '旧图片回调和卸载后的回调不能重新挂载水印', () => {
  const pictures: HTMLImageElement[] = [];
  vi.spyOn(window, 'Image').mockImplementation(function () {
    const image = document.createElement('img');
    pictures.push(image);
    return image;
  });
  const view = render(<Watermark image="old.png" />);
  const oldLoad = pictures[0].onload;
  view.rerender(<Watermark image="new.png" />);
  act(() => oldLoad?.call(pictures[0], new Event('load')));
  expect(view.container.querySelector('[aria-hidden="true"]')).toBeNull();
  act(() => pictures[1].dispatchEvent(new Event('load')));
  expect(view.container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  const newLoad = pictures[1].onload;
  view.unmount();
  act(() => newLoad?.call(pictures[1], new Event('load')));
  expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
});
