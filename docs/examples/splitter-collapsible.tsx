import { Splitter, SplitterPanel } from 'element-react';
/** 对照官方 splitter/collapsible 场景。 */
export default function Example() {
  return (
    <div className="h-64 w-full border border-gray-200">
      <Splitter>
        <SplitterPanel collapsible min="20%">
          <div className="p-8">Collapsible start</div>
        </SplitterPanel>
        <SplitterPanel collapsible>
          <div className="p-8">Collapsible end</div>
        </SplitterPanel>
      </Splitter>
    </div>
  );
}
