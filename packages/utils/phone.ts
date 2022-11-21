export const getFormattedTel = (str: string): string => {
  return str.replace(/[^0-9]/g, '').replace('+7', '8');
};
