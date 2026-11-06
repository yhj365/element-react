import { Scrollbar } from 'element-react';
/** 原生滚动容器配合可拖动滚动条。 */
export default function Example() {
  return (
    <Scrollbar height={200} always>
      {Array.from({ length: 20 }, (_, i) => (
        <p
          key={i}
          style={{
            height: 36,
            background: 'var(--el-fill-color-light)',
            borderRadius: 4,
            textAlign: 'center',
            lineHeight: '36px',
          }}
        >
          {i + 1}
        </p>
      ))}
    </Scrollbar>
  );
}
