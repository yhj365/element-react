'use client';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useContext, useImperativeHandle, useState } from 'react';
import { ConfigContext, cx, useControllable, useNamespace } from '../../hooks';
import { Button, ButtonGroup } from '../button';
import type { Dayjs } from 'dayjs';
import type { BaseProps } from '../../hooks';
import type { ReactNode, Ref } from 'react';

export type CalendarDateType = 'prev-month' | 'next-month' | 'prev-year' | 'next-year' | 'today';
export interface CalendarHandle {
  readonly selectedDay: Dayjs | undefined;
  pickDay: (date: Dayjs) => void;
  selectDate: (type: CalendarDateType) => void;
  calculateValidatedDateRange: (start: Dayjs, end: Dayjs) => [Dayjs, Dayjs][];
}
export interface CalendarProps extends BaseProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date) => void;
  onInput?: (value: Date) => void;
  range?: [Date, Date];
  controllerType?: 'button' | 'select';
  formatter?: (value: number, type: 'year' | 'month') => string | number;
  renderHeader?: (scope: { date: string }) => ReactNode;
  renderDateCell?: (scope: {
    data: {
      type: 'prev-month' | 'current-month' | 'next-month';
      isSelected: boolean;
      day: string;
      date: Date;
    };
  }) => ReactNode;
  ref?: Ref<CalendarHandle>;
}

/** 来源日期范围按完整周展开，并避免跨月重复渲染同一周。 */
function calculateRange(start: Dayjs, end: Dayjs): [Dayjs, Dayjs][] {
  const first = start.startOf('week'),
    last = end.endOf('week');
  const firstMonth = first.month(),
    lastMonth = last.month();
  if (firstMonth === lastMonth) return [[first, last]];
  if ((firstMonth + 1) % 12 === lastMonth) {
    const cutoff = first.endOf('month');
    const lastStart = last.startOf('month');
    return [
      [first, cutoff],
      [(cutoff.isSame(lastStart, 'week') ? lastStart.add(1, 'week') : lastStart).startOf('week'), last],
    ];
  }
  if (firstMonth + 2 === lastMonth || (firstMonth + 1) % 11 === lastMonth) {
    const cutoff = first.endOf('month');
    const second = first.add(1, 'month').startOf('month');
    const secondStart = cutoff.isSame(second, 'week') ? second.add(1, 'week') : second;
    const secondEnd = secondStart.endOf('month');
    const lastStart = last.startOf('month');
    return [
      [first, cutoff],
      [secondStart.startOf('week'), secondEnd],
      [(secondEnd.isSame(lastStart, 'week') ? lastStart.add(1, 'week') : lastStart).startOf('week'), last],
    ];
  }
  return [];
}

/** 月历、受控日期和日期范围共用同一个日期选择入口。 */
export function Calendar({
  value,
  defaultValue,
  onValueChange,
  onInput,
  range,
  controllerType = 'button',
  formatter,
  renderHeader,
  renderDateCell,
  ref,
  className,
  ...rest
}: CalendarProps) {
  const ns = useNamespace('calendar');
  const config = useContext(ConfigContext);
  const locale = config.locale ?? 'en';
  const [now] = useState(() => dayjs().locale(locale));
  const [selected, setSelected] = useControllable<Date | undefined>(value, defaultValue, (next) => {
    if (next) onValueChange?.(next);
  });
  const validRange =
    range &&
    range.length === 2 &&
    range.every((date) => date instanceof Date && !Number.isNaN(+date)) &&
    !dayjs(range[0]).isAfter(range[1]) &&
    (dayjs(range[0]).isSame(range[1], 'month') || dayjs(range[0]).add(1, 'month').isSame(range[1], 'month'))
      ? calculateRange(dayjs(range[0]).locale(locale), dayjs(range[1]).locale(locale))
      : [];
  const date = selected ? dayjs(selected).locale(locale) : (validRange[0]?.[0] ?? now);
  /** 输入事件与模型更新请求保持来源先后顺序。 */
  function pickDay(next: Dayjs): void {
    onInput?.(next.toDate());
    setSelected(next.toDate());
  }
  function selectDate(type: CalendarDateType): void {
    const next =
      type === 'today'
        ? now
        : type === 'prev-month'
          ? date.subtract(1, 'month').date(1)
          : type === 'next-month'
            ? date.add(1, 'month').date(1)
            : type === 'prev-year'
              ? date.subtract(1, 'year').date(1)
              : date.add(1, 'year').date(1);
    if (!next.isSame(date, 'day')) pickDay(next);
  }
  useImperativeHandle(ref, () => ({
    get selectedDay() {
      return selected ? dayjs(selected).locale(locale) : undefined;
    },
    pickDay,
    selectDate,
    calculateValidatedDateRange: calculateRange,
  }));
  const heading =
    locale === 'zh-cn' ? `${date.year()} 年 ${date.month() + 1} 月` : `${date.year()} ${date.format('MMMM')}`;
  const weekStart = date.startOf('week');
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    locale === 'zh-cn'
      ? ['日', '一', '二', '三', '四', '五', '六'][weekStart.add(i, 'day').day()]
      : weekStart.add(i, 'day').format('ddd'),
  );
  /** 范围面板与普通月份都按完整周生成，单元格暴露相同数据。 */
  function table(start: Dayjs, end: Dayjs, base: Dayjs, key: number): ReactNode {
    const first = start.startOf('week');
    const last = end.endOf('week');
    const length = Math.round(last.startOf('day').diff(first.startOf('day'), 'day')) + 1;
    const rows = Array.from({ length: Math.ceil(length / 7) }, (_, row) =>
      Array.from({ length: 7 }, (_, column) => first.add(row * 7 + column, 'day')),
    );
    return (
      <div key={key} className={ns.e('body')}>
        <table
          className={cx(`${ns.namespace}-calendar-table`, validRange.length > 0 && 'is-range')}
          cellSpacing={0}
          cellPadding={0}
        >
          <thead>
            <tr>
              {weekdays.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell) => {
                  const type = cell.isBefore(base.startOf('month'))
                    ? 'prev-month'
                    : cell.isAfter(base.endOf('month'))
                      ? 'next-month'
                      : 'current-month';
                  const isSelected = Boolean(selected && cell.isSame(selected, 'day'));
                  const data = {
                    type,
                    isSelected,
                    day: cell.format('YYYY-MM-DD'),
                    date: cell.toDate(),
                  } as const;
                  return (
                    <td
                      key={data.day}
                      className={cx(
                        type,
                        ns.is('selected', isSelected),
                        ns.is('today', cell.isSame(now, 'day')),
                      )}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label={data.day}
                        aria-pressed={isSelected}
                        className={`${ns.namespace}-calendar-day`}
                        onClick={() => pickDay(cell)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            pickDay(cell);
                          }
                        }}
                      >
                        {renderDateCell ? renderDateCell({ data }) : <p>{cell.date()}</p>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div {...rest} className={cx(ns.b, className)}>
      <div className={ns.e('header')}>
        {renderHeader ? (
          renderHeader({ date: heading })
        ) : (
          <>
            <div className={ns.e('title')}>{heading}</div>
            {validRange.length === 0 &&
              (controllerType === 'button' ? (
                <div className={ns.e('button-group')}>
                  <ButtonGroup>
                    <Button size="small" onClick={() => selectDate('prev-month')}>
                      {locale === 'zh-cn' ? '上个月' : 'Previous Month'}
                    </Button>
                    <Button size="small" onClick={() => selectDate('today')}>
                      {locale === 'zh-cn' ? '今天' : 'Today'}
                    </Button>
                    <Button size="small" onClick={() => selectDate('next-month')}>
                      {locale === 'zh-cn' ? '下个月' : 'Next Month'}
                    </Button>
                  </ButtonGroup>
                </div>
              ) : (
                <div className={ns.e('select-controller')}>
                  <select
                    aria-label="Year"
                    value={date.year()}
                    onChange={(event) => pickDay(date.year(Number(event.target.value)))}
                  >
                    {Array.from({ length: 21 }, (_, index) => date.year() - 10 + index).map((year) => (
                      <option key={year} value={year}>
                        {formatter?.(year, 'year') ?? year}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Month"
                    value={date.month() + 1}
                    onChange={(event) => pickDay(date.month(Number(event.target.value) - 1))}
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <option key={month} value={month}>
                        {formatter?.(month, 'month') ?? month}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </>
        )}
      </div>
      {validRange.length
        ? validRange.map(([start, end], index) => table(start, end, start, index))
        : table(date.startOf('month'), date.endOf('month'), date, 0)}
    </div>
  );
}
