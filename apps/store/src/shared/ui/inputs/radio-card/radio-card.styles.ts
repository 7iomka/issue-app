import { createStyles } from '@mantine/core';
import { getReadableColor, getRootBackgroundColor, getRootColor } from '@/shared/config';

interface RadioCardParams {
  checked?: boolean;
}

export const useRadioStyles = createStyles((theme, { checked }: RadioCardParams) => ({
  radioWrapper: {
    position: 'relative',
    backgroundColor: '#fff', // color scheme?
    '&:not(:hover)': !checked && {
      color: theme.fn.rgba(getRootColor(theme), 0.4),
      borderColor: theme.fn.rgba(getRootColor(theme), 0.2),
      backgroundColor: getRootBackgroundColor(theme),
    },
    '&': checked && {
      backgroundColor: theme.fn.primaryColor(),
      color: getReadableColor({ color: theme.fn.primaryColor() }), // getThemeColor({ theme, color: colorProp })
    },
  },
  radio: {
    // margin: '-1px',
    // padding: '0',
    // width: '1px',
    // height: '1px',
    // overflow: 'hidden',
    // clip: ['rect(0 0 0 0)', 'rect(0, 0, 0, 0)'],
    // position: 'absolute',
  },
}));
