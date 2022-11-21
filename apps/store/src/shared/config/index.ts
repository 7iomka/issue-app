import type { MantineColor, MantineTheme } from '@mantine/core';
import { mostReadable } from '@ctrl/tinycolor';

type GetReadableColor = (p: {
  color: string;
  colorVariants?: string[];
  isEnabled?: boolean;
}) => string;

/**
 * Get readable color from passed variants
 */
export const getReadableColor: GetReadableColor = ({
  color,
  colorVariants = ['#fff', '#000'],
  isEnabled = true,
}) => {
  if (isEnabled) {
    return mostReadable(color, colorVariants, {
      level: 'AA',
      size: 'large',
    })?.toHexString() as string;
  }
  return color;
};

type Shade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface MantinePrimaryShade {
  light: Shade;
  dark: Shade;
}

/**
 * Get theme color from passed string ('primary', 'primary.5')
 */
export const getThemeColor = ({
  theme,
  color = theme.primaryColor,
  shade = theme.primaryShade,
}: {
  theme: MantineTheme;
  color?: MantineColor;
  shade?: Shade | MantinePrimaryShade;
}) => {
  const colorProp = color;
  const colorArr = colorProp.split('.');
  const colorValue = colorArr[0];
  let shadeValue = shade;
  if (colorArr.length > 1) {
    shadeValue = Number(colorArr[1]) as Shade;
  }
  return theme.colors[colorValue][shadeValue as number];
};

/**
 * Get root text color from theme
 */
export const getRootColor = (theme: MantineTheme) =>
  theme.colorScheme === 'dark' ? '#fff' : '#121212';
/**
 * Get root background-color from theme
 */
export const getRootBackgroundColor = (theme: MantineTheme) =>
  theme.colorScheme === 'dark' ? '#000' : '#fff';
