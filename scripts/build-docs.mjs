import { existsSync, readFileSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fingerprint } from './evidence.mjs';

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
if (!existsSync('reports/unit.json') || !existsSync('reports/test-input.json'))
  throw new Error('先运行 npm test；没有测试证据的能力不会进入文档。');
const report = read('reports/unit.json');
const input = read('reports/test-input.json');
if (!report.success || report.numFailedTests || report.numFailedTestSuites)
  throw new Error('测试未全部通过，停止生成使用文档。');
if (input.fingerprint !== fingerprint())
  throw new Error('源码、示例或测试已变化；旧报告失效，请重新运行 npm test。');
const matrix = read('design/api-matrix.json');
const source = read('design/source-manifest.json');
const examples = read('docs/examples/manifest.json');
const assertions = report.testResults.flatMap((suite) =>
  suite.assertionResults.map((test) => ({
    ...test,
    file: suite.name.replaceAll('\\', '/').replace(process.cwd().replaceAll('\\', '/') + '/', ''),
  })),
);
const passed = assertions.filter((test) => test.status === 'passed');
const evidence = new Map();
const features = new Map();
const exampleTests = new Map();
for (const test of passed) {
  const example = test.fullName.match(/\[example:([^\]]+)\]/)?.[1];
  if (example && !examples.some((item) => item.id === example)) throw new Error(`缺少示例：${example}`);
  if (example) exampleTests.set(example, [...(exampleTests.get(example) ?? []), test.fullName]);
  for (const match of test.fullName.matchAll(/\[api:([^\]]+)\]/g)) {
    const row = matrix.find((item) => item.id === match[1]);
    if (!row) throw new Error(`测试引用不存在的API：${match[1]}`);
    if (!example) throw new Error(`API ${row.id}缺少示例证据`);
    if (!examples.some((item) => item.id === example && item.component === row.component))
      throw new Error(`API与示例组件不对应：${row.id}`);
    evidence.set(row.id, [
      ...(evidence.get(row.id) ?? []),
      { file: test.file, title: test.fullName, example },
    ]);
  }
  for (const match of test.fullName.matchAll(/\[feature:([^\]]+)\]/g))
    features.set(match[1], {
      title: test.fullName.split(' [')[0],
      tests: [{ file: test.file, title: test.fullName }],
      example,
    });
}

const locations = {
  'select-v2': 'packages/components/select-v2/index.tsx',
  'tree-select': 'packages/components/tree-select/index.tsx',
  'tree-v2': 'packages/components/tree/index.tsx',
  tree: 'packages/components/tree/index.tsx',
  upload: 'packages/components/upload/index.tsx',
  dropdown: 'packages/components/dropdown/index.tsx',
  menu: 'packages/components/menu/index.tsx',
  splitter: 'packages/components/splitter/index.tsx',
  autocomplete: 'packages/components/autocomplete/index.tsx',
  slider: 'packages/components/slider/index.tsx',
  'time-select': 'packages/components/time-select/index.tsx',
  'input-tag': 'packages/components/input-tag/index.tsx',
  carousel: 'packages/components/carousel/index.tsx',
  transfer: 'packages/components/transfer/index.tsx',
  watermark: 'packages/components/watermark/index.tsx',
  'infinite-scroll': 'packages/components/infinite-scroll/index.tsx',
  anchor: 'packages/components/anchor/index.tsx',
  'input-otp': 'packages/components/input-otp/index.tsx',
  select: 'packages/components/select/index.tsx',
  'message-box': 'packages/components/services/message-box.tsx',
  message: 'packages/components/services/message.tsx',
  notification: 'packages/components/services/message.tsx',
  loading: 'packages/components/services/loading.tsx',
  descriptions: 'packages/components/descriptions/index.tsx',
  calendar: 'packages/components/calendar/index.tsx',
  scrollbar: 'packages/components/scrollbar/index.tsx',
  backtop: 'packages/components/scroll-tools/index.tsx',
  affix: 'packages/components/scroll-tools/index.tsx',
  image: 'packages/components/image/index.tsx',
  tooltip: 'packages/components/tooltip/index.tsx',
  popover: 'packages/components/tooltip/index.tsx',
  popconfirm: 'packages/components/tooltip/index.tsx',
  'page-header': 'packages/components/page-header/index.tsx',
  steps: 'packages/components/steps/index.tsx',
  rate: 'packages/components/rate/index.tsx',
  pagination: 'packages/components/pagination/index.tsx',
  form: 'packages/components/form/index.tsx',
  dialog: 'packages/components/modal/index.tsx',
  drawer: 'packages/components/modal/index.tsx',
  'config-provider': 'packages/components/config-provider/index.tsx',
  icon: 'packages/components/icon/index.tsx',
  button: 'packages/components/button/index.tsx',
  text: 'packages/components/presentation/index.tsx',
  link: 'packages/components/presentation/index.tsx',
  card: 'packages/components/presentation/index.tsx',
  tag: 'packages/components/presentation/index.tsx',
  divider: 'packages/components/presentation/index.tsx',
  badge: 'packages/components/presentation/index.tsx',
  alert: 'packages/components/presentation/index.tsx',
  empty: 'packages/components/presentation/index.tsx',
  result: 'packages/components/presentation/index.tsx',
  avatar: 'packages/components/presentation/index.tsx',
  layout: 'packages/components/layout/index.tsx',
  container: 'packages/components/layout/index.tsx',
  space: 'packages/components/layout/index.tsx',
  skeleton: 'packages/components/display/index.tsx',
  statistic: 'packages/components/display/index.tsx',
  progress: 'packages/components/display/index.tsx',
  input: 'packages/components/input/index.tsx',
  'input-number': 'packages/components/input-number/index.tsx',
  checkbox: 'packages/components/choice/index.tsx',
  radio: 'packages/components/choice/index.tsx',
  switch: 'packages/components/choice/index.tsx',
  segmented: 'packages/components/choice/index.tsx',
  collapse: 'packages/components/navigation/index.tsx',
  breadcrumb: 'packages/components/navigation/index.tsx',
  timeline: 'packages/components/navigation/index.tsx',
  tabs: 'packages/components/navigation/index.tsx',
};
const titles = {
  'select-v2': 'SelectV2 虚拟化选择器',
  'tree-select': 'TreeSelect 树形选择',
  'tree-v2': 'TreeV2 虚拟化树形控件',
  tree: 'Tree 树形控件',
  upload: 'Upload 上传',
  dropdown: 'Dropdown 下拉菜单',
  menu: 'Menu 菜单',
  splitter: 'Splitter 分隔面板',
  autocomplete: 'Autocomplete 自动补全',
  slider: 'Slider 滑块',
  'time-select': 'TimeSelect 时间选择',
  'input-tag': 'InputTag 标签输入框',
  carousel: 'Carousel 走马灯',
  transfer: 'Transfer 穿梭框',
  watermark: 'Watermark 水印',
  'infinite-scroll': 'InfiniteScroll 无限滚动',
  anchor: 'Anchor 锚点',
  'input-otp': 'InputOtp 验证码输入',
  select: 'Select 选择器',
  'message-box': 'MessageBox 消息弹框',
  message: 'Message 消息提示',
  notification: 'Notification 通知',
  loading: 'Loading 加载',
  descriptions: 'Descriptions 描述列表',
  calendar: 'Calendar 日历',
  scrollbar: 'Scrollbar 滚动条',
  backtop: 'Backtop 回到顶部',
  affix: 'Affix 固钉',
  image: 'Image 图片',
  tooltip: 'Tooltip 文字提示',
  popover: 'Popover 弹出框',
  popconfirm: 'Popconfirm 气泡确认',
  'page-header': 'PageHeader 页头',
  steps: 'Steps 步骤条',
  rate: 'Rate 评分',
  pagination: 'Pagination 分页',
  form: 'Form 表单',
  dialog: 'Dialog 对话框',
  drawer: 'Drawer 抽屉',
  button: 'Button 按钮',
  icon: 'Icon 图标',
  text: 'Text 文字',
  link: 'Link 链接',
  card: 'Card 卡片',
  tag: 'Tag 标签',
  divider: 'Divider 分割线',
  badge: 'Badge 徽标',
  alert: 'Alert 提示',
  empty: 'Empty 空状态',
  result: 'Result 结果',
  avatar: 'Avatar 头像',
  layout: 'Layout 布局',
  container: 'Container 容器',
  space: 'Space 间距',
  skeleton: 'Skeleton 骨架屏',
  statistic: 'Statistic 统计',
  progress: 'Progress 进度',
  input: 'Input 输入框',
  'input-number': 'InputNumber 数字输入',
  checkbox: 'Checkbox 复选框',
  radio: 'Radio 单选框',
  switch: 'Switch 开关',
  segmented: 'Segmented 分段选择',
  collapse: 'Collapse 折叠面板',
  breadcrumb: 'Breadcrumb 面包屑',
  timeline: 'Timeline 时间轴',
  tabs: 'Tabs 标签页',
  'config-provider': 'ConfigProvider 全局配置',
};
const categories = {
  'select-v2': '表单',
  'tree-select': '表单',
  'tree-v2': '数据展示',
  tree: '数据展示',
  upload: '表单',
  dropdown: '导航',
  menu: '导航',
  splitter: '布局',
  autocomplete: '表单',
  slider: '表单',
  'time-select': '表单',
  'input-tag': '表单',
  transfer: '表单',
  anchor: '导航',
  'input-otp': '表单',
  select: '表单',
  form: '表单',
  rate: '表单',
  'page-header': '导航',
  steps: '导航',
  pagination: '导航',
  backtop: '导航',
  affix: '导航',
  message: '反馈',
  notification: '反馈',
  loading: '反馈',
  'message-box': '反馈',
  dialog: '反馈',
  drawer: '反馈',
  tooltip: '反馈',
  popover: '反馈',
  popconfirm: '反馈',
  icon: '基础',
  button: '基础',
  text: '基础',
  link: '基础',
  layout: '布局',
  container: '布局',
  space: '布局',
  divider: '布局',
  input: '表单',
  'input-number': '表单',
  checkbox: '表单',
  radio: '表单',
  switch: '表单',
  segmented: '表单',
  breadcrumb: '导航',
  tabs: '导航',
  'config-provider': '配置',
};
const aliases = {
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  autofocus: 'autoFocus',
  tabindex: 'tabIndex',
  inputmode: 'inputMode',
  autocomplete: 'autoComplete',
  referrerpolicy: 'referrerPolicy',
  crossorigin: 'crossOrigin',
};
/** 默认值与类型来源仍保留原表，React特殊转换显式列出。 */
function reactName(row) {
  if (row.component === 'select-v2' && row.sourceName === '[props](#props)') return 'props';
  if (row.component === 'select-v2' && row.sourceName === '[tag-tooltip](#tag-tooltip)') return 'tagTooltip';
  if (row.component === 'select-v2' && row.section === 'Slots' && row.sourceName === 'default')
    return 'renderOption';

  if (
    ['tree', 'tree-v2'].includes(row.component) &&
    /Slots$/.test(row.section) &&
    row.sourceName === 'default'
  )
    return 'renderContent';

  if (['tree', 'tree-v2'].includes(row.component) && row.sourceName === '[props](#props)') return 'props';

  if (row.component === 'upload' && row.sourceName.startsWith('file-list'))
    return 'fileList / onFileListChange';

  if (row.component === 'splitter' && row.sourceName === 'update:size') return 'onSizeChange';
  if (row.component === 'autocomplete' && row.section === 'Slots' && row.sourceName === 'default')
    return 'renderSuggestion';

  if (row.component === 'transfer' && row.sourceName === '[props](#type-declarations)') return 'props';
  if (row.component === 'select' && row.sourceName === '[props](#props)') return 'props';
  if (row.component === 'infinite-scroll')
    return (
      {
        'v-infinite-scroll': 'onLoad / useInfiniteScroll',
        'infinite-scroll-disabled': 'disabled',
        'infinite-scroll-delay': 'delay',
        'infinite-scroll-distance': 'distance',
        'infinite-scroll-immediate': 'immediate',
      }[row.sourceName] ?? row.reactName
    );
  if (row.component === 'input' && row.sourceName === 'aria-label') return 'aria-label';
  if (row.component === 'checkbox' && row.section === 'Checkbox Attributes' && row.sourceName === 'checked')
    return 'checked / defaultChecked / onValueChange';
  return aliases[row.sourceName] ?? row.reactName;
}
/** 仅将已验证内容写入公共站点；未完成项只出现在项目任务总账。 */
function publicRow(row) {
  return {
    id: row.id,
    section: row.section,
    kind: row.kind,
    sourceName: row.sourceName,
    reactName: reactName(row),
    description: row.sourceColumns.Description ?? '详见来源契约',
    type: (row.sourceColumns.Type ?? '')
      .replace(/\^\[([^\]]+)\]/g, '$1')
      .replaceAll('`', '')
      .replaceAll('\\|', '|'),
    defaultValue: row.sourceColumns.Default ?? '—',
    sourcePath: `docs/en-US/component/${row.component}.md`,
    sourceLine: row.sourceLine,
    tests: evidence.get(row.id),
    implementation: locations[row.component],
  };
}
const tasks = matrix.map((row) => ({
  id: `api:${row.id}`,
  component: row.component,
  category: 'api',
  section: row.section,
  title: row.sourceName,
  status: evidence.has(row.id) ? 'completed' : 'pending',
  source: { path: `docs/en-US/component/${row.component}.md`, line: row.sourceLine },
  implementation: evidence.has(row.id) ? locations[row.component] : null,
  evidence: evidence.get(row.id) ?? [],
}));
for (const document of source.documents) {
  for (const heading of document.headings.filter(
    (h) => !/API|Attributes|Props|Events|Slots|Exposes|Methods|Type Declarations/i.test(h.title),
  ))
    tasks.push({
      id: `scenario:${document.name}:${heading.line}`,
      component: document.name,
      category: 'source-scenario',
      title: heading.title,
      status: 'pending',
      source: { path: document.source, line: heading.line },
      evidence: [],
    });
  for (const example of document.examples)
    tasks.push({
      id: `source-example:${document.name}:${example}`,
      component: document.name,
      category: 'source-example',
      title: example,
      status: examples.some((item) => item.sourceExample === example && exampleTests.has(item.id))
        ? 'completed'
        : 'pending',
      source: { path: `docs/examples/${example}.vue` },
      evidence: examples
        .filter((item) => item.sourceExample === example && exampleTests.has(item.id))
        .flatMap((item) => exampleTests.get(item.id) ?? []),
    });
}
for (const directory of source.directories)
  tasks.push({
    id: `directory:${directory.name}`,
    component: directory.family ?? directory.name,
    category: 'source-directory',
    title: directory.name,
    status: 'pending',
    source: { path: directory.source },
    evidence: [],
  });
for (const [id, feature] of features)
  tasks.push({
    id: `feature:${id}`,
    component: id.split('/')[0],
    category: 'react-feature',
    title: feature.title,
    status: 'completed',
    evidence: feature.tests,
    example: feature.example,
  });
const components = Object.keys(locations).flatMap((id) => {
  const rows = matrix.filter((row) => row.component === id && evidence.has(row.id));
  const demos = examples.filter((item) => item.component === id && exampleTests.has(item.id));
  if (!rows.length || !demos.length) return [];
  if (!existsSync(locations[id])) throw new Error(`缺少实现：${id}`);
  return [
    {
      id,
      title: titles[id] ?? id,
      category: categories[id] ?? '数据展示',
      description: demos[0].description,
      implementation: locations[id],
      api: rows.map(publicRow),
      examples: demos.map((item) => ({ ...item, code: readFileSync(item.source, 'utf8') })),
      features: [...features.entries()]
        .filter(([key]) => key.startsWith(id + '/'))
        .map(([key, feature]) => ({ id: key, ...feature })),
      apiCompleted: rows.length,
      apiTotal: matrix.filter((row) => row.component === id).length,
      fullParity: false,
    },
  ];
});
const status = {
  baseline: source.baseline,
  fingerprint: input.fingerprint,
  testedAt: input.startedAt,
  unitTests: report.numPassedTests,
  completedApi: evidence.size,
  totalApi: matrix.length,
  documentedComponents: components.length,
  fullyVerifiedComponents: 0,
  completedFeatures: features.size,
  completedExamples: exampleTests.size,
  fullParity: false,
  visualParity: false,
};
mkdirSync('progress', { recursive: true });
mkdirSync('docs/src/generated', { recursive: true });
mkdirSync('docs/content/components', { recursive: true });
// 此目录只存生成文档：撤销的能力不能残留为旧页面。
const publishedFiles = new Set(components.map((component) => `${component.id}.md`));
for (const file of readdirSync('docs/content/components')) {
  if (file.endsWith('.md') && !publishedFiles.has(file)) unlinkSync(`docs/content/components/${file}`);
}
writeFileSync('progress/tasks.json', JSON.stringify({ status, tasks }, null, 2) + '\n');
writeFileSync('docs/src/generated/catalog.json', JSON.stringify({ status, components }, null, 2) + '\n');
const taskLines = [
  '# Element React 完整任务清单',
  '',
  '> 自动生成。只有与当前源码指纹一致、测试通过并有可运行示例的细项标记完成。未实现的原功能保留待办，公共使用文档不展示它们。',
  '',
  `来源：${source.baseline}`,
  `已验证 API：${status.completedApi}/${status.totalApi}；React示例：${status.completedExamples}；单元测试：${status.unitTests}；整体等价验收：未完成。`,
  '',
];
for (const document of source.documents) {
  const items = tasks.filter((task) => task.component === document.name);
  taskLines.push(`## ${titles[document.name] ?? document.name}`, '');
  for (const task of items)
    taskLines.push(
      `- [${task.status === 'completed' ? 'x' : ' '}] \`${task.id}\` ${task.section ? task.section + ' / ' : ''}${task.title}${
        task.status === 'completed'
          ? ` — 证据：${task.evidence
              .map((e) => e.file)
              .filter((v, i, a) => a.indexOf(v) === i)
              .join('、')}`
          : ''
      }`,
    );
  taskLines.push('');
}
const orphan = tasks.filter((task) => !source.documents.some((doc) => doc.name === task.component));
taskLines.push('## 内部基础设施', '', ...orphan.map((task) => `- [ ] \`${task.id}\` ${task.title}`), '');
writeFileSync('TASKS.md', taskLines.join('\n'));
for (const component of components) {
  const lines = [
    `# ${component.title}`,
    '',
    component.description,
    '',
    '> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。',
    '',
    '## 示例',
    '',
    ...component.examples.flatMap((example) => [
      `### ${example.title}`,
      '',
      example.description,
      '',
      '```tsx',
      example.code.trim(),
      '```',
      '',
    ]),
    '## 已验证 API',
    '',
    '| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |',
    '|---|---|---|---|---|---|',
    ...component.api.map(
      (row) =>
        `| ${row.section} | ${row.sourceName} | ${row.reactName} | ${row.description.replaceAll('|', '\\|')} | ${row.type.replaceAll('|', '\\|')} | ${row.defaultValue.replaceAll('|', '\\|')} |`,
    ),
    '',
    '## 完成记录',
    '',
    ...component.api.map(
      (row) =>
        `- [x] ${row.id} ${row.reactName}；实现：${row.implementation}；测试：${[...new Set(row.tests.map((test) => test.file))].join('、')}`,
    ),
    '',
  ];
  writeFileSync(`docs/content/components/${component.id}.md`, lines.join('\n'));
}
writeFileSync(
  'progress/verification.json',
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      ...status,
      publicCatalogHash: createHash('sha256')
        .update(readFileSync('docs/src/generated/catalog.json'))
        .digest('hex'),
      noPendingApiPublished: components.every((c) => c.api.every((row) => evidence.has(row.id))),
      sourceDirectoryCount: source.directories.length,
    },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify(status, null, 2));
