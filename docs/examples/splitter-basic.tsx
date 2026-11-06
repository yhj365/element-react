import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/basic 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel>
          <div className="p-8">Panel 1</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Panel 2</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
