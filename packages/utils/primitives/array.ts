import { nanoid } from 'nanoid';

export const uuid = nanoid;
/**
 * Add `id` key in each array item
 */

export const applyUuid = <T extends any[]>(
  arr: T,
  prefix: string = '',
): (T[number] & {
  id: string;
})[] => arr.map((x) => ({ id: prefix + uuid(), ...x }));
