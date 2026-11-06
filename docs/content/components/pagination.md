# Pagination 分页

独立的页码和页大小通道。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 分页与跳页

独立的页码和页大小通道。

```tsx
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
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Attributes | size | size | pagination size | enum'large' \| 'default' \| 'small' | 'default' |
| Attributes | background | background | whether the buttons have a background color | boolean | false |
| Attributes | page-size / v-model:page-size | pageSize / defaultPageSize / onPageSizeChange | item count of each page | number | — |
| Attributes | default-page-size | defaultPageSize | default initial value of page size, not setting is the same as setting 10 | number | — |
| Attributes | total | total | total item count | number | — |
| Attributes | page-count | pageCount | total page count. Set either `total` or `page-count` and pages will be displayed; if you need `page-sizes`, `total` is required | number | — |
| Attributes | pager-count | pagerCount | number of pagers. Pagination collapses when the total page count exceeds this value | number5 \| 7 \| 9 \| 11 \| 13 \| 15 \| 17 \| 19 \| 21 | 7 |
| Attributes | current-page / v-model:current-page | currentPage / defaultCurrentPage / onCurrentPageChange | current page number | number | — |
| Attributes | default-current-page | defaultCurrentPage | default initial value of current-page, not setting is the same as setting 1 | number | — |
| Attributes | layout | layout | layout of Pagination, elements separated with a comma | stringstring (consists of sizes, prev, pager, next, jumper, ->, total, slot) | prev, pager, next, jumper, ->, total |
| Attributes | page-sizes | pageSizes | options of item count per page | arraynumber[] | [10, 20, 30, 40, 50, 100] |
| Attributes | prev-text | prevText | text for the prev button | string | '' |
| Attributes | next-text | nextText | text for the next button | string | '' |
| Attributes | disabled | disabled | whether Pagination is disabled | boolean | false |
| Attributes | hide-on-single-page | hideOnSinglePage | whether to hide when there's only one page | boolean | false |
| Attributes | small | small | whether to use small pagination | boolean | false |
| Events | size-change | onSizeChange | triggers when `page-size` changes | Function(value: number) => void | — |
| Events | current-change | onCurrentChange | triggers when `current-page` changes | Function(value: number) => void | — |
| Events | change | onChange | triggers when `current-page` or `page-size` changes | Function(currentPage: number, pageSize: number) => void | — |
| Events | prev-click | onPrevClick | triggers when the prev button is clicked and current page changes | Function(value: number) => void | — |
| Events | next-click | onNextClick | triggers when the next button is clicked and current page changes | Function(value: number) => void | — |
| Slots | default | children | custom content. To use this, you need to declare `slot` in `layout` |  | — |

## 完成记录

- [x] pagination:70 size；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:71 background；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:72 pageSize / defaultPageSize / onPageSizeChange；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:73 defaultPageSize；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:74 total；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:75 pageCount；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:76 pagerCount；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:77 currentPage / defaultCurrentPage / onCurrentPageChange；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:78 defaultCurrentPage；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:79 layout；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:80 pageSizes；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:84 prevText；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:86 nextText；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:88 disabled；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:90 hideOnSinglePage；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:91 small；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:107 onSizeChange；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:108 onCurrentChange；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:109 onChange；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:110 onPrevClick；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:111 onNextClick；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
- [x] pagination:123 children；实现：packages/components/pagination/index.tsx；测试：tests/navigation-extra.test.tsx
