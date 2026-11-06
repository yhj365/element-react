import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/vertical 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter layout="vertical">
        <SplitterPanel>
          <div className="p-6">Top</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-6">Bottom</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
