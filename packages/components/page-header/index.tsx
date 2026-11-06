'use client';
import { useContext } from 'react';
import { ConfigContext, cx, useNamespace } from '../../hooks';
import { Icon, Glyph } from '../icon';
import { Divider } from '../presentation';
import type { BaseProps } from '../../hooks';
import type { ReactNode } from 'react';

export interface PageHeaderProps extends BaseProps {
  icon?: ReactNode;
  title?: string;
  content?: string;
  onBack?: () => void;
  renderIcon?: ReactNode;
  renderTitle?: ReactNode;
  renderContent?: ReactNode;
  renderExtra?: ReactNode;
  renderBreadcrumb?: ReactNode;
}
/** 页头提供返回动作、路径和额外操作，使用者决定返回目的地。 */
export function PageHeader({
  icon = <Glyph name="arrow" />,
  title,
  content = '',
  onBack,
  renderIcon,
  renderTitle,
  renderContent,
  renderExtra,
  renderBreadcrumb,
  children,
  className,
  ...rest
}: PageHeaderProps) {
  const ns = useNamespace('page-header');
  const config = useContext(ConfigContext);
  const heading = title ?? (config.locale === 'zh-cn' ? '返回' : 'Back');
  return (
    <div
      {...rest}
      className={cx(
        ns.b,
        ns.is('contentful', children !== undefined),
        renderBreadcrumb !== undefined && ns.m('has-breadcrumb'),
        renderExtra !== undefined && ns.m('has-extra'),
        className,
      )}
    >
      {renderBreadcrumb !== undefined && <div className={ns.e('breadcrumb')}>{renderBreadcrumb}</div>}
      <div className={ns.e('header')}>
        <div className={ns.e('left')}>
          <div
            role="button"
            tabIndex={0}
            className={ns.e('back')}
            onClick={onBack}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onBack?.();
              }
            }}
          >
            {(renderIcon ?? icon) !== null && (
              <div className={ns.e('icon')} aria-label={heading}>
                {renderIcon ?? <Icon style={{ transform: 'rotate(180deg)' }}>{icon}</Icon>}
              </div>
            )}
            <div className={ns.e('title')}>{renderTitle ?? heading}</div>
          </div>
          <Divider direction="vertical" />
          <div className={ns.e('content')}>{renderContent ?? content}</div>
        </div>
        {renderExtra !== undefined && <div className={ns.e('extra')}>{renderExtra}</div>}
      </div>
      {children !== undefined && <div className={ns.e('main')}>{children}</div>}
    </div>
  );
}
