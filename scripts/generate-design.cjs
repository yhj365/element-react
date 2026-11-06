const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const source = 'D:/code-html/element-plus';
const target = path.resolve(__dirname, '..');
const write = (name, value) => { const file = path.join(target, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value, 'utf8'); };
const read = name => fs.readFileSync(path.join(source, name), 'utf8');
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).filter(e => !['node_modules','dist','.git'].includes(e.name)).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const pascal = s => s.replace(/(^|[-_:])(\w)/g, (_, a, b) => b.toUpperCase());
const camel = s => s.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());
const cleanName = s => s.replace(/\^\([^)]*\)/g,'').replace(/`/g,'').replace(/\s*\(deprecated\)/gi,'').trim();
const featuresText = `
affix|相对窗口或指定容器吸顶/吸底；offset 与 zIndex；固定状态变化和滚动事件；容器边界约束及卸载清理。
alert|success/info/warning/error；标题、描述和图标；浅色/深色效果；居中与关闭按钮、自定义关闭文本、关闭事件。
anchor|容器内锚点导航；水平/垂直布局；偏移和滚动时长；激活线、链接层级、滚动定位、点击及变化事件。
autocomplete|同步/异步建议；输入防抖、触发策略；键盘高亮和选择；自定义建议渲染、清空、远程结果过期保护。
avatar|图像、图标、文字；形状和尺寸、object-fit；加载失败与回退；AvatarGroup 的数量限制、溢出展示和组内布局。
backtop|指定滚动容器；显隐阈值；平滑回顶；位置和自定义内容；滚动监听释放。
badge|数字/文本、最大值折叠、小圆点；隐藏与零值规则；颜色、偏移和自定义内容；定位与读屏提示。
border|边框宽度、样式、颜色、圆角与阴影基础规范；保留主题变量对应关系和浅/深色视觉样例。
breadcrumb|层级分隔符和分隔图标；BreadcrumbItem 链接、路由适配；末项状态和导航语义。
button|语义色、尺寸、plain/text/link/bg/round/circle/dashed；禁用、loading 与自定义图标；原生 submit/reset；自定义标签/颜色；双汉字间距；ButtonGroup 方向及继承。
calendar|月历与日期值；日期范围；自定义日期单元格和头部；上一月/下一月/今天切换；日期选择事件和实例导航。
card|头部、内容、底部；阴影策略；各区域 class/style；全局 Card 配置；长内容、无头部布局。
carousel|自动播放、间隔、暂停、循环、初始索引；水平/垂直、卡片模式；指示器、箭头和切换触发；CarouselItem；尺寸变化和定时器清理。
cascader|单选/多选、严格选择、路径值；hover/click 展开；可搜索、懒加载、禁用节点；标签折叠、清空、面包路径；CascaderPanel 和节点渲染。
checkbox|独立值与 CheckboxGroup 数组；true/false 自定义值；半选、禁用、尺寸、边框；CheckboxButton；组数量限制与表单校验。
collapse|多展开/手风琴；CollapseItem 标识、禁用、标题和图标；受控展开项；过渡、键盘操作和变化通知。
color-picker-panel|独立颜色面板；色相、饱和度、亮度、透明度；格式转换和预定义色；颜色拖动、输入和活动颜色事件。
color-picker|触发器与颜色浮层；透明度、颜色格式、预定义色；确认、清空和取消；禁用、尺寸及表单联动；面板组合与定位。
color|主题主色、成功/警告/危险/信息色；浅深色阶与文本、背景、边框色；CSS变量及暗色主题一致性。
config-provider|语言、尺寸、namespace、zIndex；键盘和无障碍开关；空值/清空值策略；Button/Card/Dialog/Link/Message/Table 默认配置；嵌套与服务上下文。
container|Container/Header/Aside/Main/Footer 组合；横纵方向推断及覆盖；header/footer 高度、aside 宽度；嵌套滚动与语义区域。
date-picker-panel|独立日期面板；日期/周/月/年及范围模式以源码支持为准；快捷项、禁用日期、联动与非联动面板；日期单元格定制。
date-picker|日期、周、月、年及范围等源模式；展示格式和绑定格式分离；禁用日期、快捷项、默认值、清空、确认；左右面板联动、键盘和国际化。
datetime-picker|DatePicker 的日期时间及范围场景；日期/时间联合约束；默认时间、秒和格式、确认取消；不是独立重造一套日期内核。
descriptions|DescriptionsItem；列数、跨列、行跨度以原API为准；横纵布局、边框、尺寸；label/content 样式及自定义标签。
dialog|受控显隐；标题/头部/底部；模态和遮罩关闭；Escape、beforeClose；宽度、居中、全屏、拖拽/缩放按源API；焦点捕获恢复、滚动锁和嵌套层级。
divider|水平/垂直；内容位置、边框样式；默认插槽；布局和主题。
drawer|四方向、尺寸、头尾内容；模态、Escape、关闭前回调；销毁策略、焦点、滚动锁、层级；方向对应动画。
dropdown|hover/click/contextmenu 等源触发；延迟、定位、拆分按钮；DropdownMenu/DropdownItem 命令、禁用、分隔；键盘游走和命令回调。
empty|默认插图、自定义图片尺寸；描述和底部动作；图片/描述插槽；暗色和紧凑布局。
form|Form/FormItem；嵌套字段路径、同步异步规则；触发时机、全量/单字段校验；重置、清理、滚动到字段；动态字段注册、初始值、错误提示及尺寸/禁用继承。
icon|尺寸、颜色和 SVG 容器；继承样式、装饰图标与有意义图标的无障碍区分；图标资源不依赖 Vue。
image|加载/失败/占位；fit、懒加载、滚动容器；预览列表、初始索引、缩放旋转、切换、关闭；ImageViewer 焦点、传送和层级。
infinite-scroll|触底距离、节流间隔、disabled/immediate；容器查找、未溢出时补载；监听/观察清理；React Hook 和包装组件承接指令能力。
input-number|步长、严格步长、精度、min/max；空值和非法值；增减按钮位置、禁用和键盘；解析与显示、变更/提交及表单校验。
input-otp|长度、密码模式、分隔符和尺寸；自动前进、退格、方向键、粘贴与输入过滤；完整输入通知、受控值和禁用状态。
input-tag|标签新增/删除/拖动按原API；触发键、最大数量、清空；折叠与溢出提示；自定义标签、IME及表单交互。
input|input/textarea、密码显隐、字数限制；clearable、前后缀/前后置内容；autosize、格式化和解析；IME、光标保持、focus/blur/select/clear；原生属性透传。
layout|Row/Col 的24栅格；gutter、span/offset/push/pull；xs/sm/md/lg/xl 响应式；flex 对齐与自定义标签。
link|语义色、下划线、禁用、图标；href/target 等原生链接属性；全局默认值和键盘语义。
loading|区域及全屏遮罩；锁定、文字、图标/SVG、背景；延迟关闭与实例更新；Loading 包装组件、Hook 和服务三种适配；多实例与焦点影响。
mention|触发前缀、分隔字符、光标定位；过滤/远程建议、加载；键盘选择、插入文本；自定义选项与标签；输入法和异步结果顺序。
menu|横向/纵向、展开/折叠、唯一展开；MenuItem/SubMenu/MenuItemGroup；激活路径、禁用、路由适配；溢出、弹出层、键盘与选择/打开/关闭事件。
message-box|alert/confirm/prompt；按钮文本与类型、输入校验；Promise resolve/reject 与 action 回调；关闭/取消区分；异步确认、loading、焦点和滚动锁。
message|语义类型、图标、duration、关闭；多位置堆叠、偏移、分组、重复计数；可更新/关闭实例、closeAll；App Provider 上下文与定时器。
notification|标题、正文、图标、类型；四角位置/源支持位置、偏移和堆叠；duration、关闭/点击；实例控制、Provider 绑定和销毁。
page-header|返回按钮、图标、标题、内容和额外操作；面包屑；返回事件及窄屏布局。
pagination|页码/页大小/总数；布局配置、简洁模式、背景、小尺寸；跳页、页大小选择、单页隐藏；currentPage/pageSize 双受控通道及事件顺序。
popconfirm|确认气泡；标题、描述/图标、按钮文案；确认/取消事件、actions 渲染；触发和浮层配置、隐藏策略、焦点处理。
popover|多触发方式、受控显隐；标题和内容/自定义内容；宽度、定位、延迟、虚拟触发；复用 Tooltip 内核而保持原API差异。
progress|线形/圆形/仪表盘；百分比、状态、色段/颜色回调；线宽、文字内显/隐藏/格式化；条纹与动画按源API；边界值和无障碍。
radio|Radio/RadioGroup/RadioButton；值类型、禁用、尺寸和边框；组内选中、键盘和 label/value 兼容；表单联动。
rate|星级、半星、最大值、只读、清空；颜色和图标阈值；文本与分数；hover/change、键盘和 aria 值。
result|success/warning/info/error；图标、标题、副标题和额外操作；自定义区域及主题。
scrollbar|自定义水平/垂直滚动条；高度、最大高度、native、always；拖拽和轨道点击；scrollTo/setScrollTop/setScrollLeft/update；滚动/边界事件和 ResizeObserver 清理。
segmented|标量/对象选项、label/value/disabled；尺寸、方向、块级；自定义渲染；选中背景动画、键盘与表单。
select-v2|虚拟选项列表；单选/多选、过滤/远程、创建、分组、禁用；标签折叠、清空、回显和自定义选项；滚动定位与普通Select边界分开验收。
select|Option/OptionGroup；单选/多选、过滤/远程、创建；对象值键、禁用、清空、标签折叠；头尾/空/加载/标签/选中项定制；键盘高亮、面板滚动和表单。
skeleton|Skeleton/SkeletonItem；行数、图形变体、动画；loading 切换、节流和模板；尺寸稳定避免布局跳动。
slider|单值/范围、min/max/step、刻度/停顿点；输入框、Tooltip、竖向；拖动和键盘、input/change 区分；禁用与非法范围。
space|方向、尺寸、换行、对齐、填充比例；分隔符；间距和子节点处理。
splitter|SplitterPanel；横向/纵向、受控尺寸、min/max、可折叠；实时/延迟拖拽按源API；拖拽事件、窗口重排和键盘分隔条。
statistic|数字格式、精度、分组/小数符、前后缀、标题；自定义 formatter；Countdown 截止时间、格式、变化和完成事件、定时清理。
steps|Steps/Step；横纵方向、active、状态、间距、居中和simple；图标、标题、描述；流程只展示不擅自增加业务跳转。
switch|开关值、active/inactive 自定义值和文字/图标；内联提示、尺寸、颜色；beforeChange 异步拦截、loading、禁用和表单。
table-v2|固定/动态行高虚拟表格；columns/data/rowKey；固定列、宽高、缓存与滚动；树展开、排序状态、自定义行/单元格/头部；AutoResizer；不自动宣称拥有Table全部功能。
table|TableColumn；列分组、宽度、固定列、表头；选择/保留选择、排序/自定义排序、筛选；展开/树/懒加载；合计/合并单元格、索引；溢出提示、滚动、布局和全套实例方法。
tabs|Tabs/TabPane；受控激活、位置、风格、拉伸；可新增/删除、beforeLeave 异步拦截；延迟内容挂载；溢出导航、键盘与自定义标签。
tag|类型、尺寸、effect、round；可关闭、关闭图标和过渡；点击/关闭事件；标签内容与主题。
text|尺寸、语义色、自定义标签；截断和多行截断；内联文本和样式继承。
time-picker|单时间/范围；展示/值格式、默认时间；小时/分钟/秒禁用函数；箭头/滚轮选择、确认清空；键盘与表单。
time-select|start/end/step 生成选项；min/max 排除；格式和可编辑/可清空；选择联动、禁用和空集合。
timeline|TimelineItem；时间戳位置、类型/尺寸/颜色/图标和空心节点；自定义内容、顺序及长文本。
tooltip|hover/focus/click/contextmenu 等源触发；受控显隐、延迟；位置、碰撞、箭头、主题、HTML和内容；virtualTrigger、teleport、persistent；Escape与可交互浮层。
tour|Tour/TourStep；目标查找、遮罩镂空、高亮、滚动到目标；步骤受控切换、前后按钮、关闭和完成；丢失目标和动态布局；焦点与层级。
transfer|左右列表、搜索、勾选和批量移动；禁用、字段映射、顺序、标题和计数；自定义条目、底部内容；值和选中状态事件。
tree-select|选择器与树组合；单选/多选、checkbox、严格选择；过滤/懒加载、缓存标签、默认展开；树节点和选中值双向协调。
tree-v2|固定高度虚拟树；数据字段映射、展开、选中、复选/半选；过滤、滚动到节点、键盘；与普通Tree的懒加载/拖拽差异按原API验收。
tree|树数据、节点键、字段映射；展开/选中/勾选/半选、严格关联；懒加载、过滤、自定义节点；拖拽约束、节点增删改查和实例方法。
typography|字体族、字号、行高、字重、正文/辅助文字层级；排版示例和CSS变量；跨平台字体差异登记。
upload|文件选择/拖放、accept、多选和数量限制；文件列表与卡片/图片；自动/手动提交、beforeUpload/beforeRemove；进度成功失败、取消重试、自定义请求、凭据/headers/data；预览删除和实例方法。
watermark|文字/多行/图片水印；字体、间距、旋转、偏移、层级；高清canvas与异步图片；尺寸观察和卸载清理；抗篡改行为按源码核实，不承诺安全防伪。
`;
const features = Object.fromEntries(featuresText.trim().split('\n').map(line => {const i=line.indexOf('|'); return [line.slice(0,i),line.slice(i+1)];}));
const alias = {
 'anchor-link':'anchor','avatar-group':'avatar','button-group':'button','breadcrumb-item':'breadcrumb',
 'carousel-item':'carousel','cascader-panel':'cascader','checkbox-button':'checkbox','checkbox-group':'checkbox','check-tag':'tag',
 'col':'layout','row':'layout','collapse-item':'collapse','collapse-transition':'collapse', 'countdown':'statistic',
 'aside':'container','header':'container','footer':'container','main':'container','descriptions-item':'descriptions',
 'dropdown-item':'dropdown','dropdown-menu':'dropdown','form-item':'form','image-viewer':'image',
 'menu-item':'menu','menu-item-group':'menu','sub-menu':'menu','option':'select','option-group':'select',
 'radio-button':'radio','radio-group':'radio','skeleton-item':'skeleton','splitter-panel':'splitter',
 'step':'steps','table-column':'table','tab-pane':'tabs','timeline-item':'timeline','tour-step':'tour',
};
const internals = {
 base:'基础样式入口、全局变量、reset与过渡；区分全量及按需引入，避免重复注入。',
 collection:'集合注册/注销、DOM顺序和稳定键；用于菜单、游走焦点等，StrictMode 下注册幂等。',
 'focus-trap':'焦点进入、Tab/Shift+Tab循环、Escape栈顶处理、返回触发器；嵌套、不可见/禁用元素和卸载恢复。',
 overlay:'遮罩、事件目标判断、层级、传送和模态背景；只响应有效遮罩点击，拖出弹窗不误关。',
 popper:'触发器与浮层关系、定位、箭头、事件和容器；禁止在render访问document。',
 'roving-focus-group':'单一Tab入口、方向键/Home/End游走、循环/方向设置；动态增删与禁用项跳过。',
 slot:'Vue Slot能力改为children/render props与受控属性合并；明确事件/样式/ref组合规则，不依赖Vue VNode。',
 'virtual-list':'定长/变长列表及网格、overscan、尺寸缓存、scrollTo与滚动锚定；稳定key和键盘焦点保活。',
};
const stateContracts = {
 button:'状态由实际disabled、loading、type和size共同派生。原生button状态同步到disabled和aria；自定义tag仍须由处理器阻止无效点击。loading插槽优先于loadingIcon；reset调用Form重置后发出click。按钮组和全局配置按原use-button规则逐项计算，不用统一浅合并替代。',
 form:'字段以路径注册，值、初始快照、errors、validating和touched分开；动态卸载保留/移除策略对齐来源。validate返回Promise/回调的结果、reject内容和先后顺序必须有类型。并发校验仅最新结果写入；reset恢复初始值并清错，父级受控拒绝时不得伪造重置成功。',
 input:'内部维护显示文本、组合输入标志、selection及可选非受控值。composition期间不提前格式化破坏候选词；formatter/parser与外部回写分离。清空按钮按来源决定事件序列；光标和focus实例能力保留。textarea autosize须在挂载/值/容器变化后测量并恢复样式。',
 select:'分离selectedValues、query、expanded、highlightedOption与remoteRequest。选项注册有稳定key；对象值按valueKey回显。过滤/懒载不删除已选标签；disabled选项不能被键盘提交。多选删除和clear分别产生来源语义事件；返回过期远程结果不得覆盖新查询。',
 'select-v2':'选中值与过滤结果不绑定节点挂载；虚拟滚动用稳定项键与尺寸缓存。键盘高亮项滚动入可视区后更新aria-activedescendant；卸载选项不能使已选标签丢失。过滤、分组、远程和自定义渲染分别按原API范围验收。',
 dialog:'presence至少含closed/opening/open/closing。beforeClose可阻止请求；开/关过渡事件按开始和完成分离。关闭时保留内容至过渡结束，destroyOnClose仅随后卸载。最上层响应Escape、滚动锁引用计数；触发器卸载后焦点回退要明确。',
 drawer:'复用模态栈和presence，但四方向分别保留尺寸和动画规则。拖动遮罩边缘不误触关闭；关闭拦截和过渡结束不同阶段；嵌套Drawer最后关闭才解锁滚动。',
 tooltip:'分离triggerOpen、controlledVisible、enterTimer、leaveTimer和presence。指针进入浮层时是否取消隐藏由来源enterable决定；快速跨越触发器与内容不闪烁。定位容器、虚拟触发器及延迟注册均可更新和销毁。',
 table:'列元数据与行数据分开管理，rowKey支撑选择/展开/树节点稳定性；selection、sort、filters、expandedRows、currentRow分别建模。列注册顺序对应DOM顺序，动态列触发布局失效。远程排序仅发事件，不能额外改排业务数据；保留选择、跨页、懒载和合并单元格分别建对照用例。',
 'table-v2':'columns描述渲染器、宽度和固定位置；行键与可视窗口独立。滚动偏移驱动行窗口与固定区同步，动态高度使尺寸缓存失效并稳定锚点。排序仅依来源sortBy/sortState事件约定；AutoResizer单独验证零尺寸和重新可见。',
 tree:'节点索引保留原始数据引用语义、parent/children/level；checked、halfChecked、expanded、current和loading独立。严格勾选与父子关联分支分别实现；filter不破坏勾选。懒载和拖拽取消具有回滚与过期保护，实例节点查询不能泄漏React内部对象。',
 'tree-v2':'虚拟窗口只影响渲染，不影响整树勾选/半选与过滤计算；展平可视节点后保持稳定key。展开收缩使滚动锚与当前焦点可恢复；源不支持的普通Tree功能不默认加入。',
 'date-picker':'解析输入、面板候选日期、范围起止、活动端点和已提交值分开。输入失效不立即破坏上次合法值；confirm/clear/close处理按源模式分别锁定。显示format与valueFormat独立，年月周、时间及范围禁用条件交叉验证；快捷项与手动选中共用提交通道。',
 upload:'每文件有稳定uid和ready/uploading/success/fail等来源状态；校验、排队、上传、取消、删除分开。自定义请求返回能力按原契约支持abort；上传进度回写不可改父级受控fileList。beforeRemove拒绝恢复原列表；卸载取消网络和预览objectURL。',
 'message-box':'实例请求状态含open/validating/pendingAction/closing/settled。确认可异步锁定按钮，输入校验失败不resolve；取消和关闭按来源区分action。每个Promise只结算一次，关闭动画及回调顺序固定；新实例不覆盖旧实例的resolver。',
 switch:'候选值由activeValue/inactiveValue决定，beforeChange返回false或reject则保持旧值；pending期间重复操作按来源处理。受控父级未回写时显示旧值，更新通知与change不能由Effect重复触发。',
 tabs:'激活项、待切换项和面板挂载历史分开；beforeLeave异步请求用序号隔离。关闭当前项是否自动切换依来源行为，不自作主张；新增/删除/切换事件分别记录。懒加载只影响首次挂载，不能误改成每次切换销毁。',
};
const baseline = cp.execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
const dirty = cp.execFileSync('git',['status','--short'],{cwd:source,encoding:'utf8'}).trim();
const docsDir = path.join(source,'docs/en-US/component');
const docs = fs.readdirSync(docsDir).filter(x=>x.endsWith('.md')).sort();
const directories = fs.readdirSync(path.join(source,'packages/components'),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name!=='node_modules').map(e=>e.name).sort();
const publicIndex = read('packages/components/index.ts');
const manifest = {date:'2026-11-05',source,baseline,sourceWorkingTree:dirty,note:'基线为本地工作树内容；HEAD并不代表官方最新Release。目录/API采集完成不代表行为审计或复刻验收完成。',documents:[],directories:[],files:[]};
const apiRows = [];
const mdEscape = s => String(s).replace(/\r?\n/g,' ').replace(/(?<!\\)\|/g,'\\|');
const docLink = name => `../../reference/element-plus/docs/${name}.md`;
for(const filename of docs){
 const name=filename.slice(0,-3), content=read('docs/en-US/component/'+filename), lines=content.split(/\r?\n/);
 write('reference/element-plus/docs/'+filename,content);
 const headings=lines.flatMap((s,i)=>/^#{2,6} /.test(s)?[{line:i+1,title:s.replace(/^#+ /,'')}]:[]);
 const examples=[...content.matchAll(/^([a-z][\w-]*\/[\w/-]+)\s*$/gm)].map(m=>m[1]);
 let section='', header=null, sectionKind='reference'; const rows=[];
 for(let i=0;i<lines.length;i++){
  const line=lines[i];
  if(/^#+ /.test(line)){section=line.replace(/^#+ /,'');header=null; sectionKind=/events?/i.test(section)?'event':/slots?/i.test(section)?'slot':/exposes?|methods?/i.test(section)?'ref':/attributes?|props|options/i.test(section)?'prop':'reference';}
  if(!line.trim().startsWith('|')){header=null;continue;}
  const cells=line.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(x=>x.trim());
  if(cells.every(s=>/^:?-+:?$/.test(s)))continue;
  if(!header){header=cells;continue;}
  const original=cleanName(cells[0]); if(!original) continue;
  const primaryName=original.split(/\s*\/\s*v-model/)[0].trim();
  let reactName=camel(primaryName), rule='保留语义、默认值、取值范围和边界；Vue专属类型须在实现前逐项改写为React类型。';
  if(sectionKind==='event'){reactName='on'+pascal(original);rule='回调参数和触发时机与来源对齐；区别值更新、提交、关闭前后事件；原生事件冲突使用Omit与明确类型。';}
  if(sectionKind==='slot'){reactName=original==='default'?'children':'render'+pascal(original);rule='默认插槽为children；其余统一renderXxx，静态区域接受ReactNode，作用域插槽接受保持参数语义的函数。';}
  if(sectionKind==='ref'){reactName='ref.current.'+camel(original);rule='方法通过useImperativeHandle；响应式暴露值改为只读getter或订阅状态，不暴露Vue Ref。';}
  if(sectionKind==='prop'&&/^model[ -]?value$/i.test(primaryName)){reactName='value / defaultValue / onValueChange';rule='受控值由父级决定；非受控只初始化一次；onValueChange承担update:modelValue，源change独立为onChange。';}
  if(sectionKind==='prop'&&/v-model:/.test(original)){const valueName=camel(primaryName);reactName=`${valueName} / default${pascal(primaryName)} / on${pascal(primaryName)}Change`;rule='具名双向绑定独立受控通道；与源同名语义事件发生冲突时必须在类型审计裁决，不机械合并。';}
  if(sectionKind==='event'&&/^update:modelValue$/i.test(original)){reactName='onValueChange';rule='对应value请求更新；不重复触发源change。';}
  if(sectionKind==='event'&&/^update:/.test(original)){reactName='on'+pascal(original.slice(7))+'Change';rule='对应具名模型请求更新，与语义事件冲突须独立裁决。';}
  if(sectionKind==='prop'&&primaryName==='current-page'){reactName='currentPage / defaultCurrentPage / onCurrentPageChange';rule='独立受控通道；保留current-change语义事件，不能和pageSize更新合并。';}
  if(sectionKind==='prop'&&primaryName==='page-size'){reactName='pageSize / defaultPageSize / onPageSizeChange';rule='独立受控通道；页数收缩、页码调整和size-change顺序按基线测试。';}
  if(sectionKind==='prop'&&original==='class'){reactName='className';rule='保留根节点与内部节点位置，不覆盖必需状态类名。';}
  const row={id:`${name}:${i+1}`,component:name,section,kind:sectionKind,sourceLine:i+1,sourceName:original,reactName,sourceColumns:Object.fromEntries(header.map((h,j)=>[h,cells[j]??''])),rule,status:'设计草案；待类型/行为审计'};
  rows.push(row);apiRows.push(row);
 }
 const relevant=directories.filter(d=>d===name||alias[d]===name);
 const sourcePaths=relevant.map(d=>`packages/components/${d}`);
 const list=headings.filter(h=>!/(API|Attributes|Props|Events|Slots|Exposes|Methods|Type Declarations|Type declarations)/i.test(h.title));
 const spec=`# ${pascal(name)} 功能设计\n\n> 状态：功能/API设计草案，未实现、未通过等价验收。参考工作树 HEAD ${baseline}；本页原文、API默认值与原始类型见[来源快照](${docLink(name)})。来源事实和React方案分开记录；下列功能摘要须结合逐项API与测试验收，不能替代源码审计。\n\n## 1. 目标与功能点\n\n${features[name]||'组件总览入口；列举公开能力并链接对应设计，不作为独立运行时组件。'}\n\n## 2. 源文档场景清单\n\n${list.map(h=>`- [ ] ${h.title}（原文第${h.line}行）：建立React示例与对应行为/视觉断言。`).join('\n')||'- 总览页面，无独立交互。'}\n\n## 3. React 19 结构与交互契约\n\n- 主导出拟为 ${pascal(name)}，组合子组件独立命名导出；仅总览/设计基础页不导出运行时组件。不使用app.use或Vue指令。\n- 属性采用camelCase；modelValue映射value/defaultValue/onValueChange；源change映射onChange并保留原语义。涉及visible、checked、active等状态时，按照源API单独建受控通道，不强行改名为open。\n- 静态内容使用ReactNode；默认区域children；具名区域renderXxx；带参数的区域使用类型化render函数。原函数不得接收或返回Vue VNode。\n- ref作为React19属性；仅暴露来源已公开的实例能力，底层DOM与组件handle区分；state不可通过修改ref绕过受控模型。\n- 事件由用户交互或明确实例调用触发；父级回写Props不得重复触发change。IME、disabled、readonly、loading只在来源支持时适用；不得凭通用模板扩展未有API。\n- 外观复用源SCSS、变量、状态类、尺寸和动画基线；默认保留el命名空间以降低样式偏差，自定义namespace同步编译主题，禁止直接换为其他库外观。\n- 所有时序、优先级、异步取消与事件顺序以源实现/测试确认；未审计项登记，不用推测填成已兼容。\n\n## 4. 逐项 API 对照\n\n下表覆盖源文档所有表格行，包括复合子组件；section列区分所属API。原类型/参数/默认值完整保存在来源快照及api-matrix.json，不把机械命名转换视为最终TypeScript签名。特别是布尔双向绑定、Date/Dayjs、DOM事件、VNode回调、路由和Promise均需逐项完成类型审计。\n\n| 来源章节 | 类别 | 来源名称 | React拟定接口 | 来源行 |\n|---|---|---|---|---|\n${rows.map(r=>`| ${mdEscape(r.section)} | ${r.kind} | ${mdEscape(r.sourceName)} | ${mdEscape(r.reactName)} | ${r.sourceLine} |`).join('\n')}\n\n## 5. 源码、样式和示例追踪\n\n${sourcePaths.map(p=>`- [${p}](file:///${source}/${p})；目录实现清单见[源码目录覆盖](../源码目录覆盖.md)。`).join('\n')||'- 这是组合场景或基础规范；应通过下方示例反查关联组件。'}\n${examples.map(e=>`- 示例：docs/examples/${e}.vue（快照内保留；某些示例入口可能由构建插件解析，见coverage.json）。`).join('\n')}\n\n## 6. 验收设计\n\n- [ ] 逐行API确认：必填、默认值、联合类型、回调参数、方法返回值、兼容/弃用标记。\n- [ ] 将第2节每个场景转换为可运行React示例；所有命中的来源测试建立迁移对应项。\n- [ ] 相同容器、字体、数据、locale、时区、浏览器下截图对照；适用的hover/focus/active/disabled/loading/empty/error、尺寸及暗色主题全部覆盖。\n- [ ] 交互序列验证：起始状态→操作→中间状态→回调→结束状态；取消/异常/卸载后无残留。\n- [ ] 适用的键盘、焦点恢复、ARIA、触摸、缩放、长文本与窄容器验证；不向装饰组件强加交互。\n- [ ] StrictMode、SSR/hydration、重复挂载、Provider隔离和多实例测试；以全局验收规范补齐。\n\n## 7. 完成判定\n\n当前仅设计草案。全部原表格行映射、源码差异、测试迁移、视觉和可访问性结果均可追踪后，才能标记此组件等价完成。文档缺失不代表功能不存在，文档与实现冲突进入差异台账。\n`;
 const descriptions=rows.map(r=>{const c=r.sourceColumns; return `| ${mdEscape(r.id)} | ${mdEscape(r.section)} | ${mdEscape(r.sourceName)} | ${mdEscape(c.Description||c.description||'参见原表其他列')} | ${mdEscape(c.Type||c.type||'—')} | ${mdEscape(c.Default||c.default||'—')} | ${mdEscape(r.rule)} |`;}).join('\n');
 const exportNames={layout:'Row、Col',container:'Container、Header、Aside、Main、Footer','datetime-picker':'DatePicker（日期时间场景）',border:'无运行时导出；设计基础',color:'无运行时导出；设计基础',typography:'无运行时导出；设计基础',overview:'无运行时导出；总览'};
 let enhanced=spec.replace(`主导出拟为 ${pascal(name)}`,`主导出拟为 ${exportNames[name]||pascal(name)}`)
  .replace('## 3. React 19 结构与交互契约',`## 2.1 状态和实现方案\n\n${stateContracts[name]||'根据源API把展示配置、交互状态与异步/生命周期副作用分离；静态组件不创建多余store。组合子组件使用Context读取父级配置，默认值按来源各属性的优先级派生。需逐场景补齐状态转换，不把通用状态模板视为来源已存在的功能。'}\n\n## 3. React 19 结构与交互契约`)
  .replace('## 5. 源码、样式和示例追踪',`### 原始契约与迁移约束\n\n以下直接保留源表描述、类型及默认值，版本标记和其他列以api-matrix.json/原文为准。每条描述均为要保留的功能要求，规则列为React适配设计。\n\n| ID | 来源章节 | 功能/API | 原描述 | 原类型 | 原默认值 | React迁移规则 |\n|---|---|---|---|---|---|---|\n${descriptions}\n\n## 5. 源码、样式和示例追踪`)
  .replaceAll(`file:///${source}/packages/components/`, '../../reference/element-plus/packages/components/');
 // 目录链接定位到已有index.ts，避免只指向浏览器无法预览的目录。
 enhanced=enhanced.replace(/(\]\(\.\.\/\.\.\/reference\/element-plus\/packages\/components\/[^)]+)(\))/g,'$1/index.ts$2');
 enhanced=enhanced.replace(/\]\(\.\.\/\.\.\/reference\/element-plus\/packages\/components\/([^/)]+)\/index\.ts\)/g,(match,dir)=>fs.existsSync(path.join(source,'packages/components',dir,'index.ts'))?match:`](../source-components/${dir}.md)`);
 enhanced=enhanced.replace(/\]\((?:\.\/)?([a-z][\w-]*)\.html(#[^)]*)?\)/g,(match,doc,anchor)=>manifest.documents.some(d=>d.name===doc)||fs.existsSync(path.join(docsDir,doc+'.md'))?`](./${doc}.md${anchor||''})`:match);
 if(features[name]) enhanced=enhanced.replace(features[name],features[name].split('；').map(item=>`- ${item.replace(/。$/,'')}。`).join('\n'));
 if(name==='tag')enhanced=enhanced.replace('## 2. 源文档场景清单','CheckTag 是独立可勾选标签：checked/defaultChecked/onCheckedChange 请求更新，onChange保留用户切换语义；disabled阻止切换；type保留五种语义色。不能用Tag的closable事件替代它。\n\n## 2. 源文档场景清单');
 write('design/components/'+name+'.md',enhanced);
 manifest.documents.push({name,source:'docs/en-US/component/'+filename,sha256:hash(content),headings,examples,apiRows:rows.length,sourceDirectories:relevant});
}
for(const name of directories){
 const prefix='packages/components/'+name;
 const files=walk(path.join(source,prefix)).filter(f=>/\.(vue|ts|tsx|scss|json)$/.test(f));
 const inventory=files.map(file=>{const content=fs.readFileSync(file,'utf8');const relative=path.relative(source,file).replaceAll('\\','/');const record={path:relative,sha256:hash(content),bytes:Buffer.byteLength(content)}; manifest.files.push(record); return record;});
 const testFiles=files.filter(f=>f.includes('__tests__'));
 const tests=testFiles.flatMap(file=> [...fs.readFileSync(file,'utf8').matchAll(/\b(?:it|test|describe)(?:\.\w+)?\s*\(\s*(['"`])([^'"`\r\n]+)\1/g)].map(m=>({file:path.relative(source,file).replaceAll('\\','/'),label:m[2]})));
 const family=manifest.documents.some(d=>d.name===name)?name:alias[name];
 const isExported=publicIndex.includes(`'./${name}'`);
 const content=internals[name]||features[family]||features[name]||'该目录需按源码入口和上级组件确认定位；未独立文档不作为删除依据。';
 write('design/source-components/'+name+'.md',`# ${pascal(name)} 源码目录设计\n\n- 来源：${prefix}\n- 分类：${isExported?'根组件入口直接重导出（包括部分基础设施）':'子组件入口、重导出目录或内部能力；不等同公开根导出'}\n- 功能设计：${content}\n- 家族设计：${family?`[${family}](../components/${family}.md)`:'内部基础设施；公开稳定性需单独审计'}\n- React方案：${internals[name]||'通过React组合组件与Context保持来源层级；属性/事件/插槽/实例映射遵循家族设计和全局契约。'}\n- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。\n\n## 文件追踪\n\n${inventory.map(f=>`- ${f.path}（SHA256 ${f.sha256}）`).join('\n')}\n\n## 来源测试名称索引\n\n以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。\n\n${tests.map(t=>`- ${t.label} — ${t.file}`).join('\n')||'- 没有静态提取到测试标题；需要检查家族测试和共享测试。'}\n\n## 必须补齐的设计审计\n\n- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。\n- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。\n- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。\n`);
 manifest.directories.push({name,source:prefix,directRootExport:isExported,family:family||null,fileCount:inventory.length,testFiles:testFiles.length,staticTestLabels:tests.length});
}
// 保存设计证据；来源源码和示例保持原貌，仅用于参照，不视为React实现。
for(const root of ['packages/components','packages/theme-chalk/src','packages/hooks','packages/directives','packages/locale','docs/examples']){
 for(const file of walk(path.join(source,root))){
  if(!/\.(vue|tsx?|scss|json|md)$/.test(file))continue;
  const relative=path.relative(source,file).replaceAll('\\','/');
  write('reference/element-plus/'+relative,fs.readFileSync(file,'utf8'));
 }
}
write('reference/element-plus/LICENSE',read('LICENSE'));
write('design/api-matrix.json',JSON.stringify(apiRows,null,2)+'\n');
write('design/source-manifest.json',JSON.stringify(manifest,null,2)+'\n');
const examples=manifest.documents.flatMap(d=>d.examples.map(example=>({document:d.name,example,exists:fs.existsSync(path.join(source,'docs/examples',example+'.vue'))})));
const coverage={baseline,documentCount:docs.length,sourceDirectoryCount:directories.length,sourceFileCount:manifest.files.length,apiTableRows:apiRows.length,missingDocumentDesigns:docs.filter(f=>!fs.existsSync(path.join(target,'design/components',f))),missingDirectoryDesigns:directories.filter(d=>!fs.existsSync(path.join(target,'design/source-components',d+'.md'))),unmappedDirectories:manifest.directories.filter(d=>!d.family&&!internals[d.name]).map(d=>d.name),exampleReferences:examples.length,unresolvedExampleReferences:examples.filter(e=>!e.exists),runtimeTestsRun:false,visualParityVerified:false,implementationComplete:false};
write('design/coverage.json',JSON.stringify(coverage,null,2)+'\n');
write('design/组件功能设计索引.md',`# Element React 全组件功能设计索引\n\n参考本地Element Plus HEAD ${baseline}（2026-11-05）。共${docs.length}个文档主题、${directories.length}个源码组件目录、${apiRows.length}条原文表格行。数量是范围覆盖，不是实现完成率；表格行包括属性、事件、插槽、暴露方法及部分参考表。\n\n## 阅读顺序\n\n1. [React19总体架构与兼容契约](./React19总体架构与兼容契约.md)\n2. 下表各组件功能点与API映射\n3. [源码目录覆盖](./源码目录覆盖.md)，补齐子组件和内部能力\n4. [复刻验收与实施路线](./复刻验收与实施路线.md)\n5. [待审计差异台账](./待审计差异台账.md)\n\n## 全部文档主题\n\n| 主题 | 功能设计 | API表格行 |\n|---|---|---|\n${manifest.documents.map(d=>`| [${pascal(d.name)}](./components/${d.name}.md) | ${features[d.name]||'全组件导航与入口'} | ${d.apiRows} |`).join('\n')}\n\n## 追踪数据\n\n- api-matrix.json：原章节、原名称、原类型/默认值列、来源行、拟定React名称及映射规则。\n- source-manifest.json：基线、源码文件哈希、目录和文档/示例清单。\n- coverage.json：覆盖检查、未解决示例和未完成验收状态。\n- ../reference/element-plus：保留原文和源组件/主题/Hook/指令/locale/示例证据，MIT协议随附。\n`);
write('design/源码目录覆盖.md',`# 全部源码组件目录覆盖\n\n覆盖实际存在的${directories.length}个目录（排除node_modules）。根重导出不代表独立公开稳定API；子组件的最终导出需核查家族index.ts。每个目录均有功能定位、文件哈希和来源测试标题索引。\n\n| 目录 | 根入口重导出 | 家族文档 |\n|---|---|---|\n${manifest.directories.map(d=>`| [${d.name}](./source-components/${d.name}.md) | ${d.directRootExport?'是':'否'} | ${d.family?`[${d.family}](./components/${d.family}.md)`:'内部基础设施'} |`).join('\n')}\n`);
process.stdout.write(JSON.stringify(coverage,null,2));
