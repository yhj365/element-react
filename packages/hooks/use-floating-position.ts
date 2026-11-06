'use client';
import { useEffect, useState } from 'react';
import {
  autoUpdate,
  computePosition,
  flip,
  offset as offsetMiddleware,
  shift,
  arrow as arrowMiddleware,
} from '@floating-ui/dom';
import type { Placement, ReferenceElement } from '@floating-ui/dom';
import type { CSSProperties } from 'react';

export interface FloatingPositionOptions {
  reference: ReferenceElement | null;
  floating: HTMLElement | null;
  arrow: HTMLElement | null;
  active: boolean;
  placement: Placement;
  offset: number;
  fallbackPlacements?: Placement[];
  revision?: number;
}
/** 自动订阅滚动和尺寸变化；较旧计算结果及卸载后的结果会被丢弃。 */
export function useFloatingPosition({
  reference,
  floating,
  arrow,
  active,
  placement,
  offset,
  fallbackPlacements,
  revision = 0,
}: FloatingPositionOptions) {
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    placement: Placement;
    arrowX?: number;
    arrowY?: number;
    ready: boolean;
  }>({ x: 0, y: 0, placement, ready: false });
  const fallbackKey = JSON.stringify(fallbackPlacements);
  useEffect(() => {
    if (!reference || !floating || !active) return;
    let disposed = false;
    let version = 0;
    const fallbacks = JSON.parse(fallbackKey ?? 'null') as Placement[] | null;
    /** 一次定位只写入最新计算快照。 */
    async function update(): Promise<void> {
      const request = ++version;
      const result = await computePosition(reference!, floating!, {
        placement,
        middleware: [
          offsetMiddleware(offset),
          flip(fallbacks ? { fallbackPlacements: fallbacks } : {}),
          shift({ padding: 8 }),
          ...(arrow ? [arrowMiddleware({ element: arrow })] : []),
        ],
      });
      if (!disposed && request === version)
        setPosition({
          x: result.x,
          y: result.y,
          placement: result.placement,
          arrowX: result.middlewareData.arrow?.x,
          arrowY: result.middlewareData.arrow?.y,
          ready: true,
        });
    }
    const cleanup = autoUpdate(
      reference,
      floating,
      () => {
        void update();
      },
      {
        elementResize: typeof ResizeObserver !== 'undefined',
        layoutShift: typeof IntersectionObserver !== 'undefined',
      },
    );
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reference, floating, arrow, active, placement, offset, fallbackKey, revision]);
  const style: CSSProperties = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    visibility: position.ready ? undefined : 'hidden',
  };
  const staticSide = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[
    position.placement.split('-')[0]
  ];
  return {
    style,
    placement: position.placement,
    arrowStyle: { left: position.arrowX, top: position.arrowY, [staticSide!]: -5 } as CSSProperties,
  };
}
