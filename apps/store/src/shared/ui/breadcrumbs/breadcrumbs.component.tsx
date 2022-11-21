import { createElement } from 'react';
import clsx from 'clsx';
import { Box } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { Link } from '../link';
import styles from './breadcrumbs.module.scss';

type BreadcrumbItemProps = {
  title?: string;
  icon?: keyof typeof Icon;
  href?: string;
  isActive?: boolean;
};

interface BreadcrumbsProps {
  className?: string;
  items: BreadcrumbItemProps[];
  separator?: 'arrow' | 'obliqueLine';
  linkComponent?: any;
}

const Breadcrumbs = createView<BreadcrumbsProps>()
  .displayName('Breadcrumbs')
  .memo()
  .view(({ className, items = [], separator = 'arrow', linkComponent = Link }) => (
    <div className={clsx(styles.Breadcrumbs_container, 'c-breadcrumbs-container', className)}>
      <ul
        itemScope
        itemType="http://schema.org/BreadcrumbList"
        className={clsx(styles.Breadcrumbs, 'c-breadcrumbs', styles[`separator_${separator}`])}
      >
        {items.length &&
          items.map((item, i) => (
            <li
              key={i}
              itemProp="itemListElement"
              itemScope
              itemType="http://schema.org/ListItem"
              className={clsx(styles.Breadcrumbs__Item, 'c-breadcrumbs__item')}
            >
              {item.href ? (
                <Box
                  component={linkComponent}
                  href={item.href}
                  itemProp="item"
                  className={clsx(styles.Breadcrumbs__ItemLink, 'c-breadcrumbs__item-link c-link')}
                >
                  {item.icon &&
                    createElement(Icon[item.icon], {
                      className: clsx(styles.Breadcrumbs__ItemIcon, 'c-breadcrumbs__item-icon'),
                      width: '1em',
                      height: '1em',
                      focusable: false,
                      'aria-hidden': true,
                    })}
                  {item.title && (
                    <span
                      className={clsx(styles.Breadcrumbs__Text, 'c-breadcrumbs__text')}
                      itemProp="name"
                    >
                      {item.title}
                    </span>
                  )}
                </Box>
              ) : (
                <span
                  className={clsx(styles.Breadcrumbs__ItemPage, 'c-breadcrumbs__item-page')}
                  itemProp="name"
                >
                  {item.title}
                </span>
              )}
              <meta itemProp="position" content={`${i + 1}`} />
            </li>
          ))}
      </ul>
    </div>
  )).Memo;

export type { BreadcrumbItemProps, BreadcrumbsProps };
export { Breadcrumbs };
