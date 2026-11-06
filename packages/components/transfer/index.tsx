'use client';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ConfigContext, FieldValidationContext, cx, useControllable, useNamespace } from '../../hooks';
import { Button } from '../button';
import { Checkbox } from '../choice';
import { Input } from '../input';
import { Glyph, Icon } from '../icon';
import type { BaseProps } from '../../hooks';
import type { ReactNode, Ref } from 'react';

export type TransferKey = string | number;
export type TransferDirection = 'left' | 'right';
export interface TransferDataItem {
  key?: TransferKey;
  label?: string;
  disabled?: boolean;
  [key: string]: unknown;
}
export interface TransferPanelHandle {
  query: string;
}
export interface TransferHandle {
  clearQuery: (which: TransferDirection) => void;
  readonly leftPanel: TransferPanelHandle | null;
  readonly rightPanel: TransferPanelHandle | null;
}
export interface TransferProps<T extends TransferDataItem = TransferDataItem> extends BaseProps {
  value?: TransferKey[];
  defaultValue?: TransferKey[];
  onValueChange?: (value: TransferKey[]) => void;
  data?: T[];
  filterable?: boolean;
  filterPlaceholder?: string;
  filterMethod?: (query: string, item: T) => boolean;
  targetOrder?: 'original' | 'push' | 'unshift';
  titles?: [string?, string?];
  buttonTexts?: [string?, string?];
  renderContent?: (item: T) => ReactNode;
  renderOption?: (scope: { option: T }) => ReactNode;
  format?: { noChecked?: string; hasChecked?: string };
  props?: { key?: string; label?: string; disabled?: string };
  leftDefaultChecked?: TransferKey[];
  rightDefaultChecked?: TransferKey[];
  validateEvent?: boolean;
  virtualScroll?: boolean;
  itemSize?: number;
  onChange?: (value: TransferKey[], direction: TransferDirection, movedKeys: TransferKey[]) => void;
  onLeftCheckChange?: (value: TransferKey[], movedKeys?: TransferKey[]) => void;
  onRightCheckChange?: (value: TransferKey[], movedKeys?: TransferKey[]) => void;
  renderLeftFooter?: ReactNode;
  renderRightFooter?: ReactNode;
  renderLeftEmpty?: ReactNode;
  renderRightEmpty?: ReactNode;
  ref?: Ref<TransferHandle>;
}
interface PanelProps<T extends TransferDataItem> {
  data: T[];
  title: string;
  placeholder: string;
  filterable: boolean;
  filterMethod?: TransferProps<T>['filterMethod'];
  keyOf: (item: T) => TransferKey;
  labelOf: (item: T) => string;
  disabledOf: (item: T) => boolean;
  render: (item: T) => ReactNode;
  defaultChecked: TransferKey[];
  onCheck: (value: TransferKey[], moved?: TransferKey[]) => void;
  format: NonNullable<TransferProps<T>['format']>;
  footer?: ReactNode;
  empty?: ReactNode;
  virtualScroll: boolean;
  itemSize: number;
  ref?: Ref<TransferPanelHandle>;
}
/** 面板内部保留查询、勾选与虚拟窗口，转移模型由父组件提交。 */
function TransferPanel<T extends TransferDataItem>({
  data,
  title,
  placeholder,
  filterable,
  filterMethod,
  keyOf,
  labelOf,
  disabledOf,
  render,
  defaultChecked,
  onCheck,
  format,
  footer,
  empty,
  virtualScroll,
  itemSize,
  ref,
}: PanelProps<T>) {
  const ns = useNamespace('transfer-panel'),
    config = useContext(ConfigContext);
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState<TransferKey[]>(() =>
    defaultChecked.filter((key) => data.some((item) => keyOf(item) === key && !disabledOf(item))),
  );
  const [scrollTop, setScrollTop] = useState(0),
    [viewportHeight, setViewportHeight] = useState(246);
  const list = useRef<HTMLDivElement>(null);
  const checkedRef = useRef(checked);
  checkedRef.current = checked;
  const inputs = useRef({ data, defaultChecked, keyOf, disabledOf, onCheck, query, filterMethod, labelOf });
  inputs.current = { data, defaultChecked, keyOf, disabledOf, onCheck, query, filterMethod, labelOf };
  const defaultsKey = JSON.stringify(defaultChecked),
    dataKey = JSON.stringify(data.map((item) => [keyOf(item), disabledOf(item)]));
  const previousDefaults = useRef(defaultsKey);
  useEffect(() => {
    const latest = inputs.current;
    const defaultsChanged = previousDefaults.current !== defaultsKey;
    previousDefaults.current = defaultsKey;
    const candidates = defaultsChanged ? latest.defaultChecked : checkedRef.current;
    const next = candidates.filter((key) =>
      latest.data.some(
        (item) => latest.keyOf(item) === key && (!defaultsChanged || !latest.disabledOf(item)),
      ),
    );
    if (JSON.stringify(next) === JSON.stringify(checkedRef.current)) return;
    checkedRef.current = next;
    setChecked(next);
    latest.onCheck(next);
  }, [dataKey, defaultsKey]);
  useEffect(() => {
    inputs.current.onCheck(checkedRef.current);
  }, []);
  useEffect(() => {
    if (!virtualScroll || !list.current) return;
    const element = list.current;
    const measure = (): void => {
      if (element.clientHeight) setViewportHeight(element.clientHeight);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [virtualScroll, filterable]);
  useEffect(() => {
    if (virtualScroll) {
      if (list.current) list.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [query, virtualScroll]);
  useImperativeHandle(ref, () => ({
    get query() {
      return query;
    },
    set query(value: string) {
      setQuery(value);
    },
  }));
  const filtered = data.filter((item) =>
    filterMethod ? filterMethod(query, item) : labelOf(item).toLowerCase().includes(query.toLowerCase()),
  );
  const checkable = filtered.filter((item) => !disabledOf(item));
  const all = checkable.length > 0 && checkable.every((item) => checked.includes(keyOf(item)));
  const indeterminate = checked.length > 0 && checked.length < checkable.length;
  const summary =
    format.noChecked && format.hasChecked
      ? (checked.length ? format.hasChecked : format.noChecked)
          .replaceAll('${checked}', String(checked.length))
          .replaceAll('${total}', String(data.length))
      : `${checked.length}/${data.length}`;
  /** 用户勾选事件携带对称差集，程序同步不伪造movedKeys。 */
  function update(next: TransferKey[]): void {
    const old = checkedRef.current,
      moved = [...next, ...old].filter((key) => !next.includes(key) || !old.includes(key));
    checkedRef.current = next;
    setChecked(next);
    onCheck(next, moved);
  }
  const rowSize = Math.max(1, itemSize),
    start = virtualScroll ? Math.max(0, Math.floor(scrollTop / rowSize) - 2) : 0;
  const end = virtualScroll
    ? Math.min(filtered.length, Math.ceil((scrollTop + viewportHeight) / rowSize) + 2)
    : filtered.length;
  const rows = filtered.slice(start, end).map((item, index) => (
    <div
      key={keyOf(item)}
      style={
        virtualScroll
          ? { position: 'absolute', top: (start + index) * rowSize, height: rowSize, width: '100%' }
          : undefined
      }
    >
      <Checkbox
        className={ns.e('item')}
        checked={checked.includes(keyOf(item))}
        disabled={disabledOf(item)}
        onValueChange={(value) =>
          update(value ? [...checked, keyOf(item)] : checked.filter((key) => key !== keyOf(item)))
        }
      >
        {render(item)}
      </Checkbox>
    </div>
  ));
  const noMatch = Boolean(query && !filtered.length);
  return (
    <div className={ns.b}>
      <p className={ns.e('header')}>
        <Checkbox
          checked={all}
          indeterminate={indeterminate}
          onValueChange={(value) => update(value ? checkable.map(keyOf) : [])}
        >
          <span className={ns.e('header-title')}>{title}</span>
          <span className={ns.e('header-count')}>{summary}</span>
        </Checkbox>
      </p>
      <div className={cx(ns.e('body'), ns.is('with-footer', footer !== undefined))}>
        {filterable && (
          <Input
            className={ns.e('filter')}
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
            aria-label={`${title} filter`}
            clearable
            validateEvent={false}
            prefixIcon={<Glyph name="search" />}
          />
        )}
        <div
          ref={list}
          role="group"
          aria-label={title}
          className={cx(`${ns.namespace}-checkbox-group`, ns.e('list'), ns.is('filterable', filterable))}
          style={{ display: noMatch || !data.length ? 'none' : undefined }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {virtualScroll ? (
            <div style={{ height: filtered.length * rowSize, position: 'relative' }}>{rows}</div>
          ) : (
            rows
          )}
        </div>
        {(noMatch || !data.length) && (
          <div className={ns.e('empty')}>
            {empty ??
              (noMatch
                ? config.locale === 'zh-cn'
                  ? '无匹配数据'
                  : 'No matching data'
                : config.locale === 'zh-cn'
                  ? '无数据'
                  : 'No data')}
          </div>
        )}
      </div>
      {footer !== undefined && <p className={ns.e('footer')}>{footer}</p>}
    </div>
  );
}

/** 两侧勾选不直接改变模型；移动请求保留来源的original/push/unshift顺序。 */
export function Transfer<T extends TransferDataItem = TransferDataItem>({
  value,
  defaultValue = [],
  onValueChange,
  data = [],
  filterable = false,
  filterPlaceholder,
  filterMethod,
  targetOrder = 'original',
  titles = [],
  buttonTexts = [],
  renderContent,
  renderOption,
  format = {},
  props: aliases,
  leftDefaultChecked = [],
  rightDefaultChecked = [],
  validateEvent = true,
  virtualScroll = false,
  itemSize = 30,
  onChange,
  onLeftCheckChange,
  onRightCheckChange,
  renderLeftFooter,
  renderRightFooter,
  renderLeftEmpty,
  renderRightEmpty,
  ref,
  className,
  style,
  ...rest
}: TransferProps<T>) {
  const ns = useNamespace('transfer'),
    config = useContext(ConfigContext),
    field = useContext(FieldValidationContext);
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [leftChecked, setLeftChecked] = useState<TransferKey[]>([]),
    [rightChecked, setRightChecked] = useState<TransferKey[]>([]);
  const left = useRef<TransferPanelHandle>(null),
    right = useRef<TransferPanelHandle>(null);
  /** 字段别名贯穿过滤、移动和回显，不要求数据同时提供默认字段。 */
  function keyOf(item: T): TransferKey {
    return item[aliases?.key ?? 'key'] as TransferKey;
  }
  /** 依照来源规则，空标签使用主键显示。 */
  function labelOf(item: T): string {
    return String(item[aliases?.label ?? 'label'] || keyOf(item));
  }
  /** 字段映射后的disabled控制勾选资格。 */
  function disabledOf(item: T): boolean {
    return Boolean(item[aliases?.disabled ?? 'disabled']);
  }
  const source = data.filter((item) => !current.includes(keyOf(item)));
  const target =
    targetOrder === 'original'
      ? data.filter((item) => current.includes(keyOf(item)))
      : current.flatMap((key) => {
          const item = data.find((item) => keyOf(item) === key);
          return item ? [item] : [];
        });
  useImperativeHandle(ref, () => ({
    clearQuery: (which) => {
      const panel = which === 'left' ? left.current : right.current;
      if (panel) panel.query = '';
    },
    get leftPanel() {
      return left.current;
    },
    get rightPanel() {
      return right.current;
    },
  }));
  /** 业务模型只在移动操作更新，一次操作发出一次change与校验请求。 */
  function move(direction: TransferDirection): void {
    const checked = direction === 'left' ? rightChecked : leftChecked;
    if (!checked.length) return;
    let next: TransferKey[];
    if (direction === 'left') next = current.filter((key) => !checked.includes(key));
    else {
      const moved = data
        .filter((item) => checked.includes(keyOf(item)) && !current.includes(keyOf(item)))
        .map(keyOf);
      next = targetOrder === 'unshift' ? [...moved, ...current] : [...current, ...moved];
      if (targetOrder === 'original') next = data.filter((item) => next.includes(keyOf(item))).map(keyOf);
    }
    setCurrent(next);
    onChange?.(next, direction, [...checked]);
    if (validateEvent) field?.change(next);
  }
  const common = {
    filterable,
    filterMethod,
    keyOf,
    labelOf,
    disabledOf,
    render: (item: T) =>
      renderContent ? (
        renderContent(item)
      ) : renderOption ? (
        renderOption({ option: item })
      ) : (
        <span>{labelOf(item)}</span>
      ),
    placeholder: filterPlaceholder ?? (config.locale === 'zh-cn' ? '请输入搜索内容' : 'Enter keyword'),
    format,
    virtualScroll,
    itemSize,
  };
  return (
    <div {...rest} className={cx(ns.b, className)} style={style}>
      <TransferPanel
        {...common}
        ref={left}
        data={source}
        title={titles[0] || (config.locale === 'zh-cn' ? '列表 1' : 'List 1')}
        defaultChecked={leftDefaultChecked}
        footer={renderLeftFooter}
        empty={renderLeftEmpty}
        onCheck={(checked, moved) => {
          setLeftChecked(checked);
          onLeftCheckChange?.(checked, moved);
        }}
      />
      <div className={ns.e('buttons')}>
        <Button
          type="primary"
          className={cx(ns.e('button'), ns.is('with-texts', buttonTexts.length === 2))}
          disabled={!rightChecked.length}
          onClick={() => move('left')}
          aria-label={buttonTexts[0] ?? 'Move to left'}
        >
          <Icon style={{ transform: 'rotate(180deg)' }}>
            <Glyph name="arrow" />
          </Icon>
          {buttonTexts[0] !== undefined && <span>{buttonTexts[0]}</span>}
        </Button>
        <Button
          type="primary"
          className={cx(ns.e('button'), ns.is('with-texts', buttonTexts.length === 2))}
          disabled={!leftChecked.length}
          onClick={() => move('right')}
          aria-label={buttonTexts[1] ?? 'Move to right'}
        >
          {buttonTexts[1] !== undefined && <span>{buttonTexts[1]}</span>}
          <Icon>
            <Glyph name="arrow" />
          </Icon>
        </Button>
      </div>
      <TransferPanel
        {...common}
        ref={right}
        data={target}
        title={titles[1] || (config.locale === 'zh-cn' ? '列表 2' : 'List 2')}
        defaultChecked={rightDefaultChecked}
        footer={renderRightFooter}
        empty={renderRightEmpty}
        onCheck={(checked, moved) => {
          setRightChecked(checked);
          onRightCheckChange?.(checked, moved);
        }}
      />
    </div>
  );
}
