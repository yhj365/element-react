import { InputTag } from 'element-react';

/** 折叠保留原始索引，提示层中仍可关闭标签。 */
export default function Example() {
  return (
    <InputTag
      defaultValue={['React', 'Vue', 'Angular', 'Svelte']}
      collapseTags
      collapseTagsTooltip
      maxCollapseTags={2}
      ariaLabel="折叠标签"
    />
  );
}
