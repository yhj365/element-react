import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/disableDrag 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel resizable={false}>
          <div className="p-8">Fixed</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Resize disabled</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
