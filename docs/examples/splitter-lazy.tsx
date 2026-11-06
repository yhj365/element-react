import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/lazy 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter lazy>
        <SplitterPanel>
          <div className="p-8">Commit on release</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Preview while dragging</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
