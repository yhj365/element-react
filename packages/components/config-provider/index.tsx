'use client';
import { useContext } from 'react';
import { ConfigContext } from '../../hooks';
import type { BaseProps, GlobalConfig } from '../../hooks';

export type ConfigProviderProps = GlobalConfig & Pick<BaseProps, 'children'>;
/** 嵌套配置按字段覆盖；组件配置对象保留上级未覆盖属性。 */
export function ConfigProvider({ children, ...config }: ConfigProviderProps) {
  const parent = useContext(ConfigContext);
  const defined = Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined));
  return (
    <ConfigContext
      value={{
        ...parent,
        ...defined,
        button: { ...parent.button, ...config.button },
        card: { ...parent.card, ...config.card },
        link: { ...parent.link, ...config.link },
      }}
    >
      {children}
    </ConfigContext>
  );
}
