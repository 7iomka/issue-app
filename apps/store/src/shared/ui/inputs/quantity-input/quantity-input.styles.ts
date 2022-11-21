import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  wrapper: {
    maxWidth: 'min-content',
  },
  inner: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: `6px ${theme.spacing.xs}px`,
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,

    // '&:focus-within': {
    //   borderColor: theme.colors[theme.primaryColor][6],
    // },
  },

  control: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    // border: `1px solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3]}`,

    '&:disabled': {
      // borderColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[3],
      // opacity: 0.8,
      // backgroundColor: 'transparent',
      color: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[5],
    },
  },

  input: {
    textAlign: 'center',
    paddingRight: `3px !important`,
    paddingLeft: `3px !important`,
    backgroundColor: theme.colors.gray[3],
    height: 30,
    width: 60,
    flexShrink: 0,
    borderRadius: theme.radius.md,
    fontWeight: 400,
    margin: '0 4px',
    fontSize: theme.fontSizes.lg,
    transition: '0.3s ease-out',
    transitionProperty: 'background-color, box-shadow',
    '&:focus': {
      backgroundColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.neutral[1],
      boxShadow: `0 0 0 1px ${theme.colors.gray[5]} inset`,
    },
    '&:disabled': {
      backgroundColor: theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2],
    },
  },
}));
