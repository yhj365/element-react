'use client';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ConfigContext, cx, useNamespace } from '../../hooks';
import { useLayer } from '../../hooks/use-layer';
import { Glyph, Icon } from '../icon';
import type { BaseProps } from '../../hooks';
import type { CSSProperties, ImgHTMLAttributes, ReactNode, Ref } from 'react';

export type ImageViewerAction = 'zoomIn' | 'zoomOut' | 'clockwise' | 'anticlockwise';
export interface ImageViewerScope {
  actions: (
    action: ImageViewerAction,
    options?: { zoomRate?: number; rotateDeg?: number; enableTransition?: boolean },
  ) => void;
  prev: () => void;
  next: () => void;
  reset: () => void;
  activeIndex: number;
  setActiveItem: (index: number) => void;
}
export interface ImageViewerProps extends BaseProps {
  urlList?: string[];
  zIndex?: number | string;
  initialIndex?: number;
  infinite?: boolean;
  hideOnClickModal?: boolean;
  teleported?: boolean;
  zoomRate?: number;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  closeOnPressEscape?: boolean;
  showProgress?: boolean;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  onClose?: () => void;
  onError?: (event: Event) => void;
  onSwitch?: (index: number) => void;
  onRotate?: (degrees: number) => void;
  renderProgress?: (scope: { activeIndex: number; total: number }) => ReactNode;
  renderToolbar?: (scope: ImageViewerScope) => ReactNode;
  renderViewerError?: (scope: { activeIndex: number; src: string }) => ReactNode;
  ref?: Ref<{ setActiveItem: (index: number) => void }>;
}
/** 图片查看器保留缩放、旋转、拖动、列表切换和焦点/滚动锁。 */
export function ImageViewer({
  urlList = [],
  zIndex,
  initialIndex = 0,
  infinite = true,
  hideOnClickModal = false,
  teleported = false,
  zoomRate = 1.2,
  scale = 1,
  minScale = 0.2,
  maxScale = 7,
  closeOnPressEscape = true,
  showProgress = false,
  crossOrigin,
  onClose,
  onError,
  onSwitch,
  onRotate,
  renderProgress,
  renderToolbar,
  renderViewerError,
  ref,
  children,
  className,
  style,
  ...rest
}: ImageViewerProps) {
  const ns = useNamespace('image-viewer');
  const config = useContext(ConfigContext);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(urlList.length - 1, initialIndex)));
  const [transform, setTransform] = useState({ scale, degree: 0, x: 0, y: 0, original: false });
  const transformSnapshot = useRef(transform);
  transformSnapshot.current = transform;
  const [failed, setFailed] = useState<string>();
  const [host, setHost] = useState<HTMLElement | null>(null);
  const node = useRef<HTMLDivElement>(null);
  const dragCleanup = useRef<(() => void) | undefined>(undefined);
  const current = urlList[index] ?? '';
  useEffect(() => setHost(document.body), []);
  useEffect(() => {
    setTransform({ scale, degree: 0, x: 0, y: 0, original: false });
    setFailed(undefined);
  }, [current, scale]);
  useEffect(() => {
    if (index >= urlList.length) setIndex(Math.max(0, urlList.length - 1));
  }, [index, urlList.length]);
  useEffect(() => () => dragCleanup.current?.(), []);
  useLayer({
    active: !teleported || Boolean(host),
    node,
    lock: true,
    escape: closeOnPressEscape,
    close: () => onClose?.(),
  });
  /** 索引更新触发switch，非循环模式越界操作被忽略。 */
  function setActiveItem(next: number): void {
    if (!urlList.length) return;
    const normalized = infinite
      ? ((next % urlList.length) + urlList.length) % urlList.length
      : Math.max(0, Math.min(urlList.length - 1, next));
    if (normalized !== index) {
      setIndex(normalized);
      onSwitch?.(normalized);
    }
  }
  /** 同步快照避免连击丢失步进，用户回调在事件中执行而非状态更新函数中。 */
  function actions(action: ImageViewerAction, options?: { zoomRate?: number; rotateDeg?: number }): void {
    const old = transformSnapshot.current;
    if (action === 'zoomIn' || action === 'zoomOut') {
      const rate = options?.zoomRate ?? zoomRate;
      const next = {
        ...old,
        scale: Math.min(
          maxScale,
          Math.max(minScale, action === 'zoomIn' ? old.scale * rate : old.scale / rate),
        ),
      };
      transformSnapshot.current = next;
      setTransform(next);
      return;
    }
    const degree = old.degree + (action === 'clockwise' ? 1 : -1) * (options?.rotateDeg ?? 90);
    onRotate?.(degree);
    const next = { ...old, degree };
    transformSnapshot.current = next;
    setTransform(next);
  }
  useImperativeHandle(ref, () => ({ setActiveItem }));
  /** 鼠标拖动以当前偏移为起点，结束后释放监听。 */
  function drag(event: React.MouseEvent<HTMLImageElement>): void {
    event.preventDefault();
    dragCleanup.current?.();
    const start = { x: event.clientX, y: event.clientY, offsetX: transform.x, offsetY: transform.y };
    const move = (next: MouseEvent): void =>
      setTransform((old) => ({
        ...old,
        x: start.offsetX + next.clientX - start.x,
        y: start.offsetY + next.clientY - start.y,
      }));
    const stop = (): void => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      dragCleanup.current = undefined;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    dragCleanup.current = stop;
  }
  const scope: ImageViewerScope = {
    actions,
    prev: () => setActiveItem(index - 1),
    next: () => setActiveItem(index + 1),
    reset: () =>
      setTransform((old) => ({ ...old, scale: 1, degree: 0, x: 0, y: 0, original: !old.original })),
    activeIndex: index,
    setActiveItem,
  };
  const content = (
    <div
      {...rest}
      ref={node}
      role="dialog"
      aria-label="Image viewer"
      tabIndex={-1}
      className={cx(ns.e('wrapper'), className)}
      style={{ zIndex: zIndex ?? config.zIndex, ...style }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scope.prev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scope.next();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          actions('zoomIn');
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          actions('zoomOut');
        } else if (event.code === 'Space') {
          event.preventDefault();
          scope.reset();
        }
      }}
      onWheel={(event) => {
        actions(event.deltaY < 0 ? 'zoomIn' : 'zoomOut');
      }}
    >
      <div
        className={ns.e('mask')}
        onClick={() => {
          if (hideOnClickModal) onClose?.();
        }}
      />
      <button
        type="button"
        aria-label="Close image viewer"
        className={cx(ns.e('btn'), ns.e('close'))}
        onClick={onClose}
      >
        <Icon>
          <Glyph name="close" />
        </Icon>
      </button>
      {urlList.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            disabled={!infinite && index === 0}
            className={cx(ns.e('btn'), ns.e('prev'), ns.is('disabled', !infinite && index === 0))}
            onClick={scope.prev}
          >
            <Icon style={{ transform: 'rotate(180deg)' }}>
              <Glyph name="arrow" />
            </Icon>
          </button>
          <button
            type="button"
            aria-label="Next image"
            disabled={!infinite && index === urlList.length - 1}
            className={cx(
              ns.e('btn'),
              ns.e('next'),
              ns.is('disabled', !infinite && index === urlList.length - 1),
            )}
            onClick={scope.next}
          >
            <Icon>
              <Glyph name="arrow" />
            </Icon>
          </button>
        </>
      )}
      {(showProgress || renderProgress) && (
        <div className={cx(ns.e('btn'), ns.e('progress'))}>
          {renderProgress
            ? renderProgress({ activeIndex: index, total: urlList.length })
            : `${index + 1} / ${urlList.length}`}
        </div>
      )}
      <div className={cx(ns.e('btn'), ns.e('actions'))}>
        <div className={ns.e('actions__inner')}>
          {renderToolbar ? (
            renderToolbar(scope)
          ) : (
            <>
              <button type="button" aria-label="Zoom out" onClick={() => actions('zoomOut')}>
                −
              </button>
              <button type="button" aria-label="Zoom in" onClick={() => actions('zoomIn')}>
                +
              </button>
              <button type="button" aria-label="Reset image" onClick={scope.reset}>
                ⤢
              </button>
              <button type="button" aria-label="Rotate left" onClick={() => actions('anticlockwise')}>
                ↶
              </button>
              <button type="button" aria-label="Rotate right" onClick={() => actions('clockwise')}>
                ↷
              </button>
            </>
          )}
        </div>
      </div>
      <div className={ns.e('canvas')}>
        {failed === current && renderViewerError ? (
          renderViewerError({ activeIndex: index, src: current })
        ) : (
          <img
            key={current}
            className={ns.e('img')}
            src={current}
            alt="Preview"
            crossOrigin={crossOrigin}
            draggable={false}
            onError={(event) => {
              setFailed(current);
              onError?.(event.nativeEvent);
            }}
            onMouseDown={drag}
            style={{
              transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.scale}) rotate(${transform.degree}deg)`,
              maxWidth: transform.original ? 'none' : '100%',
              maxHeight: transform.original ? 'none' : '100%',
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
  return teleported ? (host ? createPortal(content, host) : null) : content;
}

export interface ImageProps
  extends
    Omit<BaseProps, 'children'>,
    Pick<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'referrerPolicy' | 'crossOrigin' | 'loading'> {
  src?: string;
  fit?: CSSProperties['objectFit'] | '';
  lazy?: boolean;
  scrollContainer?: string | HTMLElement;
  previewSrcList?: string[];
  zIndex?: number;
  initialIndex?: number;
  infinite?: boolean;
  zoomRate?: number;
  scale?: number;
  minScale?: number;
  maxScale?: number;
  closeOnPressEscape?: boolean;
  hideOnClickModal?: boolean;
  previewTeleported?: boolean;
  showProgress?: boolean;
  onLoad?: (event: Event) => void;
  onError?: (event: Event) => void;
  onShow?: () => void;
  onClose?: () => void;
  onSwitch?: (index: number) => void;
  renderPlaceholder?: ReactNode;
  renderError?: ReactNode;
  renderViewer?: ReactNode;
  renderProgress?: ImageViewerProps['renderProgress'];
  renderToolbar?: ImageViewerProps['renderToolbar'];
  renderViewerError?: ImageViewerProps['renderViewerError'];
  ref?: Ref<{ showPreview: () => void }>;
}
/** 图片按源地址维护加载状态，懒加载观察器在进入可视区后释放。 */
export function Image({
  src = '',
  fit = '',
  lazy = false,
  scrollContainer,
  alt,
  referrerPolicy,
  crossOrigin,
  loading,
  previewSrcList = [],
  zIndex,
  initialIndex = 0,
  infinite = true,
  zoomRate = 1.2,
  scale = 1,
  minScale = 0.2,
  maxScale = 7,
  closeOnPressEscape = true,
  hideOnClickModal = false,
  previewTeleported = false,
  showProgress,
  onLoad,
  onError,
  onShow,
  onClose,
  onSwitch,
  renderPlaceholder,
  renderError,
  renderViewer,
  renderProgress,
  renderToolbar,
  renderViewerError,
  ref,
  className,
  style,
  ...rest
}: ImageProps) {
  const ns = useNamespace('image');
  const config = useContext(ConfigContext);
  const root = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(!lazy);
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    setFailed(undefined);
    setLoaded(undefined);
  }, [src]);
  useEffect(() => {
    if (!lazy) {
      setEntered(true);
      return;
    }
    if (entered) return;
    if (typeof IntersectionObserver === 'undefined') {
      setEntered(true);
      return;
    }
    const container =
      typeof scrollContainer === 'string'
        ? document.querySelector<HTMLElement>(scrollContainer)
        : scrollContainer;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { root: container ?? null },
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, [lazy, scrollContainer, entered]);
  /** 预览只在列表存在且图片未失败时打开。 */
  function showPreview(): void {
    if (previewSrcList.length && failed !== src) {
      setPreview(true);
      onShow?.();
    }
  }
  useImperativeHandle(ref, () => ({ showPreview }));
  const error = failed === src;
  const isLoading = loaded !== src;
  return (
    <div {...rest} ref={root} className={cx(ns.b, className)} style={style}>
      {error ? (
        (renderError ?? (
          <div className={ns.e('error')}>{config.locale === 'zh-cn' ? '加载失败' : 'FAILED'}</div>
        ))
      ) : (
        <>
          {entered && (
            <img
              src={src}
              alt={alt}
              referrerPolicy={referrerPolicy}
              crossOrigin={crossOrigin}
              loading={loading}
              className={cx(
                ns.e('inner'),
                ns.is('loading', isLoading),
                previewSrcList.length > 0 && `${ns.e('preview')}`,
              )}
              style={{ objectFit: fit || undefined }}
              tabIndex={previewSrcList.length ? 0 : undefined}
              onLoad={(event) => {
                setLoaded(src);
                onLoad?.(event.nativeEvent);
              }}
              onError={(event) => {
                setFailed(src);
                onError?.(event.nativeEvent);
              }}
              onClick={showPreview}
              onKeyDown={(event) => {
                if (event.key === 'Enter') showPreview();
              }}
            />
          )}
          {isLoading && (
            <div className={ns.e('wrapper')}>
              {renderPlaceholder ?? <div className={ns.e('placeholder')} />}
            </div>
          )}
        </>
      )}
      {preview && (
        <ImageViewer
          urlList={previewSrcList}
          zIndex={zIndex}
          initialIndex={initialIndex}
          infinite={infinite}
          zoomRate={zoomRate}
          scale={scale}
          minScale={minScale}
          maxScale={maxScale}
          closeOnPressEscape={closeOnPressEscape}
          hideOnClickModal={hideOnClickModal}
          teleported={previewTeleported}
          showProgress={showProgress}
          crossOrigin={crossOrigin}
          onSwitch={onSwitch}
          onClose={() => {
            setPreview(false);
            onClose?.();
          }}
          renderProgress={renderProgress}
          renderToolbar={renderToolbar}
          renderViewerError={renderViewerError}
        >
          {renderViewer}
        </ImageViewer>
      )}
    </div>
  );
}
