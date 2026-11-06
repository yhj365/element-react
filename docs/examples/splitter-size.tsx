import { useState } from 'react';
import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/size 场景。 */
export default function Example() {
  const [size, setSize] = useState(200);
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel size={size} onSizeChange={setSize} min={100} max="70%">
          <div className="p-8">{Math.round(size)} px</div>
        </SplitterPanel>
        <SplitterPanel>
          <div className="p-8">Auto</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
