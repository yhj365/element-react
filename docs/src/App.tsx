import { memo, useEffect, useState } from 'react';
import { ConfigProvider } from 'element-react';
import type { ComponentDoc, ApiDoc } from './catalog-types';
import { LanguageProvider, useLanguage, useCatalog } from './i18n';
import { SourceCode } from './SourceCode';
import type { ComponentType } from 'react';

const exampleModules = import.meta.glob<{ default: ComponentType }>('../examples/*.tsx', { eager: true });
// 大数据示例只响应自身状态和组件上下文变化，展开源码不会重新归一化万条选项。
const examples = Object.fromEntries(
  Object.entries(exampleModules).map(([path, module]) => [path, { default: memo(module.default) }]),
);
const categories = ['基础', '布局', '表单', '数据展示', '导航', '反馈', '配置'];

/** 路由变化回到文档顶部，同时允许浏览器后退恢复组件位置。 */
function useRoute(): string {
  const [route, setRoute] = useState(() => window.location.hash.slice(2) || 'components/button');
  useEffect(() => {
    /** 监听hash而不是在每个链接上重复维护路由。 */ function update(): void {
      setRoute(window.location.hash.slice(2) || 'components/button');
      window.scrollTo({ top: 0 });
    }
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

/** API展示与追踪均来自已通过当前源码指纹校验的目录。 */
function ApiTable({ rows, evidence = false }: { rows: ApiDoc[]; evidence?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="table-scroll">
      <table className="api-table">
        <thead>
          <tr>
            <th>{evidence ? t('完成项') : t('名称')}</th>
            <th>{evidence ? t('来源位置') : t('说明')}</th>
            <th>{evidence ? t('测试证据') : t('来源类型')}</th>
            <th>{evidence ? t('状态') : t('默认值')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <code>{row.reactName}</code>
                <small>
                  {row.section} · {row.sourceName}
                </small>
              </td>
              <td>
                {evidence ? (
                  <span className="source-position">
                    {row.sourcePath}:{row.sourceLine}
                  </span>
                ) : (
                  row.description
                )}
              </td>
              <td>
                {evidence ? (
                  <details>
                    <summary>
                      {row.tests?.length ?? 0} {t('项关联测试')}
                    </summary>
                    {row.tests?.map((test) => (
                      <p className="evidence-text" key={test.title}>
                        {test.file}
                        <br />
                        {test.title.split(' [')[0]}
                      </p>
                    ))}
                  </details>
                ) : (
                  <code className="type-code">{row.type || '—'}</code>
                )}
              </td>
              <td>
                {evidence ? (
                  <span className="verified">
                    <span>✓</span>
                    {t('已验证')}
                  </span>
                ) : (
                  <code>{row.defaultValue}</code>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 预览与源码读取同一示例文件，避免代码和演示脱节。 */
function Demo({ example }: { example: ComponentDoc['examples'][number] }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const Example = examples[`../examples/${example.id}.tsx`]?.default;
  /** 复制失败时保留可选择源码，不伪报复制成功。 */
  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
    } catch {
      setCopied(false);
      setExpanded(true);
    }
  }
  return (
    <section className="demo-section" id={example.id}>
      <h2>
        {example.title}
        <a
          className="heading-anchor"
          href={`#${example.id}`}
          onClick={(event) => {
            event.preventDefault();
            document.getElementById(example.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          #
        </a>
      </h2>
      <p className="section-description">{example.description}</p>
      <div className="demo-frame">
        <div className="demo-preview">
          {Example ? <Example /> : <p role="alert">{t('示例加载失败，请刷新页面。')}</p>}
        </div>
        <div className="demo-toolbar">
          <span>
            <span className="status-dot" />
            {t('可运行示例')}
          </span>
          <div>
            <button
              type="button"
              aria-label={t('复制示例代码')}
              title={t('复制代码')}
              onClick={() => {
                void copy();
              }}
            >
              {copied ? t('已复制') : t('复制')}
            </button>
            <button
              type="button"
              aria-label={expanded ? t('收起代码') : t('查看代码')}
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              <span aria-hidden="true">{'</>'}</span> {expanded ? t('收起代码') : t('查看代码')}
            </button>
          </div>
        </div>
        {expanded && (
          <>
            <SourceCode code={example.code} />
            <button type="button" className="code-collapse" onClick={() => setExpanded(false)}>
              {t('收起代码')}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

/** 已验证的源API按章节分组，未完成项不会出现在任何使用表格中。 */
function ComponentPage({ component }: { component: ComponentDoc }) {
  const { t } = useLanguage();
  const catalog = useCatalog();
  const [tab, setTab] = useState<'usage' | 'evidence'>('usage');
  const sections = [...new Set(component.api.map((row) => row.section))];
  return (
    <>
      <div className="doc-breadcrumb">
        {t('组件')}
        <span>/</span> {t(component.category)}
      </div>
      <div className="title-row">
        <h1>{component.title}</h1>
        <span className="version-pill">React 19</span>
      </div>
      <p className="doc-lead">{component.description}</p>
      <div className="doc-meta">
        <span className="verified">
          <span>✓</span> {component.api.length} {t('项 API 已验证')}
        </span>
        <span>
          {component.examples.length} {t('个可运行示例')}
        </span>
        <span>MIT</span>
      </div>
      <div className="doc-tabs">
        <button type="button" className={tab === 'usage' ? 'active' : ''} onClick={() => setTab('usage')}>
          {t('使用文档')}
        </button>
        <button
          type="button"
          className={tab === 'evidence' ? 'active' : ''}
          onClick={() => setTab('evidence')}
        >
          {t('完成记录与来源对照')}
          <span>{component.api.length}</span>
        </button>
      </div>
      {tab === 'usage' ? (
        <>
          {component.examples.map((example) => (
            <Demo key={example.id} example={example} />
          ))}
          <section id="api">
            <h2>API</h2>
            <p className="section-description">
              {t(
                'React 接口采用驼峰命名；具名内容使用 render 函数或 ReactNode。来源类型用于核对 Element Plus 契约，准确的 React 类型以组件导出声明为准。',
              )}
            </p>
            {sections.map((section) => (
              <section key={section} className="api-section">
                <h3>{section}</h3>
                <ApiTable rows={component.api.filter((row) => row.section === section)} />
              </section>
            ))}
          </section>
          {component.features.length > 0 && (
            <section id="features">
              <h2>{t('已验证功能点')}</h2>
              <ul className="feature-list">
                {component.features.map((feature) => (
                  <li key={feature.id}>
                    <span>✓</span>
                    {feature.title}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <section id="evidence">
          <h2>{t('逐项完成记录')}</h2>
          <p className="section-description">
            {t(
              '每个完成项都关联了实现、通过的回归测试和可运行示例。完整迁移范围与尚待开发内容保存在项目 TASKS.md 中。',
            )}
          </p>
          <p className="implementation-path">
            {t('实现：')}
            <code>{component.implementation}</code>
          </p>
          <ApiTable rows={component.api} evidence />
          <div className="source-note">
            {t('来源基线')}
            <code>{catalog.status.baseline.slice(0, 12)}</code> · {t('当前源码指纹')}{' '}
            <code>{catalog.status.fingerprint.slice(0, 12)}</code>
          </div>
        </section>
      )}
    </>
  );
}

/** 总览只展示已完成细项，完整待办保留在仓库而非使用文档。 */
function VerificationPage() {
  const { t } = useLanguage();
  const catalog = useCatalog();
  const [search, setSearch] = useState('');
  const rows = catalog.components
    .flatMap((component) => component.api.map((row) => ({ ...row, component: component.title })))
    .filter((row) =>
      `${row.component} ${row.reactName} ${row.sourceName}`.toLowerCase().includes(search.toLowerCase()),
    );
  return (
    <>
      <div className="doc-breadcrumb">
        {t('项目')}
        <span>/</span>
        {t('完成记录')}
      </div>
      <h1>{t('可核查的完成记录')}</h1>
      <p className="doc-lead">{t('从 Element Plus 来源到 React 实现、测试和示例，逐项追踪。')}</p>
      <div className="verification-stats">
        <div>
          <strong>{catalog.status.documentedComponents}</strong>
          <span>{t('组件文档主题')}</span>
        </div>
        <div>
          <strong>{catalog.status.completedApi}</strong>
          <span>{t('已验证 API 项')}</span>
        </div>
        <div>
          <strong>{catalog.status.completedExamples}</strong>
          <span>{t('可运行 React 示例')}</span>
        </div>
        <div>
          <strong>{catalog.status.unitTests}</strong>
          <span>{t('通过的单元测试')}</span>
        </div>
      </div>
      <div className="source-note">
        {t('这里显示的是已验证范围。来源包含')} {catalog.status.totalApi}{' '}
        {t('条 API；整体功能与视觉等价验收仍在推进。')}
      </div>
      <label className="verification-search">
        {t('检索完成项')}
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('组件名、React 属性或来源名称')}
        />
      </label>
      <p className="result-count">
        {rows.length} {t('条完成记录')}
      </p>
      <ApiTable rows={rows} evidence />
    </>
  );
}

/** 文档站保留Element系的蓝色、密度与导航方式，窄屏使用可收起目录。 */
function AppContent() {
  const { t, locale, setLocale } = useLanguage();
  const catalog = useCatalog();
  const route = useRoute();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('element-react-dark') === 'true');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('element-react-dark', String(dark));
  }, [dark]);
  useEffect(() => {
    setMobileOpen(false);
  }, [route]);
  const component = catalog.components.find((item) => `components/${item.id}` === route);
  const verification = route === 'verification';
  const visible = catalog.components.filter((item) =>
    `${item.title} ${item.category}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <ConfigProvider locale={locale}>
      <a className="skip-link" href="#main-content">
        {t('跳至文档正文')}
      </a>
      <header className="site-header">
        <a href="#/components/button" className="brand">
          <span className="brand-symbol">
            E<span>R</span>
          </span>
          <span>
            Element <b>React</b>
          </span>
        </a>
        <nav aria-label={t('主导航')} className="top-nav">
          <a className={!verification ? 'active' : ''} href="#/components/button">
            {t('组件')}
          </a>
          <a className={verification ? 'active' : ''} href="#/verification">
            {t('完成记录')}
          </a>
          <a href="https://element-plus.org/" target="_blank" rel="noreferrer">
            Element Plus <span aria-hidden="true">↗</span>
          </a>
          <select
            aria-label={locale === 'en' ? 'Language' : '语言'}
            value={locale}
            onChange={(event) => setLocale(event.target.value === 'en' ? 'en' : 'zh-cn')}
          >
            <option value="zh-cn">简体中文</option>
            <option value="en">English</option>
          </select>
          <span className="nav-divider" />
          <button
            type="button"
            className="theme-toggle"
            aria-label={dark ? t('切换浅色主题') : t('切换深色主题')}
            onClick={() => setDark(!dark)}
          >
            {dark ? '☀' : '☾'}
          </button>
        </nav>
        <button
          type="button"
          className="mobile-menu"
          aria-label={t('切换组件目录')}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </header>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label={t('关闭组件目录')}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label={t('组件目录')}>
        <div className="sidebar-heading">
          {t('组件文档')}
          <span>{catalog.components.length}</span>
        </div>
        <label className="sidebar-search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label={t('搜索组件')}
            placeholder={t('搜索组件…')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <kbd>⌕</kbd>
        </label>
        {visible.length === 0 && <p className="no-results">{t('没有匹配的组件')}</p>}
        {categories.map((category) => {
          const items = visible.filter((item) => item.category === category);
          return (
            items.length > 0 && (
              <section className="nav-group" key={category}>
                <h2>{t(category)}</h2>
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={`#/components/${item.id}`}
                    className={component?.id === item.id && !verification ? 'active' : ''}
                  >
                    <span>{item.title}</span>
                  </a>
                ))}
              </section>
            )
          );
        })}
        <div className="sidebar-footer">
          <span className="status-dot" /> React 19 · TypeScript
          <br />
          <small>{t('文档随验证结果更新')}</small>
        </div>
      </aside>
      <div className="page-shell">
        <main id="main-content" className="doc-content" key={component?.id ?? route}>
          {verification ? (
            <VerificationPage />
          ) : component ? (
            <ComponentPage key={component.id} component={component} />
          ) : (
            <section className="not-found">
              <h1>{t('未找到文档')}</h1>
              <p>{t('请从目录选择已提供的组件说明。')}</p>
              <a href="#/components/button">{t('返回按钮文档')}</a>
            </section>
          )}
          <footer className="doc-footer">
            <span>Element React</span>
            <span>{t('基于 Element Plus 设计 · MIT License')}</span>
          </footer>
        </main>
        {component && !verification && (
          <aside className="page-toc" aria-label={t('本页目录')}>
            <p>{t('本页目录')}</p>
            {component.examples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => document.getElementById(example.id)?.scrollIntoView({ behavior: 'smooth' })}
              >
                {example.title}
              </button>
            ))}
            <button
              type="button"
              onClick={() => document.getElementById('api')?.scrollIntoView({ behavior: 'smooth' })}
            >
              API
            </button>
            <div className="toc-note">
              <span>✓</span>
              {t('示例可直接操作')}
              <br />
              {t('属性可逐项核查')}
            </div>
          </aside>
        )}
      </div>
    </ConfigProvider>
  );
}

/** 文档语言上下文在路由切换期间保持稳定。 */
export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
