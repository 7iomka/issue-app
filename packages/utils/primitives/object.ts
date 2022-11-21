import { GenericObject } from '@steklo24/types';

export const isEmptyObject = (value: GenericObject) => {
  return Object.keys(value).length === 0 && value.constructor === Object;
};

export const flattenObject = (oldObject: GenericObject) => {
  const newObject = {};

  flattenHelper(oldObject, newObject, '');

  return newObject;

  function flattenHelper(
    currentObject: GenericObject<any>,
    newObj: GenericObject,
    previousKeyName: any,
  ) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in currentObject) {
      const value = currentObject[key];

      if (value.constructor !== Object) {
        if (previousKeyName == null || previousKeyName === '') {
          newObj[key] = value;
        } else if (key == null || key === '') {
          newObj[previousKeyName] = value;
        } else {
          newObj[`${previousKeyName}.${key}`] = value;
        }
      } else if (previousKeyName == null || previousKeyName === '') {
        flattenHelper(value, newObj, key);
      } else {
        flattenHelper(value, newObj, `${previousKeyName}.${key}`);
      }
    }
  }
};

export const shallowEqual = (a: GenericObject, b: GenericObject) => {
  if (!a || !b) return false;
  return !Object.entries(a).some(([key, value]) => b[key] !== value);
};

export function getObjectFromList<T extends string | number | symbol>(
  list: ReadonlyArray<T>,
): Record<T, T>;
export function getObjectFromList<T extends string | number | symbol, U>(
  list: ReadonlyArray<T>,
  callback: (val: T) => U,
): Record<T, U>;
export function getObjectFromList<T extends string | number | symbol, U>(
  list: ReadonlyArray<T>,
  callback?: (val: T) => U,
): Record<T, T | U> {
  return list.reduce((obj, val) => {
    obj[val] = callback ? callback(val) : val;

    return obj;
  }, {} as Record<T, T | U>);
}
