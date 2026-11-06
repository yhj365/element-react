'use client';
import { useEffect, useRef } from 'react';
import createClips from './clips';
import type { CSSProperties } from 'react';
import type { WatermarkFontType, WatermarkProps } from './types';
export type { WatermarkFontType, WatermarkProps } from './types';

/** 复用来源旋转裁剪与交错平铺算法，DOM节点与异步图片由当前Effect拥有。 */
export function Watermark({
  width,
  height,
  rotate = -22,
  zIndex = 9,
  image,
  content = 'Element Plus',
  font,
  gap = [100, 100],
  offset,
  children,
  style,
  ...rest
}: WatermarkProps) {
  const container = useRef<HTMLDivElement>(null);
  const fontKey = JSON.stringify(font ?? {}),
    contentKey = JSON.stringify(content);
  const [gapX, gapY] = gap;
  const offsetX = offset?.[0] ?? gapX / 2,
    offsetY = offset?.[1] ?? gapY / 2;
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let disposed = false;
    const canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');
    if (!context) return;
    const mark = document.createElement('div');
    mark.setAttribute('aria-hidden', 'true');
    const parsedFont = JSON.parse(fontKey) as WatermarkFontType;
    const text = JSON.parse(contentKey) as string | string[];
    const actualFont: Required<WatermarkFontType> = {
      color: 'rgba(0,0,0,.15)',
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      fontGap: 3,
      fontStyle: 'normal',
      textAlign: 'center',
      textBaseline: 'hanging',
      ...parsedFont,
    };
    let space = 0,
      markWidth = width ?? 120,
      markHeight = height ?? 64;
    if (!image) {
      context.font = `${Number(actualFont.fontSize)}px ${actualFont.fontFamily}`;
      const lines = Array.isArray(text) ? text : [text];
      let maxWidth = 0,
        maxHeight = 0;
      for (const line of lines) {
        const metrics = context.measureText(line);
        maxWidth = Math.max(maxWidth, Math.ceil(metrics.width));
        maxHeight = Math.max(
          maxHeight,
          Math.ceil(
            metrics.fontBoundingBoxAscent === undefined
              ? metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
              : metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
          ),
        );
      }
      const measuredHeight = maxHeight * lines.length + (lines.length - 1) * actualFont.fontGap;
      space = Math.ceil(Math.abs(Math.sin((Math.PI / 180) * rotate) * measuredHeight) / 2);
      markWidth = width ?? maxWidth + space;
      markHeight = height ?? measuredHeight;
    }
    const renderClips = createClips();
    let savedStyle = '';
    const observer =
      typeof MutationObserver === 'undefined'
        ? undefined
        : new MutationObserver((records) => {
            if (disposed) return;
            if (
              !host.contains(mark) ||
              records.some((record) => record.target === mark && record.type === 'attributes')
            )
              append();
          });
    /** 恢复仅影响水印自身的移除或样式变更，避免干扰业务内容更新。 */
    function append(): void {
      if (disposed) return;
      observer?.disconnect();
      mark.setAttribute('style', savedStyle);
      host!.append(mark);
      observer?.observe(host!, { attributes: true, childList: true, subtree: true });
    }
    /** 图片解码完成后只允许当前配置写入，过期回调在清理后失效。 */
    function draw(drawContent: string | string[] | HTMLImageElement): void {
      if (disposed) return;
      const [url, clipWidth] = renderClips(
        drawContent,
        rotate,
        window.devicePixelRatio || 1,
        markWidth,
        markHeight,
        actualFont,
        gapX,
        gapY,
        space,
      );
      const left = offsetX - gapX / 2,
        top = offsetY - gapY / 2;
      const styles: CSSProperties = {
        zIndex,
        position: 'absolute',
        left: Math.max(0, left),
        top: Math.max(0, top),
        width: left > 0 ? `calc(100% - ${left}px)` : '100%',
        height: top > 0 ? `calc(100% - ${top}px)` : '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat',
        backgroundPosition: `${Math.min(0, left)}px ${Math.min(0, top)}px`,
        backgroundImage: `url('${url}')`,
        backgroundSize: `${Math.floor(clipWidth)}px`,
      };
      for (const [property, value] of Object.entries(styles)) {
        const cssName = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        mark.style.setProperty(
          cssName,
          typeof value === 'number' && !['zIndex'].includes(property) ? `${value}px` : String(value),
        );
      }
      savedStyle = mark.getAttribute('style') ?? '';
      append();
    }
    let picture: HTMLImageElement | undefined;
    if (image) {
      picture = new Image();
      picture.crossOrigin = 'anonymous';
      picture.referrerPolicy = 'no-referrer';
      picture.onload = () => draw(picture!);
      picture.onerror = () => draw(text);
      picture.src = image;
    } else draw(text);
    return () => {
      disposed = true;
      observer?.disconnect();
      if (picture) {
        picture.onload = null;
        picture.onerror = null;
      }
      mark.remove();
    };
  }, [width, height, rotate, zIndex, image, fontKey, contentKey, gapX, gapY, offsetX, offsetY]);
  return (
    <div {...rest} ref={container} style={{ position: 'relative', ...style }}>
      {children}
    </div>
  );
}
