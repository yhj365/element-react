import type { TreeData, TreeKey, TreeNode, TreeOptionProps } from './types';

export interface TreeModel {
  root: TreeNode;
  nodes: TreeNode[];
  byKey: Map<TreeKey, TreeNode>;
}
/** 非对象子项不会进入树模型，防止无效远程数据破坏递归。 */
export function treeChildren(value: unknown): TreeData[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is TreeData => item !== null && typeof item === 'object' && !Array.isArray(item),
      )
    : [];
}

/** 原始数据转为带祖先引用的节点模型，检测重复键和循环数据。 */
export function buildTree(
  data: TreeData[],
  options: TreeOptionProps,
  keyOf: (data: TreeData) => TreeKey,
  lazyChildren: Map<TreeKey, TreeData[]>,
  loaded: Set<TreeKey>,
  lazy: boolean,
): TreeModel {
  const nodes: TreeNode[] = [],
    byKey = new Map<TreeKey, TreeNode>();
  const ancestors = new Set<TreeData>();
  /** 先创建节点再计算字段回调，使字段配置可以读取节点层级及父级。 */
  function visit(raw: TreeData, parent: TreeNode | null, root = false): TreeNode {
    if (ancestors.has(raw)) throw new Error('Tree data contains a cycle.');
    const key = root ? '__root__' : keyOf(raw);
    if (!root && byKey.has(key)) throw new Error(`Duplicate tree node key: ${String(key)}`);
    const node: TreeNode = {
      key,
      id: root ? 0 : nodes.length + 1,
      data: raw,
      label: '',
      text: '',
      level: parent ? parent.level + 1 : 0,
      parent,
      childNodes: [],
      children: [],
      isLeaf: false,
      disabled: false,
      loaded: loaded.has(key),
      loading: false,
      expanded: false,
      checked: false,
      indeterminate: false,
      isCurrent: false,
      visible: true,
    };
    if (!root) {
      nodes.push(node);
      byKey.set(key, node);
    }
    node.label = String(
      typeof options.label === 'function' ? options.label(raw, node) : (raw[options.label ?? 'label'] ?? ''),
    );
    node.text = node.label;
    node.disabled =
      typeof options.disabled === 'function'
        ? options.disabled(raw, node)
        : Boolean(raw[options.disabled ?? 'disabled']);
    ancestors.add(raw);
    const children = root
      ? data
      : (lazyChildren.get(key) ?? treeChildren(raw[options.children ?? 'children']));
    node.childNodes = children.map((child) => visit(child, node));
    node.children = node.childNodes;
    const explicitLeaf =
      typeof options.isLeaf === 'function' ? options.isLeaf(raw, node) : raw[options.isLeaf ?? 'isLeaf'];
    node.isLeaf =
      typeof explicitLeaf === 'boolean'
        ? explicitLeaf
        : node.childNodes.length === 0 && (!lazy || loaded.has(key));
    ancestors.delete(raw);
    return node;
  }
  const root = visit({}, null, true);
  return { root, nodes, byKey };
}

/** 级联选中跳过禁用后代；严格模式保持各节点独立。 */
export function cascadeKeys(model: TreeModel, keys: Iterable<TreeKey>, strict: boolean): Set<TreeKey> {
  const output = new Set(keys);
  if (!strict) {
    /** 向下扩展父级勾选，不改变禁用节点及其后代。 */
    function descend(node: TreeNode): void {
      for (const child of node.childNodes)
        if (!child.disabled) {
          output.add(child.key);
          descend(child);
        }
    }
    for (const key of keys) {
      const node = model.byKey.get(key);
      if (node) descend(node);
    }
  }
  return output;
}

/** 由明确勾选集合计算完整和半选状态，父级勾选不覆盖被禁用子项。 */
export function checkedState(
  model: TreeModel,
  selected: Set<TreeKey>,
  strict: boolean,
): { checked: Set<TreeKey>; half: Set<TreeKey> } {
  const checked = new Set<TreeKey>(),
    half = new Set<TreeKey>();
  /** 后序汇总子项，空分支不能因every空集被自动勾选。 */
  function visit(node: TreeNode): void {
    node.childNodes.forEach(visit);
    const enabled = node.childNodes.filter((child) => !child.disabled);
    const all = !strict && enabled.length > 0 && enabled.every((child) => checked.has(child.key));
    const some = !strict && enabled.some((child) => checked.has(child.key) || half.has(child.key));
    node.checked = selected.has(node.key) || all;
    node.indeterminate = !node.checked && some;
    if (node.checked) checked.add(node.key);
    if (node.indeterminate) half.add(node.key);
  }
  model.root.childNodes.forEach(visit);
  return { checked, half };
}

/** 生成不可变节点列表，回调返回替换项；未变化分支保留原始引用。 */
export function transformTree(
  data: TreeData[],
  childrenKey: string,
  match: (data: TreeData) => boolean,
  change: (data: TreeData) => TreeData[],
  carryIdentity?: (original: TreeData, clone: TreeData) => void,
): TreeData[] {
  return data.flatMap((item) => {
    if (match(item)) return change(item);
    const children = treeChildren(item[childrenKey]);
    if (!children.length) return [item];
    const next = transformTree(children, childrenKey, match, change, carryIdentity);
    if (next.length === children.length && next.every((child, index) => child === children[index]))
      return [item];
    const clone = { ...item, [childrenKey]: next };
    carryIdentity?.(item, clone);
    return [clone];
  });
}
