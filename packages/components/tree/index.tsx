'use client';

import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';
import { cx, useControllable, useNamespace, useText } from '../../hooks';
import { buildTree, cascadeKeys, checkedState, transformTree, treeChildren } from './model';
import type {
  TreeCheckInfo,
  TreeData,
  TreeDropType,
  TreeKey,
  TreeNode,
  TreeOptionProps,
  TreeProps,
  TreeV2Props,
} from './types';
export * from './types';

const EMPTY_DATA: TreeData[] = [];
const EMPTY_OPTIONS: TreeOptionProps = {};
const ROOT_LOAD = Symbol('tree-root-load');

/** 层级树和虚拟树共用选择、过滤、展开、懒加载及不可变节点操作。 */
export function Tree(props: TreeProps) {
  const {
    nodeKey,
    props: options = EMPTY_OPTIONS,
    lazy = false,
    showCheckbox = false,
    checkStrictly = false,
    renderAfterExpand = true,
    highlightCurrent = false,
    expandOnClickNode = true,
    checkOnClickNode = false,
    checkOnClickLeaf = true,
    autoExpandParent = true,
    accordion = false,
    indent = 18,
    virtual = false,
    height = 200,
    itemSize: itemSizeProp = 26,
  } = props;
  const ns = useNamespace('tree'),
    nodeNs = useNamespace('tree-node');
  const text = useText();
  const element = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(props.data ?? EMPTY_DATA);
  const [loadedChildren, setLoadedChildren] = useState(new Map<TreeKey, TreeData[]>());
  const [loaded, setLoaded] = useState(new Set<TreeKey>());
  const [loading, setLoading] = useState(new Set<TreeKey>());
  const identities = useRef(new WeakMap<TreeData, number>()),
    identitySeed = useRef(0);
  const keyOf = useCallback(
    (item: TreeData): TreeKey => {
      const field = nodeKey ?? options.value;
      const key = field === undefined ? undefined : item[field];
      if (typeof key === 'string' || typeof key === 'number') return key;
      let identity = identities.current.get(item);
      if (identity === undefined) {
        identity = ++identitySeed.current;
        identities.current.set(item, identity);
      }
      return `__node_${identity}`;
    },
    [nodeKey, options.value],
  );
  const model = useMemo(
    () => buildTree(data, options, keyOf, loadedChildren, loaded, lazy),
    [data, options, keyOf, loadedChildren, loaded, lazy],
  );
  const [initialSelected] = useState(() => cascadeKeys(model, props.defaultCheckedKeys ?? [], checkStrictly));
  const [selected, setSelected] = useControllable(
    props.checkedKeys === undefined ? undefined : cascadeKeys(model, props.checkedKeys, checkStrictly),
    initialSelected,
    (keys) => props.onCheckedKeysChange?.([...keys]),
  );
  const selection = useRef(selected);
  selection.current = selected;
  const [current, setCurrent] = useState<TreeKey | null>(props.currentNodeKey ?? null);
  const currentRef = useRef(current);
  currentRef.current = current;
  const [expanded, setExpanded] = useState(() => {
    const keys = new Set(
      props.defaultExpandAll ? model.nodes.map((node) => node.key) : (props.defaultExpandedKeys ?? []),
    );
    if (autoExpandParent)
      for (const key of [...keys]) {
        let parent = model.byKey.get(key)?.parent;
        while (parent && parent.level > 0) {
          keys.add(parent.key);
          parent = parent.parent;
        }
      }
    return keys;
  });
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const everExpanded = useRef(new Set(expanded));
  const [query, setQuery] = useState<unknown>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [focused, setFocused] = useState<TreeKey | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const rows = useRef(new Map<TreeKey, HTMLDivElement>());
  const requests = useRef(new Map<TreeKey | symbol, symbol>());
  const mounted = useRef(true),
    rootLoaded = useRef(false);
  const dragging = useRef<TreeNode | null>(null);
  const dropResult = useRef<{ target: TreeNode; type: TreeDropType } | null>(null);
  const pendingDropData = useRef<TreeData[] | null>(null);
  const itemSize = Number.isFinite(itemSizeProp) && itemSizeProp > 0 ? itemSizeProp : 26;
  const flags = checkedState(model, selected, checkStrictly);
  for (const node of model.nodes) {
    node.expanded = expanded.has(node.key);
    node.loading = loading.has(node.key);
    node.loaded = !lazy || loaded.has(node.key) || node.childNodes.length > 0;
    node.isCurrent = current === node.key;
  }

  useEffect(() => {
    setData(props.data ?? EMPTY_DATA);
    setLoadedChildren(new Map());
    setLoaded(new Set());
    setLoading(new Set());
    requests.current.clear();
  }, [props.data]);
  useEffect(() => {
    mounted.current = true;
    const pending = requests.current;
    return () => {
      mounted.current = false;
      pending.clear();
    };
  }, []);
  useEffect(() => {
    if (props.currentNodeKey !== undefined) setCurrent(props.currentNodeKey);
  }, [props.currentNodeKey]);
  useEffect(() => {
    if (focused !== null) rows.current.get(focused)?.focus();
  }, [focused, scrollTop]);

  /** 查询节点支持原始数据及稳定键，不依赖label唯一性。 */
  function getNode(value: TreeKey | TreeData): TreeNode | undefined {
    return typeof value === 'object'
      ? (model.nodes.find((node) => node.data === value) ?? model.byKey.get(keyOf(value)))
      : model.byKey.get(value);
  }
  /** 汇总当前勾选与半选数据，顺序保持来源树顺序。 */
  function info(): TreeCheckInfo {
    const state = checkedState(model, selection.current, checkStrictly);
    return {
      checkedKeys: model.nodes.filter((node) => state.checked.has(node.key)).map((node) => node.key),
      checkedNodes: model.nodes.filter((node) => state.checked.has(node.key)).map((node) => node.data),
      halfCheckedKeys: model.nodes.filter((node) => state.half.has(node.key)).map((node) => node.key),
      halfCheckedNodes: model.nodes.filter((node) => state.half.has(node.key)).map((node) => node.data),
    };
  }
  /** 勾选变化逐项通知实际改变的节点，不把父子级联重复算作用户点击。 */
  function applyChecked(next: Set<TreeKey>): void {
    const old = checkedState(model, selection.current, checkStrictly);
    const result = checkedState(model, next, checkStrictly);
    selection.current = next;
    setSelected(next);
    for (const node of model.nodes)
      if (
        old.checked.has(node.key) !== result.checked.has(node.key) ||
        old.half.has(node.key) !== result.half.has(node.key)
      )
        props.onCheckChange?.(node.data, result.checked.has(node.key), result.half.has(node.key));
  }
  /** 取消子节点时解除祖先显式勾选；深度选择跳过禁用后代。 */
  function check(node: TreeNode, checked: boolean, deep: boolean, interactive = false): void {
    if (interactive && node.disabled) return;
    const next = new Set(selection.current);
    /** 递归只改变允许级联的节点。 */
    function visit(item: TreeNode): void {
      if (checked) next.add(item.key);
      else next.delete(item.key);
      if (deep && !checkStrictly) for (const child of item.childNodes) if (!child.disabled) visit(child);
    }
    visit(node);
    if (!checked && !checkStrictly) {
      let parent = node.parent;
      while (parent && parent.level > 0) {
        next.delete(parent.key);
        parent = parent.parent;
      }
    }
    applyChecked(next);
    if (interactive) props.onCheck?.(node.data, info());
  }
  /** 设置当前节点，可按需展开所有祖先。 */
  function setCurrentKey(key: TreeKey | null, expandParents = true): void {
    const node = key === null ? undefined : model.byKey.get(key);
    const next = node?.key ?? null;
    if (currentRef.current === next) return;
    currentRef.current = next;
    setCurrent(next);
    props.onCurrentChange?.(node?.data ?? null, node ?? null);
    if (expandParents && node) {
      const keys = new Set(expandedRef.current);
      let parent = node.parent;
      while (parent && parent.level > 0) {
        keys.add(parent.key);
        everExpanded.current.add(parent.key);
        parent = parent.parent;
      }
      expandedRef.current = keys;
      setExpanded(keys);
    }
  }
  /** 异步节点加载接受一次结果，reject保留可重试状态。 */
  function loadNode(node: TreeNode, root = false): void {
    const requestKey = root ? ROOT_LOAD : node.key;
    if (!props.load || requests.current.has(requestKey)) return;
    const token = Symbol('tree-load');
    requests.current.set(requestKey, token);
    if (!root) setLoading((previous) => new Set(previous).add(node.key));
    /** 回调只属于当前请求和仍挂载的树。 */
    function valid(): boolean {
      return mounted.current && requests.current.get(requestKey) === token;
    }
    /** 清理加载状态；失败不写入loaded集合，允许下一次展开重试。 */
    function reject(): void {
      if (!valid()) return;
      requests.current.delete(requestKey);
      if (!root)
        setLoading((previous) => {
          const next = new Set(previous);
          next.delete(node.key);
          return next;
        });
    }
    /** 提交后再展开，保证节点数据和已加载状态一致。 */
    function resolve(children: TreeData[]): void {
      if (!valid()) return;
      reject();
      const safe = treeChildren(children);
      if (root) {
        rootLoaded.current = true;
        setData(safe);
      } else {
        setLoadedChildren((previous) => new Map(previous).set(node.key, safe));
        setLoaded((previous) => new Set(previous).add(node.key));
        const keys = new Set(expandedRef.current).add(node.key);
        expandedRef.current = keys;
        setExpanded(keys);
        everExpanded.current.add(node.key);
        const subtree = buildTree(safe, options, keyOf, new Map(), new Set(), lazy);
        /** 事件中的节点同步带上已加载子树，调用方无需读取过期快照。 */
        function adopt(child: TreeNode, parent: TreeNode): void {
          child.parent = parent;
          child.level = parent.level + 1;
          child.childNodes.forEach((item) => adopt(item, child));
        }
        node.childNodes = subtree.root.childNodes;
        node.children = node.childNodes;
        node.childNodes.forEach((child) => adopt(child, node));
        node.loaded = true;
        node.loading = false;
        node.expanded = true;
        props.onNodeExpand?.(node.data, node);
        if (selection.current.has(node.key) && !checkStrictly) {
          const checked = new Set(selection.current);
          for (const child of subtree.nodes) if (!child.disabled) checked.add(child.key);
          selection.current = checked;
          setSelected(checked);
        }
      }
    }
    try {
      const result = props.load(node, resolve, reject);
      if (result) void result.catch(reject);
    } catch {
      reject();
    }
  }
  useEffect(() => {
    if (lazy && !data.length && !rootLoaded.current) loadNode(model.root, true);
    // 根加载只在加载配置变化时重试，resolve产生的数据更新不再次发起请求。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy, props.load]);
  /** 展开时应用同级手风琴约束，懒加载先获取子项。 */
  function expand(node: TreeNode, next: boolean): void {
    if (node.isLeaf) return;
    if (next && lazy && !node.loaded && !node.childNodes.length) {
      loadNode(node);
      return;
    }
    const keys = new Set(expandedRef.current);
    if (next) {
      if (accordion)
        for (const sibling of node.parent?.childNodes ?? [])
          if (sibling.key !== node.key) keys.delete(sibling.key);
      keys.add(node.key);
      everExpanded.current.add(node.key);
      props.onNodeExpand?.(node.data, node);
    } else {
      keys.delete(node.key);
      props.onNodeCollapse?.(node.data, node);
    }
    expandedRef.current = keys;
    setExpanded(keys);
  }
  /** 过滤保留匹配节点及其祖先，查询命中路径会自动展开。 */
  function filterVisibility(node: TreeNode): boolean {
    const childVisible = node.childNodes.map(filterVisibility).some(Boolean);
    const own =
      query === null ||
      query === '' ||
      !props.filterNodeMethod ||
      props.filterNodeMethod(query, node.data, node);
    node.visible = own || childVisible;
    return node.visible;
  }
  model.root.childNodes.forEach(filterVisibility);
  /** 生成当前可见顺序，用于键盘和虚拟窗口。 */
  function flattened(keys = expanded): TreeNode[] {
    const output: TreeNode[] = [];
    /** 只遍历可见且已展开的后代。 */
    function visit(node: TreeNode): void {
      if (!node.visible) return;
      output.push(node);
      if (keys.has(node.key) || (query !== null && query !== '')) node.childNodes.forEach(visit);
    }
    model.root.childNodes.forEach(visit);
    return output;
  }
  const visible = flattened();
  /** 自定义滚动不依赖浏览器scrollTo，兼容测试环境及SSR。 */
  function scrollTo(offset: number): void {
    const next = Math.max(0, offset);
    if (element.current) element.current.scrollTop = next;
    setScrollTop(next);
  }
  /** 展开目标祖先，并根据策略滚动到可见窗口。 */
  function scrollToNode(
    key: TreeKey,
    strategy: 'auto' | 'smart' | 'center' | 'start' | 'end' = 'auto',
  ): void {
    const node = model.byKey.get(key);
    if (!node) return;
    const keys = new Set(expandedRef.current);
    let parent = node.parent;
    while (parent && parent.level > 0) {
      keys.add(parent.key);
      parent = parent.parent;
    }
    expandedRef.current = keys;
    setExpanded(keys);
    const index = flattened(keys).findIndex((item) => item.key === key),
      top = index * itemSize;
    if (!virtual) {
      rows.current.get(key)?.scrollIntoView?.({ block: strategy === 'center' ? 'center' : 'nearest' });
      return;
    }
    if (
      (strategy === 'auto' || strategy === 'smart') &&
      top >= scrollTop &&
      top + itemSize <= scrollTop + height
    )
      return;
    scrollTo(
      strategy === 'center'
        ? top - (height - itemSize) / 2
        : strategy === 'end'
          ? top - height + itemSize
          : top,
    );
  }
  /** 合并单个节点的已加载子树，拖放后仍保留远程加载的后代。 */
  function materializedNode(node: TreeNode): TreeData {
    const children = node.childNodes.map(materializedNode);
    const original = treeChildren(node.data[options.children ?? 'children']);
    if (children.length === original.length && children.every((child, index) => child === original[index]))
      return node.data;
    return withChildren(node.data, children);
  }
  /** 将懒加载结果合并成可编辑数据，后续操作不修改调用方的原始数组。 */
  function materialized(): TreeData[] {
    /** 只有包含已加载子树的分支才创建新对象。 */
    function visit(node: TreeNode): TreeData {
      const children = node.childNodes.map(visit);
      const original = treeChildren(node.data[options.children ?? 'children']);
      if (children.length === original.length && children.every((child, index) => child === original[index]))
        return node.data;
      const next = { ...node.data, [options.children ?? 'children']: children };
      identities.current.set(next, identities.current.get(node.data) ?? ++identitySeed.current);
      return next;
    }
    return model.root.childNodes.map(visit);
  }
  /** 原始节点更新统一经过不可变变换。 */
  function changeData(next: TreeData[]): void {
    const remaining = new Set<TreeKey>();
    /** 移除的节点不能通过尚未结束的加载回调复活。 */
    function collect(items: TreeData[]): void {
      for (const item of items) {
        remaining.add(keyOf(item));
        collect(treeChildren(item[options.children ?? 'children']));
      }
    }
    collect(next);
    for (const key of requests.current.keys())
      if (typeof key === 'symbol' || !remaining.has(key)) requests.current.delete(key);
    setLoading((previous) => new Set([...previous].filter((key) => remaining.has(key))));
    setData(next);
    setLoadedChildren(new Map());
    props.onDataChange?.(next);
  }
  /** 未设置node-key时，内部克隆节点沿用原始对象的弱引用标识。 */
  function carryIdentity(original: TreeData, clone: TreeData): void {
    const identity = identities.current.get(original);
    if (identity !== undefined) identities.current.set(clone, identity);
  }
  /** 创建更新副本时保留节点身份，避免无key数据在追加后丢失展开状态。 */
  function withChildren(original: TreeData, children: TreeData[]): TreeData {
    const next = { ...original, [options.children ?? 'children']: children };
    carryIdentity(original, next);
    return next;
  }
  /** 替换指定父节点的子树。 */
  function updateKeyChildren(key: TreeKey, children: TreeData[]): void {
    changeData(
      transformTree(
        materialized(),
        options.children ?? 'children',
        (item) => keyOf(item) === key,
        (item) => [withChildren(item, children)],
        carryIdentity,
      ),
    );
  }
  /** 删除节点及其后代，不修改外部数据。 */
  function remove(value: TreeKey | TreeData): void {
    const node = getNode(value);
    if (node)
      changeData(
        transformTree(
          materialized(),
          options.children ?? 'children',
          (item) => keyOf(item) === node.key,
          () => [],
          carryIdentity,
        ),
      );
  }
  /** 在指定节点之前或之后插入数据。 */
  function insert(data: TreeData, target: TreeKey | TreeData, after: boolean): void {
    const node = getNode(target);
    if (node)
      changeData(
        transformTree(
          materialized(),
          options.children ?? 'children',
          (item) => keyOf(item) === node.key,
          (item) => (after ? [item, data] : [data, item]),
          carryIdentity,
        ),
      );
  }
  /** 追加到根或指定父节点。 */
  function append(data: TreeData, parent?: TreeKey | TreeData): void {
    if (parent === undefined) changeData([...materialized(), data]);
    else {
      const node = getNode(parent);
      if (node) updateKeyChildren(node.key, [...node.childNodes.map((child) => child.data), data]);
    }
  }
  useImperativeHandle(props.ref, () => ({
    filter: setQuery,
    getNode,
    updateKeyChildren,
    remove,
    append,
    insertBefore: (data, target) => insert(data, target, false),
    insertAfter: (data, target) => insert(data, target, true),
    getCheckedNodes: (leafOnly = false, includeHalfChecked = false) => {
      const state = checkedState(model, selection.current, checkStrictly);
      return model.nodes
        .filter(
          (node) =>
            (!leafOnly || node.isLeaf) &&
            (state.checked.has(node.key) || (includeHalfChecked && state.half.has(node.key))),
        )
        .map((node) => node.data);
    },
    getCheckedKeys: (leafOnly = false) => {
      const state = checkedState(model, selection.current, checkStrictly);
      return model.nodes
        .filter((node) => state.checked.has(node.key) && (!leafOnly || node.isLeaf))
        .map((node) => node.key);
    },
    setCheckedKeys: (keys, leafOnly = false) => {
      const next = cascadeKeys(model, keys, checkStrictly);
      applyChecked(leafOnly ? new Set([...next].filter((key) => model.byKey.get(key)?.isLeaf)) : next);
    },
    setCheckedNodes: (nodes, leafOnly = false) => {
      const next = cascadeKeys(model, nodes.map(keyOf), checkStrictly);
      applyChecked(leafOnly ? new Set([...next].filter((key) => model.byKey.get(key)?.isLeaf)) : next);
    },
    setChecked: (value, checked, deep = false) => {
      const node = getNode(value);
      if (node) check(node, checked, deep);
    },
    getHalfCheckedKeys: () => info().halfCheckedKeys,
    getHalfCheckedNodes: () => info().halfCheckedNodes,
    getCurrentKey: () => currentRef.current,
    getCurrentNode: () => model.byKey.get(currentRef.current ?? '')?.data ?? null,
    setCurrentKey,
    setCurrentNode: (data) => setCurrentKey(getNode(data)?.key ?? null),
    expandNode: (node) => expand(node, true),
    collapseNode: (node) => expand(node, false),
    setExpandedKeys: (keys) => {
      expandedRef.current = new Set(keys);
      setExpanded(new Set(keys));
      keys.forEach((key) => everExpanded.current.add(key));
    },
    setData: changeData,
    scrollTo,
    scrollToNode,
  }));

  /** 激活节点时分别处理当前项、展开和勾选，保持事件语义独立。 */
  function click(node: TreeNode, event: MouseEvent<HTMLElement>): void {
    event.stopPropagation();
    setFocused(node.key);
    setCurrentKey(node.key, false);
    if (expandOnClickNode && !node.isLeaf) expand(node, !expanded.has(node.key));
    if (showCheckbox && (checkOnClickNode || (checkOnClickLeaf && node.isLeaf)))
      check(node, !flags.checked.has(node.key), true, true);
    props.onNodeClick?.(node.data, node, event);
  }
  /** 树方向键和Home/End遵循可见顺序；右键展开、左键折叠或返回父级。 */
  function keydown(node: TreeNode, event: KeyboardEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) return;
    const index = visible.indexOf(node);
    let target: TreeNode | undefined;
    if (event.key === 'ArrowDown') target = visible[(index + 1) % visible.length];
    else if (event.key === 'ArrowUp') target = visible[(index - 1 + visible.length) % visible.length];
    else if (event.key === 'Home') target = visible[0];
    else if (event.key === 'End') target = visible.at(-1);
    else if (event.key === 'ArrowRight') {
      if (!expanded.has(node.key)) expand(node, true);
      else target = node.childNodes[0];
    } else if (event.key === 'ArrowLeft') {
      if (expanded.has(node.key)) expand(node, false);
      else if (node.parent?.level) target = node.parent;
    } else if ((event.key === ' ' || event.key === 'Enter') && showCheckbox)
      check(node, !flags.checked.has(node.key), true, true);
    else if (event.key === 'Enter') {
      setCurrentKey(node.key, false);
    } else return;
    event.preventDefault();
    event.stopPropagation();
    if (target) {
      if (virtual) scrollToNode(target.key);
      setFocused(target.key);
    }
  }
  /** 拖放仅允许互不包含的节点，并依据鼠标位置确定前后或内部。 */
  function dropType(target: TreeNode, event: DragEvent<HTMLDivElement>): TreeDropType | undefined {
    const source = dragging.current;
    if (!source || source.key === target.key) return;
    let parent: TreeNode | null = target;
    while (parent) {
      if (parent.key === source.key && parent.level > 0) return;
      parent = parent.parent;
    }
    const rect = event.currentTarget.getBoundingClientRect(),
      ratio = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
    const type = ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inner';
    return props.allowDrop && !props.allowDrop(source, target, type) ? undefined : type;
  }
  /** 渲染普通或虚拟模式中的单个节点。 */
  function row(node: TreeNode, position?: number): React.ReactNode {
    const checked = flags.checked.has(node.key),
      half = flags.half.has(node.key),
      open = expanded.has(node.key) || (query !== null && query !== '');
    const extra = typeof options.class === 'function' ? options.class(node.data, node) : options.class;
    const customClass =
      typeof extra === 'object'
        ? Object.entries(extra)
            .filter((entry) => entry[1])
            .map(([name]) => name)
            .join(' ')
        : extra;
    return (
      <div
        key={node.key}
        ref={(target) => {
          if (target) rows.current.set(node.key, target);
          else rows.current.delete(node.key);
        }}
        role="treeitem"
        aria-label={node.label}
        aria-level={node.level}
        aria-expanded={node.isLeaf ? undefined : open}
        aria-selected={current === node.key}
        aria-checked={showCheckbox ? (half ? 'mixed' : checked) : undefined}
        tabIndex={focused === node.key || (focused === null && visible[0]?.key === node.key) ? 0 : -1}
        className={cx(
          nodeNs.b,
          open && 'is-expanded',
          node.isLeaf && 'is-leaf',
          checked && 'is-checked',
          current === node.key && 'is-current',
          node.disabled && 'is-disabled',
          customClass,
        )}
        style={{
          display: node.visible ? undefined : 'none',
          ...(position === undefined
            ? {}
            : { position: 'absolute', top: position * itemSize, left: 0, right: 0, height: itemSize }),
        }}
        onKeyDown={(event) => keydown(node, event)}
        draggable={props.draggable && (!props.allowDrag || props.allowDrag(node))}
        onDragStart={(event) => {
          event.stopPropagation();
          if (!props.draggable || (props.allowDrag && !props.allowDrag(node))) {
            event.preventDefault();
            return;
          }
          dragging.current = node;
          setIsDragging(true);
          dropResult.current = null;
          pendingDropData.current = null;
          event.dataTransfer?.setData('text/plain', String(node.key));
          props.onNodeDragStart?.(node, event);
        }}
        onDragEnter={(event) => {
          event.stopPropagation();
          if (dragging.current) props.onNodeDragEnter?.(dragging.current, node, event);
        }}
        onDragLeave={(event) => {
          event.stopPropagation();
          if (dragging.current) props.onNodeDragLeave?.(dragging.current, node, event);
        }}
        onDragOver={(event) => {
          event.stopPropagation();
          if (props.onNodeExternalDrop || dropType(node, event)) event.preventDefault();
          if (dragging.current) props.onNodeDragOver?.(dragging.current, node, event);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const source = dragging.current,
            type = dropType(node, event);
          if (!source) {
            props.onNodeExternalDrop?.(node.data, node, event);
            return;
          }
          if (!source || !type) return;
          const sourceData = materializedNode(source);
          let next = transformTree(
            materialized(),
            options.children ?? 'children',
            (item) => keyOf(item) === source.key,
            () => [],
            carryIdentity,
          );
          next = transformTree(
            next,
            options.children ?? 'children',
            (item) => keyOf(item) === node.key,
            (item) =>
              type === 'before'
                ? [sourceData, item]
                : type === 'after'
                  ? [item, sourceData]
                  : [withChildren(item, [...treeChildren(item[options.children ?? 'children']), sourceData])],
            carryIdentity,
          );
          // 与来源一致，在dragend提交，避免移动节点先卸载而丢失dragend事件。
          pendingDropData.current = next;
          dropResult.current = { target: node, type };
        }}
        onDragEnd={(event) => {
          event.stopPropagation();
          if (pendingDropData.current) changeData(pendingDropData.current);
          if (dragging.current)
            props.onNodeDragEnd?.(
              dragging.current,
              dropResult.current?.target,
              dropResult.current?.type,
              event,
            );
          if (dragging.current && dropResult.current)
            props.onNodeDrop?.(dragging.current, dropResult.current.target, dropResult.current.type, event);
          dragging.current = null;
          setIsDragging(false);
          dropResult.current = null;
          pendingDropData.current = null;
        }}
      >
        <div
          className={nodeNs.e('content')}
          style={{ paddingLeft: (node.level - 1) * indent, ...(virtual ? { height: itemSize } : {}) }}
          onClick={(event) => click(node, event)}
          onContextMenu={(event) => {
            event.stopPropagation();
            props.onNodeContextmenu?.(event, node.data, node);
          }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label={`${open ? text.collapse : text.expand} ${node.label}`}
            disabled={node.isLeaf}
            className={cx(
              `${ns.namespace}-icon`,
              nodeNs.e('expand-icon'),
              open && 'expanded',
              node.isLeaf && 'is-leaf',
            )}
            onClick={(event) => {
              event.stopPropagation();
              expand(node, !open);
            }}
          >
            {props.icon ?? '▶'}
          </button>
          {showCheckbox && (
            <label
              className={cx(
                `${ns.namespace}-checkbox`,
                checked && 'is-checked',
                half && 'is-indeterminate',
                node.disabled && 'is-disabled',
              )}
              onClick={(event) => event.stopPropagation()}
            >
              <span
                className={cx(
                  `${ns.namespace}-checkbox__input`,
                  checked && 'is-checked',
                  half && 'is-indeterminate',
                  node.disabled && 'is-disabled',
                )}
              >
                <input
                  type="checkbox"
                  tabIndex={-1}
                  className={`${ns.namespace}-checkbox__original`}
                  aria-label={node.label}
                  aria-checked={half ? 'mixed' : checked}
                  ref={(input) => {
                    if (input) input.indeterminate = half;
                  }}
                  checked={checked}
                  disabled={node.disabled}
                  onChange={(event) => check(node, event.target.checked, true, true)}
                />
                <span className={`${ns.namespace}-checkbox__inner`} />
              </span>
            </label>
          )}
          {node.loading && (
            <span aria-label={text.loading} className={nodeNs.e('loading-icon')}>
              …
            </span>
          )}
          <span className={nodeNs.e('label')}>
            {props.renderContent?.({ node, data: node.data }) ?? node.label}
          </span>
        </div>
        {!virtual && !node.isLeaf && (!renderAfterExpand || everExpanded.current.has(node.key) || open) && (
          <div role="group" className={nodeNs.e('children')} style={{ display: open ? undefined : 'none' }}>
            {node.childNodes.map((child) => row(child))}
          </div>
        )}
      </div>
    );
  }
  const count = Math.ceil(height / itemSize) + 4,
    start = Math.min(Math.max(0, Math.floor(scrollTop / itemSize) - 2), Math.max(0, visible.length - count));
  return (
    <div
      ref={element}
      id={props.id}
      role="tree"
      aria-multiselectable={showCheckbox}
      className={cx(
        ns.b,
        highlightCurrent && ns.m('highlight-current'),
        isDragging && 'is-dragging',
        virtual && `${ns.namespace}-tree-v2`,
        props.className,
      )}
      style={{
        ...props.style,
        ...(virtual
          ? { height, overflow: props.scrollbarAlwaysOn ? 'scroll' : 'auto', position: 'relative' }
          : {}),
      }}
      onScroll={virtual ? (event) => setScrollTop(event.currentTarget.scrollTop) : undefined}
    >
      {visible.length ? (
        virtual ? (
          <div style={{ height: visible.length * itemSize, position: 'relative' }}>
            {visible.slice(start, start + count).map((node, index) => row(node, start + index))}
          </div>
        ) : (
          model.root.childNodes.map((node) => row(node))
        )
      ) : (
        <div className={ns.e('empty-block')}>
          {props.renderEmpty ?? <span className={ns.e('empty-text')}>{props.emptyText ?? text.empty}</span>}
        </div>
      )}
    </div>
  );
}

/** 虚拟树复用完整节点模型，仅渲染固定高度窗口中的节点。 */
export function TreeV2({ filterMethod, onNodeDrop, ...props }: TreeV2Props) {
  return (
    <Tree
      {...props}
      virtual
      nodeKey={props.props?.value ?? 'id'}
      filterNodeMethod={
        filterMethod ? (query, data, node) => filterMethod(String(query), data, node) : undefined
      }
      onNodeExternalDrop={onNodeDrop}
      indent={props.indent ?? 16}
    />
  );
}
