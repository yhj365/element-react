'use client';

import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Ref, RefObject } from 'react';
import { cx, useControllable, useDisabled, useNamespace } from '../../hooks';
import { Select } from '../select';
import type { SelectHandle, SelectModel, SelectOption, SelectOptionsScope, SelectProps } from '../select';
import { Tree } from '../tree';
import { buildTree } from '../tree/model';
import type { TreeData, TreeHandle, TreeKey, TreeNode, TreeProps } from '../tree';

export interface TreeSelectHandle extends TreeHandle, SelectHandle {
  readonly treeRef: TreeHandle | null;
  readonly selectRef: SelectHandle | null;
}
export interface TreeSelectProps
  extends
    Omit<SelectProps<TreeKey>, 'options' | 'props' | 'ref' | 'children' | 'renderOptions' | 'popupRole'>,
    Omit<TreeProps, 'ref' | 'children'> {
  cacheData?: TreeData[];
  ref?: Ref<TreeSelectHandle>;
}

interface TreeOptionsProps {
  scope: SelectOptionsScope<TreeKey>;
  tree: RefObject<TreeHandle | null>;
  props: TreeSelectProps;
  values: TreeKey[];
  keyField: string;
  disabled: boolean;
  remember: (node: TreeNode) => void;
}

/** 树选项把叶节点选择及复选结果交给Select统一提交，保留标签、限制和表单语义。 */
function TreeOptions({ scope, tree, props, values, keyField, disabled, remember }: TreeOptionsProps) {
  const { checkStrictly = false, showCheckbox = false, multiple = false } = props;
  useEffect(() => {
    tree.current?.filter(props.filterMethod ? '' : scope.query);
  }, [scope.query, props.filterMethod, tree]);
  return (
    <div
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape' || event.key === 'Tab') {
          if (event.key === 'Escape') event.preventDefault();
          event.stopPropagation();
          scope.close();
        } else if (
          event.key === 'Enter' &&
          !showCheckbox &&
          event.target instanceof HTMLElement &&
          event.target.getAttribute('role') === 'treeitem'
        ) {
          event.preventDefault();
          event.stopPropagation();
          (event.target.firstElementChild as HTMLElement | null)?.click();
        }
      }}
    >
      <Tree
        {...props}
        ref={tree}
        id={scope.id}
        className={undefined}
        style={undefined}
        nodeKey={keyField}
        checkedKeys={values}
        currentNodeKey={multiple ? undefined : (values[0] ?? null)}
        highlightCurrent={props.highlightCurrent ?? true}
        expandOnClickNode={!checkStrictly && (props.expandOnClickNode ?? true)}
        checkOnClickNode={props.checkOnClickNode ?? false}
        filterNodeMethod={
          props.filterNodeMethod ??
          ((query, _data, node) => node.label.toLowerCase().includes(String(query).toLowerCase()))
        }
        onNodeExpand={(data, node) => {
          remember(node);
          props.onNodeExpand?.(data, node);
        }}
        onNodeClick={(data, node, event) => {
          if (!disabled && !node.disabled && !showCheckbox && (checkStrictly || node.isLeaf)) {
            remember(node);
            scope.select(node.key, node.label);
          }
          props.onNodeClick?.(data, node, event);
        }}
        onCheck={(data, info) => {
          if (disabled) return;
          const target = tree.current?.getNode(data);
          if (target) remember(target);
          const unknown = values.filter((key) => !tree.current?.getNode(key));
          const keys = checkStrictly
            ? info.checkedKeys
            : info.checkedKeys.filter((key) => tree.current?.getNode(key)?.isLeaf);
          const next: SelectModel<TreeKey> = multiple
            ? [...unknown, ...keys]
            : checkStrictly
              ? target && keys.includes(target.key)
                ? target.key
                : undefined
              : keys[0];
          if (!scope.update(next)) tree.current?.setCheckedKeys(values);
          props.onCheck?.(data, info);
        }}
      />
    </div>
  );
}

/** 将缓存和已知树节点转换成Select标签选项，保留数字0而非按真假值过滤。 */
function optionsFrom(data: TreeData[], props: TreeSelectProps, keyField: string): SelectOption<TreeKey>[] {
  const getKey = (item: TreeData): TreeKey => {
    const value = item[keyField];
    return typeof value === 'number' || typeof value === 'string' ? value : `__unknown_${String(value)}`;
  };
  const model = buildTree(data, props.props ?? {}, getKey, new Map(), new Set(), Boolean(props.lazy));
  return model.nodes.map((node) => ({
    value: node.key,
    label: node.label || String(node.data.currentLabel ?? node.key),
    disabled: node.disabled || Boolean(node.data.isDisabled),
  }));
}

/** TreeSelect组合既有Select和Tree；原始值保持标量键，缓存只负责未加载节点的标签回显。 */
export function TreeSelect(props: TreeSelectProps) {
  const ns = useNamespace('tree-select');
  const {
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    cacheData = [],
    ref,
    data = [],
    nodeKey,
    valueKey = 'value',
    ...selectProps
  } = props;
  const keyField = nodeKey ?? valueKey;
  const [current, setCurrent] = useControllable<SelectModel<TreeKey>>(
    value,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  );
  const values = Array.isArray(current)
    ? current
    : current === undefined || current === null
      ? []
      : [current];
  const tree = useRef<TreeHandle>(null),
    select = useRef<SelectHandle>(null);
  const disabled = useDisabled(props.disabled);
  const [loadedOptions, setLoadedOptions] = useState(new Map<TreeKey, SelectOption<TreeKey>>());
  const options = new Map<TreeKey, SelectOption<TreeKey>>();
  for (const option of [
    ...optionsFrom(cacheData, props, keyField),
    ...loadedOptions.values(),
    ...optionsFrom(data, props, keyField),
  ])
    if (option.value !== undefined) options.set(option.value, option);
  /** 已加载或点击的节点标签进入缓存，确保远程叶节点选中后不退化为裸键。 */
  function remember(node: TreeNode): void {
    setLoadedOptions((previous) => {
      const next = new Map(previous);
      /** 递归保存本次节点及完整已加载后代。 */
      function visit(item: TreeNode): void {
        next.set(item.key, { value: item.key, label: item.label, disabled: item.disabled });
        item.childNodes.forEach(visit);
      }
      visit(node);
      return next;
    });
  }
  useImperativeHandle(ref, () => ({
    get treeRef() {
      return tree.current;
    },
    get selectRef() {
      return select.current;
    },
    get selectedLabel() {
      return select.current?.selectedLabel ?? (multiple ? [] : '');
    },
    focus: () => select.current?.focus(),
    blur: () => select.current?.blur(),
    filter: (query) => tree.current?.filter(query),
    updateKeyChildren: (key, data) => tree.current?.updateKeyChildren(key, data),
    getCheckedNodes: (...args) => tree.current?.getCheckedNodes(...args) ?? [],
    setCheckedNodes: (...args) => tree.current?.setCheckedNodes(...args),
    getCheckedKeys: (...args) => tree.current?.getCheckedKeys(...args) ?? [],
    setCheckedKeys: (...args) => tree.current?.setCheckedKeys(...args),
    setChecked: (...args) => tree.current?.setChecked(...args),
    getHalfCheckedNodes: () => tree.current?.getHalfCheckedNodes() ?? [],
    getHalfCheckedKeys: () => tree.current?.getHalfCheckedKeys() ?? [],
    getCurrentKey: () => tree.current?.getCurrentKey() ?? null,
    getCurrentNode: () => tree.current?.getCurrentNode() ?? null,
    setCurrentKey: (...args) => tree.current?.setCurrentKey(...args),
    setCurrentNode: (data) => tree.current?.setCurrentNode(data),
    getNode: (key) => tree.current?.getNode(key),
    remove: (key) => tree.current?.remove(key),
    append: (...args) => tree.current?.append(...args),
    insertBefore: (...args) => tree.current?.insertBefore(...args),
    insertAfter: (...args) => tree.current?.insertAfter(...args),
    expandNode: (node) => tree.current?.expandNode(node),
    collapseNode: (node) => tree.current?.collapseNode(node),
    setExpandedKeys: (keys) => tree.current?.setExpandedKeys(keys),
    setData: (data) => tree.current?.setData(data),
    scrollTo: (offset) => tree.current?.scrollTo(offset),
    scrollToNode: (...args) => tree.current?.scrollToNode(...args),
  }));
  // Tree专用属性不传递给Select原生DOM，Select只接收已声明的选择器配置。
  const {
    props: _treeFields,
    emptyText: _emptyText,
    renderAfterExpand: _renderAfterExpand,
    load: _load,
    renderContent: _renderContent,
    highlightCurrent: _highlightCurrent,
    defaultExpandAll: _defaultExpandAll,
    expandOnClickNode: _expandOnClickNode,
    checkOnClickNode: _checkOnClickNode,
    checkOnClickLeaf: _checkOnClickLeaf,
    autoExpandParent: _autoExpandParent,
    defaultExpandedKeys: _defaultExpandedKeys,
    showCheckbox: _showCheckbox,
    checkStrictly: _checkStrictly,
    defaultCheckedKeys: _defaultCheckedKeys,
    checkedKeys: _checkedKeys,
    onCheckedKeysChange: _onCheckedKeysChange,
    currentNodeKey: _currentNodeKey,
    filterNodeMethod: _filterNodeMethod,
    accordion: _accordion,
    indent: _indent,
    icon: _icon,
    lazy: _lazy,
    draggable: _draggable,
    allowDrag: _allowDrag,
    allowDrop: _allowDrop,
    onNodeClick: _onNodeClick,
    onNodeContextmenu: _onNodeContextmenu,
    onCheckChange: _onCheckChange,
    onCheck: _onCheck,
    onCurrentChange: _onCurrentChange,
    onNodeExpand: _onNodeExpand,
    onNodeCollapse: _onNodeCollapse,
    onNodeDragStart: _onNodeDragStart,
    onNodeDragEnter: _onNodeDragEnter,
    onNodeDragLeave: _onNodeDragLeave,
    onNodeDragOver: _onNodeDragOver,
    onNodeDragEnd: _onNodeDragEnd,
    onNodeDrop: _onNodeDrop,
    onNodeExternalDrop: _onNodeExternalDrop,
    onDataChange: _onDataChange,
    virtual: _virtual,
    height: _height,
    itemSize: _itemSize,
    scrollbarAlwaysOn: _scrollbarAlwaysOn,
    ...rest
  } = selectProps;
  return (
    <Select
      {...rest}
      className={cx(ns.b, props.className)}
      popperClass={cx(ns.e('popper'), props.popperClass)}
      ref={select}
      multiple={multiple}
      value={current}
      onValueChange={setCurrent}
      options={[...options.values()]}
      popupRole="tree"
      renderOptions={(scope) => (
        <TreeOptions
          scope={scope}
          tree={tree}
          props={props}
          values={values}
          keyField={keyField}
          disabled={disabled}
          remember={remember}
        />
      )}
    />
  );
}
