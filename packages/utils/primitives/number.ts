export const round = (value: number, precision: number): number => {
  const power = Math.pow(10, precision);
  return Math.round(value * power + Number.EPSILON * power) / power;
};

export const leftPad = (source: string, targetLength: number, padChar: string = ' '): string => {
  if (source.length < targetLength) {
    var padding: string = '';
    while (padding.length + source.length < targetLength) padding += padChar;
    return padding + source;
  }
  return source;
};

export const padNumber = (num: number, length: number = 2): string => {
  return leftPad(String(num), length, '0');
};
