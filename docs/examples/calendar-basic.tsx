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
