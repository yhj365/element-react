import { useState } from 'react';
import { Pagination, Space } from 'element-react';

/** 页码和每页数量是两个独立的受控通道。 */
export default function Example() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  return (
    <Space direction="vertical" alignment="start">
      <Pagination
        currentPage={page}
        onCurrentPageChange={setPage}
        pageSize={size}
        onPageSizeChange={setSize}
        total={200}
        background
        layout="prev, pager, next, jumper, total"
      />
      <p>
        第 {page} 页，每页 {size} 条。
      </p>
    </Space>
  );
}
