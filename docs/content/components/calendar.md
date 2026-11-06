# Calendar 日历

受控日期、日期范围与单元格定制。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础月历

受控日期、日期范围与单元格定制。

```tsx
import { useState } from 'react';
import { Calendar } from 'element-react';
/** 可控制日期并定制日期单元格，月切换与单元格选择使用同一模型。 */
export default function Example() {
  const [value, setValue] = useState(new Date(2026, 10, 6));
  return (
    <Calendar
      value={value}
      onValueChange={setValue}
      renderDateCell={({ data }) => (
        <div>
          <span>{data.day.slice(-2)}</span>
          {data.day.endsWith('-06') && (
            <small style={{ display: 'block', color: 'var(--el-color-primary)' }}>事项</small>
          )}
        </div>
      )}
    />
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | model-value / v-model | value / defaultValue / onValueChange | binding value | Date | — |
| Attributes | range | range | time range, including start time and end time. Start time must be start day of week, end time must be end day of week, the time span cannot exceed two months. | array[Date, Date] | — |
| Attributes | controller-type | controllerType | type of the controller for Calendar header | enum'button' \| 'select' | button |
| Attributes | formatter | formatter | format label when `controller-type` is 'select' | Function(value: number, type: 'year' \| 'month') => string \| number | — |
| Slots | date-cell | renderDateCell | `type` indicates which month the date belongs, optional values are prev-month, current-month, next-month; `isSelected` indicates whether the date is selected; `day` is the formatted date in the format `YYYY-MM-DD`; `date` is date the cell represents | object{ data: { type: 'prev-month' \| 'current-month' \| 'next-month', isSelected: boolean, day: string, date: Date } } | — |
| Slots | header | renderHeader | content of the Calendar header | object{ date: string } | — |
| Exposes | selectedDay | ref.current.selectedDay | currently selected date | objectComputedRef<Dayjs \| undefined> | — |
| Exposes | pickDay | ref.current.pickDay | select a specific date | Function(day: dayjs.Dayjs) => void | — |
| Exposes | selectDate | ref.current.selectDate | select date | Function(type: CalendarDateType) => void | — |
| Exposes | calculateValidatedDateRange | ref.current.calculateValidatedDateRange | Calculate the validate date range according to the start and end dates | Function(startDayjs: dayjs.Dayjs, endDayjs: dayjs.Dayjs) => [dayjs.Dayjs, dayjs.Dayjs][] | — |

## 完成记录

- [x] calendar:62 value / defaultValue / onValueChange；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:63 range；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:64 controllerType；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:65 formatter；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:71 renderDateCell；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:72 renderHeader；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:78 ref.current.selectedDay；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:79 ref.current.pickDay；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:80 ref.current.selectDate；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
- [x] calendar:81 ref.current.calculateValidatedDateRange；实现：packages/components/calendar/index.tsx；测试：tests/descriptions-calendar.test.tsx
