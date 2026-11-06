import { createRef, StrictMode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import { Scrollbar, Backtop, Affix, Image, ImageViewer } from '../packages/element-react';
import type { ScrollbarHandle } from '../packages/element-react';
import { apiTest, featureTest } from './contract';
afterEach(() => vi.restoreAllMocks());

apiTest(
  'scrollbar',
  'Attributes',
  [
    'height',
    'max-height',
    'native',
    'wrap-style',
    'wrap-class',
    'view-style',
    'view-class',
    'tag',
    'id',
    'role',
    'aria-label',
    'aria-orientation',
    'tabindex',
  ],
  'scrollbar-basic',
  '滚动容器和内容区域属性',
  () => {
    render(
      <Scrollbar
        height={200}
        maxHeight="300px"
        native
        wrapClass="wrap-custom"
        viewClass="view-custom"
        wrapStyle={{ padding: 4 }}
        viewStyle={{ color: 'red' }}
        tag="section"
        id="scroll"
        role="region"
        ariaLabel="内容区"
        ariaOrientation="vertical"
        tabIndex={0}
      >
        内容
      </Scrollbar>,
    );
    expect(document.querySelector('.el-scrollbar__wrap')).toHaveStyle({
      height: '200px',
      'max-height': '300px',
      padding: '4px',
    });
    expect(document.querySelector('.el-scrollbar__wrap')).toHaveClass('wrap-custom');
    expect(screen.getByRole('region')).toHaveClass('view-custom');
    expect(screen.getByRole('region').tagName).toBe('SECTION');
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', '内容区');
    expect(screen.getByRole('region')).toHaveAttribute('aria-orientation', 'vertical');
    expect(document.querySelector('.el-scrollbar__wrap')).toHaveAttribute('tabindex', '0');
    expect(document.querySelector('.el-scrollbar__bar')).toBeNull();
  },
);
apiTest('scrollbar', 'Events', ['scroll', 'end-reached'], 'scrollbar-basic', '滚动与到达边界', () => {
  const scroll = vi.fn(),
    end = vi.fn();
  render(
    <Scrollbar onScroll={scroll} onEndReached={end} distance={5}>
      内容
    </Scrollbar>,
  );
  const wrap = document.querySelector('.el-scrollbar__wrap') as HTMLDivElement;
  Object.defineProperties(wrap, {
    clientHeight: { value: 100 },
    scrollHeight: { value: 400 },
    clientWidth: { value: 100 },
    scrollWidth: { value: 300 },
  });
  wrap.scrollTop = 299;
  fireEvent.scroll(wrap);
  expect(scroll).toHaveBeenCalledWith({ scrollTop: 299, scrollLeft: 0 });
  expect(end).toHaveBeenCalledWith('bottom');
  wrap.scrollTop = 0;
  fireEvent.scroll(wrap);
  expect(end).toHaveBeenCalledWith('top');
  wrap.scrollLeft = 200;
  fireEvent.scroll(wrap);
  expect(end).toHaveBeenCalledWith('right');
});
apiTest(
  'scrollbar',
  'Attributes',
  ['always', 'min-size', 'distance', 'noresize'],
  'scrollbar-basic',
  '滑块最小尺寸和显隐配置',
  () => {
    const ref = createRef<ScrollbarHandle>();
    render(
      <Scrollbar ref={ref} always minSize={30} distance={5} noresize>
        内容
      </Scrollbar>,
    );
    const wrap = ref.current!.wrapRef!;
    Object.defineProperties(wrap, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 1000 },
      clientWidth: { value: 100 },
      scrollWidth: { value: 100 },
    });
    act(() => ref.current?.update());
    expect(document.querySelector('.is-vertical')).toHaveStyle({ opacity: 1 });
    expect(document.querySelector('.el-scrollbar__thumb')).toHaveStyle({ height: '30px' });
  },
);
apiTest(
  'scrollbar',
  'Exposes',
  ['handleScroll', 'scrollTo', 'setScrollTop', 'setScrollLeft', 'update', 'wrapRef'],
  'scrollbar-basic',
  '滚动实例方法',
  () => {
    const ref = createRef<ScrollbarHandle>(),
      scroll = vi.fn();
    render(
      <Scrollbar ref={ref} onScroll={scroll}>
        内容
      </Scrollbar>,
    );
    expect(ref.current?.wrapRef).toBe(document.querySelector('.el-scrollbar__wrap'));
    act(() => ref.current?.setScrollTop(50));
    expect(ref.current?.wrapRef?.scrollTop).toBe(50);
    act(() => ref.current?.setScrollLeft(30));
    expect(ref.current?.wrapRef?.scrollLeft).toBe(30);
    act(() => ref.current?.scrollTo({ top: 10, left: 20 }));
    expect(ref.current?.wrapRef?.scrollTop).toBe(10);
    act(() => ref.current?.scrollTo(5, 6));
    expect(ref.current?.wrapRef?.scrollLeft).toBe(5);
    act(() => ref.current?.handleScroll());
    expect(scroll).toHaveBeenLastCalledWith({ scrollTop: 6, scrollLeft: 5 });
  },
);
apiTest('scrollbar', 'Slots', ['default'], 'scrollbar-basic', '滚动内容', () => {
  render(
    <Scrollbar>
      <span>内容</span>
    </Scrollbar>,
  );
  expect(screen.getByText('内容').parentElement).toHaveClass('el-scrollbar__view');
});
apiTest(
  'backtop',
  'Attributes',
  ['target', 'visibility-height', 'right', 'bottom'],
  'backtop-basic',
  '指定容器阈值和位置',
  () => {
    render(
      <>
        <div id="scroll-target" />
        <Backtop target="#scroll-target" visibilityHeight={100} right={20} bottom={30} />
      </>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    const node = document.getElementById('scroll-target')!;
    node.scrollTop = 110;
    fireEvent.scroll(node);
    expect(screen.getByRole('button')).toHaveStyle({ right: '20px', bottom: '30px' });
  },
);
apiTest('backtop', 'Events', ['click'], 'backtop-basic', '回顶点击与原生平滑滚动', () => {
  const click = vi.fn();
  render(
    <>
      <div id="scroll-target" />
      <Backtop target="#scroll-target" visibilityHeight={1} onClick={click} />
    </>,
  );
  const node = document.getElementById('scroll-target')!;
  const scroll = vi.fn();
  node.scrollTo = scroll;
  node.scrollTop = 100;
  fireEvent.scroll(node);
  fireEvent.click(screen.getByRole('button'));
  expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  expect(click).toHaveBeenCalledTimes(1);
});
apiTest('backtop', 'Slots', ['default'], 'backtop-basic', '自定义回顶内容', () => {
  render(
    <>
      <div id="scroll-target" />
      <Backtop target="#scroll-target" visibilityHeight={0}>
        回到顶部
      </Backtop>
    </>,
  );
  expect(screen.getByRole('button')).toHaveTextContent('回到顶部');
});
apiTest(
  'affix',
  'Attributes',
  ['offset', 'position', 'target', 'z-index'],
  'affix-basic',
  '固定定位和容器边界',
  () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.id === 'affix-target'
        ? {
            top: 0,
            bottom: 120,
            left: 0,
            right: 200,
            width: 200,
            height: 120,
            x: 0,
            y: 0,
            toJSON: () => undefined,
          }
        : {
            top: -10,
            bottom: 30,
            left: 20,
            right: 220,
            width: 200,
            height: 40,
            x: 20,
            y: -10,
            toJSON: () => undefined,
          };
    });
    render(
      <div id="affix-target">
        <Affix offset={100} target="#affix-target" zIndex={500}>
          固定
        </Affix>
      </div>,
    );
    expect(screen.getByText('固定')).toHaveClass('el-affix--fixed');
    expect(screen.getByText('固定')).toHaveStyle({
      position: 'fixed',
      top: '100px',
      'z-index': 500,
      transform: 'translateY(-20px)',
    });
  },
);
apiTest('affix', 'Exposes', ['update', 'updateRoot'], 'affix-basic', '手动刷新定位', () => {
  const ref = createRef<{ update: () => void; updateRoot: () => void }>();
  let top = 100;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
    top,
    bottom: top + 40,
    left: 0,
    right: 200,
    width: 200,
    height: 40,
    x: 0,
    y: top,
    toJSON: () => undefined,
  }));
  render(
    <Affix ref={ref} offset={0}>
      内容
    </Affix>,
  );
  expect(screen.getByText('内容')).not.toHaveClass('el-affix--fixed');
  top = -10;
  act(() => ref.current?.update());
  expect(screen.getByText('内容')).toHaveClass('el-affix--fixed');
  top = 100;
  act(() => ref.current?.updateRoot());
  expect(screen.getByText('内容')).not.toHaveClass('el-affix--fixed');
});
apiTest('affix', 'Slots', ['default'], 'affix-basic', '固定内容', () => {
  render(
    <Affix>
      <span>内容</span>
    </Affix>,
  );
  expect(screen.getByText('内容')).toBeInTheDocument();
});
apiTest(
  'image',
  'Image Attributes',
  ['src', 'fit', 'alt', 'loading', 'referrerpolicy', 'crossorigin'],
  'image-basic',
  '图片原生属性和布局',
  () => {
    render(
      <Image
        src="/picture.png"
        fit="cover"
        alt="图片"
        loading="eager"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/picture.png');
    expect(img).toHaveAttribute('alt', '图片');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(img).toHaveAttribute('crossorigin', 'anonymous');
    expect(img).toHaveStyle({ 'object-fit': 'cover' });
  },
);
apiTest('image', 'Image Events', ['load', 'error'], 'image-basic', '加载成功失败及切换资源重试', () => {
  const load = vi.fn(),
    error = vi.fn();
  const { rerender } = render(<Image src="/a.png" onLoad={load} onError={error} />);
  fireEvent.load(screen.getByRole('img'));
  expect(load).toHaveBeenCalledTimes(1);
  fireEvent.error(screen.getByRole('img'));
  expect(error).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('img')).toBeNull();
  rerender(<Image src="/b.png" />);
  expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
});
apiTest('image', 'Image Slots', ['placeholder', 'error'], 'image-basic', '加载和失败自定义区域', () => {
  render(<Image src="/a.png" renderPlaceholder="加载占位" renderError="失败占位" />);
  expect(screen.getByText('加载占位')).toBeInTheDocument();
  fireEvent.error(screen.getByRole('img'));
  expect(screen.getByText('失败占位')).toBeInTheDocument();
});
apiTest(
  'image',
  'Image Attributes',
  ['preview-src-list', 'initial-index', 'preview-teleported', 'show-progress'],
  'image-basic',
  '预览列表与初始索引',
  async () => {
    render(
      <Image
        src="/a.png"
        previewSrcList={['/a.png', '/b.png']}
        initialIndex={1}
        previewTeleported
        showProgress
      />,
    );
    fireEvent.click(screen.getByRole('img'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());
    expect(screen.getByRole('img', { name: 'Preview' })).toHaveAttribute('src', '/b.png');
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  },
);
apiTest('image', 'Image Events', ['show', 'close', 'switch'], 'image-basic', '预览打开关闭和切换通知', () => {
  const show = vi.fn(),
    close = vi.fn(),
    change = vi.fn();
  render(
    <Image
      src="/a.png"
      previewSrcList={['/a.png', '/b.png']}
      onShow={show}
      onClose={close}
      onSwitch={change}
    />,
  );
  fireEvent.click(screen.getByRole('img'));
  expect(show).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
  expect(change).toHaveBeenCalledWith(1);
  fireEvent.click(screen.getByRole('button', { name: 'Close image viewer' }));
  expect(close).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).toBeNull();
});
apiTest('image', 'Image Exposes', ['showPreview'], 'image-basic', '预览实例入口', () => {
  const ref = createRef<{ showPreview: () => void }>();
  render(<Image src="/a.png" ref={ref} previewSrcList={['/a.png']} />);
  act(() => ref.current?.showPreview());
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
apiTest(
  'image',
  'Image Viewer Attributes',
  [
    'url-list',
    'initial-index',
    'infinite',
    'hide-on-click-modal',
    'z-index',
    'teleported',
    'show-progress',
    'close-on-press-escape',
  ],
  'image-basic',
  '查看器列表循环与关闭',
  () => {
    const close = vi.fn();
    render(
      <ImageViewer
        urlList={['/a.png', '/b.png']}
        initialIndex={1}
        infinite={false}
        hideOnClickModal
        zIndex={4000}
        showProgress
        onClose={close}
      />,
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
    expect(screen.getByRole('button', { name: 'Next image' })).toBeDisabled();
    expect(screen.getByRole('dialog')).toHaveStyle({ 'z-index': 4000 });
    fireEvent.click(document.querySelector('.el-image-viewer__mask')!);
    expect(close).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(close).toHaveBeenCalledTimes(2);
  },
);
apiTest(
  'image',
  'Image Viewer Attributes',
  ['zoom-rate', 'scale', 'min-scale', 'max-scale'],
  'image-basic',
  '缩放步长和边界',
  () => {
    render(<ImageViewer urlList={['/a.png']} scale={1} zoomRate={2} minScale={0.5} maxScale={2} />);
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByRole('img')).toHaveStyle({ transform: 'translate(0px,0px) scale(2) rotate(0deg)' });
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(screen.getByRole('img')).toHaveStyle({ transform: 'translate(0px,0px) scale(0.5) rotate(0deg)' });
  },
);
apiTest(
  'image',
  'Image Viewer Events',
  ['close', 'error', 'switch', 'rotate'],
  'image-basic',
  '查看器动作事件StrictMode不重复',
  () => {
    const close = vi.fn(),
      error = vi.fn(),
      change = vi.fn(),
      rotate = vi.fn();
    render(
      <StrictMode>
        <ImageViewer
          urlList={['/a.png', '/b.png']}
          onClose={close}
          onError={error}
          onSwitch={change}
          onRotate={rotate}
        />
      </StrictMode>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Rotate right' }));
    expect(rotate).toHaveBeenCalledTimes(1);
    expect(rotate).toHaveBeenCalledWith(90);
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    expect(change).toHaveBeenCalledWith(1);
    fireEvent.error(screen.getByRole('img'));
    expect(error).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Close image viewer' }));
    expect(close).toHaveBeenCalledTimes(1);
  },
);
apiTest(
  'image',
  'Image Viewer Slots',
  ['default', 'progress', 'toolbar', 'viewer-error'],
  'image-basic',
  '查看器所有作用域区域',
  () => {
    render(
      <ImageViewer
        urlList={['/a.png']}
        renderProgress={({ activeIndex, total }) => (
          <span>
            {activeIndex + 1} of {total}
          </span>
        )}
        renderToolbar={({ actions }) => <button onClick={() => actions('zoomIn')}>自定义放大</button>}
        renderViewerError={({ src }) => <span>{src}加载失败</span>}
      >
        额外内容
      </ImageViewer>,
    );
    expect(screen.getByText('1 of 1')).toBeInTheDocument();
    expect(screen.getByText('额外内容')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '自定义放大' }));
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('/a.png加载失败')).toBeInTheDocument();
  },
);
apiTest('image', 'Image Viewer Exposes', ['setActiveItem'], 'image-basic', '查看器实例切换', () => {
  const ref = createRef<{ setActiveItem: (index: number) => void }>();
  render(<ImageViewer ref={ref} urlList={['/a.png', '/b.png']} />);
  act(() => ref.current?.setActiveItem(1));
  expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
});
featureTest('image', 'drag-cleanup', 'image-basic', '图片拖动与卸载清理', () => {
  const { unmount } = render(<ImageViewer urlList={['/a.png']} />);
  fireEvent.mouseDown(screen.getByRole('img'), { clientX: 10, clientY: 10 });
  fireEvent.mouseMove(window, { clientX: 30, clientY: 40 });
  expect(screen.getByRole('img')).toHaveStyle({ transform: 'translate(20px,30px) scale(1) rotate(0deg)' });
  fireEvent.mouseUp(window);
  unmount();
  expect(document.body.style.overflow).not.toBe('hidden');
});
