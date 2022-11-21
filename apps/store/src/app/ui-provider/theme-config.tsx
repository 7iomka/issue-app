import type {
  BadgeStylesParams,
  ButtonStylesParams,
  CheckboxProps,
  CheckboxStylesParams,
  CSSObject,
  GroupStylesParams,
  InputStylesParams,
  ListStylesParams,
  MantineTheme,
  MantineThemeOverride,
  ModalStylesParams,
  NotificationStylesParams,
  PaginationStylesParams,
  RadioStylesParams,
  SegmentedControlStylesParams,
  StackStylesParams,
  StepStylesParams,
  TabsStylesParams,
} from '@mantine/core';
import type { CarouselStylesParams } from '@mantine/carousel/lib/Carousel.styles';
import {
  spacing as spacingConfig,
  radiusWithoutUnit,
  fontSizes,
  fontFamily,
  inputSizes,
} from '@steklo24/config/theme';
import { Icon } from '@steklo24/icons';
import { breakpoints } from '@/shared/ui';
import { getReadableColor, getThemeColor } from '@/shared/config';
import { mantineColors } from './ui-provider.lib';

type FloatingInputStylesParams = InputStylesParams & { floating: boolean };

const buttonStyles = (theme: MantineTheme, params: ButtonStylesParams) => {
  let textColor;
  let hoverStyles = {};
  let borderColor;

  switch (params.variant) {
    case 'filled': {
      const colorProp = params.color || theme.primaryColor;
      if (colorProp === 'secondary') {
        textColor = '#fff'; // secondary color by design force white text color
      } else {
        textColor = getReadableColor({
          color: getThemeColor({ theme, color: colorProp }),
        });
      }

      // hoverStyles = {
      //   backgroundColor: getThemeColor({ theme, color: params.color, shade: 6 }),
      // };
      break;
    }

    case 'outline':
      textColor = params.color || 'inherit';
      borderColor = params.color || 'currentColor';
      hoverStyles = {
        borderColor: getThemeColor({ theme, color: params.color }),
        backgroundColor: theme.fn.rgba(
          getThemeColor({ theme, color: params.color || theme.primaryColor, shade: 2 }),
          0.7,
        ),
      };
      break;
    case 'subtle':
      textColor = 'inherit';
      hoverStyles = {
        backgroundColor: theme.colors.neutral[1],
      };
      break;

    default:
      break;
  }

  return {
    root: {
      fontWeight: 400,
      borderRadius: params.radius !== undefined ? params.radius : theme.radius.xl,
      color: textColor,
      borderColor,
      '&:hover': hoverStyles,
      '&[data-disabled]': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
        color: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[6],
      },
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
  };
};

const CheckboxIcon: CheckboxProps['icon'] = ({ indeterminate, className }) =>
  indeterminate ? (
    <Icon.CheckIndeterminate className={className} />
  ) : (
    <Icon.Check className={className} />
  );

const themeConfig: MantineThemeOverride = {
  colorScheme: 'light',
  breakpoints,
  fontSizes,
  fontFamily: fontFamily.default,
  colors: mantineColors,
  primaryColor: 'primary' as keyof typeof mantineColors,
  radius: radiusWithoutUnit,
  defaultRadius: 'md' as keyof typeof radiusWithoutUnit,
  primaryShade: 5, // note: always use number, or correct code call with getReadableColor to support obj
  spacing: spacingConfig.withoutUnit,
  components: {
    Group: {
      styles: (theme: MantineTheme, { spacing }: GroupStylesParams) => {
        return {
          root: {
            gap: 0,
            marginRight: -theme.fn.size({ size: spacing, sizes: theme.spacing }),
            marginBottom: -theme.fn.size({ size: spacing, sizes: theme.spacing }),
            '> *': {
              marginRight: theme.fn.size({ size: spacing, sizes: theme.spacing }),
              marginBottom: theme.fn.size({ size: spacing, sizes: theme.spacing }),
            },
          },
        };
      },
    },
    Stack: {
      styles: (theme: MantineTheme, { spacing }: StackStylesParams) => {
        return {
          root: {
            gap: 0,
            marginBottom: -theme.fn.size({ size: spacing, sizes: theme.spacing }),
            '> *': {
              marginBottom: theme.fn.size({ size: spacing, sizes: theme.spacing }),
            },
          },
        };
      },
    },
    Button: {
      styles: buttonStyles,
      defaultProps: {
        // uppercase: true,
        size: 'sm', // <<- Breaking change
      },
    },
    CloseButton: {
      defaultProps: {
        color: 'gray.9',
      },
    },
    Checkbox: {
      styles: (theme: MantineTheme, params: CheckboxStylesParams) => ({
        icon: {
          '&, *:checked + &': {
            // https://github.com/mantinedev/mantine/issues/2653
            color: `${getReadableColor({
              color: getThemeColor({ theme, color: params.color }),
            })} !important`,
          },
        },
        input: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
          }`,

          '&:hover:not(:checked):not(:disabled)': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
          },
        },
      }),
      defaultProps: {
        icon: CheckboxIcon,
      },
    },
    Radio: {
      styles: (theme: MantineTheme, params: RadioStylesParams) => ({
        icon: {
          color: getReadableColor({
            color: getThemeColor({ theme, color: params.color }),
          }),
          width: '30%',
          height: '30%',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          margin: 'auto',
        },
        radio: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
          border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
          }`,

          '&:hover:not(:checked):not(:disabled)': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
          },
        },
      }),
    },
    Drawer: {
      styles: (theme: MantineTheme) => ({
        closeButton: {
          color: theme.colors.gray[9],
        },
        title: {
          fontWeight: 700,
          textTransform: 'uppercase',
        },
      }),
    },
    Pagination: {
      styles: (theme: MantineTheme, params: PaginationStylesParams) => ({
        item: {
          '&:disabled': {
            opacity: 0.4,
            color: 'inherit',
          },
          // applies styles to active item
          '&[data-active]': {
            '&, &:hover': {
              color: getReadableColor({
                color: getThemeColor({ theme, color: params.color }),
              }),
            },
          },
        },
      }),
    },
    Select: {
      styles: (theme: MantineTheme) => ({
        label: {
          fontWeight: 400,
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
        item: {
          // applies styles to selected item
          '&[data-selected]': {
            '&, &:hover': {
              color: getReadableColor({
                color: theme.fn.primaryColor(),
              }),
            },
          },
        },
      }),
    },
    SegmentedControl: {
      styles: (theme: MantineTheme, { color, shouldAnimate }: SegmentedControlStylesParams) => {
        // const colors = theme.fn.variant({ variant: 'filled', color });
        return {
          label: {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[9],
          },
          labelActive: {
            '&, &:hover': {
              color: getReadableColor({
                color: color in theme.colors ? getThemeColor({ theme, color }) : color,
              }),
            },
          },
          controlActive: {
            backgroundColor: shouldAnimate
              ? color in theme.colors
                ? getThemeColor({ theme, color })
                : color
              : undefined,
          },

          active: {
            backgroundColor: color in theme.colors ? getThemeColor({ theme, color }) : color,
          },
        };
      },
    },
    InputWrapper: {
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
      styles: {
        error: {
          padding: '4px 0',
        },
      },
    },
    // Use own inputSizes for all types of inputs
    // At the moment it's not possible to override internal sizes
    Input: {
      styles: (
        theme,
        {
          size,
          multiline,
          variant,
          rightSectionWidth,
          withRightSection,
        }: FloatingInputStylesParams,
      ) => {
        const sizeStyles =
          variant === 'default' || variant === 'filled'
            ? {
                minHeight: theme.fn.size({ size, sizes: inputSizes }),
                paddingLeft: theme.fn.size({ size, sizes: inputSizes }) / 2,
                paddingRight: withRightSection
                  ? rightSectionWidth
                  : theme.fn.size({ size, sizes: inputSizes }) / 2,
              }
            : null;

        return {
          input: {
            fontWeight: 700,
            height: multiline
              ? variant === 'unstyled'
                ? undefined
                : 'auto'
              : theme.fn.size({ size, sizes: inputSizes }),
            lineHeight: multiline
              ? theme.lineHeight
              : `${theme.fn.size({ size, sizes: inputSizes }) - 2}px`,
            ...sizeStyles,
            '&:disabled': {
              opacity: 1,
            },
            '&::placeholder': {
              color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : '#adb5bd',
            },
          },
        };
      },
    },
    PasswordInput: {
      styles: (theme) => ({
        innerInput: {
          paddingLeft: 'inherit',
          height: 'inherit',
          paddingTop: 'inherit',
        },
        visibilityToggle: {
          color: theme.colors.gray[6],
        },
        rightSection: {
          width: 36,
        },
      }),
    },
    Loader: {
      defaultProps: {
        color: 'currentColor',
      },
    },
    Tabs: {
      styles: (theme, { variant, color }: TabsStylesParams) => {
        const filledScheme = theme.fn.variant({ color, variant: 'filled' });
        let tabStyles = {};

        if (variant === 'pills') {
          tabStyles = {
            '&[data-active]': {
              color:
                filledScheme.background &&
                getReadableColor({
                  color: filledScheme.background,
                }),
            },
          };
        }

        return {
          tab: tabStyles,
        };
      },
    },
    Modal: {
      styles: (theme, { fullScreen }: ModalStylesParams) => {
        let modalStyles: Record<string, CSSObject> = {
          inner: {
            overflowX: 'hidden',
            padding: fullScreen ? 0 : `${theme.spacing.sm}px`,
          },
          header: {},
          body: {},
          close: {},
        };

        if (fullScreen) {
          modalStyles = {
            ...modalStyles,
            header: {
              ...modalStyles.header,
              position: 'absolute',
              zIndex: 999,
              left: '0',
              right: '0',
              top: '0',
              backgroundColor: 'transparent',
              margin: 0,
            },
            body: {
              ...modalStyles.body,
              width: '100%',
              height: '100%',
            },
            close: {
              ...modalStyles.close,
              position: 'absolute',
              top: '20px',
              right: '20px',
              height: '40px',
              minHeight: '40px',
              width: '40px',
              minWidth: '40px',
              backgroundColor: '#fff',
              color: 'rgba(0, 0, 0, 0.7)',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
              '> svg': {
                width: '30px',
                height: '30px',
              },
            },
          };
        }

        return modalStyles;
      },
    },
    Carousel: {
      defaultProps: {
        controlSize: 30,
        previousControlIcon: <Icon.ChevronLeft />,
        nextControlIcon: <Icon.ChevronRight />,
      },
      styles: (theme, { orientation }: CarouselStylesParams) => {
        return {
          root: {
            overflow: 'visible', // prevent cut navigation outside root
          },
          viewport: {
            overflow: 'hidden', // instead overflow only viewport with slides
          },
          control: {
            '> svg': {
              transform: orientation === 'vertical' ? 'rotate(90deg)' : undefined,
            },
          },
        };
      },
    },
    List: {
      styles: (theme, params: ListStylesParams) => {
        return {
          root: {
            listStylePosition: 'inside',
          },
          item: {
            whiteSpace: 'nowrap',
          },
          itemWrapper: {
            display: 'inline-flex',
            whiteSpace: 'normal',
            flexDirection: 'column',
          },
        };
      },
    },

    Menu: {
      styles: (theme) => {
        return {
          item: {
            fontSize: 'inherit',
          },
        };
      },
    },
    Badge: {
      defaultProps: {
        size: 'md',
      },
      styles: (theme, { variant, color }: BadgeStylesParams) => {
        const filledScheme = theme.fn.variant({ color, variant: 'filled' });
        return {
          root: {
            color:
              variant === 'filled' && filledScheme.background
                ? color === 'danger'
                  ? 'white'
                  : getReadableColor({
                      color: filledScheme.background,
                    })
                : undefined,
            fontWeight: 400,
          },
        };
      },
    },
    Stepper: {
      defaultProps: {
        completedIcon: null,
      },
      styles: (theme, { size, iconSize, color, orientation }: StepStylesParams) => {
        // const filledScheme = theme.fn.variant({ color, variant: 'filled' });
        const colors = theme.fn.variant({ variant: 'filled', color });
        const iconSizes = {
          xs: 28,
          sm: 30,
          md: 42,
          lg: 48,
          xl: 52,
        };
        const _iconSize = iconSize || theme.fn.size({ size, sizes: iconSizes });
        const separatorDistanceFromIcon = theme.spacing.xs / 2;
        return {
          step: {
            minHeight:
              orientation === 'vertical'
                ? `calc(${_iconSize}px + ${theme.spacing.xl}px + ${separatorDistanceFromIcon}px)`
                : undefined,
          },
          verticalSeparator: {
            top: `${_iconSize + separatorDistanceFromIcon}px`,
            left: `${_iconSize / 2}px`,
          },
          stepLabel: {
            fontWeight: 400,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            '[data-progress] &, [data-completed] &': {
              color: 'inherit',
            },
          },
          stepIcon: {
            height: _iconSize,
            width: _iconSize,
            minWidth: _iconSize,
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.neutral[1],
            border: `1px solid ${
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.neutral[1]
            }`,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),

            '&[data-progress]': {
              borderColor: colors.background,
              backgroundColor: colors.background,
              color: getReadableColor({
                color: colors.background!,
              }),
            },

            '&[data-completed]': {
              backgroundColor: colors.background,
              borderColor: colors.background,
              color: getReadableColor({
                color: colors.background!,
              }),
            },
          },
          stepCompletedIcon: {
            color: getReadableColor({
              color: colors.background!,
            }),
            width: '1em',
            height: '1em',
            margin: 'auto',
          },
          stepBody: {
            marginTop:
              orientation === 'vertical'
                ? _iconSize > theme.fn.size({ size, sizes: theme.fontSizes }) * 4
                  ? _iconSize / 4
                  : _iconSize / 12
                : undefined,
          },
        };
      },
    },
    Notification: {
      styles: (theme, { withTitle }: NotificationStylesParams) => {
        return {
          closeButton: {
            color: theme.colors.danger,
          },
          title: {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
          },
          description: {
            color: withTitle
              ? theme.colorScheme === 'dark'
                ? theme.colors.dark[2]
                : theme.black
              : theme.colorScheme === 'dark'
              ? theme.colors.dark[0]
              : theme.black,
          },
        };
      },
    },
  },
};

export { themeConfig };
