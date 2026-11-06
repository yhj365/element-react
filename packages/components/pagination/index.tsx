'use client';
import { useEffect, useRef, useState } from 'react';
import { cx, useControllable, useNamespace, useSize } from '../../hooks';
import { Icon, Glyph } from '../icon';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { ReactNode } from 'react';

export interface PaginationProps extends BaseProps {
  size?: ComponentSize;
  small?: boolean;
  background?: boolean;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (size: number) => void;
  currentPage?: number;
  defaultCurrentPage?: number;
  onCurrentPageChange?: (page: number) => void;
  total?: number;
  pageCount?: number;
  pagerCount?: number;
  layout?: string;
  pageSizes?: number[];
  prevText?: string;
  nextText?: string;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  onSizeChange?: (size: number) => void;
  onCurrentChange?: (page: number) => void;
  onChange?: (page: number, size: number) => void;
  onPrevClick?: (page: number) => void;
  onNextClick?: (page: number) => void;
}

/** 分页分别管理页码和每页数量，省略号按pagerCount计算跳跃范围。 */
export function Pagination({
  size,
  small,
  background = false,
  pageSize,
  defaultPageSize = 10,
  onPageSizeChange,
  currentPage,
  defaultCurrentPage = 1,
  onCurrentPageChange,
  total,
  pageCount,
  pagerCount = 7,
  layout = 'prev, pager, next, jumper, ->, total',
  pageSizes = [10, 20, 30, 40, 50, 100],
  prevText,
  nextText,
  prevIcon,
  nextIcon,
  disabled = false,
  hideOnSinglePage = false,
  onSizeChange,
  onCurrentChange,
  onChange,
  onPrevClick,
  onNextClick,
  children,
  className,
  ...rest
}: PaginationProps) {
  const ns = useNamespace('pagination');
  const actualSize = useSize(size ?? (small ? 'small' : undefined));
  const [limit, setLimit] = useControllable(pageSize, defaultPageSize, onPageSizeChange);
  const [page, setPage] = useControllable(currentPage, defaultCurrentPage, onCurrentPageChange);
  const count = Math.max(1, Math.ceil(pageCount ?? (total === undefined ? 1 : total / Math.max(1, limit))));
  const current = Math.max(1, Math.min(count, page));
  const [jump, setJump] = useState(String(current));
  const previousCurrent = useRef(current);
  useEffect(() => {
    setJump(String(current));
    if (previousCurrent.current !== current) previousCurrent.current = current;
  }, [current]);
  /** 所有用户翻页请求经同一边界检查，来源change与值请求保持独立。 */
  function select(next: number, origin?: 'prev' | 'next'): void {
    if (disabled) return;
    const target = Math.max(1, Math.min(count, next));
    if (target !== current) {
      setPage(target);
      onCurrentChange?.(target);
      onChange?.(target, limit);
    }
    if (origin === 'prev') onPrevClick?.(target);
    if (origin === 'next') onNextClick?.(target);
  }
  /** 页大小改变时将越界页码钳制到新的末页。 */
  function changeSize(next: number): void {
    if (disabled) return;
    setLimit(next);
    onSizeChange?.(next);
    const nextCount = Math.max(1, Math.ceil(pageCount ?? (total ?? 0) / Math.max(1, next)));
    const target = Math.min(current, nextCount);
    if (target !== current) {
      setPage(target);
      onCurrentChange?.(target);
    }
    onChange?.(target, next);
  }
  const safePager = Math.max(5, pagerCount % 2 === 0 ? pagerCount + 1 : pagerCount);
  let pages: (number | 'prev-more' | 'next-more')[] = [];
  if (count <= safePager) pages = Array.from({ length: count }, (_, i) => i + 1);
  else {
    const half = Math.floor(safePager / 2);
    let start = Math.max(2, current - half + 1),
      end = Math.min(count - 1, current + half - 1);
    if (current <= half) end = safePager - 1;
    if (current >= count - half + 1) start = count - safePager + 2;
    pages = [
      1,
      ...(start > 2 ? ['prev-more' as const] : []),
      ...Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => i + start),
      ...(end < count - 1 ? ['next-more' as const] : []),
      count,
    ];
  }
  const parts = layout
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const split = parts.indexOf('->');
  const left = split < 0 ? parts : parts.slice(0, split);
  const right = split < 0 ? [] : parts.slice(split + 1);
  /** 布局项只负责展示及动作分发，不依赖业务路由。 */
  function part(name: string, index: number): ReactNode {
    switch (name) {
      case 'prev':
        return (
          <button
            key={index}
            type="button"
            className="btn-prev"
            aria-label="Previous page"
            disabled={disabled || current === 1}
            onClick={() => select(current - 1, 'prev')}
          >
            {prevText ?? (
              <Icon style={{ transform: 'rotate(180deg)' }}>{prevIcon ?? <Glyph name="arrow" />}</Icon>
            )}
          </button>
        );
      case 'next':
        return (
          <button
            key={index}
            type="button"
            className="btn-next"
            aria-label="Next page"
            disabled={disabled || current === count}
            onClick={() => select(current + 1, 'next')}
          >
            {nextText ?? <Icon>{nextIcon ?? <Glyph name="arrow" />}</Icon>}
          </button>
        );
      case 'pager':
        return (
          <ul key={index} className={`${ns.namespace}-pager`}>
            {pages.map((item) => (
              <li
                key={item}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={
                  typeof item === 'number'
                    ? `Page ${item}`
                    : item === 'prev-more'
                      ? 'Previous pages'
                      : 'Next pages'
                }
                aria-current={item === current ? 'page' : undefined}
                aria-disabled={disabled}
                className={cx(
                  typeof item === 'number' ? 'number' : 'more',
                  item === 'prev-more' ? 'btn-quickprev' : item === 'next-more' ? 'btn-quicknext' : '',
                  ns.is('active', item === current),
                  ns.is('disabled', disabled),
                )}
                onClick={() =>
                  select(
                    typeof item === 'number'
                      ? item
                      : current + (item === 'prev-more' ? -1 : 1) * (safePager - 2),
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    select(
                      typeof item === 'number'
                        ? item
                        : current + (item === 'prev-more' ? -1 : 1) * (safePager - 2),
                    );
                  }
                }}
              >
                {typeof item === 'number' ? item : '…'}
              </li>
            ))}
          </ul>
        );
      case 'total':
        return (
          <span key={index} className={ns.e('total')}>
            Total {total ?? 0}
          </span>
        );
      case 'sizes':
        return (
          <span key={index} className={ns.e('sizes')}>
            <select
              aria-label="Page size"
              disabled={disabled}
              value={limit}
              className={`${ns.namespace}-select__wrapper`}
              onChange={(event) => changeSize(Number(event.target.value))}
            >
              {pageSizes.map((value) => (
                <option key={value} value={value}>
                  {value} / page
                </option>
              ))}
            </select>
          </span>
        );
      case 'jumper':
        return (
          <span key={index} className={cx(ns.e('jump'), ns.is('disabled', disabled))}>
            Go to{' '}
            <span
              className={cx(
                `${ns.namespace}-input`,
                `${ns.namespace}-pagination__editor`,
                'is-in-pagination',
              )}
            >
              <span className={`${ns.namespace}-input__wrapper`}>
                <input
                  className={`${ns.namespace}-input__inner`}
                  type="number"
                  min={1}
                  max={count}
                  aria-label="Go to page"
                  disabled={disabled}
                  value={jump}
                  onChange={(event) => setJump(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      select(Number(jump) || 1);
                      setJump(String(Math.max(1, Math.min(count, Number(jump) || 1))));
                    }
                  }}
                  onBlur={() => {
                    select(Number(jump) || 1);
                    setJump(String(Math.max(1, Math.min(count, Number(jump) || 1))));
                  }}
                />
              </span>
            </span>
          </span>
        );
      case 'slot':
        return <span key={index}>{children}</span>;
      default:
        return null;
    }
  }
  if (hideOnSinglePage && count <= 1) return null;
  return (
    <div
      {...rest}
      role="navigation"
      aria-label="Pagination"
      className={cx(
        ns.b,
        actualSize && ns.m(actualSize),
        ns.is('background', background),
        ns.is('small', small),
        className,
      )}
    >
      {left.map(part)}
      {right.length > 0 && <div className={ns.e('rightwrapper')}>{right.map(part)}</div>}
    </div>
  );
}
