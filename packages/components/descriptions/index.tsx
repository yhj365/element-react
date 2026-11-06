'use client';
import { Children, Fragment, isValidElement } from 'react';
import { cx, useNamespace, useSize } from '../../hooks';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export interface DescriptionsItemProps extends BaseProps {
  label?: ReactNode;
  span?: number;
  rowspan?: number;
  width?: string | number;
  minWidth?: string | number;
  labelWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  labelAlign?: 'left' | 'center' | 'right';
  labelClassName?: string;
  renderLabel?: ReactNode;
}
/** 声明式描述项，由Descriptions按表格布局统一渲染。 */
export function DescriptionsItem(_props: DescriptionsItemProps) {
  return null;
}
export interface DescriptionsProps extends BaseProps {
  border?: boolean;
  column?: number;
  direction?: 'horizontal' | 'vertical';
  size?: ComponentSize;
  title?: ReactNode;
  extra?: ReactNode;
  labelWidth?: string | number;
  renderTitle?: ReactNode;
  renderExtra?: ReactNode;
}

/** 展开Fragment，保持描述项原顺序，不修改React元素的props。 */
function descriptionItems(children: ReactNode): ReactElement<DescriptionsItemProps>[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) return descriptionItems((child.props as { children?: ReactNode }).children);
    return child.type === DescriptionsItem ? [child as ReactElement<DescriptionsItemProps>] : [];
  });
}

/** 布局算法对应来源getRows，跨行占用及末项补列独立于子项原props。 */
export function Descriptions({
  border = false,
  column = 3,
  direction = 'horizontal',
  size,
  title = '',
  extra = '',
  labelWidth,
  renderTitle,
  renderExtra,
  children,
  className,
  ...rest
}: DescriptionsProps) {
  const ns = useNamespace('descriptions');
  const actualSize = useSize(size);
  const items = descriptionItems(children);
  const columns = Math.max(1, column);
  const rows: DescriptionsItemProps[][] = [];
  let pending: DescriptionsItemProps[] = [];
  let count = columns;
  let totalSpan = 0;
  const rowspans: number[] = [];
  items.forEach((item, index) => {
    const span = item.props.span || 1;
    const rowspan = item.props.rowspan || 1;
    const row = rows.length;
    rowspans[row] ||= 0;
    if (rowspan > 1)
      for (let i = 1; i < rowspan; i++) {
        rowspans[row + i] ||= 0;
        rowspans[row + i]++;
        totalSpan++;
      }
    if (rowspans[row] > 0) {
      count -= rowspans[row];
      rowspans[row] = 0;
    }
    if (index < items.length - 1) totalSpan += Math.min(span, count);
    if (index === items.length - 1) {
      pending.push({ ...item.props, span: columns - (totalSpan % columns), rowspan });
      rows.push(pending);
    } else if (span < count) {
      pending.push({ ...item.props, span, rowspan });
      count -= span;
    } else {
      pending.push({ ...item.props, span: Math.min(span, count), rowspan });
      rows.push(pending);
      pending = [];
      count = columns;
    }
  });
  /** 标签和内容单元格沿用来源的跨列/跨行计算。 */
  function cell(item: DescriptionsItemProps, type: 'label' | 'content' | 'both', key: string): ReactNode {
    const vertical = direction === 'vertical';
    const span = item.span ?? 1;
    const rowspan = item.rowspan ?? 1;
    const align = item.align && `is-${item.align}`;
    const labelAlign = item.labelAlign ? `is-${item.labelAlign}` : align;
    const width = type === 'label' ? (item.labelWidth ?? labelWidth ?? item.width) : item.width;
    const style: CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      minWidth: typeof item.minWidth === 'number' ? `${item.minWidth}px` : item.minWidth,
    };
    if (type === 'both') {
      const labelSize = item.labelWidth ?? labelWidth;
      return (
        <td key={key} className={cx(ns.e('cell'), align)} colSpan={span} rowSpan={rowspan} style={style}>
          {(item.renderLabel ?? item.label) !== undefined && (
            <span
              className={cx(ns.e('label'), item.labelClassName)}
              style={labelSize !== undefined ? { width: labelSize, display: 'inline-block' } : undefined}
            >
              {item.renderLabel ?? item.label}
            </span>
          )}
          <span className={cx(ns.e('content'), item.className)}>{item.children}</span>
        </td>
      );
    }
    const Tag = type === 'label' && vertical ? 'th' : 'td';
    return (
      <Tag
        key={key}
        className={cx(
          ns.e('cell'),
          ns.e(type),
          ns.is(type === 'label' ? 'bordered-label' : 'bordered-content', border),
          ns.is(type === 'label' ? 'vertical-label' : 'vertical-content', vertical),
          type === 'label' ? labelAlign : align,
          type === 'label' ? item.labelClassName : item.className,
        )}
        style={style}
        colSpan={type === 'label' ? (vertical ? span : 1) : vertical ? span : span * 2 - 1}
        rowSpan={type === 'label' ? (vertical ? 1 : rowspan) : vertical ? rowspan * 2 - 1 : rowspan}
      >
        {type === 'label' ? (item.renderLabel ?? item.label) : item.children}
      </Tag>
    );
  }
  const header = renderTitle ?? title;
  const ending = renderExtra ?? extra;
  return (
    <div {...rest} className={cx(ns.b, ns.m(actualSize), className)}>
      {(header !== '' || ending !== '') && (
        <div className={ns.e('header')}>
          <div className={ns.e('title')}>{header}</div>
          <div className={ns.e('extra')}>{ending}</div>
        </div>
      )}
      <div className={ns.e('body')}>
        <table className={cx(ns.e('table'), ns.is('bordered', border))}>
          <tbody>
            {rows.map((row, index) =>
              direction === 'vertical' ? (
                <Fragment key={index}>
                  <tr>{row.map((item, i) => cell(item, 'label', `${i}-label`))}</tr>
                  <tr>{row.map((item, i) => cell(item, 'content', `${i}-content`))}</tr>
                </Fragment>
              ) : (
                <tr key={index}>
                  {row.flatMap((item, i) =>
                    border
                      ? [cell(item, 'label', `${i}-label`), cell(item, 'content', `${i}-content`)]
                      : [cell(item, 'both', String(i))],
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
