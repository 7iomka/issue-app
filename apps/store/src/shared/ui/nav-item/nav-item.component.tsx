/* eslint-disable @typescript-eslint/ban-types */
import type { DefaultProps, MantineNumberSize, NavLinkProps, Selectors } from '@mantine/core';
import { NavLink } from '@mantine/core';
import { useRouter } from 'next/router';
import type { ReactElement, ReactNode, SVGProps } from 'react';
import { cloneElement } from 'react';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { Link } from '../link';
import type { NavItemStylesParams } from './nav-item.styles';
import { useStyles } from './nav-item.styles';

// This type will contain a union with all selectors defined in useStyles,
// in this case it will be `'root' | 'title' | 'description'`
type NavItemStylesNames = Selectors<typeof useStyles>;

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
interface NavItemProps
  extends DefaultProps<NavItemStylesNames, NavItemStylesParams>,
    Pick<NavLinkProps, 'defaultOpened' | 'children' | 'childrenOffset'> {
  url?: string;
  label: ReactNode;
  icon?: ReactElement;
  iconProps?: SVGProps<SVGSVGElement>;
  isExternal?: boolean;
  // custom
  px?: MantineNumberSize | (string & {});
  parentPx?: MantineNumberSize | (string & {});
}

// TODO: Fix effector-view defaultProps
const NavItem = createView<NavItemProps>()
  .displayName('NavItem')
  .map(
    ({
      classNames,
      styles,
      unstyled,
      url,
      isExternal,
      childrenOffset = 0,
      icon,
      iconProps = {},
      px,
      parentPx,
    }) => {
      const router = useRouter();
      const computedComponent = url ? Link : 'button';
      const isActive = url ? router.pathname === url : false;
      const { width: iconWidthFromPropsRawValue, ...restIconProps } = iconProps;
      // Static calculations just for clarity
      const iconWidthFromProps = iconWidthFromPropsRawValue
        ? parseInt(iconWidthFromPropsRawValue as string, 10)
        : null;
      const iconWidth = iconWidthFromProps ?? 20;

      const { classes } = useStyles(
        // First argument of useStyles is styles params
        {
          hasIcon: !!icon,
          iconWidth,
          childrenOffset,
          px,
          parentPx,
        },
        // Second argument is responsible for styles api integration
        { name: 'NavItem', classNames, styles, unstyled },
      );
      let requiredProps = {};

      if (computedComponent === Link) {
        requiredProps = {
          component: computedComponent,
          href: url,
          isExternal,
        };
      } else {
        requiredProps = {
          component: computedComponent,
          type: 'button',
        };
      }
      return {
        requiredProps,
        isActive,
        classes,
        iconWidth,
        restIconProps,
        childrenOffset,
      };
    },
  )
  .memo()
  .view(
    ({
      url,
      icon,
      restIconProps,
      defaultOpened = true,
      isExternal,
      children,
      requiredProps,
      isActive,
      classes,
      iconWidth,
      childrenOffset = 0,
      parentPx,
      ...rest
    }) => (
      <NavLink
        icon={
          !!icon &&
          cloneElement(icon, {
            width: iconWidth,
            ...restIconProps,
          })
        }
        rightSection={children && <Icon.ChevronRight width="10" />}
        defaultOpened={defaultOpened}
        active={isActive}
        classNames={classes}
        childrenOffset={childrenOffset}
        {...requiredProps}
        {...rest}
      >
        {children}
      </NavLink>
    ),
  ).Memo;

export type { NavItemProps };
export { NavItem };
