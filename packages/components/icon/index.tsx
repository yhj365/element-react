import { cx, useNamespace } from '../../hooks';
import type { BaseProps } from '../../hooks';

export interface IconProps extends BaseProps {
  size?: number | string;
  color?: string;
}
/** 与Element Plus的i容器和SVG尺寸继承规则保持一致。 */
export function Icon({ size, color, className, style, children, ...rest }: IconProps) {
  const ns = useNamespace('icon');
  return (
    <i
      {...rest}
      className={cx(ns.b, className)}
      style={{ fontSize: typeof size === 'number' ? `${size}px` : size, color, ...style }}
    >
      {children}
    </i>
  );
}

export interface GlyphProps {
  name?: 'close' | 'loading' | 'check' | 'arrow' | 'info' | 'warning' | 'error' | 'eye' | 'search';
}
/** 内部基础图形使用SVG，不引入Vue图标运行时。 */
export function Glyph({ name = 'info' }: GlyphProps) {
  const paths: Record<NonNullable<GlyphProps['name']>, string> = {
    search:
      'M448 64a384 384 0 1 0 245.5 679l185.3 185.3 45.2-45.2-185.3-185.3A384 384 0 0 0 448 64zm0 64a320 320 0 1 1 0 640 320 320 0 0 1 0-640z',
    close:
      'M195.2 195.2a64 64 0 0 1 90.5 0L512 421.5l226.3-226.3a64 64 0 1 1 90.5 90.5L602.5 512l226.3 226.3a64 64 0 0 1-90.5 90.5L512 602.5 285.7 828.8a64 64 0 0 1-90.5-90.5L421.5 512 195.2 285.7a64 64 0 0 1 0-90.5z',
    loading: 'M512 64a448 448 0 1 0 448 448h-64A384 384 0 1 1 512 128z',
    check: 'M406 749 175 518l45-45 186 186 398-398 45 45z',
    arrow: 'M384 192 704 512 384 832l-45-45 275-275-275-275z',
    info: 'M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896zm-32 192h64v64h-64zm0 128h64v384h-64z',
    warning: 'M512 64 32 896h960L512 64zm-32 256h64v320h-64zm0 384h64v64h-64z',
    error:
      'M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896zM320 275l192 192 192-192 45 45-192 192 192 192-45 45-192-192-192 192-45-45 192-192-192-192z',
    eye: 'M512 224C192 224 32 512 32 512s160 288 480 288 480-288 480-288-160-288-480-288zm0 96a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 96a96 96 0 1 0 0 192 96 96 0 0 0 0-192z',
  };
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d={paths[name]} />
    </svg>
  );
}
