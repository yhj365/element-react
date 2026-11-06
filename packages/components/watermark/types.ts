import type { BaseProps } from '../../hooks';

export interface WatermarkFontType {
  color?: string;
  fontSize?: number | string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number;
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
  fontFamily?: string;
  fontGap?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}
export interface WatermarkProps extends BaseProps {
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  /** 图片优先；加载失败时回退到文字。 */
  image?: string;
  content?: string | string[];
  font?: WatermarkFontType;
  gap?: [number, number];
  offset?: [number, number];
}
