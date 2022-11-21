export const capitalizeFirst = (str: string): string =>
  `${str.substring(0, 1).toUpperCase()}${str.substring(1)}`;

function isAlpha(ch: string) {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

function isNumber(ch: string) {
  return ch >= '0' && ch <= '9';
}

// Ex:
//
// toKebabCase("HelloWorld") -> "hello-world"
// toKebabCase("HelloWorld2") -> "hello-world-2"
// toKebabCase("HelloWorld22") -> "hello-world-22"
//
export function toKebabCase(title: string) {
  let ret = '';
  for (let x = 0; x < title.length; x++) {
    let ch = title[x]!;
    if (x && ch >= 'A' && ch <= 'Z') {
      ret += '-' + ch.toLowerCase();
      continue;
    } else if (x && isNumber(ch)) {
      // Must be the start of a sequence:
      if (x - 1 >= 0 && isAlpha(title[x - 1]!)) {
        ret += '-' + ch;
        continue;
      }
    }
    ret += ch.toLowerCase();
  }
  return ret;
}
