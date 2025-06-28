import { StorageValue } from './storageSchema';
import { Maybe } from '../types';

const TestKey = 'TEST_KEY';
const TestValue = 'TEST_VALUE';

export function isStorageSupported(storage: Maybe<Storage>): boolean {
  if (!storage)
    return false;

  try {
    storage.setItem(TestKey, TestValue);
    const val = storage.getItem(TestKey);
    storage.removeItem(TestKey);

    return val === TestValue;
  } catch (err) {
    return false;
  }
}

export function toStorageValue(val: StorageValue | null, encode = true): string {
  if (typeof val === 'string' || !encode)
    return val ? val.toString() : '';

  return JSON.stringify(val);
}

export function fromStorageValue(val: string | null, decode = true): StorageValue | null {
  if (!decode || !val)
    return val;

  try {
    return JSON.parse(val);
  } catch (err) {
    return val;
  }
}