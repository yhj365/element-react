import type { DragEvent, MouseEvent, ReactNode, Ref } from 'react';
import type { BaseProps } from '../../hooks';

export type TreeKey = string | number;
export type TreeData = Record<string, unknown>;
export interface TreeNode {
  key: TreeKey;
  id: number;
  data: TreeData;
  label: string;
  text: string;
  level: number;
  parent: TreeNode | null;
  childNodes: TreeNode[];
  children: TreeNode[];
  isLeaf: boolean;
  disabled: boolean;
  loaded: boolean;
  loading: boolean;
  expanded: boolean;
  checked: boolean;
  indeterminate: boolean;
  isCurrent: boolean;
  visible: boolean;
}
export interface TreeOptionProps {
  value?: string;
  label?: string | ((data: TreeData, node: TreeNode) => string);
  children?: string;
  disabled?: string | ((data: TreeData, node: TreeNode) => boolean);
  isLeaf?: string | ((data: TreeData, node: TreeNode) => boolean);
  class?: string | ((data: TreeData, node: TreeNode) => string | Record<string, boolean>);
}
export interface TreeCheckInfo {
  checkedKeys: TreeKey[];
  checkedNodes: TreeData[];
  halfCheckedKeys: TreeKey[];
  halfCheckedNodes: TreeData[];
}
export type TreeDropType = 'before' | 'after' | 'inner';
export interface TreeHandle {
  filter: (value: unknown) => void;
  updateKeyChildren: (key: TreeKey, data: TreeData[]) => void;
  getCheckedNodes: (leafOnly?: boolean, includeHalfChecked?: boolean) => TreeData[];
  setCheckedNodes: (nodes: TreeData[], leafOnly?: boolean) => void;
  getCheckedKeys: (leafOnly?: boolean) => TreeKey[];
  setCheckedKeys: (keys: TreeKey[], leafOnly?: boolean) => void;
  setChecked: (node: TreeKey | TreeData, checked: boolean, deep?: boolean) => void;
  getHalfCheckedNodes: () => TreeData[];
  getHalfCheckedKeys: () => TreeKey[];
  getCurrentKey: () => TreeKey | null;
  getCurrentNode: () => TreeData | null;
  setCurrentKey: (key: TreeKey | null, autoExpandParent?: boolean) => void;
  setCurrentNode: (data: TreeData) => void;
  getNode: (value: TreeKey | TreeData) => TreeNode | undefined;
  remove: (value: TreeKey | TreeData) => void;
  append: (data: TreeData, parent?: TreeKey | TreeData) => void;
  insertBefore: (data: TreeData, reference: TreeKey | TreeData) => void;
  insertAfter: (data: TreeData, reference: TreeKey | TreeData) => void;
  expandNode: (node: TreeNode) => void;
  collapseNode: (node: TreeNode) => void;
  setExpandedKeys: (keys: TreeKey[]) => void;
  setData: (data: TreeData[]) => void;
  scrollTo: (offset: number) => void;
  scrollToNode: (key: TreeKey, strategy?: 'auto' | 'smart' | 'center' | 'start' | 'end') => void;
}
export interface TreeProps extends BaseProps {
  data?: TreeData[];
  emptyText?: string;
  nodeKey?: string;
  props?: TreeOptionProps;
  renderAfterExpand?: boolean;
  load?: (node: TreeNode, resolve: (data: TreeData[]) => void, reject: () => void) => void | Promise<void>;
  renderContent?: (scope: { node: TreeNode; data: TreeData }) => ReactNode;
  highlightCurrent?: boolean;
  defaultExpandAll?: boolean;
  expandOnClickNode?: boolean;
  checkOnClickNode?: boolean;
  checkOnClickLeaf?: boolean;
  autoExpandParent?: boolean;
  defaultExpandedKeys?: TreeKey[];
  showCheckbox?: boolean;
  checkStrictly?: boolean;
  defaultCheckedKeys?: TreeKey[];
  checkedKeys?: TreeKey[];
  onCheckedKeysChange?: (keys: TreeKey[]) => void;
  currentNodeKey?: TreeKey | null;
  filterNodeMethod?: (value: unknown, data: TreeData, node: TreeNode) => boolean;
  accordion?: boolean;
  indent?: number;
  icon?: ReactNode;
  lazy?: boolean;
  draggable?: boolean;
  allowDrag?: (node: TreeNode) => boolean;
  allowDrop?: (dragging: TreeNode, target: TreeNode, type: TreeDropType) => boolean;
  renderEmpty?: ReactNode;
  onNodeClick?: (data: TreeData, node: TreeNode, event: MouseEvent<HTMLElement>) => void;
  onNodeContextmenu?: (event: MouseEvent<HTMLElement>, data: TreeData, node: TreeNode) => void;
  onCheckChange?: (data: TreeData, checked: boolean, indeterminate: boolean) => void;
  onCheck?: (data: TreeData, info: TreeCheckInfo) => void;
  onCurrentChange?: (data: TreeData | null, node: TreeNode | null) => void;
  onNodeExpand?: (data: TreeData, node: TreeNode) => void;
  onNodeCollapse?: (data: TreeData, node: TreeNode) => void;
  onNodeDragStart?: (node: TreeNode, event: DragEvent<HTMLElement>) => void;
  onNodeDragEnter?: (dragging: TreeNode, target: TreeNode, event: DragEvent<HTMLElement>) => void;
  onNodeDragLeave?: (dragging: TreeNode, target: TreeNode, event: DragEvent<HTMLElement>) => void;
  onNodeDragOver?: (dragging: TreeNode, target: TreeNode, event: DragEvent<HTMLElement>) => void;
  onNodeDragEnd?: (
    dragging: TreeNode,
    target: TreeNode | undefined,
    type: TreeDropType | undefined,
    event: DragEvent<HTMLElement>,
  ) => void;
  onNodeDrop?: (
    dragging: TreeNode,
    target: TreeNode,
    type: TreeDropType,
    event: DragEvent<HTMLElement>,
  ) => void;
  /** @internal 虚拟树接收外部的原生放置事件。 */
  onNodeExternalDrop?: (data: TreeData, node: TreeNode, event: DragEvent<HTMLElement>) => void;
  onDataChange?: (data: TreeData[]) => void;
  ref?: Ref<TreeHandle>;
  /** 虚拟树窗口参数，普通树不启用。 */
  virtual?: boolean;
  height?: number;
  itemSize?: number;
  scrollbarAlwaysOn?: boolean;
}
export interface TreeV2Props extends Omit<
  TreeProps,
  'virtual' | 'nodeKey' | 'filterNodeMethod' | 'onNodeDrop' | 'onNodeExternalDrop'
> {
  filterMethod?: (query: string, data: TreeData, node: TreeNode) => boolean;
  onNodeDrop?: (data: TreeData, node: TreeNode, event: DragEvent<HTMLElement>) => void;
}
