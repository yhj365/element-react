import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import generatedCatalog from './generated/catalog.json';
import type { DocCatalog } from './catalog-types';
import translations from './translations.json';

type Locale = 'zh-cn' | 'en';
const catalog: DocCatalog = generatedCatalog;
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
}
const LanguageContext = createContext<LanguageContextValue>({
  locale: 'zh-cn',
  setLocale: () => {},
  t: (text) => text,
});

/** 保存阅读语言，同时更新页面语言供屏幕阅读器使用。 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() =>
    localStorage.getItem('element-react-locale') === 'en' ? 'en' : 'zh-cn',
  );
  useEffect(() => {
    localStorage.setItem('element-react-locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);
  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (text) => (locale === 'en' ? ((translations as Record<string, string>)[text] ?? text) : text),
    }),
    [locale],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** 读取当前文档语言及翻译函数。 */
export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

/** 英文文档沿用来源 API 英文描述；组件名与示例名称按元数据切换。 */
export function useCatalog(): DocCatalog {
  const { locale } = useLanguage();
  return useMemo(
    () =>
      locale === 'zh-cn'
        ? catalog
        : {
            ...catalog,
            components: catalog.components.map((component) => ({
              ...component,
              title: component.title.split(' ')[0],
              description: `Usage examples and API reference for ${component.title.split(' ')[0]}.`,
              examples: component.examples.map((example) => ({
                ...example,
                title:
                  'titleEn' in example && typeof example.titleEn === 'string'
                    ? example.titleEn
                    : example.id.replace(component.id + '-', '').replaceAll('-', ' '),
                description:
                  'descriptionEn' in example && typeof example.descriptionEn === 'string'
                    ? example.descriptionEn
                    : `Explore ${example.id.replaceAll('-', ' ')}.`,
              })),
            })),
          },
    [locale],
  );
}
