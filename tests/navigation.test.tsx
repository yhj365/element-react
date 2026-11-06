import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { Collapse, CollapseItem, TabPane, Tabs } from '../packages/element-react';
import { apiTest, featureTest } from './contract';

apiTest(
  'collapse',
  'Collapse Attributes',
  ['model-value', 'accordion'],
  'collapse-basic',
  '多项与手风琴',
  () => {
    const change = vi.fn();
    const { rerender } = render(
      <Collapse defaultValue={['a']} onValueChange={change}>
        <CollapseItem name="a" title="甲">
          内容甲
        </CollapseItem>
        <CollapseItem name="b" title="乙">
          内容乙
        </CollapseItem>
      </Collapse>,
    );
    fireEvent.click(screen.getByRole('button', { name: '乙' }));
    expect(change).toHaveBeenCalledWith(['a', 'b']);
    expect(screen.getByText('内容甲').parentElement).not.toHaveAttribute('hidden');
    rerender(
      <Collapse accordion value="a" onValueChange={change}>
        <CollapseItem name="a" title="甲">
          内容
        </CollapseItem>
      </Collapse>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(change).toHaveBeenLastCalledWith('');
  },
);
apiTest('collapse', 'Collapse Events', ['change'], 'collapse-basic', '折叠通知', () => {
  const change = vi.fn();
  render(
    <Collapse onChange={change}>
      <CollapseItem name="a" title="甲">
        内容
      </CollapseItem>
    </Collapse>,
  );
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  expect(change).toHaveBeenCalledWith(['a']);
});
apiTest('collapse', 'Collapse Slots', ['default'], 'collapse-basic', '容器内容', () => {
  render(
    <Collapse>
      <CollapseItem title="条目">内容</CollapseItem>
    </Collapse>,
  );
  expect(document.querySelector('.el-collapse')).toContainElement(screen.getByText('条目'));
});
apiTest(
  'collapse',
  'Collapse Item Attributes',
  ['name', 'title', 'icon', 'disabled'],
  'collapse-custom',
  '禁用项与自定义图标',
  () => {
    render(
      <Collapse>
        <CollapseItem name="a" title="禁用" disabled icon={<span>标记</span>}>
          内容
        </CollapseItem>
      </Collapse>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('标记')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1');
  },
);
apiTest(
  'collapse',
  'Collapse Item Slot',
  ['default', 'title', 'icon'],
  'collapse-custom',
  '标题图标作用域',
  () => {
    render(
      <Collapse>
        <CollapseItem
          name="a"
          renderTitle={(active) => (active ? '已打开' : '已关闭')}
          renderIcon={(active) => (active ? '减' : '加')}
        >
          正文
        </CollapseItem>
      </Collapse>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('已打开')).toBeInTheDocument();
    expect(screen.getByText('减')).toBeInTheDocument();
    expect(screen.getByText('正文')).toBeVisible();
  },
);
apiTest('collapse', 'Collapse Item Exposes', ['isActive'], 'collapse-custom', '活动状态实例', () => {
  const ref = createRef<{ isActive: boolean }>();
  render(
    <Collapse>
      <CollapseItem ref={ref} title="项" />
    </Collapse>,
  );
  expect(ref.current?.isActive).toBe(false);
  fireEvent.click(screen.getByRole('button'));
  expect(ref.current?.isActive).toBe(true);
});

apiTest(
  'tabs',
  'Tabs Attributes',
  ['model-value', 'default-value', 'type', 'tab-position', 'stretch'],
  'tabs-basic',
  '默认激活和样式',
  async () => {
    const change = vi.fn();
    render(
      <Tabs defaultValue="b" type="card" tabPosition="left" stretch onValueChange={change}>
        <TabPane name="a" label="甲">
          内容甲
        </TabPane>
        <TabPane name="b" label="乙">
          内容乙
        </TabPane>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: '乙' })).toHaveAttribute('aria-selected', 'true');
    expect(document.querySelector('.el-tabs')).toHaveClass('el-tabs--card', 'el-tabs--left');
    expect(document.querySelector('.el-tabs__nav')).toHaveClass('is-stretch');
    await act(async () => fireEvent.click(screen.getByRole('tab', { name: '甲' })));
    expect(change).toHaveBeenCalledWith('a');
    expect(screen.getByText('内容甲')).toBeVisible();
  },
);
apiTest('tabs', 'Tabs Attributes', ['before-leave'], 'tabs-async', '异步切换拒绝和过期结果', async () => {
  let allowFirst!: (value: boolean) => void;
  const change = vi.fn();
  render(
    <Tabs
      defaultValue="a"
      onValueChange={change}
      beforeLeave={(name) =>
        name === 'b'
          ? new Promise<boolean>((resolve) => {
              allowFirst = resolve;
            })
          : true
      }
    >
      <TabPane name="a" label="甲">
        A
      </TabPane>
      <TabPane name="b" label="乙">
        B
      </TabPane>
      <TabPane name="c" label="丙">
        C
      </TabPane>
    </Tabs>,
  );
  fireEvent.click(screen.getByRole('tab', { name: '乙' }));
  await act(async () => fireEvent.click(screen.getByRole('tab', { name: '丙' })));
  await act(async () => allowFirst(true));
  expect(change).toHaveBeenCalledTimes(1);
  expect(change).toHaveBeenCalledWith('c');
});
apiTest(
  'tabs',
  'Tabs Attributes',
  ['closable', 'addable', 'editable'],
  'tabs-editable',
  '增删操作入口',
  () => {
    render(
      <Tabs editable addable closable>
        <TabPane name="a" label="甲">
          A
        </TabPane>
      </Tabs>,
    );
    expect(screen.getByRole('button', { name: 'Add tab' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close 甲' })).toBeInTheDocument();
  },
);
apiTest(
  'tabs',
  'Tabs Events',
  ['tab-click', 'tab-change', 'tab-remove', 'tab-add', 'edit'],
  'tabs-editable',
  '标签页事件区分',
  async () => {
    const click = vi.fn(),
      change = vi.fn(),
      remove = vi.fn(),
      add = vi.fn(),
      edit = vi.fn();
    render(
      <Tabs
        defaultValue="a"
        editable
        closable
        onTabClick={click}
        onTabChange={change}
        onTabRemove={remove}
        onTabAdd={add}
        onEdit={edit}
      >
        <TabPane name="a" label="甲">
          A
        </TabPane>
        <TabPane name="b" label="乙">
          B
        </TabPane>
      </Tabs>,
    );
    await act(async () => fireEvent.click(screen.getByRole('tab', { name: /乙/ })));
    expect(click.mock.calls[0][0]).toBe('b');
    expect(change).toHaveBeenCalledWith('b');
    fireEvent.click(screen.getByRole('button', { name: 'Close 乙' }));
    expect(remove).toHaveBeenCalledWith('b');
    expect(edit).toHaveBeenCalledWith('b', 'remove');
    fireEvent.click(screen.getByRole('button', { name: 'Add tab' }));
    expect(add).toHaveBeenCalledTimes(1);
    expect(edit).toHaveBeenCalledWith(undefined, 'add');
  },
);
apiTest('tabs', 'Tabs Slots', ['default'], 'tabs-basic', '标签页容器内容', () => {
  render(
    <Tabs>
      <TabPane label="甲">内容</TabPane>
    </Tabs>,
  );
  expect(screen.getByRole('tabpanel')).toHaveTextContent('内容');
});
apiTest(
  'tabs',
  'Tab-pane Attributes',
  ['label', 'disabled', 'name', 'closable', 'lazy'],
  'tabs-lazy',
  '面板懒加载和禁用',
  async () => {
    render(
      <Tabs defaultValue="a">
        <TabPane name="a" label="甲">
          内容甲
        </TabPane>
        <TabPane name="b" label="乙" lazy closable>
          内容乙
        </TabPane>
        <TabPane name="c" label="丙" disabled>
          内容丙
        </TabPane>
      </Tabs>,
    );
    expect(screen.queryByText('内容乙')).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: '丙' }));
    expect(screen.getByRole('tab', { name: '甲' })).toHaveAttribute('aria-selected', 'true');
    await act(async () => fireEvent.click(screen.getByRole('tab', { name: /乙/ })));
    expect(screen.getByText('内容乙')).toBeVisible();
    await act(async () => fireEvent.click(screen.getByRole('tab', { name: '甲' })));
    expect(screen.getByText('内容乙')).toBeInTheDocument();
    expect(screen.getByText('内容乙')).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Close 乙' })).toBeInTheDocument();
  },
);
apiTest('tabs', 'Tab-pane Slots', ['default', 'label'], 'tabs-basic', '自定义页签区域', () => {
  render(
    <Tabs>
      <TabPane renderLabel={<b>自定义标签</b>}>内容</TabPane>
    </Tabs>,
  );
  expect(screen.getByText('自定义标签').tagName).toBe('B');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('内容');
});
featureTest('tabs', 'keyboard-navigation', 'tabs-basic', '方向键跳过禁用页签', async () => {
  render(
    <Tabs defaultValue="a">
      <TabPane name="a" label="甲">
        A
      </TabPane>
      <TabPane name="b" label="乙" disabled>
        B
      </TabPane>
      <TabPane name="c" label="丙">
        C
      </TabPane>
    </Tabs>,
  );
  await act(async () => fireEvent.keyDown(screen.getByRole('tab', { name: '甲' }), { key: 'ArrowRight' }));
  expect(screen.getByRole('tab', { name: '丙' })).toHaveFocus();
  expect(screen.getByRole('tab', { name: '丙' })).toHaveAttribute('aria-selected', 'true');
});

featureTest('tabs', 'leave-after-unmount', 'tabs-async', '切换拦截在卸载后完成不再提交模型', async () => {
  const change = vi.fn();
  let resolve!: (value: boolean) => void;
  const view = render(
    <Tabs
      defaultValue="a"
      onValueChange={change}
      beforeLeave={() =>
        new Promise<boolean>((done) => {
          resolve = done;
        })
      }
    >
      <TabPane name="a" label="甲">
        甲内容
      </TabPane>
      <TabPane name="b" label="乙">
        乙内容
      </TabPane>
    </Tabs>,
  );
  fireEvent.click(screen.getByRole('tab', { name: '乙' }));
  view.unmount();
  await act(async () => resolve(true));
  expect(change).not.toHaveBeenCalled();
});
